export type AptitudeUiLang = "english" | "sinhala";

export function playZoneMainClassNames(lang: AptitudeUiLang) {
  return lang === "sinhala"
    ? "kid-aptitude-page kid-aptitude-sinhala"
    : "kid-aptitude-page kid-aptitude-english";
}

export function playZoneDoneTitle(lang: AptitudeUiLang) {
  return lang === "sinhala" ? "කාර්යය අවසන් කරන ලදි" : "Test Completed";
}

export function playZoneEyebrow(subject: string, lang: AptitudeUiLang) {
  return lang === "sinhala" ? `${subject} විභාගය` : `${subject} aptitude session`;
}

export function playZoneFinishedLine(answered: number, total: number, lang: AptitudeUiLang) {
  return lang === "sinhala"
    ? `ඔබ විසින් ${answered} ක්‍රියාකාරකම් වලින් ${total} ක් සම්පූර්ණ කළා.`
    : `You have completed ${answered} of ${total} activities.`;
}

export function playZoneKicker(subject: string, lang: AptitudeUiLang) {
  return lang === "sinhala" ? `ඔබගේ ${subject} මනාපය` : `Get ready for ${subject}`;
}

export function playZoneSubtitle(studentName: string, total: number, lang: AptitudeUiLang) {
  return lang === "sinhala"
    ? `${studentName} සඳහා ${total} ක්‍රියාකාරකම් සකස් කර ඇත.`
    : `${studentName}, complete ${total} activities to finish.`;
}

export function playZoneTitle(grade: number, subject: string, lang: AptitudeUiLang) {
  return lang === "sinhala" ? `${grade} ශ්‍රේණියේ ${subject}` : `Grade ${grade} ${subject}`;
}

export function playZoneStepBadge(currentIndex: number, total: number, lang: AptitudeUiLang) {
  return lang === "sinhala"
    ? `පියවර ${currentIndex + 1} / ${total}`
    : `Step ${currentIndex + 1} of ${total}`;
}

export function playZoneSubmitLabel(submitting: boolean, lang: AptitudeUiLang) {
  return submitting ? (lang === "sinhala" ? "ලබමින්..." : "Submitting...") : lang === "sinhala" ? "හදුනාගන්න" : "Submit";
}
