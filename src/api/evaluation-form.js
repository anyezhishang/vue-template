import axios from 'axios'
import Url from '../utils/url';

// 封装请求方法1
const apiPost = ({
  param1,
  param2
}) => {
  return axios.post(Url.Post, {
    param1,
    param2
  })
}

// 封装请求方法2
const apiGet = ({
  param1,
  param2
}) => {
  return
  axios.get(Url.Get, {
    params: {
      param1,
      param2
    }
  })
}

export {
  apiPost,
  apiGet,
}
