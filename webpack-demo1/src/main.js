import style from './assets/styles/main.scss';

console.log('Hello webpack!');
const createElement = (content, tag = 'div', className) => {
  const element = document.createElement(tag);
  element.innerText = content;
  if (className) {
    element.classList.add(className);
  }
  document.getElementById('root').appendChild(element);
};
createElement('box1');
createElement('box2', 'div', style.box);