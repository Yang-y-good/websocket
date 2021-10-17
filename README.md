# 一个使用socke.io搭建的简易聊天室

## 实现的功能

1. 当有人连接或断开连接时向连接的用户广播消息。
2. 添加对昵称的支持。
3. 添加“{user} 正在输入”功能。
4. 显示谁在线。

[](https://resoure-1252202390.cos.ap-nanjing.myqcloud.com/websocket1.png)

## 安装

```shell
$ git clone git@github.com:Yang-y-good/websocket.git
$ npm install
```

## 运行

```shell
$ node app.js
```

服务器启动默认端口为 8088,若不想使用 3000 端口,可使用以下命令: Mac/Linux

```shell
$ PORT=4000 node app.js
```

