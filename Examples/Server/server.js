#!/usr/bin/env node

var blast = require('../lib/blast');
var express = require('express');
var router = express.Router();
var path = require('path');

var port = 8090;

var app = express();
app.use(express.static('./gui'));

router.get('/api/dbs', function(req, res){
  //TODO return list of databases
});


app.listen(port, function(){
  console.log('blastjs-server started on port', port);
});