const express = require("express");
const { outgoing, db } = require("../database");
const LCengine = require("../LCengine")
var router = express.Router();

router.get("/list", async function (req, res) {
  db.any(outgoing.findAll).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.get("/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.get("/nexts/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => {
      let { lifecycle } = data
      res.send(LCengine.nexts(lifecycle))
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
})

router.post("/start/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => {
      let { lifecycle, formdata } = data
      db.one(outgoing.update, [req.params.id, JSON.stringify(formdata), JSON.stringify(LCengine.start(lifecycle))]).then(
        data => res.send(data)
      ).catch(
        err => { console.error(err); res.send({ message: err.toString() }) }
      )
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
})

router.post("/next/:id/:nid", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => {
      let { lifecycle, formdata } = data
      db.one(outgoing.update, [req.params.id, JSON.stringify(formdata), JSON.stringify(LCengine.next(lifecycle, req.params.nid))]).then(
        data => res.send(data)
      ).catch(
        err => { console.error(err); res.send({ message: err.toString() }) }
      )
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
})

router.post("/finish/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id).then(
    data => {
      let { lifecycle, formdata } = data
      db.result(outgoing.update, [req.params.id, JSON.stringify(formdata), JSON.stringify(LCengine.finish(lifecycle))]).then(
        data => res.send(data)
      ).catch(
        err => { console.error(err); res.send({ message: err.toString() }) }
      )
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
})

router.post("/", async function (req, res) {
  const { formdata, lifecycle } = req.body
  db.one(outgoing.insert, [JSON.stringify(formdata), JSON.stringify(lifecycle)]).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.put("/:id", async function (req, res) {
  const { formdata, lifecycle } = req.body
  db.one(outgoing.update, [req.params.id, JSON.stringify(formdata), JSON.stringify(lifecycle)]).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

router.delete("/:id", async function (req, res) {
  db.result(outgoing.delete, req.params.id).then(
    data => res.send(data)
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )
});

module.exports = router;
