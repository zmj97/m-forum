var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 发布新的post
router.post('/new', function (req, res) {
  // 添加到post集合
  db.create('posts', req.body, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

// 新的回复
router.post('/reply', function (req, res) {
  // 使用_id辨别
  db.push('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, {'replys': req.body.reply}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

module.exports = router