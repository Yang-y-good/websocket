const socket = io.connect();

import {
    getScrollBottom
} from './scroll.js'
import {debounce} from './debounce.js';

var messages = document.querySelector('.main')
let input = document.querySelector('.mesbox')
let btn = document.querySelector('.btn-blue')
let user = document.querySelector('.username')
let loginOut = document.querySelector('.loginOut')
console.log(input, btn)
var username = sessionStorage.getItem('username')
// var room = document.querySelector('.room')
var count = document.querySelector('.count')
var inputChange = document.querySelector('.inputChange')
var list = document.querySelector('.list')

var users = []
//判断用户登陆状态
if (!sessionStorage.getItem('username')) {
    window.location.href = '/login'
}
//登陆用户名
user.innerHTML = username

//发送信息
btn.addEventListener('click', function (e) {
    if (input.value) {
        console.log(input.value)

        var othermessage = { //保存用户名和发送的信息
            username: username,
            content: input.value
        }

        console.log(othermessage)

        // 在客户端显示自己发送的信息
        var father = document.createElement('div')
        var childContent = document.createElement('span')
        var clildName = document.createElement('a')
        father.className = 'bubble' //添加类名
        childContent.className = 'arrow-right' //添加类名
        clildName.className = 'name' //添加类名
        childContent.textContent = input.value //添加用户输入的消息
        clildName.textContent = username //添加用户姓名
        father.appendChild(childContent)
        father.appendChild(clildName)
        messages.append(father)
        messages.scrollTop = getScrollBottom(messages) //设置到滚动条最底部

        socket.emit('message', othermessage); //向服务端发送数据

        input.value = '' //发送信息后清除文本框内容
    } else {
        alert('请输入信息')
    }
})


//监听服务端的连接成功事件  用户登陆后触发
socket.on('connect', () => {

    console.log('登陆成功')

    //向服务端发送登陆的用户名
    socket.emit("login", {
        username: username
    });

    //向服务端发送加入的新用户
    socket.emit('newUser', username + '加入聊天室');

    function handle(e) {
        if (e.target.value) {
            socket.emit('inputChange', {
                username: username,
                isNot: true
            });
            setTimeout(() => {
                socket.emit('inputChange', {
                    username: username,
                    isNot: false
                });
            }, 3000);
        }
    }

    //监听文本框值的变化，实现用户正在输入功能
    input.addEventListener('input', debounce(handle, 500))



    socket.on('Changes', (msg) => {
        inputChange.style.display = ''
        if (msg.isNot) {
            inputChange.innerText = msg.username + '正在输入......'
        } else {
            inputChange.style.display = 'none'
        }
        // inputChange.style.display = 'none'

    })

})

//接收服务器推送的在线人数
socket.on("users", function (obj) {
    users = obj
    console.log(users)
    list.innerText = users
    count.textContent = obj.length
    console.log('当前在线人数 :' + obj.length)
});


//监听服务端发过来的信息事件
socket.on('servermessage', function (msg) {
    console.log('收到服务端发送的信息' + JSON.stringify(msg))
    var content = JSON.parse(JSON.stringify(msg))
    var father = document.createElement('div')
    var childContent = document.createElement('span')
    var clildName = document.createElement('a')
    childContent.className = 'arrow-left' //添加类名
    clildName.className = 'name-left' //添加类名
    childContent.textContent = content.content //添加用户输入的消息
    clildName.textContent = content.username //添加用户姓名
    father.appendChild(clildName)
    father.appendChild(childContent)
    messages.append(father)
})

// 设置客户端退出
loginOut.addEventListener('click', function (e) {
    // socket.emit('disconect', username + '退出聊天室'); //向服务端发送数据
    sessionStorage.removeItem('username')
    window.location.href = '/login'
})


//显示服务端返回的加入退出信息
socket.on('connectmsg', function (msg) {
    console.log(msg)
    var item = document.createElement('li')
    //设置类名
    item.className = 'brocast'
    item.textContent = msg;
    messages.append(item)
})