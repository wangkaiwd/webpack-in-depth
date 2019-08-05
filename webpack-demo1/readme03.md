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

## 优化命令行构建信息

## 项目中使用`TypeScript`

## `webpack`性能优化小结

### 跟上技术的迭代(`Node,Yarn,Npm`)

### 在尽可能少的模块上应用`loader`

### `Plugin`尽可能精简并确保可靠性

### `resolve`参数合理配置

### 使用`DllPlugin`提高打包速度

### 控制包文件大小

### 多进程打包：`thread-loader`,`parallel-webpack`,`happypack`

### 合理使用`source map`

### 结合`stats`分析打包结果

### 开发环境内存编译
