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

THREE.ColorManagement.enabled = false
export const f3D = THREE_Densaugeo.f3D
export const fM4 = THREE_Densaugeo.fM4
export const PI = Math.PI

if(HTMLElement.prototype.requestFullscreen == null) {
  HTMLElement.prototype.requestFullscreen = () => {
    let message = 'Sorry, your browser does not allow fullscreen mode.'
    
    if(navigator.userAgent.includes('iPhone')) {
      message += '\n\nYou appear to be using an iPhone. Apple does allow ' +
        'fullscreen on iPads, but not on iPhones.'
    }
    
    alert(message)
  }
}

export class DenViewer extends HTMLElement {
  timePrevious = 0
  timeDelta = 0
  
  constructor() {
    super()
    
    // Default values for custom attributes
    if(this.width  == null) this.width  = 580
    if(this.height == null) this.height = 360
    
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
    this.renderer.setClearColor(0xc0c0c0, 1);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    
    this.camera = f3D(THREE.PerspectiveCamera, {
      fov: 45, near: 1, far: 1000,
      matrix: fM4({ tx: 25, ty: -51, tz: 27, rz: PI/6 }).rotateX(PI/3),
    })
    
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
    
    /////////////////
    // Other Setup //
    /////////////////
    
    this.fs_command = new PanelUI.DenCommand('maximize.svg', 'Fullscreen',
    () => {
      if(document.fullscreenElement) document.exitFullscreen()
      else this.requestFullscreen()
    })
    
    CastleModules.shaderChanger.container = this.shadow
    CastleModules.shaderChanger.scene = this.scene
    
    ////////////////////////
    // Internal DOM Setup //
    ////////////////////////
    
    this.shadow = this.attachShadow({ mode: 'closed' })
    
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`
    :host {
      background: #000;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #ddd;
      line-height: 1.42857143;
    }
    
    canvas {
      position: absolute;
      left: 36px;
    }
    
    #sidebar {
      position: absolute;
      width: 36px;
      height: 100%;
      z-index: 2;
      padding: 0;
      background: #000;
      /* This nulls out the tab selection box */
      outline: none;
      overflow-x: hidden;
      overflow-y: auto;
    }
    
    #sidebar > den-command-slot {
      border-bottom: 1px solid #444;
    }
    
    den-panel {
      position: absolute;
      left: 36px;
      top: 0;
      width: 324px;
      z-index: 2;
      min-height: 24px;
      max-height: calc(100% - 24px);
      overflow: auto;
      background: rgba(0, 0, 0, 0.75);
    }
    `)
    this.shadow.adoptedStyleSheets = [PanelUI.default_style, sheet]
    
    this.controls = new THREE_Densaugeo.FreeControls(this.camera, {
      keyElement: this,
      mouseElement: this.renderer.domElement,
      panMouseSpeed: 0.05, dollySpeed: 5,
    })
  }
  
  render() {
    this.shadow.replaceChildren(
      this.renderer.domElement,
      fE('div', { id: 'sidebar', tabIndex: 1, accessKey: '1' }, [
        fE('den-command-slot', { key: '1',
          command: CastleModules.helpPanel.command }),
        fE('den-command-slot', { key: '2',
          command: CastleModules.shaderPanel.command }),
        fE('den-command-slot', { key: '3',
          command: this.fs_command }),
        fE('den-command-slot', { key: '4',
          command: CastleModules.inspectorPanel.command }),
        fE('den-command-slot', { key: '5' }),
        fE('den-command-slot', { key: '6' }),
        fE('den-command-slot', { key: '7' }),
        fE('den-command-slot', { key: '8',
          command: CastleModules.shaderPanel.toggles.local }),
        fE('den-command-slot', { key: '9',
          command: CastleModules.shaderPanel.toggles.ghost }),
        fE('den-command-slot', { key: '0' }),
      ]),
      CastleModules.helpPanel,
      CastleModules.inspectorPanel,
      CastleModules.shaderPanel,
    )
    
    // Needed to allow event listeners that return focus to this component when
    // a focus element with the shadow DOM is removed
    this.tabIndex = 0
    
    this.shadow.querySelector('#sidebar').title = 'Sidebar\n\nKey: ' +
      this.shadow.querySelector('#sidebar').accessKeyLabel
    
    this.keyCodesToSlots = {}
    this.shadow.querySelectorAll('#sidebar > den-command-slot').forEach(v => {
      this.keyCodesToSlots[v.key.charCodeAt(0)] = v
    })
  }
  
  connectedCallback() {
    this.render()
    
    // Custom attributes set in HTML must be explicitly applied
    this._apply_dimensions()
    
    this.addEventListener('keydown', e => {
      const slot = this.keyCodesToSlots[e.keyCode]
      if(!e.altKey && !e.ctrlKey && !e.shiftKey && slot) slot.click()
    })
    
    document.addEventListener('fullscreenchange', () => {
      this.fs_command.enabled = document.fullscreenElement === this
      this._apply_dimensions()
    })
    
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera)
    })
  }
  
  get width( ) { return this.getAttribute('width'   ) }
  set width(v) { return this.setAttribute('width', v) }
  
  get height( ) { return this.getAttribute('height'   ) }
  set height(v) { return this.setAttribute('height', v) }
  
  _apply_dimensions() {
    const width = this.fs_command.enabled ? window.innerWidth :
      parseInt(this.width)
    const height = this.fs_command.enabled ? window.innerHeight :
      parseInt(this.height)
    
    this.camera.aspect = (width - 36)/height
    this.renderer.setSize(width - 36, height)
    this.style.width = width + 'px'
    this.style.height = height + 'px'
    this.camera.updateProjectionMatrix()
  }
  
  static get observedAttributes() {
    return ['width', 'height']
  }
  
  /**
   * @param {string} name 
   * @param {string} old_value 
   * @param {string} new_value 
   */
  attributeChangedCallback(name, _old_value, _new_value) {
    if(name === 'width' || name === 'height') this._apply_dimensions()
  }
}
customElements.define('den-viewer', DenViewer)

export class LegoCastle extends DenViewer {
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
    
    ////////////////////////
    // Internal DOM Setup //
    ////////////////////////
    
    this.picker = new THREE_Densaugeo.Picker()
    this.picker.container = this.shadow
    this.picker.setRenderer(this.renderer)
    this.picker.camera = this.camera
    
    castleMap.castleMap.on('loaded', () => {
      for(let i in castleMap.castleMap.gates) {
        this.picker.intObjects.push(castleMap.castleMap.gates[i])
      }
    })
    
    this.picker.on('select', CastleModules.inspectorPanel.selectHandler)
  }
  
  connectedCallback() {
    super.connectedCallback()
    
    /////////////////////////
    // Tick Initialization //
    /////////////////////////
    
    this.renderer.setAnimationLoop(time => {
      this.timeDelta = -(this.timePrevious ?? time) + (this.timePrevious = time)
      
      // Also updates scene-wide shader materials, because they are applied to
      // the water mesh too
      if(this.water.material.tick) {
        this.water.material.tick(this.timeDelta/1000)
      }
      
      this.renderer.render(this.scene, this.camera)
    })
  }
}
customElements.define('lego-castle', LegoCastle)
