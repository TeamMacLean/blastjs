var OS = require('os');
var Download = require('download');
var Client = require('ftp');

var tt = 'ftp.ncbi.nlm.nih.gov';
var address = '/blast/executables/blast+/LATEST/';

var platform = OS.platform();
var arch = OS.arch();

if (platform === 'darwin') {
  platform = 'macosx';
  arch = 'universal';
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
  new Download({mode: '755', extract: true})
    .get('http://' + url) //have to add http to url
    .dest('bin')
    .run();
}