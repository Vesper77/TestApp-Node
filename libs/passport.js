var config = require('nconf');
var passport = require('passport');
var AuthVKStrategy = require('passport-vkontakte').Strategy;


passport.use('vkontakte', new AuthVKStrategy({
      clientID: config.get('auth:vk:app_id'),
      clientSecret: config.get('auth:vk:secret'),
      callbackURL: config.get('app:url') + '/auth/vk/callback',
    },
    function(accessToken, refreshToken, profile, done) {


      return done(null, {
        username: profile.displayName,
        photoUrl: profile.photos[0].value,
        profileUrl: profile.profileUrl,
        vkID: profile.id,
      });
    }
));


passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});


passport.deserializeUser(function(data, done) {
  try {
    done(null, JSON.parse(data));
  } catch (e) {
    done(err)
  }
});


module.exports = function(app) {
}