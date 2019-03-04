<template>
  <Tabs v-model="tabValue" style="background-color: #eee; overflow-y: auto;">
    <TabPane :label="labelApply" name="apply">
      <div v-if="applyNotifications.length > 0">
        <div style="text-align: center">
          <span style="cursor: pointer" @click="clearNt('applyNotifications')">
            <Icon type="ios-trash" size="24" />清空消息
          </span>
        </div>
        <Card v-for="item in applyNotifications" :bordered="false" class="card-panel">
          <p slot="title">加入小组申请</p>
          <Button @click="acceptApply(item.username, item.groupName)" slot="extra" type="success" class="buttons">同意</Button>
          <Button @click="refuseApply(item.username, item.groupName)" slot="extra" type="error" class="buttons">拒绝</Button>
          <p>用户 {{ item.username }} 申请加入您管理的小组 {{ item.groupName }}</p>
        </Card>
      </div>
      <p v-else style="text-align: center">
        暂无消息
      </p>
    </TabPane>

    <TabPane :label="labelResult" name="result" class="tab-panel">
      <div v-if="resultNotifications.length > 0">
        <div style="text-align: center">
          <span style="cursor: pointer" @click="clearNt('replyNotifications')">
            <Icon type="ios-trash" size="24" />清空消息
          </span>
        </div>
        <Card v-for="item in resultNotifications" :bordered="false" class="card-panel">
          <p slot="title">申请结果</p>
          <p>
            你向
            <router-link :to="'/home/group/' + item.groupName">
              {{ item.groupName }}
            </router-link>
            发出的加入申请
            <span v-if="item.result" style="color: #19be6b">已通过</span>
            <span v-else style="color: #ed4014">被拒绝</span>
            。
          </p>
        </Card>
      </div>

      <p v-else style="text-align: center">
        暂无消息
      </p>
    </TabPane>

    <TabPane :label="labelReply" name="reply" class="tab-panel">
      <div v-if="replyNotifications.length > 0">
        <div style="text-align: center">
          <span style="cursor: pointer" @click="clearNt('replyNotifications')">
            <Icon type="ios-trash" size="24" />清空消息
          </span>
        </div>
        <Card 
         :bordered="false" 
         class="card-panel" 
         v-for="item in replyNotifications">
          <p slot="title">{{ item.username }} 回复了你</p>
          <a slot="extra" @click="toPostPanel(item.postId, item.replyIndex)">点击查看</a>
          <p>
            <span class="bold-font">{{ item.username }}</span> 
            在帖子 
            <span class="bold-font">{{ item.title }}</span> 
            中回复了你，快去查看吧！ </p>
        </Card>
      </div>
      <p v-else style="text-align: center">
        暂无消息
      </p>
    </TabPane>
  </Tabs>
</template>

<script>
export default {

  name: 'NotificationsPanel',

  inject: ['reload'],

  data () {
    return {
      tabValue: 'apply',
      applyNotifications: [],
      resultNotifications: [],
      replyNotifications: [],

      newApplyNt: false,
      newResultNt: false,
      newReplyNt: false
    }
  },

  computed: {
    labelApply () {
      return this.getLabel('小组加入申请', this.newApplyNt)
    },
    labelResult () {
      return this.getLabel('小组申请结果', this.newResultNt)
    },
    labelReply () {
      return this.getLabel('新的回复', this.newReplyNt)
    }
  },

  watch: {
    tabValue () {
      if (this.newResultNt === true && this.tabValue === 'result') {
        this.updateNewNt('newResultNt')
      }
      if (this.newReplyNt === true && this.tabValue === 'reply') {
        this.updateNewNt('newReplyNt')
      }
    }
  },

  methods: {
    updateNewNt (name) {
      let formData = {}
      formData[name] = false
      formData['username'] = this.getCurrentUser().username
      this.$set(this, name, false)
      this.$http.post('/user/update/newNt', formData)
      this.$emit('newNtChange', this.newApplyNt || this.newResultNt || this.newReplyNt)
    },

    clearNt (typeName) {
      let formData = {}
      formData[typeName] = []
      formData['username'] = this.getCurrentUser().username
      this.$http.post('/user/delete/Nt', formData)
        .then(res => {
          if (res.data === 'error') {
            this.$Message.error('数据库连接失败!')
          } else {
            this.$Message.success('清空成功!')
            this.reload()
          }
        }).catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误!')
        })
    },

    getLabel (content, newNt) {
      return (h) => {
        return h('div', [
          h('span', content),
          h('Badge', {
            props: {
              dot: newNt
            },
            style: {
              marginLeft: '10px',
              marginBottom: '5px'
            }
          })
        ])
      }
    },

    getNotifications () {
      this.$http.post('user/find/notifications', {'username': this.getCurrentUser().username})
        .then(res => {
          if (res.data === 'error') {
            this.$Message.error('数据库连接失败!')
          } else {
            this.applyNotifications = res.data.applyNotifications.reverse()
            this.resultNotifications = res.data.resultNotifications.reverse()
            this.replyNotifications = res.data.replyNotifications.reverse()
            this.newResultNt = res.data.newResultNt
            this.newReplyNt = res.data.newReplyNt
            if (res.data.newApplyNt) {
              this.updateNewNt('newApplyNt')
            }
          }
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误!')
        })
    },

    toPostPanel (postId, replyIndex) {
      this.$router.push({path: '/home/post', query: {'postId': postId, 'replyIndex': replyIndex}})
    },

    uploadApplyResult (username, groupName, uploadUrl) {
      this.$http.post(uploadUrl, {
        'leader': this.getCurrentUser().username,
        'name': groupName,
        'username': username
      }).then(res => {
        if (res.data === 'error') {
          this.$Message.error('数据库连接错误')
        } else {
          this.reload()
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误!')
      })
    },

    acceptApply (username, groupName) {
      this.uploadApplyResult(username, groupName, '/group/update/accept')
    },

    refuseApply (username, groupName) {
      this.uploadApplyResult(username, groupName, '/group/update/refuse')
    }
  },

  mounted () {
    this.getNotifications()
  }
}
</script>

<style lang="less" scoped>
.card-panel { margin: 1rem; }

.buttons {
  margin-right: 1rem;
  padding: 2px 6px;
}

.bold-font {font-weight: bold;}

@media screen and (min-width: 800px) {
  .card-panel { margin: 1rem calc((100vw - 750px)/2); }
}
</style>