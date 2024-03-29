exports.install = function (Vue, options) {
  let proto = Vue.prototype

  // 获取指定的一些用户的数据
  proto.getUserData = function (names, callback, falseCallback = () => {}) {
    // 获取用户数据
    this.$http.post('/user/find/data', {'username': names})
      .then((res) => {
        if (res.data !== false && res.data !== 'error') {
          callback(res.data)
        } else {
          falseCallback()
        }
      })
      .catch((err) => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 获取指定用户所有发帖
  proto.getUserPosts = function (username, page, callback) {
    this.$http.post('/post/find/limit', {'json': {'username': username}, 'page': page})
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
    let groupNames
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

  // 删除小组成员(>=1个)
  proto.deleteGroupMembers = function (groupName, membersNames, callback) {
    this.$http.post('/group/delete/member', {
      'name': groupName,
      'usernames': membersNames
    }).then(res => {
      if (res.data === 'error') {
        this.$Message.error('数据库连接失败')
      } else {
        this.reload()
        callback()
      }
    }).catch(err => {
      console.error(err)
      this.$Message.error('网络连接失败！')
    })
  }

  // 获取当前用户
  proto.getCurrentUser = function () {
    return this.$store.state.Users.currentUser
  }

  // 获取username加入的小组的所有数据并传给joinedGroups
  proto.getJoinedGroups = function (username, joinedGroups) {
    this.getUserData(username, data => {
      joinedGroups.push(...data.groups)
    })
  }

  // 获取username加入的所有小组的名字并传给joinedGroups
  proto.getJoinedGroupsNames = function (username, joinedGroups) {
    this.$http.post('/user/find/groups-names', {'username': username})
      .then(res => {
        if (res.data !== 'error') {
          joinedGroups.push(...res.data[0].groups)
        }
      })
      .catch((err) => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 获取所有小组名并传给groups
  proto.getAllGroupsNames = function (groups) {
    this.$http.get('/group/find/names')
      .then(res => {
        if (res.data !== false) {
          groups.push(...res.data)
        }
      })
      .catch((err) => {
        this.$Message.error('网络连接失败!')
        console.error(err)
      })
  }

  // 对目标reply进行闪烁time次提示
  proto.hintReply = function (replyId, time) {
    if (!document.getElementById(replyId)) return
    if (time <= 0) return
    const timeGap = 250
    setTimeout(() => {
      document.getElementById(replyId).style.backgroundColor = 'rgba(92, 173, 255, 0.4)'
    }, timeGap * 2 * time - timeGap)
    setTimeout(() => {
      document.getElementById(replyId).style.backgroundColor = 'white'
    }, timeGap * 2 * time)

    proto.hintReply(replyId, time - 1)
  }
}
