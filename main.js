const filters = document.querySelectorAll('.filters input');
const image = document.querySelector('img');
const output = document.querySelectorAll('output');
const buttons = document.querySelector('.btn-container');
const btns = document.querySelectorAll('.btn');
const openBtn = document.querySelector('.btn-open')
const nextBtn = document.querySelector('.btn-next');
const resetBtn = document.querySelector('.btn-reset');
const loadBtn = document.querySelector('.btn-load');
const fileInput = document.querySelector('input[type="file"]');
const canvas = document.querySelector('canvas');
const saveBtn = document.querySelector('.btn-save');
const fullscreenBtn = document.querySelector('.fullscreen');
const application = document.documentElement;
const span = document.querySelectorAll('.filters label span');

const srcObj = {
  'day': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/day/',
  'evening': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/',
  'morning': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/morning/',
  'night': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/night/'
};
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;

function addActiveClass(button) {
  btns.forEach(btn => {
    if (btn.classList.contains('btn-active')) {
      btn.classList.remove('btn-active')
    }
    button.classList.add('btn-active')
  });
}
function handlerUpdate() {
  this.nextElementSibling.value = this.value;
  
  const suffix = this.dataset.sizing;
  application.style.setProperty(`--${this.name}`, this.value + suffix);
  this.previousElementSibling.innerText = this.value + suffix;
}
function showButtons() {
  buttons.classList.toggle('btn-container--active');
  openBtn .classList.toggle('btn-open--active');

}
function resetValues() {
  addActiveClass(resetBtn);
  filters.forEach(item => {
    item.value = item.getAttribute('value');
    const suffix = item.dataset.sizing;
    application.style.setProperty(`--${item.name}`, item.value + suffix)
  });
  output.forEach(item => {
    const atrName = item.previousElementSibling.getAttribute('name');
    if (atrName === 'saturate' || atrName === 'brightness' || atrName === 'opacity') item.value = 100;
    else item.value = 0;
  });
  span.forEach(elem => {
    const atrName = elem.nextElementSibling.getAttribute('name');
    const suffix = elem.nextElementSibling.dataset.sizing;
    if (atrName === 'saturate' || atrName === 'brightness' || atrName === 'opacity') elem.innerText = 100+suffix;
    else elem.innerText = 0+suffix;
  });
}
function viewImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = img.src;
  };
}
function getImage() {
  addActiveClass(nextBtn);

  const data = new Date();
  const hours = data.getHours();
  let interval;
  if (hours >= 0 && hours < 6) interval = 'night';
  if (hours >= 6 && hours < 12) interval = 'morning';
  if (hours >= 12 && hours < 18) interval = 'day';
  if (hours >= 18 && hours < 24) interval = 'evening';

  const index = i % images.length;
  const imageSrc = srcObj[interval] + images[index];
  viewImage(imageSrc);
  i++;
  nextBtn.disabled = true;
  setTimeout(function () { nextBtn.disabled = false }, 1000);
}
function loadImage() {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    image.src = img.src;
  }
  reader.readAsDataURL(file);
  fileInput.value = '';
}
function fullScreenOpen() {
  if (application.requestFullscreen) {
    application.requestFullscreen();
  }
};
function fullScreenClose() {
  if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
function drawImage() {
  addActiveClass(saveBtn);
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = `
    blur(${output[0].value * image.naturalHeight / image.height}px)
    invert(${output[1].value}%)
    sepia(${output[2].value}%)
    saturate(${output[3].value}%)
    hue-rotate(${output[4].value}deg)
    `;
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL()
    link.click();
    link.delete;
  }
}
//+++++++++++++++++++++++++++++++++++++++++++++
filters.forEach(item => item.addEventListener('input', handlerUpdate));
openBtn.addEventListener('click', showButtons);
resetBtn.addEventListener('click', resetValues);
nextBtn.addEventListener('click', getImage);
loadBtn.addEventListener('click', () => addActiveClass(loadBtn));
fileInput.addEventListener('change', loadImage);
saveBtn.addEventListener('click', drawImage);
fullscreenBtn.addEventListener('click', fullScreenOpen);
fullscreenBtn.addEventListener('click', fullScreenClose);