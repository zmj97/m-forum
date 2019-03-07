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
      component: require('@/components/WelcomePage').default
    },
    {
      // 主页
      path: '/home',
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
        },
        {
          path: 'wiki',
          component: require('@/components/HomePage/WikiPanel').default
        },
        {
          path: 'new-wiki',
          component: require('@/components/HomePage/WikiPanel/NewPage').default
        },
        {
          path: 'notifications',
          component: require('@/components/HomePage/NotificationsPanel').default
        },
        {
          path: 'post',
          component: require('@/components/HomePage/HomePanel/PostPart').default
        },
        {
          path: 'search',
          component: require('@/components/HomePage/SearchPanel').default
        },
        {
          path: 'star',
          component: require('@/components/HomePage/StarPanel').default
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
