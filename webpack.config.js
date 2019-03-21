const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebapckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const isDebug = process.env.NODE_ENV === "development";
const HMR = new webpack.HotModuleReplacementPlugin();
const cleanDist=  new CleanWebpackPlugin("dist")

const config = {
  //设置了 mode 之后会把 process.env.NODE\_ENV 也设置为 development 或者 production。然后在 production 模式下，会默认开启 UglifyJsPlugin 等等一堆插件。
  mode: isDebug ? "development" : "production",  
  resolve: {
       //自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
   extensions: [" ",".js",".css",".json"],
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
    historyApiFallback: true,
    disableHostCheck: true
  },
  devtool: "cheap-eval-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/,
          chunks: "initial",
          name: "vender",
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
          loader: "babel-loader"
         
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
      chunks: ["vender", "index"]
    }),
    new HtmlWebapckPlugin({
      template: "detail.html",
      filename: "detail.html",
      chunks: ["vender", "detail"]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      // chunkFilename: "[name].css",
      disable: isDebug
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