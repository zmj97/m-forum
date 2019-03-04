<template>
  <div id="layout">
    <side-bar
     v-if="showMenuBar"
     id="nav"
     :hasNewNt="hasNewNt"
     @click.native="hideMenu"
    ></side-bar>

    <Icon id="menu-icon" type="md-menu" @click="showMenuBar=!showMenuBar" />

    <router-view
     id="panel"
     @click.native="hideMenu"
     @newNtChange="hasNewNt = $event"
    ></router-view>
  </div>
</template>

<script>
import SideBar from './HomePage/SideBar'

export default {

  name: 'HomePage',

  components: {
    SideBar
  },

  data () {
    return {
      showMenuBar: false,
      // 是否有新消息
      hasNewNt: false
    }
  },

  methods: {
    changeShowMenuBar () {
      if (document.body.clientWidth >= 768) {
        this.showMenuBar = true
      } else {
        this.showMenuBar = false
      }
    },

    // 移动端点击后关闭sidebar
    hideMenu (e) {
      if (e.target.placeholder === '搜索') return
      if (document.body.clientWidth < 768) {
        this.showMenuBar = false
      }
    }
  },

  mounted () {
    window.addEventListener('resize', this.changeShowMenuBar, false)
    this.changeShowMenuBar()

    // 更新是否有新的通知消息
    this.$http.post('/user/find/newNt', {
      'username': this.getCurrentUser().username
    }).then(res => {
      if (res.data !== 'error') {
        this.hasNewNt = res.data.newApplyNt || res.data.newResultNt || res.data.newReplyNt
      }
    })
  },

  destroyed () {
    window.removeEventListener('resize', this.changeShowMenuBar, false)
  }
}
</script>

<style lang="less" scoped>
#layout, #nav, #panel, #putup-menu {
  margin: 0;
  padding: 0;
}

/* 手机中 nav 不显示，而是显示菜单按钮 */
#nav {
  // display: none;
  text-align: center;
}

#menu-icon {
  position: fixed;
  top: 30px;
  right: 0;
  font-size: 30px;
  color: #515a6e;
  cursor: pointer;
  z-index: 899;
}

#panel {
  position: relative;
  height: 100vh;
  // overflow: hidden;
}
/*
 * -- 平板及以上设备 --
 * 上 nav 下 router-view
 */
@media screen and (min-width: 768px) {
  #menu-icon {
    display: none;
  }

  /* 设置背景色 */
  #layout {
    position: relative;
    /* background-color: #bbb; */
  }

  /* 平板以上 显示 nav */
  #nav {    
    display: block;
    margin-bottom: 5px;
    box-shadow: 0 0 10px black;
  }

  #panel {
    height: calc(100vh - 70px);
  }
}
</style>