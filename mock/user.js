const Mock = require('mockjs')

const userObj = Mock.mock({
  'userInfo|20': [{
    'id|+1': 1,
    account: '@id',
    password: '@id',
    name: '@cname',
    'age|18-35': 23,
    'job|1': ['前端工程师', '后端工程师', '运维工程师', 'UI工程师', '产品经理', '项目经理', '架构师'],
    icon: '@image(200x200)'
  }]
})

export default {
  'post|/test/login/user': (option) => {
    // 可以在这个地方对userInfo进行一系列操作，例如增删改
    // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
    // console.log(option);
    let paramsObj = JSON.parse(option.body)
    let account = paramsObj.account
    let password = paramsObj.password

    let userData = JSON.parse(JSON.stringify(userObj))

    userData = userData.userInfo.filter(item => {
      if (item.account == account && item.password == password) {
        return item
      }
    })

    if (userData != '') {
      return {
        errorCode: 0,
        errorMessage: '登录成功',
        result: true,
        data: {
          userInfo: userData,
          token: Mock.mock('@guid')
        }
      }
    } else {
      return {
        errorCode: 24050104,
        errorMessage: '帐号或者密码错误',
        result: false,
        data: {
          userInfo: userData
        }
      }
    }
  }
}
