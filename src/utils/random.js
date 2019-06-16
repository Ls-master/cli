// @flow

export default {
  string(len: number = 16, already?: Object = {}) {
    const src = 'abcdefghijklmnopqrstuvwxyz';
    const step = () => {
      return src[Math.floor(Math.random() * src.length)];
    };
    const once = () => {
      return new Array(len).fill(0).reduce((result) => {
        result += step();
        return result;
      }, '');
    };
    /* eslint-disable no-constant-condition */
    while (true) {
      const result = once();
      if (!already || !already[result]) {
        return result;
      }
    }
  },

  /**
   * 生成随机ID
   * @method createOnlyId
   * @return { String } 字符串
   */
  createOnlyId() {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  },

  string_number(len: number = 16, already?: Object = {}) {
    const src = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const step = () => {
      return src[Math.floor(Math.random() * src.length)];
    };
    const once = () => {
      return new Array(len).fill(0).reduce((result) => {
        result += step();
        return result;
      }, '');
    };
    /* eslint-disable no-constant-condition */
    while (true) {
      const result = once();
      if (!already || !already[result]) {
        return result;
      }
    }
  },

};
