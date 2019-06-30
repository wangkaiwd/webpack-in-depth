// import "@babel/polyfill"; // 直接引入会将所有的语法的兼容写法都引入，导致打包文件比较大
// 尽管没有配置babel,但是在chrome中也能执行，应为新版chrome对es6语法的支持比较好
// 为了兼容低版本浏览器，需要使用babel
const arr = [new Promise(() => { }), new Promise(() => { })]
arr.map(item => {
  console.log(item);
})