/**
 * @author VickyHuang
 * @param {Object} "args":
 * @description 动态创建加载 css/js
 */
var loadDoc = {
	filterDoc: function(tag, url) {
		var _tags = document.getElementsByTagName(tag),
			attr = tag === 'script' ? 'src' : 'href',
			urls = [];

		for (var i = 0; i < _tags.length; i++) {
			for (var j = 0; j < url.length; j++) {
				if (_tags[i].getAttribute(attr) === url[j]) {
					urls = url.slice(0, j).concat(url.slice(j + 1, url.length));
				}
			}
		}
		if (urls.length > 0) {
			return urls;
		} else {
			return [];
		}
	},

	JS: {
		jsOnload: function(node, callback) {
			node.onload = node.onreadystatechange = function() {
				if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
					callback && callback.call(this);
					node.onload = node.onreadystatechange = null;
				}
			}
		},

		poll: function(node, callback) {
			var i = 0;

			for (; i < node.length; i++) {
				if (i === node.length - 1) {
					loadDoc.JS.jsOnload(node[i], function() {
						callback && callback.call(this);
					});
				} else {
					loadDoc.JS.jsOnload(node[i], function() {});
				}
			}
		},

		loaded: function(url, callback) {
			var _head = document.getElementsByTagName('head')[0],
				tag = [],
				// urls = url;
				urls = loadDoc.filterDoc('script', url);

			urls = urls.length > 0 ? urls : url;

			for (var i = 0; i < urls.length; i++) {
				tag[i] = document.createElement("script");
				tag[i].setAttribute("type", "text/javascript");
				tag[i].setAttribute("src", urls[i]);
				if ($("script[src='" + urls[i] + "']").length > 0) {
					$("script[src='" + urls[i] + "']").remove();
				}
				_head.appendChild(tag[i]);
			}

			loadDoc.JS.poll(tag, callback);
		}
	},

	CSS: {
		styleOnload: function(node, callback) {
			// for IE6-9 and Opera
			for (var i = 0; i < node.length; i++) {
				if (node[i].attachEvent) {
					if (i === (node.length - 1)) {
						node[i].attachEvent('onload', callback);
					} else {
						node[i].attachEvent('onload', function() {});
					}
					// NOTICE:
					// 1. "onload" will be fired in IE6-9 when the file is 404, but in
					// this situation, Opera does nothing, so fallback to timeout.
					// 2. "onerror" doesn't fire in any browsers!
				}
				// polling for Firefox, Chrome, Safari
				else {
					var j = i;
					if (j === (node.length - 1)) {
						setTimeout(function() {
							loadDoc.CSS.poll(node[j], callback);
						}, 0); // for cache
					} else {
						setTimeout(function() {
							loadDoc.CSS.poll(node[j], function() {});
						}, 0);
					}
				}
			}
		},
		poll: function(node, callback) {
			if (callback.isCalled) {
				return;
			}

			var isLoaded = false;

			if (/webkit/i.test(navigator.userAgent)) { //webkit
				if (node['sheet']) {
					isLoaded = true;
				}
			}
			// for Firefox
			else if (node['sheet']) {
				try {
					if (node['sheet'].cssRules) {
						isLoaded = true;
					}
				} catch (ex) {
					// NS_ERROR_DOM_SECURITY_ERR
					if (ex.code === 1000) {
						isLoaded = true;
					}
				}
			}

			if (isLoaded) {
				// give time to render.
				setTimeout(function() {
					callback();
				}, 1);
			} else {
				setTimeout(function() {
					loadDoc.CSS.poll(node, callback);
				}, 1);
			}
		},
		loaded: function(url, callback) {
			var _head = document.getElementsByTagName('head')[0],
				tag = [],
				urls = loadDoc.filterDoc('link', url);

			urls = urls > 0 ? urls : url;

			for (var i = 0; i < urls.length; i++) {
				tag[i] = document.createElement("link");
				tag[i].setAttribute("rel", "stylesheet");
				tag[i].setAttribute("type", "text/css");
				tag[i].setAttribute("href", urls[i]);
				if ($("link[href='" + urls[i] + "']").length > 0) {
					$("link[href='" + urls[i] + "']").remove();
				}
				_head.appendChild(tag[i]);
			}

			loadDoc.CSS.styleOnload(tag, function() {
				callback && callback.call(this);
			});
		}
	},

	// args.url {Array}
	loader: function(url, callback) {
		var css = [],
			js = [];

		for (var i = 0; i < url.length; i++) {
			if (url[i].indexOf('.css') > -1) {
				css.push(url[i]);
			} else {
				js.push(url[i]);
			}
		}

		if (css.length > 0 && js.length > 0) {
			loadDoc.CSS.loaded(css, function() {
				loadDoc.JS.loaded(js, callback);
			});
		} else if (css.length > 0 && js.length === 0) {
			loadDoc.CSS.loaded(css, callback);
		} else if (css.length === 0 && js.length > 0) {
			loadDoc.JS.loaded(js, callback);
		}
	}
}
