<template>
  <div>
    <div id="detail">
      <!-- 有头像时显示头像，无头像时显示字符头像 -->
      <m-avatar
       :avatar="avatar"
       :size=3
      ></m-avatar>

      <div class="info">
        <span class="username info-left">{{ postData.username }}</span>
        <span class="info-right">编辑于{{ postData.time | timeFilter }}</span>
        <br /> 

        <span class="info-right">回复 {{ replysCount }}</span>
      </div>
    </div>

    <h1 id="header">{{ postData.title }}</h1>
    <div style="text-align: center">
      <div v-if="postData.abstract">
        {{ postData.abstract }}
      </div>
      <router-link v-if="postData.group" :to="'/home/group/' + postData.group">
        <Tag color="success" class="group">{{ postData.group }}</Tag>
        <br />
      </router-link>
      <div v-if="postData.tags.length > 0">
        <Tag color="blue" v-for="item in postData.tags" style="margin: 5px">
          {{ item }}
        </Tag>
      </div>
    </div>

    <article id="content" v-html="convertedContent">
    </article>
    <section v-if="postData.replys.length > 0" id="replys">
      <!-- 数据在前，index在后 -->
      <reply-item
       v-for="(replyItem, index) in postData.replys"
       :replyData="replyItem"
       :index="index"
      ></reply-item>
    </section>
    <p v-else class="no-reply">快来当第一个回复的人吧！</p>

    <section id="new-reply">
      <new-reply :_id="postData._id"></new-reply>
    </section>

    <Dropdown placement="top-end" trigger="click" id="drop-menu">
      <a href="javascript:void(0)">
        <Icon type="ios-menu" id="drop-menu-icon"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>收藏</DropdownItem>
        <DropdownItem>回复</DropdownItem>
        <DropdownItem style="color: red" v-if="currentUser === postData.username" @click.native="modalDelete = true">删除</DropdownItem>
        <DropdownItem>
          <a href="#detail">返回顶部</a>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

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

  inject: [
    'reload'
  ],

  data () {
    return {
      avatar: null,
      currentUser: this.$store.state.Users.currentUser.username,

      modalDelete: false
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

  components: {
    ReplyItem,
    NewReply
  },

  computed: {
    replysCount () {
      return this.postData.replys.length
    },

    convertedContent () {
      return mavonEditor.getMarkdownIt().render(this.postData.content)
    }
  },

  methods: {
    getAvatar () {
      this.getUserData(this.postData.username, data => {
        this.avatar = data.avatar
      })
    },

    okDelete () {
      this.$http.post('/post/delete', {'_id': this.postData._id})
        .then(res => {
          if (res.data === 'success') {
            this.$Message.success('删除成功')
            // 无闪烁刷新
            this.reload()
          } else {
            this.$Message.error('删除失败')
          }
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

#header, #detail, #content, #replys, #new-reply {
  padding: @paddingNum;
  margin: 0;
}

#drop-menu {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  font-size: 1.5rem;
  z-index: 1999;

  #drop-menu-icon {
    padding: 6px;
    background-color: white;
    border-radius: 18px;
    box-shadow: 0 0 4px black;
  }
}

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

#header {
  margin-top: @paddingNum;
  text-align: center;
}

#new-reply {
  background-color: #eee;
}

.no-reply {
  border-top: 2px dotted #bbb;
  padding: 3rem 0;
  font-size: 1rem;
  text-align: center;
}

@media screen and (max-width: 60rem) {
  #header {
    top: 260px;
    width: 100%;

    .buttons {
      top: 260px;
    }
  }
}

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
</style>