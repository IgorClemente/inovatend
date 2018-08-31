var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'EXTERNO',
    password: 'Challenge129@',
    database: 'PSA',
    connectTimeout: 10000,
    multipleStatements: true
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

        const queryStatement = "SELECT QUESTION_ID \"identifier\",QUESTION_TEXT \"pergunta\", QUESTIONS_RESPONSE_TABLE.RESPONSE_TEXT \"resposta\"\n" +
            "FROM QUESTIONS_TABLE  JOIN QUESTIONS_RESPONSE_TABLE \n" +
            "ON QUESTIONS_TABLE.QUESTION_RESPONSE_ID = QUESTIONS_RESPONSE_TABLE.RESPONSE_ID;" ;

        const alternativesQuestionsQueryStatement = "SELECT QUESTIONS_TABLE.QUESTION_ID, ALTERNATIVE_QUESTION_NAME\n" +
            "FROM ALTERNATIVES_QUESTIONS_TABLE JOIN QUESTIONS_TABLE\n" +
            "ON ALTERNATIVES_QUESTIONS_TABLE.QUESTION_ID = QUESTIONS_TABLE.QUESTION_ID;";

        connection.query({sql: (queryStatement + alternativesQuestionsQueryStatement),
                          timeout: 60000}, function(error, results, fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }

            var alternativesQuestionResponse = {};
            var alternativesQuestionControl = 0;

            results[0].forEach(function(question,index) {
                if (!(question["identifier"] == alternativesQuestionControl)) {
                    alternativesQuestionControl = question["identifier"];
                }
                alternativesQuestionResponse["identifier"] = "";
            });

            console.log(alternativesQuestionResponse);

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

       const alternativeQuestion01 = req.body.alternativeQuestion01 || "";
       const alternativeQuestion02 = req.body.alternativeQuestion02 || "";
       const alternativeQuestion03 = req.body.alternativeQuestion03 || "";
       const alternativeQuestion04 = req.body.alternativeQuestion04 || "";

       var alternativesQuestions = [alternativeQuestion01,alternativeQuestion02,alternativeQuestion03,alternativeQuestion04];

       connection.query('INSERT INTO QUESTIONS_RESPONSE_TABLE SET ?;',{'RESPONSE_TEXT':questionResponseText}, function(error,results,fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }

            const questionResponseID = results.insertId;

            var questionParametersStatement = {
                'QUESTION_TEXT' : questionText,
                'QUESTION_RESPONSE_ID' : questionResponseID
            };

            connection.query('INSERT INTO QUESTIONS_TABLE SET ?;',questionParametersStatement, function(error,results,fields) {
                if (error) {
                    res.json({
                        'success' : false,
                        'errorMessage' : error
                    });
                }
                alternativesQuestions.forEach(function(value,_) {
                    connection.query('INSERT INTO ALTERNATIVES_QUESTIONS_TABLE SET ?;',
                                    {'ALTERNATIVE_QUESTION_NAME':value, 'QUESTION_ID':results.insertId}, function(error,_,_) {
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
