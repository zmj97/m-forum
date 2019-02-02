exports.install = function (Vue, options) {
  var proto = Vue.prototype

  // 获取指定的一些用户的数据
  proto.getUserData = function (names, callback) {
    /*
     * usernames:
     * 一个username(string), 或：
     * [{'username': username0}, {'username': username1}, ....]
     */
    var usernames
    if (typeof names === 'string') {
      usernames = names
    } else {
      usernames = []
      names.forEach(function (name) {
        usernames.push({'username': name})
      })
    }

    // 获取用户数据
    this.$http.post('/user/find/data', {'username': usernames})
      .then((res) => {
        if (res.data !== false) {
          callback(res.data)
        }
      })
      .catch((err) => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 获取指定用户所有发帖
  proto.getUserPosts = function (username, callback) {
    this.$http.post('/post/find/all', {'username': username})
      .then(res => {
        callback(res.data)
      })
      .catch(err => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 获取指定的一些小组的数据
  proto.getGroupData = function (groups, callback) {
    /*
     * groupNames:
     * [{'name': name0}, {'name': name1}, ....]
     */
    var groupNames
    if (typeof groups === 'string') {
      groupNames = [{'name': groups}]
    } else {
      groupNames = []
      groups.forEach(function (name) {
        groupNames.push({'name': name})
      })
    }

    // 获取小组数据
    this.$http.post('/group/find/byName', {'name': groupNames})
      .then((res) => {
        if (res.data !== false) {
          callback(res.data)
        }
      })
      .catch((err) => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 获取当前用户
  proto.getCurrentUser = function () {
    return this.$store.state.Users.currentUser
  }
}
