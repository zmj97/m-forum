<template>
  <div v-if="postDataFinal" style="overflow: auto">
    <div id="detail">
      <!-- 有头像时显示头像，无头像时显示字符头像 -->
      <router-link :to="'/home/user/' + postDataFinal.username">
        <m-avatar
         :avatar="avatar"
         :size=3
        ></m-avatar>
      </router-link>
      <!-- 相关信息 -->
      <div class="info">
        <!-- 用户名 -->
        <router-link :to="'/home/user/' + postDataFinal.username">
          <span class="username info-left">{{ postDataFinal.username }}</span>
        </router-link>
        <!-- 发表时间 -->
        <span class="info-right">编辑于{{ postDataFinal.time | timeFilter }}</span>
        <br />
        <!-- 回复数量 -->
        <span class="info-right">回复 {{ replysCount }}</span>
      </div>
    </div>

    <!-- 标题 -->
    <h1 id="header">{{ postDataFinal.title }}</h1>
    <div style="text-align: center">
      <!-- 摘要 -->
      <div v-if="postDataFinal.abstract">
        {{ postDataFinal.abstract }}
      </div>
      <!-- 小组 -->
      <router-link v-if="postDataFinal.group" :to="'/home/group/' + postDataFinal.group">
        <Tag color="success" class="group">{{ postDataFinal.group }}</Tag>
        <br />
      </router-link>
      <!-- 标签 -->
      <div v-if="postDataFinal.tags.length > 0">
        <Tag color="blue" v-for="item in postDataFinal.tags" style="margin: 5px" :key="item">
          {{ item }}
        </Tag>
      </div>
    </div>

    <!-- 帖子内容 -->
    <article id="content" v-html="convertedContent">
    </article>

    <!-- 帖子回复 -->
    <section v-if="postDataFinal.replys.length > 0" id="replys">
      <!-- 数据在前，index在后 -->
      <reply-item
       v-for="(replyItem, index) in postDataFinal.replys"
       :replyData="replyItem"
       :index="index"
       :id="'reply-'+index"
       :postId="postDataFinal._id"
       :title="postDataFinal.title"
       :key="index"
       @removeReply="postDataFinal.replys.splice(index, 1)"
      ></reply-item>
    </section>
    <!-- 没有回复时提示 -->
    <p v-else class="no-reply">快来当第一个回复的人吧！</p>

    <!-- 添加回复 -->
    <section id="new-reply">
      <!-- 传递帖子id、标题和帖子的发帖人 -->
      <new-reply
       :_id="postDataFinal._id"
       :title="postDataFinal.title"
       :username="postDataFinal.username"
       @appendReply="appendDataToReply"
      ></new-reply>
    </section>

    <!-- 功能键 -->
    <transition name="fade">
      <div v-if="showFixMenu" id="fix-menu">
        <!-- 回到顶部 -->
        <a @click="backTop">
          <Icon type="ios-arrow-up" />
        </a>

        <!-- 收藏 -->
        <!-- 如果已收藏，显示实心星星 -->
        <!-- 点击取消收藏 -->
        <Icon v-if="stared" @click="unstarPost" type="md-star" style="cursor: pointer" />
        <!-- 如果未收藏，显示空心星星 -->
        <!-- 点击收藏 -->
        <Icon v-else @click="starPost" type="md-star-outline" style="cursor: pointer" />

        <!-- 回复 -->
        <a href="#new-reply">
          <Icon type="ios-text" />
        </a>

        <!-- 删除帖子 -->
        <Icon v-if="currentUser === postDataFinal.username" @click="modalDelete = true" type="md-trash" style="cursor: pointer; color: #ed4014" />

        <!-- 返回前一页 -->
        <Icon v-if="showBack" @click="goBack" type="md-arrow-back" style="cursor: pointer" />
      </div>
    </transition>

    <!-- 确认删除帖子的弹窗 -->
    <Modal
      v-model="modalDelete"
      title="删除帖子"
      :zIndex=5000
      @on-ok="okDelete">
      <p>确定要删除这篇帖子么？</p>
    </Modal>
  </div>
</template>

<script>
import ReplyItem from './PostPart/ReplyItem'
import NewReply from './PostPart/NewReply'
import {mavonEditor} from 'mavon-editor'

export default {

  name: 'PostPart',

  props: [
    'postData'
  ],

  // 用于无闪烁刷新
  inject: [
    'reload'
  ],

  data () {
    return {
      // 帖子发表者的头像
      avatar: null,
      // 当前用户
      currentUser: this.$store.state.Users.currentUser.username,
      // 删除帖子的弹窗是否显示
      modalDelete: false,
      // 最终用于显示的帖子数据
      postDataFinal: this.postData,
      // 是否显示固定菜单按钮
      showFixMenu: true,
      // 当前用户是否收藏了这个帖子
      stared: false,
      // 当前用户收藏的所有帖子id
      stars: [],
      // 是否显示返回按钮，在全屏显示时显示
      showBack: false
    }
  },

  filters: {
    // 将时间转换为当地时间显示
    // 当前时间的前一天和前两天用昨天和前天显示
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

  components: {
    ReplyItem,
    NewReply
  },

  computed: {
    // 回复数量
    replysCount () {
      return this.postDataFinal.replys.length
    },

    // 将content转换为对应的markdown显示
    convertedContent () {
      let result = mavonEditor.getMarkdownIt().render(this.postDataFinal.content)
      // 调整图片最大宽度为100%
      // style 插在img标签 与 src 之间
      let imgPos = result.indexOf('<img src=')
      const imgStyle = 'style="display: block;max-width: 100%;" '
      while (imgPos !== -1) {
        result = result.slice(0, imgPos + 5) + imgStyle + result.slice(imgPos + 5)
        imgPos = result.indexOf('<img src=')
      }
      return result
    }
  },

  methods: {
    // 获取发布人的头像
    getAvatar () {
      this.getUserData(this.postDataFinal.username, data => {
        this.avatar = data.avatar
      })
    },

    // 获取当前用户所有收藏的帖子
    getStars () {
      this.$http.post('/user/find/stars', {
        'username': this.currentUser
      }).then(res => {
        if (res.data === 'error') {
          this.$Message.error('数据库连接失败')
        } else {
          this.stars = res.data.stars.map(item => item.id)
          // 更新当前帖子是否被收藏
          this.stared = this.stars.includes(this.postDataFinal._id)
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 返回帖子顶部
    backTop () {
      const time = 10
      let topPos, moveItem
      topPos = 0

      if (this.$route.query.postId) {
        // 帖子页面滚动panel
        moveItem = document.getElementById('panel')
      } else if (this.$route.path !== '/home/home') {
        // 个人、小组页面的帖子弹窗滚动post
        moveItem = document.getElementsByClassName('post')[0]
      } else if (document.body.clientWidth < 768) {
        topPos = document.getElementById('list').scrollHeight
        moveItem = document.getElementById('panel')
      } else {
        // 主页面滚动main
        moveItem = document.getElementById('main')
      }
      const speed = (topPos - moveItem.scrollTop) / time

      const backTopTimer = setInterval(() => {
        moveItem.scrollTop += speed
        if (Math.abs(moveItem.scrollTop - topPos) <= Math.abs(speed / 2)) {
          clearInterval(backTopTimer)
        }
      }, 20)
    },

    // 收藏帖子
    starPost () {
      this.$http.post('/user/create/star', {
        'username': this.currentUser,
        'id': this.postDataFinal._id,
        'title': this.postDataFinal.title,
        'abstract': this.postDataFinal.abstract ? this.postDataFinal.abstract : (this.postDataFinal.content.length > 100 ? this.postDataFinal.content.slice(0, 100) + '...' : this.postDataFinal.content)
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('收藏成功')
          // 无闪烁刷新
          this.getStars()
        } else {
          this.$Message.error('收藏失败')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 取消收藏帖子
    unstarPost () {
      this.$http.post('/user/delete/star', {
        'username': this.currentUser,
        'id': this.postDataFinal._id
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('取消收藏成功')
          // 无闪烁刷新
          this.getStars()
        } else {
          this.$Message.error('取消收藏失败')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 确认删除帖子
    okDelete () {
      this.$http.post('/post/delete', {'_id': this.postDataFinal._id})
        .then(res => {
          if (res.data === 'success') {
            this.$Message.success('删除成功')
            // 无闪烁刷新
            this.reload()
          } else {
            this.$Message.error('删除失败')
          }
        })
    },

    // 返回上一页
    goBack () {
      this.$router.back(-1)
    },

    // 提交新的回复时，无闪烁刷新并闪烁提示添加的回复
    appendDataToReply (data) {
      // this.postDataFinal.replys.push(data)
      let replyId = 'reply-' + this.postDataFinal.replys.length
      this.reload()
      setTimeout(() => {
        // 并跳转闪烁
        window.location.hash = '#' + replyId
        this.hintReply(replyId, 5)
      }, 100)
    },

    // 利用query传入的帖子id可能不存在
    postNotExist () {
      this.$Message.error('该帖子不存在！')
      this.$router.push('/home')
    },

    // 确保在低宽度中固定菜单在帖子列表中不显示
    scrollListener () {
      if (document.body.clientWidth > 768 || !document.getElementById('list')) return
      let postPosition = document.getElementById('panel').scrollTop - document.getElementById('list').scrollHeight + 300
      if (this.showFixMenu && postPosition < 0) {
        this.showFixMenu = false
      } else if (!this.showFixMenu && postPosition > 0) {
        this.showFixMenu = true
      }
    },
    resizeListener () {
      if (document.body.clientWidth > 768) {
        this.showFixMenu = true
      } else if (this.$route.query.postId === undefined) {
        this.scrollListener()
      }
    }
  },

  watch: {
    postData () {
      // 当帖子数据改变时需要重新获取发帖人头像
      // 并更新用户是否收藏了这个帖子
      setTimeout(() => { this.getAvatar() })
      if (this.$route.query.postId === undefined) {
        this.postDataFinal = this.postData
      }
      // 更新当前帖子是否被收藏
      this.stared = this.stars.includes(this.postDataFinal._id)
    }
  },

  mounted () {
    if (this.postDataFinal === undefined && this.$route.query.postId === undefined) {
      // 帖子不存在
      this.postNotExist()
    } else if (this.$route.query.postId !== undefined) {
      // 利用query传递帖子id
      this.showBack = true
      this.$http.post('/post/find/byId', {'_id': [this.$route.query.postId]})
        .then(res => {
          if (res.data === 'empty') {
            this.postNotExist()
          } else if (res.data === 'error') {
            this.$Message.error('数据库连接错误!')
            this.$router.push('/home')
          } else {
            this.postDataFinal = res.data[0]
            this.getAvatar()
            this.getStars()
            if (this.$route.query.replyIndex) {
              // scroll到query传入的回复楼层并闪烁提示
              setTimeout(() => {
                var replyId = 'reply-' + this.$route.query.replyIndex
                window.location.hash = '#' + replyId
                // 闪烁提示五次
                this.hintReply(replyId, 5)
              }, 0)
            }
          }
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误！')
          this.$router.push('/home')
        })
    } else {
      // 利用props传递帖子数据
      this.getAvatar()
      this.getStars()
    }

    this.scrollListener()

    // 添加滚动和改变大小的监听，
    // 保证窄屏时固定按钮不会在帖子列表中显示
    window.addEventListener('mousewheel', this.scrollListener, false)
    window.addEventListener('touchmove', this.scrollListener, false)
    window.addEventListener('resize', this.resizeListener, false)
  },

  destroyed () {
    // 销毁时移除监听器
    window.removeEventListener('mousewheel', this.scrollListener, false)
    window.removeEventListener('touchmove', this.scrollListener, false)
    window.removeEventListener('resize', this.resizeListener, false)
  }
}
</script>

<style lang="less" scoped>
@paddingNum: 1rem;

#header, #detail, #content, #replys, #new-reply {
  padding: @paddingNum;
  margin: 0;
}

// 固定功能键
#fix-menu {
  position: fixed;
  width: 25px;
  bottom: 10%;
  right: 1rem;
  font-size: 1.5rem;
  color: #19be6b;
  z-index: 1999;

  a {color: #19be6b;}
}

// 帖子信息
#detail {
  position: relative;
  font-size: 0.8rem;
  line-height: 20px;

  .info {
    margin-top: -40px;
  }

  .info-left {
    position: absolute;
    left: 70px;
  }

  .username {
    margin-top: 0.6rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .info-right {
    position: absolute;
    right: @paddingNum;
    color: #999;
  }
}

// 帖子标题
#header {
  margin-top: @paddingNum;
  text-align: center;
}

// 帖子内容
#content {
  overflow-x: auto;
}

// 新的回复
#new-reply {
  background-color: #eee;
}

// 没有回复时的提示样式
.no-reply {
  border-top: 2px dotted #bbb;
  padding: 3rem 0;
  font-size: 1rem;
  text-align: center;
}

// 平板
@media screen and (max-width: 60rem) {
  #header {
    top: 260px;
    width: 100%;

    .buttons {
      top: 260px;
    }
  }

  #fix-menu {
    // 触屏使用时按钮增大，防止按不到
    font-size: 2rem;
    line-height: 1.5;
  }
}

// 手机
@media screen and (max-width: 40rem) {
  // 手机屏幕中header不为fix，因此去掉top的高度
  #top {
    height: 0;
  }

  #header {
    position: static;
    width: auto;
  }

  #detail {
    margin-top: 0;
  }
}

.fade-enter-active, .fade-leave-active {transition: opacity .2s;}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {opacity: 0;}
</style>
