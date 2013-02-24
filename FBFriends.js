//params is an object which contains Facebook ID (fb_id) of user and access token (accessToken)
module.exports = function(params, done) {
  'use strict';

  var friendsList = new Array();
  var request = require("request");
  var async = require("async");

  request('https://graph.facebook.com/'+params.fb_id+'/friends?access_token='+params.accessToken, function(err, response, body) {
    if (err) {
      done(err);
    } else {
      async.each(JSON.parse(body).data, getFriends, function(err, data) {
        if (err) {
          done(err);
        } else {
          done(null, friendsList);
        }
      });
    }
  });

  function getFriends (friend, callback) {
    request('http://graph.facebook.com/'+friend.id+'?fields=name,picture', function(err, response, body) {
      if (err) {
        callback(err);
      } else {
        friendsList.push(JSON.parse(body));
        callback(null);
      }
    });
  }
}