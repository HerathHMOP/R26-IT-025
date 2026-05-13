const express = require("express");
const { healthCheck } = require("../controllers/healthController");
const authMiddleware = require("../middleware/auth");
const {
  validateCreateUser,
  validateLogin,
  validateCreateStudent,
  validateStartExam,
  validateCompleteExam,
  validateUpsertProgress
} = require("../middleware/validators");
const {
  createUser,
  login,
  listMyStudents,
  createStudent,
  listStudentSubjects,
  startExamSession,
  completeExamSession,
  getStudentLevels,
  getStudentDashboard,
  getSubjectLevelEligibility,
  upsertStudentProgress
} = require("../controllers/lmsController");

const router = express.Router();

router.get("/health", healthCheck);
router.post("/auth/register", validateCreateUser, createUser);
router.post("/users", validateCreateUser, createUser);
router.post("/auth/login", validateLogin, login);

router.use(authMiddleware);
router.get("/students", listMyStudents);
router.post("/students", validateCreateStudent, createStudent);
router.get("/students/:studentId/subjects", listStudentSubjects);
router.get("/students/:studentId/levels", getStudentLevels);
router.get("/students/:studentId/dashboard", getStudentDashboard);
router.get("/students/:studentId/subjects/:subjectId/eligibility", getSubjectLevelEligibility);
router.post("/exam-sessions/start", validateStartExam, startExamSession);
router.post("/exam-sessions/:sessionId/complete", validateCompleteExam, completeExamSession);
router.post("/student-progress", validateUpsertProgress, upsertStudentProgress);

module.exports = router;
