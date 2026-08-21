const STORAGE_PREFIX = "lms_g2_en_level_progress_";

export type Grade2EnglishLevelProgress = {
  /** True when Level 1 activities are all completed with full marks. */
  level1Complete: boolean;
  level1CompletedAt?: string;
  /** True when Level 2 activities are all completed with full marks. */
  level2Complete: boolean;
  level2CompletedAt?: string;
  /** True when Level 3 activities are all completed with full marks. */
  level3Complete: boolean;
  level3CompletedAt?: string;
  /** True when Level 4 activities are all completed with full marks. */
  level4Complete: boolean;
  level4CompletedAt?: string;
};

function storageKey(studentId: number): string {
  return `${STORAGE_PREFIX}${studentId}`;
}

export function getGrade2EnglishLevelProgress(studentId: number): Grade2EnglishLevelProgress {
  if (typeof window === "undefined" || !studentId) {
    return { level1Complete: false, level2Complete: false, level3Complete: false, level4Complete: false };
  }
  try {
    const raw = localStorage.getItem(storageKey(studentId));
    if (!raw) {
      return { level1Complete: false, level2Complete: false, level3Complete: false, level4Complete: false };
    }
    const parsed = JSON.parse(raw) as Grade2EnglishLevelProgress;
    return {
      level1Complete: Boolean(parsed.level1Complete),
      level1CompletedAt: parsed.level1CompletedAt,
      level2Complete: Boolean(parsed.level2Complete),
      level2CompletedAt: parsed.level2CompletedAt,
      level3Complete: Boolean(parsed.level3Complete),
      level3CompletedAt: parsed.level3CompletedAt,
      level4Complete: Boolean(parsed.level4Complete),
      level4CompletedAt: parsed.level4CompletedAt
    };
  } catch {
    return { level1Complete: false, level2Complete: false, level3Complete: false, level4Complete: false };
  }
}

function writeProgress(studentId: number, next: Grade2EnglishLevelProgress): Grade2EnglishLevelProgress {
  if (typeof window !== "undefined" && studentId) {
    localStorage.setItem(storageKey(studentId), JSON.stringify(next));
  }
  return next;
}

export function markGrade2EnglishLevel1Complete(studentId: number): Grade2EnglishLevelProgress {
  const prev = getGrade2EnglishLevelProgress(studentId);
  return writeProgress(studentId, {
    ...prev,
    level1Complete: true,
    level1CompletedAt: prev.level1CompletedAt || new Date().toISOString()
  });
}

export function markGrade2EnglishLevel2Complete(studentId: number): Grade2EnglishLevelProgress {
  const prev = getGrade2EnglishLevelProgress(studentId);
  return writeProgress(studentId, {
    ...prev,
    level1Complete: true,
    level1CompletedAt: prev.level1CompletedAt || new Date().toISOString(),
    level2Complete: true,
    level2CompletedAt: prev.level2CompletedAt || new Date().toISOString()
  });
}

export function markGrade2EnglishLevel3Complete(studentId: number): Grade2EnglishLevelProgress {
  const prev = getGrade2EnglishLevelProgress(studentId);
  return writeProgress(studentId, {
    ...prev,
    level1Complete: true,
    level1CompletedAt: prev.level1CompletedAt || new Date().toISOString(),
    level2Complete: true,
    level2CompletedAt: prev.level2CompletedAt || new Date().toISOString(),
    level3Complete: true,
    level3CompletedAt: prev.level3CompletedAt || new Date().toISOString()
  });
}

export function markGrade2EnglishLevel4Complete(studentId: number): Grade2EnglishLevelProgress {
  const prev = getGrade2EnglishLevelProgress(studentId);
  return writeProgress(studentId, {
    ...prev,
    level1Complete: true,
    level1CompletedAt: prev.level1CompletedAt || new Date().toISOString(),
    level2Complete: true,
    level2CompletedAt: prev.level2CompletedAt || new Date().toISOString(),
    level3Complete: true,
    level3CompletedAt: prev.level3CompletedAt || new Date().toISOString(),
    level4Complete: true,
    level4CompletedAt: prev.level4CompletedAt || new Date().toISOString()
  });
}

/** Aptitude-eligible levels open immediately; otherwise prior level completion unlocks the next. */
export function isGrade2EnglishLevelUnlocked(
  studentId: number,
  level: number,
  aptitudeEligibleLevels: number[]
): boolean {
  if (level <= 0) return false;
  if (aptitudeEligibleLevels.includes(level) || aptitudeEligibleLevels.some((l) => l >= level)) {
    return true;
  }
  const progress = getGrade2EnglishLevelProgress(studentId);
  if (level === 1) return false;
  if (level === 2) return progress.level1Complete;
  if (level === 3) return progress.level2Complete;
  if (level === 4) return progress.level3Complete;
  return false;
}
