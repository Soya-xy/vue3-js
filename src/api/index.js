import api from '@/utils/ajax'

export default api
export const getIndex = () => api.get('/Index/indexData')
export const login = data => api.post('/Login/index', data)
