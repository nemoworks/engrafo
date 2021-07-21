const express = require("express");
const graph = require("../data-structure/Graph");
const router = express.Router();

/* GraphList */
router.get("/list", function (req, res, next) {
  res.send([]);
});

/* Graph */
router.get("/:id", function (req, res, next) {
  res.send("graph fetched with " + req.params.id);
});

router.post("/:type", function (req, res, next) {
  switch (req.params.type) {
    case "string":
      res.send("graph created by string " + JSON.stringify(req.body));
      break;

    default:
      res.send("graph created by JSON " + JSON.stringify(req.body));
      break;
  }
});

router.put("/", function (req, res, next) {
  res.send("graph updated with " + JSON.stringify(req.body));
});

router.delete("/:id", function (req, res, next) {
  res.send("graph deleted with " + req.params.id);
});

module.exports = router;
