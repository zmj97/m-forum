<template>
  <div style="overflow: auto">
    <Col span="6" style="padding: 1rem">
      <div style="text-align: center; padding: 1rem 0;">
        <m-avatar
         avatar=""
         :size=3
        ></m-avatar>
        <span class="name">{{ name }}</span>
        <!-- 删除按钮，组长可以删除小组 -->
        <Button type="error" style="margin-left: 1rem" @click="modalDelete = true">删除</Button>
        <Modal
          v-model="modalDelete"
          title="删除小组"
          :zIndex=5000
          @on-ok="okDelete">
          <p>确定要删除这个小组么？删除后所有小组内的帖子也将被删除！</p>
        </Modal>

        <p style="text-align: center">{{ intro }}</p>
      </div>

      <div style="margin-top: 2rem">
        <p style="margin: 1rem 0">组长：</p>

        <!-- 文字提示气泡框，提示名字 -->
        <Tooltip :content="leader">
          <router-link :to="'/home/user/' + leader">
            <m-avatar
             :avatar="avatars[0]"
             :size=1
            ></m-avatar>
          </router-link>
        </Tooltip>
      </div>

      <div style="margin-top: 2rem">
        <p style="margin: 1rem 0">所有成员：</p>

        <!-- 文字提示气泡框，提示名字 -->
        <Tooltip v-for="(item, index) in users" :content="item">
          <router-link :to="'/home/user/' + item">
            <m-avatar
             :avatar="avatars[index]"
             :size=1
            ></m-avatar>
          </router-link>
        </Tooltip>
      </div>
    </Col>

    <Col span="8" offset="5">
      <Icon type="ios-paper" size="25" style="margin: 10px"></Icon>所有帖子
      <div v-if="posts.length > 0">
        <list-item
         v-for="(item, index) in posts"
         :itemData="item"
         @click.native="showPostMethod(index)"
         class="card-margin"
        ></list-item>
      </div>
      <div v-else style="margin-top: 5px">
        该小组内还没有发过帖子！
      </div>
    </Col>

    <transition name="fade">
      <post-modal v-show="showPost" :posts="posts" :pos="postPos" @close="closePost"></post-modal>
    </transition>
  </div>
</template>

<script>
import PostModal from './PostModal'
import ListItem from './HomePanel/ListItem'

export default {

  name: 'GroupPanel',

  components: {
    PostModal,
    ListItem
  },

  data () {
    return {
      name: this.$route.params.name,
      intro: '',
      leader: '',
      users: [],
      avatars: [],
      posts: [],

      showPost: false,
      postPos: 0,

      // 删除弹窗的状态
      modalDelete: false
    }
  },

  methods: {
    updateData () {
      // 获取小组数据并更新
      this.getGroupData(this.name, data => {
        data = data[0]
        this.leader = data.leader
        this.intro = data.intro
        this.users = data.users
        this.$set(this, 'posts', data.posts)
        // 获取用户头像并更新
        this.getUserData(this.users, data => {
          data.forEach(item => {
            this.avatars.push(item.avatar)
          })
        })
      })
    },

    showPostMethod (index) {
      this.postPos = index
      this.showPost = true
    },

    closePost () {
      this.showPost = false
    },

    okDelete () {
      this.$http.post('/group/delete', {'name': this.name})
        .then((res) => {
          if (res.data === 'success') {
            this.$Message.success('删除小组成功!')
            this.$router.push('/home')
          } else {
            this.$Message.error('删除小组失败!')
          }
        })
        .catch((err) => {
          this.$Message.error('网络连接失败!')
          console.error(err)
        })
    }
  },

  mounted () {
    this.updateData()
  }
}
</script>

<style lang="css" scoped>
.name {
  position: relative;
  top: 4px;
  margin-left: 1rem;
  font-size: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>