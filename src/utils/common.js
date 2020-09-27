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

export {
  getQueryValue,
  getMonthDate,
  treeFindPath
}
