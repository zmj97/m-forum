var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 修改加入设置
router.post('/join-public', function (req, res) {
  db.update('groups', {'name': req.body.name}, {'joinPublic': req.body.joinPublic}, function (err, data) {
    if (err) {
      console.error(err)
      res.send('error')
    } else {
      res.send('success')
    }
  })
})

// 通过用户申请
router.post('/accept', function (req, res) {
  // 将用户加入小组成员数组中
  db.push('groups', {'name': req.body.name}, {'users': req.body.username}, function (err, data) {
    if (err) {
      console.log(err)
      res.send('error')
    } else {
      // 更新成员的已加入小组
      db.push('users', {'username': req.body.username}, {
        'groups': req.body.name
      }, () => {})
      // 删除组长的申请通知
      db.pull('users', {'username': req.body.leader}, {'applyNotifications': {
        'username': req.body.username,
        'groupName': req.body.name
      }}, () => {})
      // 为用户添加结果通知
      db.push('users', {'username': req.body.username}, {'resultNotifications': {
        'groupName': req.body.name,
        'result': true
      }}, () => {}, true) // 可重复
      db.update('users', {'username': req.body.username}, {
        'newResultNt': true,
      }, () => {})
      res.send('success')
    }
  })
})

// 拒绝用户申请
router.post('/refuse', function (req, res) {
  // 删除组长的申请通知
  db.pull('users', {'username': req.body.leader}, {'applyNotifications': {
    'username': req.body.username,
    'groupName': req.body.name
  }}, function (err, data) {
    if (err) {
      console.log(err)
      res.send('error')
    } else {
      // 为用户添加结果通知
      db.push('users', {'username': req.body.username}, {'resultNotifications': {
        'groupName': req.body.name,
        'result': false
      }}, () => {}, true) // 可重复
      db.update('users', {'username': req.body.username}, {
        'newResultNt': true,
      }, () => {})
      res.send('success')
    }
  })
})

router.post('/avatar', function (req, res) {
  db.update('groups', {'name': req.body.name}, req.body, function (err, data) {
    if (err) {
      console.error(err)
      res.send('error')
    } else {
      res.send('success')
    }
  })
})

// 创建小组内可见的帖子
// router.post('*', function (req, res) {

//   // 检查小组名是否重复
//   db.find('groups', {'name': req.body.name}, function (err, data) {
//     if (err) {
//       console.error('数据库错误!')
//       return res.send('error')
//     } else if (data.length > 0) {
//       return res.send('repeat')
//     }
    
//     // 无重复时创建小组
//     db.create('groups', req.body, function (err, data) {
//       if (err) {
//         console.error('数据库错误!')
//         return res.send('error')
//       } else {
//         var username = req.body.leader
//         var groupName = req.body.name
//         // 更新用户数据（已加入小组）
//         db.push('users', {'username': username}, {'groups': groupName}, function (err, data) {
//           if (err) {
//             console.error('数据库错误!')
//             db.delete('groups', req.body)
//             return res.send('error')
//           } else {
//             return res.send('success')
//           }
//         })
//       }
//     })
//   })

// })

module.exports = router