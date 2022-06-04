import axios from 'axios'
// import {
//   MsgError
// } from '@/utils/msg'
import getToken from './auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  crossdomain: true,
})

// request interceptor
service.interceptors.request.use(
  (config_) => {
    const config = config_
    // config.headers['X-Token'] = getToken()
    config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    config.headers.common.Accept = 'application/json'
    config.headers.common.Authorization = `Bearer ${getToken()}`
    return config
  },
  (error) => {
    // console.log(error) // for debug
    return Promise.reject(error)
  },
)

// respone interceptor
service.interceptors.response.use(
  (response) => response,
  (error_) => {
    // console.log('err' + error) // for debug

    const error = error_

    if (error.response.status === 401) {
      error.message = 'Вы не авторизованы'
    }

    // MsgError(msg)
    return Promise.reject(error)
  },
)

export default service
