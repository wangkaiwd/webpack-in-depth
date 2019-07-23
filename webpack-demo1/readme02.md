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


### `MiniCssExtractPlugin`拆分`css`代码

## 打包文件分析(`bundle analysis`)
