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

    // 重置路由表里的路由 为初始状态 即只有静态路由
    resetRouter()

    // 将vuex permission模块下的routes设置为初始状态 只有静态路由 => 显示左侧菜单用的
    // 调用permission模块下的mutations方法setRoutes
    // 子模块调用子模块的mutations 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是当前子模块的context了 而是父模块（根级）的context
    // 而根级(父模块)并没有 setRoutes方法 调用permission子模块里的

    // 去设置权限permission模块下路由为初始状态
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下的 所有的mutations和action都是挂在全局上的 所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context 而是当前子模块的context
    // mutations名称 载荷 payload 第三个参数  { root: true } 调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
