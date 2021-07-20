

//===================================================================
const filters = document.querySelectorAll('.filters input');
const image = document.querySelector('img');
const output = document.querySelectorAll('output');
const buttons = document.querySelector('.btn-container');


function handlerUpdate() {

  this.nextElementSibling.value = this.value;
  const suffix = this.dataset.sizing;
  application.style.setProperty(`--${this.name}`, this.value + suffix)
}
filters.forEach(item => item.addEventListener('input', handlerUpdate))

//===================================================================

function resetValues() {
  filters.forEach(item => {
    item.value = item.getAttribute('value');
    const suffix = item.dataset.sizing;
    application.style.setProperty(`--${item.name}`, item.value + suffix)
  });
  output.forEach(item => {
    item.value = 0;
  });
}

buttons.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-reset')) {
    resetValues()
  }
});
//===================================================================

const srcObj = {
  'day': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/day/',
  'evening': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/',
  'morning': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/morning/',
  'night': 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/night/'
};
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;
const nextBtn = document.querySelector('.btn-next')

function viewImage(src) {

  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = img.src;
  };
}

function getImage() {
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
nextBtn.addEventListener('click', getImage);

//===================================================================

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', function (e) {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    image.src = img.src;
  }
  reader.readAsDataURL(file);
  fileInput.value = '';
});

//===================================================================
const fullscreenBtn = document.querySelector('.fullscreen');
const application = document.documentElement;

const fullScreenOpen = () => {
  if (application.requestFullscreen) {
    application.requestFullscreen();
  }
};
//===================================================================

const fullScreenClose = () => {
  if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

fullscreenBtn.addEventListener('click', fullScreenOpen);
fullscreenBtn.addEventListener('click', fullScreenClose);
//===================================================================

const canvas = document.querySelector('canvas');
const saveBtn = document.querySelector('.btn-save');

function drawImage() {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = `
    blur(${output[0].value*image.naturalHeight/image.height}px)
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
  };
}
saveBtn.addEventListener('click', drawImage);



