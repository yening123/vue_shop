import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
//引入字体图标
import './assets/fonts/iconfont.css'
//要安装element-ui依赖
import ElementUI from 'element-ui'
//导入全局样式表
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//导入treeTable
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

//导入 NProgress 包对应的JS和CSS
import nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截,需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
axios.interceptors.request.use((config) => {
  nprogress.start(); //在request拦截器中，展示进度条 Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

axios.interceptors.response.use(config => {
  nprogress.done(); //在request拦截器中，隐藏进度条 NProgress.start()
  return config;
})
// 导入富文本
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow themed
// import 'quill/dist/quill.bubble.css' // for bubble theme
//将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


