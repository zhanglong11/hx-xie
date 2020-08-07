<template>
  <div class="video base-wrap">
    <div class="left">
      <div class="video-type">
        <div class="type-header">
          <span class="title">监控区域</span>
          <p class="list-type">
            <span class="list-type-icon icon-one" :class="{ active: tabIndex === 0 }" @click="clickTab(0)"></span>
            <span class="list-type-icon icon-list" :class="{ active: tabIndex === 1 }" @click="clickTab(1)"></span>
          </p>
        </div>
        <ul class="type-body">
          <li
            v-for="(item, i) in typeList"
            :key="i"
            :class="{ active: item.value === queryForm.monitorArea }"
            @click="selectType(item.value)"
          >
            <p class="title">{{ item.label }}</p>
            <p class="focus">
              <img :src="item.img" />
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <!-- 单视频播放模式 start -->
      <template v-if="tabIndex === 0">
        <div class="model-container">
          <span class="model-line top-left-line"></span>
          <span class="model-line top-right-line"></span>
          <span class="model-line bottom-left-line"></span>
          <span class="model-line bottom-right-line"></span>
          <!--          <video-->
          <!--            class="video-big"-->
          <!--            playsinline="playsinline"-->
          <!--            webkit-playsinline="true"-->
          <!--            x5-playsinline="true"-->
          <!--            x5-video-player-type="h5"-->
          <!--            x5-video-player-fullscreen="false"-->
          <!--            preload="auto"-->
          <!--            :src="currentPlay"-->
          <!--            controls-->
          <!--            autoplay-->
          <!--          ></video>-->
          <Video :url="currentPlay" />
        </div>
        <div class="small-list">
          <img src="../images/video/arrow-left.png" class="video-btn btn-left" @click="pageRoll()" />
          <img src="../images/video/arrow-right.png" class="video-btn btn-right" @click="pageRoll(true)" />
          <div class="page-roll" ref="pageRollRef">
            <ul>
              <li
                v-for="(item, i) in dataList"
                :key="i"
                :class="['video-item', item.deviceUrl === currentPlay ? 'active' : '']"
                @click="playVideo(item.deviceUrl)"
              >
                <Video :url="item.deviceUrl" />
              </li>
            </ul>
          </div>
        </div>
      </template>
      <!-- 单视频播放模式 end -->
      <!-- 列表模式 start -->
      <template v-if="tabIndex === 1">
        <div class="list-model">
          <ul>
            <li v-for="(item, i) in dataList" :key="i">
              <div class="focus">
                <!--                <video-->
                <!--                  class="video-list"-->
                <!--                  playsinline="playsinline"-->
                <!--                  webkit-playsinline="true"-->
                <!--                  x5-playsinline="true"-->
                <!--                  x5-video-player-type="h5"-->
                <!--                  x5-video-player-fullscreen="false"-->
                <!--                  preload="auto"-->
                <!--                  autoplay-->
                <!--                  :src="item.deviceUrl"-->
                <!--                  controls-->
                <!--                  v-if="item.deviceUrl"-->
                <!--                ></video>-->
                <Video :url="item.deviceUrl" v-if="item.deviceUrl" />
                <img :src="item.img" v-else />
                <p class="title" v-text="item.title"></p>
              </div>
            </li>
          </ul>
        </div>
      </template>
      <!-- 列表模式 start -->
    </div>
  </div>
</template>

<script>
/*
   任务名称：task#2886 【智慧施工2.0-前端】视频监控模块切图及功能开发
   开发人员：耿为刚
   日期：2020-04-13
   任务类型：全新代码
 */
import { videoApi } from '../api/video-api'
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'videoPlayer',
  components: {},
  data() {
    //这里存放数据
    return {
      tabIndex: 0,
      typeList: [],
      monitorArea: '', // 监控区域
      queryForm: {
        // 查询条件
        monitorArea: '',
        status: 1
      },
      dataList: [],
      currentPlay: 'http://ngrok3.gim6d.com:20013/video882.m3u8'
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTypeList()
  },
  //方法集合
  methods: {
    // 获取监控区域
    getTypeList() {
      let list = this.$getArgList('monitorArea')
      list.map((item, i) => {
        item.img = require(`../images/tmp/video${i + 1}.jpg`)
      })
      this.typeList = list
      this.selectType(list[0].value)
    },
    // 选择区域
    selectType(val) {
      this.queryForm.monitorArea = val
      this.queryList()
    },
    // 监控设备-列表
    async queryList() {
      const result = await videoApi.queryAreadeviceList(this.queryForm)
      const datas = result.data || []
      datas.map(item => {
        item.img = item.capturePicture || require('../images/tmp/video-b-1.jpg')
      })
      this.dataList = datas
      if (datas.length > 0) {
        this.$nextTick(() => {
          this.currentPlay = datas[0].deviceUrl
          // console.log(111111, this.currentPlay)
        })
      }
    },
    // 播放视频
    playVideo(val) {
      console.log('切换', val)
      this.currentPlay = val
    },
    // 切换显示方式
    clickTab(e) {
      this.tabIndex = e
    },
    // 左右滚动
    pageRoll(isRight) {
      const itemWidth = 167
      let scrollLeft = this.$refs.pageRollRef.scrollLeft
      if (isRight) {
        this.$refs.pageRollRef.scrollLeft = scrollLeft + itemWidth
      } else {
        this.$refs.pageRollRef.scrollLeft = scrollLeft - itemWidth
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../styles/common.less');
//@import url(); 引入公共css类
.video {
  display: flex;
  .left {
    margin: 0 30px 0 20px;
    width: 218px;
  }
  .right {
    flex: 1;
  }
}
.video-type {
  .type-header {
    margin-bottom: 10px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    height: 26px;
    font-size: 16px;
    color: #fff;
    background: #0b1e3a;
    .title {
      flex: 1;
    }
    .list-type {
      display: inline-flex;
      align-items: center;
      .list-type-icon {
        margin-left: 5px;
        width: 26px;
        height: 26px;
        cursor: pointer;
        transition: all 0.4s;
        &.icon-one {
          background: url('../images/video/icon2.png');
          &.active,
          &:hover {
            background: url('../images/video/icon2-1.png');
          }
        }
        &.icon-list {
          background: url('../images/video/icon3.png');
          &.active,
          &:hover {
            background: url('../images/video/icon3-1.png');
          }
        }
      }
    }
  }
  .type-body {
    padding-top: 15px;
    background: #0e1931;
    li {
      margin-bottom: 15px;
      padding: 0 15px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      .title {
        margin-bottom: 12px;
        padding-left: 20px;
        background: url('../images/video/icon1.png') left center no-repeat;
        line-height: 30px;
        color: #fff;
        transition: all 0.3s;
      }
      .focus {
        width: 185px;
        height: 114px;
        overflow: hidden;
        border-radius: 4px;
        img {
          width: 100%;
          height: 100%;
          transition: all 0.4s;
          border-radius: 4px;
        }
      }
      &:hover {
        .focus {
          img {
            transform: scale(1.1);
          }
        }
      }
      &.active {
        background: #182c4f;
        .title {
          background-image: url('../images/video/icon1-1.png');
          color: #00d7ff;
        }
      }
    }
  }
}
.model-container {
  padding: 10px 15px;
  width: 100%;
  position: relative;
  z-index: 2;
  .model-line {
    position: absolute;
    background: url('../images/model-line.png');
    width: 152px;
    height: 143px;
    z-index: -1;
    &.top-left-line {
      top: 0;
      left: 0;
    }
    &.top-right-line {
      top: 0;
      right: 0;
      transform: rotate(90deg);
    }
    &.bottom-right-line {
      bottom: 0;
      right: 0;
      transform: rotate(180deg);
    }
    &.bottom-left-line {
      bottom: 0;
      left: 0;
      transform: rotate(-90deg);
    }
  }
  .video-big {
    width: 100%;
    height: 800px;
    outline: none;
  }
}
.small-list {
  margin-top: 40px;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
  width: 1632px;
  display: flex;
  align-items: center;
  .page-roll {
    width: 100%;
    height: 110px;
    padding: 0 66px 25px;
    overflow: auto;
    transition: all 0.4s;
    ul {
      height: 100%;
      .video-item {
        width: 150px;
        height: 100%;
      }
    }
  }
  ul {
    flex: 1;
    display: flex;
    align-items: center;
    li {
      margin-right: 22px;
      position: relative;
      .focus {
        width: 145px;
        height: 85px;
        border-radius: 3px;
        transition: all 0.3s;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          transition: all 0.3s;
        }
        &:hover {
          box-shadow: 0 0 8px #5b93c1 inset;
          img {
            transform: scale(1.1);
          }
        }
      }
      .title {
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        width: 100%;
        line-height: 30px;
        height: 30px;
        overflow: hidden;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
  .video-btn {
    position: absolute;
    z-index: 2;
    width: 66px;
    height: 85px;
    top: 0;
    cursor: pointer;
    transition: all 0.3s;
    &.btn-left {
      left: 0;
    }
    &.btn-right {
      right: 0;
    }
  }
}
.list-model {
  margin-top: 30px;
  margin-left: 20px;
  height: 950px;
  overflow: auto;
  &:after {
    .clear;
  }
  li {
    margin-bottom: 17px;
    padding: 0 13px;
    float: left;
    width: 50%;
    .focus {
      width: 100%;
      height: 460px;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 16;
        position: absolute;
        z-index: 2;
        left: 0;
        bottom: 0;
        text-align: center;
        cursor: pointer;
      }
      .play {
        width: 62px;
        height: 62px;
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        margin-top: -31px;
        margin-left: -31px;
      }
    }
  }
}
</style>
