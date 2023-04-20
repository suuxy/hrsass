import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // newRoutes登陆成功需要添加的新路由 即有权限的路由
  setRoutes(state, newRoutes) {
    // 静态路由所有人都可以访问的路由 静态路由加上该用户所拥有权限的路由
    // 静态路由 加上 动态路由
    state.routes = [...constantRoutes, ...newRoutes]
  }

}
const actions = {
  // 筛选用户所拥有的权限路由（动态路由）
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      // key 用户所拥有的权限标识
      // 筛选动态路由 返回一个数组
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes)
    return routes // state中的routes是用来显示左侧菜单 而 return是用来addRoutes动态添加路由
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
