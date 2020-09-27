import axios from 'axios'
import Url from '../utils/url';

// 查询所有指标类型
const apiGetCategoryAll = () => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetCategoryAll)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 查询指标名称
const apiGetKpiNameInfo = (category) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetKpiNameInfo, {
        category
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 查询目标值
const apiGetTargetValueInfo = ({
  category,
  kpiName
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetTargetValueInfo, {
        category,
        kpiName
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 新增指标
const apiInsertKpiTree = ({
  categoryNumber,
  serialNumber,
  category,
  weight,
  kpiName,
  targetValue,
  standard,
  valid
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.InsertKpiTree, {
        categoryNumber,
        serialNumber,
        category,
        weight,
        kpiName,
        targetValue,
        standard,
        valid
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 修改Kpi指标
const apiUpdateKpiTree = ({
  id,
  oldCategory,
  newCategory,
  weight,
  oldKpiName,
  newKpiName,
  kpiName,
  targetValue,
  standard,
  valid
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.UpdateKpiTree, {
        id,
        oldCategory,
        newCategory,
        weight,
        oldKpiName,
        newKpiName,
        kpiName,
        targetValue,
        standard,
        valid
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 删除单个kpi指标
const apiDeleteKpiTree = ({
  id,
  category,
  kpiName,
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.DeleteKpiTree, {
        id,
        category,
        kpiName,
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

export {
  apiGetCategoryAll,
  apiGetKpiNameInfo,
  apiGetTargetValueInfo,
  apiInsertKpiTree,
  apiUpdateKpiTree,
  apiDeleteKpiTree
}
