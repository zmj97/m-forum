<template>
  <div style="overflow: auto">
    <m-avatar
     :avatar="formItem.avatar"
     :size=3
     class="avatar"
    ></m-avatar>

    <Button class="change-button" @click="clickChangeButton">修改头像</Button>

    <input id="inputFile" type="file" @change="inputImg" style="display: none" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">

    <Form :model="formItem" :label-width="80" id="edit-form">
      <FormItem label="用户名">
        <Input :value="username" disabled></Input>
      </FormItem>

      <FormItem label="邮箱">
        <Input v-model="formItem.email" placeholder="请输入邮箱"></Input>
      </FormItem>

      <FormItem label="手机">
        <Input v-model="formItem.telephone" placeholder="请输入手机号"></Input>
      </FormItem>

      <FormItem label="性别">
        <RadioGroup v-model="formItem.gender">
          <Radio label="male">男</Radio>
          <Radio label="female">女</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem style="text-align: center">
        <Button type="primary" @click="submitChange">提交</Button>
        <Button style="margin-left: 1rem">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {

  name: 'EditPanel',

  data () {
    return {
      username: this.getCurrentUser().username,
      img: null,
      formItem: {
        avatar: null,
        email: '',
        telephone: null,
        gender: null
      }
    }
  },

  inject: ['reload'],

  methods: {
    inputImg (e) {
      this.img = e.target.files[0]
      this.formItem.avatar = 'file://' + this.img.path
    },

    clickChangeButton () {
      document.getElementById('inputFile').click()
    },

    submitChange () {
      var reader = new FileReader()
      reader.readAsDataURL(this.img)
      reader.onload = e => {
        // 获取图片数据， 保存在e.target.result中
        this.$http.post('/statics/upload-avatar', {
          'username': this.username,
          '_name': this.img.name,
          'miniurl': e.target.result
        }).then(res => {
          this.formItem.avatar = res.data
          this.$http.post('/user/update/info', {'username': this.username, 'formdata': this.formItem})
            .then(res => {
              if (res.data === 'success') {
                this.$Message.success('修改成功')
                this.$router.push('/home/user/' + this.username)
                // 由于保存文件名不变无法刷新头像，待解决
                location.reload()
                // this.reload()
              } else {
                this.$Message.error('修改失败')
              }
            })
        })
      }
    }
  },

  mounted () {
    this.getUserData(this.username, data => {
      this.formItem.avatar = data.avatar
      this.formItem.email = data.email
      this.formItem.telephone = data.telephone
      this.formItem.gender = data.gender
    })
  }
}
</script>

<style lang="css" scoped>
.avatar {
  position: relative;
  top: 50%;
  left:  50%;
  margin: 5rem 0;
  transform: scale(3);
}

.change-button {
  position: relative;
  left: -86px;
  margin-left: 50%;
  width: 126px;
  height: 126px;
  border: 0;
  border-radius: 63px;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 2px;
  z-index: 3000;
  opacity: 0;
  transition: opacity 0.1s linear, color 0.1s linear;
}
.change-button:hover {
  opacity: 0.5;
  color: black;
}

#edit-form {
  width: 500px;
  margin: 1rem auto;
}
</style>