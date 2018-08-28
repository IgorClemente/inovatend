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

        connection.query({sql: 'SELECT * FROM QUESTIONS_TABLE;', timeout: 60000}, function(error, results, fields) {
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
                'questions' : results
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
       const questionResponseText = req.body.questionResponseID;

       const alternativeQuestion01 = req.body.alternativeQuestion01;
       const alternativeQuestion02 = req.body.alternativeQuestion02;
       const alternativeQuestion03 = req.body.alternativeQuestion03;
       const alternativeQuestion04 = req.body.alternativeQuestion04;

       var alternativesQuestions = [alternativeQuestion01,alternativeQuestion02,alternativeQuestion03,alternativeQuestion04];
       console.log(alternativesQuestions);
       connection.query('INSERT INTO QUESTIONS_RESPONSE_TABLE SET ?;', {'RESPONSE_TEXT':questionResponseText}, function(error,results,fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }

            const questionResponseID = results.insertId;

            var questionParameters = {
                'QUESTION_TEXT' : questionText,
                'QUESTION_RESPONSE_ID' : questionResponseID
            };

            connection.query('INSERT INTO QUESTIONS_TABLE SET ?;',questionParameters, function(error,results,fields) {
                if (error) {
                    res.json({
                        'success' : false,
                        'errorMessage' : error
                    });
                }

                alternativesQuestions.forEach(function(value,_) {
                    connection.query('INSERT INTO ALTERNATIVES_QUESTIONS_TABLE SET ?;',
                                    {'ALTERNATIVE_QUESTION_NAME' : value, 'QUESTION_ID' : results.insertId},
                                    function(error,_,_) {
                        if (error) {
                            res.json({
                                'success' : false,
                                'errorMessage' : error
                            });
                        }
                    });
                });

                var jsonResponse = {
                    'success' : true,
                    'successMessage' : 'Pergunta cadastrada com sucesso!'
                };

                res.json(jsonResponse);
            });
       });
       connection.release();
    });
});

module.exports = router;
