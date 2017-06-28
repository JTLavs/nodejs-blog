var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(bodyParser());
app.use(methodOverride());
app.use(require('stylus').middleware({ src : __dirname + '/public'}));
app.use(express.static(__dirname + '/public'))


if(process.env.NODE_ENV == 'development')
	app.use(express.errorHandler({ dumpExceptions : true, showStack : true}));

if(process.env.NODE_ENV == 'production')
	app.use(express.errorHandler());

var articleProvider = new ArticleProvider();

app.get('/', function(req,res){
	articleProvider.findAll(function(error, docs){
		res.send(docs);
	});
})

app.listen(3000);