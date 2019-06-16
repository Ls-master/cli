import moment from 'moment';

const defaultFormats = {
  number({ args: [value] }) {
    return value === null || isNaN(value) ? "-" : `${kr.script.formatNum(value)}`;
  },
  percent({ args: [value] }) {
    return `${value}%`;
  },
  currency({ args: [value, moment, meta] }) {
    value = `${value}`;
    const parts = value.split('.');
    let unit = "CNY";
    if (meta && meta.metaconfig && meta.metaconfig.currencyUnit) {
      unit = meta.metaconfig.currencyUnit;
    }
    if (meta && meta.scene && meta.scene.currency_unit) {
      unit = meta.scene.currency_unit;
    }
    return `${unit}${parts.map((part, i) => {
      if (i !== 0) {
        return part;
      }
      const chs = part.split('');
      return chs.reverse().reduce((result, ch, i) => {
        if (i !== 0 && i % 3 === 0) {
          result.push(',');
        }
        result.push(ch);
        return result;
      }, []).reverse().join('');
    }).join('.')}`;
  },
  email({ args: [value, moment, meta, row, pure] }) {
    if (pure) {
      return value;
    }
    if (!value) {
      return value;
    }
    return `<a href="mailto:${value}" onclick="kr.dom.stop()">${value}</a>`;
  },
  url({ args: [value, moment, meta, row, pure] }) {
    if (pure) {
      return value;
    }
    if (!value) {
      return value;
    }
    let schema = '';
    if (!/^https?:\/\//.test(value)) {
      schema = 'http://';
    }
    return `<a href="${schema}${value}" onclick="kr.dom.stop()" target="_blank">${value}</a>`;
  },
  bool({ args: [value] }) {
    return value ? '是' : '否';
  },
  select({ args: [value] }) {
    if(!Array.isArray(value)) {
      return value.label;
    }
    if(!value.length) {
      return '-';
    }
    return value.map(item => item.label).join(' , ');
  },
  select_multiple({ args: [value] }) {
    if(!value.length) {
      return '-';
    }
    return value.map(item => item.label).join(' , ');
  },
  tree_select({ args: [value, moment, meta] }) {
    const { optionKey } = meta.scene;
    if(!value.length) {
      return value[optionKey ? optionKey.label : 'id'];
    }else {
      return value.map(item => item[optionKey ? optionKey.label : 'id']).join(' , ');
    }
  },
  select_one({ args: [value, moment, meta, component] }) {
    if(kr.script.isObject(value)) {
      return value.label;
    }
    if(!value.length) {
      return '-';
    }
    const options = component ? component.runtime_related_data : meta.scene.related_data.options;
    let r = _.find(options, {'value': value});
    return r ? r.label : '';
  },
  select_many({ args: [value, moment, meta, component] }) {
    if(!value.length) {
      return '-';
    }

    const options = component ? component.runtime_related_data : meta.scene.related_data.options;
    return value.map((item) => {
      if(kr.script.isObject(item)) {
        return item.label;
      } else if(typeof item === 'string') {
        let r =  _.find(options, {'value': item});
        return r ? r.label : '';
      } else {
        return item;
      }
    }).join(' , ');
  },
  cascade({ args: [value] }) {
    return value.map(item => item.label).join('/');
  },
  fileSize({ args: [value, moment, meta, row] }) {
    if (typeof value !== 'number' || row.isFolder) {
      return '-';
    }
    if (value >= 0 && value < 1024) {
      return `${value} B`;
    }
    if (value / 1024 >= 1 && value / 1024 / 1024 < 1) {
      const num = parseFloat((value / 1024).toFixed(2));
      return `${num} KB`;
    }
    if (value / 1024 / 1024 >= 1) {
      const num = parseFloat((value / 1024 / 1024).toFixed(2));
      return `${num} MB`;
    }
    return '-';
  },
  reference({ args: [value, moment, meta, component] }) {
    if (!value) {
      return '-';
    }
    if(!Array.isArray(value)) {
      value = [value];
    }
    let res = value.reduce((result, item) => {
      let option = component.cache[item];
      if(!option) {return result};
      let href;
      if(option.object_describe_api_name == 'master_payment_calendar') { //主付款日历不要跳转
        href = option.name;
      } else {
        href =  `<a href="#/md/module/${option.object_describe_api_name}/edit/${option.id}" target="_blank" onclick="kr.dom.stop()" >${option.name}</a>`
      }

      result.push(href);
      return result;
    }, []);
    return res.join(' , ');
  },
  employee({ args: [value] }) {
    if(!value || !value.length) {
      return '-';
    }
    let res = value.reduce((result, item) => {
      if(item && item.label) result.push(item.label);
      return result;
    }, []);
    return res.join(' , ');
  },
  search_condition({ args: [value] }) {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return "-";
    } else {
      const condition = value.map(f => {
        if (!f.operate) {
          return '';
        }
        const operator = f.operate.find(o => o.value === f.operator);
        const op = operator && operator.label;
        let val = f.fieldValues[0];
        if (f.fieldValueType === "date") {
          val = kr.fecha.format(Number(val), 'yyyy-MM-dd HH:mm:ss');
        }
        //当操作符选择为空，不为空时，value值隐藏掉
        if (f.operator === "IS" || f.operator === "ISN") {
          val = "";
        }
        return `${f.label} ${op} ${val}`;
      });
      return condition.join("、<br/>");
    }
  },
  date_range({ args: [value, moment, meta] }) {
    let f = 'YYYY-MM-DD';
    let local_format = null;
    if(typeof meta === 'string') {
      local_format = meta;
    } else {
      local_format = meta.scene.format;
    }

    local_format = local_format.replace('yyyy-MM-dd', 'YYYY-MM-DD');
    local_format = local_format.replace('yyyy', 'YYYY');
    if (local_format && local_format!=='date_range') {
      f = local_format;
    }
    return `${moment(value[0]).format(f)} 至 ${moment(value[1]).format(f)}`;
  },
  numberRange({ args: [value] }) {
    return `${value[0]} - ${value[1]}`;
  },
  currencyRange({ args: [value] }) {
    return `${value[0]} - ${value[1]}`;
  },
  percentRange({ args: [value] }) {
    return `${value[0]}% - ${value[1]}%`;
  }
};
const factory = () => {
  ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'YYYY-MM', 'YYYY', 'yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd HH:mm', 'yyyy-MM-dd', 'yyyy-MM', 'yyyy', 'HH:mm'].forEach(key => {
    defaultFormats[key] = ({ args: [value] }) => {
      key = key.replace('yyyy-MM-dd', 'YYYY-MM-DD');
      key = key.replace('yyyy', 'YYYY');
      // 兼容 date_range
      if(Array.isArray(value)) {
        return defaultFormats.date_range({ args: [value, moment, key] });
      }
      if(value === "" || value === null) {
        return "-";
      }
      return moment(value).format(key);
    };
  });
};
factory();

export default {
  make(format, value, ...args) {
    if (!format) {
      return value;
    }
    if (value == null) {
      return '-';
      // return value;
    }
    const params = [value, moment, ...args];
    if (typeof format === 'string') {
      if (typeof defaultFormats[format] === 'function') {
        return defaultFormats[format]({ args: params });
      }
      return kr.script.exec(format, null, params);
    } else if (typeof format === 'function') {
      return format({ args: params });
    }
    return value;
  },

  async asyncMake(format, value, ...args) {
    if (!format) {
      return value;
    }
    if (value == null) {
      return '-';
      // return value;
    }
    const params = [value, moment, ...args];
    if (typeof format === 'string') {
      if (typeof defaultFormats[format] === 'function') {
        return defaultFormats[format]({ args: params });
      }
      return kr.script.exec(format, null, params);
    } else if (typeof format === 'function') {
      return await format({ args: params });
    }
    return value;
  }
};
