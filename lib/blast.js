var blast = {
  awesome: true
};

var fs = require('fs');

blast.blastN = function (db, query, cb) {
  blaster('blastn', db, query, cb);
};

blast.blastP = function (db, query, cb) {
  blaster('blastp', db, query, cb);
};

blast.blastX = function (db, query, cb) {
  blaster('blastx', db, query, cb);
};

blast.tblastP = function (db, query, cb) {
  blaster('tblastp', db, query, cb);
};

blast.tblastX = function (db, query, cb) {
  blaster('tblastx', db, query, cb);
};

function generateGuid() {
  var result, i, j;
  result = '';
  for (j = 0; j < 32; j++) {
    if (j === 8 || j === 12 || j === 16 || j === 20)
      result = result + '-';
    i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}
function postBlast(err, stdOut, stdError, outFile, cb) {

  if (err) {
    console.log('blast error', stdError);
    return cb(err, null);
  } else {
    fs.readFile(outFile, 'utf8', function (err, data) {
      if (err) {
        console.log('error reading blast output', err);
        return cb(err, null);
      } else {
        console.log(data);


        var strippedData = data.substring(data.indexOf('Length'));

        return cb(null, strippedData);
      }
    });
  }
}

function blaster(type, db, query, cb) {

  var path = '/tmp/' + Date.now() + '.fasta';
  fs.writeFileSync(path, query);

  var outPath = '/tmp/';
  var outFile = outPath + generateGuid() + '.out';
  var blastCommand = type + ' -query ' + path + ' -out ' + outFile + ' -db ' + db;// + ' -outfmt 5';

  run(blastCommand, function (err, stdOut, stdError) {
    postBlast(err, stdOut, stdError, outFile, cb);
  });
}


function run(toRun, cb) {
  var exec = require('child_process').exec;
  exec(toRun, cb);
}

blast.makeDB = function (type, fileIn, outPath, name, cb) {

  if (!type) {
    return cb(new Error('no type supplied'));
  }
  if (!fileIn) {
    return cb(new Error('no file supplied'));
  }
  if (!outPath) {
    return cb(new Error('no output path supplied'));
  }

  var fileNamePartOne = fileIn.replace(/^.*[\\\/]/, '');// remove directories from path
  var filename = fileNamePartOne.substr(0, fileNamePartOne.lastIndexOf('.')); //remove file extensions

  if (outPath.slice(-1) !== '/') {
    outPath = outPath + '/'; // add / out path is one is not supplied
  }

  var fileOut = outPath + filename;

  var makeCommand = 'makeblastdb -in ' + fileIn + ' -dbtype ' + type + ' -out ' + fileOut + ' -title ' + name;
  run(makeCommand, function (err, stdOut, stdErr) {
    return cb(err, stdOut, stdErr, fileOut);
  });

};

module.exports = blast;
