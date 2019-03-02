<template>
  <div style="overflow: auto; background: #eee">
    <div v-if="stars.length > 0">
      <Card v-for="item in stars" :bordered="false" class="card-panel">
        <p slot="title">{{ item.title }}</p>
        <a @click="toPostPanel(item.id)" slot="extra" type="success">点击查看</a>
        <p>{{ item.abstract }}</p>
      </Card>
    </div>

    <p v-else style="text-align: center">
      您还没有收藏帖子。
    </p>
  </div>
</template>

<script>
export default {

  name: 'StarPanel',

  data () {
    return {
      currentUser: this.getCurrentUser().username,

      stars: []
    }
  },

  methods: {
    getStars () {
      this.$http.post('/user/find/stars', {
        'username': this.currentUser
      }).then(res => {
        if (res.data === 'error') {
          this.$Message.error('数据库连接失败！')
        } else {
          this.stars = res.data.stars
        }
      }).catch(err => {
        console.error(err)
        this.$Message.error('网络连接错误！')
      })
    },

    toPostPanel (id) {
      this.$router.push({path: '/home/post', query: {'postId': id}})
    }
  },

  mounted () {
    this.getStars()
  }
}
</script>

<style lang="less" scoped>
.card-panel { margin: 1rem; }

@media screen and (min-width: 800px) {
  .card-panel { margin: 1rem calc((100vw - 750px)/2); }
}
</style>