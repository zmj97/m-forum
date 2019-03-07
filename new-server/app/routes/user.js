'use strict'

const User = require('../controllers/user')
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// create
router.post('/create/signup', User.signup)
router.post('/create/star', User.star)

// find
router.post('/find/login', User.login)
router.post('/find/data', User.getData)
router.post('/find/groups-names', User.getGroupsNames)
router.post('/find/notifications', User.getNotifications)
router.post('/find/newNt', User.getNewNt)
router.post('/find/stars', User.getStars)

// update
router.post('/update/info', User.updateInfo)
router.post('/update/newNt', User.updateNewNt)

// delete
router.post('/delete/Nt', User.deleteNt)
router.post('/delete/star', User.unStar)


module.exports = router