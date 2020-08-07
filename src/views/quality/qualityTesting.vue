<!--
 * @Description: 质检问题
 * @Version:
 * @Autor:
 * @Date: 2020-02-25 18:10:07
 * @LastEditTime: 2020-04-17 10:36:34
 -->
<!--*
* @任务编号:2620||页面接口对接
* @开发人员:张龙
* @日期:2020-03-16
* @任务类型:修改代码
*/
-->
<!--
  * @任务编号: 2525 || 质量视图新增详情页
  * @开发人员:申豪强
  * @日期:2020-03-17
  * @任务类型: 新代码
  -->
<!--
* @任务编号: 2620 || 质量添加搜索框
* @开发人员:张龙
* @日期:2020-03-25
* @任务类型: 新代码
-->
<template>
  <div>
    <div v-if="!detailsFlag">
      <v-chart style="width: 100%;height: 200px;" :options="chartOptions"></v-chart>
      <div>
        <el-input v-model="pageQuery.problemDesc" placeholder="请输入">
          <el-button slot="append" icon="el-icon-search" @click="refresh"></el-button>
        </el-input>
      </div>
      <el-table :data="list" @row-click="rowClick">
        <el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
        <el-table-column align="center" prop="issueDescription" label="问题描述"></el-table-column>
        <el-table-column align="center" prop="b" label="紧急程度">
          <template slot-scope="scope">
            <span
              class="point"
              :style="{ background: _.get(_.find(urgencyDegreeList, { value: scope.row.emergencyLevel }), 'color') }"
            />
            <span>{{ _.get(_.find(urgencyDegreeList, { value: scope.row.emergencyLevel }), 'label') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inspectArea" label="检查部位"></el-table-column>
        <el-table-column align="center" prop="d" label="整改状态">
          <template slot-scope="scope">
            <span v-if="scope.row.dealStatus === 0" style="color:red">{{
              _.get(_.find(statusList, { value: scope.row.dealStatus }), 'label')
            }}</span>
            <span v-else>{{ _.get(_.find(statusList, { value: scope.row.dealStatus }), 'label') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <!--      <Details @goBack="goBack" />-->
    </div>
  </div>
</template>

<script>
import api from '@/api/quality'
import bimUtils from '@/utils/bimUtils'
import Details from './components/QualityDetails'
export default {
  components: {
    Details
  },
  data() {
    return {
      /*
       * @任务编号:2620||接口数据以及状态对应数据
       * @开发人员:张龙
       * @日期:2020-03-16
       * @任务类型:修改代码
       */
      pageQuery: {
        problemDesc: '',
        page: 1,
        rows: 50
      },
      list: [],
      // 详情标志
      detailsFlag: false,
      checkData: [],
      statusList: [
        {
          label: '未解决',
          value: 0
        },
        {
          label: '已解决',
          value: 1
        }
      ],
      urgencyDegreeList: [
        { label: '一般', value: 1, color: '#91C1F3' },
        { label: '较大', value: 2, color: '#FFFF00' },
        { label: '严重', value: 3, color: '#FF9650' },
        { label: '重大', value: 4, color: '#FF3333' }
      ],
      chartOptions: {
        title: {
          text: '质量问题',
          x: '19%',
          y: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            color: '#b3dafe'
          }
        },
        grid: {
          left: 0,
          top: 0
        },
        label: {
          formatter: '{d}%'
        },
        series: [
          {
            width: 220,
            name: '风险',
            type: 'pie',
            radius: ['30%', '40%'],
            color: ['#d24e6b', '#db982c', '#e0cf3a', '#3f8fe2'],
            data: []
          }
        ],
        legend: {
          itemGap: 16,
          show: true,
          top: 'middle',
          right: 10,
          icon: 'circle',
          formatter: name => {
            /*
             * @任务编号:2620||实现已整改数据在echarts展现
             * @开发人员:张龙
             * @日期:2020-03-16
             * @任务类型:修改代码
             */
            let curItem = this.checkData.filter(r => r.name === name)[0]
            let count = curItem.value
            let solveCount = curItem.count
            return [`{a|${name}}`, `{b|${count}}`, `{a|未解决}`, `{b|${solveCount}}`].join(' ')
          },
          orient: 'vertical',

          textStyle: {
            rich: {
              a: {
                color: '#b3dafe'
              },
              b: {
                color: '#2268d3',
                padding: [0, 6, 0, 2]
              }
            },
            color: '#859caf',
            fontSize: 13
          }
        }
      }
    }
  },
  /*
   * @任务编号:2620||echarts接口对接
   * @开发人员:张龙
   * @日期:2020-03-16
   * @任务类型:修改代码
   */
  created() {
    this.refresh()
  },
  methods: {
    /*
     * @任务编号: 2525 || 质量视图新增详情页
     * @开发人员:申豪强
     * @日期:2020-03-17
     * @任务类型: 新代码
     */
    // 根据guid定位并添加标注
    fitViewByGUID(guidArray) {
      let bimfishApp = this.$store.state.bim.bimfishApp
      // 添加标注
      const icon = '/img/qualityProblem.png'
      bimfishApp.addDrawableIconMarkerByGUID(guidArray, icon, ({ screenPoint, guid }) => {
        console.log('screenPoint:', screenPoint, guid)
      })
      // 定位
      bimfishApp.fitViewByGUID(guidArray)
    },
    goBack() {
      this.$emit('goBack')
      this.detailsFlag = false
    },
    async rowClick(row) {
      const res = await api.getGuid(row.id)
      // 返回值应该多一个dbid或者guid
      // let bimfishApp = this.$store.state.bim.bimfishApp
      if (res.data.componentIdList.length) {
        this.fitViewByGUID(res.data.componentIdList)
      }
      // this.$emit('goDetails')
      // this.detailsFlag = true
    },
    async refresh() {
      const res = await api.checkCount({ planTypes: [1] })
      let data = res.data
      this.checkData = [
        { name: '一般隐患', value: data.general, count: data.generalTODO },
        { name: '重大隐患', value: data.great, count: data.greatTODO },
        { name: '较大隐患', value: data.larger, count: data.largerTODO },
        { name: '严重隐患', value: data.severity, count: data.severityTODO }
        // { name: '一般隐患', value: data.general, count: data.general - data.generalSolve },
        // { name: '重大隐患', value: data.great, count: data.great - data.greatSolve },
        // { name: '较大隐患', value: data.larger, count: data.larger - data.largerSolve },
        // { name: '严重隐患', value: data.severity, count: data.severity - data.severitySolve }
      ]
      this.chartOptions.series[0].data = this.checkData
      const listRes = await api.listPage({
        ...this.pageQuery,
        ...{
          planTypes: [1]
        }
      })
      this.list = listRes.data.records
    }
  }
}
</script>

<style lang="less" scoped>
.point {
  width: 8px;
  height: 8px;
  display: inline-flex;
  margin: 0 4px 1px 0;
  border-radius: 50%;
}
</style>
