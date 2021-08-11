const express = require("express");
const { outgoing, db } = require("../database");
var router = express.Router();

router.get("/list", async function (req, res) {
  db.any(outgoing.findAll).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.get("/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.post("/", async function (req, res) {
  const { formdata, process } = req.body
  db.one(outgoing.insert, [JSON.stringify(formdata), process]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.put("/:id", async function (req, res) {
  const { formdata, process } = req.body
  db.result(outgoing.update, [req.params.id, JSON.stringify(formdata), process]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.delete("/:id", async function (req, res) {
  db.result(outgoing.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

module.exports = router;
