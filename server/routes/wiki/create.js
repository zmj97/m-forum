var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 发布新的page
router.post('/new', function (req, res) {
  // 检查标题是否重复
  db.find('wikis', {'title': req.body.title}, function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else if (data.length > 0) {
      return res.send('repeat')
    } else {
      // 添加到wikis集合
      db.create('wikis', req.body, function (err, data) {
        if (err) {
          console.error(err)
          return res.send('error')
        } else {
          return res.send('success')
        }
      })
    }
  })
})

module.exports = router