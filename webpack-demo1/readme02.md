## `Tree Shaking`
`Tree Shaking`的中文意思是:摇树，它可以移除`JavaScript`上下文中的未引用代码(`dead-code`)。它只支持`es6`中的`import`和`export`语法，所以并不会应用到`require`语法中。

我们先通过一个简单的例子来简单理解下`Tree Shaking`到底有什么作用：  
```js
// math.js
const add = () => {
  console.log('add');
}

const minus = () => {
  console.log('minus');
}
// console.log('math');
export { add, minus }

// main.js
import { add } from './utils/math'

add();
```
这里我们新建了一个`math.js`文件，并导出了`add`和`minus`俩个方法，而在`main.js`中，我们只是用到了`add`方法。这里没有用到的`minus`就是上下文中未引用代码，需要我们在打包时删除掉`minus`方法。

在开发环境中，我们要在`webpack`中进行如下配置：  
```js
optimization: {
  // 该选项在production环境中默认开启
  usedExports: true
}
```
这样之后`webpack`可以识别出哪些代码是用到的，哪些代码是没有用到的，可是并不会将代码进行移除：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-dev-treeshaking.png)  

我们还要结合`package.json`的`sideEffects`属性来实现：  
```json
{
  // sideEffects可以将文件标记为没有副作用
  "sideEffects": false
}
```
这里的`sideEffects`用来指定有副作用的文件，它也可以配置为一个数组：  
```json
{
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```

> 副作用： 在导入时会执行特殊行文的代码，而不是仅仅暴露一个或多个`export`。上边代码中被注释掉的`console.log('math')`就是副作用。

对于生产环境,它的`usedExports`属性默认为`true`,即支持`tree shaking`，然后自动识别通过`import`和`export`语法导入和导出模块的文件中没有引用到的部分而进行删除，我们只需要指定`mode:production`即可。

要想使用`tree shaking`,需要满足以下几点要求：  
* 使用`es2015`模块语法
* 在项目`package.json`文件中添加`sideEffect`配置项来制定副作用文件
* 使用`production`模式来开启`optimization`的一些默认优化(比如`usedExports:true`和代码压缩)

经过实际测试，发现在设置`package.json`中的`sideEffects`只是在生产环境生效，而且当移除该配置项的时候，对应没有用到的代码也不会进行打包，所以这里先不设置`sideEffects`。

## 代码分割(`Code Splitting`)
随着我们项目的功能和需求的不断扩展，所生成代码的体积也会越来越大，如果这些内容都加载到入口文件的话，会导致项目的加载时间越来越长。

`webpack`中的代码分割可以防止一个文件打包后的体积过大而导致加载时间过长的问题。`code splitting`可以把代码分割到不同的`bundle`中，然后可以按需加载或并行加载文件。这样我们可以获取到更小的打包资源，并通过控制资源加载优先级，来合理设置页面加载时间。


### 动态导入
`webpack`默认支持对`es6`中的`import()`语法引入的模块进行代码分割，这里我们以`lodash`的引入为例，代码和打包结果如下:  
```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  state = {
    number: 10,
    text: ''
  }
  componentDidMount = () => {
    this.dynamicLodash()
  }
  dynamicLodash = () => {
    import('lodash').then(({ default: _ }) => {
      this.setState({ text: _.join([1, 2, 3], '-') })
    })
  }
  render() {
    const { text } = this.state
    return (
      <div>
        hello Webapck React
        <h2>{this.state.number}</h2>
        <h1>{text}</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
这里我们通过`import()`语法来动态引入`loadash`,和使用`import`引入的效果区别如下: 

分割前：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-sync-import.png)
分割后：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-dynamic-imports.png)

为了可以更清晰的看到打包出来的文件的信息，我们可以通过`webpack`提供的魔法注释(`magic comments`)来对分割的`chunk`进行命名：  
```js
import(/*webpackChunkName: "lodash"*/'lodash')
```
打包后效果如下:  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-dynamic-import-comments.png)
这样我们可以很清晰的看到打包后的文件名。

### `SplitChunksPlugin`的配置学习
有小伙伴可能注意到，我们在项目中还引入了`React`和`ReactDOM`。像这样使用同步方式引入的代码能不能也进行代码分割呢？

答案是可以的，配置如下：  
```js
// webpack.config.js
optimization: {
  splitChunks: {
    // 代码分割的类型，可以设置为'all','async','initial',默认是'async`
    // 'all': 对同步和异步引入模块都进行代码分割
    // 'async: 只对异步引入模块进行代码分割
    // 'initial': 只对同步代码进行代码分割
    chunks: 'all',
    // 代码分割模块的最小大小要求，不满足不会进行分割，单位byte
    minSize: 30000,
    // 如果分割模块大于该值，还会再继续分割，0表示不限制大小
    maxSize: 0,
    // 最小被引用次数，只有在模块上述条件并且至少被引用过一次才会进行分割
    minChunks: 1,
    // 最大的异步按需加载次数
    maxAsyncRequests: 5,
    // 最大的同步按需加载次数
    maxInitialRequests: 3,
    // 分割模块打包chunk文件名分割符：'~'
    automaticNameDelimiter: '~',
    automaticNameMaxLength: 30,
    // 分割文件名，设置为true会自动生成
    name: true,
    cacheGroups: { // 缓存组
      vendors: {
        // 分割模块匹配条件
        test: /[\\/]node_modules[\\/]/,
        // 权重
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        // 是否使用已有的chunk，设置为true表示如果使用到的文件已经被分割过了
        // 就不会再进行分割，生成新的分割文件
        reuseExistingChunk: true
      }
    }
  }
}
```
这里我们只将`chunks`设置为`all`，其它的使用`splitChunksPlugin`的默认配置即可：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-split-chunk-all.png)

### `Prefetching和PreLoading`
当进行了代码分割之后，有些分割后的模块可能并不需要进行立即加载，我们可以先将一些必要的内容先进性加载，之后再在浏览器和网络的空闲时间，加载其它内容。

工作中的使用场景是这样的：我们经常用到的模态框组件，并不需要在页面一开始就加载资源，而是需要在用户点击之后才显示。所以我们可以将这部分资源在页面主要内容加载完成后，利用浏览器和网络的空闲时间来加载模态框对应的资源，可以很好的减少浏览器的压力，合理利用带宽资源来提高用户提验和页面加载性能。

在`webpack`中为我们提供了`Prefetching`和`Preloading`这俩个方法来进行资源加载优化：  
* `prefetch`: 加载的内容可能会在未来的任何时间被使用，它会在主文件加载完毕并且利用浏览器的空闲时间来进行资源请求
* `preloading`: 加载的内容会被主文件立即用到，拥有中等程度的资源加载优先权，并且会在页面加载时立即和主文件平行使用浏览器提供的资源。

这里我们分别通过`prefetch`和`preloading`来加载`lodash`和`dayjs`模块，看看它们之间的区别：  
```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
class App extends Component {
  state = {
    number: 10,
    text: '',
    time: ''
  }
  componentDidMount = () => {
  }
  dynamicLodash = () => {
    import(
      /* webpackChunkName: "lodash" */
      /* webpackPrefetch: true */
      'lodash').then(({ default: _ }) => {
        this.setState({ text: _.join([1, 2, 3], '-') })
      })
  }
  dynamicDayjs = () => {
    import(
      /* webpackChunkName: "dayjs" */
      /* webpackPreload: true */
      'dayjs').then(({ default: dayjs }) => {
        this.setState({ time: dayjs(new Date()) })
      })
  }
  render() {
    const { text, time } = this.state
    return (
      <div>
        hello Webapck React
        <h2>{this.state.number}</h2>
        <h1>{text}</h1>
        <h1>{time}</h1>
        <button onClick={this.dynamicLodash}>load lodash</button>
        <button onClick={this.dynamicDayjs}>load dayJs</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-preload-prefetch.png)
### `MiniCssExtractPlugin`拆分`css`代码
在上文中我们介绍了`JavaScript`代码的分割，这里我们介绍如何将`CSS`文件从`JavaScript`中分离出来，并通过`link`标签引入到`html-webpack-plugin`生成的`html`文件中。

这需要使用到`webpack`的一个插件：`MiniCssExtractPlugin`。首先我们来安装它
```npm
yarn add mini-css-extract-plugin -D
```
然后进行如下配置：  
```js
// webpack.config.js
// module.rules
// 使用MiniCssExtractPlugin.loader来替换之前的style-loader
{
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
  ]
},
{
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        // 开启css模块化
        modules: true,
        // 在css-loader前应用的loader的数量：确保在使用import语法前先经过sass-loader和postcss-loader的处理
        importLoaders: 2
      }
    },
    'postcss-loader',
    'sass-loader'
  ]
},

// 在插件中添加对应的配置，配置项和出口文件的配置内容相同
// plugins:
plugins: [
  // 自动引入打包后的文件到html中：
  //    对于每次打包都会重新通过hash值来生成文件名的情况特别适用
  //    也可以通过template来生成一个我们自己定义的html模板，然后帮我们把打包后生成的文件引入
  new HtmlWebpackPlugin({
    filename: 'index.html', // 生成html文件的文件名
    template: absPath('../index.html') // 使用的html模板
  }),
  new MiniCssExtractPlugin({
    filename: '[name]_[hash:8].css',
    chunkFilename: '[name]_[hash:8]_chunk.css',
  }),
]
```
可以看到已经成功将`css`文件进行了拆分并在`index.html`中引入：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-extract-css.png)

## 打包文件分析(`bundle analysis`)

### 定义环境变量
