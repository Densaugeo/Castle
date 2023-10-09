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
export const Sidebar = function Sidebar() {
  EventEmitter.call(this);
  
  // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
  this.domElement = fE('div', {id: 'sidebar', tabIndex: 1, accessKey: '1'});
  
  // @prop HTMLCollection children -- Alias for domElement.children
  this.children = this.domElement.children;
  
  this.domElement.title = 'Key: ' + this.domElement.accessKeyLabel;
  
  // @prop Object keyCodesToButtonIndices -- Look up a keyCode and get a button index
  this.keyCodesToButtonIndices = {49: 0, 50: 1, 51: 2, 52: 3, 53: 4, 54: 5, 55: 6, 56: 7, 57: 8, 58: 9, 48: 10, 173: 11, 61: 12};
  
  // @prop Array buttonIndicesToKeyChars -- Look up a button index and get a char for its key
  this.buttonIndicesToKeyChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  
  // @method undefined addButton(Object {String faClass, String title, String buttonName}) -- Add a button. Support font-awesome icon names
  // @event trigger {String buttonName} -- Fired when a button is triggered
  // @event [buttonName] {} -- Fired when a button is triggered. Event name is the buttonName defined when the corresponding button was added
  this.addButton = function(/*Object*/ options) {
    options = options || {};
    
    var element = fE('i', {
      className  : 'fa ' + 'button ' + (options.faClass || ''),
      textContent: options.char || '',
      title      : (options.title || 'Not yet described') + '\n\nKey: ' + this.buttonIndicesToKeyChars[this.children.length],
      tabIndex   : 0,
    });
    
    element.addEventListener('click', e => {
      this.domElement.focus();
      this.emit('trigger', {buttonName: options.buttonName});
      this.emit(options.buttonName);
    });
    
    this.domElement.appendChild(element);
  }
  
  this.domElement.addEventListener('keydown', e => {
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && e.keyCode === 13 && e.target.classList.contains('button')) {
      e.target.dispatchEvent(new MouseEvent('click'));
    }
  });
  
  document.addEventListener('keydown', e => {
    var index = this.keyCodesToButtonIndices[e.keyCode];
    
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && this.children[index]) {
      this.children[index].dispatchEvent(new MouseEvent('click'));
    }
  });
}
Sidebar.prototype = Object.create(EventEmitter.prototype);
Sidebar.prototype.constructor = Sidebar;

export const Panel = function Panel() {
  EventEmitter.call(this);
  
  var self = this
  
  this.content = null
  
  // @prop HTMLElement domElement -- div tag that holds all of the Panel's HTML elements
  this.domElement = fE('div', { className: 'panel', tabIndex: 0,
    style: 'display:none' }, [
    this.heading_element = fE('div', { className: 'panel_heading' }),
    this.closeButton = fE('i', { className: 'fa fa-close panel_close button', 
      tabIndex: 0, title: 'Close panel\n\nKey: Q' }),
  ])
  
  // @prop Object keyCuts -- Key-value store of keyboard shortcuts. Keys are .keyCode numbers, values are HTMLElement references
  this.keyCuts = {};
  
  this.keyCuts[81] = this.closeButton; // Q is for quit
  
  this.domElement.addEventListener('keydown', e => {
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && this.keyCuts[e.keyCode]) {
      e.stopPropagation();
      
      this.keyCuts[e.keyCode].dispatchEvent(new MouseEvent('click'));
    }
    
    if(!e.altKey && !e.ctrlKey && !e.shiftKey && e.keyCode == 13) {
      e.stopPropagation()
      
      e.target.dispatchEvent(new MouseEvent('click'))
    }
  });
  
  this.closeButton.addEventListener('click', e => {
    self.close();
  });
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
}

// @method proto undefined close() -- Removes Panel's domElement from the document
// @event close {} -- Fired on panel close
Panel.prototype.close = function() {
  this.domElement.style.display = 'none'
  this.domElement.removeChild(this.content)
  
  this.content = null
  
  this.emit('close')
}
