-- Adminer 4.8.1 PostgreSQL 13.3 (Debian 13.3-1.pgdg100+1) dump

\connect "ticflow";
CREATE TYPE role AS ENUM ('manager', 'engineer', 'saler');
DROP TABLE IF EXISTS "LCtemplates";
DROP SEQUENCE IF EXISTS "LCtemplates_id_seq";
CREATE SEQUENCE "LCtemplates_id_seq" INCREMENT 1 MINVALUE 1001 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."LCtemplates" (
    "id" integer DEFAULT nextval('"LCtemplates_id_seq"') NOT NULL,
    "lifecycle" jsonb NOT NULL,
    CONSTRAINT "LCtemplates_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "LCtemplates" ("id", "lifecycle") VALUES
(1000,	'{"schema": {"uischema": {"feedback": {"ui:widget": "textarea"}}, "fieldschema": {"type": "object", "title": "外派单", "properties": {"saler": {"enum": ["田七", "谢八", "周廿"], "type": "string", "title": "销售员"}, "status": {"type": "boolean", "title": "工程师接单"}, "manager": {"enum": ["张三", "李四", "吴九"], "type": "string", "title": "管理员"}, "engineer": {"enum": ["赵五", "郑六", "庞十"], "type": "string", "title": "工程师"}, "feedback": {"type": "string", "title": "客户反馈"}}, "description": "外派单记录"}}, "enkrino": {"graph": {"edges": [{"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "4fd27190-a751-415e-9dbd-8c9188860656", "spec": {"temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": false}}, {"to": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "spec": {"token": 0, "temporary": false}}, {"to": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "from": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "spec": {"token": 0, "temporary": false}}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "name": "选定销售员", "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "name": "选定工程师", "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "name": "工程师接单", "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "name": "填写客户反馈", "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "name": "管理员审核", "backward": 2}]}, "start": "4fd27190-a751-415e-9dbd-8c9188860656", "constraints": {"steps": {"21f2c4fc-8c4a-4181-a5ed-b8a370a244b2": {"auth": "@manager", "disable": ["manager", "saler", "engineer", "status", "feedback"]}, "4fd27190-a751-415e-9dbd-8c9188860656": {"auth": "@manager", "disable": ["manager", "engineer", "status", "feedback"]}, "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b": {"auth": "@saler", "disable": ["manager", "saler", "status", "feedback"]}, "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb": {"auth": "@engineer", "disable": ["manager", "saler", "engineer", "status"]}, "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9": {"auth": "@engineer", "disable": ["manager", "saler", "engineer", "feedback"]}}}}}');

DROP TABLE IF EXISTS "account";
DROP SEQUENCE IF EXISTS account_id_seq;
CREATE SEQUENCE account_id_seq INCREMENT 1 MINVALUE 1001 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."account" (
    "id" integer DEFAULT nextval('account_id_seq') NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "role" role NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "account" ("id", "username", "password", "role") VALUES
(1,	'张三',	'123456',	'manager'),
(2,	'李四',	'123456',	'manager'),
(3,	'赵五',	'123456',	'engineer'),
(4,	'郑六',	'123456',	'engineer'),
(5,	'田七',	'123456',	'saler'),
(6,	'谢八',	'123456',	'saler'),
(7,	'吴九',	'123456',	'manager'),
(8,	'庞十',	'123456',	'engineer'),
(9,	'周廿',	'123456',	'saler'),
(1000,	'jack',	'123456',	'manager');

DROP TABLE IF EXISTS "outgoing";
DROP SEQUENCE IF EXISTS outgoing_id_seq;
CREATE SEQUENCE outgoing_id_seq INCREMENT 1 MINVALUE 1001 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."outgoing" (
    "id" integer DEFAULT nextval('outgoing_id_seq') NOT NULL,
    "formdata" jsonb NOT NULL,
    "lifecycle" jsonb NOT NULL,
    CONSTRAINT "outgoing_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "outgoing" ("id", "formdata", "lifecycle") VALUES
(1000,	'{"saler": "谢八", "status": true, "manager": "张三", "engineer": "郑六", "feedback": "windows系统无法安装office，已修复"}',	'{"schema": {"uischema": {"feedback": {"ui:widget": "textarea"}}, "fieldschema": {"type": "object", "title": "外派单", "properties": {"saler": {"enum": ["田七", "谢八", "周廿"], "type": "string", "title": "销售员"}, "status": {"type": "boolean", "title": "工程师接单"}, "manager": {"enum": ["张三", "李四", "吴九"], "type": "string", "title": "管理员"}, "engineer": {"enum": ["赵五", "郑六", "庞十"], "type": "string", "title": "工程师"}, "feedback": {"type": "string", "title": "客户反馈"}}, "description": "外派单记录"}}, "enkrino": {"graph": {"edges": [{"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "4fd27190-a751-415e-9dbd-8c9188860656", "spec": {"temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": false}}, {"to": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "spec": {"temporary": false}}, {"to": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "from": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "spec": {"temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": true}}, {"to": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "from": "4fd27190-a751-415e-9dbd-8c9188860656", "spec": {"temporary": true}}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "name": "选定销售员", "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "name": "选定工程师", "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "name": "工程师接单", "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "name": "填写客户反馈", "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "name": "管理员审核", "backward": 2}]}, "start": "4fd27190-a751-415e-9dbd-8c9188860656", "mirror": {"edges": [{"to": "4fd27190-a751-415e-9dbd-8c9188860656", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b"}, {"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9"}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb"}, {"to": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "from": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2"}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "name": "选定销售员", "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "name": "选定工程师", "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "name": "工程师接单", "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "name": "填写客户反馈", "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "name": "管理员审核", "backward": 2}]}, "status": "running", "current": "4fd27190-a751-415e-9dbd-8c9188860656", "constraints": {"steps": {"21f2c4fc-8c4a-4181-a5ed-b8a370a244b2": {"auth": "@manager", "disable": ["manager", "saler", "engineer", "status", "feedback"]}, "4fd27190-a751-415e-9dbd-8c9188860656": {"auth": "@manager", "disable": ["manager", "engineer", "status", "feedback"]}, "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b": {"auth": "@saler", "disable": ["manager", "saler", "status", "feedback"]}, "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb": {"auth": "@engineer", "disable": ["manager", "saler", "engineer", "status"]}, "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9": {"auth": "@engineer", "disable": ["manager", "saler", "engineer", "feedback"]}}}}}');

-- 2021-08-15 15:20:38.714091+00