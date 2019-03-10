'use strict'

const GroupModel = require('../models/group')
const PostModel = require('../models/post')
const UserModel = require('../models/user')
const bodyParser = require('body-parser')

class Group {
  constructor () {
    this.newMember = this.newMember.bind(this)
    this.searchByStr = this.searchByStr.bind(this)
  }

  /*
   * funcs
   */

  async addMember (req, res) {
    try {
      await GroupModel.findOneAndUpdate({'name': req.body.name}, {$addToSet: {'users': req.body.username}})
      await UserModel.findOneAndUpdate({'username': req.body.username}, {$addToSet: {'groups': req.body.name}})
      return res.send('success')
    } catch (err) {
      console.log('addMember() Failed: ', err)
      return res.send('error')
    }
  }

  async searchGroups (searchStr) {
    let searchResult = []
    const groups = await GroupModel.find()
    groups.forEach(item => {
      if (item.name.indexOf(searchStr) !== -1
       || item.intro.indexOf(searchStr) !== -1) {
        searchResult.push(item)
      }
    })
    return searchResult
  }

  /*
   * create
   */

  // 组长添加新成员
  async newMember (req, res) {
    return await this.addMember(req, res)
  }

  // 用户申请加入小组
  async join (req, res) {
    try {
      const group = await GroupModel.findOne({'name': req.body.name})
      // 小组不存在
      if (!group) {
        return res.send('not-exist')
      }
      // 如果小组开放加入
      if (group.joinPublic) {
        return await this.addMember(req, res)
      }
      // 如果小组未开放加入，需要申请经过组长同意
      await UserModel.findOneAndUpdate({'username': req.body.leader}, {
        $addToSet: {
          'applyNotifications': {
            'username': req.body.username,
            'groupName': req.body.name
          }
        },
        $set: {
          'newApplyNt': true
        }
      })
      return res.send('applied')
    } catch (err) {
      console.log('join() Failed: ', err)
      return res.send('error')
    }
  }

  // 创建小组
  async newGroup (req, res) {
    try {
      const group = await GroupModel.findOne({'name': req.body.name})
      if (group) {
        return res.send('repeat')
      }

      // 无重复时创建小组
      await Promise.all([
        GroupModel.create(req.body),
        // 更新用户数据（已加入小组）
        UserModel.findOneAndUpdate({'username': req.body.leader}, {$addToSet: {'groups': req.body.name}})
      ])

      return res.send('success')
    } catch (err) {
      console.log('newGroup() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * find
   */

  // 查询所有小组的名字
  async getNames (req, res) {
    try {
      const data = await GroupModel.find().select({'name': 1})
      if (data.length === 0) {
        return res.send('false')
      } else {
        return res.send(data)
      }
    } catch (err) {
      console.log('getNames() Failed: ', err)
      return res.send('error')
    }
  }

  // 查询所有小组
  async getAll (req, res) {
    try {
      const data = await GroupModel.find()
      if (data.length === 0) {
        return res.send('false')
      } else {
        return res.send(data)
      }
    } catch (err) {
      console.log('getAll() Failed: ', err)
      return res.send('error')
    }
  }

  // 查询指定名称小组
  async getByName (req, res) {
    try {
      if (req.body.name === []) {
        return res.send('empty')
      }
      // groups中无帖子
      const groups = await GroupModel.find({$or: req.body.name})
      let tasks = []
      for (let i = 0; i < groups.length; i++) {
        tasks.push(async () => {
          groups[i].posts = await PostModel.find({'group': groups[i].name})
        })
      }
      await Promise.all(tasks)
      return res.send(groups)
    } catch (err) {
      console.log('getByName() Failed: ', err)
      return res.send('error')
    }
  }

  // 搜索
  async searchByStr (req, res) {
    try {
      return res.send(await this.searchGroups(req.body.searchStr))
    } catch (err) {
      console.log('searchByStr() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * update
   */

  // 修改加入设置
  async updateJoinPublic (req, res) {
    try {
      await GroupModel.findOneAndUpdate({'name': req.body.name}, {$set: {'joinPublic': req.body.joinPublic}})
      return res.send('success')
    } catch (err) {
      console.log('updateJoinPublic() Failed: ', err)
      return res.send('error')
    }
  }

  // 通过用户申请
  async acceptJoin (req, res) {
    try {
      await Promise.all([
        // 将用户加入小组成员数组中
        GroupModel.findOneAndUpdate({'name': req.body.name}, {$addToSet: {'users': req.body.username}}),
        // 删除组长的申请通知
        UserModel.findOneAndUpdate({'username': req.body.leader}, {$pull: {
          'applyNotifications': {
            'username': req.body.username,
            'groupName': req.body.name
          }
        }}),
        UserModel.findOneAndUpdate({'username': req.body.username}, {
          // 更新成员的已加入小组
          $addToSet: {'groups': req.body.name},
          // 为用户添加结果通知
          $push: {'resultNotifications': {
            'groupName': req.body.name,
            'result': true
          }},
          // 用户有新通知
          $set: {'newResultNt': true}
        })
      ])
      return res.send('success')
    } catch (err) {
      console.log('acceptJoin() Failed: ', err)
      return res.send('error')
    }
  }

  // 拒绝用户申请
  async refuseJoin (req, res) {
    try {
      await Promise.all([
        // 删除组长的申请通知
        UserModel.findOneAndUpdate({'username': req.body.leader}, {$pull: {
          'applyNotifications': {
            'username': req.body.username,
            'groupName': req.body.name
          }
        }}),
        UserModel.findOneAndUpdate({'username': req.body.username}, {
          // 为用户添加结果通知
          $push: {'resultNotifications': {
            'groupName': req.body.name,
            'result': false
          }},
          // 用户有新通知
          $set: {'newResultNt': true}
        })
      ])
      return res.send('success')
    } catch (err) {
      console.log('refuseJoin() Failed: ', err)
      return res.send('error')
    }
  }

  // 更新头像
  async updateAvatar (req, res) {
    try {
      await GroupModel.findOneAndUpdate({'name': req.body.name}, {$set: req.body})
      return res.send('success')
    } catch (err) {
      console.log('updateAvatar() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * delte
   */

  // 删除成员
  async deleteMember (req, res) {
    try {
      await Promise.all([
        GroupModel.findOneAndUpdate({'name': req.body.name}, {$pull: {'users': {$in: req.body.usernames}}}),
        UserModel.updateMany({'username': {$in: req.body.usernames}}, {$pull: {'groups': req.body.name}})
      ])
      return res.send('success')
    } catch (err) {
      console.log('deleteMember() Failed: ', err)
      return res.send('error')
    }
  }

  // 删除小组
  async deleteGroup (req, res) {
    try {
      const members = await GroupModel.findOne({'name': req.body.name}).users
      await Promise.all([
        UserModel.updateMany({'username': {$in: members}}, {$pull: {'groups': req.body.name}}),
        GroupModel.deleteOne({'name': req.body.name}),
        PostModel.deleteMany({'group': req.body.name})
      ])
      return res.send('success')
    } catch (err) {
      console.log('deleteMember() Failed: ', err)
      return res.send('error')
    }
  }

}

module.exports = new Group()
