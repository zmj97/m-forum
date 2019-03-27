'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  avatar: {type: String, default: null},
  gender: {type: String, default: null},
  telephone: {type: String, default: null},
  groups: {type: Array, default: []},
  stars: [{
    id: String,
    title: String,
    abstract: String
  }],
  applyNotifications: [{
    username: String,
    groupName: String,
  }],
  resultNotifications: [{
    groupName: String,
    result: Boolean,
  }],
  replyNotifications: [{
    username: String,
    title: String,
    postId: String,
    replyIndex: Number,
  }],
  newApplyNt: Boolean,
  newResultNt: Boolean,
  newReplyNt: Boolean
})

const User = mongoose.model('users', userSchema)

module.exports = User
