'use strict'

const Wiki = require('../controllers/wiki')
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// create
router.post('/create/new', Wiki.newPage)

// find
router.post('/find/page', Wiki.getPage)
router.post('/find/titles', Wiki.getTitles)
router.post('/find/search', Wiki.searchByStr)

// update
router.post('/update/edit', Wiki.edit)
router.post('/update/groups', Wiki.updateGroups)
router.post('/update/hooks', Wiki.hooks)

// delete
router.post('/delete*', Wiki.deletePage)


module.exports = router