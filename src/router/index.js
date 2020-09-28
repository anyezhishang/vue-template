import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/login/'
import Home from '../views/home/'
import NotFound from '../views/not-found/'

import FirstPage from '../views/home/first-page/'
import SecondPage from '../views/home/second-page/'
import ThirdPage from '../views/home/third-page/'
import FourthPage from '../views/home/fourth-page/'

// import store from '../store/'
// import {
//   getQueryValue
// } from '../utils/common'
// import Url from '../utils/url.js'

Vue.use(VueRouter)

const routes = [{
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
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
    path: '/home',
    name: 'Home',
    component: Home,
    children: [{
        path: '/home',
        redirect: '/firstPage'
      },
      {
        path: '/firstpage',
        name: 'FirstPage',
        component: FirstPage,
        meta: {
          title: "第一个页面"
        }
      },
      {
        path: '/secondpage',
        name: 'SecondPage',
        component: SecondPage,
        meta: {
          title: "第二个页面"
        }
      },
      {
        path: '/thirdpage',
        name: 'ThirdPage',
        component: ThirdPage,
        meta: {
          title: "第三个页面"
        }
      },
      {
        path: '/fourthpage',
        name: 'FourthPage',
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
  base: '/fpm/',
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
    //       url: Url.GetTokenUser,
    //       method: 'GET',
    //       headers: {
    //         Authorization: token
    //       },
    //       params: {
    //         token
    //       }
    //     })
    //     // console.log(res);
    //     if (res.data.errorCode === 0 && res.data.data != null) {
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
