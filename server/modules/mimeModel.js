var fs = require('fs')

exports.getMime = function (extname, callback) {
  fs.readFile(__dirname + '/mime.json', function(err, data) {
    if (err) {
      console.log('mime.json 不存在！')
      return false
    }

    var Mimes = JSON.parse(data.toString())

    callback(Mimes[extname])

  })
}