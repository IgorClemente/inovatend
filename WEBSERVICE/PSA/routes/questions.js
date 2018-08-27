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
        connection.query('SELECT * FROM QUESTIONS;', function(error, results, fields) {
            if (error) {
                next(error);
                return;
            }

            var jsonResponse = {
                'resultado' : results[0]
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
           return;
       }

       const questionText = req.body.questionText | " ";
       const questionResponseIdentifier = req.body.questionResponseID | " ";

       connection.query('INSERT INTO QUESTIONS(QUESTION_TEXT,QUESTION_RESPONSE_ID) VALUES (?,?);',
                       [questionText, questionResponseIdentifier], function(error, results, fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                return;
            }

            var jsonRespose = {
                'success' : true,
                'successMessage' : 'Pergunta cadastrada com sucesso!'
            };
            res.json();
       });
    });
});

module.exports = router;
