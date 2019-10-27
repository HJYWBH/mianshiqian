import axios from '@/api/component.js'
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
export const getUserList = (pa) => {
  return axios({
    url: 'users',
    params: pa
  })
}
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
export const xiugaiUser = (uId, type) => {
  return axios({
    url: `users/${uId}/state/${type}`,
    method: 'put'
  })
}
export const editUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
export const grantUserRole = (id, rid) => {
  return axios({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}
export const bjUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: {
      email: data.email,
      mobile: data.mobile
    }
  })
}
