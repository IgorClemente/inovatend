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

        const queryStatement = "SELECT QUESTION_ID \"identifier\",QUESTION_TEXT \"question\", QUESTIONS_RESPONSE_TABLE.RESPONSE_TEXT \"question_response\"\n" +
            "FROM QUESTIONS_TABLE  JOIN QUESTIONS_RESPONSE_TABLE \n" +
            "ON QUESTIONS_TABLE.QUESTION_RESPONSE_ID = QUESTIONS_RESPONSE_TABLE.RESPONSE_ID;" ;

        const alternativesQuestionsQueryStatement = "SELECT QUESTIONS_TABLE.QUESTION_ID \"identifier\", ALTERNATIVE_QUESTION_NAME \"alternative_question\"\n"+
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

            if (results[0].length == 0) {
                res.json({
                    'success' : false,
                    'errorMessage' : 'Nenhuma questão cadastrada!'
                });
            }

            var alternativesQuestionResponseArray = [];

            results[0].forEach(function(question, index) {
                var alternativeQuestions = results[1].filter(function(element, index, array) {
                    return element['identifier'] === question['identifier'];
                });

                alternativeQuestions.forEach(function(response,index) {
                    const alternativeQuestionResponseObject = {
                        'identifier' : response['identifier'],
                        'alternative_question' : response['alternative_question']
                    };
                    alternativesQuestionResponseArray.push(alternativeQuestionResponseObject);

                });

                question['alternatives'] = alternativesQuestionResponseArray;
                alternativesQuestionResponseArray = [];
            });

            res.json({
                'success' : true,
                'questions' : results[0]
            });
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

       if (req.body.questionText === "") {
           res.json({
               'success':false,
               'errorMessage':'Informar o parametro referente ao texto da questão, parametro: \'questionText\''
           });
           return;
       }

       if (req.body.questionResponseText === "") {
           res.json({
               'sucess':false,
               'errorMessage':'Informar o parametro referente ao texto de resposta da questão, parametro: \'questionResponseText\''
           });
           return;
       }

       const questionText = req.body.questionText;
       const questionResponseIdentifier = req.body.questionResponseIdentifier;

       if (req.body.alternativeQuestion01 === undefined) {
           if (req.body.alternativeQuestion01 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 01, parametro: \'alternativeQuestion01\''
               });
               return;
           }
       } else {
           if (req.body.alternativeQuestion01 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 01, parametro: \'alternativeQuestion01\''
               });
               return;
           }
       }

       if (req.body.alternativeQuestion02 === undefined) {
           if (req.body.alternativeQuestion02 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 02, parametro: \'alternativeQuestion02\''
               });
               return;
           }
       } else {
           if (req.body.alternativeQuestion02 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 02, parametro: \'alternativeQuestion02\''
               });
               return;
           }
       }

       if (req.body.alternativeQuestion03 === undefined) {
           if (req.body.alternativeQuestion03 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 03, parametro: \'alternativeQuestion03\''
               });
               return;
           }
       } else {
           if (req.body.alternativeQuestion03 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 03, parametro: \'alternativeQuestion03\''
               });
               return;
           }
       }

       if (req.body.alternativeQuestion04 === undefined) {
           if (req.body.alternativeQuestion04 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 04, parametro: \'alternativeQuestion04\''
               });
               return;
           }
       } else {
           if (req.body.alternativeQuestion04 == "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da resposta 04, parametro: \'alternativeQuestion04\''
               });
               return;
           }
       }

       var questionResponseParameterText = " ";
       var alternativesQuestions = [req.body.alternativeQuestion01, req.body.alternativeQuestion02,
                                    req.body.alternativeQuestion03, req.body.alternativeQuestion04];

       switch (questionResponseIdentifier) {
           case '1':
               questionResponseParameterText = req.body.alternativeQuestion01;
           case '2':
               questionResponseParameterText = req.body.alternativeQuestion02;
           case '3':
               questionResponseParameterText = req.body.alternativeQuestion03;
           case '4':
               questionResponseParameterText = req.body.alternativeQuestion04;
           default:
               res.json({
                   'success':false,
                   'errorMessage':'Informar o parametro referente ao identificador da resposta, parametro: \'questionResponseIdentifier\''
               });
               return;
       }

       console.log("DEBUG LOG -> ", questionResponseParameterText);

       connection.query('INSERT INTO QUESTIONS_RESPONSE_TABLE SET ?;',{'RESPONSE_TEXT' : questionResponseParameterText}, function(error,results,fields) {
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
