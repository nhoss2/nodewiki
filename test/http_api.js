var Nodewiki = require('../nodewiki');
var request = require('supertest');

var fixtures = require('path').join(__dirname, 'fixtures');

describe('/api/raw/', function(){
  it('should display a raw markdown file', function(done){
    var expressApp = new Nodewiki({rootDir: fixtures}).app;

    request(expressApp)
      .get('/api/raw/test.md')
      .expect(200, 'hello\n', done)
  });

  it('should not display a non markdown file', function(done){
    var expressApp = new Nodewiki({rootDir: fixtures}).app;

    request(expressApp)
      .get('/api/raw/secret.js')
      .expect(404, done);
  });

});
