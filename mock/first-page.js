import Mock from 'mockjs'

import {
  param2Obj,
  handlePagination
} from '@/utils/common'

const articleObj = Mock.mock({
  'list|88': [{
    'id|+1': 1,
    'date': '@date',
    name: '@cname',
    address: '@county(true)'
  }]
})

export default {
  'get|/article/list': (option) => {
    // 可以在这个地方对userInfo进行一系列操作，例如增删改
    // option 指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性
    // console.log(option);

    let {
      name,
      beginDate,
      endDate,
      pageNum,
      pageSize
    } = param2Obj(option.url)

    let data = JSON.parse(JSON.stringify(articleObj)).list
    // 日期升序排序
    data.sort((a, b) => {
      return a.date.split('-').join('') - b.date.split('-').join('')
    })

    data = data.filter(item => {
      if (!name && !beginDate && !endDate) {
        return item
      } else if (name && !beginDate && !endDate) {
        return item.name.includes(name)
      } else if (beginDate && endDate && !name) {
        return (item.date > beginDate && item.date < endDate)
      } else {
        return item.name.includes(name) && (item.date > beginDate && item.date < endDate)
      }
    })

    let {
      paginationArr,
      paginationCount,
      paginationTotalPage
    } = handlePagination(data, pageSize, pageNum)

    return {
      errorCode: 0,
      errorMessage: '查询成功',
      result: true,
      data: {
        list: paginationArr,
        count: paginationCount,
        pageNum: !pageNum ? 1 : Number(pageNum),
        pageSize: data.length,
        totalPage: paginationTotalPage
      }
    }
  }
}
