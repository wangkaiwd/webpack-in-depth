import avatar from './avatar.jpeg';
import createAvatar from './createAvatar'
// import style from './main.scss';
import './assets/fonts/iconfont.css'
import './main.scss'

// const img = document.createElement('img');
// img.src = `./dist/${avatar}`;
// img.classList.add(style.avatar);
// document.body.appendChild(img);
// createAvatar()
const div = document.createElement('div');
div.innerHTML = `<i class="iconfont wb-thumb-up"></i>`;
document.body.appendChild(div);
console.log('test watch command,hahahas');


const button = document.createElement('button');
button.innerHTML = '新增';
document.body.appendChild(button);

button.onclick = function () {
  const p = document.createElement('p');
  p.classList.add('item');
  p.innerHTML = 'item';
  document.body.appendChild(p)
}

