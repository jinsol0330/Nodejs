var http = require('http');
var fs = require('fs');
var url = require('url'); 
//url이라는 모듈을 사용할것이다 라는 것을 node.js에게 알림

function templateHTML(title, list, body) {
  return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <a href="/create">create</a>
          ${body}
        </body>
        </html>
        `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i+1;
  }
  list = list+'</ul>';

  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    //query의 값은 request.url에 저장함
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      //만약 루트라면
      if(queryData.id === undefined) {
        //중첩if문 사용해서 홈(root)웹페이지 구현

        fs.readdir('./data', function(err, filelist) {
        //파일리스트를 가져오는 코드
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
        //response.end(fs.readFileSync(__dirname + _url));
        //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
        })
         
      } else {  //id값이 있다면
        fs.readdir('./data', function(err, filelist) {
          //파일리스트를 가져오는 코드
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template =  templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
          //response.end(fs.readFileSync(__dirname + _url));
          //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
        });
      });
      }
     
    } else if (pathname === '/create') {
      fs.readdir('./data', function(err, filelist) {
        //파일리스트를 가져오는 코드
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action = "http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
        //response.end(fs.readFileSync(__dirname + _url));
        //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
        });

    } else {
      //루트상태가 아니라면 error화면 출력
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);

