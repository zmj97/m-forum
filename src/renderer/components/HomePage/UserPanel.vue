<template>
  <!-- 左中右分别为用户信息、所加入小组 和 所发帖子 -->
  <div style="overflow: auto">
    <!-- 用户信息 -->
    <Col :sm="24" :md="6" class="info-side">
      <m-avatar
       :avatar="userData.avatar"
       :size=3
       class="user-avatar"
      ></m-avatar>
      <div class="modifyButton">
        <!-- 编辑用户信息 只有当前用户的用户页显示编辑按钮 -->
        <Button v-if="currentUser === username" @click.native="$router.push('/home/edit')">编辑</Button>
      </div>
      <h1>
        {{ username }}
        <Icon v-if="userData.gender === 'female'" type="ios-female" style="color: pink; font-weight: bold" />
        <Icon v-else-if="userData.gender === 'male'" type="ios-male" style="color: blue; font-weight: bold" />
      </h1>
      <div v-if="userData.telephone">
        <Icon type="ios-phone-portrait" />
        {{ userData.telephone }}
      </div>
      <div v-if="userData.email">
        <Icon type="ios-mail"></Icon>
        {{ userData.email }}
      </div>
    </Col>

    <!-- 选项链接 -->
    <div v-if="currentUser === username" style="padding: 20px; text-align: center; letter-spacing: 1px;" class="hideInPc">
      <span>
        <router-link to="/home/star">
          我的收藏
        </router-link>
      </span>

      <span>
        <router-link to="/home/notifications">
          我的消息
        </router-link>
      </span>

      <span>
        <router-link to="/home/edit">
          账号设置
        </router-link>
      </span>

      <span>
        <router-link to="/welcome" @click.native="logout">
          退出登录
        </router-link>
      </span>
    </div>

    <!-- 用户加入的小组 -->
    <Col :sm="{ span: 24}" :md="{ span: 6, offset: 2 }">
      <Icon type="ios-people" size="30" style="margin: 10px"></Icon>所在小组
      <div v-show="groups && groups.length > 0">
        <div v-for="item in groups" :key="item.name">
          <router-link :to="'/home/group/' + item.name">
            <Card class="card-margin">
              <p slot="title">{{ item.name }}</p>
              <p>
                <router-link :to="'/home/user/' + item.leader">
                  {{ item.leader }}
                </router-link>
              </p>
              <p style="color: #808695">{{ item.intro }}</p>
            </Card>
          </router-link>
        </div>
      </div>
      <div v-if="!groups || groups.length === 0">
        该用户暂未加入小组！
      </div>
    </Col>

    <!-- 用户发过的帖子 -->
    <Col :sm="24" :md="{ span: 6, offset: 2 }">
      <Icon type="ios-paper" size="25" style="margin: 10px"></Icon>所有帖子
      <div v-if="posts && posts.length > 0">
        <list-item
         v-for="(item, index) in posts"
         :itemData="item"
         :key="index"
         @click.native="showPostMethod(index)"
         class="card-margin"
        ></list-item>

        <!-- 分页 选择页数 每页显示20条 -->
        <Page v-if="postsCount > 20" :total="postsCount" :page-size="20" simple class="pageSelector" @on-change="updateData" />
      </div>
      <div v-else style="margin-top: 5px">
        该用户还没有发过帖子！
      </div>
    </Col>

    <!-- 帖子弹窗 -->
    <transition name="fade">
      <post-modal v-if="posts && posts.length > postPos" v-show="showPost" :posts="posts" :pos="postPos" @close="closePost"></post-modal>
    </transition>
  </div>
</template>

<script>
import PostModal from './PostModal'
import ListItem from './HomePanel/ListItem'

export default {

  name: 'UserPanel',

  inject: ['reload'],

  components: {
    PostModal,
    ListItem
  },

  data () {
    return {
      currentUser: this.$store.state.Users.currentUser.username,
      userData: {},
      groups: [],
      posts: [],

      // 所有帖子数
      postsCount: 0,

      showPost: false,
      postPos: 0
    }
  },

  computed: {
    username () {
      return this.$route.params.name
    }
  },

  watch: {
    username () {
      this.reload()
    }
  },

  methods: {
    showPostMethod (index) {
      this.$set(this, 'postPos', index)
      this.showPost = true
    },

    closePost () {
      this.showPost = false
    },

    updateData (page) {
      this.getUserPosts(this.username, page, data => {
        this.posts = data.data
        this.postsCount = data.count
      })

      this.getUserData(this.username, data => {
        this.userData = data
        // 获取小组数据
        if (data.groups.length > 0) {
          this.getGroupData(data.groups, groupsData => {
            this.groups.push(...groupsData)
          })
        }
      })
    }
  },

  mounted () {
    this.updateData(1)
  }
}
</script>

<style lang="css" scoped>
.info-side {
  text-align: center;
  padding-top: 100px;
}

.user-avatar {
  max-width: 60%;
  margin-bottom: 80px;
  transform: scale(3);
}

.modifyButton {
  margin-top: -20px;
}

.pageSelector {
  margin-top: 4px;
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.card-margin {
  /* width: 80%; */
  margin-bottom: 10px;
}

@media screen and (min-width: 768px) {
  .hideInPc {display: none;}
}
</style>
