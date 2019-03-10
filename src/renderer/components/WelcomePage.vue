<template>
  <div style="-webkit-app-region: drag" class="container">
    <Tabs class="center"  style="-webkit-app-region: no-drag">
      <TabPane label="登录" style="-webkit-app-region: no-drag">
        <login-panel></login-panel>
      </TabPane>
      <TabPane label="注册" style="-webkit-app-region: no-drag">
        <signup-panel></signup-panel>
      </TabPane>
    </Tabs>
  </div>
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
.container {
  height: 100vh;
}

.center {
  position: absolute;
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
