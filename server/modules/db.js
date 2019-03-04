var mongo = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/forum'

function __connectDb (callback) {
  // mongdb 3+ 新的api 由 client 取代db
  /* 
   * 添加{useNewUrlParser: true}
   * 否则报warn:
   * (node:14801) DeprecationWarning: 
   * current URL string parser is deprecated, 
   * and will be removed in a future version. 
   * To use the new parser, 
   * pass option { useNewUrlParser: true } 
   * to MongoClient.connect.
   */
  mongo.connect(url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      console.error('ERROR when connect to mongo : ' + err)
      return
    }
    // callback(client, db)
    callback(client, client.db('forum'))
  })
}

// 增加数据
// 在collectionName 集合中插入json后执行回调函数
exports.create = function (collectionName, json, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).insertOne(json, function (err, data) {
      // 增加后关闭数据库连接
      client.close()
      callback(err, data)
    })
  })
}

// 删除数据
// 在collectionName 集合中删除数据后执行回调函数
exports.delete = function (collectionName, json, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).deleteOne(json, function (err, data) {
      // 删除后关闭数据库连接
      client.close()
      callback(err, data)
    })
  })
}

// 查找数据
// 在collectionName 集合中查找符合json要求的数据后执行回调函数
// 当json为数组时， json[0]为json, json[1]为限定返回哪些列的json
exports.find = function (collectionName, json, callback, skipCount = 0, limitCount = -1) {
  __connectDb(function (client, db) {
    var fieldJson = {}
    if (json instanceof Array) {
      fieldJson = json[1]
      json = json[0]
    }
    if (limitCount === -1) {
      // mongo3+删除了field 但是 projection无法使用，因此改用project
      db.collection(collectionName).find(json).project(fieldJson).skip(skipCount).toArray(function (err, data) {
        // 查询后关闭数据库连接
        client.close()
        callback(err, data)
      })
    } else {
      db.collection(collectionName).find(json).project(fieldJson).skip(skipCount).limit(limitCount).toArray(function (err, data) {
        // 查询后关闭数据库连接
        client.close()
        callback(err, data)
      })
    }
  })
}

const postsPerPage = 20
// 查找帖子数据, 需要参数页数，每页暂时设为5
// 在collectionName 集合中查找符合json要求的数据后执行回调函数
exports.findPosts = function (json, page, callback) {
  __connectDb(function (client, db) {
    db.collection('posts').find(json).sort({"lastModifyTime":-1}).skip((page - 1) * postsPerPage).limit(postsPerPage).toArray(function (err, data) {
      // 查询后关闭数据库连接
      client.close()
      callback(err, data)
    })
  })
}

// 获取帖子数量
exports.getPostsCount = function (json, callback) {
  __connectDb(function (client, db) {
    db.collection('posts').find(json).count(function (err, count) {
      // 查询后关闭数据库连接
      client.close()
      callback(err, count)
    })
  })
}

// 修改数据
// 在collectionName 集合中修改数据后执行回调函数
exports.update = function (collectionName, oldJson, newJson, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).updateOne(oldJson, {$set: newJson}, function (err, data) {
      // 修改后关闭数据库连接
      client.close()
      callback(err, data)
    })
  })
}

// 向数组中插入数据
// 在collectionName 集合某个数组中修改数据后执行回调函数
exports.push = function (collectionName, searchJson, dataJson, callback, canRepeat = false) {
  __connectDb(function (client, db) {
    if (!canRepeat) {
      // 默认addToSet无重复添加
      db.collection(collectionName).updateOne(searchJson, {$addToSet: dataJson}, function (err, data) {
        // 修改后关闭数据库连接
        client.close()
        callback(err, data)
      })
    } else {
      // 可重复
      db.collection(collectionName).updateOne(searchJson, {$push: dataJson}, function (err, data) {
        // 修改后关闭数据库连接
        client.close()
        callback(err, data)
      })
    }
  })
}

// 从数组中删除数据
// 在collectionName 集合某个数组中删除数据后执行回调函数
exports.pull = function (collectionName, searchJson, dataJson, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).updateOne(searchJson, {$pull: dataJson}, function (err, data) {
      // 修改后关闭数据库连接
      client.close()
      callback(err, data)
    })
  })
}

// 从数组中根据index删除数据
exports.pullByIndex = function (collectionName, searchJson, arrayName, index, callback) {
  __connectDb(function (client, db) {
    let key = arrayName + '.' + index
    let unsetJson = {}
    unsetJson[key] = 1
    db.collection(collectionName).updateOne(searchJson, {$unset: unsetJson}, function (err, data) {
      if (!err) {
        let pullJson = {}
        pullJson[arrayName] = null
        db.collection(collectionName).updateOne(searchJson, {$pull: pullJson})
      }
      client.close()
      callback(err, data)
    })
  })
}

// 删除集合
exports.drop = function (collectionName) {
  __connectDb(function (client, db) {
    db.dropCollection(collectionName, {safe: true})
    client.close()
  })
}

// 搜索帖子
// 优先级从高到低
// 标题->摘要->内容->回复->楼中楼
exports.searchPosts = function (searchStr, callback) {
  __connectDb(function (client, db) {
    db.collection('posts').find().sort({"lastModifyTime":-1}).toArray(function (err, data) {
      client.close()
      var searchResult = []
      data.forEach(item => {
        if (item.title.indexOf(searchStr) !== -1
         || item.abstract.indexOf(searchStr) !== -1
         || item.content.indexOf(searchStr) !== -1
         || item.replys.some(reply => {
              return (reply.content.indexOf(searchStr) !== -1
                || reply.replys.some(r => {
                  return r.content.indexOf(searchStr) !== -1
                }))
        })) {
          searchResult.push(item)
        }
      })
      callback(err, searchResult)
    })
  })
}

// 搜索小组
// 优先级从高到低
// 小组名->info
exports.searchGroups = function (searchStr, callback) {
  __connectDb(function (client, db) {
    db.collection('groups').find().toArray(function (err, data) {
      client.close()
      var searchResult = []
      data.forEach(item => {
        if (item.name.indexOf(searchStr) !== -1
         || item.intro.indexOf(searchStr) !== -1) {
          searchResult.push(item)
        }
      })
      callback(err, searchResult)
    })
  })
}

// 搜索wiki
// 优先级从高到低
// 标题->最新的content
exports.searchWikis = function (searchStr, callback) {
  __connectDb(function (client, db) {
    db.collection('wikis').find().toArray(function (err, data) {
      client.close()
      var searchResult = []
      data.forEach(item => {
        if (item.title.indexOf(searchStr) !== -1
         || item.lastestVersion.content.indexOf(searchStr) !== -1) {
          searchResult.push(item.title)
        }
      })
      callback(err, searchResult)
    })
  })
}