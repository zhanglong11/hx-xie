/*
@任务名称: 2623/BIM协同-进度视图前端绑定
@开发人员: 董渊海
@修改日期: 2020-03-18
@任务类型: 全新代码，添加文件列表查询接口

@任务名称: 2623/BIM协同-进度视图前端绑定
@开发人员: 董渊海
@修改日期: 2020-03-19
@任务类型: 修改代码，添加根据文件id下载文件接口
 */
import axios from '@/utils/axios'
const baseURL = `/cim6d-file-storage${process.env.VUE_APP_BASE_API}`
export default {
  //根据id数组获取文件列表
  getFileList: ids => {
    return axios.post('file/manage/list', ids, { baseURL: baseURL })
  },
  //根据id下载文件
  downloadFileById: id => {
    return axios.get(`file/commonFile/download/${id}`, { baseURL: baseURL, responseType: 'blob' })
  }
}
