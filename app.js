const express = require('express')
const app = express()
const port = 8088

const {
    createServer
} = require("http");
const {
    Server
} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});


const bodyParser = require('body-parser') //解析请求中间件

let cookieParser = require('cookie-parser');

app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.engine('html', require('express-art-template')); //配置template模板

//开放public目录
app.use(express.static('public'))

const router = require('./router.js') //导入路由


app.use((req, res, next) => {
    next()
})

app.use('/', router)


var user = undefined;

//统计连接数
var users = [];

//删除数组内指定的元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 服务器端监听客户端emit的事件，事件名称可以和客户端是重复的，但是并没有任何关联。socket.io内置了一些事件比如connection，disconnect，exit事件，业务中错误处理需要用到。

//监听客户端的连接
io.on('connection', (socket) => {

    //有新用户连接就推送所有在线用户
    socket.emit('newUsers', users)
    console.log('有用户访问')
    //监听客户端登陆
    socket.on('login', (data) => {
        socket.username = data.username;
        console.log(socket.username + '\t加入聊天室')
        //检测用户名是否重复
        if (users.indexOf(data.username) == -1) {
            users.push(data.username);
        } else {
            console.log('已存在')
        }

        // 统计在线用户，推送给客户端
        socket.emit('users', users); // 发送给自己
        socket.broadcast.emit('users', users); // 发送给其他人
    })


    //客户端加入新用户 广播给其他客户端
    socket.on('newUser', (msg) => {
        //向除了自己以外的客户端发送信息
        socket.broadcast.emit('connectmsg', msg)
    })

    //监听客户端发过来的信息
    socket.on('message', (msg) => {
        console.log('收到客户端发送过来的信息 ： ' + JSON.parse(JSON.stringify(msg)))
        // io.emit('servermessage',msg)        //向所有客户端发送数据
        socket.broadcast.emit('servermessage', msg) //向除了自己以外的客户端发送信息
    })

    //监听客户端文本框变化
    socket.on('inputChange',(msg) =>{
        console.log(msg)
        //将正在输入的用户广播给其他用户
        socket.broadcast.emit('Changes',msg) 
    })

    //监听客户端断开连接
    socket.on('disconnect', (msg) => {
        //客户端用户断开连接则删除用户
        users.remove(socket.username)
        console.log(socket.username +'\t断开连接')
        //更新在线用户人数
        socket.broadcast.emit('users', users);

        if (socket.username) {
            socket.broadcast.emit('connectmsg', socket.username + '退出聊天室') //向除了自己以外的客户端发送信息
        }
    })


    socket.on('error', () => {
        console.log('连接错误')
    })
})

app.use((req, res, next) => { //设置请求404页面
    // res.status(404).send('当前访问的页面是不存在的');
    res.redirect(302, '/login')
    next()
})

// socket实例开启服务端
httpServer.listen(port, () => {http://localhost:8088/index
    console.log(`Example app listening at http://localhost:${port}`)
})