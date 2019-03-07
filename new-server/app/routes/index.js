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
}

module.exports = router