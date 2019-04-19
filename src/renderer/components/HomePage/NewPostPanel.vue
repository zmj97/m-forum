<template>
  <div style="overflow: auto">
    <!-- 限定小组与提交按钮 -->
    <div id="buttons">
      <!-- float right 从右到左为发布、取消、存为草稿以及选择小组 -->
      <Button type="success" class="float-right" @click="modalPost = true">发布</Button>
      <Modal
        v-model="modalPost"
        title="发布帖子"
        :zIndex=5000
        @on-ok="okPost">
        <p>确定要发布这篇帖子么？</p>
      </Modal>
      <Button type="error" class="float-right" @click="modalCancel = true">放弃</Button>
      <Modal
        v-model="modalCancel"
        title="放弃发布"
        :zIndex=5000
        @on-ok="okCancel">
        <p>确定要放弃发布这篇帖子么？您将丢失您编辑的所有内容！</p>
      </Modal>

      <Select
       v-model="group"
       clearable
       placeholder="可选择要限定的小组"
       not-found-text="您还未加入小组"
       style="width: auto;"
       class="float-right"
      >
        <Option
         v-for="group in joinedGroups"
         :value="group"
         :key="group"
        >
          {{ group }}
        </Option>
      </Select>
    </div>

    <!-- 标题栏 -->
    <input
     id="title"
     type="text"
     name="title"
     v-model="postData.title"
     placeholder="标题，最多输入30个字符"
     :maxlength=30
    >

    <!-- 摘要栏 -->
    <Input
     id="abstract"
     v-model="postData.abstract"
     size="large"
     placeholder="摘要，最多输入100个字符"
     clearable
     :maxlength=100
    />

    <!-- 添加标签 -->
    <div id="tags">
      <span>
        <!-- 使用span单独框起来，来fix刷新后标签不显示的问题 -->
        <Tag
         type="dot"
         color="primary"
         v-for="tag in postData.tags"
         :key="tag"
         :name="tag"
         closable
         @on-close="removeTag"
        >
          {{ tag }}
        </Tag>
      </span>

      <Input
       placeholder="回车添加标签，至多10个"
       prefix="ios-pricetag"
       style="width: 180px"
       v-model="newTag"
       @on-enter="addTag"
      />
    </div>

    <mathjax-toolbar contentId="editor"></mathjax-toolbar>

    <!-- ishljs 为 是否开启代码高亮 -->
    <!-- 支持mathjax -->
    <mavon-editor
     id="editor"
     v-model="postData.content"
     :ishljs="true"
     :scrollStyle="true"
     :autofocus="false"
     ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"
    />
  </div>
</template>

<script>
export default {

  name: 'NewPostPanel',

  data () {
    return {
      postData: {
        username: this.$store.state.Users.currentUser.username,
        title: '',
        abstract: '',
        tags: [],
        // time 在发布时获取
        content: '输入描述',
        replys: []
      },
      newTag: '',

      joinedGroups: [],
      // 设定小组
      group: null,

      // 对话框
      modalPost: false,
      modalCancel: false,

      // 编辑器中添加的图片
      imgFiles: {}
      /*
        imgFiles:
        {
          pos('0','1', ...):
            {
              miniurl:
              _name:
            }
        }
       */
    }
  },

  methods: {
    removeTag (event, name) {
      const index = this.postData.tags.indexOf(name)
      this.postData.tags.splice(index, 1)
    },

    addTag () {
      if (this.postData.tags.indexOf(this.newTag) !== -1) {
        this.$Message.warning('标签不可重复！')
      } else if (this.postData.tags.length < 10 && this.newTag !== '') {
        this.postData.tags.push(this.newTag)
        this.newTag = ''
      }
    },

    // 绑定@imgAdd event
    $imgAdd (pos, $file) {
      // 缓存图片信息
      this.imgFiles[pos] = $file
    },

    $imgDel (pos) {
      delete this.imgFiles[pos]
    },

    okCancel () {
      this.$router.push('/home')
    },

    async okPost () {
      if (this.postData.title.replace(/\s+/g, '').length === 0) {
        return this.$Message.error('标题内容不能为空！')
      }
      // 设置时间
      this.postData.time = new Date()
      this.postData.lastModifyTime = this.postData.time
      // 如果设定了小组
      if (this.group) {
        this.postData.group = this.group
      }

      // 第一步.将图片上传到服务器.
      if (this.imgFiles !== {}) {
        await this.$http.post('/statics/upload', this.imgFiles)
          .then((res) => {
            /**
             * 返回数据为 res = [[pos, url], [pos, url]...]
             * pos 为原图片标志（0）
             * url 为上传后图片的url地址
             *
             * $vm.$img2Url(>=2.1.11)
             * String: filename, String: url
             * 将md源码中图片文件名替换为url
             * 如![h](./0) ->
             * ![h](http://path/to/png/some.png)
             */
            res.data.forEach(img => {
              this.$refs.md.$img2Url(img[0], img[1])
            })
          })
      }

      this.$http.post('/post/create/new', this.postData)
        .then(res => {
          if (res.data === 'success') {
            this.$Message.success('发布成功')
            this.$router.push('/home')
          } else {
            this.$Message.error('数据库连接失败，请重试！')
          }
        })
        .catch(err => {
          this.$Message.error('网络连接失败!')
          console.error(err)
        })
    }
  },

  mounted () {
    this.getJoinedGroups(this.postData.username, this.joinedGroups)
  }
}
</script>

<style lang="css" scoped>
#title, #abstract, #tags, #buttons, #editor {
  margin-top: 0.5rem;
}

#editor {
  z-index: 1000;
}

.float-right {
  float: right;
  margin-right: 1rem;
}

#title {
  width: 100%;
  border: 0;
  padding-left: 5px;
  font-size: 40px;
  outline: none;
}
</style>
