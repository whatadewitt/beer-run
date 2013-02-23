module.exports = function(app) {
  'use strict';

  var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
  var redis = require("redis");
  var client = redis.createClient();

  client.on("error", function (err) {
    console.log("Error " + err);
  });

  passport.use(new FacebookStrategy({
    clientID: "347355238716033",
    clientSecret: "5552d27c383d1f73ca957cd32b231a3a",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    client.set('User: ' + profile.id, JSON.stringify(profile), function(err, response) {
      if (err) {
        done(err);
      } else {
        client.set('User: ' + profile.id + ':AccessToken', accessToken, function(err, response) {
          if (err) {
            done(err);
          } else {
            return done(null, profile.id);  
          }
        });  
      }      
    });
  }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    client.get('User: ' + id, function(err, reply) {
      done(null, reply);
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { 'publish_actions' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', 
    { successRedirect: '/create', failureRedirect: '/' })
  );

  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  })
}