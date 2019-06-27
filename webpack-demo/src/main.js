import demo1 from './demo1';
import demo2 from './demo2';
import avatar from './avatar.jpeg';
import createAvatar from './createAvatar'
import style from './main.scss';

const img = document.createElement('img');
img.src = `./dist/${avatar}`;
img.classList.add(style.avatar);
document.body.appendChild(img);

createAvatar()

