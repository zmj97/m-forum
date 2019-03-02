var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var md5 = require('md5-node')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/info', function (req, res) {
  
  db.update('users', {'username': req.body.username}, req.body.formdata, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })

})

router.post('/newNt', function (req, res) {
  db.update('users', {'username': req.body.username}, req.body, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

module.exports = router