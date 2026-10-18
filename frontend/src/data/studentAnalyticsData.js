const API_BASE = '/api/analytics';

export const CORE_SUBJECTS = {
  math: {
    name: 'Mathematics',
    shortName: 'Math',
    icon: '➗',
    categories: [
      { code: 'M1', name: 'Numbers' },
      { code: 'M2', name: 'Addition and subtraction' },
      { code: 'M3', name: 'Multiplication and division' },
      { code: 'M4', name: 'Measurement and shapes' }
    ]
  },
  sinhala: {
    name: 'Sinhala',
    shortName: 'Sinhala',
    icon: 'අ',
    categories: [
      { code: 'C1', name: 'Letters and meanings' },
      { code: 'C2', name: 'Opposite words' },
      { code: 'C3', name: 'Expressions' },
      { code: 'C4', name: 'Grammar' },
      { code: 'C5', name: 'Reading and comprehension' }
    ]
  },
  english: {
    name: 'English',
    shortName: 'English',
    icon: '🔤',
    categories: [
      { code: 'E1', name: 'Phoneme clarity' },
      { code: 'E2', name: 'Pronunciation' },
      { code: 'E3', name: 'Word stress and intonation' },
      { code: 'E4', name: 'Speaking fluency' }
    ]
  },
  preschool: {
    name: 'Pre-school',
    shortName: 'Pre-school',
    icon: '🎨',
    categories: [
      { code: 'P1', name: 'Line tracing and fine motor' },
      { code: 'P2', name: 'Coloring' },
      { code: 'P3', name: 'Story drawing' }
    ]
  }
};

const request = async (path) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Analytics request failed (${response.status})`);
  }
  return response.json();
};

export const fetchStudentsAnalyticsFromApi = async () => {
  const result = await request('/students');
  return Array.isArray(result.students) ? result.students : [];
};

export const fetchStudentAnalyticsFromApi = async (studentId) => {
  if (!studentId) return null;
  const result = await request(`/student/${encodeURIComponent(studentId)}`);
  return result.student || null;
};

export const createBlankStudentProfile = (studentId, name, grade) => ({
  studentId: studentId || name || 'student',
  name: name || 'Student',
  grade: grade || 'Grade 4',
  overallAverage: 0,
  totalExercises: 0,
  weeklyProgress: [],
  categoryMarks: Object.fromEntries(
    Object.entries(CORE_SUBJECTS).map(([subject, details]) => [
      subject,
      details.categories.map(({ code, name: categoryName }) => ({
        code,
        name: categoryName,
        marks: 0,
        maxMarks: 30,
        pct: 0,
        status: 'Not Started'
      }))
    ])
  )
});

export const getStudentPapersHistory = (student, subject) => {
  const history = student?.paperHistory?.[subject] || student?.papersHistory?.[subject];
  if (Array.isArray(history)) return history;
  return history && typeof history === 'object' ? Object.values(history) : [];
};

export const fetchStudentAttemptsFromApi = async (studentId, subject) => {
  if (!studentId) return [];
  const module = subject === 'preschool' ? 'preschool' : subject;
  const result = await request(
    `/student/${encodeURIComponent(studentId)}/attempts?module=${encodeURIComponent(module)}`
  );
  return Array.isArray(result.attempts) ? result.attempts : [];
};