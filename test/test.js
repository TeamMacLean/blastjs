var assert = require("assert");
var blast = require('../index.js');
var path = require('path');


var Nquery = 'CTAATACCGAATAAGGTCAGTTAATTTGTTAATTGATGAAAGGAAGCCTT';
var dbPath = path.join(__dirname + '/example');


describe('blast', function () {
  describe('#blastN', function () {
    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.blastN(dbPath, Nquery, function (err, output) {
        assert.equal(err, null);
        done();
      });
    });
  });
  describe('#makeDB', function () {
    it('should not get an error', function (done) {
      var fileIn = path.join(__dirname + '/example.fasta');
      var outPath = __dirname;
      var name = 'testDB';
      blast.outputString(true);
      blast.makeDB('nucl', fileIn, outPath, name, function (err, stdOut, stdErr, fileOut) {
        //console.error('err',err);
        assert.equal(err, null);
        done();
      })
    });
  });

  describe('#blastP', function () {
    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.blastP(dbPath, Nquery, function (err, output) {
        assert.equal(err, null);
        done();
      });
    });
  });
  describe('#blastX', function () {
    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.blastX(dbPath, Nquery, function (err, output) {
        assert.equal(err, null);
        done();
      });
    });
  });
  describe('#tblastP', function () {
    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.tblastN(dbPath, Nquery, function (err, output) {
        assert.equal(err, null);
        done();
      });
    });
  });
  describe('#tblastx', function () {
    it('should not get an error', function (done) {
      blast.outputString(true);
      blast.tblastX(dbPath, Nquery, function (err, output) {
        assert.equal(err, null);
        done();
      });
    });
  });
});