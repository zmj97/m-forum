<template>
  <div style="overflow: auto">
    <div v-if="titles.length === 0" class="hint-center">
      <h3>快来添加第一个wiki page吧!</h3>
      <router-link to="/home/new-wiki">
        <Button type="success">
          新建一个page
        </Button>
      </router-link>
    </div>

    <div v-if="page" class="wiki-container">
      <!-- page内容 -->
      <div id="page">
        <!-- 所有版本 -->
        <transition name="fade">
          <section v-if="showAllVersions" id="versions">
            <h3 class="bold120pc" @click="showAllVersions=false">Revisions(点击关闭)</h3>
            <ul v-for="(item, index) in page.allVersions" :key="index">
              <li>
                <p class="bold120pc" @click="clickOldVersion(item)">{{ item.editMessage }}</p>
                <div>
                  <span class="bold120pc">
                    <router-link :to="'/home/user/' + item.username">
                      {{ item.username }}
                    </router-link>
                  </span>
                  修改于
                  {{ item.time | timeFilter }}
                </div>
              </li>
            </ul>
          </section>
        </transition>

        <h1 id="title">{{ page.title }} </h1>
        <div class="page-info">
          <router-link :to="'/home/user/' + page.lastestVersion.username">
            {{ page.lastestVersion.username }}
          </router-link>
          修改于
          {{ page.lastestVersion.time | timeFilter }} ·
          <span class="versions-hint" @click="showAllVersions = !showAllVersions">{{ page.allVersions.length }} 个版本</span>

          <!-- 具有权限的人才可进行的操作 -->
          <span>
             · <a @click="toEditPage">[编辑]</a>
             · <a class="delete-page" @click="modalDelete = true">[删除]</a>
             · <a class="change-authority" @click="showModifyGroups = !showModifyGroups">[修改权限]</a>
             · <router-link to="/home/new-wiki" class="new-page">[新建]</router-link>
          </span>

          <!-- 删除确认弹窗 -->
          <Modal
            v-model="modalDelete"
            title="删除page"
            :zIndex=5000
            @on-ok="okDelete">
            <p>确定要删除这个page么？</p>
          </Modal>

          <!-- 修改权限 -->
          <transition name="fade">
            <section v-if="showModifyGroups" style="padding: 15px 0">
              <!-- 提示 -->
              <p>不设定小组时，所有人均可浏览与编辑</p>

              <!-- 小组多选框 -->
              <Select
               v-model="groups"
               multiple
               clearable
               placeholder="修改要限定的小组(多选)"
               not-found-text="还没有小组"
               style="width: auto;"
              >
                <Option
                 v-for="group in allGroups"
                 :value="group.name"
                 :key="group.name"
                >
                  {{ group.name }}
                </Option>
              </Select>

              <!-- 确认按钮 -->
              <Button type="success" @click="modalUpdateGroups = true">确认</Button>
              <Button type="info" @click="cancelUpdateGroups">取消</Button>

              <!-- 确认修改小组权限弹窗 -->
              <Modal
                v-model="modalUpdateGroups"
                title="修改小组权限"
                :zIndex=5000
                @on-ok="okUpdateGroups">
                <p>确定要修改这个page的小组权限么？</p>
              </Modal>
            </section>
          </transition>
        </div>

        <!-- content -->
        <article id="content" v-html="convertedContent"></article>
      </div>

      <!-- 所有page目录 -->
      <nav class="nav">
        <h3>Pages · {{ titles.length }}</h3>
        <ul v-for="item in titles" id="titles" :key="item.title">
          <li><a @click="getPage(item.title)">{{ item.title }}</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'

export default {

  name: 'WikiPanel',

  inject: [
    'reload'
  ],

  data () {
    return {
      page: null,
      titles: [],
      showAllVersions: false,
      showModifyGroups: false,

      // 修改权限小组存储
      groups: [],
      // 所有小组
      allGroups: [],
      // 用户加入的小组
      joinedGroups: [],

      modalDelete: false,
      modalUpdateGroups: false
    }
  },

  methods: {
    // 用户是否加入了groups中的某一个小组
    inGroups (groups) {
      // 无限定小组时任何用户可查看
      if (groups.length === 0) return true
      return this.joinedGroups.some(function (item) {
        return groups.some(function (g) {
          return g === item
        })
      })
    },

    // 获取所有用户可查看的wiki的标题
    getTitles () {
      this.$http.post('/wiki/find/titles')
        .then(res => {
          res.data.forEach(item => {
            if (this.inGroups(item.groups)) {
              this.titles.push(item)
            }
          })
          // 如果传入title
          let queryTitle = this.$route.query.title
          if (queryTitle) {
            if (this.titles.some(item => item.title === queryTitle)) {
              this.getPage(queryTitle)
              return
            } else {
              this.$Message.error('无权查看！')
            }
          }
          if (this.titles.length > 0) {
            this.getPage(this.titles[0].title)
          }
        })
        .catch(err => {
          this.$Message.error('网络连接失败')
          console.error(err)
        })
    },

    getPage (title) {
      this.$http.post('/wiki/find/page', {'title': title})
        .then(res => {
          this.page = res.data
          this.page.allVersions.reverse()
          this.groups = this.page.groups
        })
        .catch(err => {
          this.$Message.error('网络连接失败')
          console.error(err)
        })
    },

    okDelete () {
      this.$http.post('/wiki/delete', {'_id': this.page._id})
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

    toEditPage () {
      this.$router.push({path: '/home/new-wiki', query: {title: this.page.title, content: this.page.lastestVersion.content}})
    },

    okUpdateGroups () {
      this.$http.post('/wiki/update/groups', {'title': this.page.title, 'groups': this.groups})
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

    cancelUpdateGroups () {
      this.showModifyGroups = false
      this.groups = this.page.groups
    },

    clickOldVersion (item) {
      this.page.lastestVersion = item
      window.location.hash = '#title'
    }
  },

  computed: {
    convertedContent () {
      if (!this.page || !this.page.lastestVersion.content) {
        return ''
      }
      return mavonEditor.getMarkdownIt().render(this.page.lastestVersion.content)
    }
  },

  filters: {
    // 将时间转换为当地时间显示
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

  mounted () {
    this.getJoinedGroupsNames(this.getCurrentUser().username, this.joinedGroups)
    setTimeout(() => { this.getTitles() }, 10)
    this.getAllGroupsNames(this.allGroups)
  }
}
</script>

<style lang="less" scoped>
/* 移动端 */
.hint-center {
  position: relative;
  top: 50%;
  line-height: 40px;
  text-align: center;
  transform: translateY(-50%);
}

.wiki-container {
  margin: 30px 16px;
  overflow: auto;
}

#versions {
  width: 100%;
  margin-bottom: 30px;
  padding: 0 10px;
  border: 1px solid #ccc;
  background-color: #eee;

  li {
    border-top: 1px solid #ccc;
    padding: 10px 0;
    line-height: 1.5;
  }
}

.bold120pc {
  font-size: 120%;
  font-weight: bold;
  line-height: 2;
  cursor: pointer;
  transition: color linear .2s;
}
.bold120pc:hover {color: #2d8cf0;}

.page-info {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;

  .versions-hint {
    cursor: pointer;
    transition: color .2s;
  }
  .versions-hint:hover {
    color: #2d8cf0;
  }

  // 删除链接为红色
  .delete-page {color: #ed4014;}
  // 修改权限颜色为黄色
  .change-authority {color: #ff9900;}
  // 新建页面链接为绿色
  .new-page {color: #19be6b;}
  // 链接hover时透明度变为80%，变化时间为0.2s
  .delete-page, .change-authority, .new-page {
    transition: opacity .2s;
  }
  .delete-page:hover, .change-authority:hover, .new-page:hover {
    opacity: .8;
  }
}

#content {padding: 24px 0;}

.nav {
  padding: 0 10px;
  border: 1px solid #ccc;
  background-color: #eee;
  line-height: 3;
}

#titles {
  list-style: none;
  border-top: 1px solid #ccc;
}

/* 平板及电脑 */
@media screen and (min-width: 768px) {
  #page {
    float: left;
    width: 100%;
    padding-right: 300px;
  }

  .nav {
    display: inline-block;
    float: left;
    width: 230px;
    margin-left: -255px;
    margin-top: 50px;
  }
}

.fade-enter-active, .fade-leave-active {transition: opacity .2s;}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {opacity: 0;}

/* 比较宽时固定宽度 */
@media screen and (min-width: 1100px) {
  .wiki-container {
    width: 1000px;
    margin-left: calc((100vw - 1000px) / 2);
  }
}
</style>
