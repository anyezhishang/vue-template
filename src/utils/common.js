/**
 * @desc 根据URL获得参数对象
 * @param {String} url
 * @return {Object} 参数对象
 */
function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @desc 根据属性名获取url上的参数值，只有一个参数时获取不了
 * @param {String} queryName
 * @return {String} 参数值/null
 */
const getQueryValue = (queryName) => {
  let reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}



/**
 * @desc 将对象中的某些属性提取出来
 * @param {Array/Object} originData 源数据
 * @param {Array} propertyArr 属性数组
 * @param {Boolean} isReverse 为false则获取propertyArr数组里所有属性的对象,为true则获取除去propertyArr数组里所有属性的对象
 * @return {Array/Object} 过滤属性后的对象数组/对象
 */
const filterObjProperty = function (originData, propertyArr, isReverse) {
  let type = Object.prototype.toString.call(originData)
  // originData是数组
  if (type == '[object Array]') {
    let newOriginData = JSON.parse(JSON.stringify(originData))
    newOriginData = newOriginData.map(item => {
      return filterObjProperty(item, propertyArr, isReverse)
    })
    return newOriginData
    // originData是对象
  } else {
    let resultObj = {}

    // 获取除去propertyArr数组里所有属性的对象
    if (isReverse) {
      resultObj = JSON.parse(JSON.stringify(originData))
      for (const value of propertyArr) {
        if (resultObj.hasOwnProperty(value)) {
          delete resultObj[value]
        }
      }
      // 获取propertyArr数组里所有属性的对象
    } else {
      for (const value of propertyArr) {
        if (originData.hasOwnProperty(value)) {
          resultObj[value] = originData[value]
        }
      }
    }
    return resultObj
  }
}


/**
 * @desc 将数组进行分页
 * @param {Array} arr 要分页的数组
 * @param {Number} pageSize 每页条数
 * @param {Number} pageNum 页码
 * @return {Object} paginationArr：第一页数据；paginationCount：总条数；paginationTotalPage：总页数
 */
function handlePagination(arr, pageSize = 10, pageNum = 1) {
  // 数组长度
  let paginationArr = []
  let arrLength = arr.length;
  let index = 0;
  for (let i = 0; i < arrLength; i++) {
    // 可以被 10 整除
    if (i % pageSize === 0 && i !== 0) {
      paginationArr.push(arr.slice(index, i));
      index = i;
    };
    if ((i + 1) === arrLength) {
      paginationArr.push(arr.slice(index, (i + 1)));
    }
  };
  return {
    paginationArr: paginationArr[pageNum - 1],
    paginationCount: arr.length,
    paginationTotalPage: paginationArr.length
  }
}



/**
 * @desc 获取当月或者上月年月数据
 * @param {String} type prev（上月）或者不传
 * @return {String} yyyy-MM格式的日期
 */
const getMonthDate = (type) => {
  const date = new Date();
  // day为31时, 如果上一个月没有31号会出错, 所以直接设置为1号
  date.setDate(1);

  if (type === 'prev') {
    // 获取系统前一个月的时间
    date.setMonth(date.getMonth() - 1);
  }

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  // let day = 1;

  month = month > 9 ? month : "0" + month;
  // day = day > 9 ? day : "0" + day;
  return `${year}-${month}`;
}

/**
 * @desc 获取前天、昨天、今天、明天、后天、大后天的日期
 * @param {Number} AddDayCount 自然数, 如1, -1, 0等
 * @return {String} yyyy-MM-dd格式的日期
 */
const getDateStr = function (AddDayCount) {
  const date = new Date()
  date.setDate(date.getDate() + AddDayCount) //获取AddDayCount天后的日期
  let year = date.getFullYear()
  let month = date.getMonth() + 1 //获取当前月份的日期
  let day = date.getDate()

  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return year + '-' + month + '-' + day
}

/**
 * @desc 日期格式化
 * @param {Date} time 日期
 * @param {String} pattern 正则表达式，如{y}-{m}-{d}
 * @return {String} 返回格式化后的日期
 */
const parseTime = function (time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @desc 得到几天前的日期
 * @param {Number String} n 天数, 数字或字符串
 * @return {String} 返回yyyy-MM-dd格式的日期
 */
const getBeforeDate = function (n) {
  var n = n
  var d = new Date()
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  var s
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  s =
    year +
    '-' +
    (mon < 10 ? '0' + mon : mon) +
    '-' +
    (day < 10 ? '0' + day : day)
  return s
}

/**
 * @desc 获取本年的开始日期、结束日期（昨天）
 * @return {String} 包括开始日期和结束日期的对象
 */
const getYearBeginEndDate = function () {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = currentDate.getDate()

  currentMonth = currentMonth > 9 ? currentMonth : '0' + currentMonth
  currentDay = currentDay > 9 ? currentDay : '0' + currentDay

  if (currentMonth == 1 && currentDay == 1) {
    return {
      beginDate: `${currentYear - 1}-01-01`,
      endDate: `${currentYear - 1}-12-31`
    }
  } else {
    return {
      beginDate: `${currentYear}-01-01`,
      endDate: getBeforeDate(1)
    }
  }
}

/**
 * @desc 获取本周的开始日期、结束日期（昨天）
 * @return {String} 包括开始日期和结束日期的对象
 */
const getWeekBeginEndDate = function () {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = currentDate.getDate()
  let currentWeek = currentDate.getDay()

  currentMonth = currentMonth > 9 ? currentMonth : '0' + currentMonth
  currentDay = currentDay > 9 ? currentDay : '0' + currentDay

  if (currentWeek == 1) {
    return {
      beginDate: getBeforeDate(7),
      endDate: getBeforeDate(1)
    }
  } else {
    let beginDate = ''
    if (currentWeek == 0) {
      beginDate = getBeforeDate(6)
    } else {
      beginDate = getBeforeDate(currentWeek - 1)
    }
    return {
      beginDate,
      endDate: getBeforeDate(1)
    }
  }
}

/**
 * @desc 获取某月的最后一天日期
 * @param {String} year yyyy格式的日期，如2021
 * @param {String} month MM或M格式的日期，如08或8
 * @return {String} 返回某月的最后一天日期，yyyy-MM格式
 */
const getMonthLastDate = function (year, month) {
  // day的范围为1~31中的值，0是上个月最后一天
  let date = new Date(year, month, 0)
  return `${year}-${month}-${date.getDate()}`
}

/**
 * @desc 跟据年月返回开始日期和结束日期(本年本月昨天或者其他月最后一天)
 * @param {String} yearMonth yyyy-MM格式的日期，如2021-08, 不传默认获取当前年月
 * @return {Object} 返回包括开始日期和结束日期的对象
 */
const getBeginDateOrEndDate = function (yearMonth) {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = currentDate.getDate()

  let dateArr = yearMonth ? yearMonth.split('-') : [currentDate.getFullYear(), currentDate.getMonth() + 1]
  // 等于本年本月，返回昨天的日期
  if (
    dateArr[0] == currentYear &&
    dateArr[1] == currentMonth
  ) {
    let date = new Date(
      dateArr[0],
      dateArr[1] - 1,
      currentDay - 1
    )

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    day = day > 9 ? day : '0' + day
    month = month > 9 ? month : '0' + month
    return {
      beginDate: `${year}-${month}-01`,
      endDate: `${year}-${month}-${day}`
    }
    // 不等于本年本月，返回此月的最后一天日期
  } else {
    return {
      beginDate: `${yearMonth}-01`,
      endDate: getMonthLastDate(dateArr[0], dateArr[1])
    }
  }
}

/**
 * @desc 格式化星期几
 * @param {String} date yyyy-MM-dd格式的日期，如2021-09-01
 * @return {String} 返回日期对应星期几
 */
const getWeekForDate = function (date) {
  let week = new Date(date).getDay()
  switch (week) {
    case 0:
      return '星期日'
      break
    case 1:
      return '星期一'
      break
    case 2:
      return '星期二'
      break
    case 3:
      return '星期三'
      break
    case 4:
      return '星期四'
      break
    case 5:
      return '星期五'
      break
    case 6:
      return '星期六'
      break

    default:
      return ''
      break
  }
}

/**
 * @desc 获取当月有几周 以及 各周的开始结束日期
 * @param {Number/String} year 年，yyyy格式
 * @param {Number/String} month 月，MM格式
 * @return {Array} 返回当月有几周 以及 各周的开始结束日期的对象数组
 */
const getWeekData = function (year, month) {
  var new_year = year //取当前的年份
  var new_month = month++ //取下一个月的第一天，方便计算（最后一天不固定）
  var weekDay = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日'
  ]

  if (month > 12) {
    new_month -= 12 //月份减
    new_year++ //年份增
  }
  var first_date = new Date(new_year, new_month, 1) //取当年当月中的第一天-时间格式
  var last_Data = new Date(
    first_date.getTime() - 1000 * 60 * 60 * 24
  ).getDate() //获取当月最后一天日期

  // console.log('最后一天日期' + last_Data + '号')

  if (month > 12) {
    new_month += 12 //月份加
    new_year-- //年份减
  }

  //当月第一天是周几
  var firstzhouji =
    new Date(new_year + '/' + new_month + '/' + 1).getDay() == 0
      ? '星期日'
      : weekDay[new Date(new_year + '/' + new_month + '/' + 1).getDay() - 1]
  //当月最后一天是周几
  var lastzhouji =
    new Date(new_year + '/' + new_month + '/' + last_Data).getDay() == 0
      ? '星期日'
      : weekDay[
      new Date(new_year + '/' + new_month + '/' + last_Data).getDay() -
      1
      ]

  var firsttime = '' //第一周有几天
  if (firstzhouji == '星期一') {
    firsttime = 7
  }
  if (firstzhouji == '星期二') {
    firsttime = 6
  }
  if (firstzhouji == '星期三') {
    firsttime = 5
  }
  if (firstzhouji == '星期四') {
    firsttime = 4
  }
  if (firstzhouji == '星期五') {
    firsttime = 3
  }
  if (firstzhouji == '星期六') {
    firsttime = 2
  }
  if (firstzhouji == '星期日') {
    firsttime = 1
  }
  // console.log(
  //   '本月第一天“' + firstzhouji + '”本月第一周有“' + firsttime + '”天'
  // )

  var lasttime = '' //最后一周有几天
  if (lastzhouji == '星期一') {
    lasttime = 1
  }
  if (lastzhouji == '星期二') {
    lasttime = 2
  }
  if (lastzhouji == '星期三') {
    lasttime = 3
  }
  if (lastzhouji == '星期四') {
    lasttime = 4
  }
  if (lastzhouji == '星期五') {
    lasttime = 5
  }
  if (lastzhouji == '星期六') {
    lasttime = 6
  }
  if (lastzhouji == '星期日') {
    lasttime = 7
  }
  // console.log(
  //   '本月最后一天“' + lastzhouji + '”本月最后一周有“' + lasttime + '”天'
  // )

  // 前后两周  加上 剩余周数  得出总周数
  var contime = 2 + (last_Data - lasttime - firsttime) / 7

  //得出每周对应的日期
  var zhouArry = []


  //日期增加 接受两个参数， 传入的时间，传入时间增加的天数
  function addDate(date, days) {
    if (days == undefined || days == '') {
      days = 1
    }

    var currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() + days)
    var currentMonth = currentDate.getMonth() + 1
    var currentDay = currentDate.getDate()

    currentDay = currentDay > 9 ? currentDay : '0' + currentDay
    currentMonth = currentMonth > 9 ? currentMonth : '0' + currentMonth

    return currentDate.getFullYear() + '-' + currentMonth + '-' + currentDay
  }


  new_month = new_month > 9 ? new_month : '0' + new_month

  for (var i = 1; i <= contime; i++) {
    var strTime = ''
    var lastTime = ''
    var dayFormat = ''
    if (i == 1) {
      strTime = year + '-' + new_month + '-01'

      dayFormat = (1 + firsttime - 1)
      dayFormat = dayFormat > 9 ? dayFormat : '0' + dayFormat
      lastTime = year + '-' + new_month + '-' + dayFormat
    } else if (i == contime) {
      dayFormat = (last_Data - lasttime + 1)
      dayFormat = dayFormat > 9 ? dayFormat : '0' + dayFormat
      strTime = year + '-' + new_month + '-' + dayFormat

      last_Data = last_Data > 9 ? last_Data : '0' + last_Data
      lastTime = year + '-' + new_month + '-' + last_Data
    } else {
      strTime = addDate(zhouArry[zhouArry.length - 1].endTime, 1)
      lastTime = addDate(zhouArry[zhouArry.length - 1].endTime, 7)
    }


    zhouArry.push({
      weekNum: i,
      beginTime: strTime,
      endTime: lastTime
    })
  }
  return zhouArry
}

/**
 * @desc 获得两个日期之间的天数
 * @param {String} date1 开始日期，如：2022-01-13
 * @param {String} date2 结束日期
 * @return {Number} 相差的天数
 */
const daysDistance = (date1, date2) => {
  //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
  date1 = Date.parse(date1)
  date2 = Date.parse(date2)
  //计算两个日期之间相差的毫秒数
  var distance = date2 - date1
  //毫秒数除以一天的毫秒数,就得到了天数
  var days = Math.floor(distance / (24 * 3600 * 1000))
  return days
}



/**
 * @desc 重写toFixed()方法，js的toFixed()有问题，用的是四舍六入五成双法
 * @param {Number} d 保留几位小数
 * @return {Number} 保留d位小数的数字
 * @example 调用示例：num.toFixed(2)
 */
const rewriteToFixed = () => {
  // d表示需要保留几位小数
  Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (
      new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)
    ) {
      var s1 = "0" + RegExp.$2,
        pm = RegExp.$1,
        a = RegExp.$3.length,
        b = true;
      if (a == d + 2) {
        a = s1.match(/\d/g);
        if (parseInt(a[a.length - 1]) > 4) {
          for (var i = a.length - 2; i >= 0; i--) {
            a[i] = parseInt(a[i]) + 1;
            if (a[i] == 10) {
              a[i] = 0;
              b = i != 1;
            } else break;
          }
        }
        s1 = a
          .join("")
          .replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
      }
      if (b) s1 = s1.substr(1);
      return (pm + s1).replace(/\.$/, "");
    }
    return this + "";
  };
}

/**
 * @desc 1.数据展示类：js浮点数运算出现误差解决方案
 * @param {Number} num 出现误差的数字
 * @param {Number} precision 截取的长度（一般默认）
 * @return {Number} 消除误差的数字
 */
const strip = (num, precision = 12) => {
  return +parseFloat(num.toPrecision(precision));
}

/**
 * @desc 把数字每隔三位加逗号分开（兼容负数，小数）
 * @param {Number/String} num 数字字符串或者数字
 * @return {String} 返回格式化后的字符串
 */
const toThousands = function (num) {
  var num = (num || 0).toString(),
    re = /\d{3}$/,
    result = "";
  var point = ''
  if (num.indexOf(".") !== -1) {
    point = num.substring(num.indexOf("."))
    num = parseInt(num)

  }
  while (re.test(num)) {
    result = RegExp.lastMatch + result;
    if (num !== RegExp.lastMatch) {
      result = "," + result;
      num = RegExp.leftContext;
    } else {
      num = "";
      break;
    }
  }
  if (num) {
    result = num + result;
  }

  function _(result) {
    return result.replace("-,", "-")
  }
  function __(result) {
    if (result[0] === ",") {
      result = result.substring(1)
    }
    return result
  }
  function ___(result) {
    if (result[0] === ".") {
      result = "0" + result
    }
    return result
  }
  return ___(__(_(result) + point));
}

/**
 * @desc 把数字每隔三位加逗号分开
 * @param {String} str 数字字符串或者数字
 * @return {String} 返回格式化后的字符串
 */
const numFormat = function (str) {
  var str = '' + str
  var newStr = ''
  var count = 0

  if (str.indexOf('.') == -1) {
    for (var i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    //str = newStr + ".00"; //自动补小数点后两位
    str = newStr
  } else {
    for (var i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr //逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
  }
  return str
}

/**
 * @desc 转换字符串，undefined,null等转化为""
 * @param {String} number 字符串
 * @return {String} ""或不变
 */
const parseStrEmpty = function (str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * @desc 转换数字，undefined,null等转化为0
 * @param {Number} number 数字
 * @return {number} 0或不变
 */
const parseNumberZero = function (number) {
  if (!number || number == undefined || number == null) {
    return 0;
  }
  return number;
}



/**
 * @desc 防抖：当持续触发时不执行，触发结束一段时间后再执行
 * @param {Function} fn 要触发的事件
 * @param {Number} waitTime 触发时间间隔（毫秒）
 * @return {Function} 返回定时执行的函数
 * @example 调用示例
 *  methods: {
 *    change: debounce(function() {
 *      this.getVerifyCode();
 *    }, 1000),
 *  }
 */
const debounce = (fn, waitTime = 1000) => {
  let timer = null;
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, waitTime)
  }
}

/**
 * @desc 节流：当持续触发事件时，每隔固定的一段时间执行一次
 * @param {Function} fn 要触发的事件
 * @param {Number} waitTime 触发时间间隔（毫秒）
 * @return {Function} 返回定时执行的函数
 * @example 调用示例
 *  methods: {
 *    change: throttle(function() {
 *      this.getVerifyCode();
 *    }, 1000),
 *  }
 */
const throttle = (fn, waitTime = 1000) => {
  let timer = null;
  let beginTime = Date.now();
  return function () {
    clearTimeout(timer)
    let spaceTime = Date.now() - beginTime
    if (spaceTime >= waitTime) {
      fn.apply(this, arguments)
      beginTime = Date.now()
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, waitTime)
    }
  }
}


/**
 * @desc 根据总条数total获取隔pageSize的数组
 * @param {Number} total 总条数
 * @param {Number} pageSize 每页条数
 * @return {Array} 返回从pageSize开始，每隔pageSize的数组（数组最后一个元素为total）
 */
const getPageSizeArr = (total, pageSize) => {
  let arr = [];
  for (let i = pageSize; i < total; i += pageSize) {
    arr.push(i);
  }
  arr.push(total);
  return arr;
}



/**
   * @desc DOM加载完成事件
   * @param {Function} DOM加载完成后需要执行的回调函数
   */
const ready = function (fn) {
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      fn();
    }, false);
  }

  // 如果IE
  else if (document.attachEvent) {
    // 确保当页面是在iframe中加载时，事件依旧会被安全触发
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState == 'complete') {
        document.detachEvent('onreadystatechange', arguments.callee);
        fn();
      }
    });

    // 如果是IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
    if (document.documentElement.doScroll && typeof window.frameElement === "undefined") {
      try {
        document.documentElement.doScroll('left');
      } catch (error) {
        return setTimeout(arguments.callee, 20);
      };
      fn();
    }
  }
}

/**
 * @desc 判断是否移动端
 * @return {Boolean} 返回true/false
 */
const isMobile = function () {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true // 移动端
  } else {
    return false // PC端
  }
}

/**
 * @desc 判断是否是IE，直接判断浏览器是否支持ActiveX控件，只有IE浏览器里面支持ActiveX控件
 * @return {Boolean} 返回true/false
 */
const isIE = () => {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}

/**
 * @desc 获得当前浏览器
 * @return {String} 返回当前浏览器名称
 */
const getBrowser = () => {
  let userAgent = navigator.userAgent;

  // 顺序在这里很重要，对于未列出的浏览器，可能会误报
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    return "Opera";
    //"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
  } else if (userAgent.indexOf("Trident") > -1) {
    return "IE";
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    return "Unknown";
  }
}


/**
 * @desc 根据选择器查找元素
 * @param {String} selector 选择器，可取 #id   .class   element
 * @param {DOM} context 查询上下文，即在该DOM元素后代查找满足选择器条件的元素，默认在 document 中查找
 * @return {DOM} 返回查找到的元素（根据id查找时返回的是查找到的DOM对象，根据类名或元素名查找时，返回的是 HTMLCollection）
 */
const _$ = (selector, context) => {
  // 如果未传递 context 参数，则默认取 document 值
  context = context || document;
  //通过判断selector字符串第一个字符来判别    #id   .class   element
  if (selector.charAt(0) === "#") //通过id查找
    return context.getElementById(selector.slice(1));
  //selector.slice(1)截取字符串除去第一个字符后面的字符串，如#id-->id
  if (selector.charAt(0) === ".") //通过classname查找
    //调用byClassName()解决兼容
    return byClassName(selector.slice(1), context);
  else //元素名查找
    return context.getElementsByTagName(selector);
}

const byClassName = (className, context) => {
  // 默认在 document 文档中查找
  context = context || document;

  /* 支持使用 getElementsByClassName 方法，则直接使用 */
  if (context.getElementsByClassName)
    return context.getElementsByClassName(className);

  /* 不支持使用 getElementsByClassName 方法 */
  // 保存所有查找到元素的数组
  var _result = [];
  // 将查询上下文后代中所有元素查找出来
  var _tags = context.getElementsByTagName("*");
  // 遍历迭代所有元素
  for (var i = 0, len = _tags.length; i < len; i++) {
    // 获取当前遍历到元素的所有类名
    var _classNames = _tags[i].className.split(" "); //将有多个类名同时存在时分割成新数组存入_classNames[] 数组中
    // 遍历所有类名
    for (var j = 0, l = _classNames.length; j < l; j++) {
      if (_classNames[j] === className) { // 当前元素的某个类名与待查找的类名一致
        // 说明当前遍历到的元素是需要查找的元素之一
        _result.push(_tags[i]);
        break;
      }
    }
  }

  // 返回所有查找到的结果
  return _result;
}



/**
 * @desc 通用下载文件方法
 * @param {String} fileName 文件名，包括后缀
 * @return {null} null
 */
const downloadFile = (fileName) => {
  let el = document.createElement('a')

  el.href =
    process.env.VUE_APP_BASEURL +
    '/datacenter/assets/files/' +
    encodeURIComponent(fileName)

  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

/**
 * @desc 导出Excel
 * @param {String} table 选择器，取id名
 * @param {String} name 文件名（会自动加上当前日期）
 * @param {String} downlink 选择器，取id名（未使用）
 * @return {DOM} 无
 */
const toExcel = (function () {
  var date = new Date();
  var currDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  if (getBrowser() == "IE") {
    return function (table, name, downlink) {
      var curTbl = document.getElementById(table);
      var oXL = new ActiveXObject("Excel.Application");
      var oWB = oXL.Workbooks.Add();
      var xlsheet = oWB.Worksheets(1);
      var sel = document.body.createTextRange();
      sel.moveToElementText(curTbl);
      sel.select();
      sel.execCommand("Copy");
      xlsheet.Paste();
      oXL.Visible = true;
      try {
        var fname = oXL.Application.GetSaveAsFilename(
          "Excel.xls",
          "Excel Spreadsheets (*.xls), *.xls"
        );
      } catch (e) {
        //console.log("Nested catch caught " + e);
      } finally {
        // document.getElementById(downlink).href = uri + base64(format(template, ctx));
        // document.getElementById(downlink).download = name+ currDate + ".xls";
        // document.getElementById(downlink).click();
        var savename = name + currDate + ".xls";

        oWB.SaveAs(savename || fname);
        oWB.Close((savechanges = false));
        oXL.Quit();
        oXL = null;
        idTmr = window.setInterval("Cleanup();", 1);
      }
    };
  } else {
    var uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
    return function (table, name) {
      if (!table.nodeType) table = document.getElementById(table);
      var ctx = {
        worksheet: name || "Worksheet",
        table: table.innerHTML
      };

      let el = document.createElement("a");
      el.download = name + currDate + ".xls";
      el.href = uri + base64(format(template, ctx));
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    };
  }

})()



/**
 * @desc 监听dom元素大小变化
 * @param {Dom} dom dom元素
 * @param {Function} fn dom元素大小变化的回调函数
 * @return {undefined} 无
 */
const setDomResizeEvent = function (dom, fn) {
  try {
    let resizeObserver = new ResizeObserver(fn)
    resizeObserver.observe(dom)
  } catch (e) {
    console.log(e)
  }
}



/**
 * 构造树型结构数据
 * @param {Array} data 数据源
 * @param {String} id id字段 默认 'id'
 * @param {String} parentId 父节点字段 默认 'parentId'
 * @param {String} children 孩子节点字段 默认 'children'
 * @param {Number} rootId 根Id 默认 0
 */
const handleTree = function (data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || Math.min.apply(Math, data.map(item => {
    return item[parentId]
  })) || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}

/**
 * @desc 根据最后一个子节点获取所有父节点id（包括子节点）
 * @param {Array} tree 整个树结构
 * @param {Function} func 例：data.id == scope.row.kpiId，返回子节点id和所有的父节点id
 * @param {Array} path 保存各节点的值
 * @return {Array} 满足条件的子节点属性和所有的父节点属性
 */
const treeFindPath = (tree, func, path = []) => {
  if (!tree) {
    return [];
  }
  for (const data of tree) {
    // 根据实际需求可以返回不同内容
    path.push(data.id);
    if (func(data)) {
      return path;
    }
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}


export {
  param2Obj,
  getQueryValue,


  filterObjProperty,


  handlePagination,


  getPageSizeArr,


  ready,
  isMobile,
  isIE,
  getBrowser,


  _$,


  downloadFile,
  toExcel,


  getMonthDate,
  getDateStr,
  parseTime,
  getBeforeDate,
  getYearBeginEndDate,
  getWeekBeginEndDate,
  getMonthLastDate,
  getBeginDateOrEndDate,
  getWeekForDate,
  getWeekData,
  daysDistance,


  rewriteToFixed,
  strip,
  toThousands,
  numFormat,
  parseStrEmpty,
  parseNumberZero,


  debounce,
  throttle,


  setDomResizeEvent,


  handleTree,
  treeFindPath
}