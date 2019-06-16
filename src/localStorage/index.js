export default class WebCatche {
  constructor(data) {
    this.webCatche = window.localStorage;
  }
  
  get(key) {
    const userId = window.sessionStorage.getItem("userId");
    let _val = null;
    _val = JSON.parse(this.webCatche.getItem(userId));

    if(_val) {
      return _val[key];
    } else {
      return null;
    }
  }

  save(router, val) {
    const userId = window.sessionStorage.getItem("userId");
    let value = {[router]: val};
    let _value = null;
    _value = JSON.parse(this.webCatche.getItem(userId));

    if(_value) {
      value = kr.script.updateState(_value, {[router]: val});
    }

    this.webCatche.setItem(userId, JSON.stringify(value));
  }

  find(router, ...keys) {
    let target = null;
    target = this.get(router);

    if(target) {
      for(let i=0; i<keys.length; i++) {
        let _k = keys[i];
        target = target[_k];
        if(!target) {
          target = null;
          return;
        }
      }
    }

    return target;
  }

}
