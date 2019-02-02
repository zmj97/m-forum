<template>
  <Form ref="formData" :model="formData" :rules="rule">
    <FormItem prop="username">
      <Input type="text" v-model="formData.username" placeholder="用户名" @on-enter="handleSubmit('formData')">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="formData.password" placeholder="密码" @on-enter="handleSubmit('formData')">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formData')">登录</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {

  name: 'LoginPanel',

  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      rule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不少与6位', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('/user/find/login', this.formData)
            .then((response) => {
              if (typeof response.data === 'object') {
                this.$Message.success('登陆成功!')
                this.$store.dispatch('setStorage', {
                  email: this.formData.email
                })
                this.$store.dispatch('setUser', {
                  data: response.data
                })
                this.$router.push('/home')
              } else if (response.data === false) {
                this.$Message.error('用户名或密码错误!')
              } else {
                this.$Message.error('数据库连接失败!')
              }
            })
            .catch((err) => {
              this.$Message.error('网络连接失败!')
              console.error(err)
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
