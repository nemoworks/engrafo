INSERT INTO process(formschema, enkrinograph, roles, constraints)
VALUES($1, $2, $3, $4)
RETURNING *