import ajax from "./basic";

export function queryDataFromServerApi(api) {
  return async (extra) => {
    const result = await ajax(Object.assign({}, {
      method: 'post',
      url: api
    }, extra), [], []);
    return result;
  }
}