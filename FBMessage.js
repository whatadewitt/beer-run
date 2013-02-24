//params is an object which contains array of friend objects (friendList) of user and access token (accessToken) and runId (r_id)
module.exports = function(params, done) {
  'use strict';

  var FB = require('fb');
  var request = require('request');

  FB.setAccessToken(params.accessToken);

  var body = 'Making a beer run, what do you want? <a href="http://localhost:3000/' + params.r_id + '/order">Click here to place order</a>';


  async.each(params.friendList, sendfbPost, function(err)) {
    if (err) {
      done(err);
    } else {
      done(null, 'All messages sent');
   }
 };

 function sendfbPost(friend, callback) {
  FB.api(friend.id + '/feed', 'post', { message: body}, function (err) {
    if(err) {
      callback(err);
    }
  }
}