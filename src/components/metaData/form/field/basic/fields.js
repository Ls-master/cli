import { typeDict } from './statics';

const searchDict = {
  GREATER_THAN: { label: '大于', value: 'GREATER_THAN' },
  LESS_THAN: { label: '小于', value: 'LESS_THAN' },
  GREATER_THAN_OR_EQUAL: { label: '大于等于', value: 'GREATER_THAN_OR_EQUAL' },
  LESS_THAN_OR_EQUAL: { label: '小于等于', value: 'LESS_THAN_OR_EQUAL' },
  EQUAL: { label: '等于', value: 'EQUAL' },
  NOT_EQUAL: { label: '不等于', value: 'NOT_EQUAL' },
  CONTAIN: { label: '包含', value: 'CONTAIN' },
  NOT_CONTAIN: { label: '不包含', value: 'NOT_CONTAIN' },
  CONTAIN_FOR_MULTIPLE: { label: '包含', value: 'EQUAL' },
  NOT_CONTAIN_FOR_MULTIPLE: { label: '不包含', value: 'NOT_EQUAL' },
  HEAD_WITH: { label: '起始于', value: 'HEAD_WITH' },
  EQUAL_FOR_MULTIPLE: { label: '包含', value: 'EQUAL' },
  NOT_EQUAL_FOR_MULTIPLE: { label: '不包含', value: 'NOT_EQUAL' },
  EQUAL_FOR_CASCADE: { label: '等于', value: 'INTERSECTION' },
  NOT_EQUAL_FOR_CASCADE: { label: '不等于', value: 'NOT_INTERSECTION' },
};
// export searchDict;

export default class Fields {
  constructor(data) {
    data = data.reduce((result, Component) => {
      let { INDEX } = Component;
      if (!INDEX) {
        throw Error('缺乏索引，动态字段组件不能注册');
      }
      if (!Array.isArray(INDEX)) {
        INDEX = [INDEX];
      }
      INDEX.forEach(item => {
        if (result[item]) {
          throw Error('重复的索引，动态字段组件不能注册');
        }
        result[item] = Component;
      });
      return result;
    }, {});
    Object.keys(data).forEach(key => {
      this[this.getKey(key)] = data[key];
    });
  }
  getKey(origin) {
    return `KR_${origin}`;
  }
  find(meta) {
    return meta && this[this.getKey(meta.type)];
  }
  getSearchCondition(meta) {
    const Comp = this.find(meta);
    if (!Comp) {
      return [];
    }
    const cond = Comp.SEARCH_CONDITION && Comp.SEARCH_CONDITION[meta.type];
    if (!Array.isArray(cond) || !cond.length) {
      return [];
    }
    return cond.reduce((result, item) => {
      const option = searchDict[item];
      if (option) {
        result.push(option);
      }
      return result;
    }, []);
  }
  getSearchConf(meta) {
    const from_to_validate = (rule, value, callback, source) => {
      if (source.from != null && source.to != null) {
        if (source.from >= source.to) {
          callback('起始值不能大于等于结束值');
          return;
        }
      } else if (source.from == null && source.to == null) {
        callback('筛选条件不能都为空');
        return;
      }
      callback();
    };
    const dict = {
      EQUAL: {
        metas: [{
          key: 'equal',
          name: '等于',
          description: '',
          scene: {
            element_props: {
              size: 'mini',
              disabled: false,
            },
            validate: [{ required: true, message: '筛选条件不能为空' }],
          },
        }],
        template: (form, meta, makeSkin) => {
          if (form.equal != null) {
            return `${meta.name}：等于${makeSkin(meta, form.equal, {}, true)}`;
          }
          return null;
        },
      },
      CONTAIN: {
        metas: [{
          key: 'contain',
          name: '包含',
          description: '',
          scene: {
            element_props: {
              size: 'mini',
              disabled: false,
            },
            validate: [{ required: true, message: '筛选条件不能为空' }],
          },
        }],
        template: (form, meta, makeSkin) => {
          if (form.contain != null) {
            return `${meta.name}：包含${makeSkin(meta, form.contain, {}, true)}`;
          }
          return null;
        },
      },
      FROM_TO: {
        metas: [
          {
            key: 'from',
            name: '从',
            description: '',
            scene: {
              element_props: {
                size: 'mini',
                disabled: false,
              },
              validate: [{
                validator: from_to_validate,
              }],
            },
          }, {
            key: 'to',
            name: '到',
            description: '',
            scene: {
              element_props: {
                size: 'mini',
                disabled: false,
              },
              validate: [{
                validator: from_to_validate,
              }],
            },
          },
        ],
        template: (form, meta, makeSkin) => {
          let str = `${meta.name}：`;
          let flag = false;
          if (form.from != null) {
            str += `从${makeSkin(meta, form.from, {}, true)}`;
            flag = true;
          }
          if (form.to != null) {
            str += `到${makeSkin(meta, form.to, {}, true)}`;
            flag = true;
          }
          if (flag) {
            return str;
          }
          return null;
        },
      },
    };
    const Comp = this.find(meta);
    if (!Comp) {
      return null;
    }
    const desc = Comp.SEARCH_FORM && Comp.SEARCH_FORM[meta.type];
    if (!desc) {
      return null;
    }
    const found = dict[desc];
    if (!found) {
      return null;
    }
    return found;
  }
  getSearchMetas(meta) {
    const conf = this.getSearchConf(meta);
    if (conf) {
      const result = conf.metas.map(item => {
        const result = kr._.merge({}, meta, item, {
          scene: {
            related_data_remote_params: {
              key: meta.key,
            },
          },
        });
        return result;
      });
      return result;
    }
    return null;
  }
  getSearchTemplate(meta) {
    const conf = this.getSearchConf(meta);
    if (conf) {
      return conf.template;
    }
    return null;
  }
  gitFieldChinese(meta) {
    return typeDict[meta.type] || '-';
  }
}
