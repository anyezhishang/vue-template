const path = require('path')

// const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 网页标题
const name = 'Vue Template'

module.exports = {
  publicPath: "/template/",
  outputDir: process.env.outputDir, // build输出目录
  assetsDir: 'assets', // 静态资源目录（js, css, img）
  productionSourceMap: false,
  lintOnSave: true, // 是否开启eslint
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    devtool: 'source-map',

    // 拷贝文件到生成的目录下
    // plugins: [
    //   new CopyWebpackPlugin({
    //     patterns: [{
    //       from: resolve('src/assets/version.json'),
    //       to: resolve(`${process.env.outputDir}/assets/version.json`)
    //     }]
    //   })
    // ]
  },
  devServer: {
    port: '8080',
    https: false, // 是否使用https协议
    open: true, // 是否自动弹出浏览器页面
    hotOnly: true, // 是否开启热更新
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/test': {
        target: process.env.VUE_APP_BASEURL, // API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''
        }
      },
      '/product': {
        target: process.env.VUE_APP_BASEURL, // API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/product': ''
        }
      }
    }
  },

  // sass全局变量
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/sass/variable.scss"`
      },
      scss: {
        prependData: `@import "~@/assets/sass/variable.scss";`
      },
    }
  }
}
