(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.VueFastMask = {}));
}(this, function (exports) { 'use strict';

	let bindingPatterns = {
	  'L': new RegExp(/[A-Za-z]/g),
	  //Latin
	  'C': new RegExp(/[А-Яа-я]/g),
	  //Cyrillic
	  'N': new RegExp(/[0-9]/g),
	  //Number
	  'A': new RegExp(/[А-Яа-яA-Za-z]/g),
	  //Any letter
	  'S': new RegExp(/[авекмнорстухАВЕКМНОРТСУХ]/g),
	  //Vehicle registration plate
	  'V': new RegExp(/[a-zA-Z0-9]/g),
	  //VIN
	  'H': new RegExp(/0-9авекмнорстухАВЕКМНОРТСУХ/g) //Number and vehicle registration plate

	};
	let regexpStr = '[' + Object.keys(bindingPatterns).join('') + ']';
	let regExp = new RegExp(regexpStr, 'g');

	let init = (el, binding, vnode) => {
	  el.addEventListener('keypress', maskHandler.bind(undefined, vnode, binding));
	};

	let getValue = (target, object) => {
	  let matches = object.split('.');
	  if (matches.length > 2) return getValue(target[matches.splice(0, 1)], matches.join('.'));else if (matches.length === 2) return target[matches[0]][matches[1]];else return target[matches[0]];
	};

	let maskHandler = (vnode, binding, event) => {
	  let mask = binding.value === binding.expression.replace(/['"]+/g, '') ? binding.value : getValue(vnode.context, binding.expression);
	  let oldValue = event.target.value,
	      key = event.key,
	      position = oldValue.length,
	      toAdd = '';

	  if (position >= mask.length) {
	    event.preventDefault();
	    return;
	  }

	  while (position < mask.length && !mask[position].match(regExp)) {
	    toAdd += mask[position++];
	  }

	  let matches = key.match(bindingPatterns[mask[position]]);

	  if (matches && matches.length) {
	    event.preventDefault();
	    event.target.value = event.target.value + toAdd + key;
	    let newEvent = new Event('input');
	    event.target.dispatchEvent(newEvent);
	  } else {
	    event.preventDefault();
	  }
	};

	var directive = {
	  bind: (el, binding, vnode) => init(el, binding, vnode)
	};

	/**
	 * Vue plugin definition
	 * @param {Vue} Vue
	 */

	var plugin = (Vue => {
	  Vue.directive('mask', directive);
	});

	exports.default = plugin;
	exports.VueMaskPlugin = plugin;
	exports.VueMaskDirective = directive;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
