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
}
export default url
