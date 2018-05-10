const OS = require('os');
const Download = require('download');
const Client = require('ftp');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const tt = 'ftp.ncbi.nlm.nih.gov';
const address = '/blast/executables/blast+/LATEST/';

let platform = OS.platform();
let arch = OS.arch();

if (platform === 'win32') {
    platform = 'win64';
}

if (platform === 'darwin') {
    platform = 'macosx';
    arch = 'x64';
}

let foundIt = false;
let fileName = '';

console.log('looking for', platform, arch, '...');

const c = new Client();
c.on('ready', function () {
    c.list(address, function (err, list) {
        if (err) throw err;
        //console.dir(list);


        list.forEach(function (l) {
            if (l.name.indexOf(platform) > -1) {
                if (l.name.indexOf(arch) > -1) {
                    if (l.name.indexOf('md5') === -1) {
                        foundIt = true;
                        fileName = l.name;
                    }
                }
            }
        });
        if (!foundIt) {
            console.error('we could not find the correct version of blast+ for you, sorry');
        } else {

            const finalURL = tt + address + fileName;
            downloadIt(finalURL);
        }
        c.end();
    });
});
c.connect({host: tt});

function downloadIt(url) {
    console.log('Downloading', url, '...');
    new Download({mode: '755'})
        .get('http://' + url) //have to add http to url
        .dest('bin')
        .run(extractIt);
}

function extractIt(err) {
    if (err) throw err;

    console.log('Extracting file', 'bin/' + fileName);
    tar.x({file: path.join('bin', fileName), cwd: './bin'}).then(deleteIt);
}

function deleteIt(err) {
    if (err) throw err;

    console.log('Cleaning up ...');
    fs.unlinkSync('bin/' + fileName);
}
