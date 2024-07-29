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

import {GLTFLoader} from './three/loaders/GLTFLoader.js';

THREE.ColorManagement.enabled = false
export const f3D = THREE_Densaugeo.f3D
export const fM4 = THREE_Densaugeo.fM4
export const PI = Math.PI

export class DensViewer extends HTMLElement {
  timePrevious = 0
  timeDelta = 0
  
  constructor() {
    super()
    
    /////////////////
    // THREE Setup //
    /////////////////
    
    this.scene = new THREE.Scene()
    
    this.ambientLight = this.scene.f3D(THREE.AmbientLight, {
      color: new THREE.Color(0x666666),
      intensity: 3.14159,
    }),
    
    this.directionalLight = this.scene.f3D(THREE.DirectionalLight, {
      color: new THREE.Color(0x666666),
      position: [-7.1, 2.75, 10],
      intensity: 3.14159,
    })
    
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize(300, 200);
    this.renderer.setClearColor(0xC0C0C0, 1);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    
    this.camera = f3D(THREE.PerspectiveCamera, {
      fov: 45, aspect: 300/200, near: 1, far: 1000,
      matrix: fM4({ tx: 25, ty: -51, tz: 27, rz: PI/6 }).rotateX(PI/3),
    })
    
    ////////////////////////
    // Internal DOM Setup //
    ////////////////////////
    
    this.shadow = this.attachShadow({ mode: 'closed' })
    
    this.shadow.fE('link', {
      rel: 'stylesheet',
      href: new URL('panelui.css', import.meta.url).href,
    })
    
    this.shadow.appendChild(this.renderer.domElement)
    this.renderer.domElement.tabIndex = 0
    
    this.controls = new THREE_Densaugeo.FreeControls(this.camera, {
      keyElement: this.shadow,
      mouseElement: this.renderer.domElement,
      panMouseSpeed: 0.05, dollySpeed: 5,
    })
  }
}
customElements.define('dens-viewer', DensViewer)

export class LegoCastle extends DensViewer {
  constructor() {
    super()
    
    this.water = this.scene.f3D(THREE.Mesh, {
      geometry: new THREE.PlaneGeometry(128, 128, 1, 1),
      material: new THREE_Densaugeo.WaterMaterial({ side: THREE.DoubleSide }),
      position: [0, 0, -0.5],
    })
    CastleModules.shaderChanger.waterShader = this.water.material
    
    // Put stuff in scene
    this.scene.add(castleMap.castleMap.castle)
    
    castleMap.castleMap.load()
    
    ///////////////////////////
    // emg construction zone //
    ///////////////////////////
    
    /*const self = this
    ;(async () => {
      const res = fetch('blocks.wasm')
      const { instance } = await WebAssembly.instantiateStreaming(res)
      instance.exports.gen_build_the_model(0)
      const result = instance.exports.memory.buffer.slice(
        instance.exports.model_pointer(),
        instance.exports.model_pointer() + instance.exports.model_size(),
      )
      console.log(new TextDecoder().decode(result))
      
      const loader = new GLTFLoader()
      loader.parse(result, '.', function(gltf) {
        console.log(gltf)
        
        let new_battlement = gltf.scene.children[0].clone()
        new_battlement.position.x = 7
        new_battlement.position.y = -23
        new_battlement.position.z = 0
        self.scene.add(new_battlement)
      })
    })()*/
    
    ////////////////////////
    // Internal DOM Setup //
    ////////////////////////
    
    const shadow = this.shadow
    
    this.sidebar = new PanelUI.Sidebar()
    
    this.sidebar.slots[0].command = CastleModules.helpPanel.command
    
    this.sidebar.slots[1].command = CastleModules.shaderPanel.command
    
    this.fs_command = new PanelUI.Command('maximize.svg', 'Fullscreen', () => {
      if(getFullscreenElement() == null) document.body.requestFullscreen()
      else document.exitFullscreen()
    })
    this.sidebar.slots[2].command = this.fs_command
    
    this.sidebar.slots[3].command = CastleModules.inspectorPanel.command
    
    this.sidebar.slots[7].command = CastleModules.shaderPanel.toggles.local
    this.sidebar.slots[8].command = CastleModules.shaderPanel.toggles.ghost
    
    shadow.appendChild(this.sidebar.domElement)
    // Append panel after sidebar, for tab ordering
    shadow.append(CastleModules.helpPanel)
    shadow.append(CastleModules.inspectorPanel)
    shadow.append(CastleModules.shaderPanel)
    
    this.picker = new THREE_Densaugeo.Picker()
    
    CastleModules.shaderChanger.container = shadow
    CastleModules.shaderChanger.scene = this.scene
    
    this.picker.container = shadow
    this.picker.setRenderer(this.renderer)
    this.picker.camera = this.camera
    
    // TODO That's a lot of very old vendor prefixes! I should test if they can
    // be removed
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
    const getFullscreenElement = function() {
      return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    }
    
    document.addEventListener('fullscreenchange', () => {
      this.fs_command.enabled = document.fullscreenElement === document.body
    })
    
    castleMap.castleMap.on('loaded', () => {
      for(let i in castleMap.castleMap.gates) {
        this.picker.intObjects.push(castleMap.castleMap.gates[i])
      }
    })
    
    this.picker.on('select', CastleModules.inspectorPanel.selectHandler)
    
    if(this.width == null) this.width = 336
    if(this.height == null) this.height = 200
    
    // Custom attributes set in HTML must be explicitly applied at construction
    for(let att of this.constructor.observedAttributes) {
      this.attributeChangedCallback(att, null, this.getAttribute(att))
    }
    
    /////////////////////////
    // Tick Initialization //
    /////////////////////////
    
    this.renderer.setAnimationLoop(time => {
      this.timePrevious = time
      
      this.renderer.setAnimationLoop(time => {
        this.timeDelta = -this.timePrevious + (this.timePrevious = time)
        
        // Also updates scene-wide shader materials, because they are applied to
        // the water mesh too
        if(this.water.material.tick) this.water.material.tick(this.timeDelta/1000)
        
        this.renderer.render(this.scene, this.camera)
      })
    })
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
        this.camera.aspect = (v - 36)/this.renderer.domElement.height
        this.renderer.setSize(v - 36, this.renderer.domElement.height)
        
        this.style.width = v + 'px'
        break
      case 'height':
        this.camera.aspect = this.renderer.domElement.width/v
        this.renderer.setSize(this.renderer.domElement.width, v)
        
        this.style.height = v + 'px'
        break
    }
    
    this.camera.updateProjectionMatrix()
  }
}
customElements.define('lego-castle', LegoCastle)
