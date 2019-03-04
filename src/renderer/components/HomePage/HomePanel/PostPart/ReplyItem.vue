<template>
  <!-- 帖子回复的组件 -->
  <section class="reply-item">
    <!-- 回复人的头像，可点击跳转到回复人的主页 -->
    <router-link :to="'/home/user/' + replyData.username">
      <m-avatar
       :avatar="avatar"
       :size=2
       class="reply-avatar"
      ></m-avatar>
    </router-link>

    <!-- 回复人的用户名，可点击跳转到回复人的主页 -->
    <router-link :to="'/home/user/' + replyData.username">
      <h4>{{ replyData.username }}</h4>
    </router-link>
    <!-- 回复的内容，支持markdown和mathjax -->
    <div v-html="convertedContent"></div>
    <!-- 相关信息 -->
    <p class="little-gray">
      <!-- 回复时间 -->
      回复于{{ replyData.time | timeFilter }}
      <!-- 楼中楼数量，点击toggle楼中楼面板 -->
      <a style="float: right" @click="showReplyPanel = !showReplyPanel">回复({{ replyData.replys.length }})</a>
      <!-- 当前用户为回复人时可以删除回复 -->
      <a v-if="replyData.username === getCurrentUser().username" @click="deleteReply" class="delete-link">删除</a>
    </p>

    <!-- 此回复的楼层数 -->
    <span class="little-gray floor-right">{{ index+1 }}楼</span>

    <!-- 楼中楼面板 -->
    <transition name="fade">
      <div v-if="showReplyPanel" class="reply-panel">
        <!-- 点击修改楼中楼显示顺序 -->
        <a v-if="replyData.replys.length > 0" @click="changeOrder()">
          <span v-if="showNewFirst">最早在前</span>
          <span v-else>最新在前</span>
        </a>

        <div v-for="(item, pos) in replyData.replys" class="reply-to-reply-item">
          <!-- 回复人用户名 -->
          <router-link :to="'/home/user/' + item.username">
            {{ item.username }}
          </router-link>
          <span style="margin: 0 5px"> : </span> 
          <!-- 回复内容    -->
          {{ item.content }}
          <!-- 回复时间， 浅灰 -->
          <p class="little-gray">
            {{ item.time | timeFilter }}
            <!-- 当前用户为回复人时可以删除回复 -->
            <a v-if="item.username === getCurrentUser().username" @click="deleteReplyInReply(item, pos)" class="delete-link">删除</a>
          </p>
        </div>

        <!-- 回复当前回复的输入框 -->
        <Input v-model="replyContent" class="input-margin-top" placeholder="回复这一楼" />
        <!-- 点击提交回复 -->
        <Button type="success" class="reply-button" @click="reply()">回复</Button>
      </div>
    </transition>
  </section>
</template>

<script>
// 引入mavonEditor用于convert回复内容
import {mavonEditor} from 'mavon-editor'

export default {

  name: 'ReplyItem',

  props: [
    // 这一楼的回复数据
    'replyData',
    // 这个回复是第几个(0,1,...)
    'index',
    // 这个回复所在帖子的id
    'postId',
    // 这个回复所在帖子的标题
    'title'
  ],

  data () {
    return {
      // 回复人头像
      avatar: null,

      // 是否显示楼中楼面板
      showReplyPanel: false,
      // 是否最新优先
      showNewFirst: true,

      // 新的回复的值
      replyContent: ''
    }
  },

  filters: {
    // 将时间转换为当地时间显示
    timeFilter (value) {
      // 需要转换的时间
      const date = new Date(value)
      // 当前时间
      const currentDate = new Date()
      // 特殊情况： 今天、昨天
      if (date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getYear() === currentDate.getYear()) {
        return '今天' + date.toLocaleString().split(' ')[1]
      } else if (date.getDate() + 1 === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getYear() === currentDate.getYear()) {
        return '昨天' + date.toLocaleString().split(' ')[1]
      }
      // 返回当地显示格式
      return date.toLocaleString()
    }
  },

  computed: {
    // 转换内容到markdown格式
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
          // 将新的楼中楼插入到数组最前面，表示最新回复
          this.replyData.replys.unshift(newReplyData)
          // 清除输入框内的内容
          this.replyContent = ''
          setTimeout(() => {
            var replyId = 'reply-' + this.index
            // 闪烁当前楼
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
    },

    // 删除回复
    deleteReply () {
      this.$http.post('/post/delete/reply', {
        '_id': this.postId,
        'index': this.index
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('删除成功！')
          // 让父组件postPart删除本层回复数据
          this.$emit('removeReply')
        } else {
          this.$Message.error('数据库连接错误!')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 删除楼中楼
    deleteReplyInReply (item, pos) {
      this.$http.post('/post/delete/reply-to-reply', {
        '_id': this.postId,
        'index': this.index,
        'reply': item
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('删除成功！')
          // 删除本层楼中楼的数据
          this.replyData.replys.splice(pos, 1)
        } else {
          this.$Message.error('数据库连接错误!')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    }
  },

  watch: {
    // 显示不同帖子时，需要更新回复人头像
    postId () {
      this.getAvatar()
    }
  },

  mounted () {
    // 默认最新优先
    this.replyData.replys.reverse()
    this.getAvatar()
  }
}
</script>

<style lang="less" scoped>
@paddingNum: 1rem;

// 回复container
.reply-item {
  position: relative;
  padding: @paddingNum;
  padding-left: 60px;
  border-top: 2px solid #eee;
  overflow: hidden;
}

// 回复人头像
.reply-avatar {
  float: left;
  margin-left: -50px;
}

// 浅灰，回复时间等
.little-gray {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #999;
}

// 底部右边，回复按钮
.floor-right {
  position: absolute;
  top: @paddingNum;
  right: @paddingNum;
  letter-spacing: 2px;
}

// 删除按钮
.delete-link {
  float: right; 
  margin-right: 10px; 
  color: #ed4014;
  transition: opacity .2s;
}
.delete-link:hover {opacity: .8;}

// 楼中楼面板
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

// 楼中楼container
.reply-to-reply-item {
  padding: @paddingNum 0;
  border-bottom: 1px solid #ddd;
}

// 楼中楼内的回复框
.input-margin-top {margin-top: 2 * @paddingNum;}

.fade-enter-active, .fade-leave-active {transition: opacity .2s;}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {opacity: 0;}
</style>