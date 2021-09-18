const express = require("express");
const { FStemplates, db } = require("../database");
var router = express.Router();

const {authentication} = require('../utils/oauth')

router.use(function(req,res,next){
  // console.log(req)
  authentication(req.get("Authorization")).then(data=>{
    console.log(data)
    next()
  }).catch(err=>{
    console.log(err)
  })
})

/* FStemplatesList */
router.get("/list", async function (_, res) {
  db.any(FStemplates.findAll)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

/* FStemplates */
router.get("/:id", async function (req, res) {

  db.one(FStemplates.find, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/", async function (req, res) {
  db.one(FStemplates.insert, JSON.stringify(req.body.formschema))
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.put("/:id", async function (req, res) {
  db.result(FStemplates.update, [req.params.id, JSON.stringify(req.body)])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.delete("/:id", async function (req, res) {
  db.result(FStemplates.delete, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

module.exports = router;
