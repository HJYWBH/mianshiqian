import axios from '@/api/component.js'
export const getAllroleList = () => {
  return axios({
    url: 'roles'
  })
}
export const deleteRoleList = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
export const addShouQuan = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}
export const addUserForm = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}
