import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './utils/axios'

import './assets/base.css'

import store from './store/'

import ElementUI from 'element-ui';
import '../theme/index.css';

// 打印
import Print from './utils/vue-print-nb/src/'

Vue.use(ElementUI);
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
