<template>
  <!-- 左中右分别为用户信息、所加入小组　和　所发帖子 -->
  <div style="overflow: auto">
    <!-- 用户信息 -->
    <Col span="6" class="info-side">
      <m-avatar
       :avatar="userData.avatar"
       :size=3
       class="user-avatar"
      ></m-avatar>
      <div class="modifyButton">
        <Button v-if="currentUser === userData.username" @click.native="$router.push('/home/edit')">编辑</Button>
      </div>
      <h1>
        {{ username }}
        <Icon v-if="userData.gender === 'female'" type="ios-female" style="color: pink; font-weight: bold" />
        <Icon v-else-if="userData.gender === 'male'" type="ios-male" style="color: blue; font-weight: bold" />
      </h1>
      <div>
        <Icon type="ios-mail"></Icon>
        {{ userData.email }}
      </div>
      <div v-if="userData.telephone">
        <Icon type="ios-phone-portrait" />
        {{ userData.telephone }}
      </div>
    </Col>

    <!-- 用户加入的小组 -->
    <Col span="8" offset="1">
      <Icon type="ios-people" size="30" style="margin: 10px"></Icon>所在小组
      <div v-if="groups.length > 0">
        <div v-for="item in groups">
          <router-link :to="'/home/group/' + item.name">
            <Card class="card-margin">
              <p slot="title">{{ item.name }}</p>
              <p>{{ item.leader }}</p>
              <p>{{ item.intro }}</p>
            </Card>
          </router-link>
        </div>
      </div>
      <div v-else>
        该用户暂未加入小组！
      </div>
    </Col>

    <!-- 用户发过的帖子 -->
    <Col span="8">
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
        该用户还没有发过帖子！
      </div>
    </Col>

    <!-- 帖子弹窗 -->
    <transition name="fade">
      <post-modal v-show="showPost" :posts="posts" :pos="postPos" @close="closePost"></post-modal>
    </transition>
  </div>
</template>

<script>
import PostModal from './PostModal'
import ListItem from './HomePanel/ListItem'

export default {

  name: 'UserPanel',

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

      showPost: false,
      postPos: 0
    }
  },

  computed: {
    username () {
      var tmpUsername = this.$route.params.name

      this.getUserData(tmpUsername, data => {
        this.userData = data
        // 获取小组数据
        this.getGroupData(data.groups, groupsData => {
          this.groups = groupsData
        })
      })

      this.getUserPosts(tmpUsername, data => {
        this.$set(this, 'posts', data)
      })

      return tmpUsername
    }
  },

  methods: {
    showPostMethod (index) {
      this.$set(this, 'postPos', index)
      this.showPost = true
    },

    closePost () {
      this.showPost = false
    }
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
}

.modifyButton {
  margin-top: -20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (min-width: 768px) {
  .user-avatar {
    transform: scale(3);
  }
}

.card-margin {
  width: 80%;
  margin-bottom: 10px;
}
</style>