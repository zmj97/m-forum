import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 登录注册界面
      path: '/welcome',
      name: 'welcome-page',
      // vue组件懒加载
      component: resolve => require(['@/components/WelcomePage'], resolve)
    },
    {
      // 主页
      path: '/home',
      component: resolve => require(['@/components/HomePage'], resolve),
      children: [
        {
          path: '',
          redirect: 'home'
        },
        {
          path: 'home',
          component: resolve => require(['@/components/HomePage/HomePanel'], resolve)
        },
        {
          path: 'groups',
          component: resolve => require(['@/components/HomePage/GroupsPanel'], resolve)
        },
        {
          path: 'group/:name',
          component: resolve => require(['@/components/HomePage/GroupPanel'], resolve)
        },
        {
          path: 'new-post',
          component: resolve => require(['@/components/HomePage/NewPostPanel'], resolve)
        },
        {
          path: 'user/:name',
          component: resolve => require(['@/components/HomePage/UserPanel'], resolve)
        },
        {
          path: 'edit',
          component: resolve => require(['@/components/HomePage/EditPanel'], resolve)
        },
        {
          path: 'wiki',
          component: resolve => require(['@/components/HomePage/WikiPanel'], resolve)
        },
        {
          path: 'new-wiki',
          component: resolve => require(['@/components/HomePage/WikiPanel/NewPage'], resolve)
        },
        {
          path: 'notifications',
          component: resolve => require(['@/components/HomePage/NotificationsPanel'], resolve)
        },
        {
          path: 'post',
          component: resolve => require(['@/components/HomePage/HomePanel/PostPart'], resolve)
        },
        {
          path: 'search',
          component: resolve => require(['@/components/HomePage/SearchPanel'], resolve)
        },
        {
          path: 'star',
          component: resolve => require(['@/components/HomePage/StarPanel'], resolve)
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (window.localStorage.username) {
    if (store.state.Users.currentUser.username === '') {
      store.dispatch('setUser', {
        username: window.localStorage.username
      })
    }
    next()
  } else if (to.path !== '/welcome') {
    Vue.prototype.$Message.error('检测到您还未登陆，请先登录')
    next({path: '/welcome'})
  } else {
    next()
  }
})

export default router
