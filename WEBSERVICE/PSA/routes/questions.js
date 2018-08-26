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
        if (error) {
            next(error);
            return;
        }

        connection.query('SELECT * FROM PSA_TESTE;', function(error, results, fields) {
            if (error) {
                next(error);
                return;
            }

            var jsonResponse = {
                resultado : results[0]
            };

            res.writeHead(200,{'Content-Type' : 'text/json'});
            res.json(jsonResponse);
        });
        connection.release();
    });
});

module.exports = router;
