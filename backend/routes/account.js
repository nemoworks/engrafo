const express = require("express");
const { account, db } = require("../database");
var router = express.Router();

router.get("/list", async function (req, res) {
  db.any(account.findAll).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.get("/:id", async function (req, res) {
  db.one(account.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.post("/", async function (req, res) {
  const { username, password, role } = req.body
  db.one(account.insert, [username, password, role]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.put("/:id", async function (req, res) {
  const { username, password, role } = req.body
  db.result(account.update, [req.params.id, username, password, role]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.delete("/:id", async function (req, res) {
  db.result(account.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

module.exports = router;
