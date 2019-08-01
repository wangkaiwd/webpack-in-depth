// loader只是导出为一个函数的模块，函数的this上下文将由webpack填充，所以我们不能将函数定义为箭头函数
// 第一个参数为符合匹配规则的源代码
module.exports = function (source) {
  // 将内容返回
  return source.replace('webpack', 'webpack-loader');
};
