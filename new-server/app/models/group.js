'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
  name: String,
  avatar: {type: String, default: null},
  leader: String,
  intro: String,
  users: {type: Array, default: []},
  joinPubic: Boolean
})

const Group = mongoose.model('groups', groupSchema)

module.exports = Group