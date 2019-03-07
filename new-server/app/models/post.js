'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  username: String,
  title: String,
  abstract: String,
  group: {type: String, default: undefined},
  tags: {type: Array, default: []},
  time: Date,
  content: String,
  lastModifyTime: Date,
  replys: [{
    username: String,
    time: Date,
    content: String,
    replys: [{
      username: String,
      time: Date,
      content: String
    }]
  }]
})

const Post = mongoose.model('posts', postSchema)

module.exports = Post