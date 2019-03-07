'use strict'

const Post = require('../controllers/post')
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

// 设置body-parser中间件
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// create
router.post('/create/new', Post.newPost)
router.post('/create/reply', Post.newReply)
router.post('/create/reply-to-reply', Post.newReplyToReply)

// find
router.post('/find/all', Post.getAll)
router.post('/find/limit', Post.getLimit)
router.post('/find/byId', Post.getById)
router.post('/find/search', Post.searchByStr)

// update

// delete
router.post('/delete/reply', Post.deleteReply)
router.post('/delete/reply-to-reply', Post.deleteReplyToReply)
router.post('/delete*', Post.deleteById)


module.exports = router