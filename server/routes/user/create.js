var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var md5 = require('md5-node')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/signup', function (req, res) {
  req.body.password = md5(req.body.password)

  // 检查用户名或邮箱是否重复
  db.find('users', {$or: [{'username': req.body.username}, {'email': req.body.email}]}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else if (data.length > 0) {
      return res.send('repeat')
    }
    
    // 无重复时创建账号
    db.create('users', req.body, function (err, data) {
      if (err) {
        console.error('数据库错误!')
        return res.send('error')
      } else {
        return res.send('success')
      }
    })
  })

})

module.exports = router