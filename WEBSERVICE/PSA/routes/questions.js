var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'ec2-34-201-112-184.compute-1.amazonaws.com',
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

        const questionsQueryStatement = "SELECT QUESTION_ID \"identifier\",QUESTION_TEXT \"question_text\", " +
                               "QUESTIONS_RESPONSE_TABLE.RESPONSE_TEXT \"question_response_text\",\n" +
                               "QUESTION_RESPONSE_ID \"question_response_identifier\"\n" +
                               "FROM QUESTIONS_TABLE  JOIN QUESTIONS_RESPONSE_TABLE \n" +
                               "ON QUESTIONS_TABLE.QUESTION_RESPONSE_ID = QUESTIONS_RESPONSE_TABLE.RESPONSE_ID;";

        const alternativesQuestionsQueryStatement = "SELECT ALTERNATIVES_QUESTIONS_TABLE.ALTERNATIVE_QUESTION_ID \"identifier\", ALTERNATIVE_QUESTION_NAME \"alternative_question_text\",\n" +
                                                    "QUESTIONS_TABLE.QUESTION_ID \"question_id\"\n" +
                                                    "FROM ALTERNATIVES_QUESTIONS_TABLE JOIN QUESTIONS_TABLE\n" +
                                                    "ON ALTERNATIVES_QUESTIONS_TABLE.QUESTION_ID = QUESTIONS_TABLE.QUESTION_ID;";

        connection.query({ sql: (questionsQueryStatement + alternativesQuestionsQueryStatement),
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
                return;
            }

            let alternativesQuestionResponseArray = [];

            results[0].forEach(function(question,_) {
                let alternativeQuestions = results[1].filter(function(element,_,_) {
                    return element['question_id'] === question['identifier'];
                });

                alternativeQuestions.forEach(function(response,index) {
                    const alternativeQuestionResponseObject = {
                        'identifier' : response['identifier'],
                        'alternative_question' : response['alternative_question_text']
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

       if (req.body.questionText === undefined) {
           if (req.body.questionText === "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da questão, parametro: \'questionText\''
               });
               return;
           }
       } else {
           if (req.body.questionText === "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da questão, parametro: \'questionText\''
               });
               return
           }
       }

       if (req.body.questionResponseText === undefined) {
           if (req.body.questionResponseText === "") {
               res.json({
                   'sucess': false,
                   'errorMessage': 'Informar o parametro referente ao texto de resposta da questão, parametro: \'questionResponseText\''
               });
               return;
           }
       } else {
           if (req.body.questionResponseText === "") {
               res.json({
                   'success': false,
                   'errorMessage': 'Informar o parametro referente ao texto da questão, parametro: \'questionResponseText\''
               });
               return;
           }
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
               break;
           case '2':
               questionResponseParameterText = req.body.alternativeQuestion02;
               break;
           case '3':
               questionResponseParameterText = req.body.alternativeQuestion03;
               break;
           case '4':
               questionResponseParameterText = req.body.alternativeQuestion04;
               break;
           default:
               res.json({
                   'success':false,
                   'errorMessage':'Informar o parametro referente ao identificador da resposta, parametro: \'questionResponseIdentifier\''
               });
               return;
       }

       connection.query('INSERT INTO QUESTIONS_RESPONSE_TABLE SET ?;',{ 'RESPONSE_TEXT' : questionResponseParameterText }, function(error,results,fields) {
            if (error) {
                res.json({
                    'success' : false,
                    'errorMessage' : error
                });
                connection.destroy();
                return;
            }

            const questionResponseID = results.insertId;

            const questionParametersStatement = {
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

                alternativesQuestions.forEach(function(value,index) {
                    connection.query('INSERT INTO ALTERNATIVES_QUESTIONS_TABLE SET ?;',{ 'ALTERNATIVE_QUESTION_NAME' : value, 'QUESTION_ID' : results.insertId }, function(error,alternativesResult,_) {
                        if (error) {
                            res.json({
                                'success' : false,
                                'errorMessage' : error
                            });
                            connection.release();
                            return;
                        }

                        if ((index + 1) == questionResponseIdentifier) {
                            const questionResponseIdentifierQuery = 'UPDATE QUESTIONS_RESPONSE_TABLE SET ? WHERE ?;';
                            const questionResponseParameter = [{ ALTERNATIVE_QUESTION_ID : alternativesResult.insertId },{ RESPONSE_ID : questionResponseID }];

                            connection.query(questionResponseIdentifierQuery,questionResponseParameter, function(error,results,fields) {
                                if (error) {
                                    res.json({
                                        'success' : false,
                                        'errorMessage' : error
                                    });
                                    connection.release();
                                    return;
                                }

                                let jsonResponse = {
                                    'success' : true,
                                    'successMessage' : 'Pergunta cadastrada com sucesso!'
                                };

                                res.json(jsonResponse);
                            });
                        }
                    });
                });
            });
       });
       connection.release();
    });
});

router.put('/update/:questionID', function(req,res,next) {

    const questionIdentifierParameter = req.params.questionID;
    const questionsTableConsultQuery = "SELECT QUESTION_ID \"question_identifier\",\n" +
                                       "QUESTION_TEXT \"question_text\",\n" +
                                       "QUESTION_RESPONSE_ID \"responseIdentifier\" \n" +
                                       "FROM QUESTIONS_TABLE \n" +
                                       "WHERE QUESTION_ID = ?;";

    pool.getConnection(function(error, connection) {
        if (error) {
            res.json({
                'success' : false,
                'errorMessage' : 'Erro ao atualizar a questão, Erro ao abrir conexão com a base.'
            });
            return;
        }

        connection.query(questionsTableConsultQuery,[questionIdentifierParameter], function(error,questionsResults,fields) {
            if (questionsResults.lenght == 0) {
                res.json({
                    'success' : false,
                    'errorMessage' : 'Erro ao atualizar a questão, Por favor verifique o parametro de \'identificador\''
                });
                connection.release();
                return;
            }

            if (error) {
                res.json({
                    'success': false,
                    'errorMessage': error
                });
                connection.release();
                return;
            }

            const questionAlternativesQuery = "SELECT ALTERNATIVE_QUESTION_ID \"alternative_question_identifier\",\n" +
                                              "ALTERNATIVE_QUESTION_NAME \"alternative_question_text\",\n" +
                                              "QUESTION_ID \"question_id\"\n" +
                                              "FROM ALTERNATIVES_QUESTIONS_TABLE;";

            connection.query(questionAlternativesQuery, function(error,alternativeResults,fields) {
                var questionAlternativesArray = alternativeResults.filter(function(alternativeQuestion) {
                    return alternativeQuestion['question_id'] == questionIdentifierParameter;
                });

                if (questionAlternativesArray.length == 0) {
                    res.json({
                        'success': false,
                        'errorMessage': 'Questão não encontrada, parametro identificador do usuário é inválido.'
                    });
                    connection.release();
                    return;
                }

                questionAlternativesArray = questionAlternativesArray.sort(function(a,b) {
                    return a['alternative_question_identifier'] > b['alternative_question_identifier'];
                });

                const questionText = req.body.questionText || alternativeResults['question_text'];
                const questionResponseIdentifier = req.body.questionResponseIdentifier;

                var alternativesQuestions = [
                    req.body.alternativeQuestion01,
                    req.body.alternativeQuestion02,
                    req.body.alternativeQuestion03,
                    req.body.alternativeQuestion04
                ];

                const questionsTableUpdateStatement = [{'QUESTION_TEXT' : questionText}, {'QUESTION_ID' : questionsResults[0]['question_identifier']}];

                connection.query('UPDATE QUESTIONS_TABLE SET ? WHERE ?',questionsTableUpdateStatement,function(error,results,fields) {
                        if (error) {
                            res.json({
                                'success' : false,
                                'errorMessage' : 'Erro ao atualizar as alternativas referente a questão.'
                            });
                            connection.release();
                            return;
                        }

                        questionAlternativesArray.forEach(function(alternativeQuestion, index) {
                            var alternativeQuestionText = alternativesQuestions[index];

                            if (alternativeQuestionText === undefined) {
                                if (alternativeQuestionText === '') {
                                    alternativeQuestionText = alternativeQuestion['alternative_question_text'];
                                }
                            }

                            var alternativesQuestionsParametersObject = [{'ALTERNATIVE_QUESTION_NAME' : alternativeQuestionText},
                                                                         {'ALTERNATIVE_QUESTION_ID': alternativeQuestion['alternative_question_identifier']}]

                            pool.query('UPDATE ALTERNATIVES_QUESTIONS_TABLE SET ? WHERE ?', alternativesQuestionsParametersObject,
                                function(error,results,fields) {
                                    if (error) {
                                        res.json({
                                            'success' : false,
                                            'errorMessage' : 'Erro ao atualizar as alternativas referente a questão.'
                                        });
                                        return;
                                    }
                                });
                        });
                        res.end();
                });

                var questionResponseParameterText = "";

                if (req.body.questionResponseIdentifier === undefined) {
                    if (req.body.questionResponseIdentifier === "") {
                        res.json({
                            'success':false,
                            'errorMessage':'Informar o parametro referente ao identificador para selecionar a resposta para a questão, parametro: \'questionResponseIdentifier\''
                        });
                        connection.release();
                        return;
                    }
                }

                switch (questionResponseIdentifier) {
                    case '1':
                        questionResponseParameterText = req.body.alternativeQuestion01;
                        break;
                    case '2':
                        questionResponseParameterText = req.body.alternativeQuestion02;
                        break;
                    case '3':
                        questionResponseParameterText = req.body.alternativeQuestion03;
                        break;
                    case '4':
                        questionResponseParameterText = req.body.alternativeQuestion04;
                        break;
                    default:
                        res.json({
                            'success':false,
                            'errorMessage':'Informar o parametro válido referente ao identificador para selecionar a resposta para a questão, parametro: \'questionResponseIdentifier\''
                        });
                        connection.release();
                        return;
                }

                connection.query('UPDATE QUESTIONS_RESPONSE_TABLE SET ? WHERE ?;',
                                 [{RESPONSE_TEXT : questionResponseParameterText}, {RESPONSE_ID : questionsResults[0]['responseIdentifier']}], function(error,results,fields) {
                    if (error) {
                        res.json({
                            'success' : false,
                            'errorMessage' : 'Erro ao atualizar a resposta da questão. Verifique os parametros de entrada'
                        });
                        return;
                    }
                });

                res.json({
                    'success' : true,
                    'successMessage' : 'Questão atualizada com sucesso.'
                });
                connection.release();
            });
        });
    });
});


router.delete('/delete/:questionID', function(req,res,next) {

    let questionIdentifierParameter = req.params.questionID;
    let alternativesQuestionDeleteQuery = "DELETE FROM ALTERNATIVES_QUESTIONS_TABLE WHERE ?;";

    pool.getConnection(function(error,connection) {
       if (error) {
           res.json({
               'success' : false,
               'errorMessage' : 'Erro ao deletar questão, Conexão não efetuada.'
           });
           return;
       }

       let questionsRequestQuery = 'SELECT QUESTION_ID "questionIdentifier",\n' +
                                   'QUESTION_TEXT "questionText",\n' +
                                   'QUESTION_RESPONSE_ID "questionResponseIdentifier"\n' +
                                   'FROM QUESTIONS_TABLE\n' +
                                   'WHERE ?;';

       connection.query(questionsRequestQuery,{ QUESTION_ID : questionIdentifierParameter }, function(error,questionsRequestResult,fields) {
           if (error) {
               res.json({
                   'success' : false,
                   'errorMessage' : 'Erro ao buscar questões cadastradas.'
               });
               connection.release();
               return;
           }

           if (!(questionsRequestResult.length > 0)) {
               res.json({
                   'success' : false,
                   'errorMessage' : 'Questão não encontrada, Por favor verifique o parametro identificador da questão.'
               });
               connection.release();
               return;
           }

           connection.beginTransaction(function(error) {
               if (error) {
                   res.json({
                       'success' : false,
                       'errorMessage' : 'Erro ao abrir transação.'
                   });
                   connection.release();
                   return;
               }

               connection.query(alternativesQuestionDeleteQuery,[{QUESTION_ID : questionIdentifierParameter}], function(error,deleteAlternativesQuestionResult,fields) {
                   if (error) {
                       res.json({
                           'success' : false,
                           'errorMessage' : 'Erro ao deletar questão, A execução da Statement retornou uma falha.'
                       });

                       return connection.rollback(function(error) {
                           res.json({
                               'success' : false,
                               'errorMessage' : 'Erro ao reverter transação.'
                           });
                       });
                   }

                   let questionsDeleteQuery = "DELETE FROM QUESTIONS_TABLE WHERE ?;";
                   connection.query(questionsDeleteQuery,[{QUESTION_ID : questionIdentifierParameter}], function(error,deleteResponseQuestionResult,fields) {
                       if (error) {
                           res.json({
                               'success' : false,
                               'errorMessage' : 'Erro ao deletar alternatives question, A execução da Statement retornou uma falha.'
                           });

                           return connection.rollback(function(error) {
                               res.json({
                                   'success' : false,
                                   'errorMessage' : 'Erro ao reverter transação.'
                               });
                           });
                       }

                       let questionsResponseDeleteQuery = "DELETE FROM QUESTIONS_RESPONSE_TABLE WHERE ?;";
                       connection.query(questionsResponseDeleteQuery,[{RESPONSE_ID : questionIdentifierParameter}], function(error,deleteQuestionsResult,fields) {
                           if (error) {
                               res.json({
                                   'success' : false,
                                   'errorMessage' : 'Error ao deletar questions, A execução da Statement retornou uma falha.'
                               });

                               return connection.rollback(function(error) {
                                   res.json({
                                       'success' : false,
                                       'errorMessage' : 'Erro ao reverter transação.'
                                   });
                               });
                           }

                           connection.commit(function(error) {
                               if (error) {
                                   return connection.rollback(function(error) {
                                       res.json({
                                           'success' : false,
                                           'errorMessage' : 'Erro ao reverter transação.'
                                       });
                                   });
                               }
                           });

                           res.json({
                               'success': true,
                               'successMessage': 'Questão deletada com sucesso.'
                           });
                       });
                   });
               });
           });
       });
    });
});

router.post('/response/:question_identifier', function(req,res,next) {

    const questionIdentifierQueryStringParam = req.params.question_identifier;
    const questionResponseIdentifier = req.body.question_response_identifier;

    const questionsTableQuery = "SELECT QUESTION_ID \'questionIdentifier\', " +
                                "QUESTION_TEXT \'questionText\', " +
                                "QUESTION_RESPONSE_ID \'questionResponseIdentifier\' \n" +
                                "FROM QUESTIONS_TABLE WHERE ?";

    const questionsTableQueryParameters = { QUESTION_ID : questionIdentifierQueryStringParam };

    if ((questionIdentifierQueryStringParam === undefined) || (questionResponseIdentifier === undefined)) {
        if ((questionIdentifierQueryStringParam == '') || (questionResponseIdentifier == '')) {
            res.json({
                'success': false,
                'errorMessage': 'Erro ao responder questão, Por favor verifique o parametro de identificação da Questão e Resposta da Questão.'
            });
            return;
        }
    }

    pool.getConnection(function(error,connection) {
       let query = connection.query(questionsTableQuery, questionsTableQueryParameters, function(error,results,fields) {
           if (error) {
               res.json({
                   'success' : false,
                   'errorMessage' : 'Erro ao consultar questão cadastrada, A execução da Statement retornou um erro'
               });
               connection.release();
               return;
           }

           if(!(results.length > 0)) {
               res.json({
                   'success' : false,
                   'errorMessage' : 'A consulta não retornou nenhuma questão para o identificador enviado como parametro.'
               });
               connection.release();
               return;
           }

           const questionResultIdentifier = results[0].questionIdentifier;
           const questionResultResponseIdentifier = results[0].questionResponseIdentifier;

           const questionResultResponseCheckQuery = 'SELECT RESPONSE_ID "responseIdentifier", ' +
                                                    'ALTERNATIVE_QUESTION_ID "alternativeQuestionIdentifier"' +
                                                    'FROM QUESTIONS_RESPONSE_TABLE WHERE ?';

           const questionResultResponseCheckQueryParameters = { RESPONSE_ID : questionResultResponseIdentifier };

           connection.query(questionResultResponseCheckQuery,questionResultResponseCheckQueryParameters, function(error,results,fields) {
                if (error) {
                    res.json({
                        'success': false,
                        'errorMessage': error
                    });
                    connection.release();
                    return;
                }

                let alternativeQuestionIdentifier = results[0]['alternativeQuestionIdentifier'];

                const alternativeQuestionQuery = 'SELECT RESPONSE_ID "responseQuestionIdentifier",\n' +
                                                 'ALTERNATIVE_QUESTION_ID "alternativeQuestionIdentifier"\n' +
                                                 'FROM QUESTIONS_RESPONSE_TABLE\n' +
                                                 'WHERE ?;';

                const alternativeQuestionQueryParameters = { RESPONSE_ID :  questionResultResponseIdentifier}

                connection.query(alternativeQuestionQuery,alternativeQuestionQueryParameters, function(error,results,fields) {
                    if (error) {
                        res.json({
                            'success' : false,
                            'errorMessage' : error
                        });
                        connection.release();
                        return;
                    }

                    let questionsResponseTableIdentifier = results[0]['alternativeQuestionIdentifier'];
                    console.log(alternativeQuestionIdentifier == questionsResponseTableIdentifier);
                    console.log(alternativeQuestionIdentifier);
                    console.log(questionsResponseTableIdentifier);
                    if (alternativeQuestionIdentifier == questionsResponseTableIdentifier) {
                        res.json({
                            'success' : true,
                            'successMessage' : 'Questão correta!'
                        });
                        connection.release();
                        return;
                    }

                    res.json({
                        'success' : false,
                        'errorMessage' : 'Questão incorreta!'
                    });
                    connection.release();
                });
           });
       });

       console.log(query.sql);
    });
});

module.exports = router;
