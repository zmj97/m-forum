<template>
  <!-- 可拖动 -->
  <nav id="toolbar" style="-webkit-app-region: drag">
    <Menu mode="horizontal" :active-name="menuActive" class="menu">

      <!-- 窗口选项： 关闭、最大化、最小化 -->
      <div class="window-buttons" style="-webkit-app-region: no-drag">
        <!-- 关闭窗口 -->
        <Icon
         class="window-button"
         type="md-power"
         style="color: #ed4014"
         @click="closeWindow"
        />
        <!-- 最大化窗口 -->
        <Icon
         class="window-button"
         type="md-browsers"
         style="color: #19be6b"
         @click="maximizeWindow"
        />
        <!-- 最小化窗口 -->
        <Icon
         class="window-button"
         type="md-remove"
         style="color: #ff9900"
         @click="minimizeWindow"
        />
      </div>

      <MenuItem name="6" style="-webkit-app-region: no-drag" class="user-large">
        <Dropdown :transfer=true>

          <router-link href="javascript:void(0)" :to="'/home/user/' + username">
            <!-- 当有头像时显示头像，没有头像时显示文字头像 -->
            <m-avatar
             :avatar="avatar"
             :size=1
            ></m-avatar>
            <Badge v-if="hasNewNt" dot style="margin: 5px"></Badge>
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
                <Badge v-if="hasNewNt" dot style="margin: 5px"></Badge>
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

      <MenuItem name="0" style="-webkit-app-region: no-drag" class="user-small" :to="'/home/user/' + username">
        <m-avatar
         :avatar="avatar"
         :size=1
        ></m-avatar>
        <Badge v-if="hasNewNt" dot style="position: fixed; left: 43px; bottom: 40px;"></Badge>
      </MenuItem>

      <MenuItem name="1" to="/home/home" style="-webkit-app-region: no-drag" class="menu-item">
        <Icon type="ios-home" />
        主页
      </MenuItem>

      <MenuItem name="2" to="/home/groups" style="-webkit-app-region: no-drag" class="menu-item">
        <Icon type="ios-people" />
        小组
      </MenuItem>

      <MenuItem name="3" to="/home/new-post" style="-webkit-app-region: no-drag" class="menu-item">
        <Icon type="ios-paper" />
        发帖
      </MenuItem>

      <MenuItem name="4" to="/home/wiki" style="-webkit-app-region: no-drag" class="menu-item">
        <Icon type="ios-book" />
        Wiki
      </MenuItem>

      <MenuItem name="5" to="/home/search" style="-webkit-app-region: no-drag" class="menu-item search-button">
        <Icon type="ios-search" />
        搜索
      </MenuItem>

      <Input v-model="searchStr" @on-enter="search()" suffix="ios-search" placeholder="搜索" class="search-bar" style="-webkit-app-region: no-drag" />

    </Menu>
  </nav>
</template>

<script>
const {ipcRenderer: ipc} = require('electron')

export default {

  name: 'SideBar',

  props: [
    // 是否有新消息
    'hasNewNt'
  ],

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
      const path = this.$route.matched[1].path
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
    },

    // 最小化窗口
    minimizeWindow () {
      ipc.send('min')
    },

    // 最大化窗口
    maximizeWindow () {
      ipc.send('max')
    },

    // 最小化窗口
    closeWindow () {
      ipc.send('close')
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

    // window.addEventListener('resize', this.changeMenuMode, false)
  },

  destroyed () {
    // window.removeEventListener('resize', this.changeMenuMode, false)
  }
}
</script>

<style lang="less" scoped>
.search-button {display: none;}
.user-small {display: none;}
.user-large {display: inline-block;}

.window-buttons {
  float: right;
  width: 30px;
  line-height: 1.5;

  .window-button {
    cursor: pointer;
    transition: opacity .2s, text-shadow .2s;

    &:hover {
      opacity: .8;
      text-shadow: 0 0 1px gray;
    }
  }
}

.letter-avatar {
  margin-right: 5px;
  background-color: #fde3cf;
  font-size: 16px;
  color: #f56a00;
}

.search-bar {
  width: calc(100vw - 550px - 5rem);
  max-width: 500px;
}

@media screen and (max-width: 768px) {
  .window-buttons {
    display: none;
  }

  .search-bar {
    display: none;
  }

  .menu-item {
    width: calc((100vw - 65px) / 5);
  }

  .search-button {display: inline-block;}
  .user-large {display: none;}
  .user-small {display: inline-block;}

  .menu {
    overflow: hidden;
    width: 100vw;
  }
}
</style>
