const key = 'username'

const state = {
  username: null
}

const mutations = {
  SAVE_STORAGE (state, payload) {
    state.username = payload.username
    localStorage.setItem(key, payload.username)
  },
  DEL_STORAGE (state) {
    state.username = null
    localStorage.removeItem(key)
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
