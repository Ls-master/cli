import _ from 'lodash';

/* eslint-disable consistent-return */
export default {
  merge(...args) {
    return _.mergeWith(...args, (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue;
      }
    });
  },
  clone(...args) {
    return _.cloneDeep(...args);
  },
  isEqual(...args) {
    return _.isEqual(...args);
  },
  uniq(...args) {
    return _.uniq(args);
  },
  uniqWith(...args) {
    return _.uniqWith(args);
  },
  remove(array, index) {
    return _.remove(array, (item, i) => i !== index );
  },
};
