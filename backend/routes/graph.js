var express = require("express");
var router = express.Router();

/* GraphList */
router.get("/graphapis/graphs", function (req, res, next) {
  res.send([]);
});

/* Graph */
router.get("/graph/:id", function (req, res, next) {
  res.send("graph fetched with" + req.params.id);
});

router.post("/graph", function (req, res, next) {
  res.send("graph created with" + JSON.stringify(req.body));
});

router.put("/graph", function (req, res, next) {
  res.send("graph updated with" + JSON.stringify(req.body));
});

router.delete("/graph/:id", function (req, res, next) {
  res.send("graph deleted with" + req.params.id);
});

module.exports = router;
