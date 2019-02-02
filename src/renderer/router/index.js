import Vue from 'vue'
import Router from 'vue-router'

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
      component: require('@/components/WelcomePage').default
    },
    {
      // 主页
      path: '/home',
      name: 'home-page',
      component: require('@/components/HomePage').default,
      children: [
        {
          path: '',
          redirect: 'home'
        },
        {
          path: 'home',
          component: require('@/components/HomePage/HomePanel').default
        },
        {
          path: 'groups',
          component: require('@/components/HomePage/GroupsPanel').default
        },
        {
          path: 'group/:name',
          component: require('@/components/HomePage/GroupPanel').default
        },
        {
          path: 'new-post',
          component: require('@/components/HomePage/NewPostPanel').default
        },
        {
          path: 'user/:name',
          component: require('@/components/HomePage/UserPanel').default
        },
        {
          path: 'edit',
          component: require('@/components/HomePage/EditPanel').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (window.localStorage.email) {
    next()
  } else if (to.path !== '/welcome') {
    Vue.prototype.$Message.error('检测到您还未登陆，请先登录')
    next({path: '/welcome'})
  } else {
    next()
  }
})

export default router