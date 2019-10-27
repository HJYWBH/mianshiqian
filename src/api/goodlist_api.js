import axios from '@/api/component.js'
export const goodAllList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
export const addGood = data => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
