CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_type ENUM('parent', 'teacher') NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  date_of_birth DATE NULL,
  grade TINYINT UNSIGNED NOT NULL,
  preferred_language ENUM('sinhala', 'english', 'tamil') NOT NULL DEFAULT 'english',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_students_grade CHECK (grade BETWEEN 0 AND 5),
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_students_user_id (user_id),
  INDEX idx_students_grade (grade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  grade_group ENUM('pre_g1', 'g2_g5', 'all') NOT NULL DEFAULT 'all',
  language_medium ENUM('sinhala', 'english', 'tamil', 'both') NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subjects_grade_group (grade_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_levels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  current_level TINYINT UNSIGNED NOT NULL DEFAULT 1,
  assigned_from_session_id BIGINT UNSIGNED NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_student_levels_level CHECK (current_level BETWEEN 1 AND 4),
  CONSTRAINT fk_student_levels_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_student_levels_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_student_subject_level (student_id, subject_id),
  INDEX idx_student_levels_student_id (student_id),
  INDEX idx_student_levels_subject_id (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  total_questions TINYINT UNSIGNED NOT NULL DEFAULT 12,
  correct_answers TINYINT UNSIGNED NULL,
  score_percent DECIMAL(5,2) NULL,
  assigned_level TINYINT UNSIGNED NULL,
  status ENUM('started', 'completed') NOT NULL DEFAULT 'started',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  CONSTRAINT chk_exam_sessions_correct_answers CHECK (correct_answers IS NULL OR correct_answers BETWEEN 0 AND 12),
  CONSTRAINT chk_exam_sessions_assigned_level CHECK (assigned_level IS NULL OR assigned_level BETWEEN 1 AND 4),
  CONSTRAINT fk_exam_sessions_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_exam_sessions_student_id (student_id),
  INDEX idx_exam_sessions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE student_levels
  ADD CONSTRAINT fk_student_levels_exam_session
  FOREIGN KEY (assigned_from_session_id) REFERENCES exam_sessions(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS student_progress (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  activity_key VARCHAR(120) NOT NULL,
  level_played TINYINT UNSIGNED NOT NULL,
  score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_student_progress_level CHECK (level_played BETWEEN 1 AND 4),
  CONSTRAINT fk_student_progress_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_student_progress_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_student_progress_activity (student_id, subject_id, activity_key),
  INDEX idx_student_progress_student_id (student_id),
  INDEX idx_student_progress_subject_id (subject_id),
  INDEX idx_student_progress_student_subject (student_id, subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subjects (code, display_name, grade_group, language_medium)
VALUES
  ('sinhala', 'Sinhala', 'all', 'sinhala'),
  ('english', 'English', 'all', 'english'),
  ('tamil', 'Tamil', 'g2_g5', 'tamil'),
  ('maths', 'Maths', 'all', 'both')
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  grade_group = VALUES(grade_group),
  language_medium = VALUES(language_medium),
  is_active = 1;
