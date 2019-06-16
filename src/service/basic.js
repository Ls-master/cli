import axios from 'axios';
import Router from 'code-middleware';
import qs from 'qs';
import router from 'router';

let api = '/api';
// const root = process.env.NODE_ENV;
// switch (root) {
// case 'development':
//   api = '/api';
//   break;
// case 'production':
//   api = 'http://192.168.6.84:8000/api';
//   break;
// default:
//   api = '';
// }

export const ajaxRouter = new Router();

const baseURL= '192.168.6.84:8000';

/* eslint-disable no-shadow */
ajaxRouter.use('/config/basic-param', function (next) {
  kr._.merge({
    timeout: 120000, // 2分钟
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json',
    },
  }, this.config);
  next();
});

// 设置 baseUrl
ajaxRouter.use('/config/url-prefix', function (next) {
  this.config.url = `${api}/${this.config.url}`.replace(/\/{2,}/g, '/');
  next();
});
ajaxRouter.use('/oa/url-prefix', function (next) {
  this.config.url = `/oa/${this.config.url}`.replace(/\/{2,}/g, '/');
  next();
});
ajaxRouter.use('/layout/url-prefix', function (next) {
  this.config.url = `/layout/${this.config.url}`.replace(/\/{2,}/g, '/');
  next();
});

// get 请求处理 url, pathParams, pathQuery决定使用情况
ajaxRouter.use('/config/path-params', function (next) {
  this.config.url = kr.url.inject(this.config.url, this.config.pathParams, this.config.pathQuery);
  next();
});
// post 数据处理
ajaxRouter.use('/config/form-data', function (next) {
  if (this.config.data) {
    // this.config.data = qs.stringify(this.config.data);
  }
  if (this.config.formData) {
    this.config.data = qs.stringify(this.config.formData);
  }
  next();
});

// result 中间件
ajaxRouter.use('/result/analysis', function (next) {
  const { result } = this;
  if (!(result instanceof Error)) {
    if (result.status === 200) {
      const { code, message, result: data } = result.data;
      switch (code) {
      case 0:
        this.result = data;
        break;
      default:
        this.result = Error(code);
        this.errorInfo = {
          code,
          message,
        };
      }
    } else {
      this.result = Error();
    }
  } else {
    this.result = Error();
    const data = result.response && result.response.data;
    //补丁，配置网关后, 当登录不成功时跳转到登录页面
    //网关暂时无法抛出success类型的异常
    if (data && (data.code === 100000005 || data.code === 100000006) ) {
      this.errorInfo = data;
    } else {
      this.errorInfo = {
        message: data.message || '请求超时',
      };
    }
  }
  next();
});
ajaxRouter.use('/result/handle-error', function (next) {
  const { result, errorInfo } = this;
  if (result instanceof Error) {
    if (errorInfo) {
      if (errorInfo.code === 100000001 || errorInfo.code === 100000005 || errorInfo.code === 100000006) {
        router.push('/');
      } else {
        kr.ui.error(errorInfo.message);
      }
    }
  }
  next();
});
// 后台数据 type 转换
ajaxRouter.use('/conversion/transform-type', function (next) {
  const { result } = this;
  if (!(result instanceof Error)) {
    if(result) {
      result.forEach(item => {
        let { type, local_scene, local_value } = kr.conversion.transformType(item.type, item);
        item.type = type;
        item.scene = local_scene;
      })
    }
  }
  next();
});

// post - data:{}, get - params: {}
export default async function ajax(config, whiteList = [], blackList = []) {
  if (location.origin.indexOf('http://10.4.10.41') > -1) {
    return
  }
  let context = await ajaxRouter.send({
    whiteList: ['/config'].concat(whiteList),
    blackList,
    config,
  });
  let result = null;
  try {
    result = await axios.request(context.config);
  } catch (e) {
    result = e;
  }

  context = await ajaxRouter.send({
    whiteList: ['/result'].concat(whiteList),
    blackList,
    result,
    config,
  });
  if (context.result instanceof Error) {
    throw context.result;
    // return context;
  }
  return context.result;
}
