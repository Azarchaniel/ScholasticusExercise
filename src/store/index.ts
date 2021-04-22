import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  //for checking net connection status
  state: {
    connected: navigator.onLine,
  },
  getters: {
    connected: (state) => state.connected,
  },
  mutations: {
    SET_CONNECTED(state, payload) {
      state.connected = payload;
    },
  },
  actions: {
    setConnected({ commit }, payload) {
      commit("SET_CONNECTED", payload);
    },
  },
});
