import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev 开发环境 => /api num run build 生产环境 => /prod-api
  timeout: 5000
})
service.interceptors.request.use()
// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)// 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})
export default service
