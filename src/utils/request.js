import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
import router from '@/router'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行npm run dev时 访问的是.env.development =>/api =>当请求的地址有/api时 会触发跨域代理机制 =>vue.config.js
  // 本地前端 发送请求 到 本地服务后端 再由本地服务后端 代理请求到 另一个服务器后端
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev 开发环境 => /api num run build 生产环境 => /prod-api
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config请求配置信息 必须要返回
  // 注入token 用到token的时候判断是否超时
  if (store.getters.token) {
    // 有token 判断是否超时
    if (checkTimeOut()) {
      store.dispatch('user/logout')// 登出action 删除用户信息 以及 token
      router.push('/login') // 跳转到登录页面
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)// 提示错误信息
    return Promise.reject(new Error(message)) // 进入catch
  }
}, error => {
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
})
function checkTimeOut() {
  const currentTime = Date.now() // 当前时间
  const timeStamp = getTimeStamp() // 缓存的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
