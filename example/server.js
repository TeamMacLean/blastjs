var blast = require('../lib/blast');
var http = require('http');
var fs = require('fs');
var serverPort = 1337;

function sendStatic(path, response) {

  fs.readFile(path, function (err, html) {
    //if (err) {
    //  throw err;
    //}
    if(!err){
      response.write(html);
    }

    response.end();
  });
}

function decodeBody(body) {
  return JSON.parse('{"' + decodeURI(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}


function processBlastRequest(req, cb) {
  console.error(req);

  var query = req['blast-string'];

  var path = '/tmp/blastQuery';
  var outPath = '/tmp/';
  fs.writeFile(path, query, function (err) {
    if (err) {
      return console.log(err);
    }
    var cb2 = function (err, out) {
      cb(out);
    };
    blast.blastN(__dirname + '/example', path, outPath, cb2);
  });
}

http.createServer(function (request, response) {

  if (request.method === "GET") {

    if (request.url === '/') {
      sendStatic(__dirname + '/index.html', response);

    } else {
      sendStatic(request.url, response);
    }


  } else if (request.method === "POST") {
    if (request.url === "/post") {

      var requestBody = '';
      request.on('data', function (data) {
        requestBody += data;
        if (requestBody.length > 1e7) {
          response.end();
        }
      });
      request.on('end', function () {

        var body = decodeBody(requestBody);

        var cb = function (out) {
          response.end(out);
        };

        processBlastRequest(body, cb);


      });

    } else {
      response.end();
    }

  } else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }
}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);