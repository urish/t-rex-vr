const scene = document.querySelector('#scene');

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

addCacti();
