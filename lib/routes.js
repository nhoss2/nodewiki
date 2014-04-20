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

  return router

}

module.exports = createRoutes;
