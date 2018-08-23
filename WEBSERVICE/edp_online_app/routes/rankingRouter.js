/**
 * Created by root on 06/10/17.
 */

var mysql   = require('mysql');
var express = require('express');
var fs      = require('fs');
var router  = express.Router();


router.get('/',function(req, res, next){
    poolCon.getConnection(function(err,connection){
        if(err) { next(err) }
        connection.query('SELECT nome,pontos FROM IGOR ORDER BY pontos DESC LIMIT 10;',{},function(err,result,fields){
            res.json({
                resultado: result
            });
            connection.release();
        });
    });
});

module.exports = router;