import Vue from 'vue';
import Vuex from 'vuex';

import * as modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
});

if (module.hot) {
  module.hot.accept(Object.keys(modules).map(m => './modules/' + m), () => {
    store.hotUpdate({
      modules: Object.keys(modules).reduce(
        (obj, m) => (obj[m] = require('./modules/' + m).default),
        {},
      ),
    });
  });
}