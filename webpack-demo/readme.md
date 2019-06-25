## 最简单的打包操作
### 安装
在使用`webpack`之前我们要安装`webpack`,安装命令如下：  
```npm
# 创建webpack-demo文件夹
mkdir webpack-demo
# 生成package.json文件，对项目依赖进行管理
yarn init -y
# 安装webpack相关依赖
yarn add webpack webpack-cli -D
```
这里我们安装`webpack-cli`的原因是因为它可以让我们可以在命令行中运行`webpack`,否则`webpack`将无法运行

### 生成打包文件

接下来我们再当前目录下新建几个文件来进行演示：  
```js
// demo1.js
const demo1 = 'demo1';
export default demo1;
// demo2.js
const demo2 = 'demo2';
export default demo2;
// main.js
import demo1 from './demo1';
import demo2 from './demo2';

console.log('info', demo1, demo2)
```

之后我们再命令行中执行：  
```npm
npx webpack main.js
```
执行命令之后会发现目录结构中多了如下文件：  
![first-build](../screenshots/first-build.png)

这时我们将打包好的文件通过`index.html`引入：  
```html
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <script src="./dist/main.js"></script>
</body>

</html>
```

在浏览器中打开`html`文件，控制台中已经成功输出：  
![first-console](../screenshots/first-console.png)

### 使用配置文件
使用命令行实现一些简单的`webpac`配置比较快捷，而实际项目中的`webpack`配置比较复杂，创建一个`webpack`配置文件来执行会更加高效。

接下来我们在目录下新建`scr`目录，然后将源代码`demo1.js,demo2.js,main.js`移入进行集中管理。完成之后我们回到项目根目录，建立`webpack.config.js`文件来实现`webpack`的各种配置，并添加如下代码：  
```js
const path = require('path');
module.exports = {
  // 入口： 打包`./scr/index.js`文件
  entry: './src/main.js',
  // 出口： 在./dist目录下输出创建的打包文件
  output: {
    filename: 'main.js', // 输出文件的名称
    path: path.resolve(__dirname, './dist') // 输出文件的目录，要设置为绝对路径
  }
}
```

在书写完配置文件之后，在命令行中运行：  
```npm
npx webpack
```

执行命令之后，可以成功看到和通过命令行执行完全一样的效果。

### `NPM`脚本(`NPM Scripts`)
使用`CLI`这种方式来运行本地的`webpack`进行打包不是特别方便，我们可以设置一个快捷方式命令。在`package.json`中添加一个`script`来进行命令的简写：  
```json
"scripts": {
  "build": "webpack",
},
```
> 这里的`webpack`其实是`webpack --config webpack.config.js`的简写，由于`webpack`的默认配置为`webpack.config.js`,所以我们可以将其简写为`webpack`。而当配置文件用其他名字来命名的话，就需要通过`--config`来指定对应的配置文件

配置好之后，命令行中运行：  
```npm
yarn build
```
可以看到目录下又成功出现了打包好的文件，到这里我们完成了一次最简单的`webpack`打包。