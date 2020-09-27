import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/'
import Home from '../views/home/'
import NotFound from '../views/not-found/'
import TargetLibraryManage from '../views/home/target-library-manage/'
import EvaluationForm from '../views/home/evaluation-form/'
import EventRecord from '../views/home/event-record/'
import EvaluationSummaryForm from '../views/home/evaluation-summary-form/'

import store from '../store/'
import {
  getQueryValue
} from '../utils/common'
import Url from '../utils/url.js'

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
        redirect: '/eventrecord'
      },
      {
        path: '/targetlibrarymanage',
        name: 'TargetLibraryManage',
        component: TargetLibraryManage,
        meta: {
          title: "指标库管理"
        }
      },
      {
        path: '/evaluationform',
        name: 'EvaluationForm',
        component: EvaluationForm,
        meta: {
          title: "考核表"
        }
      },
      {
        path: '/eventrecord',
        name: 'EventRecord',
        component: EventRecord,
        meta: {
          title: "事件登记"
        }
      },
      {
        path: '/evaluationsummaryform',
        name: 'EvaluationSummaryForm',
        component: EvaluationSummaryForm,
        meta: {
          title: "考核汇总表"
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
  } else {
    // 单点登录
    let token = getQueryValue('token')
    if (token) {
      let res = await Vue.prototype.$axios2({
        url: Url.GetTokenUser,
        method: 'GET',
        headers: {
          Authorization: token
        },
        params: {
          token
        }
      })
      // console.log(res);
      if (res.data.errorCode === 0 && res.data.data != null) {
        store.commit("changeUserInfo", res.data.data);
        window.sessionStorage.setItem("fpmtoken", token)
      }

      // 修改url不刷新页面
      let clearParamsUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, '', clearParamsUrl)

      next('/home')

    } else if (window.sessionStorage.getItem('userInfo')) {
      next()
    } else {
      Vue.prototype.$message.error("请先登录！")
      next("/login")
    }
  }

})

export default router
