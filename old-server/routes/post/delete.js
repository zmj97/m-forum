var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 删除评论
router.post('/reply', function (req, res) {
  db.pullByIndex('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, 'replys', req.body.index, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

// 删除楼中楼
// 删除评论
router.post('/reply-to-reply', function (req, res) {
  let jsonReply = {}
  let key = 'replys.'+ req.body.index +'.replys'
  jsonReply[key] = req.body.reply
  db.pull('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, jsonReply, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

// 删除帖子
router.post('*', function (req, res) {
  // 使用_id辨别
  db.delete('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

module.exports = router