import Vue from 'vue'
// import VueRouter from 'vue-router'
import Router from 'vue-router'
Vue.use(Router)

// import Login from '../components/Login'
const Login = () => import('../components/Login')
// import Home from '../components/Home'
const Home = () => import('../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import('../components/Welcome')
// import User from '../components/user/User'
const User = () => import('../components/user/User')
// import Rights from '../components/power/Rights'
const Rights = () => import('../components/power/Rights')
// import Roles from '../components/power/Roles'
const Roles = () => import('../components/power/Roles')
// import Cate from '../components/goods/Cate'
const Cate = () => import('../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import('../components/goods/Params')
// import Goods from '../components/goods/Goods'
const Goods = () => import('../components/goods/Goods')
// import Add from '../components/goods/add/Add'
const Add = () => import('../components/goods/add/Add')
// import Order from '../components/order/Order'
const Order = () => import('../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import('../components/report/Report')

// Vue.use(VueRouter)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [{
        path: '/welcome', component: Welcome
      },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      {
        path: '/goods', component: Goods,
      },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
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
