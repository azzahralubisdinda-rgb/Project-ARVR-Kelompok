import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from '../vendor/mindar/mindar-image-three.prod.js';
import { setStatus, setupStartButton } from './common.js';

let mixer, actionClip;

async function loadData() {
  const res = await fetch('./data/info.json');
  const data = await res.json();
  document.getElementById('info-title').textContent = data.poster.title;
  document.getElementById('info-desc').textContent = data.poster.description;
}

async function start() {
  const mindarThree = new MindARThree({
    container: document.getElementById('container'),
    imageTargetSrc: './targets/target-card.mind' 
  });
  
  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, 1, 1);
  scene.add(dirLight);

  const loader = new GLTFLoader();
  loader.load('./assets/maskot.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2); 
    anchor.group.add(model);

    mixer = new THREE.AnimationMixer(model);
    if (gltf.animations.length > 0) {
      // Putar animasi pertama (idle) secara otomatis
      mixer.clipAction(gltf.animations[0]).play(); 
      
      // Simpan animasi untuk dieksekusi oleh tombol
      if (gltf.animations.length > 1) {
        actionClip = mixer.clipAction(gltf.animations[1]); // Jika ada gerakan kedua (aksi)
      } else {
        actionClip = mixer.clipAction(gltf.animations[0]); // Jika hanya ada satu gerakan, putar ulang dari awal
      }
    }
  });

  // --- INI ADALAH LOGIKA KLIK TOMBOL YANG BARU DITAMBAHKAN ---
  document.getElementById('btn-action').addEventListener('click', () => {
    console.log("Tombol Putar Animasi ditekan!");
    if (actionClip) {
      actionClip.reset().play(); // Memutar animasi
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Memberikan efek getar pada HP
    }
  });

  anchor.onTargetFound = () => {
    setStatus('Target ditemukan', 'found');
    document.getElementById('hud').style.display = 'block';
    document.getElementById('info-panel').style.display = 'block';
    loadData();
    if (navigator.vibrate) navigator.vibrate(100);
  };

  anchor.onTargetLost = () => {
    setStatus('Mencari target...', 'searching');
    document.getElementById('hud').style.display = 'none';
    document.getElementById('info-panel').style.display = 'none';
  };

  await mindarThree.start();
  setStatus('Mencari target...', 'searching');

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  });
}

setupStartButton(start);