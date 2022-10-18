const express = require("express");
const { outgoing, context, account, dataset, FStemplates, db } = require("../database");
var router = express.Router();
const { getUsernameFromAccessToken } = require('../utils/oauth')

const { authentication } = require('../utils/oauth')

// router.use(function (req, res, next) {
//   const auth = req.get("Authorization")
//   // console.log(req)
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

router.get("/", async function (req, res) {
  const accessToken = req.get("Authorization").replace('Bearer ', '')
  const username = getUsernameFromAccessToken(accessToken)
  db.one(account.findByUsername, username).then(
    data => {
      db.any(
        dataset.findByAuth,
        data.role
      )
        .then((data) => {
          var dms = new Set()
          data.forEach((value, index) => {
            dms.add(value.datamodel)
          })
          var datamodels = Array.from(dms)
          var result = []
          datamodels.forEach((value) => {
            db.one(FStemplates.find, value)
              .then((data) => { 
                result.push(data)
                if(result.length===datamodels.length) res.send(result)
              })
              .catch((err) => {
                console.error(err);
                res.send({ message: err.toString() });
              });
          })
          if(datamodels.length===0) res.send(result)
        })
        .catch((err) => {
          console.error(err);
          res.send({ message: err.toString() });
        });
    }
  ).catch(
    err => { console.error(err); res.send({ message: err.toString() }) }
  )

});
module.exports = router;
