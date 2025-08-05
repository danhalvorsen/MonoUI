import { Canvas2DRenderer } from 'mr-abstract-components';
import { DemoObject } from './DemoObject';

const canvas = document.getElementById('app') as HTMLCanvasElement;
const renderer = new Canvas2DRenderer(canvas);

// Create a few demo objects
const box1 = new DemoObject('box1', '#ff5555');
box1.position.x = 150;
box1.position.y = 150;

const box2 = new DemoObject('box2', '#55ff55');
box2.position.x = 400;
box2.position.y = 300;

const objects = [box1, box2];

function loop() {
  renderer.clear();
  objects.forEach(obj => {
    obj.rotation += 0.01;
    obj.updateWorldMatrix();
    renderer.renderObject(obj);
  });
  requestAnimationFrame(loop);
}

renderer.initialize();
loop();
