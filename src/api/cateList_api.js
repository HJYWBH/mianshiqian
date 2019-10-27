import axios from '@/api/component.js'
export const getCate = type => {
  return axios({
    url: 'categories',
    params: { type }
  })
}
