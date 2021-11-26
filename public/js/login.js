var loginBtn = document.getElementById('loginBtn')
var user = document.querySelector('.username')
const socket = io.connect();
var users = [] //在线用户

socket.on('newUsers', (data) => {
    users = data
    console.log(users)
})


loginBtn.addEventListener('click', function (e) {
    //1.定义正则 匹配1到10个以字母开头的字符串和汉字  多个匹配用()和|隔开
    var reg = /^([a-zA-Z]{1,10})|([\u4e00-\u9fa5])$/;  
    //判断文本框是否有值
    if (reg.test(user.value)) {
        //判断用户是否存在
        if (users.indexOf(user.value) == -1) {
            sessionStorage.setItem('username', user.value)
            window.location.href = '/index'
        } else {
            alert('用户名已被注册！')
        }
    } else {
        alert('用户名不合法，请重新输入')
    }
})