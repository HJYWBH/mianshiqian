import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  usssname: ''
}
const mutations = {
  myshishi: (state, value) => {
    state.usssname = value
  }
}
const actions = {}
const getters = {
  getmyshishi: (state) => {
    return state.usssname
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
