import { svg_icons } from './icons/svg-icons.js'

/**
 * Daisy-chainable HTML element maker. If an array is supplied as the second
 * argument, it is interpreted as children instead of properties
 * 
 * @param {string} tagName
 * @param {Object} properties
 * @param {HTMLElement[]} children
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
globalThis.fE = fE

/**
 * Appends result of daisy-chainable element maker fE() as child element
 * 
 * @param {string} tagName
 * @param {Object} properties
 * @param {HTMLElement[]} children
 * @returns {HTMLElement}
 */
HTMLElement.prototype.fE = function() {
  return this.appendChild(fE(...arguments))
}

/**
 * Appends result of daisy-chainable element maker fE() as child element
 * 
 * @param {string} tagName
 * @param {Object} properties
 * @param {HTMLElement[]} children
 * @returns {HTMLElement}
 */
ShadowRoot.prototype.fE = function() {
  return this.appendChild(fE(...arguments))
}

/**
 * Abbreviation for document.createTextNode()
 * 
 * @param {string} text
 * @returns {Text}
 */
export const fT = (text) => {
  return document.createTextNode(text)
}
globalThis.fT = fT

/**
 * Appends result of document.createTextNode() as child element
 * 
 * @param {string} text
 * @returns {Text}
 */
HTMLElement.prototype.fT = function(text) {
  return this.appendChild(document.createTextNode(text))
}

/**
 * Appends result of document.createTextNode() as child element
 * 
 * @param {string} text
 * @returns {Text}
 */
ShadowRoot.prototype.fT = function(text) {
  return this.appendChild(document.createTextNode(text))
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
export class Sidebar extends EventTarget {
  constructor() {
    super()
  
  // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
  this.domElement = fE('div', {id: 'sidebar', tabIndex: 1, accessKey: '1'}, [
    fE('command-slot', { key: '1' }),
    fE('command-slot', { key: '2' }),
    fE('command-slot', { key: '3' }),
    fE('command-slot', { key: '4' }),
    fE('command-slot', { key: '5' }),
    fE('command-slot', { key: '6' }),
    fE('command-slot', { key: '7' }),
    fE('command-slot', { key: '8' }),
    fE('command-slot', { key: '9' }),
    fE('command-slot', { key: '0' }),
  ])
  
  /** @type {CommandSlot[]} */
  this.slots = this.domElement.querySelectorAll('command-slot')
  
  // @prop HTMLCollection children -- Alias for domElement.children
  this.children = this.domElement.children;
  
  this.domElement.title = 'Key: ' + this.domElement.accessKeyLabel;
  
  // @prop Object keyCodesToButtonIndices -- Look up a keyCode and get a button index
  this.keyCodesToButtonIndices = {49: 0, 50: 1, 51: 2, 52: 3, 53: 4, 54: 5, 55: 6, 56: 7, 57: 8, 48: 9};
  
  // @prop Array buttonIndicesToKeyChars -- Look up a button index and get a char for its key
  this.buttonIndicesToKeyChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  document.addEventListener('keydown', e => {
    var index = this.keyCodesToButtonIndices[e.keyCode];
    
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && this.slots[index]) {
      this.slots[index].click()
    }
  });
  }
}

export class CommandSlot extends HTMLElement {
  /** @type {string} */
  _key = ''
  get key() { return this._key }
  set key(v) {
    this._key = v
    this.render()
  }
  
  /** @type {Command | null} */
  _command = null
  get command() { return this._command }
  set command(v) {
    if(this._command) {
      this._command.off('enable' , this._enable_listener )
      this._command.off('disable', this._disable_listener)
    }
    
    this._command = v
    
    if(this._command) {
      this._command.on('enable' , this._enable_listener )
      this._command.on('disable', this._disable_listener)
    }
    
    this.render()
  }
  
  _enable_listener  = () => { this.classList.add('enabled') }
  _disable_listener = () => { this.classList.remove('enabled') }
  
  constructor() {
    super()
    
    this.shadow = this.attachShadow({ mode: 'closed' })
    
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`
    :host {
      position: relative;
      display: flex;
      width: 36px;
      height: 36px;
      
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #ddd;
      line-height: 1.42857143;
      background: rgba(0, 0, 0, 0);
    }
    
    button {
      position: absolute;
      left: 0;
      top: 0;
      width: 36px;
      height: 36px;
      margin: 0;
      border: none;
      padding: 0;
      background: rgba(0, 0, 0, 0);
    }
    
    svg {
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      margin: 0;
      padding: 6px;
      color: #a9d;
    }
    :host(.enabled) > button > svg {
      color: #0ff;
    }
    button:hover > svg {
      color: #0f0;
    }
    button:focus {
      outline: 1px dashed #0f0;
      outline-offset: -2px;
    }
    button:focus:active {
      outline: none;
    }
    button:focus:active > svg {
      color: #c0f;
    }
    `)
    this.shadow.adoptedStyleSheets = [sheet]
  }
  
  connectedCallback() {
    this.render()
  }
  
  disconnectedCallback() {
    // Nulling out linked command removes related event listeners
    this.command = null
  }
  
  render() {
    const command = this.command
    
    this.shadow.replaceChildren(
      fT(this.key),
      fE('button', { innerHTML: command?.icon ? svg_icons[command.icon] : '' }),
    )
    
    this.setAttribute('title', [
      command?.tooltip,
      this.key ? `Key: ${this.key}` : '',
    ].filter(Boolean).join('\n\n'))
    
    this.onclick = command?.fn
    
    if(command?.enabled) this.classList.add('enabled')
    else this.classList.remove('enabled')
  }
}
customElements.define('command-slot', CommandSlot)

export class Command extends EventTarget {
  /** @type {string} */
  #icon
  get icon() { return this.#icon }
  set icon(v) { this.#icon = v; this.emit('change') }
  
  /** @type {string} */
  #tooltip
  get tooltip() { return this.#tooltip }
  set tooltip(v) { this.#tooltip = v; this.emit('change') }
  
  #fn
  /** @type {function} */
  get fn() { return this.#fn }
  set fn(v) { this.#fn = v; this.emit('change') }
  
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
    if(icon.slice(-4) !== '.svg') {
      throw TypeError('icon should be a filename ending in .svg')
    }
    
    super()
    
    this.#icon = icon
    this.#tooltip = tooltip
    this.#fn = fn
  }
}

/** @type DensPanel[] Used to ensure only one panel is open at a time. Hope to
 *        remove this when I make panel movable */
const panel_sync = []

export class DensPanel extends HTMLElement {
  _heading = 'Heading Goes Here'
  get heading() { return this._heading }
  set heading(v) { this._heading = v; this.render() }
  
  _enabled = false
  get enabled() { return this._enabled }
  set enabled(v) {
    this._enabled = v
    this.render()
    
    this.command.enabled = v
    
    if(v) panel_sync.forEach(v => { if(v !== this) v.enabled = false })
    if(v) this.focus()
  }
  
  _command = new Command('help-circle.svg', 'Tooltip goes here', () => {
    this.enabled = !this.enabled
  })
  get command() { return this._command }
  get command_icon() { return this.command.icon }
  set command_icon(v) { this.command.icon = v }
  get command_tooltip() { return this.command.tooltip }
  set command_tooltip(v) { this.command.tooltip = v }
  
  constructor() {
    super()
    
    panel_sync.push(this)
    
    this.shadow = this.attachShadow({ mode: 'closed' })
    
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`
    :host {
      position: relative;
      display: inline-block;
      
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: #ddd;
      line-height: 1.42857143;
      background: rgba(0, 0, 0, 0);
    }
    .panel_heading {
      width: 100%;
      min-height: 24px;
      margin-bottom: 6px;
      font-size: 16px;
      color: #aff;
      text-align: center;
    }
    `)
    this.shadow.adoptedStyleSheets = [sheet]
  }
  
  connectedCallback() {
    this.render()
  }
  
  render() {
    this.shadow.replaceChildren(
      fE('div', { className: 'panel_heading' }, [this.heading]),
      fE('slot', { name: 'content' }),
    )
    
    this.setAttribute('title', this.heading)
    this.setAttribute('tabIndex', 0)
    
    this.style.display = this.enabled ? '' : 'none'
  }
}
customElements.define('dens-panel', DensPanel)
