import Vue from 'vue'
// import VueRouter from 'vue-router'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components//user/User'

// Vue.use(VueRouter)
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [{
        path: '/welcome', component: Welcome
      },
      { path: '/users', component: User }
      ]
    }
  ]
})

//防止没登录直接进入登录内容
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next();
})

export default router
