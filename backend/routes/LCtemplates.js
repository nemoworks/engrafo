const express = require("express");
const { LCtemplates, db } = require("../database");
var router = express.Router();

const {authentication} = require('../utils/oauth')

// router.use(function(req,res,next){
//   const auth=req.get("Authorization")
//   if(auth==undefined) res.status(401).send({message:'no authorization'})
//   else{
//     authentication(auth).then(data=>{
//       console.log(data)
//       next()
//     }).catch(err=>{
//       res.status(401).send(err.response.data)
//     })
//   }
// })

/* LCtemplatesList */
router.get("/list", async function (_, res) {
  db.any(LCtemplates.findAll)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

/* LCtemplates */
router.get("/:id", async function (req, res) {
  db.one(LCtemplates.find, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/", async function (req, res) {
  db.one(LCtemplates.insert, JSON.stringify(req.body.lifecycle))
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.put("/:id", async function (req, res) {
  db.result(LCtemplates.update, [req.params.id, JSON.stringify(req.body)])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.delete("/:id", async function (req, res) {
  db.result(LCtemplates.delete, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

module.exports = router;
