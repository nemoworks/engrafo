const express = require("express");
const { context, db } = require("../database");
var router = express.Router();

const {authentication} = require('../utils/oauth')

router.use(function(req,res,next){
  authentication(req.get("Authorization")).then(data=>{
    console.log(data)
    next()
  }).catch(err=>{
    console.log(err)
  })
})

/* contextList */
router.get("/list", async function (_, res) {
  db.any(context.findAll)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

/* context */
router.get("/:id", async function (req, res) {

  db.one(context.find, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/", async function (req, res) {
  db.one(context.insert, JSON.stringify(req.body.info))
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.put("/:id", async function (req, res) {
  db.result(context.update, [req.params.id, JSON.stringify(req.body)])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.delete("/:id", async function (req, res) {
  db.result(context.delete, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

module.exports = router;
