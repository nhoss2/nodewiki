function NodeWiki(opts){

  opts = opts || {};

  this.config = opts.config || {};
  this.app = require('./lib/app.js');

}

module.exports = NodeWiki;
