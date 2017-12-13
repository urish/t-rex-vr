if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    console.log('loaded')
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
const scene = document.querySelector('#scene');
const elephant = document.querySelector('#elephant');
const remote = document.querySelector('#remote');
const wobbleAnimation = document.querySelector('#t-rex-wobble');

const mode = '3dio';
const cactusIds = ['70369520-e9bb-4895-9d7e-c32a64df3db3', 'f8b69c6b-74f0-40f9-916f-c5293f27fe10'];
const cactusKinds = 7;

const distance = 40;
const cactusCount = 12;
const jumpAccelerationTreshold = 20;


function addCacti() {
  // create cactus entitites and generate random positions and rotations
  for (i = 0; i < cactusCount; i++) {
    let entity = document.createElement('a-entity');
    let angle = 360. / cactusCount * i;
    if (Math.random() > 0.5) {
      angle -= 360. / cactusCount + 8;
    }
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

    const cactusIndex = Math.ceil(cactusKinds * Math.random());

    // use basic black cactus models
    if (mode === 'basic') {
      entity.setAttribute('obj-model', {
        obj: `assets/cactus-${cactusIndex}.obj`
      });
      entity.setAttribute('scale', { x: 10, y: 10, z: 10 });
      entity.setAttribute('material', { color: 'black' });
    } else {
      entity.setAttribute('io3d-furniture', `id: ${cactusIds[cactusIndex % 2]}`)
      entity.setAttribute('scale', { x: 9, y: 9, z: 9 });
    }
    // add cactus to the scene
    scene.appendChild(entity);
  }
}

function animateJump() {
  elephant.removeChild(wobbleAnimation);
  elephant.setAttribute('rotation', { x: 0, y: 90, z: 0 });
  return new Promise(resolve => {
    const jumpAnimation = document.querySelector('#jumpAnimation');
    const animationFragment = document.importNode(jumpAnimation.content, true);
    animationFragment.firstElementChild.addEventListener('animationend', () => {
      elephant.appendChild(wobbleAnimation);
      resolve();
    });
    elephant.appendChild(animationFragment);
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
 
