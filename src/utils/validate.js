export default {
  apiName: [
    (rule, value, cb, source) => {
      let reg = /^[a-zA-Z][a-zA-Z0-9_]{0,}[a-zA-Z0-9]|[a-zA-Z]{1}$/;
      if (value && value.length > 100) {
        cb(new Error('该字段长度不能超过100个字符！'));
      } else if (!reg.test(value)) {
        cb(new Error('只能输入字母数字下划线，并且只能以字母开头不能以下划线结尾！'));
      }
      cb();
    },
    { required: true, message: '该字段不能为空！' },
  ],
  name: [
    { type: "string", required: true, message: '该字段不能为空！' },
    { max: 50, message: '该字段最大长度为50个字符！' }
  ],
  label: [
    (rule, value, cb, source) => {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if (!reg.test(value)) {
        cb(new Error('对象名称仅支持中文、字母、数字和下划线！'));
      }
      cb();
    },
    { type: "string", required: true, message: '该字段不能为空！' },
    { max: 50, message: '该字段最大长度为50个字符！' }
  ],
  helpText: [
    { max: 500, message: '该字段最大长度为500个字符！' },
    (rule, value, cb, source) => {
      var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
      if (reg.test(value)) {
        cb(new Error('禁止输入html代码！'));
      }
      cb();
    }
  ],
  description: [
    { max: 500, message: '该字段最大长度为500个字符！' },
    (rule, value, cb, source) => {
      var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
      if (reg.test(value)) {
        cb(new Error('禁止输入html代码！'));
      }
      cb();
    }
  ],
  min: [
    (rule, value, cb, source) => {
      if (value > 999 || value < 0) {
        cb(new Error('仅可以填写整数；最小为“0”，最大为“999”。'));
      }
      cb();
    },
    {required: true, message: '该字段不能为空！'}
  ],
  max: function (formRef, wrapRef, isBPM = false) {
    let vm = this;
    return [
      (rule, val, cb, source) => {
        let formMetas
        if (isBPM) { // 用于BPM字段管理
          formMetas = wrapRef == 'editFieldDialog' ? vm.$refs[formRef] : vm.$refs[wrapRef].$refs[formRef];
        } else {
          formMetas = vm.$refs[formRef];
        }
        let form = formMetas.getForm();
        if (val > 1000 || val < form.minLength) {
          cb(new Error('仅可以填写整数；要大于最小长度，最大为“1000”。'));
        }
        cb();
      },
      {required: true, message: '该字段不能为空！'}
    ]
  },
  fileTypeLabel: [
    (rule, value, cb, source) => {
      if (value && value.length < 15 && /^[0-9a-zA-Z_\u4e00-\u9fa5]+$/.test(value)) {
        cb();
      } else {
        cb(new Error('类型默认不超过15个字，包含数字、字母、下划线，支持中文!'));
      }
    },
    {required: true, message: '该字段不能为空！'}
  ],
  urlMaxLength: [
    { type: 'number', max: 1000, min: 0, message: '仅可以填写整数；最小为“0”，最大为 “1000”'},
    {required: true, message: '该字段不能为空！'}
  ],
  tabLabel: [
    (rule, value, cb, source) => {
      if (value && value.length > 8) {
        cb(new Error('一级菜单字数最多不能超过8位！'));
      }
      cb();
    },
    {required: true, message: '该字段不能为空！'}
  ],
  phone: [
    (rule, value, cb, source) => {
      // let reg = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      let reg = /^[0-9+\-*/();#]+$/g;
      if (!reg.test(value)) {
        cb(new Error('手机号码格式不正确!'));
      }
      cb();
    },
  ],
  email: [
    (rule, value, cb, source) => {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(value)) {
        cb(new Error('email格式不正确!'));
      }
      cb();
    },
  ],
  // url: [
  //   // 匹配是否含有中文
  //   (rule, value, cb, source) => {
  //     let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  //     if (reg.test(value)) {
  //       cb(new Error('url格式不正确!'));
  //     }
  //     cb();
  //   },
  // ],
  url: [
    // 完全匹配(可能包含中文)
    (rule, value, cb, source) => {
      // let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/;
      let reg = /^http(s)?:\/\/.+$/g;
      
      if (!reg.test(value)) {
        cb(new Error('url格式不正确!'));
      }
      cb();
    },
  ],
  test:[
     // 匹配是否含有中文
     (rule, value, cb, source) => {
      cb(new Error('TEST!'));
    },
  ],
  pattern: [
    { required: true, message: '该字段不能为空！' },
    (rule, value, cb) => {
      if (value) {
        const reg = /\{0+\}/g;
        if (/^(.*)(\{0+\})(.*)$/.exec(value)) {
          reg.exec(value);
          if (!reg.exec(value)) {
            cb();
          } else {
            cb(new Error('输入格式不对，占位符只能有一个！'));
          }
        } else {
          cb(new Error('输入格式不对，格式要求请见下表！'));
        }
      } else {
        cb();
      }
    }
  ],
  startNumber: [
    (rule, value, cb) => {
      if (!value) {
        cb(new Error('该字段不能为空！'));
      } else if (value.toString().length > 10) {
        cb(new Error('开始编号不能超过10位！'));
      } else {
        cb();
      }
    }
  ],
  number: [
    (rule, value, cb) => {
      if (value || value === 0) {
        if (/^\d*$/.test(value)) {
          cb();
        } else {
          cb(new Error('此输入框只能输入数字！'));
        }
      } else {
        cb();
      }
    }
  ]
}
