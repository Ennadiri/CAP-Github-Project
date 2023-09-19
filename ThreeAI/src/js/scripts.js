import * as THREE from 'three';
import * as YUKA from 'yuka';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.setClearColor(0xE0E0E0);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 20, 0);
camera.lookAt(scene.position);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight); 

const vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
vehicleGeometry.rotateX(Math.PI * 0.5);
const vehicleMaterial = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);
//
//vehicleMesh.add(carLabel);
//
const vehicle = new YUKA.Vehicle();

vehicle.setRenderComponent(vehicleMesh, sync);

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add( new YUKA.Vector3(-4, 0, 4));
path.add( new YUKA.Vector3(-6, 0, 0));
path.add( new YUKA.Vector3(-4, 0, -4));
path.add( new YUKA.Vector3(0, 0, 0));
path.add( new YUKA.Vector3(4, 0, -4));
path.add( new YUKA.Vector3(6, 0, 0));
path.add( new YUKA.Vector3(4, 0, 4));
path.add( new YUKA.Vector3(0, 0, 6));

/*

const vehicle1 = new YUKA.Vehicle();

vehicle.setRenderComponent(vehicleMesh, sync);

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}
const path1 = new YUKA.Path();
path1.add( new YUKA.Vector3(-2, 0, 2));
path1.add( new YUKA.Vector3(-3, 1, 1));
path1.add( new YUKA.Vector3(-1, 0, -1));

vehicle.position.copy(path1.current());

const followPathBehavior1 = new YUKA.FollowPathBehavior(path1, 0.5);
vehicle.steering.add(followPathBehavior1);

const onPathBehavior1 = new YUKA.OnPathBehavior(path1);
onPathBehavior1.radius = 2;
vehicle.steering.add(onPathBehavior1);

const entityManager1 = new YUKA.EntityManager();
entityManager.add(vehicle1);
*/

path.loop = true;

vehicle.position.copy(path.current());

//vehicle.maxSpeed = 3;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

function createCpointMesh(name, x, y, z) {
    const geo = new THREE.SphereGeometry(0.1);
    const mat = new THREE.MeshBasicMaterial({color: 0xFF0000});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.name = name;
    return mesh;
}

const group = new THREE.Group();

const sphereMesh1 = createCpointMesh('sphereMesh1', -4, 0, 4);
group.add(sphereMesh1);

const sphereMesh2 = createCpointMesh('sphereMesh2', -6, 0, 0);
group.add(sphereMesh2);

const sphereMesh3 = createCpointMesh('sphereMesh3', -4, 0, -4);
group.add(sphereMesh3);

const sphereMesh4 = createCpointMesh('sphereMesh4', 0, 0, 0);
group.add(sphereMesh4);

const sphereMesh5 = createCpointMesh('sphereMesh5', 4, 0, -4);
group.add(sphereMesh5);

const sphereMesh6 = createCpointMesh('sphereMesh6', 6, 0, 0);
group.add(sphereMesh6);

const sphereMesh7 = createCpointMesh('sphereMesh7', 4, 0, 4);
group.add(sphereMesh7);

const sphereMesh8 = createCpointMesh('sphereMesh8', 0, 0, 6);
group.add(sphereMesh8);

scene.add(group);

const p = document.createElement('p');
p.className = 'tooltip';
const pContainer = document.createElement('div');
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);

const mousePos = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', function(e) {
      mousePos.x = (e.clientX / this.window.innerWidth) * 2 - 1;
      mousePos.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObject(group);
      if(intersects.length > 0){
        switch(intersects[0].object.name) {
               case 'sphereMesh1':
                p.className = 'tooltip show';
                cPointLabel.position.set(-4, 0.8, 4);
                p.textContent = 'Checkpoint 1 (-4, 0, 4)'
                break;
            
                case 'sphereMesh2':
                p.className = 'tooltip show';
                cPointLabel.position.set(-6, 0.8, 0);
                p.textContent = 'Checkpoint 1 (-6, 0, 0)'
                break;

                case 'sphereMesh3':
                p.className = 'tooltip show';
                cPointLabel.position.set(-4, 0.8, -4);
                p.textContent = 'Checkpoint 1 (-4, 0, -4)'
                break;
                        
                case 'sphereMesh4':
                p.className = 'tooltip show';
                cPointLabel.position.set(0, 0.8, 0);
                p.textContent = 'Checkpoint 1 (0, 0, 0)'
                break;

                case 'sphereMesh5':
                p.className = 'tooltip show';
                cPointLabel.position.set(4, 0.8, -4);
                p.textContent = 'Checkpoint 1 (4, 0, -4)'
                break;

                case 'sphereMesh6':
                p.className = 'tooltip show';
                cPointLabel.position.set(6, 0.8, 0);
                p.textContent = 'Checkpoint 1 (6, 0, 0)'
                break;

                case 'sphereMesh7':
                p.className = 'tooltip show';
                cPointLabel.position.set(4, 0.8, 4);
                p.textContent = 'Checkpoint 1 (4, 0, 4)'
                break;

                case 'sphereMesh8':
                p.className = 'tooltip show';
                cPointLabel.position.set(0, 0.8, 6);
                p.textContent = 'Checkpoint 1 (0, 0, 6)'
                break;
        
            default:
                break;
        }
      }else{
          p.className = 'tooltip hide';
      }
});

const carP = document.createElement('p');
const carLabel = new CSS2DObject(carP);
carLabel.position.set(0, 3, 0);

vehicleMesh.add(carLabel);

/*const p = document.createElement('p');
p.textContent = 'Hello';
//const cPointLabel = new CSS2DObject(p);
//scene.add(cPointLabel);
//cPointLabel.position.set(-6, 0.8, 4);

const div = document.createElement('div');
div.appendChild(p);
const divContainer = new CSS2DObject(div);
scene.add(divContainer);*/



const position = [];
for(let i = 0; i < path._waypoints.length; i++) {
    const waypoint = path._waypoints[i];
    position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

const time = new YUKA.Time();

function animate() {
    const delta = time.update().getDelta();
    entityManager.update(delta);
    labelRenderer.render(scene, camera);
    carP.textContent = 'Current speed: ' + vehicle.getSpeed().toFixed(2);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
});