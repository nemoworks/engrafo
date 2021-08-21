UPDATE outgoing
SET formdata = $2
WHERE id = $1
RETURNING *