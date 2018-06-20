const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const _ = require('lodash');
const uuid = require('uuid');
const parseString = require('xml2js').parseString;

const blast = {
    stringOutput: false,
    customBlastLocation: null
};

_.attempt(lookupCustomBlastLocation);

function lookupCustomBlastLocation() {
    const lookDir = path.join(__dirname, '../bin');
    let binStats;
    let binFiles;
    let pathToFirst;
    let innerBin;
    let innerBinStats;

    binStats = fs.lstatSync(lookDir);
    if (binStats.isDirectory()) {
        binFiles = fs.readdirSync(lookDir);
        if (binFiles.length) {
            pathToFirst = path.join(lookDir, binFiles[0]);
            innerBin = path.join(pathToFirst, 'bin');
            innerBinStats = fs.lstatSync(innerBin);
            if (innerBinStats.isDirectory()) {
                blast.customBlastLocation = innerBin;
            }
        }
    }

}

blast.outputString = function (bool) {
    blast.stringOutput = (!bool || bool == true);
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

blast.blast = function (options, cb) {
    const nonBlastOptions = ['type', 'outputDirectory', 'rawOutput'];
    const optArr = [];
    const guid = uuid.v1();
    let queryString;
    const opts = {
        type: 'blastn',
        outputDirectory: '/tmp',
        rawOutput: false,
        db: 'nt',
        outfmt: 5
    };


    _.extend(opts, options);

    queryString = opts.query;

    if (!queryString) {
        return cb(new Error('Query must be supplied.'));
    }

    opts.query = path.join(opts.outputDirectory, guid + '.fasta');
    opts.out = path.join(opts.outputDirectory, guid + '.out');

    if (opts.remote) {
        opts.remote = '';
    }

    _.each(opts, function (value, key) {
        if (nonBlastOptions.indexOf(key) > -1) {
            return;
        }

        optArr.push('-' + key);
        optArr.push(value);
    });

    fs.writeFile(opts.query, queryString, function (err) {
        if (err) {
            return cb(err);
        }

        run(opts.type + ' ' + optArr.join(' '), function (err, stdOut, stdError) {
            postBlast(err, stdOut, stdError, opts, cb);
        });

    });

};

function postBlast(err, stdOut, stdError, options, cb) {
    const outFile = options.out;
    const isRaw = options.rawOutput || blast.stringOutput || !options.outfmt.toString().match(/^(.)?5/);

    if (err) {
        return cb(err);
    }

    fs.readFile(outFile, 'utf8', function (err, data) {
        if (isRaw) {
            return cb(null, data);
        }

        parseString(data, function (err, result) {
            return cb(null, result);
        });
    });
}

function blaster(type, db, query, cb) {
    const pathW = '/tmp/' + Date.now() + '.fasta';
    fs.writeFileSync(pathW, query);

    const outPath = '/tmp/';
    const outFile = outPath + uuid.v1() + '.out';
    let blastCommand = type + ' -query ' + pathW + ' -out ' + outFile + ' -db ' + db;

    if (!blast.stringOutput) {
        blastCommand += ' -outfmt 5';
    }

    run(blastCommand, function (err, stdOut, stdError) {
        postBlast(err, stdOut, stdError, {out: outFile, outfmt: 5}, cb);
    });
}

function run(toRun, cb) {
    if (blast.customBlastLocation) {
        toRun = path.join(blast.customBlastLocation, toRun);
    }

    console.log('Blasting: ', toRun);
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

    const fileNamePartOne = fileIn.replace(/^.*[\\\/]/, '');// remove directories from path
    const filename = fileNamePartOne.substr(0, fileNamePartOne.lastIndexOf('.')); //remove file extensions

    if (outPath.slice(-1) !== '/') {
        outPath = outPath + '/'; // add / out path is one is not supplied
    }

    const fileOut = outPath + filename;

    const makeCommand = 'makeblastdb -in ' + fileIn + ' -dbtype ' + type + ' -out ' + fileOut + ' -title ' + name;
    run(makeCommand, function (err, stdOut, stdErr) {
        return cb(err, stdOut, stdErr, fileOut);
    });

};

module.exports = blast;
