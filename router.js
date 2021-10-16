var express = require('express')
var route = express.Router()


route.get('/login',(req,res) =>{
    res.render('login.html')
})


route.get('/index',(req,res) =>{
    res.render('index.html')
})

module.exports = route