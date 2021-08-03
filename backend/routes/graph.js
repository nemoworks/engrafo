const express = require("express");
const graph = require("../data-structure/Graph");
const { graphs } = require("../database/sql");
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

/* GraphList */
router.get("/list", async function (req, res) {
  res.send([]);
});

/* Graph */
router.get("/:id", async function (req, res) {
  res.send("graph fetched with " + req.params.id);
});

router.post("/", async function (req, res) {
  console.log('data:', JSON.stringify(req.body))
  db.one(graphs.insert, JSON.stringify(req.body)).then(
    (data) => res.send(data)
  ).catch(
    (err) => console.error(err)
  )
});

router.put("/", async function (req, res) {
  res.send("graph updated with " + JSON.stringify(req.body));
});

router.delete("/:id", async function (req, res) {
  res.send("graph deleted with " + req.params.id);
});

module.exports = router;
