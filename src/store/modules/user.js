import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserInfoById } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {}
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
  },
  setUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    const res = await login(data) // 拿到token
    // 封装了响应拦截器 响应回来的是我们要的那个data
    context.commit('setToken', res)
    // 拿到token登陆成功 设置时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserInfoById(result.userId) // 为了获取头像
    const info = { ...result, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', info)
    return result
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')

    // 删除用户资料
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
