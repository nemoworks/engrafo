var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (res, next) {
  res.render('index', { title: 'Expressssss' });
});

module.exports = router;
