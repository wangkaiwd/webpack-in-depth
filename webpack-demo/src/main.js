import demo1 from './demo1';
import demo2 from './demo2';
import avatar from './avatar.jpeg';

console.log('info', demo1, demo2, avatar);
const img = document.createElement('img');
img.src = `./dist/${avatar}`;
document.body.appendChild(img);

