# blast.js
[![Build Status](https://travis-ci.org/wookoouk/blastjs.svg?branch=master)](https://travis-ci.org/wookoouk/blastjs)

## About

## Examples

Example applications can be found at [github.com/wookoouk/blastjs-examples](https://github.com/wookoouk/blastjs-examples)

## Install

```bash
npm install blastjs --save
```

## Usage
### make database

```javascript
var blast = require('blastjs');

var type = 'prot';
var fileIn = './data.fasta';
var outPath = './';
var name = 'myDatabase';


blast.makeDB(type, fileIn, outPath, name, function(err){
  if(err){
    console.error(err);   
  } else {
    console.log('database created at', outPath);
  }
});
```

### blast n
```javascript
var blast = require('blastjs');

var dbPath = './myDatabase';
var query = 'ACGTGCCACGATTCAACGTGGCACAG';

blast.blastN(db, query, function (err, output) {
  if(!err){
    console.log(output);
  }
});

```