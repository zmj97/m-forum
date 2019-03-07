const state = {
  currentUser: {
    username: '',
    avatar: ''
  }
}

const mutations = {
  // DECREMENT_MAIN_COUNTER (state) {
  //   state.main--
  // },
  UPDATE_CURRENT_USER (state, data) {
    if (data.data !== undefined) data = data.data
    state.currentUser.username = data.username
    state.currentUser.avatar = data.avatar
  }
}

const actions = {
  setUser ({ commit }, data) {
    // 因为传递的是对象，这里不加上data的话data会被直接解析分解，导致commit收到的data为undefined
    commit('UPDATE_CURRENT_USER', data)
  }
}

export default {
  state,
  mutations,
  actions
}
