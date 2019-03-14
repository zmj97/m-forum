<template>
  <div style="overflow: auto">
    <m-avatar
     :avatar="formItem.avatar"
     :size=3
     class="avatar"
    ></m-avatar>

    <Button class="change-button" @click="showCropper = true">修改头像</Button>

    <avatar-cropper v-model="showCropper" @ok="inputImg"></avatar-cropper>

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
        <Button style="margin-left: 1rem" @click="cancel">取消</Button>
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

      showCropper: false,

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
    inputImg (data) {
      this.$http.post('/statics/upload-avatar', {
        'username': this.username,
        '_name': this.username + '.png',
        'miniurl': data
      }).then(res => {
        this.formItem.avatar = res.data
        this.submitChange()
      }).catch(err => {
        console.error(err)
        this.$Message.error('修改头像失败！')
      })
    },

    clickChangeButton () {
      document.getElementById('inputFile').click()
    },

    submitChange () {
      this.$http.post('/user/update/info', {'username': this.username, 'formdata': this.formItem})
        .then(res => {
          if (res.data === 'success') {
            this.$router.push('/home/user/' + this.username)
            location.reload()
            alert('修改成功')
          } else {
            this.$Message.error('修改失败')
          }
        })
    },

    cancel () {
      this.$router.go(-1)
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
  max-width: 500px;
  margin: 1rem auto;
  padding-right: 1rem;
}
</style>
