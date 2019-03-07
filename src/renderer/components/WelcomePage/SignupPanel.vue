<template>
  <Form ref="formData" :model="formData" :rules="rule">
    <FormItem prop="username">
      <Input type="text" v-model="formData.username" placeholder="用户名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="email">
      <Input type="email" v-model="formData.email" placeholder="邮箱">
        <Icon type="ios-mail-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="formData.password" placeholder="密码">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="pwdRepeat">
      <Input type="password" v-model="formData.pwdRepeat" placeholder="重复密码">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formData')">注册</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {

  name: 'SignupPanel',

  data () {
    const pwdRepeatValidator = (rule, value, callback) => {
      if (value !== this.formData.password) {
        callback(new Error('重复密码与密码不同'))
      } else {
        callback()
      }
    }

    return {
      formData: {
        username: '',
        email: '',
        password: '',
        pwdRepeat: ''
      },
      rule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^[[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不少于6位', trigger: 'blur' }
        ],
        pwdRepeat: [
          {
            required: false,
            validator: pwdRepeatValidator,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var data = {
            username: this.formData.username,
            email: this.formData.email,
            password: this.formData.password,
            avatar: null,
            gender: null,
            telephone: null,
            groups: [],
            stars: [],
            drafts: [],
            applyNotifications: [],
            resultNotifications: [],
            replyNotifications: [],
            newApplyNt: false,
            newResultNt: false,
            newReplyNt: false
          }
          this.$http.post('/user/create/signup', data)
            .then((response) => {
              if (response.data === 'success') {
                this.$Message.success('注册成功!')
                this.$Message.success('登陆成功!')
                this.$store.dispatch('setStorage', {
                  email: this.formData.email
                })
                this.$store.dispatch('setUser', {
                  data: data
                })
                this.$router.push('/home')
              } else if (response.data === 'repeat') {
                this.$Message.error('用户名或邮箱重复!')
              } else {
                this.$Message.error('数据库连接失败!')
              }
            })
            .catch((err) => {
              this.$Message.error('网络连接失败!')
              console.log(err)
            })
        } else {
          this.$Message.error('请检查输入!')
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
