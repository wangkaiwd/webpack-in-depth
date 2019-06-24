### 最简单的打包操作

```npm
npx webpack
```
`webpack`的默认配置文件是`webpack.config.js`,在我们没有自己实现的情况下，会使用官方默认的打包配置，我们也可以通过自己在根目录下建立`webpack.config.js`来进行`webpack`打包配置的修改。

可以同过`--config`来指定打包配置文件
```npm
npx webpack --config webpack.config.dev.js
```

组织代码结构，将源代码放入`scr`目录下，修改`webpack`打包入口文件为`./src/index.js`:  
```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build')
  }
}
```

为了简化打包命令，我们可以通过`package.json`中`script`来进行命令的简写：  
```json
"scripts": {
  "bundle:default": "webpack",
  "bundle:dev": "webpack --config webpack.config.dev.js" 
},
```