import "./style.css";

//import three js library
import * as THREE from "three";

//scene is a container that holds all objects, camera, and lights
const scene = new THREE.Scene();

//perspective camera mimics what human eyes would see
//75 = field of view (of 360°)
//next is aspect ratio, based on user's browser window
//last numbers are for view frustrum to control which objects are visible to camera itself - with these numbers can see pretty much everything from the camera lens
const camera = new THREE.PerspectiveCamera(
  75,
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
camera.position.setZ(30);

//call render method, passing camera and scene as arguments
renderer.render(scene, camera);

//ADDIING OBJECTS

//three js has built in geometries (see documentation)

//geometry type
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

//material (the wrapping paper)
const material = new THREE.MeshBasicMaterial({
  color: "#F0B14B",
  wireframe: true,
});

//create mesh by combining geometry with material
const torus = new THREE.Mesh(geometry, material);

//add torus to the scene
scene.add(torus);

//recursive function that calls infinite loop to setup render method automatically
function animate() {
  //tell browswer you want to perform animation
  requestAnimationFrame(animate);

  //rotation along x-axis
  torus.rotation.x += 0.0082;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.012;

  renderer.render(scene, camera);
}

animate();
