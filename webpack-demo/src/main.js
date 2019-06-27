import avatar from './avatar.jpeg';
import createAvatar from './createAvatar'
// import style from './main.scss';
import './assets/fonts/iconfont.css'

// const img = document.createElement('img');
// img.src = `./dist/${avatar}`;
// img.classList.add(style.avatar);
// document.body.appendChild(img);

// createAvatar()
const div = document.createElement('div');
div.innerHTML = `<i class="iconfont wb-thumb-up"></i>`;
document.body.appendChild(div);

