var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
//url이라는 모듈을 사용할것이다 라는 것을 node.js에게 알림

var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  //query의 값은 request.url에 저장함
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    //만약 루트라면
    if (queryData.id === undefined) {
      //중첩if문 사용해서 홈(root)웹페이지 구현

      fs.readdir('./data', function (err, filelist) {
        //파일리스트를 가져오는 코드
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
        //response.end(fs.readFileSync(__dirname + _url));
        //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
      })

    } else {  //id값이 있다면
      fs.readdir('./data', function (err, filelist) {
        //파일리스트를 가져오는 코드
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            aloowedTags:['h1']
          }); 
          var list = template.list(filelist);
          var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="sumbit" value="delete">
             </form>`
          );
          response.writeHead(200);
          response.end(html);
          //response.end(fs.readFileSync(__dirname + _url));
          //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, filelist) {
      //파일리스트를 가져오는 코드
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
          <form action = "/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
          </form>
        `, '');
      response.writeHead(200);
      response.end(html);
      //response.end(fs.readFileSync(__dirname + _url));
      //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
    });

  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    //서버쪽에서 데이터를 수신할때마다 콜백함수를 호출하기로 약속되어있음

    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8',
        function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          //302는 페이지를 다른 곳으로 리다이렉션 시키라는 의미
          response.end();
        })
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function (err, filelist) {
      //파일리스트를 가져오는 코드
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `
            <form action = "/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description" placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>
            </form>
            `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
        //response.end(fs.readFileSync(__dirname + _url));
        //사용자가 접속한 url에 따라서 파일들을 읽어주는 코드
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    //서버쪽에서 데이터를 수신할때마다 콜백함수를 호출하기로 약속되어있음

    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8',
          function (err) {
            response.writeHead(302, { Location: `/?id=${title}` });
            response.end();
          })
      })
    });

  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });

    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      })
    });
  } else {
    //루트상태가 아니라면 error화면 출력
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);


