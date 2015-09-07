var assert = require("assert");

var path = require('path');

describe('blast', function () {
  describe('#blastN', function () {
    var blast = require('../index.js');
    var dbPath = path.join(__dirname + '/example');
    var query = 'CTAATACCGAATAAGGTCAGTTAATTTGTTAATTGATGAAAGGAAGCCTT';

    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.blastN(dbPath, query, function (err, output) {
        console.log(output);
        assert.equal(err, null);
        done();
      });
    });
  });
});