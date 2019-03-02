var express = require('express')
var router = express.Router()

// 引入模块
var create = require('./wiki/create.js')
var update = require('./wiki/update.js')
var find = require('./wiki/find.js')
var del = require('./wiki/delete.js')

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