const express = require("express");
const { account, db } = require("../database");
var router = express.Router();

const { authentication } = require('../utils/oauth')

router.use(function (req, res, next) {
  const auth = req.get("Authorization")
  if (auth == undefined) res.status(401).send({ message: 'no authorization' })
  else {
    authentication(auth).then(data => {
      console.log(data)
      next()
    }).catch(err => {
      res.status(401).send(err.response.data)
    })
  }
})

const salers = [
  {id:"1",name:"销售1"},
  {id:"2",name:"销售2"},
]

router.post("/salerslist", async function (req, res) {
  const { key } = req.body
  res.send(salers)
});

router.get("/salerslist", async function (req, res) {
  res.send(salers)
});

module.exports = router;
