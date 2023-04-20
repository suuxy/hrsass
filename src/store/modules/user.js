import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserInfoById } from '@/api/user'
import { resetRouter } from '@/router/index'
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

    // 重置路由 为初始状态 即静态路由
    resetRouter()

    // 将vuex permission模块下的routes设置为初始状态 只有静态路由 => 显示左侧菜单用的
    // 子模块调用子模块的mutations 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
