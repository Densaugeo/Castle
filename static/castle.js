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
const f3D = THREE_Densaugeo.forgeObject3D

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
  left: 36px;
}
`)

class LegoCastle extends HTMLElement {
  timePrevious = 0
  timeDelta = 0
  
  constructor() {
    super()
    
    /////////////////
    // THREE Setup //
    /////////////////
    
    this.scene = new THREE.Scene()
    
    this.camera = new THREE.PerspectiveCamera( 45, 300 / 200, 1, 1000 )
    this.camera.matrix.compose(
      new THREE.Vector3(28.423, -49.239, 27.351),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.334*Math.PI,
        0, 0.171*Math.PI, 'ZYX')),
      new THREE.Vector3(1, 1, 1),
    )
    
    this.ambient_light = f3D(THREE.AmbientLight, {
      color: new THREE.Color(0x666666),
      intensity: 3.14159,
    })
    this.scene.add(this.ambient_light);
    
    this.directional_light = f3D(THREE.DirectionalLight, {
      color: new THREE.Color(0x666666),
      position: [-7.1, 2.75, 10],
      intensity: 3.14159,
    })
    this.scene.add(this.directional_light);
    
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize(300, 200);
    this.renderer.setClearColor(0xC0C0C0, 1);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    
    this.controls = new THREE_Densaugeo.FreeControls(this.camera,
      this.renderer.domElement, {panMouseSpeed: 0.05, dollySpeed: 5})
    
    // Put stuff in scene
    this.scene.add(castleMap.castleMap.castle)
    
    castleMap.castleMap.load()
    
    this.water = f3D(THREE.Mesh, {
      geometry: new THREE.PlaneGeometry(128, 128, 1, 1),
      material: new THREE_Densaugeo.WaterMaterial({ side: THREE.DoubleSide }),
      position: [0, 0, -0.5],
    })
    this.scene.add(this.water)
    
    ///////////////////////////
    // emg construction zone //
    ///////////////////////////
    
    const self = this
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
    })()
    
    ////////////////////////
    // Internal DOM Setup //
    ////////////////////////
    
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
    
    shadow.appendChild(this.renderer.domElement)
    
    this.panel = new PanelUI.Panel()
    shadow.append(this.panel.domElement)
    
    this.shaderChanger = new CastleModules.ShaderChanger()
    this.helpPanelData = new CastleModules.HelpPanelData(this.panel)
    this.objectPanelData = new CastleModules.ObjectPanelData(this.panel)
    this.shaderPanelData = new CastleModules.ShaderPanelData(this.panel)
    
    this.sidebar = new PanelUI.Sidebar({ linked_panel: this.panel });
    
    this.sidebar.setCommand(0, this.helpPanelData.command)
    
    this.sidebar.setCommand(1, new PanelUI.Command('fa-eye', 'Change shader',
      () => { this.shaderChanger.nextMaterial(this.scene) }))
    
    this.fs_command = new PanelUI.Command('fa-arrows-alt', 'Fullscreen', () => {
      if(getFullscreenElement() == null) document.body.requestFullscreen()
      else document.exitFullscreen()
    })
    this.sidebar.setCommand(2, this.fs_command)
    
    this.sidebar.setCommand(3, this.objectPanelData.command)
    
    this.sidebar.setCommand(4, this.shaderPanelData.command)
    
    shadow.appendChild(this.sidebar.domElement)
    
    this.picker = new THREE_Densaugeo.Picker()
    
    this.shaderChanger.container = shadow
    
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
    
    this.shaderChanger.on('change', e => {
      e.materialRef = this.water.material
      this.shaderPanelData.changeShader(e)
    })
    
    this.shaderPanelData.on('set_material', e => {
      this.shaderChanger.setMaterial(this.scene, e.materialName)
    })
    
    castleMap.castleMap.on('loaded', () => {
      this.shaderPanelData.changeShader({ materialRef: this.water.material })
      
      for(let i in castleMap.castleMap.gates) {
        this.picker.intObjects.push(castleMap.castleMap.gates[i])
      }
    })
    
    // With the panels consolidated, I need a new way to unselect 3D objects
    //this.panel.on('close', this.picker.unselect)
    
    this.picker.on('select', this.objectPanelData.selectHandler)
    
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
