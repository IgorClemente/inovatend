var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'EXTERNO',
    password: 'Challenge129@',
    database: 'PSA',
    connectTimeout: 10000
});

router.get('/', function(req, res, next) {
    pool.getConnection(function(error, connection) {
        if (error) {
            res.json({
                'success' : false,
                'errorMessage' : error
            });
            connection.destroy();
            return;
        }
        connection.query({sql: 'SELECT * FROM QUESTIONS;', timeout: 60000}, function(error, results, fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }
            var jsonResponse = {
                'success' : true,
                'questions' : results[0]
            };
            res.json(jsonResponse);
        });
        connection.release();
    });
});

router.post('/create', function(req, res, next) {
    pool.getConnection(function(error, connection) {
       if (error) {
           res.json({
               'success' : false,
               'errorMessage' : error
           });
           connection.destroy();
           return;
       }

       const questionText = req.body.questionText;
       const questionResponseIdentifier = req.body.questionResponseID;
        	
       connection.query('INSERT INTO QUESTIONS SET ?;',
                       {'QUESTION_TEXT' : questionText,'QUESTION_RESPONSE_ID' : questionResponseIdentifier }, function(error, results, fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }
            var jsonResponse = {
                'success' : true,
                'successMessage' : 'Pergunta cadastrada com sucesso!'
            };
            res.json(jsonResponse);
       });
       connection.release();
    });
});

module.exports = router;
