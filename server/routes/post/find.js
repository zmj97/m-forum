var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 获取所有post
router.get('/all', function (req, res) {
  findPosts({}, res)
})

// 获取指定条件下的所有post
router.post('/all', function (req, res) {
  findPosts(req.body, res)
})


function findPosts (json, res) {
  db.find('posts', json, function (err, data) {
    if (err) {
      console.error('数据库查询错误')
      return
    } else {
      return res.send(data)
    }
  })
}

module.exports = router