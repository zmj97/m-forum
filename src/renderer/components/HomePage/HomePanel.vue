<template>
  <div id="home-panel" v-if="posts.length > 0">
    <section id="list" @click="jumpToPost">
      <list-item
       v-for="(item, index) in posts"
       :itemData="item"
       :selected="selected[index]"
       @click.native="updateSelected(index)"
      ></list-item>

      <!-- 分页 选择页数 每页显示20条 -->
      <Page v-if="postsCount > 20" :total="postsCount" :page-size="20" simple class="pageSelector" @on-change="getPosts" />
    </section>
    <article id="main">
      <post-part v-if="posts.length > 0" :postData="posts[selectedPos]"></post-part>
    </article>
  </div>
</template>

<script>
import ListItem from './HomePanel/ListItem'
import PostPart from './HomePanel/PostPart'

export default {

  name: 'HomePanel',

  components: {
    ListItem,
    PostPart
  },

  data () {
    return {
      posts: [],
      postsCount: 0,
      selectedPos: 0,
      selected: [true]
    }
  },

  methods: {
    getPosts (page) {
      // 返回帖子列表顶部
      setTimeout(() => {
        document.documentElement.scrollTop = 0
      }, 0)

      // 获取帖子数据
      this.$http.post('/post/find/all', {'username': this.$store.state.Users.currentUser.username, 'page': page})
        .then(res => {
          this.$set(this, 'posts', res.data.data)
          this.$set(this, 'postsCount', res.data.count)
          // 当没有帖子时提示
          if (this.posts.length === 0) {
            this.$Notice.open({
              title: '暂无帖子！快点击发帖发表你的帖子吧！'
            })
            return
          }
          // 更新选中数组selected
          this.selected[0] = true
          this.selectedPos = 0
          for (var i = 1; i < this.posts.length; i++) {
            this.selected[i] = false
          }
        })
        .catch(err => {
          this.$Message.error('网络连接失败')
          console.error(err)
        })
    },

    updateSelected (pos) {
      // props响应式需要使用 this.$set(this.data, "key", "value")
      this.$set(this.selected, this.selectedPos, false)
      this.$set(this.selected, pos, true)
      this.$set(this, 'selectedPos', pos)
    },

    jumpToPost () {
      if (document.body.clientWidth > 768) return
      let listHeight = document.getElementById('list').scrollHeight
      document.documentElement.scrollTop = listHeight
    }
  },

  mounted () {
    this.getPosts(1)
  }
}
</script>

<style lang="less">
@gapWidth: 5px;
@navHeight: 60px;
@listWidth: 300px;

/* 手机中上方list 下方 main */
#home-panel, #list {
  margin: 0;
  padding: 0;
}

#main {
  padding: 10px;
  line-height: 200%;
  // letter-spacing: 1px;
}

.pageSelector {
  margin: @gapWidth 0;
  text-align: center;
}


/*
 * -- 平板及以上设备 --
 * 左右两栏
 * 中间间隙为 @gapWidth
 */
@media screen and (min-width: 768px) {
  /* 均在nav 下 @gapWidth 处 */
  #list, #main {
    position: fixed;
    top: @navHeight + @gapWidth;
    bottom: 0;
    box-shadow: 0 0 10px black;
    overflow: auto;
  }

  /* list 宽度为 @listWidth*/
  #list {
    left: 0;
    width: @listWidth;
    border-bottom: 1px solid #ddd;
    background-color: white;
  }

  #main {
    left: @listWidth + @gapWidth;
    right: 0;
    background-color: white;
  }
}
</style>