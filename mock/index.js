const Mock = require('mockjs')

Mock.setup({
  timeout: '200-600'
})

let configArray = []

// 使用webpack的require.context()遍历所有mock文件
const files = require.context('.', true, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') {
    return
  }
  configArray = configArray.concat(files(key).default)
})

// 注册所有的mock服务
configArray.forEach(item => {
  for (const [path, data] of Object.entries(item)) {
    let protocol = path.split('|')
    Mock.mock(new RegExp(protocol[1]), protocol[0], data)
  }
})

export default Mock;
