const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebapckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const  isDebug= process.env.NODE_ENV === "development";
const HMR = new webpack.HotModuleReplacementPlugin();
const cleanDist=  new CleanWebpackPlugin("dist")
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); //线程城池

const config = {
  //设置了 mode 之后会把 process.env.NODE\_ENV 也设置为 development 或者 production。然后在 production 模式下，会默认开启 UglifyJsPlugin 等等一堆插件。
  mode: isDebug ? "development" : "production",  
  resolve: {
       //自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
   extensions: [" ",".js",".css",".json"],
   // 使用绝对路径指明第三方目录，减少搜索步骤    
   modules: [path.resolve(__dirname, 'node_modules')],
   //别名配置
    alias: {
      vue$: "vue/dist/vue.js",
      "@": path.resolve(__dirname, "src")
    }
  },
  entry: { index: "./src/js/app/index.js", detail: "./src/js/app/detail.js" },
  output: {
     //打包目录
    path: path.resolve(__dirname, "dist"),
     //打包文件名
    filename: "js/[name].[hash].js"
  },
  devServer: {
    //启动热更新，注意：这里说的热更新是指在页面不刷新情况下局部更新变化部分
    // 如果不设置 hot: true页面会全部刷新
    hot: true, 
    contentBase: path.resolve(__dirname, "dist"),
    port: 3000,
    host: "0.0.0.0",
    open:true,
    historyApiFallback: true,
    disableHostCheck: true
  },
  devtool: isDebug?"cheap-eval-module-source-map":"cheap-module-source-map",
  optimization: {
    minimizer:[
      // css压缩
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      cacheGroups: {
         // 抽离公共文件
        common:{
          chunks: "initial",
          name:'common', // 打包后的文件名
          minSize: 0, 
          minChunks: 2
        },
        vendor: {
          // 抽离第三方插件
          test: /node_modules/,
          chunks: "initial",
          name: "vender",// 打包后的文件名
          priority: 10,
          enforce: true
        },
      }
    }
  },
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      {
        test: /\.js$/,
        use: {
          loader: 'happypack/loader?id=babel'       
        },
        exclude: ["/node_modules/"],
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css|less/,
        use: [
          isDebug ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              outputPath: "images/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
       //4.X版本后使用vue-loader要加上VueLoaderPlugin插件
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/assets"),
        to: path.resolve(__dirname, "dist/assets")
      }
    ]),
    new HtmlWebapckPlugin({
      template: "index.html",
      filename: "index.html",
      chunks: ["vender", "index","common"]
    }),
    new HtmlWebapckPlugin({
      template: "detail.html",
      filename: "detail.html",
      chunks: ["vender", "detail","common"]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      // chunkFilename: "[name].css",
      disable: isDebug
    }),
    //把第三方组件分开打包，只需执行npm run dll打包一次
    new webpack.DllReferencePlugin({
      context: __dirname,//与DllPlugin中的context保持一致
      /*这个地址对应webpack.dll.conf.js中生成的那个json文件的路径，这样webpack打包的时候
      会检测当前文件中的映射，不会把已经存在映射的包再次打包进bundle.js */
      manifest: require('./vendor-manifest.json')
    }),
    // HappyPack开启多个线程打包资源文件
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    })
  ]
};
if (isDebug){ 
  //热更新前提是添加webpack.HotModuleReplacementPlugin插件
  config.plugins.push(HMR)}
else{
  config.plugins.push(cleanDist)
};
module.exports = config;
