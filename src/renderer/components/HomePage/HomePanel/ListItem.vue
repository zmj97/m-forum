<template>
  <!-- 父组件传入props selected表示是否选中 -->
  <article
   class="item-container"
   :class="{selected: selected}"
  >
    <!-- 发帖人头像在左边 -->
    <div class="left">
      <!-- 点击可以跳转到发帖人主页 -->
      <router-link :to="'/home/user/' + itemData.username">
        <m-avatar
         :avatar="avatar"
         :size=3
        ></m-avatar>
      </router-link>
    </div>

    <!-- 其他信息在右边 -->
    <div class="right">
      <!-- 发帖人用户名，点击可以跳转到发帖人主页 -->
      <h4>
        <!-- router-link只包含文字，因此防止点击空白处也跳转 -->
        <router-link :to="'/home/user/' + itemData.username"  class="item-name">
        {{ itemData.username }}
        </router-link>
      </h4>
      <!-- 帖子标题 -->
      <h3 class="item-title">{{ itemData.title }}</h3>
      <!-- 摘要 -->
      <p class="item-abstract">
        <!-- 有摘要显示摘要，没有摘要显示内容， 文字超出部分用省略号表示 -->
        <span v-if="itemData.abstract">{{ itemData.abstract }}</span>
        <span v-else>{{ itemData.content }}</span>
      </p>

      <!-- 小组主页中不显示小组标签 -->
      <!-- 如果有限制小组查看权限，显示小组名，点击可跳转到小组主页 -->
      <router-link v-if="!inGroupPage && itemData.group" :to="'/home/group/' + itemData.group">
        <Tag color="success" class="group">{{ itemData.group }}</Tag>
      </router-link>
    </div>
  </article>
</template>

<script>
export default {

  name: 'ListItem',

  props: {
    // 数据必需
    itemData: {
      require: true
    },
    // 是否选中默认为未选中，因此仅选中的item传递selected即可
    selected: {
      default: false
    }
  },

  data () {
    return {
      // 发帖人头像
      avatar: null,
      /*
       小组主页显示帖子也使用本组件
       小组主页中不显示小组标签
       因此此变量用于判断是否在小组主页中
       */
      inGroupPage: this.$route.matched[1].path.indexOf('group') !== -1
    }
  },

  methods: {
    // 获取发帖人头像
    getAvatar () {
      this.getUserData(this.itemData.username, data => {
        this.avatar = data.avatar
      })
    }
  },

  mounted () {
    this.getAvatar()
  }
}
</script>

<style lang="less" scoped>
.item-container {
  position: relative;
  padding: 0.9rem 0.5rem;
  height: 100px;
  border-bottom: 2px solid #ddd;
  border-left: 6px solid transparent;
  cursor: pointer;
  transition: background-color 0.1s linear, color 0.1s linear;

  .left, .right {
    position: absolute;
    top: 1rem;
    bottom: 1rem;
  }

  .right {
    left: 70px;
    right: 1rem;
  }

  .item-name,
  .item-title,
  .item-abstract {
    margin: 0;
    overflow: hidden;
    // 超出部分用...代替
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .item-name {color: #999;}

  .item-abstract {
    margin: 0.4rem 0;
    font-size: 90%;
  }

  .group {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    font-size: 90%;
  }

  &:hover {
    color: black;
  }
}

// 选中的item背景色、字体颜色、字体大小不同
.selected {
  background-color: #2b85e4;
  color: white;
  font-size: 105%;

  .item-name {color: #ddd;}

  &:hover {
    color: white;
  }
}
</style>
