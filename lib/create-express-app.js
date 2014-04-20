var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');


var ROOTDIR = path.join(__dirname, '..');

function createExpressApp(){

  var app = express();

  app.set('views', path.join(ROOTDIR, 'views'));
  app.set('view engine', 'hjs');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(require('less-middleware')({ src: path.join(ROOTDIR, 'public') }));
  app.use(express.static(path.join(ROOTDIR, 'public')));

  return app;

}


module.exports = createExpressApp;
