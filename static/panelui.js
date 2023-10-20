/**
 * @depends EventEmitter.js
 */

/**
 * Daisy-chainable HTML element maker. If an array is supplied as the second
 * argument, it is interpreted as children instead of properties
 * 
 * @param {String} tagName
 * @param {Object | Array} [properties={}]
 * @param {Array} [children=[]]
 * @returns {HTMLElement}
 */
export const fE = (tagName, properties={}, children=[]) => {
  if(properties instanceof Array) {
    children = properties.concat(children)
    properties = {}
  }
  
  const element = document.createElement(tagName)
  
  for(const key in properties) {
    try {
      element[key] = properties[key]
    } catch {
      // .setAttribute() is necessary for certain attributes like <input>'s
      // list. A normal assignment is ignored in that case. This should not be
      // done in most cases (textContent and className properties cannot be set
      // by .setAttribute() for example)
      if(element[key] == null) element.setAttribute(key, properties[key])
    }
  }
  
  element.append(...children)
  return element
}

/**
 * Appends result of daisy-chainable element maker fE() as child element
 * 
 * @param {String} tagName
 * @param {Object | Array} [properties={}]
 * @param {Array} [children=[]]
 * @returns {HTMLElement}
 */
HTMLElement.prototype.fE = function() {
  return this.appendChild(fE(...arguments))
}

/**
 * @module PanelUI.Sidebar inherits EventEmitter
 * @description Makes a sidebar. Buttons added to the sidebar can be triggered by clicks or keyboard shortcuts 1-9, 0, -, and =
 * @description Icons come from Font Awesome and are specified in the faClass option
 * 
 * @example var sidebar = new PanelUI.Sidebar();
 * @example sidebar.addButton({buttonName: 'do_stuff', faClass: 'fa-question', title: 'Tooltip text'});
 * @example sidebar.on('do_stuff', function() {console.log('Doing stuff')});
 * @example sidebar.on('trigger', function(e) {console.log(e.buttonName === 'do_stuff')});
 */
export const Sidebar = function Sidebar(options) {
  EventEmitter.call(this);
  
  this.buttons = new Array(10)
  
  // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
  this.domElement = fE('div', {id: 'sidebar', tabIndex: 1, accessKey: '1'}, [
    fE('div', ['1', this.buttons[0] = fE('i', { tabIndex: 0 })]),
    fE('div', ['2', this.buttons[1] = fE('i', { tabIndex: 0 })]),
    fE('div', ['3', this.buttons[2] = fE('i', { tabIndex: 0 })]),
    fE('div', ['4', this.buttons[3] = fE('i', { tabIndex: 0 })]),
    fE('div', ['5', this.buttons[4] = fE('i', { tabIndex: 0 })]),
    fE('div', ['6', this.buttons[5] = fE('i', { tabIndex: 0 })]),
    fE('div', ['7', this.buttons[6] = fE('i', { tabIndex: 0 })]),
    fE('div', ['8', this.buttons[7] = fE('i', { tabIndex: 0 })]),
    fE('div', ['9', this.buttons[8] = fE('i', { tabIndex: 0 })]),
    fE('div', ['0', this.buttons[9] = fE('i', { tabIndex: 0 })]),
  ]);
  
  // @prop HTMLCollection children -- Alias for domElement.children
  this.children = this.domElement.children;
  
  this.domElement.title = 'Key: ' + this.domElement.accessKeyLabel;
  
  // @prop Object keyCodesToButtonIndices -- Look up a keyCode and get a button index
  this.keyCodesToButtonIndices = {49: 0, 50: 1, 51: 2, 52: 3, 53: 4, 54: 5, 55: 6, 56: 7, 57: 8, 58: 9, 48: 10};
  
  // @prop Array buttonIndicesToKeyChars -- Look up a button index and get a char for its key
  this.buttonIndicesToKeyChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  this._commands = new Array(10).fill(null)
  this._enable_listeners = new Array(10)
  this._disable_listeners = new Array(10)
  this.buttons.forEach((v, i) => {
    this._enable_listeners [i] = () => v.classList.add   ('enabled')
    this._disable_listeners[i] = () => v.classList.remove('enabled')
  })
  
  /**
   * @param {number} slot
   * @param {Command} command
  */
  this.setCommand = function(slot, command) {
    this.clearCommand(slot)
    
    this._commands[slot] = command
    
    const target = this.buttons[slot]
    if(command.icon.length > 1) target.classList.add(command.icon)
    if(command.icon.length === 1) target.textContent = command.icon
    target.title = command.tooltip + '\n\n' + target.title
    target.addEventListener('trigger', command.fn)
    
    command.on('enable' , this._enable_listeners [slot])
    command.on('disable', this._disable_listeners[slot])
  }
  
  /**
   * @param {number} slot
   */
  this.clearCommand = function(slot) {
    const target = this.buttons[slot]
    target.className = 'fa button'
    target.textContent = ''
    target.title = 'Key: ' + ((slot + 1) % 10)
    target.removeEventListener('trigger', this._commands[slot])
    
    if(this._commands[slot]) {
      this._commands[slot].off('enable' , this._enable_listeners [slot])
      this._commands[slot].off('disable', this._disable_listeners[slot])
    }
    
    this._commands[slot] = null
  }
  
  for(let i = 0; i < 10; ++i) this.clearCommand(i)
  
  this.domElement.addEventListener('click', e => {
    this.domElement.focus()
    e.target.dispatchEvent(new CustomEvent('trigger'))
  })
  
  this.domElement.addEventListener('keydown', e => {
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && e.keyCode === 13 && e.target.classList.contains('button')) {
      e.target.dispatchEvent(new CustomEvent('trigger'));
    }
  });
  
  document.addEventListener('keydown', e => {
    var index = this.keyCodesToButtonIndices[e.keyCode];
    
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && this.buttons[index]) {
      this.buttons[index].dispatchEvent(new CustomEvent('trigger'));
    }
  });
}
Sidebar.prototype = Object.create(EventEmitter.prototype);
Sidebar.prototype.constructor = Sidebar;

export class Command extends EventEmitter {
  /** @type {string} */
  #icon
  get icon() { return this.#icon }
  
  /** @type {string} */
  #tooltip
  get tooltip() { return this.#tooltip }
  
  #fn
  /** @type {function} */
  get fn() { return this.#fn }
  
  /** @type {boolean} */
  #enabled = false
  get enabled() { return this.#enabled }
  set enabled(v) {
    this.#enabled = Boolean(v)
    this.emit(this.#enabled ? 'enable' : 'disable')
  }
  
  /**
   * @param {string} icon
   * @param {string} tooltip
   * @param {function} fn
  */
  constructor(icon, tooltip, fn) {
    if(icon.length > 1 && icon.substring(0, 3) !== 'fa-') {
      throw TypeError('icon should be a single char or a font-awesome icon')
    }
    
    super()
    
    this.#icon = icon
    this.#tooltip = tooltip
    this.#fn = fn
  }
}

export class Menu extends EventEmitter {
  /** @type {string} */
  get heading() { return this._heading }
  
  /** @type {HTMLElement} */
  get content() { return this._content }
  
  /** @type {Command} */
  get command() { return this._command }
  
  /**
   * @param {string} icon
   * @param {string} tooltip
   * @param {Panel} panel
   */
  constructor(icon, tooltip, panel) {
    super()
    
    this._command = new Command(icon, tooltip, () => {
      panel.toggle(this.heading, this.content)
    })
    
    // Suppress return values because EventEmitter sometimes uses them to remove
    // listeners
    panel.on('close', () => { this.command.enabled = false })
    panel.on('open' , () => { this.command.enabled = panel.content ===
      this.content })
  }
}

export const Panel = function Panel() {
  EventEmitter.call(this);
  
  this.content = null
  
  // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
  this.domElement = fE('div', { className: 'panel', tabIndex: 0,
    style: 'display:none' }, [
    this.heading_element = fE('div', { className: 'panel_heading' }),
  ])
}
Panel.prototype = Object.create(EventEmitter.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.open = function(heading, content) {
  this.domElement.title = heading
  this.heading_element.textContent = heading
  
  if(this.content) this.domElement.replaceChild(content, this.content)
  else this.domElement.append(content)
  this.domElement.style.display = ''
  
  this.content = content
  
  this.domElement.focus()
  
  this.emit('open')
}

// @method proto undefined close() -- Removes Panel's domElement from the document
// @event close {} -- Fired on panel close
Panel.prototype.close = function() {
  this.domElement.style.display = 'none'
  this.domElement.removeChild(this.content)
  
  this.content = null
  
  this.emit('close')
}

Panel.prototype.toggle = function(heading, content) {
  if(this.content === content) this.close()
  else this.open(heading, content)
}
