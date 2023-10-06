import * as THREE from 'three';
export * as THREE from 'three';
import * as THREE_Densaugeo from './three.Densaugeo.js';
export * as THREE_Densaugeo from './three.Densaugeo.js';
import * as castleMap from './castleMap.js';
export * as castleMap from './castleMap.js';
import * as CastleModules from './CastleModules.js';
export * as CastleModules from './CastleModules.js';
import * as PanelUI from './panelui.js'
export * as PanelUI from './panelui.js'

////////
// UI //
////////

export const sidebar = new PanelUI.Sidebar();
sidebar.addButton({buttonName: 'help', faClass: 'fa-question', title: 'Help'});
sidebar.addButton({buttonName: 'shader', faClass: 'fa-eye', title: 'Change shader'});
sidebar.addButton({buttonName: 'fs', faClass: 'fa-arrows-alt', title: 'Fullscreen'});
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

THREE.ColorManagement.enabled = false

export const f3D = THREE_Densaugeo.forgeObject3D

export const scene = new THREE.Scene()

export const camera = new THREE.PerspectiveCamera( 45, 300 / 200, 1, 1000 )

camera.matrix.compose(
  new THREE.Vector3(28.423, -49.239, 27.351),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0.334*Math.PI, 0, 0.171*Math.PI, 'ZYX')),
  new THREE.Vector3(1, 1, 1)
)

export const ambient_light = f3D(THREE.AmbientLight, {
  color: new THREE.Color(0x666666),
  intensity: 3.14159,
})
scene.add(ambient_light);

export const directional_light = f3D(THREE.DirectionalLight, {
  color: new THREE.Color(0x666666),
  position: [-7.1, 2.75, 10],
  intensity: 3.14159,
})
scene.add(directional_light);

export const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(300, 200);
renderer.setClearColor(0xC0C0C0, 1);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

export const controls = new THREE_Densaugeo.FreeControls(camera, renderer.domElement, {panMouseSpeed: 0.05, dollySpeed: 5});

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

/////////////////////////
// Web component trial //
/////////////////////////

const lego_castle_style = new CSSStyleSheet()
lego_castle_style.replaceSync(`
:host {
  /* This is required to make internal element positions relative to the web
  component, instead of something in the external DOM */
  position: relative;
  
  /* Using an inline-block display style is required for the custom element in
  the external DOM to have the correct size */
  display: inline-block;
}

input {
  color: #0ff;
}

.button.active_shader {
  color: #00F;
}

canvas {
  position: absolute;
  left: 48px;
}
`)

class LegoCastle extends HTMLElement {
  constructor() {
    super()
    
    const shadow = this.attachShadow({ mode: 'closed' })
    this.shadow = shadow
    shadow.innerHTML = `
    <link rel="stylesheet" href="${new URL('font-awesome/css/font-awesome.min.css', import.meta.url).href}">
    
    <!-- panelui.css must be imported after font-awesome, or icons sizes will
         be messed up -->
    <link rel="stylesheet" href="${new URL('panelui.css', import.meta.url).href}">
    `
    shadow.adoptedStyleSheets = [lego_castle_style]
    
    // Font Awesome must be linked to the external document as well, because it
    // uses custom fonts and those cannot be loaded from within web components
    document.head.fE('link', {
      rel: 'stylesheet',
      href: new URL('font-awesome/css/font-awesome.min.css', import.meta.url).href,
    })
    
    shadow.appendChild(sidebar.domElement)
    shadow.appendChild(renderer.domElement)
    helpPanel.container = shadow
    shaderChanger.container = shadow
    shaderPanel.container = shadow
    objectPanel.container = shadow
    picker.container = shadow
    
    if(this.width == null) this.width = 348
    if(this.height == null) this.height = 200
    
    // Custom attributes set in HTML must be explicitly applied at construction
    for(let attribute of this.constructor.observedAttributes) {
      this.attributeChangedCallback(attribute, null, this.getAttribute(attribute))
    }
  }
  
  get width( ) { return this.getAttribute('width'   ) }
  set width(v) { return this.setAttribute('width', v) }
  
  get height( ) { return this.getAttribute('height'   ) }
  set height(v) { return this.setAttribute('height', v) }
  
  static get observedAttributes() {
    return ['width', 'height']
  }
  
  /**
   * @param {string} name 
   * @param {string} old_value 
   * @param {string} new_value 
   */
  
  attributeChangedCallback(name, old_value, new_value) {
    const v = parseInt(new_value)
    
    switch(name) {
      case 'width':
        camera.aspect = (v - 48)/renderer.domElement.height
        renderer.setSize(v - 48, renderer.domElement.height)
        
        this.style.width = v + 'px'
        break
      case 'height':
        camera.aspect = renderer.domElement.width/v
        renderer.setSize(renderer.domElement.width, v)
        
        this.style.height = v + 'px'
        break
    }
    
    camera.updateProjectionMatrix()
  }
}
customElements.define('lego-castle', LegoCastle)
