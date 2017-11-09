var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/pcaplot', function(req, res, next) {
  var dataURL = process.cwd() + '/public/datas/PCA.dat.tsv';
  fs.readFile(dataURL, 'utf8', function (err, d)  {
    res.json(JSON.parse(d));
  });
});

module.exports = router;
