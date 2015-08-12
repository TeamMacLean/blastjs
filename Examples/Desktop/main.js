var blast = require('../lib/blast');
var fs = require('fs');
//    var parser = require('biojs-io-blast');
window.$ = window.jQuery = require('./components/jquery/dist/jquery.min.js')

var button = $('#blast');
var queryText = $('#query');
var nucleotides = $('#nucleotides');
var proteins = $('#proteins');
var out = $('#output');

var db = './gui/example_data/example';


button.on('click', function () {


  var fileQuery = $('#fileQuery');

  if (fileQuery[0].files.length) {
    var file = fileQuery[0].files[0];

    console.log(file);

    var text = fs.readFileSync(file.path);
    blastIt(db, text);
  } else {
    blastIt(db, queryText.val());
  }
});


function blastIt(db, query) {

  blast.blastN(db, query, function (err, output) {
    if (err) {
      out.removeClass('border-success');
      out.addClass('border-error');
      out.text(err);
    } else {
      out.removeClass('border-error');
      out.addClass('border-success');

      out.text(output);
    }
  })
}
