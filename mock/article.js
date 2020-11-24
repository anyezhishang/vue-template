import Mock from 'mockjs'

const articleObj = Mock.mock({
  'list|20': [{
    'id|+1': 1,
    'date': '@date',
    name: '@cname',
    address: '@address'
  }]
})

export default {
  'get|/test/article/list': (option) => {
    // 可以在这个地方对userInfo进行一系列操作，例如增删改
    // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
    // console.log(option);
    let params = option.url.split('?')[1]
    let Obj = {}
    params.split('&').forEach(item => {
      let arr = item.split('=')
      Obj[arr[0]] = arr[1]
    })
    console.log(Obj);
    let {
      name,
      beginDate,
      endDate
    } = Obj


    let data = JSON.parse(JSON.stringify(articleObj))

    data = data.list.filter(item => {
      if (!name && !beginDate && !endDate) {
        return item
      } else if (!name && item.name == name) {
        return item
      } else if (!beginDate && !endDate && item.date > beginDate && item.date < endDate) {
        return item
      } else {
        return item
      }
    })

    if (data != '') {
      return {
        errorCode: 0,
        errorMessage: '查询成功',
        result: true,
        data
      }
    } else {
      return {
        errorCode: 24050104,
        errorMessage: '查询失败',
        result: false,
        data
      }
    }
  }
}
