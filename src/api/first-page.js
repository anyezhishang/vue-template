import axios from 'axios'

// 封装Post请求方法
export function apiPost(params) {
  return axios.post('/post', params)
}

// 封装Get请求方法
export function apiGetArticleList(params) {
  return axios.get('/article/list', {
    params
  })
}
