var tesfFolder = './data'; 
var fs = require('fs');

fs.readdir(tesfFolder, function(err, filelist) {
    console.log(filelist);
})
