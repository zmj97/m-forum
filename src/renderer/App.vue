<template>
  <div id="app">
    <router-view v-if="routerIsAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'm-forum',

  provide () {
    return {
      reload: this.reload
    }
  },

  data () {
    return {
      routerIsAlive: true
    }
  },

  methods: {
    // 实现无闪烁刷新页面
    reload () {
      this.routerIsAlive = false
      this.$nextTick(function () {
        this.routerIsAlive = true
      })
    }
  }
}
</script>

<style>
pre {
  font-family: "Arial", "Microsoft YaHei", "黑体", sans-serif;
  white-space: pre-wrap;
}

/* 滚动条样式 */
::-webkit-scrollbar-track-piece {
  /* 滚动条凹槽的颜色，还可以设置边框属性 */
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  /* 滚动条的宽度 */
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  /* 滚动条的设置 */
  background-color: #1F1E1E;
  background-clip: padding-box;
  max-height: 28px;
  -webkit-border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  /* 鼠标触及滚动条修改颜色 */
  background-color: rgb(28, 184, 65);
}
</style>
