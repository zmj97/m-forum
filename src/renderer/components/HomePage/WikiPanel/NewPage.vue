<template>
  <div style="overflow: auto">
    <!-- 标题栏 -->
    <input 
     id="title" 
     type="text" 
     name="title" 
     v-model="wikiData.title" 
     placeholder="标题，最多输入30个字符"
     :maxlength=30
    >

    <!-- 限定小组 -->
    <section v-if="!isEdit">
      <h3 class="hint">限定小组(仅限定小组的成员可浏览与编辑)</h3>
      <Select
       v-model="wikiData.groups" 
       multiple
       clearable
       placeholder="可选择要限定的小组(多选)"
       not-found-text="还没有小组"
       style="width: auto;"
       class="set-groups"
      >
        <Option 
         v-for="group in allGroups"
         :value="group.name"
         :key="group.name"
        >
          {{ group.name }}
        </Option>
      </Select>
    </section>


    <h3 class="hint">编辑内容</h3>
    <mathjax-toolbar contentId="editor"></mathjax-toolbar>
    <!-- ishljs 为 是否开启代码高亮 -->
    <!-- 支持mathjax -->
    <mavon-editor
     id="editor"
     v-model="wikiData.lastestVersion.content" 
     :ishljs="true"
    />

    <h3 class="hint">编辑信息</h3>
    <Input 
     id="editMessage"
     v-model="wikiData.lastestVersion.editMessage" 
     size="large" 
     placeholder="最多输入100个字符"
     clearable 
     :maxlength=100
    />

    <Button type="success" class="save" @click="modalSave = true">保存</Button>
    <Modal
      v-model="modalSave"
      title="保存"
      :zIndex=5000
      @on-ok="okSave">
      <p>确定要保存么？</p>
    </Modal>
  </div>
</template>

<script>
export default {

  name: 'NewPage',

  data () {
    return {
      allGroups: [],
      modalSave: false,
      wikiData: {
        title: '',
        lastestVersion: {
          username: this.$store.state.Users.currentUser.username,
          time: null,
          content: '',
          editMessage: ''
        },
        allVersions: [],
        groups: []
      },

      isEdit: Boolean(this.$route.query.title)
    }
  },

  methods: {
    // 发送数据并保存
    okSave () {
      // 标题内容编辑信息均不能为空
      if (this.wikiData.title.replace(/\s+/g, '') === '') {
        this.$Message.error('标题内容不能为空!')
        return
      }

      if (this.wikiData.lastestVersion.content.replace(/\s+/g, '') === '') {
        this.$Message.error('内容不能为空!')
        return
      }

      if (this.wikiData.lastestVersion.editMessage.replace(/\s+/g, '') === '') {
        this.$Message.error('编辑信息内容不能为空!')
        return
      }

      this.wikiData.lastestVersion.time = new Date()

      // 如果为编辑
      if (this.isEdit) {
        this.$http.post('/wiki/update/edit', {'title': this.wikiData.title, 'lastestVersion': this.wikiData.lastestVersion})
          .then(res => {
            if (res.data === 'success') {
              this.$Message.success('编辑成功!')
              this.$router.push('/home/wiki')
            } else {
              this.$Message.error('数据库连接失败，请重试！')
            }
          })
          .catch(err => {
            this.$Message.error('网络连接失败!')
            console.error(err)
          })
        return
      }

      // 如果为创建
      this.wikiData.allVersions.push(this.wikiData.lastestVersion)
      this.$http.post('/wiki/create/new', this.wikiData)
        .then(res => {
          if (res.data === 'repeat') {
            this.$Message.error('标题已存在！')
          } else if (res.data === 'success') {
            this.$Message.success('发布成功')
            this.$router.push('/home/wiki')
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
    if (this.isEdit) {
      this.wikiData.title = this.$route.query.title
      this.wikiData.lastestVersion.content = this.$route.query.content
    } else {
      this.getAllGroupsNames(this.allGroups)
    }
  }
}
</script>

<style lang="css" scoped>
#title {
  width: 100%;
  border: 0;
  padding-left: 5px;
  margin: 10px 0;
  font-size: 40px;
  outline: none;
}

#editor {
  z-index: 1000;
}

.set-groups {
  /* 防止被markdow编辑器遮盖 */
  position: relative;
  z-index: 5000;

  margin: 10px 0;
}

.hint {
  margin: 40px 0 10px 5px;
}

.save {
  margin: 20px 0 10px 5px;
}
</style>