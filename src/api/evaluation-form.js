import axios from 'axios'
import Url from '../utils/url';

// 个人自评
const apiGetSelfAduit = ({
  examineDate,
  examineId
}) => {
  return axios.post(Url.GetSelfAduit, {
    examineDate,
    examineId
  })
}

// 查询考核主表列表
const apiGetEvaluationList = ({
  examineId,
  requestData,
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetEvaluationList, {
        examineId,
        requestData,
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 查询考核明细
const apiGetItemList = ({
  examineDate,
  name,
}) => {
  return new Promise((resolve, reject) => {
    axios.get(Url.GetItemList, {
        params: {
          examineDate,
          name,
        }
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 新增考核明细
const apiInsertEvaluationItem = ({
  evaluationId,
  kpiId,
  selfScore,
  levelOneScore,
  levelTwoScore
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.InsertEvaluationItem, {
        evaluationId,
        kpiId,
        selfScore,
        levelOneScore,
        levelTwoScore
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 修改考核明细的指标id
const apiUpdateEvaluationItem = ({
  evaluationId,
  id,
  kpiId
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.UpdateEvaluationItem, {
        evaluationId,
        id,
        kpiId
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 删除单个明细
const apiDeleteEvaluationItem = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(Url.DeleteEvaluationItem, {
        params: {
          id,
        }
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 修改考核明细
const apiUpdateEvaluationBatchItem = ({
  examineDate,
  id,
  status,
  requestData
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.UpdateEvaluationBatchItem, {
        examineDate,
        id,
        status,
        requestData
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 获取事件明细
const apiGetIncidentInfo = ({
  examineDate,
  partyId,
  kpiId,
  status
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetIncidentInfo, {
        examineDate,
        partyId,
        kpiId,
        status
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 三级分组
const apiGetKpiTree = () => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetKpiTree)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 修改考核主表状态
const apiUpdateEvaluation = ({
  id,
  status
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.UpdateEvaluation, {
        id,
        status
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
  apiGetEvaluationList,
  apiGetSelfAduit,
  apiGetItemList,
  apiInsertEvaluationItem,
  apiUpdateEvaluationItem,
  apiDeleteEvaluationItem,
  apiUpdateEvaluationBatchItem,
  apiGetIncidentInfo,
  apiGetKpiTree,
  apiUpdateEvaluation
}
