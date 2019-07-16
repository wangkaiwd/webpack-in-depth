import style from './assets/styles/main.scss';
import avatar from './assets/images/avatar.jpeg';
import alipay from './assets/fonts/alipay.svg';

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
// createElement('box1');
createElement(avatar, 'img', style.box);

createElement(alipay, 'img', style.icon);