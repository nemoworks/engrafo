\connect ticflow
CREATE TABLE IF NOT EXISTS graphs (
	id serial NOT NULL PRIMARY KEY,
	info jsonb NOT NULL
);