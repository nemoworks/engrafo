const express = require("express");
const { process, db } = require("../database");
var router = express.Router();

router.get("/list", async function (req, res) {
  db.any(process.findAll).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.get("/:id", async function (req, res) {
  db.one(process.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.post("/", async function (req, res) {
  const { formschema, enkrinograph, roles, constraints } = req.body
  db.one(process.insert, [JSON.stringify(formschema), JSON.stringify(enkrinograph), JSON.stringify(roles)], JSON.stringify(constraints)).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.put("/:id", async function (req, res) {
  const { formschema, enkrinograph, roles, constraints } = req.body
  db.result(process.update, [req.params.id, JSON.stringify(formschema), JSON.stringify(enkrinograph), JSON.stringify(roles), JSON.stringify(constraints)]).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

router.delete("/:id", async function (req, res) {
  db.result(process.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => {console.error(err); res.send({message: err.toString()})}
  )
});

module.exports = router;
