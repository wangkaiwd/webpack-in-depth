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
经过前面知识的学习，这里我们主要来讲一下`webpack`的性能优化。

`webpack`的优化一般分为2个方面：  
* 打包速度优化
* 打包生成代码体积优化

对于打包速度优化，我们可以使用`speed-measure-webpack-plugin`来查看打包时各个`loader`和`plugin`花费的时间。

而针对于打包生成代码体积优化，我们可以使用`webpack-bundle-analyzer`来查看打包后各个模块的体积。

当完成这俩步之后，我们基本可以找出花费时间长和体积比较大的模块就可以进行针对有化。

#### 跟上技术的迭代(`Webpack,Node,Yarn,Npm`)
前端社区一直在前进，社区的开发者都会不断的优化自己的开源项目，不断修复过去存在的问题并不断进行性能方面的优化。

所以当我们使用比较新的工具时，就会体验到相较于之前版本更快的编译速度和解析时间，从而优化打包性能
#### 合理使用`loader`和`plugin`
`loader`和`plugin`使用之后会占用一定的性能，为了让他们占用的性能更少，推荐以下做法：  
* 确保使用的`loader`和`plugin`的可靠性： 最好使用官方推荐的
* 合理进行`loader`和`plugin`的配置:  比如我们可以为`babel-loader`设置缓存
* 保证`loader`和`plugin`的使用精简： 有些`loader`和`plugin`可能会用到开发环境，而生产环境不需要，我们需要进行合理精简

#### `resolve`参数合理配置
合理的配置`resolve`选项可以提升打包的速度。

比如我们经常在项目中会配置`webpack`引入文件的扩展名后缀：  
```js
...
resolve: {
  extensions: ['.js', '.jsx', '.ts', '.tsx']
}
...
```
之后我们就可以这样写代码：  
```js
import demo1 from './demo1'; // demo1.js
import demo2 from './demo2'; // demo2.jsx
import demo3 from './demo3'; // demo3.ts
import demo4 from './demo4'; // demo4.tsx
```
这里我们也可以将`.css,.png,.jpg`等也进行配置，让我们引用这些文件的时候也更加的方便。但是当我们配置的扩展后缀变多之后,`webpack`会花费比较多的时间来分析文件后缀，导致打包时间增加。

#### 使用`DllPlugin`提高打包速度
在我们日常工作中，会用到很多来自于`npm`的第三方模块，大多数情况下我们是不会去更改这些第三方模块的代码的，只在少数情况对这些模块进行版本升级。

而`webpack`并不知道这些模块不会发生变化，`webpack`会在我们每次打包和重新打包的时候对所有依赖项进行分析和编译，这会花费很多的时间。

`DllPlugin`能够让我们单独配置一个`webpack`配置文件来单独提前打包这些不会经常发生变化的文件。它会生成一个`manifest.json`文件，用来让`DLLReferencePlugin`将相关的依赖映射到主`webpack`配置中。

这样配置之后，`webpack`就不会再打包`DllPlugin`处理过的文件，而是直接将打包好的内容直接进行引用。这样就可以节省很多用来处理这些不经常变动文件的时间，从而大幅提升打包速度。

首先我们需要再新建一个`webpack.dll.js`配置文件： 
```js
const path = require('path');
const webpack = require('webpack');
const absPath = (dir) => path.resolve(__dirname, dir);
const package = require('../package.json');
module.exports = {
  mode: 'production',
  entry: {
    // 将所有生产环境依赖项都进行提前打包：react,react-dom,lodash,dayjs,core-js
    vendor: Object.keys(package.dependencies)
  },
  // 设置打包生成文件存放目录
  output: {
    path: absPath('../dll'),
    filename: '[name]_[hash].dll.js',
    // 这里要将打包内容进行暴露
    library: '[name]_[hash]'
  },
  plugins: [
    // 
    new webpack.DllPlugin({
      // name: 对应output中library暴露的全局变量，分析生成manifest.json
      name: "[name]_[hash]",
      path: absPath("../dll/manifest.json"),
    })
  ]
}
```

在`package.json`中配置快捷方式：  
```json
{
  "build:dll": "rm -rf ./dll && webpack --config ./config/webpack.dll.js",
}
```
使用`yarn build:dll`提前打包不经常变动的文件。

使用`add-asset-html-webpack-plugin`结合`DllReferencePlugin`来引入提前打包好的文件：  
```npm
yarn add add-asset-html-webpack-plugin -D
```

```js
// webpack.config.js
...
plugins: [
  // 将打包后的js文件引入到html中
  new AddAssetHtmlPlugin({
    filepath: absPath('../dll/*.dll.js'),
  }),
  // 分析manifest.json文件来映射到项目中的相关依赖
  new webpack.DllReferencePlugin({
    manifest: require(absPath('../dll/manifest.json'))
  })
]
...
```
当随着安装依赖渐渐变多，项目逐渐扩大的时候，`DllPlugin`的优势会逐渐显示出来。

当然，你可能感觉`DllPlugin`的配置过程有些复杂，不用担心，开源社区中有现成的`plugin`来帮我们实现这个功能： [`autodll-webpack-plugin`](https://github.com/asfktz/autodll-webpack-plugin)

#### 合理利用缓存
在实际开发中，我们每次启动项目和打包项目时，其实做的改动并不是很大。所以我们如果能够合理将之前打包结果进行合理缓存，那么下一次打包就可以很好的利用之前的缓存，提高打包速度。

在一些`loader`或者`plugin`的配置中会有缓存选项，如我们常用的`babel-loader`：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-cache-babel-loader.png)

社区也有很好用的插件来为我们缓存`webpack`内部模块的处理步骤： [`HardSourceWebpackPlugin`](https://github.com/mzgoddard/hard-source-webpack-plugin)

当然，由于缓存的存在也会多多少少引发一些异常的`bug`，所以我们也应该适时的清空缓存。

#### 控制包文件大小
小即是快！

当我们的项目体积比较小的话，打包速度也会比较快，所以我们要尽量使用按需引入以及避免使用不必要的依赖来减小代码体积，侧面提升打包速度。

#### 合理使用`source map`
当启用不同的`source map`的时候会很大程度上影响`webpack`的打包速度。

所以我们要通过合理的配置做到又不会较大的影响打包速度还能方便我们`debug`，快速定位到错误代码的源文件位置。

常用的配置如下：  
* `development`: `cheap-module-eval-source-map`
* `production`: `cheap-module-source-map`

#### 开发环境内存编译

在开发环境中，我们使用`webpack-dev-server`,它并没有真的生成打包文件，而是将打包文件存入电脑的内存中，提升了编译速度。
