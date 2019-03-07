'use strict'

const Group = require('../controllers/group')
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// create
router.post('/create/member', Group.newMember)
router.post('/create/join', Group.join)
router.post('/create*', Group.newGroup)

// find
router.get('/find/names', Group.getNames)
router.get('/find*', Group.getAll)
router.post('/find/byName', Group.getByName)
router.post('/find/search', Group.searchByStr)

// update
router.post('/update/join-public', Group.updateJoinPublic)
router.post('/update/accept', Group.acceptJoin)
router.post('/update/refuse', Group.refuseJoin)
router.post('/update/avatar', Group.updateAvatar)

// delete
router.post('/delete/member', Group.deleteMember)
router.post('/delete*', Group.deleteGroup)


module.exports = router