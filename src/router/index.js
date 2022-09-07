import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login/'
import Home from '@/views/home/'
import NotFound from '@/views/not-found/'

import FirstPage from '@/views/home/first-page/'
import SecondPage from '@/views/home/second-page/'
import ThirdPage from '@/views/home/third-page/'
import FourthPage from '@/views/home/fourth-page/'

// import store from '@/store/'
// import {
//   getQueryValue
// } from '@/utils/common'

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/login'
},
{
  name: 'Login',
  path: '/login',
  component: Login,
  meta: {
    title: "登录"
  }
},
{
  name: 'OtherLogin',
  path: "/otherlogin",
  component: Login,
  meta: {
    title: "登录"
  }
},
{
  name: 'Home',
  path: '/home',
  redirect: '/firstpage',
  component: Home,
  children: [
    {
      name: 'FirstPage',
      path: '/firstpage',
      component: FirstPage,
      meta: {
        title: "第一个页面"
      }
    },
    {
      name: 'SecondPage',
      path: '/secondpage',
      component: SecondPage,
      meta: {
        title: "第二个页面"
      }
    },
    {
      name: 'ThirdPage',
      path: '/thirdpage',
      component: ThirdPage,
      meta: {
        title: "第三个页面"
      }
    },
    {
      name: 'FourthPage',
      path: '/fourthpage',
      component: FourthPage,
      meta: {
        title: "第四个页面"
      }
    },
  ]
},
{
  path: '*',
  component: NotFound
}
]


const router = new VueRouter({
  mode: 'history',
  base: '/template/',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next();
    // } else {
    //   // 单点登录
    //   let token = getQueryValue('token')
    //   if (token) {
    //     let res = await Vue.prototype.$axios2({
    //       url: '/api-financialperformance/senvUser/getbytoken',
    //       method: 'GET',
    //       headers: {
    //         Authorization: token
    //       },
    //       params: {
    //         token
    //       }
    //     })
    //     if (res.data.errorCode === 0 && res.data.data.length > 0) {
    //       store.commit("changeUserInfo", res.data.data);
    //       window.sessionStorage.setItem("fpmtoken", token)
    //     }

    //     // 修改url不刷新页面
    //     let clearParamsUrl = window.location.href.split('?')[0];
    //     window.history.replaceState({}, '', clearParamsUrl)

    //     next('/home')

  } else if (window.sessionStorage.getItem('userInfo')) {
    next()
  } else {
    Vue.prototype.$message.error("请先登录！")
    next("/login")
  }
  // }

})

export default router
