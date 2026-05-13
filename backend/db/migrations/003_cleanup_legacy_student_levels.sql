-- Remove legacy level rows that were not assigned by a completed aptitude session.
-- This keeps level unlock state consistent with server-side gating rules.
DELETE sl
FROM student_levels sl
LEFT JOIN exam_sessions es ON es.id = sl.assigned_from_session_id
WHERE sl.assigned_from_session_id IS NULL
   OR es.id IS NULL
   OR es.status <> 'completed';
