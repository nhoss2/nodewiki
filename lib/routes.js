var express = require('express');
var staticFilter = require('./staticfilter');
var serveStatic = require('serve-static');

function createRoutes(wiki){

  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.post('/api/dir', function(req, res){
    wiki.listFiles(req.param('dir'), function(err, files){
      if (err){
        res.json({});
      } else {
        res.json(files);
      }
    });
  });

  router.use('/api/raw', staticFilter(wiki.allowedExtensions));
  
  router.use('/api/raw',serveStatic(wiki.rootDir));

  // for 404s. This needs to be last route defined.
  //router.get('*', staticFilter, function(req, res){
  //  res.redirect('/');
  //});

  return router

}

module.exports = createRoutes;
