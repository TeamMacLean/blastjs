# blast.js
[![Build Status](https://travis-ci.org/TeamMacLean/blastjs.svg?branch=master)](https://travis-ci.org/TeamMacLean/blastjs)
>a BLAST+ wrapper for Node.js

a demo can be found at [github.com/teammaclean/blastjs-demo](https://github.com/teammaclean/blastjs-demo)

## Install

If you do not have Node.js installed you can get it at [https://nodejs.org](https://nodejs.org)

```bash
npm install blastjs
```

If Blast+ is not installed you can run:    
```bash
node util/getBlast.js
```
and the latest version of Blast+ will be downloaded and placed in the bin folder for you.

## Usage
### make database

```javascript
var blast = require('blastjs');

var type = 'nucl';
var fileIn = './test.fasta';
var outPath = './';
var name = 'example';


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

blast.outputString(true); //optional, provides string output instead of JSON

var dbPath = './example';
var query = '>24.6jsd2.Tut\nGGTGTTGATCATGGCTCAGGACAAACGCTGGCGGCGTGCTTAATACATGCAAGTCGAACGGGCTACCTTCGGGTAGCTAGTG'
+'\n>24.6jsd3.Tut\nATGATCATGGCTCAGATTGAACGCTGGCGGCATGCCTTACACATGCAAGTCGAACGGCAGCACGGGGAAGGGGCAACTCTTT';

blast.blastN(dbPath, query, function (err, output) {
  if(!err){
    console.log(output);
  }
});

```

## API
* .makeDB(type, fileIn, outPath, name, cb)    
  callback is passed (err, stdOut, stdErr, fileOut).
  
* .blastN(db, query, cb)    
  callback is passed (err, output).
  
* .blastP(db, query, cb)    
  callback is passed (err, output).
  
* .blastX(db, query, cb)    
  callback is passed (err, output).
  
* .tblastN(db, query, cb)    
  callback is passed (err, output).
  
* .tblastX(db, query, cb)    
  callback is passed (err, output).
  
* .outputString(boolean)    
  this toggles the output being in a string (true) or as JSON (false).    
  default is JSON.
