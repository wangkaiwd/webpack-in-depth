import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// 这里虽然只用到了add方法，但是连minus方法也一块儿打包了
// Tree Shaking: 摇树，会将我们代码中没有用到的代码摇落。
// 只支持ES Module模块化方式，require引入并不支持
//  使用方式：
//  开发环境： mode: development
//    1. 通过optimization中配置 usedExports:true
//    2. 在package.json中添加： sideEffects: false(sideEffects用来指定哪些文件不使用tree shaking,即不删除代码中有副作用的代码)
//        副作用：简单来讲就是并不是使用某个某块导出的东西，而是要用到这个代码中的逻辑。 举个例子： import "@babel/ployfill",并没有导出内容
//               但是我们需要文件中的逻辑以及文件中的一些css: import "*.css"。这样的文件可以通过数组的形式在sideEffects中
//              进行配置
//  生产环境: 默认开启usedExports:true，我们需要在sideEffects中配置其它不需要导出，但是不能被删除的文件
import { add } from './utils/math'
console.log(add(1, 2));
class App extends Component {
  render() {
    return <div>Hello React and Webpack!!!!</div>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))