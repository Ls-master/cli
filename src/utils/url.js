import queryString from 'query-string';

export default {
  inject(url, params, query = {}) {
    let result = url.replace(/:([a-zA-Z0-9\-_]+)/g, (a, b) => {
      if (params && params[b]) {
        return params[b];
      }
      return a;
    });
    const str = queryString.stringify(query);
    if (str) {
      if (result.indexOf('?') < 0) {
        result += '?';
      } else {
        result += '&';
      }
      result += str;
    }
    return result;
  },
  delete(url) {
    return url.replace(/\/:([a-zA-Z0-9\-_]+)/g, '');
  },
};
