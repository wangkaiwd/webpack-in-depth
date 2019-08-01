## 安装
在使用`webpack`之前我们要安装`webpack`,安装命令如下：  
```npm
# 创建webpack-demo文件夹
mkdir webpack-demo
# 生成package.json文件，对项目依赖进行管理
yarn init -y
# 安装webpack相关依赖
yarn add webpack webpack-cli -D
```
这里我们安装`webpack-cli`的原因是因为它可以让我们可以在命令行中运行`webpack`,否则`webpack`命令将无法运行

## 生成打包文件
接下来我们建立`src`目录来管理我们的源代码，并建立`main.js`文件，写入第一行代码：  
```js
console.log('Hello webpack!')
```

接下来我们在项目根目录建立`webpack`的配置文件`webpack.config.js`并进行最简单的配置：  
```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  }
}
```

之后我们通过`package.json`文件中的`script`命令来为`webpack`添加快捷命令:  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-build-shortcut.png)

配置好后通过命令行执行：`yarn build`，会发现根目录出现了`dist`目录，里边有我们的代码`main.js`。

接下来我们在根目录新建`index.html`，通过`script`标签将打包后的代码引入并在浏览器中打开：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-html-hello.png)

或者可以通过`node`命令来运行打包文件：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-node-hello.png)

到这里我们成功打包好了我们的第一个文件，感觉还是有些小激动的。

## 入口和出口
在配置之前，我们先简单理解下入口和出口的概念：
* 入口(`entry`): 整个项目的起始模块，用来作为构建其内部依赖图的开始
* 出口(`output`): 告诉`webpack`打包后的文件所存放的目录

这里是一个打包截图：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack_build_info.png)

了解了基本概念之后，我们来看一下常用的相关配置：  
```js
entry: {
  main: './src/main.js' // 入口文件对应的源代码位置，key值为打包生成后的chunkNames
},
output: {
  path: absPath('../dist'), // 打包生成文件存放的位置
  // 使用每次构建过程中，唯一的hash生成
  filename: '[name]_[hash:8].js', // 每个打包输出文件的名称
  chunkFilename: '[name]_[hash:8]_chunk.js', // 非入口chunk文件的名称(及通过代码分割从入口文件分割出来的文件打包名称)
  // publicPath: 'https://cdn.example.com/assets/', // 会在引入的资源前加入该路径，例：将资源托管到cnd
},
```
在配置文件中我们使用了`[name]`这种符号，这是`webpack`中的占位符(`placeholder`)，这里介绍下配置中使用到的，如果小伙伴们感兴趣可以自己查阅官方文档：  
* `[name]`: 模块名称
* `[hash]`: 模块标识符的`hash`(每次打包都会生成对应唯一的`hash`值)

## 打包模式
在`webpack`中，我们可以通过`mode`选项，来分别为生成环境打包和开发环境打包使用相应的内置优化：  
```js
mode: 'development' 
```
目前我们的配置是开发环境: `development`,当我们使用`production`的时候，`webpack`会将我`node`中的全局变量改为： `process.env.NODE_ENV`的值设置为`production`,并且也会启用代码压缩等功能，有助于帮我们减少代码体积，提升用户体验。

而当我们使用`development`模式时，`webpack`会将`process.env.NODE_ENV`的值设置为`development`,并取消代码压缩等功能，提升开发体验

## 使用插件
在`webpack`中，我们可以使用各种各样的插件来自定义`webpack`构建过程,方便我们的开发。

这里我们介绍2个常用的`plugin`：  
* `HtmlWebpackPlugin`:  自动创建一个`html`文件来帮我们引入打包文件，这对我们每次打包都通过`hash`值来生成不同的打包文件的情况特别有用
* `CleanWebpackPlugin`: 在打包之前删除`output.path`指定的位置中的文件，保证每次打包都是最新的文件

首先我们来安装这俩个插件：  
```npm
yarn add --dev html-webpack-plugin clean-webpack-plugin
```

接下来我们再`webpack`中使用这2个插件：  
```js
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html', // 生成html文件的文件名
    template: './index.html' // 使用的html模板
  }),
  new CleanWebpackPlugin()
]
```

这里我们通过为`html-webpack-plugin`来指定根目录下的`index.html`为模版，生成打包后的`index.html`。新生成的`index.html`文件与模板文件不同之处在于会自动引入打包生成的文件(包括`js`文件、`css`文件、以及之后配置的`dll`文件)，这样即使我们使用了`[hash]`等占位符，插件也会自动帮我们动态引入资源，而不用我们每次手工配置。

使用`HtmlWebpackPlugin`指定`template`的原因是因为我们可以在模板文件中自己写一些我们自己的代码，比如引入一些`css`或者执行一段`js`脚本亦或者我们可以在模板文件中指定项目的根元素：  
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <!-- 在模板中指定根元素，方便开发时为其中插入元素 -->
  <div id="root"></div>
</body>

</html>
```

通过使用插件我们目前解决了如下问题：  
1. 不用再手动引入打包文件
2. 不用在重新打包的时候手动去删除旧的打包文件

## 使用`loader`
下面是对`webpack`官网中`loader`介绍的一步分摘抄：
> `loader`用于对模块的源代码进行转换  
> 特性(这里只列出了部分):  
> * `loader`支持链式传递，链中每个`loader`会将转换应用在已处理过的资源上。一组链式的`loader`将按照相反的顺序执行。链中的第一个`loader`将其结果(也就是转换后的资源)传递给下一个`loader`，依次类推
> * `loader`可以通过`options`对象配置
> * 插件可以为`loader`带来更多特性

我个人觉得其实`loader`就是让`webpack`可以识别各种资源，然后将资源加工处理成浏览器可以识别的、兼容性更好的、性能更好的代码。

接下来我们学习如何通过`loader`来让`webpack`处理各种资源。

### 项目中使用`css`
要想使用`css`文件`，我们首先需要安装`style-loader`和`css-loader`：  
```npm
yarn add style-loader css-loader -D
```
在`webpack.config.js`进行配置：  
```js
module: {
  rules: [
    {
      test: /.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```
但是日常的项目中，有很多`css`属性需要添加浏览器供应商前缀来确保兼容性, 我们可以使用`postcss-loader`结合`autoprefixer`来实现：  
```npm
yarn add postcss-loader autoprefixer -D
```
我们需要为`css`文件添加`postcss-loader`,之后在根目录新建`postcss.config.js`配置`autoprefixer`:  
```js
// webpack.config.js
rules: [
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'
    ]
  }
]

// postcss.config.js
module.exports = {
  plugins: [
    // autoprefixer: parse CSS and add vendor prefixes to CSS rule using values from can I use
    // 解析CSS并使用Can I use 中的值 将供应商前缀添加到css规则中
    require('autoprefixer')
  ]
};
```
平常我们也会用到`css`预处理器来方便开发，这里我们以`sass`为例：  
```npm
yarn add sass-loader node-sass -D
```
在`webpack`中添加如下配置： 
```js
{
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ]
}
``` 

这里要特别注意`loader`的顺序问题(反向：从下到上，从右到左)：  
* 首先通过`sass-loader`将`scss`文件中的语法解析为`css`语法
* 之后通过`postcss-loader`为对应的`css`属性添加浏览器供应商前缀
* 然后使用`css-loader`根据`import`语法将所有的`css`文件整合到一起
* 最后将`css-loader`整合的`css`文件通过`style`标签插入到`html`中，实现样式的更改

**如果顺序书写错误，会导致程序无法正常运行**

最终效果如下：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webapck-css.png)

学习了上面的知识以后，我们再了解几个`css-loader`的常用配置：  
````js
{
  test: /\.scss$/,
  use: [
    'style-loader',
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
}
````

### 项目中使用图片和字体图标
要想在项目中使用图片和字体图标，我们需要使用到`file-loader`:  
```npm
yarn add file-loader -D
```
需要在`webpack.config.js`中添加如下配置：  
```js
{
  test: /\.(png|svg|jpg|gif)$/,
  use: ['file-loader']
}
```
配置成功后`webpack`会将我们引入的资源转换为路径字符串，`webpack`会通过字符串帮我们找到文件的位置。

接下来我们尝试一下`file-loader`的几个配置项：  
```js
{
  test: /\.(png|svg|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        // placeholders:
        //    [ext]: 资源扩展名
        //    [name]: 资源的基本名称
        //    [hash]: 内容hash值
        //    [path]: 资源相对于context的路径
        // 默认值： [hash].[ext]
        name: '[name]_[hash:8].[ext]',
        // 打包文件存放到出口目录下的images文件中
        outputPath: 'images/'
      }
    }
  ]
}
```
打包文件如下：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-img-font.png)

这里也可以使用`url-loader`来处理静态资源，`url-loader`的工作方式和`file-loader`相同，但是它会在文件小于限制大小(单位`byte`)的时候，返回`base64`字符串，当大于限制大小时会返回和`file-loader`一样的地址字符串。

这在处理一些小文件的时候不用再进行资源请求，可以提高性能
```js
{
  test: /\.(png|svg|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        // placeholders:
        //    [ext]: 资源扩展名,默认file.extname
        //    [name]: 资源的基本名称,默认file.basename
        //    [hash]: 内容hash值,默认md5
        //    [path]: 资源相对于context的路径,默认值file.dirname
        // 默认值： [hash].[ext]
        name: '[name]_[hash:8].[ext]',
        // 打包文件存放到出口目录下的images文件中
        outputPath: 'images/',
        limit: 8192, // 单位byte,文件小于8kb时返回base64文件，大于这个限制会返回地址
      }
    }
  ]
}
```
我们可以看一下打包区别：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-url-loader.png)

## `source map`配置
当我们使用`webpack`进行代码打包以后，如果代码出现错误，会很难追踪到错误和警告在源代码中的原始位置。为了更容易地追踪错误和警告，`JavaScript`提供了`SourceMap`功能，可以将编译后的代码映射回原始源代码。

`webpack`中配置如下：  
```js
// 此选项控制是否生成，以及如何生成source map
devtool: 'none',
```
可选项如下：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-devtool-options.png)

这里简单介绍下各配置项中单词的一些含义，方便理解：  
* `cheap`: 不会生成列映射，只会映射行数
* `eval`： 每个模块都使用`eval`执行,并且都有`//@sourceURL`
* `module`：会处理来自`loader`的`source map`
* `inline`: `source map`转换为`DataUrl`后添加到`bundle`中

日常的开发中我们会进行如下配置：  
* 开发环境： `cheap-module-eval-source-map`
* 生产环境： `cheap-module-source-map`(生产环境使用`source map`，方便定位错误)

## 区分不同环境的配置文件
在开发环境和生产环境中，我们要用到的`webpack`配置是不同的，这里我们在根目录下分别新建`webpack.dev.js`和`webpack.prod.js`来分别存放开发环境和生产环境所需要的配置，通过原有的`webpack.config.js`来存放公共的配置文件。

接下来我们使用`webpack-merge`来进行配置文件的合并工作:  
```npm
yarn add webpack-merge -D
```
为了方便统一管理，我们根目录下新建`config`文件夹，然后将配置文件放到里边,现在的配置文件是这样的：  
```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const absPath = (dir) => path.resolve(__dirname, dir)
module.exports = {
  entry: {
    main: absPath('../src/main.js') // 入口文件对应的源代码位置，key值为打包生成后的chunkNames
  },
  output: {
    path: absPath('../dist'), // 打包生成文件存放的位置
    // 使用每次构建过程中，唯一的hash生成
    filename: '[name]_[hash].js', // 每个打包输出文件的名称
    // publicPath: 'https://cdn.example.com/assets/', // 会在引入的资源前加入该路径，例：将资源托管到cnd
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // placeholders:
              //    [ext]: 资源扩展名,默认file.extname
              //    [name]: 资源的基本名称,默认file.basename
              //    [hash]: 内容hash值,默认md5
              //    [path]: 资源相对于context的路径,默认值file.dirname
              // 默认值： [hash].[ext]
              name: '[name]_[hash:8].[ext]',
              // 打包文件存放到出口目录下的images文件中
              outputPath: 'images/',
              limit: 8192, // 单位byte,文件小于8kb时返回base64文件，大于这个限制会返回地址
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 自动引入打包后的文件到html中：
    //    对于每次打包都会重新通过hash值来生成文件名的情况特别适用
    //    也可以通过template来生成一个我们自己定义的html模板，然后帮我们把打包后生成的文件引入
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成html文件的文件名
      template: absPath('../index.html') // 使用的html模板
    })
  ]
};
// webpack.dev.js
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map'
})
// webpack.prod.js
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin()
  ]
})
```
然后我们在`package.json`中分别为开发环境和生产环境添加打包快捷命令：  
```json
"scripts": {
  "build": "webpack --config ./config/webpack.prod.js",
  "start": "webpack --config ./config/webpack.dev.js"
},
```
现在目录结构是这样的：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-distinguish-environment.png)

接下来我们就可以直接使用`yarn build`和`yarn start`命令来分别为开发环境和生产环境进行打包了

## `webpackDevServer`方便开发和调试
现在我们在每次修改代码后，都需要再次重新打包文件，并在浏览器中打开生成的`html`文件。而且由于是本地打开`html`文件，诸如请求代理、局域网内预览等功能便无法使用。

`webpack-dev-server`为我们提供了一个简单的`web`服务器，能够实时重新加载(`live reloading`)修改后的代码,并且也提供了如`proxy`等功能来支持我们跨域请求接口，极大的方便了开发。
```npm
yarn add webpack-dev-server -D
```

之后我们在开发环境的`webpack`配置中添加如下配置：
```js
devServer: {
  // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
  contentBase: absPath('../dist'),
  // 是否在启动服务时自动打开浏览器
  open: true,
  // 端口在没有设置的时候默认为8080
  port: 3000
}
```

当然，这样更改之后我们要通过`webpack-dev-server`来执行开发时的配置文件：  
```js
// "start": "webpack --config ./config/webpack.dev.js"
"start": "webpack-dev-server --config ./config/webpack.dev.js"
```
执行`yarn start`:
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-dev-server-start.png)

### 实现代码的热模块更新
当我们在开发过程中修改一些代码的时候，我们可能只是想让我们当前修改的内容生效，而不是造成整个页面的刷新，导致我们每次修改都要重新之前的步骤来验证我们的代码。

在`webpack`中我们通过如下配置来实现模块热替换的功能(`hot module replacement`),当然这个功能只在开发环境开启: 
```js
// webpack.dev.js
devServer: {
  // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
  contentBase: absPath('../dist'),
  // 是否在启动服务时自动打开浏览器
  open: true,
  // 端口在没有设置的时候默认为8080
  port: 3000,
  // 启用webpack的模块热替换特性
  hot: true
},
plugins: [
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
]
```
和之前配置的区别有2个：  
* 为`devServer`添加配置项： `hot: true`
* 新增2个`webpack`的插件： `webpack.NameModulesPlugin`和`webpack.HotModuleReplacementPlugin`

然后这样只能实现`css`文件的热更新，对于`js`的热更新，我们还需要添加一下代码：  
```js
// accept接收2个参数： 1. dependencies: 一个字符串或字符串数组  2. callback: 模块更新后触发的函数
if (module.hot) {
  module.hot.accept('./utils/printSomething', () => {
    console.log('update module');
  })
}
```
页面中的效果如下：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-hot-module-replacement.png)

大家可能会发现我们在写`css`和类似于`vue`和`react`框架代码的时候，并没有自己手写`module.hot.accept`方法，这是框架和`css`的`loader`已经帮我们进行了自动处理，我们只需要关注代码的书写即可。

## 使用`babel`转义`es6`语法
在日常工作中，我们会使用很多`es6`里的新语法，这些语法在我们目前使用的`chrome`新版浏览其中一般都可以很好的支持，但是在一些国产浏览器或者低版本浏览器中可能会出现兼容性问题。  

这里我们需要通过`babel-loader`来进行语法的转义：  
```npm
yarn add babel-loader @babel/core @babel/preset-env -D
```
在`webpack`中进行配置：  
```js
// webpack.config.js 中添加一个loader配置项
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }
},
```

项目根目录建立`.babelrc`文件，并加入如下代码：  
```js
{
  "presets": [
    "@babel/preset-env"
  ]
}
```
[文档地址](https://babeljs.io/setup#installation)

这样配置之后，项目中的`Promise`，`map`等语法依旧不会进行转换，这里我们使用`@babel/polyfill`来转换这些语法：  
```npm
yarn add @babel/polyfill -D
```
`.babelrc`进行如下配置：  
```js
{
  "presets": [
    [
      "@babel/env",
      {
        // 为低版本引入babel/polyfill
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
        },
        // 使用useBuiltIns要指定corejs
        "corejs": "2",
        // 只对项目中用到的`esnext`语法进行polyfill处理
        "useBuiltIns": "usage",
      }
    ]
  ]
}
```

这样配置之后就可以通过`babel`来转换`esnext`的一些语法，并且可以兼容低版本和国产浏览器。由于使用到了`useBuiltIns:usage`，只会对我们使用到的新语法进行转换，减少了`polyfill`的体积

## 配置`react`开发环境
在学习完以上内容以后，我们需要搭建一个支持`react`框架语法的`webpack`配置。

首先我们安装相应的依赖：  
```npm
yarn add react react-dom
yarn add @babel/preset-react @babel/plugin-proposal-class-properties -D
```

`.babelrc`中配置如下：  
```js
{
  "presets": [
    [
      "@babel/env",
      {
        // 为低版本引入babel/polyfill
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
        },
        // 使用useBuiltIns要指定corejs
        "corejs": "2",
        // 只对项目中用到的`esnext`语法进行polyfill处理
        "useBuiltIns": "usage",
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
```

之后我们在入口文件`main.js`中写入如下代码：  
```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  state = {
    number: 10
  }
  render() {
    return (
      <div>
        hello Webapck React
        <h2>{this.state.number}</h2>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
执行`yarn start`命令：  
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/webpack-react.png)

到这里为止,我们已经可以搭建一个简单的`react`开发环境，之后我们可以继续学习一些`webpack`的高级概念。


