INSERT INTO user(username, password, role)
VALUES($1, $2, $3)
RETURNING *