// import React from 'react'
// import { render } from 'react-dom'
// import join from 'lodash/join'
import "./assets/styles/base.scss"
import _ from 'lodash'
const div = document.createElement('div');
div.innerHTML = _.join(['webpack', 'CodeSplitting'], '--');
document.body.appendChild(div);
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
// const renderElement = () => {
//   return import(
//     /* webpackPrefetch: true */
//     /* webpackChunkName:"lodash" */
//     'lodash/join'
//   ).then(({ default: join }) => {
//     const div = document.createElement('div');
//     div.innerHTML = join(['react', 'webpack'], '--');
//     return div
//   })
// }
// const renderReactDOM = () => {
//   return import(/* webpackChunkName:"react-dom" */'react-dom').then(({ default: ReactDOM }) => {
//     return ReactDOM
//   })
// }
// // 通过import()语法实现模块懒加载，当然在使用该语法的时候一定要添加polyfill来进行代码转义
// // 这里只有在点击浏览器文档的时候，才会对引入lodash
// document.addEventListener('click', () => {
//   renderElement().then(div => document.body.appendChild(div))
//   // Promise.all(renderElement(), renderReactDOM()).then(result => {
//   //   const [div, ReactDOM] = result
//   //   ReactDOM.render(div, document.getElementById('root'))
//   // })
// })



// class App extends Component {
//   arr = [1, 2, 3]
//   render() {
//     return (
//       <div>
//         Hello React and Webpack!!!!
//         <ul>
//           {this.arr.map(item => (<li key={item}>{item}</li>))}
//         </ul>
//       </div>
//     )
//   }
// }

// ReactDOM.render(<App />, document.getElementById('root'))

console.dir(process.env.MODE)
//  注册Service Worker
if ('serviceWorker' in navigator && (process.env.mode === 'prod')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (res) => {
        console.log('SW registered', res);
      },
      (err) => {
        console.log('failed', err);
      }
    )
  })
}

let hello: string = 'hello ts';
console.log(hello)