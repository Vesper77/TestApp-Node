var log = require('../libs/log')(module);

module.exports = function(app) {
  app.get('/ErrorExample', function(req, res, next) {
    next(new Error('Random error!'));
  });

  app.use(function(req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({error: 'Not found'});
    return;
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({error: err.message});
    return;
  });

}