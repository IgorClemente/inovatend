var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var fs = require('fs');
var Jimp = require('jimp');
var methodOverride = require('method-override');

var index = require('./routes/index');
var imagens = require('./routes/imagens');
var users   = require('./routes/users');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(methodOverride('_method'));

app.use('/',index);


function comprimirImagens(idImage) {

    Jimp.read(__dirname+'/public/imagensUpload/'+'arvore45124712864'+idImage+'.png',function(err,imagem){
        imagem.resize(400,400)
              .quality(60)
              .rotate(90)
              .write(__dirname+'/public/imagensComprimidas/'+'comprimida45124712864'+idImage+'.jpg');
    });
}


var connectionPool = mysql.createPool({
    host     : 'us-cdbr-sl-dfw-01.cleardb.net',
    user     : 'bfa33d68adf0e0',
    password : '43fcef0e',
    database : 'ibmx_c5c727acd1722b7',
    multipleStatements: true,
    connectionLimit: 5
});

app.get('/teste/raiz', function(req,res,next) {
    console.log("Console Log ENDPOINT OK!")
})

app.get('/users/:cpf',function(req,res,next) {
    connectionPool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM users WHERE ? ;' +
            'SELECT COUNT(*) AS quantidade FROM ARVORES WHERE dono_arvore = 45124712864;' +
            'SELECT arvore_id FROM ARVORES WHERE dono_arvore = 45124712864', {cpf_user: req.params.cpf},
            function (err, result, fields) {
                if(err){next(err);}
                res.set('Access-Control-Allow-Origin','*');
                res.set('Access-Control-Allow-Methods','GET, POST');
                res.json({
                    usuario:result[0],
                    arvores:result[1][0],
                    arvore_ids:result[2]
                });
            });
        connection.release();
    });
});

app.get('/imagens/arvore/:id',function(req,res,next){
    connectionPool.getConnection(function(err,connection) {
        connection.query('SELECT * FROM ARVORES WHERE ?', {arvore_id: req.params.id}, function (err, result, fields) {
            if (err) { next(err);}
            res.json({
                arvore: result[0]
            });
        });
        connection.release();
    });
});

app.get('/imagens/:id',function(req,res,next){
    fs.readFile('./public/imagensComprimidas/comprimida45124712864'+req.params.id+'.jpg',function(err,imagem){
        if(err){next(err)}
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(imagem);
    });
});

app.get('/usuarios',function(req, res, next){
    connectionPool.getConnection(function(err,connection){
        if(err) { next(err) }
        connection.query('SELECT id,nome,pontos FROM IGOR ORDER BY pontos DESC LIMIT 10;',{},function(err,result,fields){
            res.json({
                resultado: result
            });
        });
        connection.release();
    });
});


app.get('/usuarios/pictures/:id',function(req,res,next){
    fs.readFile('./public/imagensPerfil/perfil'+req.params.id+'.jpg',function(err,imagem){
        if(err){next(err)}
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(imagem);
    });
});


app.post('/upload', function(req, res, next){
   if(!req.files) {
       return res.status(400).send('Nao tem Arquivos - NOK');
   }

   var sampleFile = req.files.sampleFile;

   console.log("XMA",req.body)

   connectionPool.getConnection(function(err,connection){
       connection.query('INSERT INTO ARVORES SET ?',{'titulo':req.body.title,
               'pontos':350,'dono_arvore':'45124712864', 'localidade':'Guarulhos',
               'longitude':req.body.longitude, 'latitude':req.body.latitude,
               'street':req.body.street, 'country':req.body.sublocality,
               'state':req.body.state, 'city':req.body.city, 'photo_date':req.body.datePhoto },
           function(err,result,fields){
               if(err) { next(err); }
               var idArvoreBanco = result.insertId;

               sampleFile.mv(__dirname+'/public/imagensUpload/' + 'arvore45124712864' + idArvoreBanco + '.png',function(err){
                   if (err){ return res.status(500).send(err); }
                   console.log(req.body)
               });
               comprimirImagens(result.insertId)
               res.json({result: 'Imagem Salva e Comprimida com Sucesso'})
       });
       connection.release();
   });
});

app.put('/upload/user', function(req, res, next) {
    var bodyReq = req.body
    connectionPool.getConnection(function(err,connection) {
        connection.query('UPDATE USERS SET ? WHERE ?',[bodyReq,{'id_user':bodyReq.id_user}],function(err,results,fields){
            if(err) { next(err); }
            res.end('Hello from server, update OK');
        });
        connection.release();
    });
});


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


var appEnv = cfenv.getAppEnv();

app.listen(8080, function() {
    console.log("server starting on" + 8080);
});
