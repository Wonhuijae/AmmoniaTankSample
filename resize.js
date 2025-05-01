// 이벤트
export function resizeHandler(renderer, camera, sizes, scene) {
    function OnWindowResize() {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        renderer.shadowMap.enabled = true;
        renderer.render(scene, camera)
    }

    window.addEventListener('resize', OnWindowResize);

    OnWindowResize()
}