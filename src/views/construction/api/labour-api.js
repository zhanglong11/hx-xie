/**
 任务名称：task#2888 【智慧施工2.0-前端】劳务管理模块切图及功能开发
 开发人员：耿为刚
 日期：2020-04-20
 任务类型：全新代码
 **/
import http from '@/utils/axios'
export default {
  // 安全培训-列表
  queryListTraining: data => {
    return http.construction({
      url: '/safety/training/list',
      method: 'post',
      data
    })
  },
  //现场人员信息表
  personList: () =>
    http.construction.get(`/labour/bim/emp/queryList`, {
      params: {
        projectId: localStorage.getItem('projectId')
      }
    }),

  //现场人员信息表
  enterOut: params =>
    http.construction.get(`/labour/bim/enterOut/queryToday`, {
      params: {
        projectId: localStorage.getItem('projectId'),
        ...params
      }
    }),

  //男女比例以及到场率

  rate: () =>
    http.construction.get(`/labour/bim/emp/queryRate`, {
      params: {
        projectId: localStorage.getItem('projectId')
      }
    }),

  //工种列表
  workType: () =>
    http.construction.get(`/labour/bim/worktypeAndProvince/queryList`, {
      params: {
        projectId: localStorage.getItem('projectId')
      }
    }),

  //安全培训
  safeTrain: () =>
    http.construction.get(`/labour/bim/safeTrain/reportData`, {
      params: {
        projectId: localStorage.getItem('projectId')
      }
    })
}
