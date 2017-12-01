var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , onlineNumber = 0;

// 设置静态资源目录
app.use(express.static('./'))

server.listen(8080, () => {
    console.log("run http://localhost:8080 in your browser");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', socket => {
    let isNickNameAdded = false;
    
    // 用户刚连接上服务器，给出在线人数
    io.emit('showOnlineNumber', onlineNumber);

    // 用户 xxx 进入聊天室
    socket.on('finishNickname', () => {
        isNickNameAdded = true;
        onlineNumber++;
        io.emit('showOnlineNumber', onlineNumber);
    });
    
    // 掉线
    socket.on('disconnect', () => {
        if (isNickNameAdded) {
            onlineNumber--;
            io.emit('showOnlineNumber', onlineNumber);
        }
    });

    // 接受到信息
    socket.on('sendMsg', data => {
        // sending to the client
        // 只发送给 sendMsg 过来的客户端
        // socket.emit('newMessage', data);

        // sending to all clients except sender
        // 给除了发送 sendMsg 过来的客户端外的客户端广播
        socket.broadcast.emit('newMessage', data);

        // 给所有客户端广播，两种方式
        // io.sockets.emit('newMessage', data)
        // io.emit('newMessage', data);
    });
});