var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
//md5用于加密
var md5 = require('md5-node')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 登录
router.post('/login', function (req, res) {
  req.body.password = md5(req.body.password)

  findUser(req.body, res)
})

// 根据用户名获取用户数据
router.post('/data', function (req, res) {
  if (req.body.username instanceof Array) {
    // 如果查询多个用户
    db.find('users', {$or: req.body.username}, function (err, data) {
      if (err) {
        console.error('数据库查询错误')
        return res.send()
      } else if (data.length > 0) {
        return res.send(data)
      } else {
        return res.send('false') 
      }
    })
  } else {
    // 如果查询一个用户
    findUser(req.body, res)
    // db.find('users', req.body, function (err, data) {
    //   if (err) {
    //     console.error('数据库查询错误')
    //     return res.send()
    //   } else if (data.length > 0) {
    //     return res.send(data[0])
    //   } else {
    //     return res.send('false') 
    //   }
    // })
  }
})

// 获取指定用户加入的所有小组的名字
router.post('/groups-names', function (req, res) {
  db.find('users', [req.body, {'groups': 1}], function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data)
    }
  })
})

// 获取指定用户的所有通知
router.post('/notifications', function (req, res) {
  db.find('users', [req.body, {
    'applyNotifications': 1, 
    'resultNotifications': 1, 
    'replyNotifications': 1,
    'newApplyNt': 1, 
    'newResultNt': 1, 
    'newReplyNt': 1
  }], function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data[0])
    }
  })
})


// 获取指定用户是否有新的通知
router.post('/newNt', function (req, res) {
  db.find('users', [req.body, {
    'newApplyNt': 1, 
    'newResultNt': 1, 
    'newReplyNt': 1
  }], function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data[0])
    }
  })
})

// 获取指定用户的收藏
router.post('/stars', function (req, res) {
  db.find('users', [req.body, {
    'stars': 1
  }], function (err, data) {
    if (err) {
      console.log(err)
      return res.send('error')
    } else {
      return res.send(data[0])
    }
  })
})

function findUser(json, res) {
  db.find('users', json, function (err, data) {
    if (err) {
      console.error('数据库查询用户错误')
      return res.send()
    } else if (data.length > 0) {
      return res.send(data[0])
    } else {
      return res.send('false') 
    }
  })
}

module.exports = router