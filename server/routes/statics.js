var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var fs = require('fs')
var path = require('path')
// 获取mime类型
var mimeModel = require('../modules/mimeModel.js')
var staticPath = __dirname + '/../public/'

// 设置body-parser中间件
router.use(bodyParser.json({limit: '50mb'}))
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
// router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('*', function (req, res) {
  var pathname = staticPath + req.url.slice(1)
  // 后缀名
  var extname = path.extname(pathname)
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

var url = 'http://localhost:3000/statics/'
router.post('/upload', function (req, res) {
   // 保存图片
   // 返回[[pos, url], [pos, url]...]
  var files = req.body
  var resData = []
  for (var pos in files) {
    var filename = (new Date()).getTime().toString() + path.extname(files[pos]['_name'])
    var imgBuffer = new Buffer(files[pos]['miniurl'].replace(/^data:image\/\w+;base64,/, ""), 'base64')
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

module.exports = router
