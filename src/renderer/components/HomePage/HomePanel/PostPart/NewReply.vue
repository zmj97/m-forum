<template>
  <div>
    <Button type="success" @click="uploadReply">提交回复</Button>

    <!-- 插入mathjax公式的工具栏 -->
    <mathjax-toolbar contentId="md-editor"></mathjax-toolbar>

    <!-- ishljs 为 是否开启代码高亮 -->
    <!-- 支持mathjax -->
    <mavon-editor 
     id="md-editor" 
     v-model="value" 
     :ishljs="true" 
     :scrollStyle="true"
     ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"
     @fullScreen="fullScreenMdEditor"
    />
  </div>
</template>

<script>
export default {

  name: 'NewReply',

  props: ['_id'],

  inject: [
    'reload'
  ],

  data () {
    return {
      value: '# 你说得对',
      imgFiles: {}
      /*
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
    fullScreenMdEditor (status) {
      // 弹窗时， 全屏为完全全屏， 不修改高度
      if (this.$route.matched[1].path.indexOf('/home/home') === -1) {
        if (status) {
          document.getElementById('md-editor').style.zIndex = '2000'
        } else {
          document.getElementById('md-editor').style.zIndex = '1500'
        }
        return
      }
      // 修改全屏高度，放置在菜单栏下, 并隐藏父组件的滚动条
      if (status) {
        document.getElementById('md-editor').style.top = '60px'
        document.getElementById('md-editor').style.height = 'auto'
        document.getElementById('md-editor').style.zIndex = '2000'
        document.getElementById('main').style.overflow = 'hidden'
      } else {
        document.getElementById('md-editor').style.top = '0'
        document.getElementById('md-editor').style.height = '500px'
        document.getElementById('md-editor').style.zIndex = '1500'
        document.getElementById('main').style.overflow = 'auto'
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

    uploadReply ($e) {
      // 第一步.将图片上传到服务器.
      // }
      this.$http.post('/statics/upload', this.imgFiles)
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
          this.$http.post('/post/create/reply', {
            '_id': this._id,
            'reply': {
              'username': this.$store.state.Users.currentUser.username,
              'time': new Date(),
              'content': this.value
            }
          }).then(res => {
            if (res.data === 'success') {
              this.$Message.success('回复成功！')
              this.reload()
            } else {
              this.$Message.error('回复失败！')
            }
          }).catch(err => {
            this.$Message.error('回复失败！')
            console.log(err)
          })
        })
    }
  }
}
</script>

<style lang="css" scoped>
#md-editor {
  margin-top: 5px;
  height: auto;
}
</style>