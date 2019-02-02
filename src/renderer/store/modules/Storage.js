const key = 'username'

const state = {
  username: null
}

const mutations = {
  SAVE_STORAGE (state, username) {
    state.username = username
    localStorage.setItem(key, JSON.stringify(username))
  },
  DEL_STORAGE (state) {
    state.username = null
    localStorage.removeItem(key)
  }
}

const actions = {
  setStorage ({ commit }) {
    commit('SAVE_STORAGE')
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
