/*
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-02-24 17:51:22
 * @LastEditTime: 2020-03-30 09:25:31
 */
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  devServer: {
    port: 9530,
    overlay: {
      warnings: false,
      errors: true
    },
    // 无任务编号：切换服务地址； 申豪强 2020-03-30
    proxy: {
      '/cim6d': {
        target: 'http://172.16.10.123:22222',
        changeOrigin: true
      },
      '/prevention': {
        target: 'https://view.inews.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '/prevention': ''
        }
      },
      '/geocoding': {
        target: 'http://api.map.baidu.com',
        changeOrigin: true
      },
      '/location': {
        target: 'http://pv.sohu.com/cityjson',
        changeOrigin: true,
        pathRewrite: {
          '/location': ''
        }
      }
    }
  },
  configureWebpack: {
    name: 'BIM协同',
    resolve: {
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components')
      }
    }
  }
}
