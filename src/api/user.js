import axios from 'axios'

// 登录接口
export function apiUserLogin(params) {
  return axios.post('/login/user', params)
}
