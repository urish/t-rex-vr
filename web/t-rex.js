const scene = document.querySelector('#scene');
const trex = document.querySelector('#t-rex');
const remote = document.querySelector('#remote');

const cactusKinds = [
  {svgFile: 'assets/cactus-1.svg', height: 9.14},
  {svgFile: 'assets/cactus-2.svg', height: 9.14},
  {svgFile: 'assets/cactus-5.svg', height: 8.95},
  {svgFile: 'assets/cactus-6.svg', height: 5.55},
];

const distance = 30;
const cactusCount = 16;

function addCacti() {
  for (i = 0; i < cactusCount; i++) {
    let entity = document.createElement('a-entity');
    const angle = 360. / cactusCount * i;
    const cactus = cactusKinds[Math.floor(cactusKinds.length * Math.random())];
    entity.setAttribute('svgfile', Object.assign({}, cactus, {
      color: 'black',
    }));
    entity.setAttribute('position', {
      x: distance * Math.cos(angle / 180 * Math.PI),
      y: cactus.height / 2,
      z: -distance * Math.sin(angle / 180 * Math.PI),
    });
    entity.setAttribute('rotation', {
      x: 0,
      y: angle + 90,
      z: 0,
    });
    scene.appendChild(entity);
  }
}

function jump() {
  return new Promise(resolve => {
    const cactusAnimation = document.querySelector('#jumpAnimation');
    const animationFragment = document.importNode(cactusAnimation.content, true);
    animationFragment.firstElementChild.addEventListener('animationend', () => {
      resolve();
    });
    trex.appendChild(animationFragment);
  });
}

let jumping = false;
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    if (!jumping) {
      jumping = true;
      jump()
        .then(() => jumping = false);      
    }
  }
});

remote.addEventListener('buttondown', jump);

addCacti();
