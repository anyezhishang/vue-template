// 导入Vue
import Vue from 'vue'
// 导入路由对象
import router from '../router/'

// 导入全局axios
import axios from 'axios';

// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

//Nprogress的基本配置
// NProgress.configure({
//   easing: 'ease',
//   speed: 500,
// });


axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/test' : ''
Vue.prototype.$axios = axios;

// 再次创建一个 axios 实例，用于单点登录
const axios2 = axios.create();
Vue.prototype.$axios2 = axios2;

// 添加请求拦截器
axios.interceptors.request.use(async function (config) {
    // NProgress.start()
    // 如果是第一次访问来做登录，也会被拦下来
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {

    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // NProgress.done()
  // console.log('响应成功', response)
  // 登录超时或者token有问题
  if (response.data.errorCode == 1102) {
    // 限制多个并发请求重复弹出消息和跳转路由
    if (router.history.current.path !== '/otherlogin') {
      Vue.prototype.$message.error(response.data.errorMessage)
      router.push('/otherlogin')
    }
  }

  return response;
}, function (error) {
  // NProgress.done()
  // 对响应错误做点什么
  // console.dir(error)

  // 原来该怎么报错还怎么报错
  return Promise.reject(error)
});
