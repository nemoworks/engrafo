const express = require("express");
const { account, db } = require("../database");
var router = express.Router();

const {authentication} = require('../utils/oauth')

router.use(function(req,res,next){
  const auth=req.get("Authorization")
  if(auth==undefined) res.status(401).send({message:'no authorization'})
  else{
    authentication(auth).then(data=>{
      console.log(data)
      next()
    }).catch(err=>{
      res.status(401).send(err.response.data)
    })
  }
})

router.get("/list", async function (req, res) {
  db.any(account.findAll).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.get("/:id", async function (req, res) {
  db.one(account.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.post("/", async function (req, res) {
  const { username, password, role } = req.body
  db.one(account.insert, [username, password, role]).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.put("/:id", async function (req, res) {
  const { username, password, role } = req.body
  db.result(account.update, [req.params.id, username, password, role]).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.delete("/:id", async function (req, res) {
  db.result(account.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

module.exports = router;
