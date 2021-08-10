\connect "ticflow";
CREATE TYPE role AS ENUM ('manager', 'engineer', 'saler');
DROP TABLE IF EXISTS "graphs";
DROP SEQUENCE IF EXISTS graphs_id_seq;
CREATE SEQUENCE graphs_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."graphs" (
    "id" integer DEFAULT nextval('graphs_id_seq') NOT NULL,
    "info" jsonb NOT NULL,
    CONSTRAINT "graphs_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "graphs" ("id", "info") VALUES
(3,	'{"edges": [], "nodes": [{"id": "1", "name": "step1"}]}'),
(2,	'{"edges": [], "nodes": [{"id": "1", "name": "step1-ya"}]}');

DROP TABLE IF EXISTS "outgoing";
DROP SEQUENCE IF EXISTS outgoing_id_seq;
CREATE SEQUENCE outgoing_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."outgoing" (
    "id" integer DEFAULT nextval('outgoing_id_seq') NOT NULL,
    "formdata" jsonb NOT NULL,
    "process" integer NOT NULL,
    CONSTRAINT "outgoing_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "process";
DROP SEQUENCE IF EXISTS process_id_seq;
CREATE SEQUENCE process_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."process" (
    "id" integer DEFAULT nextval('process_id_seq') NOT NULL,
    "formschema" jsonb NOT NULL,
    "graph" jsonb NOT NULL,
    "roles" jsonb NOT NULL,
    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "user";
DROP SEQUENCE IF EXISTS user_id_seq;
CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."user" (
    "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "role" role NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "user" ("id", "username", "password", "role") VALUES
(1,	'张三',	'123456',	'manager'),
(2,	'李四',	'123456',	'manager'),
(3,	'赵五',	'123456',	'engineer'),
(4,	'郑六',	'123456',	'engineer'),
(5,	'田七',	'123456',	'saler'),
(6,	'谢八',	'123456',	'saler'),
(7,	'吴九',	'123456',	'manager'),
(8,	'庞十',	'123456',	'engineer'),
(9,	'周廿',	'123456',	'saler');

ALTER TABLE ONLY "public"."outgoing" ADD CONSTRAINT "outgoing_process_fkey" FOREIGN KEY (process) REFERENCES process(id) NOT DEFERRABLE;
