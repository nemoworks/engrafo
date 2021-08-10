UPDATE account
SET username = $2, password = $3, role = $4
WHERE id = $1