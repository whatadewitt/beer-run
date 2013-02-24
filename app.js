/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , passport = require('passport')
  , path = require('path')
  , RedisStore = require('connect-redis')(express)
  , request = require('request');

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

  app.use(express.session({
    key: 'sid',
    store: new RedisStore({
      host: 'localhost',
      port: 6379
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: '/'
    },
    secret: 'teehee'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router); 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./FBAuth')(app);

app.get('/', routes.index);
app.post('/api/messageFriends/:id', routes.api.messageFriends);
app.get('/api/createRun', routes.api.createRun);
app.post('/api/finishRun/:id', routes.api.finishRun);
app.post('/api/addItem/:id', routes.api.addItem);
app.post('/api/gotItem/:id', routes.api.gotItem);
app.get('/api/pricelist', routes.api.priceList);
//Catch all route
app.get('*', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
