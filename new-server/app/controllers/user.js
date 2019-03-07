'use strict'

const UserModel = require('../models/user')
const bodyParser = require('body-parser')
const md5 = require('md5-node')


class User {
  constructor () {
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
  }

  // 加密
  encryption (str) {
    const tmpCode = md5(str)
    return md5(tmpCode.slice(2, 6)) + tmpCode
  }

  /*
   * create
   */

  // 注册
  async signup (req, res) {
    try {
      const user = await UserModel.findOne({username: req.body.username})
      if (user) {
        return res.send('repeat')
      } else {
        req.body.password = this.encryption(req.body.password)
        await UserModel.create(req.body)
        return res.send('success')
      }
    } catch (err) {
      console.error('用户注册失败:', err)
      return res.send('error')
    }
  }

  // 收藏
  async star (req, res) {
    try {
      await UserModel.findOneAndUpdate({
        'username': req.body.username
      }, {$addToSet: {stars: {
        'id': req.body.id,
        'title': req.body.title,
        'abstract': req.body.abstract
      }}})
      return res.send('success')
    } catch (err) {
      console.error('用户收藏失败:', err)
      return res.send('error')
    }
  }

  /*
   * find
   */

  // 登录
  async login (req, res) {
    try {
      req.body.password = this.encryption(req.body.password)
      const user = await UserModel.findOne(req.body)
      if (user) {
        return res.send(user)
      } else {
        return res.send('false')
      }
    } catch (err) {
      console.error('用户登录失败:', err)
      return res.send('error')
    }
  }

  // 获取用户数据
  async getData (req, res) {
    try {
      if (req.body.username instanceof Array) {
        // 如果查询多个用户
        const data = await UserModel.find({username: {$in: req.body.username}}).select({password: 0})
        if (data.length > 0) {
          return res.send(data)
        } else {
          return res.send('false')
        }
      } else {
        // 如果查询一个用户
        const user = await UserModel.findOne(req.body).select({password: 0})
        if (user) {
          return res.send(user)
        } else {
          return res.send('false')
        }
      }
    } catch (err) {
      console.error('获取用户数据失败:', err)
      return res.send('error')
    }
  }

  // 获取指定用户加入的所有小组的名字
  async getGroupsNames (req, res) {
    try {
      res.send(await UserModel.find(req.body).select({groups: 1}))
    } catch (err) {
      console.error('获取用户已加入小组名字失败:', err)
      return res.send('error')
    }
  }

  // 获取指定用户的所有通知
  async getNotifications (req, res) {
    try {
      return res.send(
        await UserModel.findOne(req.body).select({
          'applyNotifications': 1,
          'resultNotifications': 1,
          'replyNotifications': 1,
          'newApplyNt': 1,
          'newResultNt': 1,
          'newReplyNt': 1
        }))
    } catch (err) {
      console.error('获取用户所有通知失败:', err)
      return res.send('error')
    }
  }

  // 获取指定用户是否有新的通知
  async getNewNt (req, res) {
    try {
      return res.send(
        await UserModel.findOne(req.body).select({
          'newApplyNt': 1,
          'newResultNt': 1,
          'newReplyNt': 1
        }))
    } catch (err) {
      console.error('获取用户是否有新通知失败:', err)
      return res.send('error')
    }
  }

  // 获取指定用户的收藏
  async getStars (req, res) {
    try {
      return res.send(
        await UserModel.findOne(req.body).select({
          'stars': 1
        }))
    } catch (err) {
      console.error('获取用户收藏失败:', err)
      return res.send('error')
    }
  }

  /*
   * update
   */

  async updateInfo (req, res) {
    try {
      await UserModel.findOneAndUpdate({
        username: req.body.username
      }, {$set: req.body.formdata})
      return res.send('success')
    } catch (err) {
      console.error('更新用户信息失败:', err)
      return res.send('error')
    }
  }

  async updateNewNt (req, res) {
    try {
      await UserModel.findOneAndUpdate({
        username: req.body.username
      }, {$set: req.body})
      return res.send('success')
    } catch (err) {
      console.error('更新用户消息失败:', err)
      return res.send('error')
    }
  }

  /*
   * delete
   */

  async deleteNt (req, res) {
    try {
      await UserModel.findOneAndUpdate({
        username: req.body.username
      }, {$set: req.body})
      return res.send('success')
    } catch (err) {
      console.error('更新用户消息失败:', err)
      return res.send('error')
    }
  }

  // 取消收藏
  async unStar (req, res) {
    try {
      await UserModel.findOneAndUpdate({
        'username': req.body.username
      }, {$pull: {
        stars: {
          'id': req.body.id
        }
      }})
      return res.send('success')
    } catch (err) {
      console.error('取消收藏失败:', err)
      return res.send('error')
    }
  }
}

module.exports = new User()