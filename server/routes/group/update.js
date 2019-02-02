var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

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