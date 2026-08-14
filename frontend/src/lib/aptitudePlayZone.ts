/** Shared “play zone” chrome for student aptitude pages (copy + main class names). */

export type AptitudeUiLang = "english" | "sinhala";

export type PlayZoneSubject = "maths" | "english" | "sinhala" | "general";

export function playZoneMainClassNames(lang: AptitudeUiLang | null): string {
  const parts = ["dashboard-screen", "kid-aptitude-play"];
  if (lang === "sinhala") parts.push("aptitude-lang-sinhala");
  else parts.push("aptitude-lang-english");
  return parts.join(" ");
}

export function playZoneEyebrow(subject: PlayZoneSubject, lang: AptitudeUiLang): string {
  const si = lang === "sinhala";
  if (subject === "maths") return si ? "ගණිත සෙල්ලං කලාපය" : "Maths play zone";
  if (subject === "english") return si ? "ඉංග්‍රීසි සෙල්ලං කලාපය" : "English play zone";
  if (subject === "sinhala") return si ? "සිංහල සෙල්ලං කලාපය" : "Sinhala play zone";
  return si ? "සෙල්ලං කලාපය" : "Play zone";
}

export function playZoneTitle(grade: 0 | 2 | 3 | 4, subject: PlayZoneSubject, lang: AptitudeUiLang): string {
  const si = lang === "sinhala";
  if (grade === 0) return si ? "පාසලට පෙර — සාමාන්‍ය" : "Pre-school — general";
  const g = si ? `ශ්‍රේණිය ${grade}` : `Grade ${grade}`;
  if (subject === "maths") return si ? `${g} — ගණිතය` : `${g} maths`;
  if (subject === "english") return si ? `${g} — ඉංග්‍රීසි` : `${g} English`;
  if (subject === "sinhala") return si ? `${g} — සිංහල` : `${g} Sinhala`;
  return si ? `${g}` : `${g} general`;
}

export function playZoneKicker(subject: PlayZoneSubject, lang: AptitudeUiLang): string {
  const si = lang === "sinhala";
  if (subject === "maths") {
    return si
      ? "අද අපි ගණිතය සමඟ සෙල්ලම් කරමු — එක එක පියවර සම්පූර්ණ කරන්න!"
      : "Let's play with maths — tap your answers and fill every step!";
  }
  if (subject === "english") {
    return si
      ? "ඉංග්‍රීසි වචන, පින්තූර සහ පිළිතුරු සමඟ සෙල්ලම් කරමු!"
      : "Let's play with English — tap, match, and complete each part!";
  }
  if (subject === "sinhala") {
    return si
      ? "සිංහල අකුරු සහ වචන සමඟ සෙල්ලම් කරමු!"
      : "Let's enjoy Sinhala letters and words!";
  }
  return si
    ? "පුංචි පුංචි ක්‍රියාකාරකම් — එක එක එකතු කරන්න!"
    : "Little games — tap and complete each part!";
}

export function playZoneSubtitle(studentName: string, stepCount: number, lang: AptitudeUiLang | null): string {
  if (lang === "sinhala") return `${studentName} · ${stepCount} සතුටු පියවර · සිංහල`;
  if (lang === "english") return `${studentName} · ${stepCount} fun steps · English`;
  return `${studentName} · ${stepCount} fun steps`;
}

export function playZoneFinishedLine(done: number, total: number, lang: AptitudeUiLang | null): string {
  if (lang === "sinhala") return `සම්පූර්ණ කළා: ${done}/${total}`;
  return `Finished: ${done}/${total}`;
}

export function playZoneDoneTitle(lang: AptitudeUiLang | null): string {
  if (lang === "sinhala") return "ඔබ ලස්සනට කළා!";
  return "You did it!";
}

export function playZoneSubmitLabel(submitting: boolean, lang: AptitudeUiLang | null): string {
  if (submitting) return lang === "sinhala" ? "යවමින්…" : "Sending…";
  return lang === "sinhala" ? "මගේ පිළිතුරු යවන්න 🚀" : "Send my answers 🚀";
}

export function playZoneStepBadge(currentIndex: number, total: number, lang: AptitudeUiLang | null): string {
  if (lang === "sinhala") return `පියවර ${currentIndex + 1} / ${total}`;
  return `Step ${currentIndex + 1} of ${total}`;
}
