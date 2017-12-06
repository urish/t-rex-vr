const scene = document.querySelector('#scene');
const trex = document.querySelector('#t-rex');
const remote = document.querySelector('#remote');
const wobbleAnimation = document.querySelector('#t-rex-wobble');

const cactusKinds = 7;

const distance = 30;
const cactusCount = 12;

function addCacti() {
  for (i = 0; i < cactusCount; i++) {
    let entity = document.createElement('a-entity');
    const angle = 360. / cactusCount * i;
    const cactusId = Math.ceil(cactusKinds * Math.random());
    entity.setAttribute('obj-model', {
      obj: `assets/cactus-${cactusId}.obj`
    });
    entity.setAttribute('scale', { x: 10, y: 10, z:10 });
    entity.setAttribute('material', { color: 'black' });
    entity.setAttribute('position', {
      x: distance * Math.cos(angle / 180 * Math.PI),
      y: 0,
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

function animateJump() {
  trex.removeChild(wobbleAnimation);
  return new Promise(resolve => {
    const cactusAnimation = document.querySelector('#jumpAnimation');
    const animationFragment = document.importNode(cactusAnimation.content, true);
    animationFragment.firstElementChild.addEventListener('animationend', () => {
      trex.appendChild(wobbleAnimation);
      resolve();
    });
    trex.appendChild(animationFragment);
  });
}

let jumping = false;
function jump() {
  if (!jumping) {
    jumping = true;
    jump()
      .then(() => jumping = false);      
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    animateJump();
  }
});

remote.addEventListener('buttondown', animateJump);

addCacti();
