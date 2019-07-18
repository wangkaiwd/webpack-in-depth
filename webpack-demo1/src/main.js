import style from './assets/styles/main.scss';
import avatar from './assets/images/avatar.jpeg';
import alipay from './assets/fonts/alipay.svg';
import './utils/printSomething'
console.log('img and font', avatar, alipay);
console.log('Hello webpack!');
const createElement = (content, tag, className) => {
  const element = document.createElement(tag);
  if (tag === 'img') {
    element.src = content;
  } else {
    element.innerHTML = content;
  }
  if (className) {
    element.classList.add(className);
  }
  document.getElementById('root').appendChild(element);
};
createElement(avatar, 'img', style.box);

createElement(alipay, 'img', style.icon);

[1, 2, 3, 4].map(item => console.log(item))
if (module.hot) {
  module.hot.accept('./utils/printSomething', () => {
    console.log('update module');
  })
}