import "./style.css";
import darkSpace from "./dark.jpg";
import planetTextureImage from "./images/planet_texture.jpg";
import planetImage from "./images/planet.jpg";

//import three js library
import * as THREE from "three";

//allows us to move around the scene using mouse
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//scene is a container that holds all objects, camera, and lights
const scene = new THREE.Scene();

//perspective camera mimics what human eyes would see
//35 = field of view (of 360°)
//next is aspect ratio, based on user's browser window
//last numbers are for view frustrum to control which objects are visible to camera itself - with these numbers can see pretty much everything from the camera lens
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//renders actual graphics to scene
//arguments is which DOM elements to use for render
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);

//makes canvas full screen
renderer.setSize(window.innerWidth, window.innerHeight);

//moves camera along Z-axis, better perspective when start adding shpaes
camera.position.setZ(90);

//call render method, passing camera and scene as arguments
renderer.render(scene, camera);

//
//
//ADDIING TORUS
//three js has built in geometries (see documentation)

//geometry type
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

//material (the wrapping paper)
const material = new THREE.MeshStandardMaterial({
  color: 0x191218,
});

//create mesh by combining geometry with material
const torus = new THREE.Mesh(geometry, material);

//add torus to the scene
scene.add(torus);

//
//
//LIGHTING
//add lighting to scene (three js has many styles)
const pointLight = new THREE.PointLight(0xffffff);
//position of light (x, y, z values)
pointLight.position.set(8, 8, 8);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//light helper shows you the position of light source
//grid helper shows 2D grid for scene
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

//add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//
//
//ADDITIONAL OBJECTS

//STARS
function addStar() {
  // SphereGeometry argument is radius
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xdce7f4 });
  const star = new THREE.Mesh(geometry, material);

  //setting random x, y, z position values for each star
  //fill array w 3 values
  //then map values to three js random float spread function
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

//calls the addStar func to make 400 stars
Array(400).fill().forEach(addStar);

//SPACE BACKGROUND
const spaceTexture = new THREE.TextureLoader().load(darkSpace);
scene.background = spaceTexture;

//PLANET
const planetTexture = new THREE.TextureLoader().load(planetImage);
const planetDepth = new THREE.TextureLoader().load(planetTextureImage);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    normalMap: planetDepth,
  })
);

scene.add(planet);
planet.position.x = 18;
planet.position.y = 18;

//
//
//SCROLL BEHAVIOUR
function moveCamera() {
  //calculate where user is currently scrolled to
  const t = document.body.getBoundingClientRect().top;

  //rotate planet while scrolling
  planet.rotation.x += 0.05;
  planet.rotation.y += 0.075;
  planet.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

//initiates function every time user scrolls
document.body.onscroll = moveCamera;

//
//
//ANIMATE FUNCTION
//recursive function that calls infinite loop to setup render method automatically
function animate() {
  //tell browswer you want to perform animation
  requestAnimationFrame(animate);

  //rotation along x-axis
  torus.rotation.x += 0.0082;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.012;

  //updates changes to orbit controls
  controls.update();

  renderer.render(scene, camera);
}

animate();
