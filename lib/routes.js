var express = require('express');

function createRoutes(wiki){

  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/api/dir', function(req, res){
    wiki.listFiles(function(files){
      res.json(files);
    });
  });

  router.post('/api/navlink', function(req, res){
    wiki.load(req.param('item'), function(result){
      res.json(result);
    });
  });

  // for 404s. This needs to be last route defined.
  router.get('*', function(req, res){
    res.redirect('/');
  });

  return router

}

module.exports = createRoutes;
