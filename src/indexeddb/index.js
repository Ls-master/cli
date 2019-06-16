import localforage from 'localforage';

export default class DB {
  constructor(data) {
    const {storeName} = data;
    const userId = sessionStorage.getItem("userId");
    if(userId) {
      this.db = localforage.createInstance({
        name: userId,
        storeName: storeName,
        // driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL],
      })
    } else {
      window.vm.$router.push('/login');
    }
  }

  async getItem(key) {
    try {
      let value = await this.db.getItem(key);
      return value;
    } catch(err) {
      throw err;
    }
  }

  async setItem(key, value) {
    let _value = null;
    try {
      _value = await this.getItem(key);
    } catch(err) {
      throw err;
    }

    if(_value) {
      value = kr.script.updateState(_value, value);
    } 
    this.db.setItem(key, value).then(function (value) {
      return value;
    }).catch(function(err) {
      throw err;
    });
  }

  async find(key, ...keys) {
    let target = await this.db.getItem(key);
    if(!target) {
      return null;
    }

    for(let i=0; i<keys.length; i++) {
      let _k = keys[i];
      target = target[_k];
      if(!target) {
        target = null;
        return;
      }
    }

    return target;
  }

}
