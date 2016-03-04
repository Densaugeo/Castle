/**
 * @description Creates a THREE.Object3D castle
 * @depends THREE.js
 * @depends THREE.Densaugeo.js
 * @depends EventEmitter.js
 * 
 * @example scene.add(castleMap.castle);
 * @example castleMap.load(callback);
 */
if(window.THREE == null) {
  console.error('castleMap.js requires THREE.js');
}

if(window.THREE.Densaugeo == null) {
  console.error('castleMap.js requires THREE.Densaugeo.js');
}

var f3D = THREE.Densaugeo.forgeObject3D;
var fM  = THREE.Densaugeo.forgeMesh;
var fM4 = function(options) {
  return new THREE.Matrix4().forge(options);
}

var loader = new THREE.Densaugeo.JSONMultiLoader();

/**
 * @module Gate inherits THREE.Densaugeo.IntObject
 * @description Used for the many Gates which appear herein
 */
var Gate = function Gate(options) {
  THREE.Densaugeo.IntObject.call(this, options);
  
  // @method undefined open() -- Open the gate (using preset matrices, exposed in .controls)
  with(this) this.open = function() {
    door.matrix.copy(door.matrixOpen);
  }
  
  // @method undefined close() -- Close the gate (using preset matrices, exposed in .controls)
  with(this) this.close = function() {
    door.matrix.copy(door.matrixClosed);
  }
  
  this.controls.Open = this.open;
  this.controls.Close = this.close;
}
Gate.prototype = Object.create(THREE.Densaugeo.IntObject.prototype);
Gate.prototype.constructor = Gate;

/**
 * @module GatedTower inherits THREE.Densaugeo.IntObject
 * @description Used for the many Gates which appear herein
 */
var GatedTower = function GatedTower(options) {
  THREE.Densaugeo.IntObject.call(this, options);
  
  // @method undefined openLower() -- Open the lower door (using preset matrices, exposed in .controls)
  with(this) this.openLower = function() {
    lowerDoor.matrix.copy(lowerDoor.matrixOpen);
  }
  
  // @method undefined closeLower() -- Close the lower door (using preset matrices, exposed in .controls)
  with(this) this.closeLower = function() {
    lowerDoor.matrix.copy(lowerDoor.matrixClosed);
  }
  
  // @method undefined openUpper() -- Open the upper door (using preset matrices, exposed in .controls)
  with(this) this.openUpper = function() {
    upperDoor.matrix.copy(upperDoor.matrixOpen);
  }
  
  // @method undefined closeUpper() -- Close the upper door (using preset matrices, exposed in .controls)
  with(this) this.closeUpper = function() {
    upperDoor.matrix.copy(upperDoor.matrixClosed);
  }
  
  this.controls['Open Lower Door' ] = this.openLower;
  this.controls['Close Lower Door'] = this.closeLower;
  this.controls['Open Upper Door' ] = this.openUpper;
  this.controls['Close Upper Door'] = this.closeUpper;
}
GatedTower.prototype = Object.create(THREE.Densaugeo.IntObject.prototype);
GatedTower.prototype.constructor = GatedTower;

/**
 * @module DoubleGate inherits THREE.Densaugeo.IntObject
 * @description Used for the many Gates which appear herein
 */
var DoubleGate = function DoubleGate(options) {
  THREE.Densaugeo.IntObject.call(this, options);
  
  // @method undefined openRight() -- Open the right side of the gate (using preset matrices, exposed in .controls)
  with(this) this.openRight = function() {
    rightDoor.matrix.copy(rightDoor.matrixOpen);
    
    if(typeof rightSpiral != 'undefined') {
      rightSpiral.children.forEach(function(v, i, a) {
        v.matrix.forge({tz: 0.4*i, rz: 4/3*Math.PI - Math.PI/8*i});
      });
    }
  }
  
  // @method undefined closeRight() -- Close the right side of the gate (using preset matrices, exposed in .controls)
  with(this) this.closeRight = function() {
    rightDoor.matrix.copy(rightDoor.matrixClosed);
    
    if(typeof rightSpiral != 'undefined') {
      rightSpiral.children.forEach(function(v, i, a) {
        v.matrix.forge({tz: 0.4*i, rz: 0});
      });
    }
  }
  
  // @method undefined openLeft() -- Open the left side of the gate (using preset matrices, exposed in .controls)
  with(this) this.openLeft = function() {
    leftDoor.matrix.copy(leftDoor.matrixOpen);
    
    if(typeof leftSpiral != 'undefined') {
      leftSpiral.children.forEach(function(v, i, a) {
        v.matrix.forge({tz: 0.4*i, rz: -4/3*Math.PI + Math.PI/8*i});
      });
    }
  }
  
  // @method undefined closeLeft() -- Close the left side of the gate (using preset matrices, exposed in .controls)
  with(this) this.closeLeft = function() {
    leftDoor.matrix.copy(leftDoor.matrixClosed);
    
    if(typeof leftSpiral != 'undefined') {
      leftSpiral.children.forEach(function(v, i, a) {
        v.matrix.forge({tz: 0.4*i, rz: 0});
      });
    }
  }
  
  this.controls['Open Right'] = this.openRight;
  this.controls['Close Right'] = this.closeRight;
  this.controls['Open Left'] = this.openLeft;
  this.controls['Close Left'] = this.closeLeft;
}
DoubleGate.prototype = Object.create(THREE.Densaugeo.IntObject.prototype);
DoubleGate.prototype.constructor = DoubleGate;

/**
 * @module castleMap inherits EventEmitter
 * @description Actually defined as a singleton instance...going to worry about finding the right way to do it later
 */
castleMap = new EventEmitter();

// @prop THREE.Object3D castle -- Base object
castleMap.castle = new THREE.Object3D();

// @prop THREE.Object3D ground -- The ground's mesh
castleMap.ground = new THREE.Object3D();

// @prop THREE.Object3D fortress -- The whole fortress
castleMap.fortress = new THREE.Object3D();

// @prop Object gates -- All the gates of the castle
castleMap.gates = {};
var gates = castleMap.gates;
gates.citadelInner = new Gate({name: 'Citadel Inner Gate'});
gates.citadelOuter = new Gate({name: 'Citadel Outer Gate'});
gates.citadelEast  = new Gate({name: 'Citadel East Gate'});
gates.citadelWest  = new Gate({name: 'Citadel West Gate'});
gates.towerHarbor  = new GatedTower({name: 'Harbor Tower'});
gates.towerWest    = new GatedTower({name: 'West Tower'});
gates.towerEast    = new GatedTower({name: 'East Tower'});
gates.main         = new DoubleGate({name: 'Main Gate'});
gates.harbor       = new Gate({name: 'Harbor Gate'});
gates.sWInner      = new Gate({name: 'Southwest Inner Gate'});
gates.sWOuter      = new DoubleGate({name: 'Southwest Outer Gate'});
gates.nWInner      = new Gate({name: 'Northwest Inner Gate'});
gates.nWOuter      = new DoubleGate({name: 'Northwest Outer Gate'});
gates.keepDock     = new Gate({name: 'Dock Gate'});
gates.island       = new GatedTower({name: 'Island'});
gates.seawall1     = new Gate({name: 'Seawall'});
gates.seawall2     = new Gate({name: 'Seawall'});
gates.seawall3     = new Gate({name: 'Seawall'});

// @prop [String] modelPaths -- Paths to each THREE.js model
castleMap.modelPaths = [
  "models/Annex_Door.json",
  "models/Annex_Gate.json",
  "models/Annex_Wall_1.json",
  "models/Annex_Wall_2.json",
  "models/Annex_Wall_S_End.json",
  "models/Annex_Wall_Stretched.json",
  "models/Citadel_Door.json",
  "models/Citadel_Door_Side.json",
  "models/Citadel_Mezzanine.json",
  "models/Citadel_Side.json",
  "models/Fortress_Bridge_Extension.json",
  "models/Fortress_Bridge.json",
  "models/Fortress_Bridge_Wall_1_Extension.json",
  "models/Fortress_Bridge_Wall_1.json",
  "models/Fortress_Bridge_Wall_2.json",
  "models/Fortress_Bridge_Wall_Mirrored_2.json",
  "models/Fortress_Causeway_Drawbridge.json",
  "models/Fortress_Causeway_Drop.json",
  "models/Fortress_Causeway.json",
  "models/Fortress_Corner.json",
  "models/Fortress_Dock.json",
  "models/Fortress_Gate_1_Banner.json",
  "models/Fortress_Gate_1.json",
  "models/Fortress_Gate_1_L_Door.json",
  "models/Fortress_Gate_1_R_Door.json",
  "models/Fortress_Gate_1_Spiral.json",
  "models/Fortress_Gate_2_Drawbridge.json",
  "models/Fortress_Gate_2.json",
  "models/Fortress_Gate_3_Drawbridge.json",
  "models/Fortress_Gate_3_Wall.json",
  "models/Fortress_Gate_3.json",
  "models/Fortress_Inner_Corner.json",
  "models/Fortress_Ramp.json",
  "models/Fortress_Tower_Base_1.json",
  "models/Fortress_Tower_Base_2.json",
  "models/Fortress_Tower_E.json",
  "models/Fortress_Tower_Lower_Drawbridge.json",
  "models/Fortress_Tower_Upper_Drawbridge.json",
  "models/Fortress_Tower_W.json",
  "models/Fortress_Wall_Battlement.json",
  "models/Fortress_Wall.json",
  "models/Gilded_Bridge_Wall.json",
  "models/Gilded_Fortress_Bridge.json",
  "models/Gilded_Keep_Battlement.json",
  "models/Gilded_Keep_Corner.json",
  "models/Gilded_Keep_Wall.json",
  "models/Ground.json",
  "models/Harbor_Bridge.json",
  "models/Harbor_Gate.json",
  "models/Harbor_Gate_Mirrored.json",
  "models/Harbor_Island_Door.json",
  "models/Harbor_Island.json",
  "models/Harbor_Tower_N.json",
  "models/Harbor_Tower_S.json",
  "models/Keep_Corner.json",
  "models/Keep_Dock_Bridge.json",
  "models/Keep_Dock.json",
  "models/Keep_Tower.json",
  "models/Keep_Tower_Supports_3S.json",
  "models/Keep_Tower_Supports.json",
  "models/Keep_Wall_Battlement.json",
  "models/Keep_Wall.json",
]

// @method undefined load() -- Loads all the models and fires events at start and finish
// @event loading {} -- Requests for models have been sent to server
// @event loaded {} -- Models have finished loading; scene is available in .castle
castleMap.load = function() {
  loader.loadAll(castleMap.modelPaths, function(geometries, materialses) {
    var geometry, material;
    
    // Stock the O3D/Mesh forge. Strip paths and file extensions from model names
    for(var i in geometries) {
      fM.geometries[i.split('/').pop().split('.').shift()] = geometries[i];
    }
    for(var i in materialses) {
      fM.materials[i.split('/').pop().split('.').shift()] = new THREE.MeshFaceMaterial(materialses[i]).makeFlat();
    }
    
    var keep = f3D(THREE.Object3D, {}, [
      fM('Keep_Tower'          , {}),
      fM('Keep_Tower_Supports' , {}),
      fM('Keep_Wall'           , {position: [ 0, -3, 0]}),
      fM('Keep_Wall'           , {position: [ 3,  0, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Wall'           , {position: [ 0,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall'           , {position: [-3,  0, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Keep_Corner'         , {position: [-3, -3, 0]}),
      fM('Keep_Corner'         , {position: [ 3, -3, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Corner'         , {position: [ 3,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Corner'         , {position: [-3,  3, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [ 2, -3, 0]}),
      fM('Keep_Wall_Battlement', {position: [ 2,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [-3,  2, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [-3, -2, 0], euler: [0, 0, 1.5*Math.PI]}),
    ]);
    
    var harborKeep = f3D(THREE.Object3D, {}, [
      fM('Keep_Tower'            , {position: [-8, 0, 0]}),
      fM('Keep_Tower_Supports_3S', {position: [-8, 0, 0]}),
      fM('Keep_Tower'            , {}),
      fM('Keep_Tower_Supports_3S', {euler: [0, 0, Math.PI]}),
      
      fM('Keep_Corner'         , {position: [-11, -3, 0]}),
      fM('Keep_Wall_Battlement', {position: [-10, -3, 0]}),
      fM('Keep_Wall'           , {position: [- 8, -3, 0]}),
      fM('Keep_Wall_Battlement', {position: [- 6, -3, 0]}),
      fM('Keep_Wall'           , {position: [- 4, -3, 0]}),
      fM('Keep_Wall'           , {position: [  0, -3, 0]}),
      fM('Keep_Wall_Battlement', {position: [  2, -3, 0]}),
      fM('Keep_Corner'         , {position: [  3, -3, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [  3, -2, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Wall'           , {position: [  3,  0, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [  3,  2, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Keep_Corner'         , {position: [  3,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [  2,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall'           , {position: [  0,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [- 2,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall'           , {position: [- 4,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [- 6,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall'           , {position: [- 8,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [-10,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Keep_Corner'         , {position: [-11,  3, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Keep_Wall_Battlement', {position: [-11,  2, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Keep_Wall'           , {position: [-11,  0, 0], euler: [0, 0, 1.5*Math.PI]}),
    ]);
    
    var gildedKeep = f3D(THREE.Object3D, {}, [
      fM('Keep_Tower'            , {}),
      fM('Keep_Tower_Supports'   , {}),
      fM('Gilded_Keep_Wall'      , {position: [ 0, -3, 0]}),
      fM('Gilded_Keep_Wall'      , {position: [ 3,  0, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Gilded_Keep_Wall'      , {position: [ 0,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Gilded_Keep_Wall'      , {position: [-3,  0, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Gilded_Keep_Corner'    , {position: [-3, -3, 0]}),
      fM('Gilded_Keep_Corner'    , {position: [ 3, -3, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Gilded_Keep_Corner'    , {position: [ 3,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Gilded_Keep_Corner'    , {position: [-3,  3, 0], euler: [0, 0, 1.5*Math.PI]}),
      fM('Gilded_Keep_Battlement', {position: [-2, -3, 0]}),
      fM('Gilded_Keep_Battlement', {position: [ 2, -3, 0]}),
      fM('Gilded_Keep_Battlement', {position: [ 3, -2, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Gilded_Keep_Battlement', {position: [ 3,  2, 0], euler: [0, 0, 0.5*Math.PI]}),
      fM('Gilded_Keep_Battlement', {position: [-2,  3, 0], euler: [0, 0,     Math.PI]}),
      fM('Gilded_Keep_Battlement', {position: [-3, -2, 0], euler: [0, 0, 1.5*Math.PI]}),
    ]);
    
    castleMap.castle.add(
      castleMap.ground = fM('Ground', {}),
      castleMap.fortress = f3D(THREE.Object3D, {}, [
        f3D(gates.main, {
          matrix: fM4({ty: -21}),
          select: fM4({ty: -4, tz: 0.3, sx: 4, sy: 4}),
        }, [
          fM('Fortress_Gate_1', {}),
          gates.main.rightDoor = fM('Fortress_Gate_1_R_Door', {
            matrix      : fM4({tx: -1.5, ty: -4, tz: 4}),
            matrixOpen  : fM4({tx: -1.5, ty: -4, tz: 4, rz: Math.PI}),
            matrixClosed: fM4({tx: -1.5, ty: -4, tz: 4}),
          }),
          gates.main.leftDoor = fM('Fortress_Gate_1_L_Door', {
            matrix      : fM4({tx: 1.5, ty: -4, tz: 4}),
            matrixOpen  : fM4({tx: 1.5, ty: -4, tz: 4, rz: Math.PI}),
            matrixClosed: fM4({tx: 1.5, ty: -4, tz: 4}),
          }),
          fM('Fortress_Gate_1_Banner', {position: [-2.5, -7.25, 7.8]}),
          fM('Fortress_Gate_1_Banner', {position: [ 2.5, -7.25, 7.8]}),
          gates.main.rightSpiral = f3D(THREE.Object3D, {matrix: fM4({tx: -2.5, ty: -6.5, tz: 0.2, rz: Math.PI/24})}, [
            fM('Fortress_Gate_1_Spiral', {}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 0.4]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 0.8]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 1.2]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 1.6]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.0]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.4]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.8]}),
          ]),
          gates.main.leftSpiral = f3D(THREE.Object3D, {matrix: fM4({tx: 2.5, ty: -6.5, tz: 0.2, rz: Math.PI*23/24})}, [
            fM('Fortress_Gate_1_Spiral', {}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 0.4]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 0.8]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 1.2]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 1.6]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.0]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.4]}),
            fM('Fortress_Gate_1_Spiral', {position: [0, 0, 2.8]}),
          ]),
          fM('Fortress_Ramp'         , {position: [ 0  , -2   , 0  ], euler: [0, 0, 1.5*Math.PI]}),
        ]),
        
        fM('Fortress_Wall_Battlement', {position: [ 4  , -22  , 0]}),
        fM('Fortress_Wall'           , {position: [ 5.5, -22  , 0]}),
        fM('Fortress_Wall_Battlement', {position: [ 7  , -22  , 0]}),
        fM('Fortress_Wall'           , {position: [ 8.5, -22  , 0]}),
        fM('Fortress_Wall_Battlement', {position: [10  , -22  , 0]}),
        
        fM('Fortress_Corner', {position: [11, -22, 0], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Fortress_Wall'           , {position: [11, -19.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, -18  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, -16.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, -15  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, -13.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, -12  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, -10.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, - 9  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, - 7.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, - 6  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, - 4.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, - 3  , 0], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Harbor_Bridge'           , {position: [11, 0, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, 0, 0], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Fortress_Wall_Battlement', {position: [11, 3  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, 4.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, 6  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [11, 7.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [11, 9  , 0], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Fortress_Corner', {position: [11, 10, 0], euler: [0, 0, Math.PI]}),
        
        fM('Fortress_Wall_Battlement', {position: [ 10  , 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [  8.5, 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [  7  , 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [  5.5, 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [  4  , 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [  2.5, 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [  1  , 10, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [- 0.5, 10, 0], euler: [0, 0, Math.PI]}),
        
        fM('Fortress_Inner_Corner', {position: [-3, 10, 0]}),
        
        fM('Fortress_Wall'           , {position: [-3, 12  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-3, 13.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-3, 15  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-3, 16.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        
        f3D(gates.harbor, {
          matrix: fM4({tx: -4, ty: 20.5, rz: Math.PI/2}),
          select: fM4({ty: -4, tz: 0.3, sx: 4, sy: 4}),
        }, [
          fM('Fortress_Gate_3'           , {}),
          fM('Fortress_Gate_3_Wall'      , {matrix: fM4({          ty: - 6.5                         })}),
          fM('Fortress_Gate_1_Banner'    , {matrix: fM4({tx: -2.5, ty: - 7.25, tz: 7.8               })}),
          fM('Fortress_Gate_1_Banner'    , {matrix: fM4({tx:  2.5, ty: - 7.25, tz: 7.8               })}),
          fM('Fortress_Dock'             , {matrix: fM4({          ty: -12.5 ,         rz: -Math.PI/2})}),
          gates.harbor.door = fM('Fortress_Gate_3_Drawbridge', {
            matrix      : fM4({ty: - 7, tz: 3.8, rx: Math.PI*2/3, rz: -Math.PI/2}),
            matrixOpen  : fM4({ty: - 7, tz: 3.8, rx: Math.PI*2/3, rz: -Math.PI/2}),
            matrixClosed: fM4({ty: - 7, tz: 3.8,                  rz: -Math.PI/2}),
          }),
        ]),
        
        fM('Fortress_Wall_Battlement', {position: [-3, 24.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-3, 26  , 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-3, 27.5, 0], euler: [0, 0, 0.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-3, 29  , 0], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Fortress_Corner', {position: [-3, 31.5, 0], euler: [0, 0, Math.PI]}),
        
        fM('Fortress_Wall_Battlement', {position: [- 4  , 31.5, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [- 5.5, 31.5, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [- 7  , 31.5, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall'           , {position: [- 8.5, 31.5, 0], euler: [0, 0, Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-10  , 31.5, 0], euler: [0, 0, Math.PI]}),
        
        fM('Fortress_Corner', {position: [-11, 31.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        
        fM('Fortress_Wall'           , {position: [-11, 29, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, 27.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11, 26, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, 24.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        
        f3D(gates.nWInner, {
          matrix: fM4({tx: -10, ty: 20.5, rz: Math.PI*3/2}),
          select: fM4({ty: -4, tz: 3.9, sx: 3, sy: 3}),
        }, [
          fM('Fortress_Gate_2', {}),
          gates.nWInner.door = fM('Fortress_Gate_2_Drawbridge', {
            matrix      : fM4({ty: -2, tz: 3.8}),
            matrixOpen  : fM4({ty: -2, tz: 3.8}),
            matrixClosed: fM4({ty: -2, tz: 3.8, rx: -Math.PI*4/9}),
          }),
          fM('Fortress_Ramp', {matrix: fM4({ty: -4.5})}),
          fM('Fortress_Ramp', {matrix: fM4({ty: -4.5, rz: Math.PI})}),
        ]),
        
        fM('Fortress_Wall_Battlement', {position: [-11,  16.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,  15   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11,  13.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,  12   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11,  10.75, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,   9.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11,   8   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,   6.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11,   5   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,   3.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11,   2   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11,   0.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, - 1   , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11, - 2.5 , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, - 4   , 0], euler: [0, 0, 1.5*Math.PI]}),
        
        f3D(gates.sWInner, {
          matrix: fM4({tx: -10, ty: -8, rz: Math.PI*3/2}),
          select: fM4({ty: -4, tz: 3.9, sx: 3, sy: 3}),
        }, [
          fM('Fortress_Gate_2', {}),
          gates.sWInner.door = fM('Fortress_Gate_2_Drawbridge', {
            matrix      : fM4({ty: -2, tz: 3.8}),
            matrixOpen  : fM4({ty: -2, tz: 3.8}),
            matrixClosed: fM4({ty: -2, tz: 3.8, rx: -Math.PI*4/9}),
          }),
          fM('Fortress_Ramp', {matrix: fM4({ty: -4.5})}),
          fM('Fortress_Ramp', {matrix: fM4({ty: -4.5, rz: Math.PI})}),
        ]),
        
        fM('Fortress_Wall_Battlement', {position: [-11, -12  , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11, -13.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, -15  , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11, -16.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall_Battlement', {position: [-11, -18  , 0], euler: [0, 0, 1.5*Math.PI]}),
        fM('Fortress_Wall'           , {position: [-11, -19.5, 0], euler: [0, 0, 1.5*Math.PI]}),
        
        fM('Fortress_Corner'         , {position: [-11, -22, 0]}),
        
        fM('Fortress_Wall_Battlement', {position: [-10  , -22, 0]}),
        fM('Fortress_Wall'           , {position: [- 8.5, -22, 0]}),
        fM('Fortress_Wall_Battlement', {position: [- 7  , -22, 0]}),
        fM('Fortress_Wall'           , {position: [- 5.5, -22, 0]}),
        fM('Fortress_Wall_Battlement', {position: [- 4  , -22, 0]}),
        
        fM('Citadel_Door_Side', {}),
        f3D(gates.citadelInner, {
          matrix: fM4({tx: -1.275, ty: -2.85, tz: 5.1}),
          select: fM4({tx: 1.225, tz: -1.2, sx: 1.5, sy: 1.5})
        }, [
          gates.citadelInner.door = fM('Citadel_Door', {
            matrix      : fM4({rz: Math.PI/4}),
            matrixOpen  : fM4({rz: Math.PI/4}),
            matrixClosed: fM4({}),
          }),
        ]),
        fM('Citadel_Side'     , {euler: [0, 0, 0.5*Math.PI]}),
        fM('Citadel_Side'     , {euler: [0, 0,     Math.PI]}),
        fM('Citadel_Side'     , {euler: [0, 0, 1.5*Math.PI]}),
        fM('Citadel_Mezzanine', {}),
        fM('Citadel_Mezzanine', {euler: [0, 0, 0.5*Math.PI]}),
        fM('Citadel_Mezzanine', {euler: [0, 0,     Math.PI]}),
        fM('Citadel_Mezzanine', {euler: [0, 0, 1.5*Math.PI]}),
        
        f3D(gates.citadelOuter, {
          matrix: fM4({ty: -8}),
          select: fM4({ty: 1, tz: 0.3, sx: 3, sy: 3}),
        }, [
          gates.citadelOuter.door = fM('Fortress_Causeway_Drop'      , {
            matrixOpen  : fM4({}),
            matrixClosed: fM4({tz: -3.6}),
          }),
        ]),
        fM('Fortress_Causeway', {position: [-6.5, -8, 0]}),
        f3D(gates.citadelWest, {
          matrix: fM4({tx: -7.275, ty: -8, tz: 3.55}),
          select: fM4({tx: -1.25, tz: 0.3, sx: 2, sy: 2}),
        }, [
        gates.citadelWest.door = fM('Fortress_Causeway_Drawbridge', {
            matrixOpen  : fM4({}),
            matrixClosed: fM4({ry: Math.PI/2}),
          }),
        ]),
        fM('Fortress_Causeway', {position: [6.5, -8, 0], euler: [0, 0, Math.PI]}),
        f3D(gates.citadelEast, {
          matrix: fM4({tx: 7.275, ty: -8, tz: 3.55, rz: Math.PI}),
          select: fM4({tx: -1.25, tz: 0.3, sx: 2, sy: 2}),
        }, [
        gates.citadelEast.door = fM('Fortress_Causeway_Drawbridge', {
            matrixOpen  : fM4({}),
            matrixClosed: fM4({ry: Math.PI/2}),
          }),
        ]),
        
        f3D(gates.towerHarbor, {
          matrix: fM4({tx: 7, ty: 7, rz: Math.PI}),
          select: fM4({tz: 3.9, sx: 2, sy: 2}),
        }, [
          fM('Fortress_Tower_Base_2'          , {position: [ 0  ,  0  , 0  ]}),
          fM('Fortress_Tower_W'               , {position: [ 0  ,  0  , 4.2]}),
          gates.towerHarbor.lowerDoor = fM('Fortress_Tower_Lower_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 4.4}),
          }),
          gates.towerHarbor.upperDoor = fM('Fortress_Tower_Upper_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 7.6}),
          }),
        ]),
        
        f3D(gates.towerEast, {
          matrix: fM4({tx: -6.5, ty: -19}),
          select: fM4({tz: 3.9, sx: 2, sy: 2}),
        }, [
          fM('Fortress_Tower_Base_2'          , {position: [ 0  ,  0  , 0  ]}),
          fM('Fortress_Tower_W'               , {position: [ 0  ,  0  , 4.2]}),
          gates.towerEast.lowerDoor = fM('Fortress_Tower_Lower_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 4.4}),
          }),
          gates.towerEast.upperDoor = fM('Fortress_Tower_Upper_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 7.6}),
          }),
        ]),
        
        f3D(gates.towerWest, {
          matrix: fM4({tx: 6.5, ty: -19}),
          select: fM4({tz: 3.9, sx: 2, sy: 2}),
        }, [
          fM('Fortress_Tower_Base_1'          , {position: [0  ,  0  , 0  ]}),
          fM('Fortress_Tower_E'               , {position: [0  ,  0  , 4.2]}),
          gates.towerWest.lowerDoor = fM('Fortress_Tower_Lower_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 4.4, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 4.4}),
          }),
          gates.towerWest.upperDoor = fM('Fortress_Tower_Upper_Drawbridge', {
            matrix      : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixOpen  : fM4({tx: -0.5, ty: -1.5, tz: 7.6, rx: Math.PI*17/24}),
            matrixClosed: fM4({tx: -0.5, ty: -1.5, tz: 7.6}),
          }),
        ]),
        
        f3D(keep.clone(), {position: [-21.5, -23, 0]}),
        fM('Fortress_Bridge'       , {position: [-14.75, -21, 4.2]}),
        fM('Fortress_Bridge_Wall_2', {position: [-14.75, -21, 0  ]}),
        fM('Keep_Wall_Battlement'  , {position: [-23.5 , -26, 0  ]}),
        fM('Keep_Wall_Battlement'  , {position: [-18.5 , -25, 0  ], euler: [0, 0, 0.5*Math.PI]}),
        
        fM('Annex_Wall_S_End'    , {position: [-23.5, -18   , 0]}),
        fM('Annex_Wall_2'        , {position: [-23.5, -14   , 0]}),
        
        f3D(gates.sWOuter, {
          matrix: fM4({tx: -23.5, ty: -8}),
          select: fM4({tx: -0.5, tz: 0.3, sx: 3, sy: 3}),
        }, [
          fM('Annex_Gate', {}),
          gates.sWOuter.rightDoor = fM('Annex_Door', {
            matrix      : fM4({tx: -0.6, ty: 1.2}),
            matrixOpen  : fM4({tx: -0.6, ty: 1.2, rz: -Math.PI/2}),
            matrixClosed: fM4({tx: -0.6, ty: 1.2}),
          }),
          gates.sWOuter.leftDoor = fM('Annex_Door', {
            matrix      : fM4({tx: -0.6, ty: -1.2, rz: Math.PI}),
            matrixOpen  : fM4({tx: -0.6, ty: -1.2, rz: Math.PI*3/2}),
            matrixClosed: fM4({tx: -0.6, ty: -1.2, rz: Math.PI}),
          }),
        ]),
        
        fM('Annex_Wall_2'        , {position: [-23.5, - 2   , 0]}),
        fM('Annex_Wall_1'        , {position: [-23.5,   2   , 0]}),
        fM('Annex_Wall_Stretched', {position: [-23.5,   6.25, 0]}),
        fM('Annex_Wall_1'        , {position: [-23.5,  10.5 , 0]}),
        fM('Annex_Wall_2'        , {position: [-23.5,  14.5 , 0]}),
        
        f3D(gates.nWOuter, {
          matrix: fM4({tx: -23.5, ty: 20.5}),
          select: fM4({tx: -0.5, tz: 0.3, sx: 3, sy: 3}),
        }, [
          fM('Annex_Gate', {}),
          gates.nWOuter.rightDoor = fM('Annex_Door', {
            matrix      : fM4({tx: -0.6, ty: 1.2}),
            matrixOpen  : fM4({tx: -0.6, ty: 1.2, rz: -Math.PI/2}),
            matrixClosed: fM4({tx: -0.6, ty: 1.2}),
          }),
          gates.nWOuter.leftDoor = fM('Annex_Door', {
            matrix      : fM4({tx: -0.6, ty: -1.2, rz: Math.PI}),
            matrixOpen  : fM4({tx: -0.6, ty: -1.2, rz: Math.PI*3/2}),
            matrixClosed: fM4({tx: -0.6, ty: -1.2, rz: Math.PI}),
          }),
        ]),
        
        fM('Annex_Wall_2'        , {position: [-23.5,  26.5 , 0]}),
        
        f3D(keep.clone(), {position: [-21.5, 32.5, 0]}),
        fM('Fortress_Bridge'                , {position: [-14.75, 30.5, 4.2]}),
        fM('Fortress_Bridge_Wall_Mirrored_2', {position: [-14.75, 30.5, 0  ]}),
        fM('Keep_Wall_Battlement'           , {position: [-23.5 , 35.5, 0  ], euler: [0, 0, Math.PI]}),
        fM('Keep_Wall_Battlement'           , {position: [-18.5 , 34.5, 0  ], euler: [0, 0, 0.5*Math.PI]}),
        
        f3D(gildedKeep.clone(), {position: [20.5, -23, 0]}),
        fM('Gilded_Fortress_Bridge', {position: [14.5, -21, 4.2]}),
        fM('Gilded_Bridge_Wall'    , {position: [14.5, -21, 0  ]}),
        
        fM('Harbor_Tower_S'      , {position: [22.5, -15  , 0  ]}),
        
        f3D(gates.keepDock, {
          matrix: fM4({tx: 18.5, ty: -17}),
          select: fM4({tx: -0.25, ty: 1.25, tz: -0.2, sx: 2.5, sy: 2.5}),
        }, [
          fM('Keep_Dock', {}),
          gates.keepDock.door = fM('Keep_Dock_Bridge', {
            matrix      : fM4({tx: 2.5, tz: 4.4, ry: -Math.PI*2/3}),
            matrixOpen  : fM4({tx: 2.5, tz: 4.4, ry: -Math.PI*2/3}),
            matrixClosed: fM4({tx: 2.5, tz: 4.4}),
          }),
        ]),
        
        f3D(gates.island, {
          matrix: fM4({tx: 22.5, ty: 1.5}),
          select: fM4({tz: -0.2, sx: 2.5, sy: 7}),
        }, [
          fM('Harbor_Island'       , {}),
          gates.island.lowerDoor = fM('Harbor_Island_Door', {
            matrix      : fM4({tx: 0.75, ty: -6.25, tz: 3.8, rz: -Math.PI/2}),
            matrixOpen  : fM4({tx: 0.75, ty: -6.25, tz: 3.8, rz: -Math.PI/2}),
            matrixClosed: fM4({tx: 0.75, ty: -6.25, tz: 3.8}),
          }),
          gates.island.upperDoor = fM('Harbor_Island_Door', {
            matrix      : fM4({tx: 0.75, ty: 6.25, tz: 3.8, rz: Math.PI/2}),
            matrixOpen  : fM4({tx: 0.75, ty: 6.25, tz: 3.8, rz: Math.PI/2}),
            matrixClosed: fM4({tx: 0.75, ty: 6.25, tz: 3.8}),
          }),
        ]),
        
        f3D(gates.seawall1, {
          matrix: fM4({tx: 22.5, ty: -3.5}),
          select: fM4({ty: -4, tz: -0.2, sx: 2, sy: 3.5}),
        }, [
          gates.seawall1.door = fM('Harbor_Gate', {
            matrix      : fM4({}),
            matrixOpen  : fM4({ty: 5}),
            matrixClosed: fM4({}),
          }),
        ]),
        
        f3D(gates.seawall2, {
          matrix: fM4({tx: 22.5, ty: 6.5}),
          select: fM4({ty: 4, tz: -0.2, sx: 2, sy: 3.5}),
        }, [
          gates.seawall2.door = fM('Harbor_Gate_Mirrored', {
            matrix      : fM4({}),
            matrixOpen  : fM4({ty: -5}),
            matrixClosed: fM4({}),
          }),
        ]),
        
        f3D(gates.seawall3, {
          matrix: fM4({tx: 22.5, ty: 21.5}),
          select: fM4({ty: -4, tz: -0.2, sx: 2, sy: 3.5}),
        }, [
          gates.seawall3.door = fM('Harbor_Gate', {
            matrix      : fM4({}),
            matrixOpen  : fM4({ty: 5}),
            matrixClosed: fM4({}),
          }),
        ]),
        
        
        //fM('Harbor_Gate_Mirrored', {position: [22.5,   6.5, 0  ]}),
        //fM('Harbor_Gate'         , {position: [22.5,  21.5, 0  ]}),
        
        fM('Harbor_Tower_N'      , {position: [22.5,  24.5, 0  ]}),
        
        f3D(harborKeep.clone(), {position: [24.5, 32.5, 0]}),
        fM('Fortress_Bridge'                 , {position: [ 0.75, 30.5, 4.2], euler: [0, 0, Math.PI]}),
        fM('Fortress_Bridge_Extension'       , {position: [ 5.75, 30.5, 4.2], euler: [0, 0, Math.PI]}),
        fM('Fortress_Bridge_Extension'       , {position: [10.25, 30.5, 4.2], euler: [0, 0, Math.PI]}),
        fM('Fortress_Bridge_Wall_1'          , {position: [ 0.75, 30.5, 0  ], euler: [0, 0, Math.PI]}),
        fM('Fortress_Bridge_Wall_1_Extension', {position: [ 5.75, 30.5, 0  ], euler: [0, 0, Math.PI]}),
        fM('Fortress_Bridge_Wall_1_Extension', {position: [10.25, 30.5, 0  ], euler: [0, 0, Math.PI]}),
      ])
    ); // castleMap.castle
    
    castleMap.emit('loaded');
  }); // Loader.loadAll();
  
  castleMap.emit('loading');
} // castleMap.load
