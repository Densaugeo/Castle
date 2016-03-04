# CastleModules.js

Modules for my cloud castle

Dependencies: `PanelUI.js` , `EventEmitter.js` 

---

## CastleModules.HelpPanel

Inherits: `PanelUI.Panel`

Gives an overview of the UI's controls

```
var helpPanel = new CastleModules.HelpPanel();
helpPanel.open();
```

---

## CastleModules.ShaderPanel

Inherits: `PanelUI.Panel`

UI panel to change shaders, and adjust shaders' uniform variables

```
var shaderPanel = new CastleModules.ShaderPanel();
shaderPanel.open();
```

#### Properties

`HTMLElement` **content** -- Appened to .domElement

`Object` **controls** -- Holds HTMLElements used for adjusting shaders' uniform variables

`THREE.ShaderMaterial` **currentShader** -- Shader whose uniforms are currently displayed on ShaderPanel for editing

`Object` **keyCuts** -- Shortcuts for shader buttons are added to the inherited .keyCuts property

`Object` **shaderButtons** -- Holds HTMLElements used for shader selection buttons

#### Methods

`undefined` proto **changeShader**`({THREE.ShaderMaterial materialRef})` -- Used to notify ShaderPanel that the shader has been changed

#### Events

**set_material** `{String materialName}` -- Emitted to signal a request for a new shader. Does not actually change the shader by itself

---

## CastleModules.ObjectPanel

Inherits: `PanelUI.Panel`

UI panel to interact with objects in a three.js scene

```
var objectPanel = new CastleModules.ObjectPanel();
picker.on('select', objectPanel.selectHandler);
objectPanel.on('close', picker.unselect);
```

#### Properties

`[HTMLElement]` **actions** -- Holds div tags used to activate each action. May be attached or not

`HTMLElement` **content** -- Div tag to hold panel-specific content

#### Methods

`undefined` proto **clear**`()` -- Clears .content

`undefined` **selectHandler**`({THREE.Densaugeo.IntObject target})` -- Links ObjectPanel to an interactive three.js object

---

## CastleModules.ShaderChanger

Inherits: `EventEmitter`

Switches out materials for every child on a given THREE.Object3D

```
var shaderChanger = new CastleModules.ShaderChanger();
shaderChanger.nextMaterial(scene);
```

#### Properties

`String` **currentShader** -- String matching a key in .shaders

`[String]` **shaderSequence** -- Defualt order in which to step through shaders. Strings match keys in .shaders

`Object` **shaders** -- Collection of shaders to switch between. The String 'original' designates materials orignally defined on each object individually

#### Methods

`undefined` **nextMaterial**`(THREE.Object3D object)` -- Changes object and its children to the next shader in .shaderSequence

`undefined` **setMaterial**`(THREE.Object3D object, String shaderName)` -- Changes object and its children to the shader at .shaders[shaderName]

#### Events

**change** `{String currentShader}` -- Emitted after materials have been changed. .currentShader is a String designating a key in .shaders

