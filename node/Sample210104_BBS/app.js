var http = require('http');

var commentList = new Array();

http.createServer(function (request, response) {

    var fs = require('fs');
    var template = require('art-template');
    var url = require('url');
    var urlObj = url.parse(request.url, true);

    console.log('收到请求了，客户端请求路径是：' + urlObj.pathname);
    if (urlObj.pathname == '/') {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.end('首页建设中。。。');
    } else if (urlObj.pathname.toLowerCase() == '/bbs') {
        fs.readFile('./views/bbs.html', function (error, data) {
            if (error) {
                response.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return response.end('文件读取失败');
            }

            var htmlStr = template.render(data.toString(), {
                comments: commentList
            });
            response.end(htmlStr);
        });
    } else if (urlObj.pathname.toLowerCase() == '/post') {
        fs.readFile('./views/post.html', function (error, data) {
            if (error) {
                response.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return response.end('文件读取失败');
            }

            response.end(data);
        });
    } else if (urlObj.pathname.toLowerCase() == '/dopost') {
        var comment = urlObj.query;
        comment.postTime = new Date().toLocaleString();
        commentList.unshift(comment);

        response.statusCode = 302;
        response.setHeader('Location', '/bbs');
        response.end();
    } else if (urlObj.pathname.indexOf('/public/') == 0) {
        fs.readFile('.' + request.url, function (error, data) {
            if (error) {
                response.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return response.end('图片读取失败');
            }
            response.end(data);
        });
    } else {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end('<h1>404</h1><p>你似乎来到了没有知识存在的荒原</p>');
    }
}).listen(8323, function () {
    console.log('运行中...');
});