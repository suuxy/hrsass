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
        const { roles } = await store.dispatch('user/getUserInfo')
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)// 筛选动态路由
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 将动态路由添加到路由表里 铺路
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()// 直接放行
      }
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
