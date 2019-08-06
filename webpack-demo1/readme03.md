### 打包库文件
有时候我们也会写一个库文件发布到`npm`中，这和我们之前的打包会有些不同。

> 这里假设我们要开发一个工具函数库，而且我们还用到了一个第三方依赖`loadash`。

由于我们写的是一个库文件，会让其它开发者来使用，所以我们需要将我们写的内容导出： 
```js
export * from './utils/math'
```

在其它开发者进行使用的时候，比较常用的有以下几种方式：  
* `script`标签
* `es6 import`
* `node require`

`webpack`的更改如下：  
```js
output: {
  library: 'MyTools', // 通过script引入库文件后，会添加一个全局变量MyTools,可以直接进行访问
  // umd: universal module definition,通用模块定义
  libraryTarget: 'umd' // 将你的library暴露为所有的模块定义下都可运行的方式
},
// 这里用户会自己安装loadsh
externals: { // 防止将某些import的包(package.json)打包到bundle中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)
  lodash: {
    commonjs: 'lodash', // 可以作为一个CommonJS模块访问
    commonjs2: 'loadash', // 和commonjs类似，但是到出的是module.exports.default
    amd: 'lodash', // 类似于commonjs，但是使用AMD模块系统
    root: '_' // 全局变量访问
  }
}
```

在打包好后就需要发布到`npm`,这里需要我们注册一个`npm`账号来进行发布。

> 使用`yarn`来进行演示，`npm`类似

首先我们需要通过在`package.json`中指定下面俩个字段：  
* `files`: 指定需要上传的目录(默认会包含`readme.md`、`license`、`package.json`)
* `main`: 库文件的入口文件

如果是`TypeScript`项目，还需要通过`types`字段来指定类型声明文件。

准备工作完成后，需要使用官方的`npm`源，笔者这里使用的是`nrm`:  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-nrm.png)

我们执行`yarn publish`命令，第一次需要用户名和密码。每一次都需要输入对应的版本号:  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-yarn-publish.png)
### 项目中使用`pwa`
`PWA`的全称是渐进式网络应用程序(`Progreessive Web Application`),是一种可以提供类似于原生应用程序(`native app`)体验的网络应用程序(`web app`)。

`PWA`中比较重要的一个功能是借助`Service Workers`的网络技术在离线(`offline`)时让应用程序能够继续运行功能。

这里我们使用`workbox-webpack-plugin`:  
```npm
yarn add workbox-webpack-plugin -D
```

在生产环境配置`PWA`，是项目支持离线访问:
```js
// webpack.prod.js
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = (env) => {
  return merge(baseConfig(env), {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      env.MODE === 'analysis' && new BundleAnalyzerPlugin(),
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助 ServiceWorkers 快速启用
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true
      })
    ].filter(Boolean)
  })
}
```

在入口文件中注册`serviceWorker`:  
```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('SW registered:', registration)
      }
    ).catch(
      registrationError => {
        console.log('SW registered failed:', registrationError)
      }
    )
  })
}
```

打包代码并通过启动一个`server`来运行代码：  
> 笔者使用[`serve`](https://github.com/zeit/serve)来搭建静态服务，有兴趣的小伙伴可以了解一下
```npm
yarn build
npx serve -s dist
```

之后我们停止`server`并刷新页面，发现页面还可以正常访问：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-service-worker.png)

可以在浏览器中查看对应的信息：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-chrome-service-workers.png)

### 优化命令行构建信息
当我们打包的时候，命令行会提示很多没有用的信息，导致输出信息比较乱。

`webpack`中我们可以通过`stats`来进行打包输出信息的控制：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-stats.png)

我们希望在打包发生错误时命令行才会输出信息：  
```js
stats: 'errors-only'
```
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-build-no-output.png)

这样打包后命令行什么信息都没有提示，而我们可能想要看到一个成功信息，`friendly-errors-webpack-plugin`插件可以用来完成这个功能：  
```npm
yarn add friendly-errors-webpack-plugin -D
```

在`webpack`中使用：  
```js
...
plugins: [
  ...
  new FriendlyErrorsWebpackPlugin()
  ...
]
...
```

打包效果：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-plugin-output.png)

### 项目中使用`TypeScript`

在2019年里，比较火的就是`TypeScript`，它可以很好的指定`JavaScript`的类型而且有更好的编辑器提示。

首先在项目中安装`TypeScript`,并且在根目录建立一个`tsconfig.json`: 
```npm
yarn add typescript
npx tsc --init
```

然后配置识别`.ts,.tsx`文件的`loader`，并添加文件后缀省略：  
```js
// webpack.config.js中新增如下配置
module: {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }
  ]
},
resolve: {
  extensions: [ '.tsx', '.ts', '.js' ]
}
```

之后我们在项目中使用`TypeScript`写一个`hello world`：  
```ts
const a: string = 'hello ts';
console.log(a)
```
浏览器中成功打印：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-ts-hello.png)

### `webpack`性能优化小结
经过前面知识的学习，这里我们主要来讲一下`webpack`的性能优化

#### 跟上技术的迭代(`Node,Yarn,Npm`)

#### 在尽可能少的模块上应用`loader`

#### `Plugin`尽可能精简并确保可靠性

#### `resolve`参数合理配置

#### 使用`DllPlugin`提高打包速度

#### 控制包文件大小

#### 多进程打包：`thread-loader`,`parallel-webpack`,`happypack`

#### 合理使用`source map`

#### 结合`stats`分析打包结果

#### 开发环境内存编译
