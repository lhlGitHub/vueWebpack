const path = require("path")
const webpack = require("webpack")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const  isDebug= process.env.NODE_ENV === "development";
module.exports = {
  // 想要打包的模块的数组
  mode: isDebug ? "development" : "production",
  entry: {
    vendor: ['axios', 'vue-router', 'vue','vuex']
  },
  output: {
    path: path.join(__dirname, './dist/static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',//生成的文件名字 默认为vendor.dll.js
    library: '[name]_library'//生成文件的映射关系，与下面的DLLPlugin配置相对应
  },
  plugins: [
    new webpack.DllPlugin({//生成一个json文件 里面是关于dll.js的配置信息
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library',//与上面output中的配置对应
      context: __dirname//上下文环境路径，必须填写，为了与DLLReferencePlugin存在于同一上下文中，否则undefined
    }),
    // 压缩打包的文件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: true,
        warnings: false
      },
    }),
  ],
  node: {
    fs: 'empty',
  }
}
