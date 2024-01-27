import SceneRenderer from "./2d_renderer.js";


const sceneRenderer = new SceneRenderer();

sceneRenderer.init(document.getElementById('2d-scene-renderer'));


window.addEventListener('background-image-change', (evt) => {
    let url = evt.detail;
    sceneRenderer.setBackgroundImage(url);
})