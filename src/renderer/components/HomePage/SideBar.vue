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
      <MenuItem name="4">
        <Icon type="ios-book" />
        Wiki
      </MenuItem>
      <!-- 设置功能暂未实现 -->
      <!-- <MenuItem name="5">
        <Icon type="ios-build" />
        设置
      </MenuItem> -->

      <!-- 搜索功能暂未实现 -->
      <!-- <Input suffix="ios-search" placeholder="搜索" class="search-bar" /> -->


      <MenuItem name="6" style="float:right">
        <Dropdown :transfer=true>
          <router-link href="javascript:void(0)" :to="'/home/user/' + username">
            <!-- 当有头像时显示头像，没有头像时显示文字头像 -->
            <m-avatar
             :avatar="avatar"
             :size=1
            ></m-avatar>
            {{ username }}
            <Icon type="ios-arrow-down"></Icon>
          </router-link>
          <DropdownMenu slot="list">
            <DropdownItem disabled>账号</DropdownItem>
            <DropdownItem>
              <router-link :to="'/home/user/' + username">我的信息</router-link>
            </DropdownItem>
            <DropdownItem>
              <router-link to="/home/edit">账号设置</router-link>
            </DropdownItem>
            <DropdownItem>
              <router-link to="/welcome" @click.native="logout">退出登录</router-link>
            </DropdownItem>
            <DropdownItem disabled divided>帖子</DropdownItem>
            <DropdownItem>草稿箱</DropdownItem>
            <DropdownItem>收藏夹</DropdownItem>
            <!-- <DropdownItem disabled divided>小组</DropdownItem>
            <DropdownItem>管理</DropdownItem> -->
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
      avatar: null
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
      } else if (path.indexOf('user') !== -1 || path.indexOf('edit') !== -1) {
        this.menuActive = '6'
      }
    }
  },

  watch: {
    // 监控路由并更新菜单高亮状态
    '$route': 'updateMenu'
  },

  mounted () {
    // 刷新时仍保持原菜单高亮状态
    this.updateMenu()
    this.getUserData(this.username, data => {
      this.avatar = data.avatar
    })
  }
}
</script>

<style lang="css" scoped>
.letter-avatar {
  margin-right: 5px;
  background-color: #fde3cf;
  font-size: 16px;
  color: #f56a00;
}

.search-bar {
  width: auto;
}
@media screen and (max-width: 800px) {
  .search-bar {
    width: 130px;
  }
}
</style>