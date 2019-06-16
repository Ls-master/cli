// @flow
import _ from 'lodash';

export default {
  getType(v: any): string {
    return Object.prototype.toString.call(v);
  },
  // 格式化字符串 fontSize => font-size
  toKebab(v: string): string {
    return v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },
  // 格式化字符串 fontSize => font_size
  _toKebab(v: string): string {
    return v.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  },
  isArray(v: any): boolean {
    return this.getType(v) === '[object Array]';
  },
  isObject(v: any): boolean {
    return this.getType(v) === '[object Object]';
  },
  clone(v: ?Object) {
    return JSON.parse(JSON.stringify(v));
  },
  formatTausends(num: number): string {
    return String(num).replace(/^(\s+|-)?\d+(?=.?\d*($|\s))/g, (m) => {
      return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');
    });
  },
  // 删除数组多元素
  forDeleteArray(arr: Array<mixed>, delarr: Array<number>): Array<mixed> {
    for(let len = arr.length, i = len - 1; i >= 0; i--) {
      for (let j = 0; j < delarr.length; j++) {
        if (i === delarr[j]) {
          arr.splice(i, 1);
        }
      }
    }
    return arr;
  },
  // 递归遍历数组对象是否相等
  compare(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (typeof a !== typeof b || a === null || b === null) {
      return false;
    }

    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      return this.compareArray(a, b);
    }

    if (typeof a === "object") {
      return this.compareObject(a, b);
    }

    // console.log("value", a, b);
    return false;
  },
  compareObject(a: any, b: any): boolean {
    // console.log("object", a, b);
    const keya = Object.keys(a);
    const keyb = Object.keys(b);

    if (keya.length !== keyb.length) {
      return false;
    }

    return keya.every(key => {
      if (!this.compare(a[key], b[key])) {
        return false;
      }
      return true;
    });
  },
  compareArray(a: Array<mixed>, b: Array<mixed>): boolean {
    // console.log("array", a, b);
    if (a.length !== b.length) {
      return false;
    }
    const length = a.length;
    for (let i = 0; i < length; i++) {
      if (!this.compare(a[i], b[i])) {
        return false;
      }
    }
    return true;
  },
  // 转意符换成普通字符
  escape2Html(str: string): string {
    var arrEntities: Object = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t){ return arrEntities[t]; });
  },
  //普通字符转换成转意符
  html2Escape(sHtml: string): string {
    return sHtml.replace(/[<>&"]/g, function(c){ return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c]; });
  },
  exec(script, component, args) {
    let func = null;
    if (typeof script === 'string') {
      eval(`func=function(ctx){
        try{
          var result = null;
          ${script}
          return result;
        }catch(err){
          return null;
        }
      }`);
    } else if (typeof script === 'function') {
      func = script;
    } else {
      func = () => { return {}; };
    }
    return func.call(component, {
      component,
      args,
    });
  },
  // 深拷贝 merge 对象
  updateState(target, source) {
    let newTarget = { ...target };
    for (let sKey in source) {
      if (source.hasOwnProperty(sKey)) {
        if (newTarget[sKey]) {
          if (newTarget.hasOwnProperty(sKey)) {
            if (_.isArray(source[sKey])&&_.isArray(newTarget[sKey])) {
              newTarget[sKey] = [].concat(source[sKey]);
            } else if (_.isFunction(source[sKey])&&_.isFunction(newTarget[sKey])) {
              newTarget[sKey] = source[sKey];
            } else if (_.isObject(source[sKey])&&_.isObject(newTarget[sKey])) {
              newTarget[sKey] = this.updateState(newTarget[sKey], source[sKey]);
            } else {
              newTarget[sKey] = source[sKey];
            }
          }
        } else {
          newTarget[sKey] = source[sKey];
        }
      }
    }
    return newTarget;
  },
  // 深拷贝 merge 对象 (数组合并不覆盖)
  updateState_arraymerge(target, source) {
    let newTarget = { ...target };
    for (let sKey in source) {
      if (source.hasOwnProperty(sKey)) {
        if (newTarget[sKey]) {
          if (newTarget.hasOwnProperty(sKey)) {
            if (_.isArray(source[sKey])&&_.isArray(newTarget[sKey])) {
              newTarget[sKey] = [...newTarget[sKey]].concat(source[sKey]);
              // newTarget[sKey] = _.cloneDeep(newTarget[sKey]).concat(source[sKey]);
            } else if (_.isFunction(source[sKey])&&_.isFunction(newTarget[sKey])) {
              newTarget[sKey] = source[sKey];
            } else if (_.isObject(source[sKey])&&_.isObject(newTarget[sKey])) {
              newTarget[sKey] = this.updateState(newTarget[sKey], source[sKey]);
            } else {
              newTarget[sKey] = source[sKey];
            }
          }
        } else {
          newTarget[sKey] = source[sKey];
        }
      }
    }
    return newTarget;
  },
  //千分符
  formatNum (num){
    num = num + '';
    if (/\./.test(num)) {
      var arr = num.split('.');
      return arr[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + arr[1];
    }
    return num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }
}
