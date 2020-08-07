/*
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-03-07 15:48:22
 * @LastEditTime: 2020-04-17 13:48:39
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let configEnv = process.env.VUE_APP_BASE_API // 环境变量

const service = axios.create({
  baseURL: `/cim6d-bim-synergy${configEnv}`, // url = base url + request url
  timeout: 10000 // request timeout
})
const system = axios.create({
  baseURL: `/cim6d-system${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
const schedule = axios.create({
  baseURL: `/cim6d-schedule${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

const iot = axios.create({
  baseURL: `/cim6d-iot${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

const safety = axios.create({
  baseURL: `/cim6d-quality-safety${configEnv}`, // url = base url + request url
  timeout: 10000 // request timeout
})

/*
 * @任务编号:2524||左侧树json文件修改
 * @开发人员:申豪强
 * @日期:2020-03-18
 * @任务类型: 修改代码
 */
// 无任务号 修改接口地址 申豪强 2020-03-30
const bimBaseUrl = `/cim6d-bim-light${configEnv}`
// bim服务的baseurl
export const BimBaseUrl = bimBaseUrl
const gis = axios.create({
  baseURL: bimBaseUrl,
  timeout: 10000 // request timeout
})

/*
 * @任务编号:2620||添加跨域接口前缀
 * @开发人员:张龙
 * @日期:2020-03-16
 * @任务类型: 修改代码
 */

const construction = axios.create({
  baseURL: `/cim6d-construction${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

const design = axios.create({
  baseURL: `/cim6d-design${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
const global = axios.create({
  baseURL: `/cim6d-global${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
addInterceptor(service)
addInterceptor(system)
addInterceptor(schedule)
addInterceptor(gis)
addInterceptor(design)
addInterceptor(safety)
addInterceptor(global)
addInterceptor(iot)
/*
 * @任务编号:2620||添加跨域接口前缀
 * @开发人员:张龙
 * @日期:2020-03-16
 * @任务类型: 修改代码
 */
addInterceptor(construction)

// 监听窗口改变
const onresize = () => {
  setTimeout(() => {
    document.getElementsByClassName('layout-main')[0].style.transform = ''
    let clientWidth = document.documentElement.clientWidth
    let clientHeight = document.documentElement.clientHeight
    window.onresize = () => {
      // 定义窗口大小变更通知事件
      clientWidth = document.documentElement.clientWidth //窗口宽度
      clientHeight = document.documentElement.clientHeight //窗口高度
      changeLayoutMain(clientWidth, clientHeight)
    }
    changeLayoutMain(clientWidth, clientHeight)
  }, 500)
}
// 自动缩放
const changeLayoutMain = (clientWidth, clientHeight) => {
  const defaultWidth = 1920
  let layoutMain = document.getElementsByClassName('layout-main')
  let mainHeight = layoutMain[0].clientHeight
  let proportion = clientWidth / defaultWidth
  if (clientHeight < mainHeight) {
    proportion = clientHeight / mainHeight
  }
  if (clientWidth < defaultWidth || clientHeight < mainHeight) {
    layoutMain[0].style.transform = `scale(${proportion})`
  } else {
    layoutMain[0].style.transform = ''
  }
}

function addInterceptor(service) {
  // request interceptor
  service.interceptors.request.use(
    config => {
      if (store.getters.token) {
        config.headers['x-access-token'] = getToken()
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    response => {
      const res = response.data
      if (response.config.responseType === 'blob') {
        return response
      }
      if (response.config.type === 'prevention') {
        return response.data
      }
      /*
       * @任务编号: 2525 | 左侧树接口做拦截
       * @开发人员:申豪强
       * @日期:2020-03-19
       * @任务类型: 新代码
       */
      if (response.config.url.indexOf('.json') > -1 && response.data instanceof Array) {
        return response.data
      }

      // if the custom code is not 20000, it is judged as an error.
      if (!res.success && res.code !== 200) {
        Message({
          message: res.message || res.msg || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        onresize()
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  )
}
export const post = (url, data, config = {}) => {
  return service.post(url, data, config)
}
export const get = (url, data, baseURL = `/cim6d-system${configEnv}`) => {
  return service.get(url, {
    params: data,
    baseURL: baseURL
  })
}

service.service = service //任务号：2623、修改人：董渊海、修改时间：2020-03-17
service.schedule = schedule
service.system = system
service.gis = gis
service.design = design
service.safety = safety
service.global = global
service.iot = iot
/*
 * @任务编号:2620||添加跨域接口前缀
 * @开发人员:张龙
 * @日期:2020-03-16
 * @任务类型: 修改代码
 */
service.construction = construction
export default service
