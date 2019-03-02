var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var md5 = require('md5-node')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/Nt', function (req, res) {
  db.update('users', {'username': req.body.username}, req.body, function (err, data) {
    if (err) {
      console.error(err)
      res.send('error')
    } else {
      res.send('success')
    }
  })
})

// 取消收藏
router.post('/star', function (req, res) {
  db.pull('users', {'username': req.body.username}, {'stars': {
    'id': req.body.id
  }}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

module.exports = router