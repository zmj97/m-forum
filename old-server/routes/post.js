var express = require('express')
var router = express.Router()

// 引入模块
var create = require('./post/create.js')
// var update = require('./post/update.js')
var find = require('./post/find.js')
var del = require('./post/delete.js')

/*
- create
- update
- find
- delete
*/
router.use('/create', create)
// router.use('/update', update)
router.use('/find', find)
router.use('/delete', del)

module.exports = router