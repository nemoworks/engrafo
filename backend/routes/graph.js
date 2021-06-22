var express = require('express');
var router = express.Router();

/* GET graph data */
router.get('/graph', function(req, res, next) {
  res.render('index', { title: 'graph' });
});

/* GET graph current node */
router.get('/graph/current', function(req, res, next) {
  res.render('index', { title: 'nodes' });
})

/* GET graph 


module.exports = router;
