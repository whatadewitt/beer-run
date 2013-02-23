//params is an object which contains array of friend objects (friendList) of user and access token (accessToken)
module.exports = function(params, done) {
  'use strict';

 var FB = require('fb');
 var request = require('request');

 FB.setAccessToken(params.accessToken);

 var body = 'Making a beer run, what do you want? <a href="http://localhost:3000/create">Click here to place order</a>';

 async.each(body, sendfbPost, function(err)) {
   if (err) {
     done(err);
   }
 };

 function sendfbPost(friend, callback) {
  FB.api(friend.id + '/feed', 'post', { message: body}, function (err) {
    if(err) {
      callback(err);
    }
  }
  
}