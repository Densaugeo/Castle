/**
 * @depends PanelUI.js
 * @depends EventEmitter.js
 * 
 * @description Modules for my cloud castle
 */
import * as THREE from 'three'
import * as THREE_Densaugeo from './three.Densaugeo.js';
import * as PanelUI from './panelui.js'
const fE = PanelUI.fE

export class HelpPanelData extends PanelUI.Menu {
  _heading = 'Controls'
  
  _content = fE('div', [
    'Touchscreen:',
    fE('br'),
    'First finger drag - Pan',
    fE('br'),
    'Second finger drag - Rotate',
    fE('br'),
    'Slide along right edge - Throttle',
    fE('br'),
    fE('br'),
    'Mouse:',
    fE('br'),
    'Left click and drag - Pan',
    fE('br'),
    'Right click and drag - Rotate',
    fE('br'),
    'Scroll wheel - Dolly',
    fE('br'),
    'Shift click - Activate mouse look',
    fE('br'),
    'Esc - Exit mouse look',
    fE('br'),
    fE('br'),
    'Keyboard:',
    fE('br'),
    'W/S - Fly forward/backward',
    fE('br'),
    'A/D - Strafe left/right',
    fE('br'),
    'E/C - Ascend/Descend',
    fE('br'),
    'Arrows - Turn',
    fE('br'),
    fE('br'),
    'Gamepad (press any face button to activate):',
    fE('br'),
    'Left stick - Pan',
    fE('br'),
    'Right stick - Turn',
    fE('br'),
    'Left/right trigger - Throttle back/forward',
  ])
  
  /**
   * @param {Panel} panel
   */
  constructor(panel) {
    super('fa-question', 'Help', panel)
  }
}

export class ShaderPanelData extends PanelUI.Menu {
  _heading = 'Shader Settings'
  
  // @prop Object shaderButtons -- Holds HTMLElements used for shader selection buttons
  shaderButtons = {}
  
  // @prop Object controls -- Holds HTMLElements used for adjusting shaders' uniform variables
  controls = {}
  
  // @prop THREE.ShaderMaterial currentShader -- Shader whose uniforms are currently displayed on ShaderPanel for editing
  currentShader = {}
  
  _content = fE('div', [
    fE('br'),
    'Current shader:',
    fE('br'),
    this.shaderButtons.original    = fE('b', {className: 'button active_shader', title: 'Phong', textContent: 'P', tabIndex: 0}),
    this.shaderButtons.global      = fE('b', {className: 'button', title: 'Global coordinate grid', textContent: 'G', tabIndex: 0}),
    this.shaderButtons.local       = fE('b', {className: 'button', title: 'Local coordinate grid', textContent: 'L', tabIndex: 0}),
    this.shaderButtons.ghost       = fE('b', {className: 'button', title: 'Ghostly', textContent: 'H', tabIndex: 0}),
    this.shaderButtons.normals     = fE('b', {className: 'button', title: 'RGB-encoded normals', textContent: 'N', tabIndex: 0}),
    this.shaderButtons.psychedelic = fE('b', {className: 'button', title: 'Psychedelic', textContent: 'S', tabIndex: 0}),
    fE('div', {}, [
      'Alpha:',
      this.controls.alpha = fE('input', {type: 'range', min: 0, max: 1, step: 0.01}),
    ]),
    fE('div', {}, [
      'Local:',
      this.controls.local = fE('input', {type: 'range', min: 0, max: 1, step: 1}),
    ]),
    fE('div', {}, [
      'Sun direction:',
      this.controls.sunDirection = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Ambient color:',
      this.controls.ambient = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Diffuse color:',
      this.controls.diffuse = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Specular color:',
      this.controls.specular = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Show axes:',
      this.controls.showAxes = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Axis weight:',
      this.controls.axisWeight = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Show grid:',
      this.controls.showGrid = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Grid weight:',
      this.controls.gridWeight = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Grid spacing:',
      this.controls.gridSpacing = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Fade distance:',
      this.controls.fadeDistance = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Mode:',
      this.controls.mode = fE('input', {type: 'range', min: 0, max: 1, step: 1}),
    ]),
    fE('div', {}, [
      'Wavelength:',
      this.controls.wavelength = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      'Frequency:',
      this.controls.frequency = fE('input', {type: 'text'}),
    ]),
  ])
  
  /**
   * @param {Panel} panel
   */
  constructor(panel) {
    super('fa-cog', 'Shader Settings', panel)
    
    var self = this
    
    // @event set_material {String materialName} -- Emitted to signal a request for a new shader. Does not actually change the shader by itself
    for(const i in this.shaderButtons) {
      this.shaderButtons[i].addEventListener('click', function(e) {
        self.emit('set_material', {materialName: i})
      })
    }
    
    for(const i in this.controls) {
      switch(this.controls[i].type) {
        case 'range':
          this.controls[i].addEventListener('input', function(e) {
            self.currentShader[i] = self.controls[i].value
            self.currentShader.updateUniforms()
          })
          break
        case 'text':
          this.controls[i].addEventListener('change', function(e) {
            self.currentShader[i].fromString(self.controls[i].value)
            self.currentShader.updateUniforms()
          })
          
          self.controls[i].addEventListener('keydown', function(e) {
            e.stopPropagation()
          })
          break
      }
    }
  }
}

// @method proto undefined changeShader({THREE.ShaderMaterial materialRef}) -- Used to notify ShaderPanel that the shader has been changed
ShaderPanelData.prototype.changeShader = function(e) {
  this.currentShader = e.materialRef;
  
  for(var i in this.shaderButtons) {
    this.shaderButtons[i].classList.remove('active_shader');
  }
  
  if(e && this.shaderButtons[e.currentShader]) {
    this.shaderButtons[e.currentShader].classList.add('active_shader');
  }
  
  for(var i in this.controls) {
    if(this.currentShader[i] != null) {
      this.controls[i].parentElement.style.display = '';
      this.controls[i].value = this.currentShader[i].toString();
    } else {
      this.controls[i].parentElement.style.display = 'none';
    }
  }
}

export class ObjectPanelData extends PanelUI.Menu {
  _heading = 'Inspector'
  _content = fE('div')
  actions = []
  
  /**
   * @param {Panel} panel
   */
  constructor(panel) {
    super('fa-search', 'Inspector', panel)
    
    this.content.addEventListener('keydown', e => {
      if(!e.altKey && !e.ctrlKey && e.shiftKey && 49 <= e.keyCode && e.keyCode <= 56) {
        e.stopPropagation()
        
        this.actions[e.keyCode - 49].dispatchEvent(new MouseEvent('click'))
      }
    })
  }
  
  selectHandler = e => {
    this.content.replaceChildren(fE('div', [
      'Inspecting ',
      fE('text', { textContent: e.selection.name, style: 'color:#0ff' }),
      '. Hold shift to use these shortcuts:',
    ]))
    
    this.actions = []
    
    Object.keys(e.selection.controls).forEach((v, i, a) => {
      this.actions[i] = this.content.fE('div', {
        textContent: (i + 1) +  ' - ' + v,
        tabIndex: 0,
        onclick: e.selection.controls[v],
      })
    })
  }
}

/**
 * @module CastleModules.ShaderChanger inherits EventEmitter
 * @description Switches out materials for every child on a given THREE.Object3D
 * 
 * @example var shaderChanger = new CastleModules.ShaderChanger();
 * @example shaderChanger.nextMaterial(scene);
 */
export class ShaderChanger extends EventTarget {
  constructor() {
    super()
  
  // @prop Object shaders -- Collection of shaders to switch between. The String 'original' designates materials orignally defined on each object individually
  this.shaders = {
    original: 'original',
    global: new THREE_Densaugeo.CoordinateMaterial({transparent: true}),
    local: new THREE_Densaugeo.CoordinateMaterial({transparent: true, side: THREE.DoubleSide, local: true, showAxes: new THREE.Vector3(0, 0, 0)}),
    ghost: new THREE_Densaugeo.PositionMaterial({transparent: true, alpha: 0.8}),
    normals: new THREE_Densaugeo.NormalMaterial({transparent: true}),
    psychedelic: new THREE_Densaugeo.PsychMaterial({transparent: true}),
  }
  
  // @prop [String] shaderSequence -- Defualt order in which to step through shaders. Strings match keys in .shaders
  this.shaderSequence = ['original', 'global', 'local', 'ghost', 'normals', 'psychedelic'];
  
  // @prop String currentShader -- String matching a key in .shaders
  this.currentShader = 'original';
  
  var changeMaterial = function(object, material) {
    if(object instanceof THREE.Mesh) {
      if(object.originalMaterial == null) {
        object.originalMaterial = object.material;
      }
      
      object.material = material === 'original' ? object.originalMaterial : material;
    }
    
    if(object instanceof THREE.Object3D) {
      for(var i = 0, endi = object.children.length; i < endi; ++i) {
        changeMaterial(object.children[i], material);
      }
    }
  }
  
  // @event change {String currentShader} -- Emitted after materials have been changed. .currentShader is a String designating a key in .shaders
  
  // @method undefined nextMaterial(THREE.Object3D object) -- Changes object and its children to the next shader in .shaderSequence
  this.nextMaterial = object => {
    var previousShader = this.currentShader;
    
    this.currentShader = this.shaderSequence[(this.shaderSequence.indexOf(this.currentShader) + 1) % this.shaderSequence.length];
    
    changeMaterial(object, this.shaders[this.currentShader]);
    
    this.emit('change', {currentShader: this.currentShader});
  }
  
  // @method undefined setMaterial(THREE.Object3D object, String shaderName) -- Changes object and its children to the shader at .shaders[shaderName]
  this.setMaterial = (object, /*string*/ shaderName) => {
    var previousShader = this.currentShader;
    
    this.currentShader = shaderName;
    
    changeMaterial(object, this.shaders[this.currentShader]);
    
    this.emit('change', {currentShader: this.currentShader});
  }
  }
}
