const socket = io.connect();
var messages = document.getElementById('messages');
let input = document.querySelector('.mesbox')
let btn = document.querySelector('.btn-blue')
let user = document.querySelector('.username')
let loginOut = document.querySelector('.loginOut')
console.log(input, btn)
var username = sessionStorage.getItem('username')
var room = document.querySelector('.room')
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
        var mymessage = input.value + ':\t' + username
        var othermessage = username + ':\t' + input.value
        console.log(mymessage)

        //在客户端显示自己发送的信息
        var item = document.createElement('li')
        item.className = 'my'
        item.textContent = mymessage;
        messages.append(item);

        socket.emit('message', othermessage); //向服务端发送数据

        input.value = ''
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


    function debounce(fn, delay) {
        var timer = null
        return function (...args) {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
    function handle(e) {
        if (e.target.value) {
            socket.emit('inputChange',{
                username : username,
                isNot : true
            });
            setTimeout(() => {
                socket.emit('inputChange',{
                    username : username,
                    isNot : false
                });
            }, 3000);
        }
    }

    //监听文本框值的变化，实现用户正在输入功能
    input.addEventListener('input',debounce(handle,500))



    socket.on('Changes',(msg) =>{
        inputChange.style.display = ''
        if(msg.isNot){
            inputChange.innerText = msg.username + '正在输入......'
        }else{
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
    console.log('收到服务端发送的信息' + msg)
    var item = document.createElement('li')
    item.innerText = msg;
    messages.append(item);
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