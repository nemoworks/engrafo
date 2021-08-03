const express = require("express");
const graph = require("../data-structure/Graph");
var router = express.Router();
var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://jieshixin:jieshixin,.#@127.0.0.1:31080/database')

/* GraphList */
router.get("/list", function (req, res, next) {
  res.send([]);
});

/* Graph */
router.get("/:id", function (req, res, next) {
  res.send("graph fetched with " + req.params.id);
});

router.post("/", function (req, res, next) {
  
});

router.put("/", function (req, res, next) {
  res.send("graph updated with " + JSON.stringify(req.body));
});

router.delete("/:id", function (req, res, next) {
  res.send("graph deleted with " + req.params.id);
});

module.exports = router;
