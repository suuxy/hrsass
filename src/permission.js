import router from './router'
import store from './store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      next('/') // 跳转到主页
    } else {
      if (!store.getters.userId) {
        // 没有用户资料 获取用户资料 调用actions
        await store.dispatch('user/getUserInfo')
      }
      next()// 直接放行
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单内 直接放行
      next()
    } else {
      // 去登陆页面取token
      next('/login')
    }
  }
  nProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 路由后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
