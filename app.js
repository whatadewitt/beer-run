/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , passport = require('passport')
  , path = require('path')
  , request = require('request')
  , cheerio = require('cheerio');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser('supersecret'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router); 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./FBAuth')(app);

app.get('/', routes.index);
app.post('/api/createRun', routes.api.createRun);
app.del('/api/finishRun/:id', routes.api.finishRun);
app.put('/api/addItem/:id', routes.api.addItem);
app.post('/api/gotItem/:id', routes.api.gotItem);
app.get('/api/pricelist', function(req, res){
  var pricelist = Object();
      pricelist.products = new Array();
  request('http://www.mynslc.com/Pages/advancedSearch.aspx?k=garrison', function(err, resp, body){
    $ = cheerio.load(body);
    console.log('Got Data Back From NSLC: '+$('title').html());
    $('div#products-list ul li').each(function(i, ul){
      var product = new Object();
          product.title = $('.details h5 a', this).html();
          product.image = 'http://www.mynslc.com'+$('.image img', this).attr('src');
          product.price = $('.desc h6', this).html();
          product.unitSize  = $('.details p', this).eq(2).html();
          console.log(product.title);
          console.log(product.image);
          console.log(product.price);
          console.log(product.unitSize);
          console.log('-------------------');
      pricelist.products.push(product);
    });
    res.end(JSON.stringify(pricelist));
  });
});
//Catch all route
app.get('*', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
