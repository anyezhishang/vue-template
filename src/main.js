import Vue from 'vue'
import 'normalize.css/normalize.css' // 一个现代的替代CSS重置
import App from './App.vue'
import router from './router'

import './utils/axios'

import store from './store/'

import ElementUI from 'element-ui'
import '../theme/index.css'

import '../mock/index'


Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
