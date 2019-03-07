var express = require('express')
var router = express.Router()

// 引入模块
var create = require('./user/create.js')
var update = require('./user/update.js')
var find = require('./user/find.js')
var del = require('./user/delete.js')

/*
- create
- update
- find
- delete
*/
router.use('/create', create)
router.use('/update', update)
router.use('/find', find)
router.use('/delete', del)

module.exports = router