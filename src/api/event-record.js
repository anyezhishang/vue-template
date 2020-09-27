import axios from 'axios'
import Url from '../utils/url';

// 查询事件记录列表
const apiGetRecordList = ({
  examineDate,
  recorderName,
  partyId,
  partyName,
  startCreateDate,
  endCreateDate,
  description,
  status,
  kpiId
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetRecordList, {
        examineDate,
        recorderName,
        partyId,
        partyName,
        startCreateDate,
        endCreateDate,
        description,
        status,
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

// 分页查询事件记录
const apiGetRecordPage = ({
  examineDate,
  recorderName,
  partyId,
  partyName,
  startCreateDate,
  endCreateDate,
  description,
  status,
  kpiId,
  pageNum,
  pageSize,
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.GetRecordPage, {
        examineDate,
        recorderName,
        partyId,
        partyName,
        startCreateDate,
        endCreateDate,
        description,
        status,
        kpiId,
        pageNum,
        pageSize,
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 新增事件记录
const apiInsertEventRecord = ({
  partyId,
  examineDate,
  addSubtract,
  kpiId,
  description,
  status,
  recorderId
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.InsertEventRecord, {
        partyId,
        examineDate,
        addSubtract,
        kpiId,
        description,
        status,
        recorderId
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 修改事件记录
const apiUpdateEventRecord = ({
  userId,
  requestData: {
    id,
    partyId,
    examineDate,
    addSubtract,
    kpiId,
    description,
    status,
    recorderId
  },
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.UpdateEventRecord, {
        userId,
        requestData: {
          id,
          partyId,
          examineDate,
          addSubtract,
          kpiId,
          description,
          status,
          recorderId
        },
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

// 审核事件记录
const apiAuditEventRecord = ({
  userId,
  requestData: {
    id,
    status
  }
}) => {
  return new Promise((resolve, reject) => {
    axios.post(Url.AuditEventRecord, {
        userId,
        requestData: {
          id,
          status
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




// 查询所有指标类型
const apiGetCategoryAll = () => {
  return new Promise((resolve, reject) => {
    axios.get(Url.GetCategoryAll)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
}

const apiInsertKpiTree = ({
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
  apiGetRecordList,
  apiGetRecordPage,
  apiInsertEventRecord,
  apiUpdateEventRecord,
  apiAuditEventRecord,


  apiGetCategoryAll,
  apiInsertKpiTree,
  apiUpdateKpiTree,
  apiDeleteKpiTree
}
