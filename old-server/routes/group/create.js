var express = require('express')
var router = express.Router()
var db = require('../../modules/db.js')
var bodyParser = require('body-parser')

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 组长添加新成员
router.post('/member', function (req, res) {
  addMember(req, res)
})

// 用户申请加入小组
router.post('/join', function (req, res) {
  db.find('groups', {'name': req.body.name}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send('error')
    } else if (data.length === 0) {
      // 小组不存在
      return res.send('not-exist')
    } else if (data[0].joinPublic) {
      // 如果小组开放加入
      addMember(req, res)
    } else {
      res.send('applied')
      // 如果小组未开放加入，需要申请经过组长同意
      db.push('users', {'username': req.body.leader}, {'applyNotifications': {
        'username': req.body.username,
        'groupName': req.body.name
      }}, () => {})
      db.update('users', {'username': req.body.leader}, {
        'newApplyNt': true,
      }, () => {})
    }
  })
})

// 创建小组
router.post('*', function (req, res) {

  // 检查小组名是否重复
  db.find('groups', {'name': req.body.name}, function (err, data) {
    if (err) {
      console.error('数据库错误!')
      return res.send('error')
    } else if (data.length > 0) {
      return res.send('repeat')
    }

    // 无重复时创建小组
    db.create('groups', req.body, function (err, data) {
      if (err) {
        console.error('数据库错误!')
        return res.send('error')
      } else {
        var username = req.body.leader
        var groupName = req.body.name
        // 更新用户数据（已加入小组）
        db.push('users', {'username': username}, {'groups': groupName}, function (err, data) {
          if (err) {
            console.error('数据库错误!')
            db.delete('groups', req.body)
            return res.send('error')
          } else {
            return res.send('success')
          }
        })
      }
    })
  })
})

function addMember (req, res) {
  db.push('groups', {'name': req.body.name}, {'users': req.body.username}, function (err, data) {
    if (err) {
      console.error(err)
      return res.send('error')
    } else {
      db.push('users', {'username': req.body.username}, {'groups': req.body.name}, function (err, data) {
        if (err) {
          console.log(err)
          return res.send('error')
        } else {
          return res.send('success')
        }
      })
    }
  })
}

module.exports = router