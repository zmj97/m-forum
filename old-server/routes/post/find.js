var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())


// 获取指定用户可见的所有post(按页获取)
router.post('/all', function (req, res) {
  db.find('users', {'username': req.body.username}, function (err, data) {
    var json = [{'group': undefined}]
    if (data.length > 0) {
      data[0].groups.forEach(item => {
        json.push({'group': item})
      })
    }
    findPosts({$or: json}, req.body.page, res)
  })
})


// 获取指定用户或指定小组内所有发帖（按页获取）
router.post('/limit', function (req, res) {
  findPosts(req.body.json, req.body.page, res)
})


// 按照id查找post并返回 , 接受数组
router.post('/byId', function (req, res) {
  let ids = req.body._id.map(function(elem) {
    return require('mongodb').ObjectId(elem)
  })

  db.find('posts', {'_id': {$in: ids}}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send('error')
    } else if (data.length === 0) {
      res.send('empty')
    } else {
      res.send(data)
    }
  })
})

// 按照关键词搜索帖子
router.post('/search', function (req, res) {
  db.searchPosts(req.body.searchStr, function (err, data) {
    if (err) {
      console.log(err)
      res.send('error')
    } else {
      res.send(data)
    }
  })
})

function findPosts (json, page, res) {
  db.findPosts(json, page, function (err, data) {
    if (err) {
      console.error('数据库查询帖子错误')
      return res.send('error')
    } else {
      db.getPostsCount(json, function (err, count) {
        if (err) {
          console.error('数据库查询帖子总数错误')
          return res.send('error')
        } else {
          return res.send({'data': data, 'count': count})
        }
      })
    }
  })
}

module.exports = router