
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , runstore = require('./runstore')
  , async = require('async');

var app = express(),
  storage = new runstore();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));

  var id;
  storage.createRun({ fb_id: '26640527'}, function(rid) {
    id = rid;
    
    var obj = [{
      name: 'Case O\' Beer',
      price: 19.99,
      quantity: 1
    }, {
      name: 'Colt 45',
      price: 4.99,
      quantity: 2
    }];

    var data = {
      r_id: id,
      fb_id: '99182731234'
    }

    //obj.forEach(function(entry) {
    async.eachSeries(obj, function(o, callback) {
      storage.addItem(data, o, function(params) {
        callback();
      });
    }, function() {

      storage.gotItem({
        fb_id: data.fb_id,
        r_id: id,
        item_id: 1
      }, function(params) {
        console.log('finishing run');
        console.log(data.fb_id);
        storage.finishRun({
          r_id: id,
          fb_id: '26640527'
        }, function() {
          console.log("RUN COMPLETE!");
        })
      });

    });

  });

});
