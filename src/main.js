import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/lang'

import '@/styles/index.scss' // global css
import * as filters from '@/filters'
import App from './App'
import store from './store'
import router from './router'
import Component from './components'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
// 导入检查用户是否拥有按钮操作权限的方法
import checkPermission from '@/mixin/checkPermission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// Object.keys(filters)将filters对象中所有的key组成一个数组 即一个数组中包含filters对象中所有的key
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 全局混入对象 => 检查用户是否拥有按钮操作权限的方法
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查操作权限的方法

Vue.config.productionTip = false
Vue.use(Component)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
