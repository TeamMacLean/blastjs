var assert = require("assert");

describe('blast', function () {
  describe('#blastN', function () {
    var blast = require('../index.js');
    var dbPath = './example';
    var query = 'CTAATACCGAATAAGGTCAGTTAATTTGTTAATTGATGAAAGGAAGCCTT';

    it('should not get an error', function () {
      blast.blastN(dbPath, query, function (err, output) {
        assert.equel(null, err);
      });
    });
  });
});