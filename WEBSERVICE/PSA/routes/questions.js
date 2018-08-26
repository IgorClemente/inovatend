var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'ec2-54-226-252-214.compute-1.amazonaws.com',
    user: 'EXTERNO',
    password: 'Challenge129@',
    database: 'PSA'
});

router.get('/', function(req, res, next) {
    pool.getConnection(function(error, connection) {
        connection.query('SELECT * FROM PSA_TESTE;', function(error, results, fields) {
            console.log(results)
        });
    });
});

module.exports = router;
