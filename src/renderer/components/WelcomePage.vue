<template>
  <Tabs class="center">
    <TabPane label="登录">
      <login-panel></login-panel>
    </TabPane>
    <TabPane label="注册">
      <signup-panel></signup-panel>
    </TabPane>
  </Tabs>
</template>

<script>
import LoginPanel from './WelcomePage/LoginPanel'
import SignupPanel from './WelcomePage/SignupPanel'

export default {

  name: 'WelcomePage',

  components: {
    LoginPanel,
    SignupPanel
  },

  data () {
    return {
      login: true
    }
  },

  methods: {
    highlightLogin () {
      this.login = true
    },
    highlightSignup () {
      this.login = false
    }
  }
}
</script>

<style lang="css" scoped>
.center {
  position: absolute;
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
