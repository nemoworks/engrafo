const express = require("express");
const { outgoing, process, db } = require("../database");
const engine = require("../engine")
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

router.get("/nexts/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => {
      let {process, graphmirror, progress} = data
      db.one(process.find, process).then(
        (enkrinograph) => {
          const {nodes} = enkrinograph
          const current = nodes.find(element => element.id === progress)
          
        }
      ).catch(
        err => {console.error("in finding process", err); res.send({message: err.toString()})}
      )
      res.send({
        
      })
    }
  ).catch(
    err => {console.error("in finding outgoing", err); res.send({message: err.toString()})}
  )
})

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
