'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wikiSchema = new Schema({
  title: String,
  lastestVersion: {
    username: String,
    time: Date,
    content: String,
    editMessage: String
  },
  allVersions: [{
    username: String,
    time: Date,
    content: String,
    editMessage: String
  }],
  groups: {type: Array, default: []}
})

const Wiki = mongoose.model('wikis', wikiSchema)

module.exports = Wiki