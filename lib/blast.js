var fs = require('fs');
var blast = {};

blast.blastN = function (db, path, outPath, cb) {
  blaster('blastn', db, path, outPath, cb);
};

blast.blastP = function (db, path, outPath, cb) {
  blaster('blastp', db, path, outPath, cb);
};

blast.blastX = function (db, path, outPath, cb) {
  blaster('blastx', db, path, outPath, cb);
};

blast.tblastP = function (db, path, outPath, cb) {
  blaster('tblastp', db, path, outPath, cb);
};

blast.tblastX = function (db, path, outPath, cb) {
  blaster('tblastx', db, path, outPath, cb);
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

        var strippedData = data.substring(data.indexOf('Length'));

        return cb(null, strippedData);
      }
    });
  }
}

function blaster(type, db, path, outPath, cb) {
  var outFile = outPath + generateGuid() + '.out';
  var blastCommand = type + ' -query ' + path + ' -out ' + outFile + ' -db ' + db;
  run(blastCommand, function (err, stdOut, stdError) {
    postBlast(err, stdOut, stdError, outFile, cb);
  });
}


function run(toRun, cb) {
  //console.log('running', toRun);
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
