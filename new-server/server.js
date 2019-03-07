'use strict'

const mongoose = require('mongoose')
const router = require('./app/routes/index')
const config = require('./config')
const express = require('express')

const app = express()
// 添加允许跨域头信息
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  next()
})

// 添加路由
router(app)

// 提供静态资源目录
app.use(express.static(__dirname + '/public'))

// 连接数据库后监听端口，断开后重连
connect()
  .on('error', console.log)
  .on('close', connect)
  .once('open', listen)


/* *****************************************************************************
 * 相关函数
 */
// 连接到数据库
function connect () {
  let options = {
    useNewUrlParser: true,
    keepAlive: true,
    autoReconnect: true,
    useFindAndModify: false
  }

  mongoose.connect(config.db, options)

  return mongoose.connection
}

// 监听
function listen () {
  app.listen(config.port, () => {
    console.log(`正在监听端口${config.port}... ...`)
  })
}