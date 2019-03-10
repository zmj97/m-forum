const fs = require('fs')
const path = require('path')

const user = require('./user')
const post = require('./post')
const group = require('./group')
const wiki = require('./wiki')
const static = require('./static')

const router = app => {
  app.use('/user', user)
  app.use('/post', post)
  app.use('/group', group)
  app.use('/wiki', wiki)
  app.use('/statics', static)

  app.get('*', function (req, res) {
    const indexPath = './dist/index.html'
    /*
    fs.readFile(indexPath, function (err, data) {
      if (err) {
        console.log('404: index.html')
        return res.send('404')
      } else {
        return res.send(data)
      }
    })
    */
    res.sendFile(path.resolve(indexPath))
  })
}

module.exports = router
