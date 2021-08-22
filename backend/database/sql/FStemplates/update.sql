UPDATE "FStemplates"
SET formschema = $2
WHERE id = $1
RETURNING *