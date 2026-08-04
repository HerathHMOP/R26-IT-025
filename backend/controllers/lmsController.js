const bcrypt = require("bcryptjs");
const db = require("../db");
const jwt = require("jsonwebtoken");
const DIAGNOSTIC_ACTIVITY_COUNT = 15;
const MAX_LEVEL = 4;

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, account_type: user.account_type, email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "12h" }
  );
}

function getGradeGroup(grade) {
  return grade <= 1 ? "pre_g1" : "g2_g5";
}

function mapScorePercentToEligibleLevel(scorePercent) {
  if (scorePercent <= 0) return null;
  if (scorePercent >= 85) return 4;
  if (scorePercent >= 65) return 3;
  if (scorePercent >= 40) return 2;
  return 1;
}

function buildEligibleLevels(maxEligibleLevel) {
  if (maxEligibleLevel == null) return [];
  const safeMax = Math.min(Math.max(Number(maxEligibleLevel) || 1, 1), MAX_LEVEL);
  return Array.from({ length: safeMax }, (_, idx) => idx + 1);
}

async function createUser(req, res) {
  const { account_type, full_name, email, password, is_email_verified = 0 } = req.body;

  if (!account_type || !full_name || !email || !password) {
    return res.status(400).json({ message: "account_type, full_name, email, and password are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (account_type, full_name, email, password_hash, is_email_verified)
       VALUES (?, ?, ?, ?, ?)`,
      [account_type, full_name, email, password_hash, is_email_verified ? 1 : 0]
    );

    const user = {
      id: result.insertId,
      account_type,
      full_name,
      email,
      is_email_verified: Boolean(is_email_verified)
    };
    const token = issueToken(user);

    return res.status(201).json({
      token,
      user
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Failed to create user" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [[user]] = await db.query(
      "SELECT id, account_type, full_name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = issueToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        account_type: user.account_type,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to login" });
  }
}

async function createStudent(req, res) {
  const { user_id, full_name, date_of_birth = null, grade, preferred_language = "english" } = req.body;

  if (!user_id || !full_name || grade === undefined) {
    return res.status(400).json({ message: "user_id, full_name, and grade are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO students (user_id, full_name, date_of_birth, grade, preferred_language)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, full_name, date_of_birth, grade, preferred_language]
    );

    return res.status(201).json({
      id: result.insertId,
      user_id,
      full_name,
      date_of_birth,
      grade,
      preferred_language
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid user_id" });
    }
    return res.status(500).json({ message: "Failed to create student" });
  }
}

async function listMyStudents(req, res) {
  const userId = Number(req.user?.sub);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, user_id, full_name, date_of_birth, grade, preferred_language, created_at
       FROM students
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC`,
      [userId]
    );

    return res.json({ students: rows });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to load students" });
  }
}

async function listStudentSubjects(req, res) {
  const studentId = Number(req.params.studentId);
  if (!studentId) {
    return res.status(400).json({ message: "Invalid studentId" });
  }

  try {
    const [[student]] = await db.query("SELECT id, grade, preferred_language FROM students WHERE id = ?", [studentId]);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const gradeGroup = getGradeGroup(student.grade);
    const [subjects] = await db.query(
      `SELECT id, code, display_name, language_medium
       FROM subjects
       WHERE is_active = 1
         AND (grade_group = 'all' OR grade_group = ?)
       ORDER BY id ASC`,
      [gradeGroup]
    );

    const resolved = subjects.map((subject) => ({
      ...subject,
      content_language:
        subject.code === "maths" && subject.language_medium === "both"
          ? student.preferred_language
          : subject.language_medium
    }));

    return res.json({
      student_id: studentId,
      grade: student.grade,
      grade_group: gradeGroup,
      subjects: resolved
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to list subjects" });
  }
}

async function startExamSession(req, res) {
  const { student_id, total_questions } = req.body;
  if (!student_id) {
    return res.status(400).json({ message: "student_id is required" });
  }

  try {
    const [[student]] = await db.query("SELECT id FROM students WHERE id = ?", [student_id]);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const totalQuestions =
      total_questions !== undefined && total_questions !== null && Number.isInteger(Number(total_questions))
        ? Number(total_questions)
        : DIAGNOSTIC_ACTIVITY_COUNT;

    const [result] = await db.query(
      `INSERT INTO exam_sessions (student_id, total_questions, status)
       VALUES (?, ?, 'started')`,
      [student_id, totalQuestions]
    );

    return res.status(201).json({
      exam_session_id: result.insertId,
      student_id,
      total_questions: totalQuestions,
      status: "started"
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to start exam session" });
  }
}

async function completeExamSession(req, res) {
  const sessionId = Number(req.params.sessionId);
  const { correct_answers, subject_id, total_activities } = req.body;

  if (!sessionId || correct_answers === undefined) {
    return res.status(400).json({ message: "sessionId and correct_answers are required" });
  }

  const correctAnswers = Number(correct_answers);
  if (!Number.isInteger(correctAnswers) || correctAnswers < 0) {
    return res.status(400).json({ message: "correct_answers must be a non-negative integer" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[session]] = await connection.query(
      "SELECT id, student_id, status, total_questions FROM exam_sessions WHERE id = ? FOR UPDATE",
      [sessionId]
    );

    if (!session) {
      await connection.rollback();
      return res.status(404).json({ message: "Exam session not found" });
    }

    if (session.status === "completed") {
      await connection.rollback();
      return res.status(409).json({ message: "Exam session already completed" });
    }

    const requestedTotalActivities =
      total_activities === undefined || total_activities === null
        ? null
        : Number(total_activities);
    const totalActivities =
      requestedTotalActivities && Number.isInteger(requestedTotalActivities) && requestedTotalActivities > 0
        ? requestedTotalActivities
        : Number(session.total_questions) || DIAGNOSTIC_ACTIVITY_COUNT;
    if (Number.isNaN(correctAnswers) || correctAnswers < 0 || correctAnswers > totalActivities) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: `correct_answers must be between 0 and ${totalActivities}` });
    }

    const scorePercent = Number(((correctAnswers / totalActivities) * 100).toFixed(2));
    const eligibleLevel = mapScorePercentToEligibleLevel(scorePercent);
    const eligibleLevels = buildEligibleLevels(eligibleLevel);

    await connection.query(
      `UPDATE exam_sessions
       SET correct_answers = ?, score_percent = ?, assigned_level = ?, status = 'completed', completed_at = NOW()
       WHERE id = ?`,
      [correctAnswers, scorePercent, eligibleLevel, sessionId]
    );

    const [[student]] = await connection.query(
      "SELECT id, grade FROM students WHERE id = ?",
      [session.student_id]
    );
    const gradeGroup = getGradeGroup(student.grade);
    const requestedSubjectId = subject_id !== undefined ? Number(subject_id) : null;

    let targetSubjectIds = [];
    if (requestedSubjectId) {
      const [[subjectRow]] = await connection.query(
        `SELECT id
         FROM subjects
         WHERE id = ?
           AND is_active = 1
           AND (grade_group = 'all' OR grade_group = ?)`,
        [requestedSubjectId, gradeGroup]
      );
      if (!subjectRow) {
        await connection.rollback();
        return res.status(404).json({ message: "Subject is not available for this student grade" });
      }
      targetSubjectIds = [subjectRow.id];
    } else {
      const [subjects] = await connection.query(
        `SELECT id
         FROM subjects
         WHERE is_active = 1
           AND (grade_group = 'all' OR grade_group = ?)`,
        [gradeGroup]
      );
      targetSubjectIds = subjects.map((row) => row.id);
      if (targetSubjectIds.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "No active subjects available for this grade group" });
      }
    }

    for (const subjectId of targetSubjectIds) {
      if (eligibleLevel == null) {
        // Zero-score attempts should keep all levels locked for this subject.
        await connection.query(
          `DELETE FROM student_levels
           WHERE student_id = ? AND subject_id = ?`,
          [session.student_id, subjectId]
        );
        continue;
      }

      await connection.query(
        `INSERT INTO student_levels (student_id, subject_id, current_level, assigned_from_session_id)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           current_level = VALUES(current_level),
           assigned_from_session_id = VALUES(assigned_from_session_id),
           updated_at = NOW()`,
        [session.student_id, subjectId, eligibleLevel, sessionId]
      );
    }

    await connection.commit();
    return res.json({
      exam_session_id: sessionId,
      student_id: session.student_id,
      total_activities: totalActivities,
      correct_answers: correctAnswers,
      score_percent: scorePercent,
      eligible_level: eligibleLevel,
      eligible_levels: eligibleLevels,
      assigned_subject_ids: targetSubjectIds
    });
  } catch (_error) {
    await connection.rollback();
    return res.status(500).json({ message: "Failed to complete exam session" });
  } finally {
    connection.release();
  }
}

async function getStudentLevels(req, res) {
  const studentId = Number(req.params.studentId);
  if (!studentId) {
    return res.status(400).json({ message: "Invalid studentId" });
  }

  try {
    const [rows] = await db.query(
      `SELECT sl.student_id, sl.subject_id, s.code AS subject_code, s.display_name, sl.current_level, sl.assigned_at, sl.updated_at
       FROM student_levels sl
       INNER JOIN subjects s ON s.id = sl.subject_id
       WHERE sl.student_id = ?
       ORDER BY s.id ASC`,
      [studentId]
    );
    return res.json({ student_id: studentId, levels: rows });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to load student levels" });
  }
}

async function getStudentDashboard(req, res) {
  const studentId = Number(req.params.studentId);
  if (!studentId) {
    return res.status(400).json({ message: "Invalid studentId" });
  }

  try {
    const [[student]] = await db.query(
      "SELECT id, user_id, full_name, grade, preferred_language FROM students WHERE id = ?",
      [studentId]
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const gradeGroup = getGradeGroup(student.grade);
    const [subjects] = await db.query(
      `SELECT id, code, display_name, language_medium
       FROM subjects
       WHERE is_active = 1
         AND (grade_group = 'all' OR grade_group = ?)
       ORDER BY id ASC`,
      [gradeGroup]
    );

    const [levels] = await db.query(
      `SELECT sl.subject_id,
              CASE WHEN es.id IS NOT NULL THEN sl.current_level ELSE NULL END AS current_level,
              sl.updated_at
       FROM student_levels sl
       LEFT JOIN exam_sessions es
         ON es.id = sl.assigned_from_session_id
        AND es.status = 'completed'
       WHERE sl.student_id = ?`,
      [studentId]
    );
    const levelBySubject = new Map(levels.map((row) => [row.subject_id, row]));

    const [progress] = await db.query(
      `SELECT subject_id,
              COUNT(*) AS total_activities,
              SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed_activities,
              AVG(score) AS average_score
       FROM student_progress
       WHERE student_id = ?
       GROUP BY subject_id`,
      [studentId]
    );
    const progressBySubject = new Map(progress.map((row) => [row.subject_id, row]));

    const dashboardSubjects = subjects.map((subject) => {
      const level = levelBySubject.get(subject.id);
      const subjectProgress = progressBySubject.get(subject.id);
      return {
        id: subject.id,
        code: subject.code,
        display_name: subject.display_name,
        content_language:
          subject.code === "maths" && subject.language_medium === "both"
            ? student.preferred_language
            : subject.language_medium,
        current_level: level?.current_level ?? null,
        eligible_levels: buildEligibleLevels(level?.current_level ?? null),
        level_updated_at: level?.updated_at ?? null,
        progress: {
          total_activities: Number(subjectProgress?.total_activities ?? 0),
          completed_activities: Number(subjectProgress?.completed_activities ?? 0),
          average_score: subjectProgress?.average_score ? Number(subjectProgress.average_score) : null
        }
      };
    });

    return res.json({
      student: {
        id: student.id,
        user_id: student.user_id,
        full_name: student.full_name,
        grade: Number(student.grade),
        grade_group: gradeGroup,
        preferred_language: student.preferred_language
      },
      subjects: dashboardSubjects,
      aptitude_test: {
        total_activities: DIAGNOSTIC_ACTIVITY_COUNT,
        max_level: MAX_LEVEL
      }
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to load student dashboard" });
  }
}

async function getSubjectLevelEligibility(req, res) {
  const studentId = Number(req.params.studentId);
  const subjectId = Number(req.params.subjectId);
  const requestedLevel = req.query.level !== undefined ? Number(req.query.level) : null;

  if (!studentId || !subjectId) {
    return res.status(400).json({ message: "Invalid studentId or subjectId" });
  }

  try {
    const [[student]] = await db.query("SELECT id FROM students WHERE id = ?", [studentId]);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const [[subject]] = await db.query("SELECT id, code, display_name FROM subjects WHERE id = ? AND is_active = 1", [subjectId]);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const [[studentLevel]] = await db.query(
      `SELECT sl.current_level
       FROM student_levels sl
       INNER JOIN exam_sessions es
         ON es.id = sl.assigned_from_session_id
        AND es.status = 'completed'
       WHERE sl.student_id = ? AND sl.subject_id = ?`,
      [studentId, subjectId]
    );

    if (!studentLevel) {
      return res.status(409).json({
        student_id: studentId,
        subject_id: subjectId,
        subject_code: subject.code,
        subject_name: subject.display_name,
        eligible_level: null,
        eligible_levels: [],
        can_access: false,
        message: "Aptitude test is required to unlock levels."
      });
    }

    const eligibleLevel = Number(studentLevel.current_level);
    const canAccess = requestedLevel == null ? true : requestedLevel <= eligibleLevel;
    return res.json({
      student_id: studentId,
      subject_id: subjectId,
      subject_code: subject.code,
      subject_name: subject.display_name,
      requested_level: requestedLevel,
      eligible_level: eligibleLevel,
      eligible_levels: buildEligibleLevels(eligibleLevel),
      can_access: canAccess
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to check level eligibility" });
  }
}

async function upsertStudentProgress(req, res) {
  const { student_id, subject_id, activity_key, level_played, score = 0, completed = false } = req.body;

  if (!student_id || !subject_id || !activity_key || !level_played) {
    return res
      .status(400)
      .json({ message: "student_id, subject_id, activity_key, and level_played are required" });
  }

  try {
    const [[eligibleRow]] = await db.query(
      `SELECT sl.current_level
       FROM student_levels sl
       INNER JOIN exam_sessions es
         ON es.id = sl.assigned_from_session_id
        AND es.status = 'completed'
       WHERE sl.student_id = ? AND sl.subject_id = ?`,
      [student_id, subject_id]
    );
    if (!eligibleRow) {
      return res.status(409).json({ message: "Aptitude test is required before submitting subject progress" });
    }

    const eligibleLevel = Number(eligibleRow.current_level);
    if (Number(level_played) > eligibleLevel) {
      return res.status(403).json({
        message: `Level ${level_played} is locked. Student is eligible up to level ${eligibleLevel}.`,
        eligible_level: eligibleLevel,
        eligible_levels: buildEligibleLevels(eligibleLevel)
      });
    }

    const [result] = await db.query(
      `INSERT INTO student_progress (student_id, subject_id, activity_key, level_played, score, completed, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         score = VALUES(score),
         completed = VALUES(completed),
         completed_at = VALUES(completed_at),
         updated_at = NOW()`,
      [student_id, subject_id, activity_key, level_played, score, completed ? 1 : 0, completed ? new Date() : null]
    );

    return res.status(201).json({
      id: result.insertId || null,
      student_id,
      subject_id,
      activity_key,
      level_played,
      score,
      completed: Boolean(completed)
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid student_id or subject_id" });
    }
    return res.status(500).json({ message: "Failed to save student progress" });
  }
}

module.exports = {
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
};
