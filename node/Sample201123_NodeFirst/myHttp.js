// 1. 加载http核心模块
var myHttp = require('http');

// 2. 使用http.createServer()方法创建一个Web服务器
var myServer = myHttp.createServer();

// 3. 监听客户端发送的请求
myServer.on('request', function (myRequest, myResponse) {
    console.log('收到请求了，客户端请求路径是：' + myRequest.url);
    console.log('客户端请求IP和端口是：' + myRequest.socket.remoteAddress + ':' + myRequest.socket.remotePort);

    // response.write()可以给客户端发送响应数据，可以多次调用
    // 最后必须调用response.end()来结束响应，否则客户端会一直等待
    // myResponse.write('hello\n');
    // myResponse.write('client\n');
    // myResponse.end('have a good day!');
    var fs = require('fs');
    var url = myRequest.url;
    if (url == '/') {
        myResponse.end('index page');
    } else if (url == '/login') {
        myResponse.end('login page');
    } else if (url == '/product') {
        var products = [{
                name: 'iPhone 12',
                price: 7599
            }, {
                name: 'Mi 10',
                price: 3999
            },
            {
                name: 'OPPO Find X',
                price: 5299
            }
        ];
        myResponse.end(JSON.stringify(products));
    } else if (url == '/html') {
        fs.readFile('./resource/test.html', function (error, data) {
            if (error) {
                myResponse.setHeader('Content-Type', 'text/plain; charset=utf-8');
                myResponse.end('文件读取失败!');
            } else {
                myResponse.setHeader('Content-Type', 'text/html; charset=utf-8');
                myResponse.end(data);
            }
        });
    } else if (url == '/image') {
        fs.readFile('./resource/girl.jpg', function (error, data) {
            if (error) {
                myResponse.setHeader('Content-Type', 'text/plain; charset=utf-8');
                myResponse.end('图片读取失败!');
            } else {
                // 图片不需要指定字符集(charset)，一般只有字符才需要
                myResponse.setHeader('Content-Type', 'image/jpeg');
                myResponse.end(data);
            }
        });
    } else {
        myResponse.setHeader('Content-Type', 'text/html; charset=utf-8'); //text/plain 普通文本，不能解析html
        myResponse.end('404 Not Found.页面不存在<p style="color:red;">颜色</p>');
    }

});

// 4. 绑定端口号，启动服务器
myServer.listen(2300, function () {
    console.log('服务器启动成功，端口号是2300');
});