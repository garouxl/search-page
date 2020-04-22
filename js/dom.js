/*  LIB helper que criei e costumo utilizar em meus projetos.
  * Mantive somente o utilzado.
*/

(function(win, doc) {
  "use strict";

  function DOM(elements) {
    if (!(this instanceof DOM)) return new DOM(elements);
    this.element = this.getDOMElements.call(elements);
    return this;
  }

  DOM.prototype.getDOMElements = function getDOMElements() {
    return doc.querySelectorAll(this);
  };

  DOM.prototype.on = function on(event, callBack) {
    this.setListener(event, callBack, "addEventListener");
  };

  DOM.prototype.off = function off(event, callBack) {
    this.setListener(event, callBack, "removeEventListener");
  };

  DOM.prototype.setListener = function(event, callBack, eventListener) {
    return Array.prototype.forEach.call(this.element, function(item) {
      item[eventListener](event, callBack, false);
    });
  };

  DOM.prototype.get = function get() {
    return this.element.length > 1 ? this.element : this.element[0];
  };

  DOM.prototype.arrayHandler = function arrayHandler(method, callBack) {
    return Array.prototype[method].apply(this.element, callBack);
  };

  DOM.prototype.forEach = function forEach() {
    return this.arrayHandler("forEach", arguments);
  };

  win.webMotors = win.webMotors || {}
  win.webMotors.DOM = DOM;

})(window, document);
