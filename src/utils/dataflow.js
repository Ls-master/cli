/* eslint-disable no-await-in-loop,prefer-destructuring */
import waterfall from 'async/waterfall';

const defaultPrepares = {
  form_to_query(ctx) {
    const { basic } = ctx;
    return {
      params: basic,
    };
  },
  form_to_params(ctx) {
    const { basic } = ctx;
    return {
      pathParams: basic,
    };
  },
  form_to_data_data(ctx) {
    const { basic } = ctx;
    return {
      data: {
        data: JSON.stringify(basic),
      },
    };
  },
  form_to_data(ctx) {
    const { basic } = ctx;
    return {
      data: Object.keys(basic).reduce((result, key) => {
        result[key] = JSON.stringify(basic[key]);
        return result;
      }, {}),
    };
  },
  form_to_data_auto(ctx) {
    const { basic } = ctx;
    return {
      data: Object.keys(basic).reduce((result, key) => {
        let value = basic[key];
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        result[key] = value;
        return result;
      }, {}),
    };
  },
  route_to_params(ctx) {
    const { component } = ctx;
    return {
      pathParams: component.$route.params,
    };
  },
};
const defaultEffects = {
  list(ctx, result, id, callback) {
    const { component, basic } = ctx;
    const { data } = result;
    if (data) {
      const { fieldMetas, values, tableProps, customStyles } = data;
      component.tableProps = tableProps;
      component.fieldMetas = fieldMetas;
      component.values = values;
      if (customStyles) {
        component.customStyles = customStyles;
      }
      component.page = kr.page.getPage(result);
    }
    callback(null, ctx, result, id);
  },
  detail(ctx, result, id, callback) {
    const { component, basic } = ctx;
    const { fieldMetas, layout, value, customStyles } = result;
    component.fieldMetas = fieldMetas;
    component.layout = layout;
    component.value = value;
    if (customStyles) {
      component.customStyles = customStyles;
    }
    callback(null, ctx, result, id);
  },
};

export default {
  prepare(prepares, ...args) {
    if (!Array.isArray(prepares)) {
      prepares = [prepares];
    }
    const confs = prepares.map((prepare) => {
      if (typeof prepare === 'string') {
        prepare = defaultPrepares[prepare];
      }
      if (typeof prepare !== 'function') {
        prepare = () => { return {}; };
      }
      return prepare(...args);
    });

    return kr._.merge(...confs);
  },
  async effect(effects, ctx, result, id) {
    if (!Array.isArray(effects)) {
      effects = [effects];
    }
    let waterEffects = [];
    for (let i = 0; i < effects.length; i += 1) {
      let effect = effects[i];
      if (typeof effect === 'string') {
        effect = defaultEffects[effect];
      }
      if (typeof effect !== 'function') {
        effect = (ctx, result, id, callback) => {callback(null, ctx, result, id)};
      }
      // await effect(...args);
      waterEffects.push(effect);
    }
    // 瀑布流处理 effects
    waterfall(
      [
        function(callback) {
          callback(null, ctx, result, id);
        },
        ...waterEffects
      ],
      function (err, result) {
        if(err) {
          console.log(err);
        }
        if(result) {
          // console.log(result);
        }
      }
    )

  },
  async run(configs, component, basic = {}) {
    if (!Array.isArray(configs)) {
      configs = [configs];
    }
    const ctx = {
      basic,
      component,
    };
    for (let i = 0; i < configs.length; i += 1) {
      let all = configs[i];
      if (!Array.isArray(all)) {
        all = [all];
      }
      const invokes = [];
      for (let j = 0; j < all.length; j += 1) {
        const config = all[j];
        const { api, prepare } = config;
        // 生成接口 请求参数
        const conf = this.prepare(prepare, ctx);
        // 请求 接口
        const req = await api(conf);
        invokes.push(req);
      }
      const rs = await Promise.all(invokes);
      for (let j = 0; j < rs.length; j += 1) {
        const r = rs[j];
        const id = `${i},${j}`;
        ctx[id] = r;
        const { effect } = all[j];
        await this.effect(effect, ctx, r, id);
      }
    }
    return ctx;
  },
};
