import Vue from 'vue';
import Vuex from 'vuex';

import view from './view';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    view,
  },
});
