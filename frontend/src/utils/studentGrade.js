export const isPreSchoolOrGrade1 = (gradeStr) => {
  if (!gradeStr) return false;
  const grade = gradeStr.toLowerCase().trim();
  return grade.includes('pre') || grade.includes('grade 1') || grade === '1';
};

export const getNumericGrade = (gradeStr) => {
  if (!gradeStr) return 2;
  const grade = String(gradeStr).toLowerCase().trim();
  if (grade.includes('4')) return 4;
  if (grade.includes('3')) return 3;
  if (grade.includes('2')) return 2;
  if (grade.includes('1') || grade.includes('pre')) return 1;
  return 2;
};