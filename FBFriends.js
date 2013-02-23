//params is an object which contains Facebook ID (fb_id) of user and access token (accessToken)
module.exports = function(params, done) {
  'use strict';

  var friendsList = new Array();
  var request = require("request");
  var FB = require("fb");

  FB.setAccessToken(params.accessToken);

  request('http://graph.facebook.com/'+params.fb_id+'/friends', function(err, response, body){
    if (err) {
      done(err);
    } else {
      async.each(body.data, getfriends, function(err)) {
        if (err) {
          done(err);
        }
      };
    }

  });

  function getFriends (friend, callback) {
    request('http://graph.facebook.com/'+friend.id+'?fields=name,picture', function(err, response, body)) {
      if (err) {
        callback(err);
      } else {
        friendsList.push(body);
        callback(null, friendsList);
      }
    }
  }


  module.exports = friendsList;
}