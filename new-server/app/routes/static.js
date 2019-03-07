'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const md5 = require('md5-node')

// 获取mime类型
const mimeModel = require('../models/mime')
const staticPath = __dirname + '/../../public/'

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
router.use(bodyParser.json({ limit: '50mb' }))

router.get('*', function (req, res) {
  const pathname = staticPath + req.url.slice(1)
  // 后缀名
  const extname = path.extname(pathname)
  fs.readFile(pathname, function (err, data) {
    if (err) {
      console.log('404')
      return res.send()
    } else {
      mimeModel.getMime(extname, mime => {
        res.header("Content-Type", mime + ";charset='utf-8'")
        return res.send(data)
      })
    }
  })
})

const url = 'http://172.26.73.221:3000/statics/'
router.post('/upload', function (req, res) {
   // 保存图片
   // 返回[[pos, url], [pos, url]...]
  const files = req.body
  let resData = []
  for (let pos in files) {
    const filename = (new Date()).getTime().toString() + path.extname(files[pos]['_name'])
    const notNumber = files[pos]['miniurl'].replace(/^data:image\/\w+;base64,/, "")
    const encoding = 'base64'
    let imgBuffer
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
      imgBuffer = Buffer.from(notNumber, encoding)
    } else {
      if (typeof notNumber === 'number') {
        throw new Error('The "size" argument must be not of type number.');
      }
      imgBuffer = new Buffer(notNumber, encoding)
    }
    // writeFile为异步，因此先push文件名再保存图片
    resData.push([pos, url + filename])
    fs.writeFile(staticPath + filename, imgBuffer, (err) => {
      if (err) {
        return res.send(err)
      }
    })
  }
  return res.send(resData)
})

router.post('/upload-avatar', function (req, res) {
  // 保存图片
  // 返回url
  // 中文名显示异常，改为md5
  let filename
  if (req.body.username) {
    filename = 'user-' + md5(req.body.username) + path.extname(req.body._name)
  } else {
    filename = 'group-' + md5(req.body.name) + path.extname(req.body._name)
  }

  const notNumber = req.body.miniurl.replace(/^data:image\/\w+;base64,/, "")
  const encoding = 'base64'
  let imgBuffer
  if (Buffer.from && Buffer.from !== Uint8Array.from) {
    imgBuffer = Buffer.from(notNumber, encoding)
  } else {
    if (typeof notNumber === 'number') {
      throw new Error('The "size" argument must be not of type number.');
    }
    imgBuffer = new Buffer(notNumber, encoding)
  }
  fs.writeFile(staticPath + filename, imgBuffer, (err) => {
    if (err) {
      return res.send(err)
    }
  })
  return res.send(url + filename)
})


module.exports = router