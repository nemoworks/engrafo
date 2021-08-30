const express = require("express");
const { outgoing, context, db } = require("../database");
const LCengine = require("../LCengine");
var router = express.Router();

router.get("/list", async function (req, res) {
  db.any(outgoing.findAll)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/authedlist/:auth", async function (req, res) {
  db.any(
    outgoing.findByJsonb,
    JSON.stringify({
      enkrino: {
        currentAuth: req.params.auth,
      },
    })
  )
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/nexts/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id)
    .then((data) => {
      let { lifecycle } = data;
      res.send(LCengine.nexts(lifecycle.enkrino));
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/start/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id)
    .then((data) => {
      let { lifecycle, formdata } = data;
      let contextid = "";
      db.one(
        context.insert,
        JSON.stringify({
          message: "start",
          timestamp: Date.now().toString(),
          formdata: formdata,
        })
      )
        .then((data) => {
          contextid = data.id;
        })
        .then(() => {
          db.one(outgoing.update, [
            req.params.id,
            JSON.stringify(formdata),
            JSON.stringify({
              ...lifecycle,
              enkrino: LCengine.start(lifecycle.enkrino, contextid),
            }),
          ])
            .then((data) => res.send(data))
            .catch((err) => {
              console.error(err);
              res.send({ message: "updating outgoing..." + err.toString() });
            });
        })
        .catch((err) => {
          console.error(err);
          res.send({ message: "inserting context..." + err.toString() });
        });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/next/:id/:nid", async function (req, res) {
  db.one(outgoing.find, req.params.id)
    .then((data) => {
      let { lifecycle, formdata } = data;
      if (lifecycle.enkrino.current === req.params.nid) {
        res.send(data);
        return;
      }
      let contextid = "";
      db.one(
        context.insert,
        JSON.stringify({
          message: `${lifecycle.enkrino.current}->${req.params.nid}`,
          timestamp: Date.now().toString(),
          formdata: formdata,
        })
      )
        .then((data) => {
          contextid = data.id;
        })
        .then(() => {
          db.one(outgoing.update, [
            req.params.id,
            JSON.stringify(formdata),
            JSON.stringify({
              ...lifecycle,
              enkrino: LCengine.next(
                lifecycle.enkrino,
                req.params.nid,
                contextid
              ),
            }),
          ])
            .then((data) => res.send(data))
            .catch((err) => {
              console.error(err);
              res.send({ message: "updating outgoing..." + err.toString() });
            });
        })
        .catch((err) => {
          console.error(err);
          res.send({ message: "inserting context..." + err.toString() });
        });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/finish/:id", async function (req, res) {
  db.one(outgoing.find, req.params.id)
    .then((data) => {
      let { lifecycle, formdata } = data;
      db.result(outgoing.update, [
        req.params.id,
        JSON.stringify(formdata),
        JSON.stringify({
          ...lifecycle,
          enkrino: LCengine.finish(lifecycle.enkrino),
        }),
      ])
        .then((data) => res.send(data))
        .catch((err) => {
          console.error(err);
          res.send({ message: err.toString() });
        });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.post("/", async function (req, res) {
  const { formdata, lifecycle } = req.body;
  db.one(outgoing.insert, [JSON.stringify(formdata), JSON.stringify(lifecycle)])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.put("/:id", async function (req, res) {
  const { formdata, lifecycle } = req.body;
  db.one(outgoing.update, [
    req.params.id,
    JSON.stringify(formdata),
    JSON.stringify(lifecycle),
  ])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/formdata/list", async function (req, res) {
  db.any(outgoing.findAllData)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/formdata/:id", async function (req, res) {
  db.one(outgoing.findData, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.put("/formdata/:id", async function (req, res) {
  db.one(outgoing.updateData, [req.params.id, JSON.stringify(req.body)])
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.delete("/:id", async function (req, res) {
  db.result(outgoing.delete, req.params.id)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

module.exports = router;
