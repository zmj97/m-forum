import Vue from 'vue'
const key = 'username'

const state = {
  username: null
}

const mutations = {
  SAVE_STORAGE (state, payload) {
    state.username = payload.username
    Vue.prototype.$cookie.set(key, payload.username, 30)
  },
  DEL_STORAGE (state) {
    state.username = null
    Vue.prototype.$cookie.delete(key)
  }
}

const actions = {
  setStorage ({ commit }, payload) {
    commit('SAVE_STORAGE', payload)
  },

  removeStorage ({ commit }) {
    commit('DEL_STORAGE')
  }
}

export default {
  state,
  mutations,
  actions
}
