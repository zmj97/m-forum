var express = require('express')
var router = express.Router()

// 引入模块
var create = require('./group/create.js')
var update = require('./group/update.js')
var find = require('./group/find.js')
var del = require('./group/delete.js')

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