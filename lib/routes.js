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

  router.post('/api/navlink', function(req, res){
    wiki.load(req.param('item'), function(result){
      res.json(result);
    });
  });

  router.use('/api/raw', function(req,res,next){
    next();
  });
  
  router.use('/api/raw',serveStatic(process.cwd()));

  // for 404s. This needs to be last route defined.
  //router.get('*', staticFilter, function(req, res){
  //  res.redirect('/');
  //});

  return router

}

module.exports = createRoutes;
