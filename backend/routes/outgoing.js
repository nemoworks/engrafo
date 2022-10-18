const express = require("express");
const { outgoing, context, account, db, FStemplates } = require("../database");
const LCengine = require("../LCengine");
var router = express.Router();
const { findFile, storeFile, downloadFile } = require('../utils/minio')
const { getUsernameFromAccessToken } = require('../utils/oauth')

const { authentication } = require('../utils/oauth')
const { traverse, findPosition } = require('../utils/link')

// router.use(function (req, res, next) {
//   const auth = req.get("Authorization")
//   if (auth == undefined) res.status(401).send({ message: 'no authorization' })
//   else {
//     authentication(auth).then(data => {
//       console.log(data)
//       next()
//     }).catch(err => {
//       res.status(401).send(err.response.data)
//     })
//   }
// })

router.get("/list", async function (req, res) {
  db.any(outgoing.findAll)
    .then((data) => res.send(data))
    .catch((err) => {
      console.error(err);
      res.send({ message: err.toString() });
    });
});

router.get("/listOfFStemplates/:id", async function (req, res) {
  db.one(FStemplates.find, req.params.id).then(data => {
    const { fieldschema: { title } } = data.formschema
    console.log(title)
    db.any(
      outgoing.findByJsonb,
      JSON.stringify({
        schema: {
          fieldschema: {
            title
          }
        }
      })
    )
      .then((data) => res.send(data))
      .catch((err) => {
        console.error(err);
        res.send({ message: err.toString() });
      });
  }).catch((err) => {
    console.error(err);
    res.send({ message: err.toString() });
  });
});

router.get("/authedlist", async function (req, res) {
  const accessToken = req.get("Authorization").replace('Bearer ', '')
  const username = getUsernameFromAccessToken(accessToken)
  db.one(account.findByUsername, username).then(
    data => {
      db.any(
        outgoing.findByJsonb,
        JSON.stringify({
          enkrino: {
            currentAuth: data.role,
          },
        })
      )
        .then((data) => res.send(data))
        .catch((err) => {
          console.error(err);
          res.send({ message: err.toString() });
        });
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )

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
    .then((data) => {
      res.send(data)
      // const { lifecycle: { schema: { fieldschema } } } = data
      // var links = []
      // traverse(fieldschema, links)
      // console.log(JSON.stringify(links))
      // links.forEach((value,index)=>{
      //   const {title,path}=value
      //   db.one(FStemplates.findByJsonb, JSON.stringify({ fieldschema: { title } }))
      //     .then(FStemplatesData => {
      //       findPosition(fieldschema,path,0,FStemplatesData.formschema.fieldschema)
      //       if(index===links.length-1) {
      //         data.lifecycle.schema.fieldschema=fieldschema
      //         res.send(data)
      //       }
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      // })
    })
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
  const { schema: { uischema } } = lifecycle
  for (const key in uischema) {
    if (Object.prototype.toString.call(uischema[key] === '[Object Object]')) {
      findFile(uischema[key], formdata, key)
    } else if (key === 'ui:widget' && uischema[key] === 'base64-file') {
      formdata = storeFile(formdata)
    }
  }
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

router.get("/file/:filename", async function (req, res) {
  downloadFile(res, req.params.filename)
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
