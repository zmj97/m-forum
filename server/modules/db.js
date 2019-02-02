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
  mongo.connect(url, {useNewUrlParser: true}, function (err, client) {
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
exports.find = function (collectionName, json, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).find(json).toArray(function (err, data) {
      // 查询后关闭数据库连接
      client.close()
      callback(err, data)
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
exports.push = function (collectionName, searchJson, dataJson, callback) {
  __connectDb(function (client, db) {
    db.collection(collectionName).updateOne(searchJson, {$push: dataJson}, function (err, data) {
      // 修改后关闭数据库连接
      client.close()
      callback(err, data)
    })
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

// 删除集合
exports.drop = function (collectionName) {
  __connectDb(function (client, db) {
    db.dropCollection(collectionName, {safe: true})
    client.close()
  })
}
