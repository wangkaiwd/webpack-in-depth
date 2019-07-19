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

### 魔法注释
### `SplitChunksPlugin`的配置学习
### `MiniCssExtractPlugin`拆分`css`代码

## 打包文件分析(`bundle analysis`)
