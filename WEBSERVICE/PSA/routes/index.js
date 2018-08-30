var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir(path.join(__dirname + '/public/index.html'), function(html) {
    res.writeHead(200,"Content-Type : text/html");
    res.write(html);
  });
});

module.exports = router;
