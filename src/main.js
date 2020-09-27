import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './utils/axios'

import './assets/base.css'

import store from './store/'

import ElementUI from 'element-ui';
import '../theme/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
