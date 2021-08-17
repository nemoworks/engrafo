INSERT INTO outgoing(formdata, lifecycle)
VALUES($1, $2)
RETURNING *