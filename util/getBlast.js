var OS = require('os');
var Download = require('download');
var Client = require('ftp');
var fs = require('fs');
var targz = require('tar.gz');

var tt = 'ftp.ncbi.nlm.nih.gov';
var address = '/blast/executables/blast+/LATEST/';

var platform = OS.platform();
var arch = OS.arch();

if(platform === 'win32') {
  platform = 'win64';
}

if (platform === 'darwin') {
  platform = 'macosx';
  arch = 'x64';
}

var foundIt = false;
var fileName = '';

console.log('looking for', platform, arch, '...');

var c = new Client();
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

      var finalURL = tt + address + fileName;
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

function extractIt(err){
  if(err) throw err;

  console.log('Extracting file', 'bin/' + fileName);
  targz().extract('bin/' + fileName, 'bin/', deleteIt);
}

function deleteIt(err){
  if(err) throw err;
  
  console.log('Cleaning up ...');
  fs.unlinkSync('bin/' + fileName);
}