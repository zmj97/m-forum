<template>
  <section class="reply-item">
    <div>
      <m-avatar
       :avatar="avatar"
       :size=2
       class="reply-avatar"
      ></m-avatar>
    </div>
    <div>
      <h4>{{ replyData.username }}</h4>
      <div v-html="convertedContent"></div>
      <p class="little-gray">回复于{{ replyData.time | timeFilter }}</p>
    </div>
    <span class="little-gray floor-right">{{ index+1 }}楼</span>
  </section>
</template>

<script>
import {mavonEditor} from 'mavon-editor'

export default {

  name: 'ReplyItem',

  props: [
    'replyData',
    'index'
  ],

  data () {
    return {
      avatar: null
    }
  },

  filters: {
    // 将时间转换为当地时间显示
    timeFilter (value) {
      var date = new Date(value)
      if (date.getDay() === new Date().getDay()) {
        return '今天' + date.toLocaleString().split(' ')[1]
      } else if (date.getDay() + 1 === new Date().getDay()) {
        return '昨天' + date.toLocaleString().split(' ')[1]
      }
      return date.toLocaleString()
    }
  },

  computed: {
    convertedContent () {
      return mavonEditor.getMarkdownIt().render(this.replyData.content)
    }
  },

  methods: {
    getAvatar () {
      this.getUserData(this.replyData.username, data => {
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
@paddingNum: 1rem;

.reply-item {
  position: relative;
  padding: @paddingNum;
  padding-left: 60px;
  border-top: 2px dotted #bbb;
  overflow: hidden;
}

.reply-avatar {
  float: left;
  margin-left: -50px;
}

.little-gray {
  font-size: 0.8rem;
  color: #999;
}

.floor-right {
  position: absolute;
  top: @paddingNum;
  right: @paddingNum;
  letter-spacing: 2px;
}
</style>