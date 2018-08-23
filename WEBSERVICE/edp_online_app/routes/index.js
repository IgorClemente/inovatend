var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
  fs.readFile(__dirname+'/public/login.html', function(error,html) {
    if(error) { next(error); }
      res.status(200);
      res.contentType("text/html");
      res.end(html);
  });
});

module.exports = router;
