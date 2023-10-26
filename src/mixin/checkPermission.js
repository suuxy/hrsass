/** ***
 *
 * 混入对象
 * 检查用户是否拥有按钮操作权限
 *
 * *****/
import store from '@/store'
export default {
  // 混入对象 是组件的 选项对象
  // 用户资料中 有个points属性 为该用户所拥有的 按钮操作权限标识
  methods: {
    checkPermission(key) {
      // key为所要检查的按钮操作权限标识
      const { userInfo } = store.state.user

      // userInfo.roles.menus记录用户所拥有的页面访问权限
      // userInfo.roles.points记录用户所拥有的按钮操作权限
      if (userInfo.roles && userInfo.roles.points) {
        // 用户所拥有的按钮操作权限里 是否存在有一个 和所要检查的权限标识key相同的 如果有=>表示有权限 没有=>没有权限
        return userInfo.roles.points.some(item => item === key)
      }
      //   用户资料中没有points肯定没有权限 直接return false
      return false
    }
  }
}
