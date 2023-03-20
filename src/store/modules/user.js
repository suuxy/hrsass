import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
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
const actions = {
  async login(context, data) {
    const res = await login(data)
    // 封装了响应拦截器 响应回来的是我们要的那个data
    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
