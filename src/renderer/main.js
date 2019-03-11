import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import mathjaxToolbar from 'mathjax-toolbar'
import avatarCropper from 'avatar-cropper'

// 注册所有全局组件
import commons from './components/Common/commons.js'
// 引入所有全局函数
import methods from './assets/methods.js'

Vue.use(methods)
Vue.use(commons)
Vue.use(mathjaxToolbar)
Vue.use(iView)
Vue.use(mavonEditor)
Vue.use(avatarCropper)

// 修改全局axios默认值
axios.defaults.baseURL = 'http://120.79.144.82'
// axios.defaultsaxios.defaults.headers.common['Authorization'] = AUTH_TOKEN
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
