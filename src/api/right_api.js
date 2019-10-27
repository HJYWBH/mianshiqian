import axios from '@/api/component.js'
export const getAllrightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
export const getMenus = () => {
  return axios({
    url: 'menus'
  })
}
