<template>
  <div style="overflow: auto; background-color: #eee;">
    <Input v-model="searchStr" @on-enter="getData" clearable suffix="ios-search" placeholder="搜索帖子、小组和Wiki..." class="search-bar" />

    <Tabs v-model="tabValue" style=" overflow-y: auto;">

      <TabPane label="帖子" name="posts">
        <div v-if="posts.length > 0">
          <Card v-for="(item, index) in posts" :bordered="false" class="card-panel" :key="index">
            <p v-html="highlightTitle(item.title)" slot="title"></p>
            <a @click="showPostModal(index)" slot="extra" style="float: right">点击查看</a>
            <p v-html="item.highlight"></p>
          </Card>
        </div>

        <p v-else style="text-align: center">无帖子搜索结果。</p>
      </TabPane>

      <TabPane label="小组" name="groups">
        <div v-if="groups.length > 0">
          <Col :xs="12" :sm="6" :md="4" :lg="3" v-for="item in groups" :key="item.name">
            <router-link :to="'/home/group/' + item.name">
              <Card style="margin: 1rem">
                <p slot="title">{{ item.name }}</p>
                <p>
                  <router-link :to="'/home/user/' + item.leader">
                    {{ item.leader }}
                  </router-link>
                </p>
                <p>{{ item.intro }}</p>
              </Card>
            </router-link>
          </Col>
        </div>

        <p v-else style="text-align: center">无小组搜索结果。</p>
      </TabPane>

      <TabPane label="Wiki" name="wikis">
        <CellGroup v-if="wikis.length > 0" class="card-panel cell-panel">
          <Cell v-for="item in wikis" @click.native="toWikiPanel(item)" :title="item" class="cell" :key="item">
          </Cell>
        </CellGroup>

        <p v-else style="text-align: center">无Wiki搜索结果。</p>
      </TabPane>

    </Tabs>

    <!-- 帖子弹窗 -->
    <transition name="fade">
      <post-modal v-show="showPost" :posts="postsData" :pos="postPos" @close="showPost = false"></post-modal>
    </transition>
  </div>
</template>

<script>
import PostModal from './PostModal'

export default {

  name: 'SearchPanel',

  components: {
    PostModal
  },

  data () {
    return {
      searchStr: '',

      tabValue: 'posts',

      // 仅保存题目和关键词语句
      posts: [],
      // 保存所有数据
      postsData: [],

      highlightLeftTagStr: '<span style="font-weight: bold; color: red;">',

      // 是否显示帖子弹窗
      showPost: false,
      // 弹窗显示第几个帖子
      postPos: 0,

      // 搜索到的小组数据
      groups: [],

      // 搜索到的wiki数据
      wikis: []
    }
  },

  watch: {
    '$route' () {
      this.searchStr = this.$route.query.searchStr
      this.getData()
    }
  },

  methods: {
    getData () {
      this.getPosts()
      this.getGroups()
      this.getWikis()
    },

    // 获取帖子搜索结果数据
    getPosts () {
      this.$http.post('/post/find/search', {'searchStr': this.searchStr})
        .then(res => {
          if (res.data === 'error') {
            this.$Message.error('数据库连接错误！')
          } else {
            this.postsData = res.data
            this.posts = []
            res.data.forEach(item => {
              this.posts.push({'title': item.title, 'highlight': this.highlightSearchStr(item)})
            })
          }
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误！')
        })
    },

    // 获取小组搜索结果数据
    getGroups () {
      this.$http.post('/group/find/search', {'searchStr': this.searchStr})
        .then(res => {
          if (res.data === 'error') {
            this.$Message.error('数据库连接错误！')
          } else {
            this.groups = res.data
          }
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误！')
        })
    },

    // 获取wiki搜索结果数据
    getWikis () {
      this.$http.post('/wiki/find/search', {'searchStr': this.searchStr})
        .then(res => {
          if (res.data === 'error') {
            this.$Message.error('数据库连接错误！')
          } else {
            this.wikis = res.data
          }
        })
        .catch(err => {
          console.error(err)
          this.$Message.error('网络连接错误！')
        })
    },

    toWikiPanel (title) {
      this.$router.push({path: '/home/wiki', query: {'title': title}})
    },

    showPostModal (index) {
      this.postPos = index
      this.showPost = true
    },

    miniString (varifyStr, searchStr) {
      let sPos = varifyStr.indexOf(searchStr)
      if (varifyStr.length - sPos - searchStr.length > 20) {
        varifyStr = varifyStr.slice(0, sPos + searchStr.length) + '</span>' + varifyStr.slice(sPos + searchStr.length, sPos + searchStr.length + 20) + '...'
      } else {
        varifyStr = varifyStr.slice(0, sPos + searchStr.length) + '</span> ' + varifyStr.slice(sPos + searchStr.length)
      }
      if (sPos > 10) {
        varifyStr = '...' + varifyStr.slice(sPos - 10, sPos) + this.highlightLeftTagStr + varifyStr.slice(sPos)
      } else {
        varifyStr = varifyStr.slice(0, sPos) + this.highlightLeftTagStr + varifyStr.slice(sPos)
      }
      return varifyStr
    },

    highlightTitle (title) {
      let searchStr = this.$route.query.searchStr
      let sPos = title.indexOf(searchStr)
      if (sPos === -1) return title
      return title.slice(0, sPos) + this.highlightLeftTagStr + title.slice(sPos, sPos + searchStr.length) + '</span>' + title.slice(sPos + searchStr.length)
    },

    highlightSearchStr (item) {
      let varifyStr
      let searchStr = this.$route.query.searchStr
      if (item.title.indexOf(searchStr) !== -1) {
        return item.abstract ? item.abstract : (item.content.length > 50 ? item.content.slice(0, 50) + '...' : item.content)
      } else if (item.abstract.indexOf(searchStr) !== -1) {
        let sPos = item.abstract.indexOf(searchStr)
        return item.abstract.slice(0, sPos) + this.highlightLeftTagStr + item.abstract.slice(sPos, sPos + searchStr.length) + '</span>' + item.abstract.slice(sPos + searchStr.length)
      } else if (item.content.indexOf(searchStr) !== -1) {
        return this.miniString(item.content, searchStr)
      } else if (item.replys.some(reply => {
        if (reply.content.indexOf(searchStr) !== -1) {
          varifyStr = reply.content
          return true
        }
        return reply.replys.some(r => {
          if (r.content.indexOf(searchStr) !== -1) {
            varifyStr = r.content
            return true
          } else {
            return false
          }
        })
      })) {
        return this.miniString(varifyStr, searchStr)
      }
    }
  },

  mounted () {
    if (this.$route.query.searchStr) {
      this.searchStr = this.$route.query.searchStr
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.search-bar {
  width: 80%;
  margin: 20px;
  transform: translateX(10%);
}

.card-panel { margin: 1rem; }

.cell-panel {
  background-color: white;
  transition: box-shadow .5s;

  .cell {
    line-height: 5;
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 0 1px gray;
  }
}

@media screen and (min-width: 768px) {
  .search-bar {display: none;}
}

@media screen and (min-width: 800px) {
  .card-panel { margin: 1rem calc((100vw - 750px)/2); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
