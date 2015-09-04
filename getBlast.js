var OS = require('os');
//var Download = require('download');
var Client = require('ftp');

var tt = 'ftp.ncbi.nlm.nih.gov';
var address = '/blast/executables/blast+/LATEST/';

var platform = OS.platform();
var arch = OS.arch();

console.log(platform, arch);

var c = new Client();
c.on('ready', function () {
  c.list(function (err, list) {
    if (err) throw err;
    console.dir(list);
    c.end();
  });
});
c.connect({host: tt});

if (platform == 'linux') {

} else if (platform == 'windows') {

} else if (platform == 'darwin') {

} else {

}


//console.log('downloading');
//new Download({mode: '755', extract: true})
//  .get(tt)
//  .dest('bin')
//  .run();


//curl ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ncbi-blast-2.2.31+-src.zip