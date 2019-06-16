import './utils';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import filter from './filter';
import _ from 'lodash';
import ElementUI from 'element-ui';
import AsyncComputed from 'vue-async-computed';
// import 'element-ui/lib/theme-chalk/index.css';

import WebCatche from '@/localStorage';

Vue.use(ElementUI);
Vue.use(AsyncComputed);
Vue.config.debug = true;
Vue.config.productionTip = false;

Vue.prototype.$kr = window.kr;
Vue.prototype.$_ = _;
Vue.prototype.$catche = new WebCatche();

window.vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
  },
});