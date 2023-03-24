import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
// 获取用户基本资料
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'POST'

  })
}

// 获取用户详细信息
export function getUserInfoById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  return request({

  })
}
