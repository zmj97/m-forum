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
		if (req.path === '/') {
			const indexPath = './web/index.html'
			res.sendFile(path.resolve(indexPath))
		} else {
    fs.readFile('/home/front/server/web' + req.path, function (err, data) {
      if (err) {
        return res.send('404')
      } else {
        return res.send(data)
      }
    })
    }
  })
}

module.exports = router
