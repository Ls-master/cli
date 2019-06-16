/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode 路由模式
 *
 */

let routerMode = 'hash';
let isDev = process.env.NODE_ENV === 'development';
let baseUrl = isDev ? '' : window.env.REQUEST_LOC;
let baseImgPath

const HEADERS_CONTENT_TYPE = {
  urlencoded: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  json: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}

// 请求异常返回数据
const errorData = {
  code: 1,
  msg: 'error',
  result: {},
  dataSource: 'interceptor'
}

// 图表通用配置颜色
const chartColors = [
  '#7990ED',
  '#60C8FC',
  '#5BC2A3',
  '#FACF50',
  '#FA7D7D',
  '#99ADFF',
  '#A3E7FF',
  '#69DBC4',
  '#F5E47A',
  '#FA9BB6',
  '#BDCCFF',
  '#64AAFA',
  '#B2EDC7',
  '#F7AA6A'
]

// 饼图使用颜色
const pineColors = [
  '#7990ED',
  '#99ADFF',
  '#BDCCFF',
  '#64AAFA',
  '#65CAFC',
  '#A3E7FF',
  '#5BC2A3',
  '#69DBC4',
  '#B2EDC7',
  '#F7AA6A',
  '#FACF50',
  '#F5E47A',
  '#FA7D7D',
  '#FA9BB6',
  '#FFC9F2'
]

export {
  HEADERS_CONTENT_TYPE,
  isDev,
  baseUrl,
  routerMode,
  codeMessage,
  errorData,
  chartColors,
  pineColors
}
