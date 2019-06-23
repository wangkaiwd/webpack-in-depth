### `Webpack`到底是什么？
首先我们看一下维基百科的定义：  
> `Webpack`是一个开源的前端打包工具。`Webpack`提供了前端开发缺乏的模块化开发方式，将各种资源视为模块，并从它生成优化过的代码。`Webpack`可以从终端、或是更改`webpack.config.js`来设置各项功能。要使用`Webpack`前须安装`Node.js`。`Webpack`其中一个特性是使用加载器来将资源转换成模块。开发者可自定义加载器的顺序、格式来因应项目的需求

接下来我们再看一下官网的定义：  
> A bundler for javascript and friends. Packs many modules into a few bundled assets. Code Splitting allows for loading parts of the application on demand. Through "loaders", modules can be CommonJs, AMD, ES6 modules, CSS, Images, JSON, Coffeescript, LESS, ... and your custom stuff.

用我比较拙劣的英文水平翻译成中文大概是这样： 
> 一个`javascript`打包工具。分析代码结构，将资源打包成有相互依赖关系的模块。`Webpack`可以通过代码分割来按需加载你的应用，也可以通过加载器(`loader`)使CommonJs, AMD, ES6 模块化, CSS, Image, JSON, Coffeescript, LESS以及你自定义的一些东西可以在浏览器直接运行。