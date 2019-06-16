
export default {
  getPropObject() {
    return {
      type: Object,
      default: () => {
        return {};
      },
    };
  },
  getPropArray() {
    return {
      type: Array,
      default: () => [],
    };
  },
  getPropString(suggestion = '') {
    return {
      type: String,
      default: suggestion,
    };
  },
  getPropNumber(suggestion = 0) {
    return {
      type: Number,
      default: suggestion,
    };
  },
  getPropBoolean(suggestion = false) {
    return {
      type: Boolean,
      default: suggestion,
    };
  },
  getPropFunction(suggestion = () => {}) {
    return {
      type: Function,
      default: suggestion,
    };
  },
  findFieldEnv(component) {
    let now = component;
    while (now) {
      if (now.$options.FIELD_ENV) {
        break;
      }
      now = now.$parent;
    }
    return now;
  },
  getOptions(defaults, meta, getMetaData) {
    const { type } = meta;
    let metaData = [];
    try {
      metaData = getMetaData(meta) || [];
      if (metaData && !Array.isArray(metaData)) {
        metaData = [metaData];
      }
    } catch (e) {
      e;
    }
    let result = [];
    if (!Array.isArray(defaults)) {
      if (defaults != null) {
        let { ALL } = defaults;
        if (ALL) {
          if (!Array.isArray(ALL)) {
            ALL = [ALL];
          }
          result = result.concat(ALL);
        }
        let ONE = defaults[type];
        if (ONE) {
          if (!Array.isArray(ONE)) {
            ONE = [ONE];
          }
          result = result.concat(ONE);
        }
      }
    } else {
      result = defaults.slice();
    }
    result = result.concat(metaData);
    return result;
  },
};
