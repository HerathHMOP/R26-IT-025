ALTER TABLE exam_sessions
  MODIFY COLUMN total_questions TINYINT UNSIGNED NOT NULL DEFAULT 15;

SET @has_correct_answers_check := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'exam_sessions'
    AND CONSTRAINT_NAME = 'chk_exam_sessions_correct_answers'
    AND CONSTRAINT_TYPE = 'CHECK'
);
SET @drop_correct_answers_check_sql := IF(
  @has_correct_answers_check > 0,
  'ALTER TABLE exam_sessions DROP CHECK chk_exam_sessions_correct_answers',
  'SELECT 1'
);
PREPARE stmt_drop_correct_answers_check FROM @drop_correct_answers_check_sql;
EXECUTE stmt_drop_correct_answers_check;
DEALLOCATE PREPARE stmt_drop_correct_answers_check;

ALTER TABLE exam_sessions
  ADD CONSTRAINT chk_exam_sessions_correct_answers
  CHECK (correct_answers IS NULL OR correct_answers BETWEEN 0 AND 15);
