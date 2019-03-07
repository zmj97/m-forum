'use strict'

const WikiModel = require('../models/wiki')
const bodyParser = require('body-parser')

class Wiki {
  constructor () {
    this.searchByStr = this.searchByStr.bind(this)
  }

  /*
   * funcs
   */

  async searchWikis (searchStr) {
    let searchResult = []
    const wikis = WikiModel.find()
    wikis.forEach(item => {
      if (item.title.indexOf(searchStr) !== -1
       || item.lastestVersion.content.indexOf(searchStr) !== -1) {
        searchResult.push(item.title)
      }
    })
    return searchResult
  }

  /*
   * create
   */

  async newPage (req, res) {
    try {
      // 检查标题是否重复
      const page = await WikiModel.findOne({'title': req.body.title})
      if (page) {
        return res.send('repeat')
      }
      await WikiModel.create(req.body)
      return res.send('success')
    } catch (err) {
      console.log('newPage() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * find
   */

  async getPage (req, res) {
    try {
      const page = await WikiModel.findOne(req.body)
      if (page) {
        return res.send(page)
      }
      return res.send('not-exist')
    } catch (err) {
      console.log('getPage() Failed: ', err)
      return res.send('error')
    }
  }

  async getTitles (req, res) {
    try {
      return res.send(await WikiModel.find().select({'title': 1, 'groups': 1}))
    } catch (err) {
      console.log('getTitles() Failed: ', err)
      return res.send('error')
    }
  }

  async searchByStr (req, res) {
    try {
      return res.send(await searchByStr(req.body.searchStr))
    } catch (err) {
      console.log('searchByStr() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * update
   */

  async edit (req, res) {
    try {
      await WikiModel.findOneAndUpdate({'title': req.body.title}, {
        // 更新allVersions
        $push: {'allVersions': req.body.lastestVersion},
        // 更新lastestVersion
        $set: {'lastestVersion': req.body.lastestVersion}
      })
      return res.send('success')
    } catch (err) {
      console.log('edit() Failed: ', err)
      return res.send('error')
    }
  }

  async updateGroups (req, res) {
    try {
      await WikiModel.findOneAndUpdate({'title': req.body.title}, {$set: {'groups': req.body.groups}})
      return res.send('success')
    } catch (err) {
      console.log('updateGroups() Failed: ', err)
      return res.send('error')
    }
  }

  // 需要外网可访问
  // http://172.26.73.221:3000/wiki/update/hooks
  async hooks (req, res) {
    try {
      console.log(req.body)
      return res.send('hooks连接成功！')
    } catch (err) {
      console.log('hooks() Failed: ', err)
      return res.send('error')
    }
  }

  /*
   * delete
   */

  async deletePage (req, res) {
    try {
      await WikiModel.findByIdAndDelete(req.body._id)
      return res.send('success')
    } catch (err) {
      console.log('deletePage() Failed: ', err)
      return res.send('error')
    }
  }

}

module.exports = new Wiki()