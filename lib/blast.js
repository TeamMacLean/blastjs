var fs = require('fs');
var path = require('path');
var parseString = require('xml2js').parseString;

var blast = {
  stringOutput: false,
  customBlastLocation: null
};

lookupCustomBlastLocation();

function lookupCustomBlastLocation() {
  var lookDir = path.join(__dirname, '../bin');
  fs.lstat(lookDir, function (err, stats) {
    if (!err && stats.isDirectory()) {
      fs.readdir(lookDir, function (err, files) {
        if (!err && files.length) {

          var pathToFirst = path.join(lookDir, files[0]);

          var innerBin = path.join(pathToFirst, 'bin');


          fs.lstat(innerBin, function (err, stats) {

            if (!err && stats.isDirectory()) {
              //TODO ITS GOOD!!!


              blast.customBlastLocation = innerBin;
            }

          });
        }
      });
    }
  })
}

blast.outputString = function (bool) {

  blast.stringOutput = !!(!bool || bool == true);
};

blast.blastN = function (db, query, cb) {
  blaster('blastn', db, query, cb);
};

blast.blastP = function (db, query, cb) {
  blaster('blastp', db, query, cb);
};

blast.blastX = function (db, query, cb) {
  blaster('blastx', db, query, cb);
};

blast.tblastN = function (db, query, cb) {
  blaster('tblastn', db, query, cb);
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
      if (!blast.stringOutput) {
        parseString(data, function (err, result) {
          return cb(err, result);
        });
      } else {
        return cb(err, data);
      }
    });
  }
}

function blaster(type, db, query, cb) {

  var pathW = '/tmp/' + Date.now() + '.fasta';
  fs.writeFileSync(pathW, query);

  var outPath = '/tmp/';
  var outFile = outPath + generateGuid() + '.out';
  var blastCommand = type + ' -query ' + pathW + ' -out ' + outFile + ' -db ' + db;

  if (!blast.stringOutput) {
    blastCommand += ' -outfmt 5';
  }

  run(blastCommand, function (err, stdOut, stdError) {
    postBlast(err, stdOut, stdError, outFile, cb);
  });
}


function run(toRun, cb) {
  var exec = require('child_process').exec;

  if (blast.customBlastLocation != null) {
    toRun = blast.customBlastLocation + '/' + toRun
  }
  console.log('RUNNING', toRun);
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
