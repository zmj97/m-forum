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
      res.send('success')
      // 更新最后修改时间
      db.update('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, {'lastModifyTime': req.body.reply.time}, () => {})
      // 更新被回复人的消息(回复自己的帖子不提醒)
      if (req.body.username !== req.body.reply.username) {
        // 先获取评论是第几楼（从0开始）
        db.find('posts', [{'_id': require('mongodb').ObjectId(req.body._id)}, {'replys': 1}], function (err, data) {
          // index 即为第几楼
          let index = data[0].replys.findIndex(function (item) { 
            return item.time === req.body.reply.time
          })
          // 向被回复用户添加通知
          db.push('users', {'username': req.body.username}, {'replyNotifications': {
            'username': req.body.reply.username,
            'title': req.body.title,
            'postId': req['body']['_id'],
            'replyIndex': index
          }}, () => {}, true) // 可重复
        })
        db.update('users', {'username': req.body.username}, {
          'newReplyNt': true,
        }, () => {})
        return
      }
    }
  })
})

// 新的楼中楼回复
router.post('/reply-to-reply', function (req, res) {
  var jsonReply = {}
  // replys.0.replys 修改replys的第0个成员的replys属性
  // replys.1.replys 修改replys的第1个成员的replys属性
  // replys.n.replys 修改replys的第n个成员的replys属性
  var key = 'replys.'+ req.body.replyIndex +'.replys'
  jsonReply[key] = req.body.reply
  db.push('posts', {
    // 使用_id辨别帖子， 利用被回复的评论的时间判断评论
    '_id': require('mongodb').ObjectId(req.body._id),
  }, jsonReply, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      res.send('success')
      // 更新最后修改时间
      db.update('posts', {'_id': require('mongodb').ObjectId(req.body._id)}, {'lastModifyTime': req.body.reply.time}, () => {})
      // 更新被回复人的消息(回复自己的评论不提醒)
      if (req.body.username !== req.body.reply.username) {
        // 向被回复用户添加通知
        db.push('users', {'username': req.body.username}, {'replyNotifications': {
          'username': req.body.reply.username,
          'title': req.body.title,
          'postId': req['body']['_id'],
          'replyIndex': req.body.replyIndex
        }}, () => {}, true) // 可重复
        db.update('users', {'username': req.body.username}, {
          'newReplyNt': true,
        }, () => {})
        return
      }
    }
  })
})

module.exports = router