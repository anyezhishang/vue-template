// 根据属性名获取url上的参数值
const getQueryValue = (queryName) => {
  let reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

// 获取当月或者上月
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

// 根据最后一个子节点获取所有父节点（包括子节点）
const treeFindPath = (tree, func, path = []) => {
  if (!tree) return [];
  for (const data of tree) {
    // 根据实际需求可以返回不同内容
    path.push(data.id);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}


// 重写toFixed()方法，js的toFixed()有问题，用的是四舍六入五成双法
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


// js浮点数运算出现误差解决方案
// 1.数据展示类
const strip = (num, precision = 12) => {
  return +parseFloat(num.toPrecision(precision));
}


// 防抖：当持续触发时不执行，触发结束一段时间后再执行
const debounce = (fn, waitTime = 1000) => {
  let timer = null;
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, waitTime)
  }
}

// 节流：当持续触发事件时，每隔固定的一段时间执行一次
const throttle = (fn, waitTime = 1000) => {
  let timer = null;
  let beginTime = Date.now();
  return () => {
    clearTimeout(timer)
    let spaceTime = Date.now() - beginTime
    if (spaceTime >= waitTime) {
      fn()
      beginTime = Date.now()
    } else {
      timer = setTimeout(() => {
        fn()
      }, waitTime)
    }
  }
}


// 根据总条数total获取隔pageSize的数组
const getPageSizeArr = (total, pageSize) => {
  let arr = [];
  for (let i = pageSize; i < total; i += pageSize) {
    arr.push(i);
  }
  arr.push(total);
  return arr;
}


// 判断是否是IE，直接判断浏览器是否支持ActiveX控件，只有IE浏览器里面支持ActiveX控件
const isIE = () => {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}

// 获得当前浏览器
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
 * 根据选择器查找元素
 * @param selector <String> 选择器，可取 #id   .class   element
 * @param context <DOM> 查询上下文，即在该DOM元素后代查找满足选择器条件的元素，默认在 document 中查找
 * @return 返回查找到的元素（根据id查找时返回的是查找到的DOM对象，根据类名或元素名查找时，返回的是 HTMLCollection）
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

export {
  getQueryValue,
  getMonthDate,
  treeFindPath,

  rewriteToFixed,
  strip,

  debounce,
  throttle,

  getPageSizeArr,

  isIE,
  getBrowser,

  _$
}
