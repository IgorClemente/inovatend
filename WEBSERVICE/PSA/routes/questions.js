var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'ec2-34-236-153-149.compute-1.amazonaws.com',
    username: 'PSA',
    password: 'Challenge129@',
    database: 'mysql',
    port: 3306
});

router.get('/', function(req, res, next) {
    pool.getConnection(function(error, connection) {
        connection.query('SELECT * FROM BASE_TESTE;', function(error, results, fields) {
            console.log(results)
        });
    });
});

module.exports = router;
