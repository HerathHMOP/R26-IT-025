function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const MIN_PASSWORD_LENGTH = 8;

function validateCreateUser(req, res, next) {
  const { account_type, full_name, email, password } = req.body;
  const allowedAccountTypes = new Set(["parent", "teacher"]);

  if (!allowedAccountTypes.has(account_type)) {
    return res.status(400).json({ message: "account_type must be parent or teacher" });
  }
  if (!isNonEmptyString(full_name)) {
    return res.status(400).json({ message: "full_name is required" });
  }
  if (!isNonEmptyString(email) || !email.includes("@")) {
    return res.status(400).json({ message: "valid email is required" });
  }
  if (!isNonEmptyString(password) || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  return next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!isNonEmptyString(email) || !email.includes("@")) {
    return res.status(400).json({ message: "valid email is required" });
  }
  if (!isNonEmptyString(password)) {
    return res.status(400).json({ message: "password is required" });
  }
  return next();
}

function validateCreateStudent(req, res, next) {
  const { user_id, full_name, grade, preferred_language } = req.body;
  const gradeNum = Number(grade);
  const allowedLanguages = new Set(["sinhala", "english", "tamil"]);

  const tokenUserId = req.user?.sub != null ? Number(req.user.sub) : null;
  const bodyUserId = user_id !== undefined && user_id !== null && user_id !== "" ? Number(user_id) : null;

  if (tokenUserId) {
    if (bodyUserId != null && bodyUserId !== tokenUserId) {
      return res.status(403).json({ message: "user_id does not match authenticated user" });
    }
    req.body.user_id = tokenUserId;
  } else if (!Number.isInteger(bodyUserId) || bodyUserId <= 0) {
    return res.status(400).json({ message: "user_id must be a positive integer" });
  } else {
    req.body.user_id = bodyUserId;
  }
  if (!isNonEmptyString(full_name)) {
    return res.status(400).json({ message: "full_name is required" });
  }
  if (!Number.isInteger(gradeNum) || gradeNum < 0 || gradeNum > 5) {
    return res.status(400).json({ message: "grade must be between 0 and 5" });
  }
  if (preferred_language !== undefined && !allowedLanguages.has(preferred_language)) {
    return res.status(400).json({ message: "preferred_language must be sinhala, english, or tamil" });
  }

  return next();
}

function validateStartExam(req, res, next) {
  const { student_id, total_questions } = req.body;
  if (!Number.isInteger(Number(student_id)) || Number(student_id) <= 0) {
    return res.status(400).json({ message: "student_id must be a positive integer" });
  }
  if (total_questions !== undefined && (!Number.isInteger(Number(total_questions)) || Number(total_questions) <= 0)) {
    return res.status(400).json({ message: "total_questions must be a positive integer when provided" });
  }
  return next();
}

function validateCompleteExam(req, res, next) {
  const { correct_answers, subject_id, total_activities } = req.body;
  const score = Number(correct_answers);
  const totalActivities =
    total_activities === undefined || total_activities === null
      ? 15
      : Number(total_activities);

  if (!Number.isInteger(totalActivities) || totalActivities <= 0) {
    return res.status(400).json({ message: "total_activities must be a positive integer when provided" });
  }
  if (!Number.isInteger(score) || score < 0 || score > totalActivities) {
    return res
      .status(400)
      .json({ message: `correct_answers must be an integer between 0 and ${totalActivities}` });
  }
  if (subject_id !== undefined && (!Number.isInteger(Number(subject_id)) || Number(subject_id) <= 0)) {
    return res.status(400).json({ message: "subject_id must be a positive integer when provided" });
  }
  return next();
}

function validateUpsertProgress(req, res, next) {
  const { student_id, subject_id, activity_key, level_played, score, completed } = req.body;
  const level = Number(level_played);

  if (!Number.isInteger(Number(student_id)) || Number(student_id) <= 0) {
    return res.status(400).json({ message: "student_id must be a positive integer" });
  }
  if (!Number.isInteger(Number(subject_id)) || Number(subject_id) <= 0) {
    return res.status(400).json({ message: "subject_id must be a positive integer" });
  }
  if (!isNonEmptyString(activity_key)) {
    return res.status(400).json({ message: "activity_key is required" });
  }
  if (!Number.isInteger(level) || level < 1 || level > 4) {
    return res.status(400).json({ message: "level_played must be between 1 and 4" });
  }
  if (score !== undefined && Number.isNaN(Number(score))) {
    return res.status(400).json({ message: "score must be numeric" });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ message: "completed must be boolean" });
  }

  return next();
}

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCreateStudent,
  validateStartExam,
  validateCompleteExam,
  validateUpsertProgress
};
