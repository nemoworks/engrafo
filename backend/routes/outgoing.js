const express = require("express");
const graph = require("../data-structure/Graph");
const { outgoing } = require("../database/sql");
var router = express.Router();
var pgp = require('pg-promise')(/* options */)
const cn = {
  host: 'localhost',
  port: 28432,
  database: 'ticflow',
  user: 'jieshixin',
  password: 'jieshixin,.#',
  max: 30 // use up to 30 connections

  // "types" - in case you want to set custom type parsers on the pool level
};

var db = pgp(cn)

router.get("/list", async function (req, res) {
  db.any(outgoing.findAll).then(
    data => res.send(data)
  ).catch(
    err => console.log(err)
  )
});

router.get("/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => console.error(err)
  )
});

router.post("/", async function (req, res) {
  const {formdata, process} = req.body
  db.one(outgoing.insert, [JSON.stringify(formdata), process]).then(
    data => res.send(data)
  ).catch(
    err => console.error(err)
  )
});

router.put("/:id", async function (req, res) {
const {formdata, process} = req.body
  db.result(outgoing.update, [req.params.id, JSON.stringify(formdata), process]).then(
    data => res.send(data)
  ).catch(
    err => console.error(err)
  )
});

router.delete("/:id", async function (req, res) {
  db.result(outgoing.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => console.log(err)
  )
});

module.exports = router;
