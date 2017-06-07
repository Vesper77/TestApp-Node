module.exports = function(app) {
  require('./crud')(app);
  require('./auth')(app);
  require('./error')(app);


};