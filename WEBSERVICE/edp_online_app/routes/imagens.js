var express = require('express');
var fs      = require('fs');
var router  = express.Router();
var mysql   = require('mysql');


var connection = mysql.createConnection({
    host     : 'us-cdbr-sl-dfw-01.cleardb.net',
    user     : 'bfa33d68adf0e0',
    password : '43fcef0e',
    database : 'ibmx_c5c727acd1722b7'
});

router.get('/arvore/:id',function(req,res,next){
    connection.connect(function(err){
        if(err) {
            console.log("Erro de Conexao ao BD",err.stack);
            return
        };
        console.log("Conexao efetuada com Sucesso, ID:",connection.threadId);
        connection.query('SELECT titulo,pontos FROM ARVORES WHERE ?',{arvore_id:req.params.id},function(err,result,fields){
            if(err){next(err)}
            res.json({
                arvore: result
            });
            connection.destroy();
        });
    });
});


router.get('/:id',function(req,res,next){
    fs.readFile('./imagens/arvore45124712864'+req.params.id+'.png',function(err,imagem){
        if(err){next(err)}
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(imagem);
    });
});


router.post('/arvore/salvar',function(req,res,next){
    console.log("RESP EXEC",req.body);
    res.send("Hello From Server");
});

module.exports = router;