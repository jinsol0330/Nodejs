var http = require('http');
var fs = require('fs');
var url = require('url'); 
//url이라는 모듈을 사용할것이다 라는 것을 node.js에게 알림

var app = http.createServer(function(request,response){
    var _url = request.url;
    //query의 값은 request.url에 저장함
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    if(pathname === '/') {
      //만약 루트라면
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description) {
        var description = data;
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="?id=HTML">HTML</a></li>
            <li><a href="?id=CSS">CSS</a></li>
            <li><a href="?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
        //response.end(fs.readFileSync(__dirname + _url));
        //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
      })
    } else {
      //루트상태가 아니라면 error화면 출력
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);

