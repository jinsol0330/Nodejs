var http = require('http');
var fs = require('fs');
var url = require('url'); 
//url이라는 모듈을 사용할것이다 라는 것을 node.js에게 알림

var app = http.createServer(function(request,response){
    var _url = request.url;
    //query의 값은 request.url에 저장함
    var queryData = url.parse(_url, true).query;
    if(_url == '/'){
      _url = '/index.html';
    }
    if_(url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(queryData.id);
    //response.end(fs.readFileSync(__dirname + _url));
    //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
 
});
app.listen(3000);

