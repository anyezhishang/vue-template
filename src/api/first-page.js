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
const apiGetArticleList = ({
  name,
  beginDate,
  endDate,
  pageNum,
  pageSize
}) => {
  return axios.get('/article/list', {
    params: {
      name,
      beginDate,
      endDate,
      pageNum,
      pageSize
    }
  })
}

export {
  apiGetArticleList,
  apiPost,
}
