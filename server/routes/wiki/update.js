var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/edit', function (req, res) {
  // 更新allVersions
  db.push('wikis', {'title': req.body.title}, {'allVersions': req.body.lastestVersion}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send('error')
    } else {
      // 更新lastestVersion
      db.update('wikis', {'title': req.body.title}, {'lastestVersion': req.body.lastestVersion}, function (err, data) {
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

router.post('/groups', function (req, res) {
  db.update('wikis', {'title': req.body.title}, {'groups': req.body.groups}, function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send('success')
    }
  })
})

// http://172.26.73.221:3000/wiki/update/hooks
router.post('/hooks', function (req, res) {
  console.log(req.body)
  return res.send()
})

module.exports = router