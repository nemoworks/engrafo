UPDATE "context"
SET info = $2
WHERE id = $1
RETURNING *