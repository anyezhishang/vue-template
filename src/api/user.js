import axios from 'axios'
import Url from '../utils/url';

// 财务绩效系统登录接口
const apiUserLogin = (ruleForm) => {
  return axios.post('/login/user', ruleForm)
}


export {
  apiUserLogin
}
