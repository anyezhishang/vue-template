import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
  },

  mutations: {
    changeUserInfo(state, userInfo) {
      let newUserInfo = JSON.parse(JSON.stringify(userInfo))
      window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

      state.userInfo = newUserInfo;
    }
  }
})

export default store;
