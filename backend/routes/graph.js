const express = require("express");
const { graph, db } = require("../database");
var router = express.Router();

/* GraphList */
router.get("/list", async function (req, res) {
  db.any(graph.findAll).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

/* Graph */
router.get("/:id", async function (req, res) {
  db.one(graph.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.post("/", async function (req, res) {
  db.one(graph.insert, JSON.stringify(req.body)).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.put("/:id", async function (req, res) {
  db.result(graph.update, [req.params.id, JSON.stringify(req.body)]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.delete("/:id", async function (req, res) {
  db.result(graph.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

module.exports = router;
