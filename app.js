var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

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

var articleProvider = new ArticleProvider('localhost', 27017)

app.get('/', function(req,res){
	articleProvider.findAll( function(error, docs){
		res.render('index.pug', {
			title : 'Blog',
			articles:docs
	 });
	});
})

app.get('/blog/new', function(req,res){
	res.render('blog_new.pug', { locals : { 
		title : 'New Post'
	}
	});
});

app.get('/blog/:id', function(req, res){
	console.log(req.params.id)
	articleProvider.findById(req.params.id, function(error, article){
		console.log(article)
		res.render('blog_show.pug', 
		{
			title : article.title,
			article:article
		})
	})
})

app.post('/blog/new', function(req, res){
	articleProvider.save({
		title: req.body.title,
		body: req.body.body
	}, function(err, docs){
		res.redirect('/')
	});
});

app.post('blog/addComment', function(req,res){
	articleProvider.addCommentToArticle(req.body._id, {
		person : req.body.person,
		comment : req.body.comment,
		created_at : new Date()
	}, function(error, docs){
		res.redirect('/blog/' + req.body._id)
	})
})

app.listen(3000);
console.log('Express server listening on port %d in %s mode', app.port, app.settings.env);