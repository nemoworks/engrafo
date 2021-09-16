-- Adminer 4.8.1 PostgreSQL 13.3 (Debian 13.3-1.pgdg100+1) dump

\connect "ticflow";
CREATE TYPE role AS ENUM ('manager', 'treasurer', 'saler');

DROP TABLE IF EXISTS "FStemplates";
DROP SEQUENCE IF EXISTS "FStemplates_id_seq";
CREATE SEQUENCE "FStemplates_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1001 CACHE 1 ;

CREATE TABLE "public"."FStemplates" (
    "id" integer DEFAULT nextval('"FStemplates_id_seq"') NOT NULL,
    "formschema" jsonb NOT NULL,
    CONSTRAINT "FStemplates_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "FStemplates" ("id", "formschema") VALUES
(1000,	'{"uischema": {"feedback": {"ui:widget": "textarea"}}, "fieldschema": {"type": "object", "title": "外派单", "properties": {"saler": {"enum": ["销售1", "销售2", "销售3"], "type": "string", "title": "销售员"}, "status": {"type": "boolean", "title": "工程师接单"}, "manager": {"enum": ["管理员1", "管理员2", "管理员3"], "type": "string", "title": "管理员"}, "treasurer": {"enum": ["财务1", "财务2", "财务3"], "type": "string", "title": "工程师"}, "feedback": {"type": "string", "title": "客户反馈"}}, "description": "外派单记录"}}');

DROP TABLE IF EXISTS "LCtemplates";
DROP SEQUENCE IF EXISTS "LCtemplates_id_seq";
CREATE SEQUENCE "LCtemplates_id_seq" INCREMENT 1  MINVALUE 1  MAXVALUE 2147483647 START 1001 CACHE 1 ;
CREATE TABLE "public"."LCtemplates" (
    "id" integer DEFAULT nextval('"LCtemplates_id_seq"') NOT NULL,
    "lifecycle" jsonb NOT NULL,
    CONSTRAINT "LCtemplates_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "LCtemplates" ("id", "lifecycle") VALUES
(1000,	'{"schema": {"uischema": {"feedback": {"ui:widget": "textarea"}}, "fieldschema": {"type": "object", "title": "外派单", "properties": {"saler": {"enum": ["销售1", "销售2", "销售3"], "type": "string", "title": "销售员"}, "status": {"type": "boolean", "title": "工程师接单"}, "manager": {"enum": ["管理员1", "管理员2", "管理员3"], "type": "string", "title": "管理员"}, "treasurer": {"enum": ["财务1", "财务2", "财务3"], "type": "string", "title": "工程师"}, "feedback": {"type": "string", "title": "客户反馈"}}, "description": "外派单记录"}}, "enkrino": {"graph": {"edges": [{"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "4fd27190-a751-415e-9dbd-8c9188860656", "spec": {"temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": false}}, {"to": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "spec": {"token": 0, "temporary": false}}, {"to": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "from": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "spec": {"token": 0, "temporary": false}}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "name": "选定销售员", "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "name": "选定工程师", "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "name": "工程师接单", "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "name": "填写客户反馈", "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "name": "管理员审核", "backward": 2}]}, "start": "4fd27190-a751-415e-9dbd-8c9188860656", "constraints": {"steps": {"21f2c4fc-8c4a-4181-a5ed-b8a370a244b2": {"auth": "@manager", "disable": ["manager", "saler", "treasurer", "status", "feedback"]}, "4fd27190-a751-415e-9dbd-8c9188860656": {"auth": "@manager", "disable": ["manager", "treasurer", "status", "feedback"]}, "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b": {"auth": "@saler", "disable": ["manager", "saler", "status", "feedback"]}, "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb": {"auth": "@treasurer", "disable": ["manager", "saler", "treasurer", "status"]}, "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9": {"auth": "@treasurer", "disable": ["manager", "saler", "treasurer", "feedback"]}}}}}');

DROP TABLE IF EXISTS "account";
DROP SEQUENCE IF EXISTS account_id_seq;
CREATE SEQUENCE account_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1001 CACHE 1;

CREATE TABLE "public"."account" (
    "id" integer DEFAULT nextval('account_id_seq') NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "role" role NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "account" ("id", "username", "password", "role") VALUES
(1,	'管理员1',	'123456',	'manager'),
(2,	'管理员2',	'123456',	'manager'),
(3,	'财务1',	'123456',	'treasurer'),
(4,	'财务2',	'123456',	'treasurer'),
(5,	'销售1',	'123456',	'saler'),
(6,	'销售2',	'123456',	'saler'),
(7,	'管理员3',	'123456',	'manager'),
(8,	'财务3',	'123456',	'treasurer'),
(9,	'销售3',	'123456',	'saler'),
(1000,	'管理员3',	'123456',	'manager');

DROP TABLE IF EXISTS "context";
DROP SEQUENCE IF EXISTS context_id_seq;
CREATE SEQUENCE context_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 22 CACHE 1;

CREATE TABLE "public"."context" (
    "id" integer DEFAULT nextval('context_id_seq') NOT NULL,
    "info" jsonb NOT NULL,
    CONSTRAINT "context_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "context" ("id", "info") VALUES
(3,	'{"message": "start", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630160655909"}'),
(4,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630160882945"}'),
(5,	'{"message": "start", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161343740"}'),
(6,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161396428"}'),
(7,	'{"message": "start", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161515433"}'),
(8,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->4fd27190-a751-415e-9dbd-8c9188860656", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161578626"}'),
(9,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161602503"}'),
(10,	'{"message": "start", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161732798"}'),
(11,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161790269"}'),
(12,	'{"message": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b->e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161807422"}'),
(13,	'{"message": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161823845"}'),
(14,	'{"message": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b->e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161846293"}'),
(15,	'{"message": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9->e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161856393"}'),
(16,	'{"message": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb->21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161868391"}'),
(17,	'{"message": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2->4fd27190-a751-415e-9dbd-8c9188860656", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630161903383"}'),
(18,	'{"message": "start", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630214881602"}'),
(19,	'{"message": "4fd27190-a751-415e-9dbd-8c9188860656->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630214964332"}'),
(20,	'{"message": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b->e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630214994908"}'),
(21,	'{"message": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9->dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "formdata": {"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}, "timestamp": "1630215009277"}');

DROP TABLE IF EXISTS "outgoing";
DROP SEQUENCE IF EXISTS outgoing_id_seq;
CREATE SEQUENCE outgoing_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1001 CACHE 1;

CREATE TABLE "public"."outgoing" (
    "id" integer DEFAULT nextval('outgoing_id_seq') NOT NULL,
    "formdata" jsonb NOT NULL,
    "lifecycle" jsonb NOT NULL,
    CONSTRAINT "outgoing_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "outgoing" ("id", "formdata", "lifecycle") VALUES
(1000,	'{"saler": "销售2", "status": true, "manager": "管理员1", "treasurer": "财务2", "feedback": "windows系统无法安装office，已修复"}',	'{"schema": {"uischema": {"feedback": {"ui:widget": "textarea"}}, "fieldschema": {"type": "object", "title": "外派单", "properties": {"saler": {"enum": ["销售1", "销售2", "销售3"], "type": "string", "title": "销售员"}, "status": {"type": "boolean", "title": "工程师接单"}, "manager": {"enum": ["管理员1", "管理员2", "管理员3"], "type": "string", "title": "管理员"}, "treasurer": {"enum": ["财务1", "财务2", "财务3"], "type": "string", "title": "工程师"}, "feedback": {"type": "string", "title": "客户反馈"}}, "description": "外派单记录"}}, "enkrino": {"graph": {"edges": [{"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "4fd27190-a751-415e-9dbd-8c9188860656", "spec": {"temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": false}}, {"to": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "spec": {"token": 0, "temporary": false}}, {"to": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "from": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "spec": {"token": 0, "temporary": false}}, {"to": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "spec": {"temporary": true}}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "auth": "manager", "name": "选定销售员", "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "auth": "saler", "name": "选定工程师", "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "auth": "treasurer", "name": "工程师接单", "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "auth": "treasurer", "name": "填写客户反馈", "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "auth": "manager", "name": "管理员审核", "backward": 2}]}, "start": "4fd27190-a751-415e-9dbd-8c9188860656", "mirror": {"edges": [{"to": "4fd27190-a751-415e-9dbd-8c9188860656", "from": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b"}, {"to": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "from": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9"}], "nodes": [{"id": "4fd27190-a751-415e-9dbd-8c9188860656", "auth": "manager", "name": "选定销售员", "stack": [18], "backward": 0}, {"id": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "auth": "saler", "name": "选定工程师", "stack": [19, 21], "backward": 0}, {"id": "e8ca1aa2-ac7f-4c28-85fb-6efd44a028f9", "auth": "treasurer", "name": "工程师接单", "stack": [20], "backward": 1}, {"id": "e59e01f5-53cc-4bc5-bd4d-b4a0a6899cdb", "auth": "treasurer", "name": "填写客户反馈", "stack": [], "backward": 0}, {"id": "21f2c4fc-8c4a-4181-a5ed-b8a370a244b2", "auth": "manager", "name": "管理员审核", "stack": [], "backward": 2}]}, "status": "running", "current": "dcd3f8bb-6611-428a-8f64-f1e8ece1a07b", "currentAuth": "saler"}}');

-- 2021-08-29 06:01:57.565125+00