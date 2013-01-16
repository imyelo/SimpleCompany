
/**
 * Module dependencies.
 */

var express = require('express'),
  partials = require('express-partials'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  config = require('./config').config;

var app = express();

app.configure(function(){
  var viewsRoot = path.join(__dirname, 'views');
  app.set('port', process.env.PORT || 3000);
  app.set('views', viewsRoot);
  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.session_secret
  }));
  app.use(express.methodOverride());
  app.use(partials());
  app.use(require('./controllers/site').global);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
