import avatar from './avatar.jpeg';

function createAvatar() {
  const img = document.createElement('img');
  img.src = `./dist/${avatar}`;
  img.classList.add('avatar');
  document.body.appendChild(img);
}
export default createAvatar