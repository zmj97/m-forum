<template>
  <div style="overflow: auto">
    <Col :xs="24" :sm="6" style="padding: 1rem">
      <div style="text-align: center; padding: 1rem 0;">
        <!-- 小组头像 -->
        <m-avatar
         :avatar="avatar"
         :size=3
        ></m-avatar>
        <!-- 小组名字 -->
        <span class="name">{{ name }}</span>

        <!-- 组长可进行的操作 -->
        <div v-if="currentUser === leader" style="line-height: 3">
          <!-- 设置是否开放加入 -->
          <Poptip trigger="hover" placement="bottom" title="开放加入" content="开启后用户可直接加入，关闭时用户需要申请通过组长同意">
            <i-switch @on-change="changeJoinPublic" style="margin: 0 1rem">
              <Icon type="md-checkmark" slot="open"></Icon>
              <Icon type="md-close" slot="close"></Icon>
            </i-switch>
          </Poptip>

          <!-- 删除按钮，组长可以删除小组 -->
          <Button style="padding: 1px 3px" type="error" @click="modalDelete = true">删除小组</Button>
          <!-- 确认删除小组的弹窗 -->
          <Modal
            v-model="modalDelete"
            title="删除小组"
            :zIndex=5000
            @on-ok="okDelete">
            <p>确定要删除这个小组么？删除后所有小组内的帖子也将被删除！</p>
          </Modal>

          <!-- 组长可以修改小组头像 -->
          <Button style="padding: 1px 3px; margin-left: 1rem" type="info" @click="changeAvatar()">修改头像</Button>
          <input id="inputFile" type="file" @change="inputImg" style="display: none" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        </div>

        <!-- 加入小组按钮，用户未加入此小组时显示 -->
        <button v-if="!users.includes(currentUser)" class="join-button" @click="modalJoin = true">加入</button>
        <!-- 确认加入小组的弹窗 -->
        <Modal
          v-model="modalJoin"
          title="加入小组"
          :zIndex=5000
          @on-ok="okJoin">
          <p>确认要加入这个小组么？</p>
        </Modal>

        <!-- 退出小组按钮，用户在此小组中且不是组长时显示 -->
        <Button v-if="currentUser !== leader && users.includes(currentUser)" type="error" style="margin-left: 1rem" @click="modalQuit = true">退出</Button>
        <!-- 确认退出小组的弹窗 -->
        <Modal
          v-model="modalQuit"
          title="退出小组"
          :zIndex=5000
          @on-ok="okQuit">
          <p>确认要退出这个小组么？请谨慎操作！</p>
        </Modal>

        <p style="text-align: center">{{ intro }}</p>
      </div>

      <div style="margin-top: 2rem">
        <p style="margin: 1rem 0">组长：</p>
        <!-- 组长图标 -->
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
        <!-- 所有成员图标 -->
        <!-- 文字提示气泡框，提示名字 -->
        <Tooltip v-for="(item, index) in users" :content="item" style="margin: 3px" :key="index">
          <router-link :to="'/home/user/' + item">
            <m-avatar
             :avatar="avatars[index]"
             :size=1
            ></m-avatar>
          </router-link>
        </Tooltip>

        <!-- 添加成员图标，只有组长可以添加 -->
        <Tooltip content="添加成员" v-if="currentUser === leader" style="margin: 3px">
          <Icon type="md-add" size="20" @click="addMeber" style="cursor: pointer" />
        </Tooltip>
      </div>
    </Col>

    <Col :xs="24" :sm="{ span: 8, offset: 5 }">
      <Icon type="ios-paper" size="25" style="margin: 10px"></Icon>小组内所有帖子
      <div v-if="posts.length > 0">
        <list-item
         v-for="(item, index) in posts"
         :itemData="item"
         :key="index"
         @click.native="showPostMethod(index)"
         class="card-margin"
        ></list-item>

        <!-- 分页 选择页数 每页显示20条 -->
        <Page v-if="postsCount > 20" :total="postsCount" :page-size="20" simple class="pageSelector" @on-change="updatePosts" />
      </div>
      <div v-else-if="isInGroup()" style="margin-top: 5px">
        该小组内还没有发过帖子！
      </div>
      <div v-else style="margin-top: 5px">
        无权查看该小组的发帖情况！
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

  inject: [
    'reload'
  ],

  data () {
    return {
      // 当前用户
      currentUser: this.$store.state.Users.currentUser.username,

      // 小组名
      name: this.$route.params.name,
      intro: '',
      leader: '',
      users: [],
      // 小组头像
      avatar: '',
      // 成员头像
      avatars: [],
      posts: [],

      img: null,

      // 所有帖子数
      postsCount: 0,

      showPost: false,
      postPos: 0,

      // 删除弹窗的状态
      modalDelete: false,
      // 退出弹窗的状态
      modalQuit: false,
      // 加入弹窗的状态
      modalJoin: false,

      // 添加的组员的用户名
      memberUsername: ''
    }
  },

  methods: {
    // 组长修改小组加入权限
    changeJoinPublic (value) {
      this.$http.post('/group/update/join-public', {
        'name': this.name,
        'joinPublic': value
      }).then(res => {
        if (res.data === 'error') {
          this.$Message.error('数据库连接失败！')
        } else {
          this.$Message.success('修改成功！')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接失败！')
      })
    },

    // 组长可以修改头像
    changeAvatar () {
      document.getElementById('inputFile').click()
    },

    inputImg (e) {
      this.img = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(this.img)
      reader.onload = e => {
        this.$http.post('/statics/upload-avatar', {
          'name': this.name,
          '_name': this.img.name,
          'miniurl': e.target.result
        }).then(res => {
          this.$http.post('/group/update/avatar', {'name': this.name, 'avatar': res.data})
            .then(res => {
              if (res.data === 'success') {
                this.$Message.success('修改成功')
                this.$router.push('/home/group/' + this.name)
                location.reload()
              } else {
                this.$Message.error('修改失败')
              }
            })
        })
      }
    },

    // 用户申请加入小组
    okJoin () {
      this.$http.post('/group/create/join', {
        'name': this.name,
        'leader': this.leader,
        'username': this.currentUser
      }).then(res => {
        if (res.data === 'success') {
          this.$Message.success('加入成功！')
          this.reload()
        } else if (res.data === 'applied') {
          this.$Message.success('申请成功，请等待组长同意！')
        } else {
          this.$Message.error('数据库连接错误！')
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    // 当前用户是否在这个小组中
    isInGroup () {
      return this.users.includes(this.getCurrentUser().username)
    },

    updatePosts (page) {
      this.$http.post('/post/find/limit', {'json': {'group': this.name}, 'page': page})
        .then(res => {
          this.posts = res.data.data
          this.postsCount = res.data.count
        })
        .catch(err => {
          this.$Message.error('网络连接失败')
          console.error(err)
        })
    },

    showPostMethod (index) {
      this.postPos = index
      this.showPost = true
    },

    closePost () {
      this.showPost = false
    },

    // 组长删除小组
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
    },

    // 组员退出小组
    okQuit () {
      this.deleteGroupMembers(this.name, [this.currentUser], () => {
        this.$Message.success('退出成功！')
      })
    },

    // 组长添加成员
    addMeber () {
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.memberUsername,
              autofocus: true,
              placeholder: '请输入要添加成员的用户名'
            },
            on: {
              input: (val) => {
                this.memberUsername = val
              }
            }
          })
        },

        onOk: () => {
          if (this.memberUsername === '') {
            alert('请输入用户名！')
            return
          }
          if (this.users.includes(this.memberUsername)) {
            alert('此用户已在此小组中！')
            return
          }
          this.getUserData(this.memberUsername, data => {
            this.$http.post('/group/create/member', {
              'name': this.name,
              'username': this.memberUsername
            }).then(res => {
              if (res.data === 'success') {
                this.$Message.success('添加成功！')
                this.reload()
              }
            })
          }, () => {
            this.$Message.error('此用户名不存在！')
          })
        }
      })
    }
  },

  mounted () {
    // 获取小组数据并更新
    this.getGroupData(this.name, data => {
      data = data[0]
      this.leader = data.leader
      this.intro = data.intro
      this.users = data.users
      this.avatar = data.avatar
      // 获取用户头像并更新
      this.getUserData(this.users, data => {
        data.forEach(item => {
          this.avatars.push(item.avatar)
        })
      })
      // 如果用户在这个小组中
      if (this.isInGroup()) {
        this.updatePosts(1)
      }
    })
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

.join-button {
  margin-left: 1rem;
  padding: 6px 15px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #19be6b;
  line-height: 1.5;
  color: white;
  font-weight: 400;
  font-size: 12px;
  outline: 0;
  transition: opacity linear .2s;
}
.join-button:hover {
  opacity: 0.8;
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
</style>
