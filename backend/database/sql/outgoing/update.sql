UPDATE outgoing
SET formdata = $2, lifecycle = $3
WHERE id = $1
RETURNING *