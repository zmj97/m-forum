var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 查询所有小组的名字
router.get('/names', function (req, res) {
  db.find('groups', [{}, {'name': 1}], function (err, data) {
    if (err) {
      console.error(err)
      return res.send()
    } else if (data.length > 0) {
      return res.send(data)
    } else {
      return res.send('false') 
    }
  })
})

// 查询所有小组
router.get('*', function (req, res) {
  db.find('groups', {}, function (err, data) {
    if (err) {
      console.error('数据库查询错误')
      return res.send()
    } else if (data.length > 0) {
      return res.send(data)
    } else {
      return res.send('false') 
    }
  })
})

// 查询指定名称小组
router.post('/byName', function (req, res) {
  if (req.body.name === []) {
    return res.send('empty')
  }
  db.find('groups', {$or: req.body.name}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send()
    } else if (data.length > 0) {
      var groupNames = []
      data.forEach(group => {
        group.posts = []
        groupNames.push({'group': group.name})
      })
      if (groupNames === []) {
        return res.send('empty')
      }
      getGroupPosts(groupNames, res, posts => {
        data.forEach(group => {
          posts.forEach(post => {
            if (post.group === group.name) {
              group.posts.push(post)
            }
          })
        })
        return res.send(data)
      })
    } else {
      return res.send('false') 
    }
  })
})

// 按照关键词搜索小组
router.post('/search', function (req, res) {
  db.searchGroups(req.body.searchStr, function (err, data) {
    if (err) {
      console.log(err)
      res.send('error')
    } else {
      res.send(data)
    }
  })
})

function getGroupPosts (groupNames, res, callback) {
  db.find('posts', {$or: groupNames}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send()
    } else {
      callback(data)
    }
  })
}


module.exports = router
