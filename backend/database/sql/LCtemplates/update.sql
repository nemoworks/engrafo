UPDATE LCtemplates
SET lifecycle = $2
WHERE id = $1
RETURNING *