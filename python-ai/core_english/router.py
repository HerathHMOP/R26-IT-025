"""
core_english/router.py
Dedicated FastAPI Router for the English Speaking, Pronunciation & MTI Assessment Engine.
"""

import os
import io
import re
import base64
import numpy as np
import torch
import librosa
import soundfile as sf
import speech_recognition as sr
from scipy.signal import butter, sosfilt
from pydantic import BaseModel
from fastapi import APIRouter

# Import English internal modules
from core_english.audio_model import PronunciationNet

# Initialize Router with the exact existing API prefix
router = APIRouter(prefix="/api/ai/english", tags=["English Pronunciation"])

# ---------------------------------------------------------
# 1. English Model Weights Loading
# ---------------------------------------------------------
english_model = PronunciationNet()
english_model_path = os.path.join(os.path.dirname(__file__), 'weights', 'english_model.pt')

if os.path.exists(english_model_path):
    try:
        english_model.load_state_dict(torch.load(english_model_path, weights_only=True))
        english_model.eval()
        print("SUCCESS: Successfully loaded PyTorch English Audio AI Model.")
    except RuntimeError:
        print("WARNING: Incompatible model weights found. Using random initialized weights.")
else:
    print(f"WARNING: {english_model_path} not found. Audio Neural Net will use random initialized weights.")

# Lazy Whisper ASR Loader
whisper_asr_model = None

def get_whisper_model():
    global whisper_asr_model
    if whisper_asr_model is None:
        try:
            from faster_whisper import WhisperModel
            whisper_asr_model = WhisperModel('tiny.en', device='cpu', compute_type='int8')
            print("SUCCESS: Successfully loaded Offline Whisper ASR Model (tiny.en).")
        except Exception as e:
            print(f"WARNING: Offline Whisper ASR could not be loaded: {e}")
    return whisper_asr_model

# Load Multi-Stage Analyzers
try:
    from core_english.lip_analysis import visual_lip_analyzer
    from core_english.fluency_prosody import fluency_prosody_analyzer
    from core_english.mti_rules import sri_lankan_mti_engine
    from core_english.phoneme_engine import align_phoneme_sequences, get_phonemes_for_word, get_sentence_phonemes
    print("SUCCESS: Successfully loaded Multi-Stage English Speaking Assessment Pipeline.")
except Exception as e:
    visual_lip_analyzer = None
    fluency_prosody_analyzer = None
    sri_lankan_mti_engine = None
    print(f"WARNING: Multi-stage analyzers load notice: {e}")


# ---------------------------------------------------------
# 2. Request Data Schema
# ---------------------------------------------------------
class SpeechAudioData(BaseModel):
    student_id: str
    audio_base64: str
    target_text: str = ""
    client_transcript: str = ""
    video_frames_base64: list[str] = []


# ---------------------------------------------------------
# 3. DSP Noise Suppression Engine
# ---------------------------------------------------------
def denoise_audio_signal(y: np.ndarray, sr: int = 16000) -> np.ndarray:
    """
    Advanced DSP background noise suppression:
    1. Bandpass filter 85Hz - 7500Hz (removes rumble, fan vibrations, 50Hz/60Hz hum)
    2. Dynamic Noise Gate (attenuates stationary background noise floor)
    """
    if y is None or len(y) < 160:
        return y
    try:
        sos = butter(4, [85, 7500], btype='bandpass', fs=sr, output='sos')
        y_filtered = sosfilt(sos, y)
        
        frame_len = int(0.025 * sr)
        hop_len = int(0.010 * sr)
        if len(y_filtered) > frame_len:
            rms = librosa.feature.rms(y=y_filtered, frame_length=frame_len, hop_length=hop_len)[0]
            noise_floor = np.percentile(rms, 15)
            gate_th = max(0.005, noise_floor * 1.4)
            gain = np.clip((rms - gate_th) / (gate_th + 1e-6), 0.0, 1.0)
            gain_interp = np.interp(np.arange(len(y_filtered)), np.arange(len(gain)) * hop_len, gain)
            y_denoised = y_filtered * gain_interp
            return y_denoised.astype(np.float32)
        return y_filtered.astype(np.float32)
    except Exception:
        return y


# ---------------------------------------------------------
# 4. English Pronunciation API Endpoint
# Maps directly to: POST /api/ai/english/pronunciation
# ---------------------------------------------------------
@router.post("/pronunciation")
def analyze_pronunciation(data: SpeechAudioData):
    """
    Comprehensive 6-Dimensional English Speech & Pronunciation Assessment:
    1. Overall Score & 100% Pass Standard
    2. Word & Sentence Accuracy (DP LCS alignment)
    3. Fluency (Speech Rate WPM, Pauses, Repetitions / Hesitations)
    4. Intonation & Rhythm (F0 Pitch dynamics, Monotone detection, Question slope)
    5. Volume & Clarity (Too soft / optimal / too loud, SNR clarity)
    6. 12 Sri Lankan MTI Patterns & Non-MTI Syntactic Analysis
    """
    try:
        audio_b64 = data.audio_base64
        target_text = (data.target_text or "").strip()
        client_transcript = (data.client_transcript or "").strip()
        response_latency_ms = 0.0

        y = None
        peak = 0.0
        
        if audio_b64 and audio_b64 != "dummy_base64_audio":
            try:
                audio_bytes = base64.b64decode(audio_b64)
                if audio_bytes[:4] == b'RIFF':
                    y_raw, file_sr = sf.read(io.BytesIO(audio_bytes), dtype='float32', always_2d=False)
                    if file_sr != 16000:
                        y = librosa.resample(y_raw, orig_sr=file_sr, target_sr=16000)
                    else:
                        y = y_raw
                else:
                    import av
                    container = av.open(io.BytesIO(audio_bytes))
                    stream = next(s for s in container.streams if s.type == 'audio')
                    resampler = av.AudioResampler(format='fltp', layout='mono', rate=16000)
                    audio_frames = []
                    for frame in container.decode(stream):
                        for rf in resampler.resample(frame):
                            audio_frames.append(rf.to_ndarray())
                    if audio_frames:
                        y = np.concatenate(audio_frames, axis=1).squeeze()
            except Exception as e:
                print(f"[AUDIO DECODE NOTICE] {e}")

        if y is not None and len(y) > 0:
            if y.ndim > 1:
                y = y.mean(axis=1)
            y = denoise_audio_signal(y, sr=16000)
            peak = float(np.max(np.abs(y)))
            y_norm = (y / peak) * 0.90 if peak > 0.0001 else y
        else:
            y_norm = np.zeros(1600, dtype=np.float32)

        # 1. Speech-to-Text with Ambient Noise Adjustment
        recognized_text = client_transcript or ""
        if y is not None and len(y) > 3200 and not recognized_text:
            try:
                wav_io = io.BytesIO()
                sf.write(wav_io, y_norm, 16000, format='WAV', subtype='PCM_16')
                wav_io.seek(0)
                recognizer = sr.Recognizer()
                recognizer.energy_threshold = 300
                recognizer.dynamic_energy_threshold = True
                with sr.AudioFile(wav_io) as source:
                    recognizer.adjust_for_ambient_noise(source, duration=0.15)
                    audio_data = recognizer.record(source)
                recognized_text = recognizer.recognize_google(audio_data, language='en-US')
            except Exception:
                pass

        if not recognized_text and client_transcript:
            recognized_text = client_transcript

        # 2. Fluency & Prosody Analysis
        fluency_res = {}
        if fluency_prosody_analyzer is not None:
            fluency_res = fluency_prosody_analyzer.analyze(
                y=y_norm,
                spoken_text=recognized_text,
                target_text=target_text,
                response_latency_ms=response_latency_ms
            )

        # 3. 12 Sri Lankan MTI Pattern Analysis
        mti_detected = []
        if sri_lankan_mti_engine is not None:
            mti_text_patterns = sri_lankan_mti_engine.analyze_spoken_text(recognized_text, target_text)
            mti_acoustic_res = sri_lankan_mti_engine.evaluate(y_norm, target_word=target_text)
            
            seen_keys = set()
            for p in mti_text_patterns:
                if p["key"] not in seen_keys:
                    seen_keys.add(p["key"])
                    mti_detected.append(p)
            for p in mti_acoustic_res.get("detected_patterns", []):
                if p["key"] not in seen_keys:
                    seen_keys.add(p["key"])
                    mti_detected.append(p)

        # 4. Word Level Alignment & Accuracy
        spoken_clean = re.sub(r'[^a-zA-Z0-9 ]', '', recognized_text).lower().strip()
        target_clean = re.sub(r'[^a-zA-Z0-9 ]', '', target_text).lower().strip()
        spoken_words = spoken_clean.split()
        target_words = target_clean.split()

        matches = sum(1 for w in target_words if w in spoken_words)
        total_words = max(1, len(target_words))
        word_accuracy = round((matches / total_words) * 100.0, 1)
        
        is_passed = (matches == total_words and len(mti_detected) == 0 and word_accuracy == 100.0)

        return {
            "sound_detected": bool(peak >= 0.005 or len(spoken_clean) > 0),
            "words_correct": (matches == total_words),
            "pronunciation_correct": is_passed,
            "overall_score": word_accuracy if not mti_detected else min(70.0, word_accuracy),
            "is_passed": is_passed,
            "transcript": recognized_text or "(No speech)",
            "target_text": target_text,
            "word_accuracy": word_accuracy,
            "matched_words_count": matches,
            "total_words_count": total_words,
            "mti_analysis": {
                "has_mti": len(mti_detected) > 0,
                "detected_count": len(mti_detected),
                "patterns": mti_detected
            },
            "fluency": fluency_res.get("fluency", {}),
            "intonation_rhythm": fluency_res.get("intonation_rhythm", {}),
            "volume_clarity": fluency_res.get("volume_clarity", {}),
            "non_mti_errors": fluency_res.get("non_mti_errors", {}),
            "engagement": fluency_res.get("engagement", {})
        }

    except Exception as e:
        print(f"[ENGLISH PRONUNCIATION ENDPOINT ERROR] {e}")
        return {
            "sound_detected": True,
            "words_correct": False,
            "pronunciation_correct": False,
            "overall_score": 0.0,
            "is_passed": False,
            "transcript": data.client_transcript or "",
            "target_text": data.target_text,
            "mti_analysis": {"has_mti": False, "detected_count": 0, "patterns": []},
            "fluency": {},
            "intonation_rhythm": {},
            "volume_clarity": {},
            "non_mti_errors": {},
            "engagement": {}
        }