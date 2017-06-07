var passport = require('passport');
var log = require('../libs/log')(module);

module.exports = function(app) {


  app.get('/auth/vk',
      passport.authenticate('vkontakte'),
      function(req, res) {

      });


  app.get('/auth/vk/callback',
      passport.authenticate('vkontakte', {failureRedirect: '/ErrorExample'}),
      function(req, res) {
        log.info('User was authorized');
        res.redirect('/crud');
      });

  app.get('/logout', function(req, res) {
    req.logout();
    res.json({message: 'You were logout'});
    log.info('User was logout');
  });


}