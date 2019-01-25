const scene = document.querySelector('#scene');
const trex = document.querySelector('#t-rex');
const remote = document.querySelector('#remote');
const winControlsRight = document.querySelector('#win-controls-right');
const winControlsLeft = document.querySelector('#win-controls-left');
const wobbleAnimation = document.querySelector('#t-rex-wobble');

const cactusKinds = 7;

const distance = 40;
const cactusCount = 12;
const jumpAccelerationTreshold = 20;

function addCacti() {
  for (let i = 0; i < cactusCount; i++) {
    let entity = document.createElement('a-entity');
    let angle = 360. / cactusCount * i;
    if (Math.random() > 0.5) {
      angle -= 360. / cactusCount + 8;
    }
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
  trex.setAttribute('rotation', {x: 0, y: 0, z: 0});
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
    animateJump()
      .then(() => jumping = false);      
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    jump();
  }
});

window.addEventListener('devicemotion', (e) => {
  const accel = e.accelerationIncludingGravity;
  if (accel && accel.x > jumpAccelerationTreshold) {
    jump();
  }
}, true);

remote.addEventListener('buttondown', jump);
winControlsRight.addEventListener('triggerdown', jump);
winControlsLeft.addEventListener('triggerdown', jump);

addCacti();
