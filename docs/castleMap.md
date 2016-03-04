# castleMap.js

Creates a THREE.Object3D castle

Dependencies: `THREE.js` , `THREE.Densaugeo.js` , `EventEmitter.js` 

```
scene.add(castleMap.castle);
castleMap.load(callback);
```

---

## Gate

Inherits: `THREE.Densaugeo.IntObject`

Used for the many Gates which appear herein

#### Methods

`undefined` **close**`()` -- Close the gate (using preset matrices, exposed in .controls)

`undefined` **open**`()` -- Open the gate (using preset matrices, exposed in .controls)

---

## GatedTower

Inherits: `THREE.Densaugeo.IntObject`

Used for the many Gates which appear herein

#### Methods

`undefined` **closeLower**`()` -- Close the lower door (using preset matrices, exposed in .controls)

`undefined` **closeUpper**`()` -- Close the upper door (using preset matrices, exposed in .controls)

`undefined` **openLower**`()` -- Open the lower door (using preset matrices, exposed in .controls)

`undefined` **openUpper**`()` -- Open the upper door (using preset matrices, exposed in .controls)

---

## DoubleGate

Inherits: `THREE.Densaugeo.IntObject`

Used for the many Gates which appear herein

#### Methods

`undefined` **closeLeft**`()` -- Close the left side of the gate (using preset matrices, exposed in .controls)

`undefined` **closeRight**`()` -- Close the right side of the gate (using preset matrices, exposed in .controls)

`undefined` **openLeft**`()` -- Open the left side of the gate (using preset matrices, exposed in .controls)

`undefined` **openRight**`()` -- Open the right side of the gate (using preset matrices, exposed in .controls)

---

## castleMap

Inherits: `EventEmitter`

Actually defined as a singleton instance...going to worry about finding the right way to do it later

#### Properties

`THREE.Object3D` **castle** -- Base object

`THREE.Object3D` **fortress** -- The whole fortress

`Object` **gates** -- All the gates of the castle

`THREE.Object3D` **ground** -- The ground's mesh

`[String]` **modelPaths** -- Paths to each THREE.js model

#### Methods

`undefined` **load**`()` -- Loads all the models and fires events at start and finish

#### Events

**loaded** `{}` -- Models have finished loading; scene is available in .castle

**loading** `{}` -- Requests for models have been sent to server

