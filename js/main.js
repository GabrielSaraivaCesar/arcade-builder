import SceneRenderer from "./2d_renderer.js";


const sceneRenderer = new SceneRenderer();

sceneRenderer.init(document.getElementById('2d-scene-renderer'));


window.addEventListener('background-image-change', (evt) => {
    let url = evt.detail;
    sceneRenderer.setBackgroundImage(url);
})
window.addEventListener('board-model-change', (evt) => {
    let model = evt.detail;
    sceneRenderer.changeBoardModel(model);
})
document.getElementById('export-img-btn').addEventListener('click', () => {
    sceneRenderer.downloadRenderImage();
})
window.addEventListener('board-layout-change', (evt) => {
    let layout = evt.detail;
    sceneRenderer.changeBoardLayout(layout);
})
window.addEventListener('layout-invert-change', (evt) => {
    sceneRenderer.setLayoutInvertState(evt.detail);
})
