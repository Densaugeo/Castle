/**
 * @depends PanelUI.js
 * @depends EventEmitter.js
 * 
 * @description Modules for my cloud castle
 */
var CastleModules = {};

/**
 * @module CastleModules.HelpPanel inherits PanelUI.Panel
 * @description Gives an overview of the UI's controls
 * 
 * @example var helpPanel = new CastleModules.HelpPanel();
 * @example helpPanel.open();
 */
CastleModules.HelpPanel = function HelpPanel() {
  PanelUI.Panel.call(this, {id: 'help', heading: 'Controls', startOpen: false, accessKey: 'c'});
  
  this.domElement.appendChild(fE('div', {}, [
    fE('text', {textContent: 'Touchscreen:'}),
    fE('br'),
    fE('text', {textContent: 'First finger drag - Pan'}),
    fE('br'),
    fE('text', {textContent: 'Second finger drag - Rotate'}),
    fE('br'),
    fE('text', {textContent: 'Slide along right edge - Throttle'}),
    fE('br'),
    fE('br'),
    fE('text', {textContent: 'Mouse:'}),
    fE('br'),
    fE('text', {textContent: 'Left click and drag - Pan'}),
    fE('br'),
    fE('text', {textContent: 'Right click and drag - Rotate'}),
    fE('br'),
    fE('text', {textContent: 'Scroll wheel - Dolly'}),
    fE('br'),
    fE('text', {textContent: 'Shift click - Activate mouse look'}),
    fE('br'),
    fE('text', {textContent: 'Esc - Exit mouse look'}),
    fE('br'),
    fE('br'),
    fE('text', {textContent: 'Keyboard:'}),
    fE('br'),
    fE('text', {textContent: 'W/S - Fly forward/backward'}),
    fE('br'),
    fE('text', {textContent: 'A/D - Strafe left/right'}),
    fE('br'),
    fE('text', {textContent: 'E/C - Ascend/Descend'}),
    fE('br'),
    fE('text', {textContent: 'Arrows - Turn'}),
    fE('br'),
    fE('br'),
    fE('text', {textContent: 'Gamepad (press any face button to activate):'}),
    fE('br'),
    fE('text', {textContent: 'Left stick - Pan'}),
    fE('br'),
    fE('text', {textContent: 'Right stick - Turn'}),
    fE('br'),
    fE('text', {textContent: 'Left/right trigger - Throttle back/forward'}),
  ]));
}
CastleModules.HelpPanel.prototype = Object.create(PanelUI.Panel.prototype);
CastleModules.HelpPanel.prototype.constructor = CastleModules.HelpPanel;

/**
 * @module CastleModules.ShaderPanel inherits PanelUI.Panel
 * @description UI panel to change shaders, and adjust shaders' uniform variables
 * 
 * @example var shaderPanel = new CastleModules.ShaderPanel();
 * @example shaderPanel.open();
 */
CastleModules.ShaderPanel = function ShaderPanel(options) {
  PanelUI.Panel.call(this, {id: 'shader', heading: 'Shader Settings', accessKey: 's'});
  
  // @prop Object shaderButtons -- Holds HTMLElements used for shader selection buttons
  this.shaderButtons = {};
  
  // @prop Object controls -- Holds HTMLElements used for adjusting shaders' uniform variables
  this.controls = {};
  
  // @prop THREE.ShaderMaterial currentShader -- Shader whose uniforms are currently displayed on ShaderPanel for editing
  this.currentShader = {};
  
  // @prop HTMLElement content -- Appened to .domElement
  this.content = fE('div', {}, [
    fE('br'),
    fE('text', {textContent: 'Current shader:'}),
    fE('br'),
    this.shaderButtons.original    = fE('b', {className: 'button active_shader', title: 'Phong', textContent: 'P', tabIndex: 0}),
    this.shaderButtons.global      = fE('b', {className: 'button', title: 'Global coordinate grid', textContent: 'G', tabIndex: 0}),
    this.shaderButtons.local       = fE('b', {className: 'button', title: 'Local coordinate grid', textContent: 'L', tabIndex: 0}),
    this.shaderButtons.ghost       = fE('b', {className: 'button', title: 'Ghostly', textContent: 'H', tabIndex: 0}),
    this.shaderButtons.normals     = fE('b', {className: 'button', title: 'RGB-encoded normals', textContent: 'N', tabIndex: 0}),
    this.shaderButtons.psychedelic = fE('b', {className: 'button', title: 'Psychedelic', textContent: 'S', tabIndex: 0}),
    fE('div', {}, [
      fE('text', {textContent: 'Alpha:'}),
      this.controls.alpha = fE('input', {type: 'range', min: 0, max: 1, step: 0.01}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Local:'}),
      this.controls.local = fE('input', {type: 'range', min: 0, max: 1, step: 1}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Sun direction:'}),
      this.controls.sunDirection = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Ambient color:'}),
      this.controls.ambient = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Diffuse color:'}),
      this.controls.diffuse = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Specular color:'}),
      this.controls.specular = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Show axes:'}),
      this.controls.showAxes = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Axis weight:'}),
      this.controls.axisWeight = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Show grid:'}),
      this.controls.showGrid = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Grid weight:'}),
      this.controls.gridWeight = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Grid spacing:'}),
      this.controls.gridSpacing = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Fade distance:'}),
      this.controls.fadeDistance = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Mode:'}),
      this.controls.mode = fE('input', {type: 'range', min: 0, max: 1, step: 1}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Wavelength:'}),
      this.controls.wavelength = fE('input', {type: 'text'}),
    ]),
    fE('div', {}, [
      fE('text', {textContent: 'Frequency:'}),
      this.controls.frequency = fE('input', {type: 'text'}),
    ]),
  ]);
  
  this.domElement.appendChild(this.content);
  
  // @prop Object keyCuts -- Shortcuts for shader buttons are added to the inherited .keyCuts property
  this.keyCuts[80] = this.shaderButtons.original;
  this.keyCuts[71] = this.shaderButtons.global;
  this.keyCuts[76] = this.shaderButtons.local;
  this.keyCuts[72] = this.shaderButtons.ghost;
  this.keyCuts[78] = this.shaderButtons.normals;
  this.keyCuts[83] = this.shaderButtons.psychedelic;
  
  var self = this;
  
  // @event set_material {String materialName} -- Emitted to signal a request for a new shader. Does not actually change the shader by itself
  for(var i in this.shaderButtons) {
    with({i: i}) this.shaderButtons[i].addEventListener('click', function(e) {
      self.emit('set_material', {materialName: i});
    });
  }
  
  for(var i in this.controls) {
    switch(this.controls[i].type) {
      case 'range':
        with({i: i}) this.controls[i].addEventListener('input', function(e) {
          self.currentShader[i] = self.controls[i].value;
          self.currentShader.updateUniforms();
        });
        break;
      case 'text':
        with({i: i}) this.controls[i].addEventListener('change', function(e) {
          self.currentShader[i].fromString(self.controls[i].value);
          self.currentShader.updateUniforms();
        });
        
        self.controls[i].addEventListener('keydown', function(e) {
          e.stopPropagation();
        });
        break;
    }
  }
}
CastleModules.ShaderPanel.prototype = Object.create(PanelUI.Panel.prototype);
CastleModules.ShaderPanel.prototype.constructor = CastleModules.ShaderPanel;

// @method proto undefined changeShader({THREE.ShaderMaterial materialRef}) -- Used to notify ShaderPanel that the shader has been changed
CastleModules.ShaderPanel.prototype.changeShader = function(e) {
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

/**
 * @module CastleModules.ObjectPanel inherits PanelUI.Panel
 * @description UI panel to interact with objects in a three.js scene
 * 
 * @example var objectPanel = new CastleModules.ObjectPanel();
 * @example picker.on('select', objectPanel.selectHandler);
 * @example objectPanel.on('close', picker.unselect);
 */
CastleModules.ObjectPanel = function ObjectPanel(options) {
  PanelUI.Panel.call(this, {id: 'object', heading: 'None', accessKey: 'o'});
  
  // @prop HTMLElement content -- Div tag to hold panel-specific content
  this.content = fE('div', {title: 'Hold shift to use these shortcuts'});
  this.domElement.appendChild(this.content);
  
  // @prop [HTMLElement] actions -- Holds div tags used to activate each action. May be attached or not
  this.actions = [];
  for(var i = 0, endi = 8; i < endi; ++i) {
    this.actions[i] = fE('div');
  }
  
  // @method undefined selectHandler({THREE.Densaugeo.IntObject target}) -- Links ObjectPanel to an interactive three.js object
  with(this) this.selectHandler = function(e) {
    domElement.children[0].textContent = e.target.name;
    
    clear();
    
    Object.keys(e.target.controls).forEach(function(v, i, a) {
      actions[i].textContent = (i + 1) +  ' - ' + v;
      actions[i].onclick = e.target.controls[v];
      content.appendChild(actions[i]);
    });
    
    open();
    
    domElement.focus();
  }
  
  with(this) this.domElement.addEventListener('keydown', function(e) {
    if(!e.altKey && !e.ctrlKey && e.shiftKey && 49 <= e.keyCode && e.keyCode <= 56) {
      e.stopPropagation();
      
      actions[e.keyCode - 49].dispatchEvent(new MouseEvent('click'));
    }
  });
}
CastleModules.ObjectPanel.prototype = Object.create(PanelUI.Panel.prototype);
CastleModules.ObjectPanel.prototype.constructor = CastleModules.ObjectPanel;

// @method proto undefined clear() -- Clears .content
CastleModules.ObjectPanel.prototype.clear = function() {
  while(this.content.children.length > 0) {
    this.content.removeChild(this.content.firstChild);
  }
}

/**
 * @module CastleModules.ShaderChanger inherits EventEmitter
 * @description Switches out materials for every child on a given THREE.Object3D
 * 
 * @example var shaderChanger = new CastleModules.ShaderChanger();
 * @example shaderChanger.nextMaterial(scene);
 */
CastleModules.ShaderChanger = function ShaderChanger(options) {
  EventEmitter.call(this, options);
  
  // @prop Object shaders -- Collection of shaders to switch between. The String 'original' designates materials orignally defined on each object individually
  this.shaders = {
    original: 'original',
    global: new THREE.Densaugeo.CoordinateMaterial({transparent: true}),
    local: new THREE.Densaugeo.CoordinateMaterial({transparent: true, side: THREE.DoubleSide, local: true, showAxes: new THREE.Vector3(0, 0, 0)}),
    ghost: new THREE.Densaugeo.PositionMaterial({transparent: true, alpha: 0.8}),
    normals: new THREE.Densaugeo.NormalMaterial({transparent: true}),
    psychedelic: new THREE.Densaugeo.PsychMaterial({transparent: true}),
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
  with(this) this.nextMaterial = function(object) {
    var previousShader = currentShader;
    
    currentShader = shaderSequence[(shaderSequence.indexOf(currentShader) + 1) % shaderSequence.length];
    
    changeMaterial(object, shaders[currentShader]);
    
    emit('change', {currentShader: currentShader});
  }
  
  // @method undefined setMaterial(THREE.Object3D object, String shaderName) -- Changes object and its children to the shader at .shaders[shaderName]
  with(this) this.setMaterial = function(object, /*string*/ shaderName) {
    var previousShader = currentShader;
    
    currentShader = shaderName;
    
    changeMaterial(object, shaders[currentShader]);
    
    emit('change', {currentShader: currentShader});
  }
}
CastleModules.ShaderChanger.prototype = Object.create(EventEmitter.prototype);
CastleModules.ShaderChanger.prototype.constructor = CastleModules.ShaderChanger;

if(typeof module != 'undefined' && module != null && module.exports) {
  module.exports = CastleModules;
}
