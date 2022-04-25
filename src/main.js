import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//引入字体图标
import './assets/fonts/iconfont.css'
//要安装element-ui依赖
import ElementUI from 'element-ui'
//导入全局样式表
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截,需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
