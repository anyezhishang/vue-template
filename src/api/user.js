import axios from 'axios'
import Url from '../utils/url';

// 财务绩效系统登录接口
let apiUserLogin = (ruleForm) => {
  return axios.post(Url.UserLogin, ruleForm)
}

// 财务绩效系统单点登录
let apiUserSso = (accounts) => {
  return axios.get(Url.UserSso, {
    params: {
      accounts
    }
  })
}

// 根据Token获取用户信息
let apiGetTokenUser = (token) => {
  return axios.get(Url.GetTokenUser, {
    params: {
      token
    }
  })
}

export {
  apiUserLogin,
  apiUserSso,
  apiGetTokenUser,
}
