import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// 씬
const scene = new THREE.Scene();

// 라이트
const light = new THREE.AmbientLight(0xb6becc, 2);
scene.add(light)

// 캔버스
const canvas = document.querySelector('canvas.myCanvas')

// 렌더러
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        // alpha: true,
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, -5)
scene.add(camera)

// 카메라 컨트롤
const controls = new TrackballControls(camera, renderer.domElement)
controls.rotateSpeed = 0.25;
controls.enableRotate = true;
controls.panSpeed = 0.05;     // 팬 속도
controls.zoomSpeed = 0.5
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1
controls.minDistance = 0.25;
controls.maxDistance = 1.5;

// 음영처리
const spotLight = new THREE.SpotLight(0xffffff, 10, 0, -90 * Math.PI / 180);
spotLight.castShadow = true
scene.add(spotLight)

// 모델 로드
const loader = new FBXLoader();
let model;

loader.load(
    './AmmoniaTank-0501.fbx',
    (object) => {
        model = object;
        model.scale.set(0.001, 0.001, 0.001)
        model.rotation.y = -90 * Math.PI / 180

        // 바운딩 박스
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        let centerPos = box.getCenter(center); // 중심점을 구한다.

        model.castShadow = true
        spotLight.position.copy(centerPos)
        spotLight.position.y += 1

        camera.position.copy(model.position)
        camera.position.z -= 0.6
        scene.add(model);

        camera.lookAt(centerPos)
        controls.target.copy(centerPos);
    }
)


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

    controls.update();
    renderer.render(scene, camera);
}
animate();