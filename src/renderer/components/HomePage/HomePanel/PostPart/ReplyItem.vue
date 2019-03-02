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
      <p class="little-gray">
        回复于{{ replyData.time | timeFilter }}
        <a style="float: right" @click="showReplyPanel = !showReplyPanel">回复({{ replyData.replys.length }})</a>
        <!-- <a v-if="replyData.username === getCurrentUser().username" class="delete-link">删除</a> -->
      </p>
    </div>
    <span class="little-gray floor-right">{{ index+1 }}楼</span>

    <!-- 回复面板 -->
    <transition name="fade">
      <div v-if="showReplyPanel" class="reply-panel">
        <a v-if="replyData.replys.length > 0" @click="changeOrder()">
          <span v-if="showNewFirst">最早在前</span>
          <span v-else>最新在前</span>
        </a>
        <div v-for="item in replyData.replys" class="reply-to-reply-item">
          <!-- 回复人用户名 -->
          <a>{{ item.username }}</a>
          <span style="margin: 0 5px"> : </span> 
          <!-- 回复内容    -->
          {{ item.content }}
          <!-- 回复时间， 浅灰 -->
          <p class="little-gray">
            {{ item.time | timeFilter }}
            <!-- <a v-if="item.username === getCurrentUser().username" class="delete-link">删除</a> -->
          </p>
        </div>
        <Input v-model="replyContent" class="input-margin-top" placeholder="回复这一楼" />
        <Button type="success" class="reply-button" @click="reply()">回复</Button>
      </div>
    </transition>
  </section>
</template>

<script>
import {mavonEditor} from 'mavon-editor'

export default {

  name: 'ReplyItem',

  props: [
    'replyData',
    'index',
    'postId',
    'title'
  ],

  data () {
    return {
      avatar: null,

      showReplyPanel: false,
      showNewFirst: true,

      // 新的回复的值
      replyContent: ''
    }
  },

  filters: {
    // 将时间转换为当地时间显示
    timeFilter (value) {
      var date = new Date(value)
      var currentDate = new Date()
      if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getYear() === currentDate.getYear()) {
        return '今天' + date.toLocaleString().split(' ')[1]
      } else if (date.getDate() + 1 === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getYear() === currentDate.getYear()) {
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
    // 获取这个回复的用户头像
    getAvatar () {
      this.getUserData(this.replyData.username, data => {
        this.avatar = data.avatar
      })
    },

    // 提交回复
    reply () {
      var newReplyData = {
        'username': this.getCurrentUser().username,
        'time': new Date(),
        'content': this.replyContent
      }
      this.$http.post('/post/create/reply-to-reply', {
        '_id': this.postId,
        'title': this.title,
        'username': this.replyData.username,
        'replyIndex': this.index,
        'reply': newReplyData
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('评论成功！')
          // 直接更新本地数据
          // 先改为最新优先
          if (!this.showNewFirst) {
            this.changeOrder()
          }
          this.replyData.replys.unshift(newReplyData)
          // 清除输入框内的内容
          this.replyContent = ''
          setTimeout(() => {
            var replyId = 'reply-' + this.index
            window.location.hash = '#' + replyId
            this.hintReply(replyId, 5)
          }, 0)
        } else {
          this.$Message.error('数据库连接错误!')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 修改楼中楼的显示顺序
    changeOrder () {
      this.replyData.replys.reverse()
      this.showNewFirst = !this.showNewFirst
    }
  },

  watch: {
    postId () {
      this.getAvatar()
    }
  },

  mounted () {
    this.replyData.replys.reverse()
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
  border-top: 2px solid #eee;
  overflow: hidden;
}

.reply-avatar {
  float: left;
  margin-left: -50px;
}

.little-gray {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #999;
}

.floor-right {
  position: absolute;
  top: @paddingNum;
  right: @paddingNum;
  letter-spacing: 2px;
}

.delete-link {
  float: right; 
  margin-right: 10px; 
  color: #ed4014;
  transition: opacity .2s;
}
.delete-link:hover {opacity: .8;}

.reply-panel {
  background-color: #eee;
  margin-top: @paddingNum;
  padding: @paddingNum;
  overflow: hidden;

  .reply-button {
    float: right;
    margin-top: @paddingNum;
  }
}

.reply-to-reply-item {
  padding: @paddingNum 0;
  border-bottom: 1px solid #ddd;
}

.input-margin-top {margin-top: 2 * @paddingNum;}

.fade-enter-active, .fade-leave-active {transition: opacity .2s;}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {opacity: 0;}
</style>