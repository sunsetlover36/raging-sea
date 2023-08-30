import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

/**
 * Base
 */
// GUI
const debugObject = {
  depthColor: '#126897',
  surfaceColor: '#4dbbff',
};
const gui = new dat.GUI({ width: 340 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Water mesh
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(4, 4, 1024, 1024);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uBigWavesElevation: {
      value: 0.15,
    },
    uBigWavesFrequency: {
      value: new THREE.Vector2(3, 1.5),
    },
    uTime: {
      value: 0,
    },
    uBigWavesSpeed: {
      value: 0.75,
    },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 2.5 },
    uSmallWavesSpeed: { value: 0.15 },
    uSmallWavesIterations: { value: 5 },
    uDepthColor: {
      value: new THREE.Color(debugObject.depthColor),
    },
    uSurfaceColor: {
      value: new THREE.Color(debugObject.surfaceColor),
    },
    uColorOffset: {
      value: 0.2,
    },
    uColorMultiplier: {
      value: 4,
    },
  },
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#001111');

// GUI tweaks
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uBigWavesElevation');
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWavesFrequencyX');
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWavesFrequencyY');
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
  .min(0)
  .max(5)
  .step(0.001)
  .name('uBigWavesSpeed');
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uSmallWavesElevation');
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
  .min(0)
  .max(30)
  .step(0.001)
  .name('uSmallWavesFrequency');
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.001)
  .name('uSmallWavesSpeed');
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, 'value')
  .min(0)
  .max(5)
  .step(1)
  .name('uSmallWavesIterations');
gui
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uColorOffset');
gui
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uColorMultiplier');
gui.addColor(debugObject, 'depthColor').onChange((value) => {
  waterMaterial.uniforms.uDepthColor.value.set(value);
});
gui.addColor(debugObject, 'surfaceColor').onChange((value) => {
  waterMaterial.uniforms.uSurfaceColor.value.set(value);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
