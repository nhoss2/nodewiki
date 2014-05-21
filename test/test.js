var Nodewiki = require('../nodewiki');
var assert = require('assert');

var fixtures = require('path').join(__dirname, 'fixtures');


describe('app instantiation', function(){
  it('should give an error setting rootDir to a directory that doesn\'t exist', function(){
    assert.throws(function(){
      var app = new Nodewiki({rootDir: __dirname + '/doesntexist'})
    });

  });
});

describe('directory listings', function(){
  it('should list files', function(){
    var app = new Nodewiki({rootDir: fixtures});

    app.listFiles('/', function(err, files){
      assert.equal(err, null);
      assert.equal(files.length, 2);
    });

    app.listFiles('/subdir', function(err, files){
      assert.equal(err, null);
      assert.equal(files.length, 1);
      assert.equal(files[0].name, 'hi.md');
      assert.equal(files[0].type, 'file');
    });
  });

  it('should give an error when requesting a listing outside of rootDir', function(){
    var app = new Nodewiki({rootDir: fixtures});

    app.listFiles('../../', function(files){
      assert.equal(typeof(files), 'string');
    });

  });
});
