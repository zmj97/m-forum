var express = require('express')
var app = new express

// 添加允许跨域头信息
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  next()
})

var user = require('./routes/user.js')
var post = require('./routes/post.js')
var wiki = require('./routes/wiki.js')
var group = require('./routes/group.js')
var statics = require('./routes/statics.js')
app.use('/user', user)
app.use('/post', post)
app.use('/wiki', wiki)
app.use('/group', group)
app.use('/statics', statics)

app.listen(3000, function () {
  console.log('listening port 3000...')
})
