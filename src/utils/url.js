let env = 'dev'; // test 测试环境， product生产环境

let baseUrl = '';

if (env === 'dev') {
  baseUrl = '/test';
  // baseUrl = 'https://cloudtest.szbjh.com:20443';
  // baseUrl=  'https://cloud.szbjh.com' ;
} else if (env === 'test') {
  baseUrl = 'https://cloudtest.szbjh.com:20443';
} else if (env === 'product') {
  baseUrl = 'https://cloud.szbjh.com';
}

let url = {
  env,
  baseUrl,
  // 财务绩效系统登录接口
  UserLogin: `${baseUrl}/api-financialperformance/senvUser/login`,
  // 财务绩效系统单点登录接口
  UserSso: `${baseUrl}/api-financialperformance/senvUser/sso`,
  // 根据Token获取用户信息接口
  GetTokenUser: `${baseUrl}/api-financialperformance/senvUser/getbytoken`,
  // 查询用户列表接口
  GetUserList: `${baseUrl}/api-financialperformance/senvUser/getlist`,
  // 修改密码接口
  ChangePassword: `${baseUrl}/api-financialperformance/senvUser/changepassword`,

  // 查询所有指标类型接口
  GetCategoryAll: `${baseUrl}/api-financialperformance/senvkpitree/getcategoryall`,
  // 查询指标名称接口
  GetKpiNameInfo: `${baseUrl}/api-financialperformance/senvkpitree/getkpinameinfo`,
  // 查询目标值接口
  GetTargetValueInfo: `${baseUrl}/api-financialperformance/senvkpitree/gettargetvalueinfo`,
  // 新增指标接口
  InsertKpiTree: `${baseUrl}/api-financialperformance/senvKpiTree/insert`,
  // 修改Kpi指标接口
  UpdateKpiTree: `${baseUrl}/api-financialperformance/senvKpiTree/update`,
  // 删除单个kpi指标接口
  DeleteKpiTree: `${baseUrl}/api-financialperformance/senvKpitree/delete`,


  // 查询考核主表列表接口
  GetEvaluationList: `${baseUrl}/api-financialperformance/perfEvaluation/getevaluationlist`,
  // 个人自评接口
  GetSelfAduit: `${baseUrl}/api-financialperformance/perfEvaluation/getselfaduit`,
  // 考核明细查询接口
  GetItemList: `${baseUrl}/api-financialperformance/perfEvaluationItem/getitemlist`,
  // 修改考核明细接口
  InsertEvaluationItem: `${baseUrl}/api-financialperformance/perfEvaluationItem/insert`,
  // 修改明细的指标id接口
  UpdateEvaluationItem: `${baseUrl}/api-financialperformance/perfEvaluationItem/update`,
  // 删除单个明细接口
  DeleteEvaluationItem: `${baseUrl}/api-financialperformance/perfEvaluationItem/delete`,
  // 修改考核明细接口
  UpdateEvaluationBatchItem: `${baseUrl}/api-financialperformance/perfEvaluationItem/updatebatch`,
  // 获取事件明细接口
  GetIncidentInfo: `${baseUrl}/api-financialperformance/perfIncidentRecord/getincidentinfo`,
  // 三级分组接口
  GetKpiTree: `${baseUrl}/api-financialperformance/senvkpitree/kpigroupby`,
  // 修改考核主表接口
  UpdateEvaluation: `${baseUrl}/api-financialperformance/perfEvaluation/update`,


  // 查询事件记录列表接口
  GetRecordList: `${baseUrl}/api-financialperformance/perfIncidentRecord/getlist`,
  // 分页查询事件记录接口
  GetRecordPage: `${baseUrl}/api-financialperformance/perfIncidentRecord/page`,
  // 新增事件记录接口
  InsertEventRecord: `${baseUrl}/api-financialperformance/perfIncidentRecord/insert`,
  // 修改事件记录接口
  UpdateEventRecord: `${baseUrl}/api-financialperformance/perfIncidentRecord/update`,
  // 审核事件记录接口
  AuditEventRecord: `${baseUrl}/api-financialperformance/perfIncidentRecord/partyaudit`,
}
export default url
