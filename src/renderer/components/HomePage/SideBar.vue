<template>
  <nav class="toolbar">
    <Menu mode="horizontal" :active-name="menuActive">
      <MenuItem name="1" to="/home/home">
        <Icon type="ios-home" />
        主页
      </MenuItem>

      <MenuItem name="2" to="/home/groups">
        <Icon type="ios-people" />
        小组
      </MenuItem>

      <MenuItem name="3" to="/home/new-post">
        <Icon type="ios-paper" />
        发帖
      </MenuItem>

      <MenuItem name="4" to="/home/wiki">
        <Icon type="ios-book" />
        Wiki
      </MenuItem>


      <Input v-model="searchStr" @on-enter="search()" suffix="ios-search" placeholder="搜索" class="search-bar" />


      <MenuItem name="6" style="float:right">
        <Dropdown :transfer=true>

          <router-link href="javascript:void(0)" :to="'/home/user/' + username">
            <!-- 当有头像时显示头像，没有头像时显示文字头像 -->
            <m-avatar
             :avatar="avatar"
             :size=1
            ></m-avatar>
            <Badge v-if="$newNt" dot style="margin: 5px"></Badge>
            {{ username }}
            <Icon type="ios-arrow-down"></Icon>
          </router-link>

          <DropdownMenu slot="list">
            <router-link :to="'/home/user/' + username">
              <DropdownItem>
                我的信息
              </DropdownItem>
            </router-link>

            <router-link to="/home/star">
              <DropdownItem>我的收藏</DropdownItem>
            </router-link>

            <router-link to="/home/notifications">
              <DropdownItem>
                消息通知
                <Badge v-if="$newNt" dot style="margin: 5px"></Badge>
              </DropdownItem>
            </router-link>

            <router-link to="/home/edit">
              <DropdownItem>
                账号设置
              </DropdownItem>
            </router-link>

            <router-link to="/welcome" @click.native="logout">
              <DropdownItem>
                退出登录
              </DropdownItem>
            </router-link>
          </DropdownMenu>

        </Dropdown>
      </MenuItem>
    </Menu>
  </nav>
</template>

<script>
export default {

  name: 'SideBar',

  data () {
    return {
      menuActive: '1',
      username: this.$store.state.Users.currentUser.username,
      avatar: null,

      searchStr: ''
    }
  },

  filters: {
    firstLetter (value) {
      return value[0]
    }
  },

  methods: {
    // 退出登录时，删除storage并提示退出登录成功
    logout () {
      this.$store.dispatch('removeStorage')
      this.$Message.success('退出登录成功')
    },

    // 更新菜单高亮状态
    updateMenu () {
      var path = this.$route.matched[1].path
      if (path.indexOf('/home/home') !== -1) {
        this.menuActive = '1'
      } else if (path.indexOf('group') !== -1) {
        this.menuActive = '2'
      } else if (path.indexOf('new-post') !== -1) {
        this.menuActive = '3'
      } else if (path.indexOf('wiki') !== -1) {
        this.menuActive = '4'
      } else if (path.indexOf('user') !== -1 || path.indexOf('edit') !== -1 || path.indexOf('notifications') !== -1 || path.indexOf('star') !== -1) {
        this.menuActive = '6'
      } else {
        this.menuActive = '-1'
      }
    },

    // 搜索
    search () {
      this.$router.push({path: '/home/search', query: {searchStr: this.searchStr}})
    },

    // 获取头像
    getAvatar () {
      this.getUserData(this.username, data => {
        this.avatar = data.avatar
      })
    }
  },

  watch: {
    // 监控路由并更新菜单高亮状态
    '$route': 'updateMenu'
  },

  mounted () {
    // 刷新时仍保持原菜单高亮状态
    this.updateMenu()
    this.getAvatar()

    // 更新是否有新的通知消息
    this.$http.post('/user/find/newNt', {
      'username': this.getCurrentUser().username
    }).then(res => {
      if (res.data !== 'error') {
        this.setNewNt(res.data.newApplyNt || res.data.newResultNt || res.data.newReplyNt)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.letter-avatar {
  margin-right: 5px;
  background-color: #fde3cf;
  font-size: 16px;
  color: #f56a00;
}

.search-bar {
  width: calc(100vw - 550px - 2rem);
}
</style>