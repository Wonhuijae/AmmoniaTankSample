import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// 씬
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6e7c91);

// 라이트
const light = new THREE.AmbientLight(0xb6becc, 2);
scene.add(light)

// 캔버스
const canvas = document.querySelector('canvas.myCanvas')

// 렌더러
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        alpha: true,
        antialias: true
    }
)

// 웹브라우저 크기
const sizes =
{
    width: innerWidth,
    height: innerHeight
}

// 카메라
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000)
camera.position.set(0, 0, -5)
scene.add(camera)

// 카메라 컨트롤
// const trackballControls = new TrackballControls(camera, renderer.domElement)
// trackballControls.rotateSpeed = 0.25;
// trackballControls.enableRotate = true;
// trackballControls.panSpeed = 0.05;     // 팬 속도
// trackballControls.zoomSpeed = 0.5
// trackballControls.staticMoving = false;
// trackballControls.dynamicDampingFactor = 0.1
// trackballControls.minDistance = 0.25;
// trackballControls.maxDistance = 1.5;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 0.2;
orbitControls.maxDistance = 2;
orbitControls.enableRotate = false;
orbitControls.zoomSpeed = 0.25;
orbitControls.enablePan = false;

let transformControls;
let dragControls;

// 음영처리
const spotLight = new THREE.SpotLight(0xffffff, 1.5, 2, -90 * Math.PI / 180, 0.3, 1);
spotLight.castShadow = true
scene.add(spotLight)

// 모델 로드
// const loader = new FBXLoader();
const loader = new GLTFLoader();
let model;

loader.load(
    './blobErrorTest.glb',
    (object) => {
        // model = object;
        model = object.scene;
        model.scale.set(0.1, 0.1, 0.1)

        model.castShadow = true
        model.receiveShadow = true;

        // transformControls = new TransformControls(camera, renderer.domElement)
        // scene.add(transformControls)

        dragControls = new DragControls(model, camera, renderer.domElement);

        scene.add(model)
        reset();
        // trackballControls.target.copy(centerPos);
    }
)

document.getElementById("resetBtn").addEventListener('click', reset);

// 렌더링
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera);

// 이벤트
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
});

function animate() {
    requestAnimationFrame(animate);

    // trackballControls.update();
    renderer.render(scene, camera);
}
animate();

function reset() {
    // trackballControls.reset()
    orbitControls.reset();

    model.position.set(0, 0, 0)
    model.rotation.set(0.45, 1, 0)
    camera.position.copy(model.position)
    camera.position.y += 0.1;
    camera.rotation.set(0, 0, 0)
    camera.position.z += 0.65

    spotLight.position.copy(camera.position)

    // 바운딩 박스
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    let centerPos = box.getCenter(center); // 중심점을 구한다.

    camera.lookAt(centerPos)
}

let isDragging = false;
let lastMousePos = new THREE.Vector2();

renderer.domElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastMousePos.set(event.clientX, event.clientY);
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - lastMousePos.x;
        //const deltaY = event.clientY - lastMousePos.y;

        const rotationSpeed = 0.005;
        model.rotation.y += deltaX * rotationSpeed;
        //model.rotation.x += deltaY * rotationSpeed;

        lastMousePos.set(event.clientX, event.clientY);
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;

    console.log(model.rotation)
});