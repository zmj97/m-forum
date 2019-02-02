var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

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