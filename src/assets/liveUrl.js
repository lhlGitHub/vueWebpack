if(typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
		if(target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for(var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if(source != null) {
				for(var key in source) {
					if(Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
	var updateVersion = function updateVersion() {
		var newSearch = '?' + Obj2URL(Object.assign(URLparams, {
			v: new Date().getTime()
		}));
		location.replace(location.origin + location.pathname + newSearch + location.hash);
	};
	var URL2Obj = function URL2Obj(u) {
		return u ? Object.assign.apply(Object, _toConsumableArray(u.split('&').filter(function (e) {
			return e;
		}).map(function (e) {
			return function (a, b) {
				return _defineProperty({}, a, b);
			}.apply(undefined, _toConsumableArray(e.split('=')));
		}))) : {};
	};

	var Obj2URL = function Obj2URL(o) {
		return Object.keys(o).map(function (e) {
			return e + '=' + o[e];
		}).join('&');
	};

	var resourceMap = function resourceMap(name) {
		return window.GD.map[name] || name + '.js';
	};
	var inject = function inject(script) {
		var queue = script.split('|');
		var head = document.getElementsByTagName('head')[0];
		queue.forEach(function (q) {
			var js = document.createElement('script');
			js.type = 'text/javascript';
			js.src = resourceMap(q);
			head.appendChild(js);
		});
	};

	var URLconfig = URL2Obj(location.href.match(/([^\?]+)/g)[2]);
	var URLparams = URL2Obj(location.search.slice(1));

	window.TF = {
		Obj2URL: Obj2URL,
		URL2Obj: URL2Obj
	};

	window.GD = {
		URLconfig: URLconfig,
		URLparams: URLparams,
		map: {
			vconsole: './assets/vconsole.min.js'
		}
	};

	window.GM = {
		inject: inject
	};

	var isOver = new Date().getTime() - (URLparams.T || 30000) > Number(URLparams.v);

	if (!URLparams.v || isOver) updateVersion();
	if (URLparams.inject) inject(URLparams.inject);
})();