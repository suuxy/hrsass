import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken()
}
// 修改state中的数据
const mutations = {
  setToken(state, token) {
    state.token = token // 修改vuex中token值
    setToken(token) // 将修改后的值同步到缓存
  },
  removeToken(state) {
    state.token = null // vuex中的token值置空
    removeToken() // 同步到缓存
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
