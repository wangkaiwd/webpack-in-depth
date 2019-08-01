const loaderUtils = require('loader-utils');

module.exports = function (source) {
  const callback = this.async();
  setTimeout(() => {
    const options = loaderUtils.getOptions(this);
    console.log(options);
    callback(null, source.replace('webpack-loader', options.name));
  }, 2000);
};
