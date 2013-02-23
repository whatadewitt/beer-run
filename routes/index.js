var api = require('./api');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Garrison Booze Hound' });
};

exports.api = api;
