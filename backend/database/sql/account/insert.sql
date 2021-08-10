INSERT INTO account(username, password, role)
VALUES($1, $2, $3)
RETURNING *