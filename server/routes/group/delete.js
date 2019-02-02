var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 删除小组
router.post('*', function (req, res) {

  db.find('groups', {'name': req.body.name}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else {
      var usernames = []
      data[0].users.forEach(username => {
        usernames.push({'username': username})
      })
      db.pull('users', {$or: usernames}, {'groups': req.body.name}, data => {})
      db.delete('groups', {'name': req.body.name}, data => {})
      db.delete('posts', {'group': req.body.name}, data => {})
      return res.send('success')
    }
  })

})

module.exports = router