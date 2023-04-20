/** ***
 *
 * 混入对象
 *
 * *****/
import store from '@/store'
export default {
  // 混入对象 是组件的 选项对象
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      //   points记录用户所拥有的操作权限
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      //   不存在肯定没有points
      return false
    }
  }
}
