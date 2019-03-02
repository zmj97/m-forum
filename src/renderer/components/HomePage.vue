<template>
  <div id="layout">
    <side-bar id="nav"></side-bar>

    <router-view id="panel"></router-view>
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
    }
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
  display: none;
  text-align: center;
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