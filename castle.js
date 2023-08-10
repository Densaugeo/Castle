import * as THREE from 'three';
export * as THREE from 'three';
import * as THREE_Densaugeo from './three.Densaugeo.js';
export * as THREE_Densaugeo from './three.Densaugeo.js';
import * as castleMap from './castle/castleMap.js';
export * as castleMap from './castle/castleMap.js';
import * as CastleModules from './castle/CastleModules.js';
export * as CastleModules from './castle/CastleModules.js';

////////
// UI //
////////

export const sidebar = new PanelUI.Sidebar();
sidebar.addButton({buttonName: 'land', faClass: 'fa-university', title: 'Landing page'});
sidebar.addButton({buttonName: 'help', faClass: 'fa-question', title: 'Help'});
sidebar.addButton({buttonName: 'shader', faClass: 'fa-eye', title: 'Change shader'});
sidebar.addButton({buttonName: 'fs', faClass: 'fa-arrows-alt', title: 'Fullscreen'});
sidebar.addButton({buttonName: 'contrast', faClass: 'fa-adjust', title: 'Flip Contrast'});
sidebar.addButton({buttonName: 'clear', faClass: 'fa-recycle', title: 'Clear local storage'});
sidebar.addButton({buttonName: 'shader_settings', faClass: 'fa-cog', title: 'Adjust shader settings'});

export const helpPanel = new CastleModules.HelpPanel();
export const shaderChanger = new CastleModules.ShaderChanger();
export const shaderPanel = new CastleModules.ShaderPanel();
export const objectPanel = new CastleModules.ObjectPanel();
export const picker = new THREE_Densaugeo.Picker();

if(HTMLElement.prototype.requestFullscreen == null) {
  HTMLElement.prototype.requestFullscreen = HTMLElement.prototype.msRequestFullscreen || HTMLElement.prototype.mozRequestFullScreen || HTMLElement.prototype.webkitRequestFullscreen || (() => {
    let message = 'Sorry, your browser does not allow fullscreen mode.'
    
    if(navigator.userAgent.includes('iPhone')) message += '\n\nYou appear to be using an iPhone. Apple does allow fullscreen on iPads, but not on iPhones.'
    
    alert(message)
  })
}
if(document.exitFullscreen == null) {
  document.exitFullscreen = document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
}
export const getFullscreenElement = function() {
  return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

export const darkColors = document.getElementById('dark_colors');
export const head = darkColors.parentNode;
export let contrastFlipped = false;

if(localStorage.contrast === 'light') {
  head.removeChild(darkColors);
}

sidebar.on('land', function(e) {
  document.location.href = document.location.origin + '/index.html';
});

sidebar.on('help', function(e) {
  if(helpPanel.isOpen()) {
    helpPanel.close();
  } else {
    helpPanel.open();
    helpPanel.domElement.focus();
  }
});

sidebar.on('shader', function(e) {
  //changeMaterials(scene);
  shaderChanger.nextMaterial(scene);
});

sidebar.on('fs', function(e) {
  if(getFullscreenElement() == null) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

sidebar.on('contrast', function(e) {
  if(contrastFlipped = !contrastFlipped) {
    head.removeChild(darkColors);
    localStorage.contrast = 'light';
  } else {
    head.appendChild(darkColors);
    localStorage.contrast = 'dark';
  }
});

sidebar.on('clear', function(e) {
  localStorage.clear();
});

sidebar.on('shader_settings', function(e) {
  shaderPanel.isOpen() ? shaderPanel.close() : shaderPanel.open();
  shaderPanel.domElement.focus();
});

shaderChanger.on('change', function(e) {
  e.materialRef = water.material;
  shaderPanel.changeShader(e);
});

shaderPanel.on('set_material', function(e) {
  shaderChanger.setMaterial(scene, e.materialName);
});

castleMap.castleMap.on('loaded', function() {
  shaderPanel.changeShader({materialRef: water.material});
  
  for(var i in castleMap.castleMap.gates) {
    picker.intObjects.push(castleMap.castleMap.gates[i]);
  }
});

objectPanel.on('close', picker.unselect);

picker.on('select', objectPanel.selectHandler);

/////////////////
// THREE setup //
/////////////////

export const f3D = THREE_Densaugeo.forgeObject3D

export const scene = new THREE.Scene()

export const camera = new THREE.PerspectiveCamera( 45, (window.innerWidth - 48) / window.innerHeight, 1, 1000 )

camera.matrix.compose(
  new THREE.Vector3(28.423, -49.239, 27.351),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0.334*Math.PI, 0, 0.171*Math.PI, 'ZYX')),
  new THREE.Vector3(1, 1, 1)
)

export const ambient_light = f3D(THREE.AmbientLight, { color: new THREE.Color(0x666666) })
scene.add(ambient_light);

export const directional_light = f3D(THREE.DirectionalLight, {
  color: new THREE.Color(0x666666),
  position: [-7.1, 2.75, 10],
})
scene.add(directional_light);

export const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth - 48, window.innerHeight );
renderer.setClearColor(0xC0C0C0, 1);

document.body.appendChild( renderer.domElement );

export const controls = new THREE_Densaugeo.FreeControls(camera, renderer.domElement, {panMouseSpeed: 0.05, dollySpeed: 5});

// WebGL occupies entire browser window
window.addEventListener('resize', function() {
  camera.aspect = (window.innerWidth - 48)/window.innerHeight
  camera.updateProjectionMatrix()
  
  renderer.setSize(window.innerWidth - 48, window.innerHeight)
})

// Put stuff in scene
scene.add(castleMap.castleMap.castle);

castleMap.castleMap.load();

export const water = f3D(THREE.Mesh, {geometry: new THREE.PlaneGeometry(128, 128, 1, 1), material: new THREE_Densaugeo.WaterMaterial({side: THREE.DoubleSide}), position: [0, 0, -0.5]})
scene.add(water);

picker.setRenderer(renderer);

/////////////////////////
// Tick initialization //
/////////////////////////

export let timePrevious = 0, timeDelta = 0;

function tick(time) {
  timeDelta = -timePrevious + (timePrevious = time);
  
  // Also updates scene-wide shader materials, because they are applied to the water mesh too
  if(water.material.tick) water.material.tick(timeDelta/1000);
  
  renderer.render(scene, camera);
}

requestAnimationFrame(time => {
  timePrevious = time;
  renderer.setAnimationLoop(tick);
})

// Startup scripts //

eval(localStorage.onstart);
