<template>
  <article 
   class="item-container"
   :class="{selected: selected}"
  >
    <div class="left">
      <m-avatar
       :avatar="avatar"
       :size=3
      ></m-avatar>
    </div>

    <div class="right">
      <h4 class="item-name">{{ itemData.username }}</h4>
      <h3 class="item-title">{{ itemData.title }}</h3>
      <p class="item-abstract">
        <span v-if="itemData.abstract">{{ itemData.abstract }}</span>
        <span v-else>{{ itemData.content }}</span>
      </p>

      <router-link :to="'/home/group/' + itemData.group">
        <Tag v-if="!inGroupPage && itemData.group" color="success" class="group">{{ itemData.group }}</Tag>
      </router-link>
    </div>
  </article>
</template>

<script>
export default {

  name: 'ListItem',

  props: {
    itemData: {
      require: true
    },
    selected: {
      default: false
    }
  },

  data () {
    return {
      avatar: null,
      inGroupPage: this.$route.matched[1].path.indexOf('group') !== -1
    }
  },

  methods: {
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
    // 超出部分省略
    overflow: hidden;
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