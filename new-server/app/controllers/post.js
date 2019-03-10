'use strict'

const UserModel = require('../models/user')
const PostModel = require('../models/post')
const config = require('../../config/index')
const fs = require('fs')
const bodyParser = require('body-parser')

class Post {
  constructor () {
    this.postsPerPage = 20
    this.getAll = this.getAll.bind(this)
    this.getLimit = this.getLimit.bind(this)
    this.searchByStr = this.searchByStr.bind(this)
		this.deleteReply = this.deleteReply.bind(this)
    this.deleteById = this.deleteById.bind(this)
  }

  /*
   * funcs
   */

	deleteImgs (content) {
		const pattern = new RegExp('!\\[.*?\\]\\(.*?' + config.ip + '.*?\\)', 'g')
		const imgs = content.match(pattern)
		if (!imgs) return
		const skipStr = '](http://120.79.144.82/statics/'
    for (let i = 0; i < imgs.length; i++) {
      fs.unlink('./public/' + imgs[i].slice(imgs[i].indexOf('](http') + skipStr.length, -1), function (err, data) {
        if (err) console.log(err)
      })
    }

	}

  async getPostsByPage (json, page) {
    let data, count
    await Promise.all([
      (async () => {
        data = await PostModel.find(json).sort({lastModifyTime: -1}).skip((page - 1) * this.postsPerPage).limit(this.postsPerPage)
      })(),
      (async () => {
        count = await PostModel.countDocuments(json)
      })()
    ])
    return {data, count}
  }

  async searchPosts (searchStr) {
    let searchResult = []
    const posts = await PostModel.find().sort({"lastModifyTime":-1})
    posts.forEach(item => {
      if (item.title.indexOf(searchStr) !== -1
       || item.abstract.indexOf(searchStr) !== -1
       || item.content.indexOf(searchStr) !== -1
       || item.replys.some(reply => {
            return (reply.content.indexOf(searchStr) !== -1
              || reply.replys.some(r => {
                return r.content.indexOf(searchStr) !== -1
              }))
      })) {
        searchResult.push(item)
      }
    })
    return searchResult
  }

  /*
   * create
   */

  // 发布新的post
  async newPost (req, res) {
    try {
      await PostModel.create(req.body)
      return res.send('success')
    } catch (err) {
      console.error('发布帖子失败:', err)
      return res.send('error')
    }
  }

  // 新的回复
  async newReply (req, res) {
    try {
      await Promise.all([
        // 添加回复
        (async () => {
          // 添加回复并获取楼层数(0,1,,...)
          const index = (await PostModel.findByIdAndUpdate(req.body._id, {$addToSet: {replys: req.body.reply}})).replys.length - 1
          // 更新被回复人的消息(回复自己的帖子不提醒)
          if (req.body.username !== req.body.reply.username) {
            await UserModel.findOne({'username': req.body.username}).replyNotifications.push({
              'username': req.body.reply.username,
              'title': req.body.title,
              'postId': req.body._id,
              'replyIndex': index
            })
          }
        })(),

        // 更新最新修改时间
        PostModel.findByIdAndUpdate(req.body._id, {$set: {'lastModifyTime': req.body.reply.time}}),

        (async () => {
          // 被回复用户是否有新回复设为true
          // 回复自己的帖子不提醒
          if (req.body.username !== req.body.reply.username) {
            await UserModel.findOneAndUpdate({
              'username': req.body.username
            }, {'newReplyNt': true})
          }
        })()
      ])

      return res.send('success')
    } catch (err) {
      console.error('添加回复失败:', err)
      return res.send('error')
    }
  }

  // 新的楼中楼
  async newReplyToReply (req, res) {
    try {
      // replys.0.replys 修改replys的第0个成员的replys属性
      // replys.1.replys 修改replys的第1个成员的replys属性
      // replys.n.replys 修改replys的第n个成员的replys属性
      const key = 'replys.'+ req.body.replyIndex +'.replys'
      let jsonReply = {}
      jsonReply[key] = req.body.reply

      await Promise.all([
        // 添加楼中楼
        PostModel.findByIdAndUpdate(req.body._id, jsonReply),

        // 更新最新修改时间
        PostModel.findByIdAndUpdate(req.body._id, {$set: {'lastModifyTime': req.body.reply.time}}),

        (async () => {
          // 更新被回复人的消息
          // 被回复用户是否有新回复设为true
          // 回复自己的帖子不提醒
          if (req.body.username !== req.body.reply.username) {
            await Promise.all([
              UserModel.findOne({'username': req.body.username}).replyNotifications.push({
                'username': req.body.reply.username,
                'title': req.body.title,
                'postId': req['body']['_id'],
                'replyIndex': req.body.replyIndex
              }),
              UserModel.findOneAndUpdate({
                'username': req.body.username
              }, {'newReplyNt': true})
            ])
          }
        })()
      ])

      return res.send('success')
    } catch (err) {
      console.error('添加楼中楼失败:', err)
      return res.send('error')
    }
  }

  /*
   * find
   */

  // 获取指定用户可见的所有post(按页获取)
  async getAll (req, res) {
    try {
      let groups = [undefined]
      groups.push(...(await UserModel.findOne({username: req.body.username}).select({groups: 1})).groups)
      return res.send(await this.getPostsByPage({group: {$in: groups}}, req.body.page))
    } catch (err) {
      console.error('getAll() Failed:', err)
      return res.send('error')
    }
  }

  // 获取指定用户或指定小组内所有发帖（按页获取）
  async getLimit (req, res) {
    try {
      return res.send(await this.getPostsByPage(req.body.json, req.body.page))
    } catch (err) {
      console.error('getLimit() Failed:', err)
      return res.send('error')
    }
  }

  // 按照id查找post并返回 , 接受数组
  async getById (req, res) {
    try {
      const data = await PostModel.find({_id: {$in: req.body._id}})
      if (data.length === 0) return res.send('empty')
      else return res.send(data)
    } catch (err) {
      console.error('getById() Failed:', err)
      return res.send('error')
    }
  }

  // 按照关键词搜索帖子
  async searchByStr (req, res) {
    try {
      return res.send(await this.searchPosts(req.body.searchStr))
    } catch (err) {
      console.error('searchByStr() Failed:', err)
      return res.send('error')
    }
  }

  /*
   * update
   */

  // none

  /*
   * delete
   */

  // 删除评论
  async deleteReply (req, res) {
    try {
      const arrayName = 'replys'
      const key = arrayName + '.' + req.body.index
      let unsetJson = {}
      unsetJson[key] = 1
      let pullJson = {}
      pullJson[arrayName] = null
			const post = await PostModel.findById(req.body._id)
      await PostModel.findByIdAndUpdate(req.body._id, {$unset: unsetJson})
      await PostModel.findByIdAndUpdate(req.body._id, {$pull: pullJson})
      this.deleteImgs(post['replys'][req.body.index]['content'])
			return res.send('success')
    } catch (err) {
      console.error('deleteReply() Failed:', err)
      return res.send('error')
    }
  }

  // 删除楼中楼
  async deleteReplyToReply (req, res) {
    try {
      const key = 'replys.' + req.body.index + '.replys'
      let jsonReply = {}
      jsonReply[key] = req.body.reply
      await PostModel.findByIdAndUpdate(req.body._id, {$pull: jsonReply})
      return res.send('success')
    } catch (err) {
      console.error('deleteReplyToReply() Failed:', err)
      return res.send('error')
    }
  }

  // 删除帖子，使用id辨别
  async deleteById (req, res) {
    try {
			const post = await PostModel.findById(req.body._id)
      await Promise.all([
        PostModel.findByIdAndDelete(req.body._id),
        UserModel.updateMany({}, {$pull: {stars: {id: req.body._id}}})
			])
			this.deleteImgs(post.content)
      return res.send('success')
    } catch (err) {
      console.error('deleteById() Failed:', err)
      return res.send('error')
    }
  }
}

module.exports = new Post()
