import axios from 'axios'
import { Toast } from 'vant'
import router from '~/router'
// import store from "@/store";
// 根据环境不同引入不同api地址
export const baseApi = import.meta.env.VITE_API_SERVER
// create an axios instance
const service = axios.create({
  baseURL: `${baseApi}index`, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 15000, // request timeout

})

// request拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 不传递默认开启loading
    // if (!config.hideloading) {
    //   // loading
    //   Toast.loading({
    //     forbidClick: true,
    //   });
    // }
    // 设置请求头
    if (localStorage.getItem('TOKEN')) {
      // loading
      config.headers.Authorization = `bearer ${localStorage.getItem('TOKEN')}`
    }

    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  },
)
// respone拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status === 0 || res.code === 0 || res.result === 0) {
      // // 登录超时,重新登录
      Toast(res.message || res.msg || res.info)

      return Promise.reject(res || 'error')
    }
    if (res.status === 401 || res.code === 401) {
      // // 登录超时,重新登录
      Toast({
        message: res.message || res.msg,
        onClose: () => {
          router.replace('/login')
        },
      })
    }
    else {
      return Promise.resolve(res)
    }
  },
  (error) => {
    const res = error.response
    if (res.status === 401) {
      Toast.fail({
        message: '登录信息过期,请重新登录',
      })
      setTimeout(() => {
        localStorage.clear()
        location.href = '/'
      }, 1500)
    }
    else {
      Toast.fail({
        message: res.data.message,
      })
      return Promise.reject(error)
    }
  },
)

const request = ['post', 'put', 'patch'].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return service(Object.assign({ url, data, method }, options))
  }
  return request
}, {});

['get', 'delete', 'head'].forEach((method) => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return service(Object.assign({ url, params, method }, options))
  }
})

export default request
