var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/page', function (req, res) {
  db.find('wikis', req.body, function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data[0])
    }
  })
})

router.post('/titles', function (req, res) {
  db.find('wikis', [{}, {'title': 1, 'groups': 1}], function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data)
    }
  })
})

// 按照关键词搜索wiki
router.post('/search', function (req, res) {
  db.searchWikis(req.body.searchStr, function (err, data) {
    if (err) {
      console.log(err)
      res.send('error')
    } else {
      res.send(data)
    }
  })
})

module.exports = router