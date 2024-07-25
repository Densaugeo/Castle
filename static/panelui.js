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
    this.update()
  }
  
  /** @type {Command | null} */
  linked_command = null
  
  _enable_listener  = () => this._el_button.classList.add('enabled')
  _disable_listener = () => this._el_button.classList.remove('enabled')
  
  /**
   * @param {Command} command
   */
  link(command) {
    if(this.linked_command) throw new Error('Already linked to a command')
    
    this.linked_command = command
    this.update()
    
    command.addEventListener('enable' , this._enable_listener )
    command.addEventListener('disable', this._disable_listener)
  }
  
  unlink() {
    if(!this.linked_command) throw new Error('Already not linked to a command')
    
    this.linked_command.removeEventListener('enable' , this._enable_listener )
    this.linked_command.removeEventListener('disable', this._disable_listener)
    
    this.linked_command = null
    this.update()
  }
  
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
      color: #ddd;
    }
    button.enabled > svg {
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
    
    this.shadow.append(
      this._node_text = fT(''),
      this._el_button = this.shadow.fE('button', [
        fE('i', { className: 'fa', }),
      ]),
    )
  }
  
  update() {
    const command = this.linked_command
    
    this._node_text.textContent = this.key
    this._el_button.className = command?.enabled ? 'enabled' : ''
    this._el_button.innerHTML = command?.icon ? svg_icons[command.icon] : ''
    
    this.setAttribute('title', [
      command?.tooltip,
      this.key ? `Key: ${this.key}` : '',
    ].filter(Boolean).join('\n\n'))
    
    this.onclick = command?.fn
  }
}
customElements.define('command-slot', CommandSlot)

export class Command extends EventTarget {
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
    if(icon.slice(-4) !== '.svg') {
      throw TypeError('icon should be a filename ending in .svg')
    }
    
    super()
    
    this.#icon = icon
    this.#tooltip = tooltip
    this.#fn = fn
  }
}

export class Menu extends EventTarget {
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

export class Panel extends EventTarget {
  constructor() {
    super()
    
    this.content = null
    
    // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
    this.domElement = fE('div', { className: 'panel', tabIndex: 0,
      style: 'display:none' }, [
      this.heading_element = fE('div', { className: 'panel_heading' }),
    ])
  }
  
  open(heading, content) {
    this.domElement.title = heading
    this.heading_element.textContent = heading
    
    if(this.content) this.domElement.replaceChild(content, this.content)
    else this.domElement.append(content)
    this.domElement.style.display = ''
    
    this.content = content
    
    this.domElement.focus()
    
    this.emit('open')
  }
  
  close() {
    this.domElement.style.display = 'none'
    this.domElement.removeChild(this.content)
    
    this.content = null
    
    this.emit('close')
  }
  
  toggle(heading, content) {
    if(this.content === content) this.close()
    else this.open(heading, content)
  }
}
