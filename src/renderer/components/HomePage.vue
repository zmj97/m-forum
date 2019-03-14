<template>
  <div id="layout">
    <side-bar
     id="nav"
     :hasNewNt="hasNewNt"
    ></side-bar>

    <router-view
     id="panel"
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
      // 是否有新消息
      hasNewNt: false
    }
  },

  methods: {
  },

  mounted () {
    // 更新是否有新的通知消息
    this.$http.post('/user/find/newNt', {
      'username': this.getCurrentUser().username
    }).then(res => {
      if (res.data !== 'error') {
        this.hasNewNt = res.data.newApplyNt || res.data.newResultNt || res.data.newReplyNt
      }
    })
  }
}
</script>

<style lang="less" scoped>
#layout, #nav, #panel, #putup-menu {
  margin: 0;
  padding: 0;
}

#layout {
  overflow: hidden;
}

#nav {
  display: block;
  position: relative;
  margin-bottom: 5px;
  box-shadow: 0 0 10px black;
  z-index: auto;
}

#panel {
  position: relative;
  height: calc(100vh - 70px);
  overflow: auto;
}
</style>
