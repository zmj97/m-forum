<template>
  <div style="display: inline-block">
<!-- 使用示例：
    <m-avatar
     :avatar="avatar"
     :size=2
    ></m-avatar>
 -->
    <!-- 有头像时显示头像，无头像时显示头像图标 -->
    <Avatar v-if="avatar" icon="ios-person" :src="avatar" :size="sizeString" />
    <Avatar v-else :size="sizeString" icon="ios-person" style="background-color: #5cadff"></Avatar>
  </div>
</template>

<script>
export default {

  name: 'MAvatar',

  // avatar为头像url
  props: [
    'avatar',
    'size'
  ],

  data () {
    return {
    }
  },

  computed: {
    /*
     * size
     * * => small
     * 2 => default
     * 3 => large
     */
    sizeString () {
      if (this.size === 2) {
        return 'default'
      } else if (this.size === 3) {
        return 'large'
      } else return 'small'
    }
  }
}
</script>

<style lang="css" scoped>
</style>
