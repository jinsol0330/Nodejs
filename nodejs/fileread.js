var fs = require('fs');
const { isBuffer } = require('util');
fs.readFile('sample.txt', 'utf8', function(err,data) {
    console.log(data);
});

