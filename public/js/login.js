var loginBtn = document.getElementById('loginBtn')
var user = document.querySelector('.username')
const socket = io.connect();
var users = [] //在线用户

socket.on('newUsers', (data) => {
    users = data
    console.log(users)
})


loginBtn.addEventListener('click', function (e) {
    //判断文本框是否有值
    if (user.value) {
        //判断用户是否存在
        if (users.indexOf(user.value) == -1) {
            sessionStorage.setItem('username', user.value)
            window.location.href = '/index'
        } else {
            alert('用户名已被注册！')
        }
    } else {
        alert('请输入用户名！')
    }
})