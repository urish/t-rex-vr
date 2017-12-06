const scene = document.querySelector('#scene');

const cactusKinds = [
  {svgFile: '../assets/cactus-1.svg', height: 9.14},
  {svgFile: '../assets/cactus-2.svg', height: 9.14},
  {svgFile: '../assets/cactus-5.svg', height: 8.95},
  {svgFile: '../assets/cactus-6.svg', height: 5.55},
];

function addCactus() {
  let entity = document.createElement('a-entity');
  const cactus = cactusKinds[Math.floor(cactusKinds.length * Math.random())];
  entity.setAttribute('svgfile', Object.assign({}, cactus, {
    color: 'black',
  }));
  entity.setAttribute('position', '30 2 -10');
  const cactusAnimation = document.querySelector('#cactusAnimation');
  const clone = document.importNode(cactusAnimation.content, true);
  clone.firstElementChild.addEventListener('animationend', () => {
    scene.removeChild(entity);
  });
  entity.appendChild(clone);
  scene.appendChild(entity);
}

setInterval(addCactus, 1000);
