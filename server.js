var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');
var log = require('./libs/log')(module);
var config = require('./libs/config');
var PhotoModel = require('./libs/mongoose').PhotoModel;
var vk = require('./libs/passport');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');



require('./routes/index')(app);









app.listen(config.get('port'), function() {
  log.info('Express server listening on port ' + config.get('port'));
});