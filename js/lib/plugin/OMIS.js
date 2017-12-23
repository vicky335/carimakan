/**
 *@class  JavaScript library
 *@author Vickyhuang
 *@param
 */

var OMIS = {};
OMIS.version = "0.1";

/**
 *@author Vickyhuang
 *@param args:
 */
OMIS.doAjax = function(args) {
	args = $.extend({
		success: function(data, suArgs) {}, //ret success
		suArgs: {}, //success method argrement
		failed: function(data, suArgs) {}, //ret error
		error: function() {},
		options: {} //ajax config
	}, args);
	var options = $.extend({
		global: true,
		type: "POST",
		url: "",
		data: "",
		dataType: "json", //json,html,xml,text
		cache: true,
		error: function() {},
		success: function(data) {}, //required data
		failed: function(data) {}
	}, args.options);
	switch (options.dataType) {
		case "json":
		case "jsonp":
			options.success = function(data) {
				// if(data && (data.ret === 0 || data.code === 0 )){
				if (data) {
					args.success.call(this, data, args.suArgs);
				} else {
					args.failed.call(this, data, args.suArgs);
				} //To determine the validity of data
			};
			break;
		case "html":
			options.success = function(data) {
				args.success.call(this, data);
			};
			break;
	}
	options.error = function(XMLHttpRequest, textStatus, errorThrown) {
		OMIS.debug("Ajax error", {
			"XMLHttpRequest": XMLHttpRequest,
			"textStatus": textStatus,
			"errorThrown": errorThrown,
			"errorHandler": args.error
		});
		args.error.call(this, XMLHttpRequest, textStatus, errorThrown);
	};
	options.url && $.ajax(options);
	return true;
};

OMIS.debug = function() {
	if (window.console && window.console.log) {
		console.log(arguments);
	}
};


/**
 *@author VickyHuang
 *@arguments args: {object}
 *@param id: OMIS.uuid(), // dialog id
 *@param type:"custom",// 弹层类型 （custom、alert、confirm）
 *@param html:null,// html类型弹层的内容
 *@param title: null, // alert 与 confirm 的弹层标题
 *@param message: null,//  alert 与 confirm 的弹层内容
 *@param cancelText: null, // 取消按钮文本
 *@param cancelCallback: null,//取消的回调函数
 *@param cancelClass: null,//取消按钮的样式类
 *@param doneText: null,//确定按钮文本
 *@param doneCallback: null,//确定的回调函数
 *@param doneClass: null,//确定按钮的样式类
 *@param onShow: null, //弹层显示后回调
 *@param onBeforeShow:null,//弹层显示前回调
 *@param onHide:null,//弹层关闭后回调
 *@param onBeforeHide:null,//弹层关闭前回调
 *@param mask: true, //是否有底层遮罩
 *@param timeOut: 0,//延时自动关闭，单位毫秒
 *@param container: "#wrap",
 *@param offset:{left:0,top:0}
 *@description 采用jQ插件与自实现的方式
 */
var dialog = function(opts) {
	this.initialize(opts);
};
dialog.prototype = {
	opts: {},
	isShow: false,
	initialize: function(opts) {
		this.opts = $.extend({
			id: OMIS.uuid(), // dialog id
			type: "custom", // 弹层类型 （custom、alert、confirm）
			html: null, // html类型弹层的内容
			title: null, // alert 与 confirm 的弹层标题
			message: null, //  alert 与 confirm 的弹层内容
			cancelText: null, // 取消按钮文本
			cancelCallback: null, //取消的回调函数
			cancelClass: null, //取消按钮的样式类
			doneText: null, //确定按钮文本
			doneCallback: null, //确定的回调函数
			doneClass: null, //确定按钮的样式类
			onShow: null, //弹层显示后回调
			onBeforeShow: null, //弹层显示前回调
			onHide: null, //弹层关闭后回调
			onBeforeHide: null, //弹层关闭前回调
			mask: true, //是否有底层遮罩
			timeOut: 0, //延时自动关闭，单位毫秒
			container: "#wrap",
			isFixed: false,
			className: "",
			offset: {
				left: 0,
				top: 0
			}
		}, opts);
		OMIS.debug("dialog initialize ", this.opts, opts);
		this[this.opts.type]();
	},
	custom: function() {
		//OMIS.debug("custom dialog",this.opts);
		var that = this,
			opts = this.opts,
			//assecomle html
			markup = (function() {
				if (typeof opts.html == "string") {
					return "<div id=\"" + opts.id + "\" class=\"ui_dialog hidden\">" + opts.html + "</div>";
				} else {
					return $("<div id=\"" + opts.id + "\" class=\"ui_dialog hidden\"></div>").html(opts.html);
				}
			})();
		//show dialog
		that.show(markup);
	},
	alert: function() {
		//OMIS.debug("alert dialog",this.opts);
		var that = this,
			opts = this.opts,
			//assecomle html
			markup = "<div id=\"" + opts.id + "\" class=\"ui_dialog hidden\">" + opts.title + "<br/>" + opts.message + "</div>";
		//show dialog
		that.show(markup);
	},
	confirm: function() {
		//OMIS.debug("confirm dialog",this.opts);
		var that = this,
			opts = this.opts,
			//asseOMISle html
			markup = "<div id=\"" + opts.id + "\" class=\"ui_dialog hidden\">" + opts.title + "<br/>" + opts.message + "<br/>" + opts.doneText + "<br/>" + opts.cancelText + "</div>";
		//show dialog
		that.show(markup);
	},
	show: function(markup) {
		var that = this,
			opts = this.opts,
			container = $(opts.container);
		if (OMIS.dialog.indexOf(OMIS.dialog.queue, opts.id) == -1) { //OMIS.dialog.queue.indexOf(that)
			// new dialog
			container.append(markup);
			that.target = $("#" + opts.id);
			// show mask or not
			opts.mask && that.showMask(container, opts);
			//set center position
			that.setPosition(container, that.target);
			//on before show callback
			opts.onBeforeShow && opts.onBeforeShow.call(that, opts);
			//show dialog
			that.target.removeClass("hidden");
			that.isShow = true;
			OMIS.dialog.queue.push(that);
			//on show callback
			opts.onShow && opts.onShow.call(that, opts);
			//bind event
			that.bindEvent();
		} else {
			//refresh old dialog
			that.target = $("#" + opts.id).html(opts.html);
			opts.onBeforeShow && opts.onBeforeShow.call(that, opts);
			opts.onShow && opts.onShow.call(that, opts);
			that.bindEvent();
		}
		//OMIS.debug("dialog queue",OMIS.dialog.queue);
	},
	hide: function() {
		var that = this,
			opts = this.opts,
			container = $(opts.container);
		opts.onBeforeHide && opts.onBeforeHide.call(that, opts);
		//hide dialog
		// that.target.addClass("hidden").removeAttr("id");
		that.target.addClass("hidden");
		setTimeout(function() {
			that.target.removeAttr("id");
			that.isShow = false;
			OMIS.dialog.remove(OMIS.dialog.queue, opts.id);
			// hide mask or not
			opts.mask && that.hideMask(container, opts);
			setTimeout(function() {
				that.remove(that.target);
			}, 350);
			opts.onHide && opts.onHide.call(that, opts);
			//OMIS.debug("dialog queue",OMIS.dialog.queue);
		}, 350);
	},
	remove: function() {
		var that = this;
		that.target.remove();
		OMIS.dialog.maxZ = OMIS.dialog.queue.length == 0 ? 100 : OMIS.dialog.maxZ;
		//queue show
	},
	bindEvent: function() {
		var that = this,
			opts = this.opts,
			container = $(opts.container),
			eventType = "click";
		if (opts.type == "alert") {
			that.target.find(".dialog_cancel").bind(eventType, function(e) {
				that.hide();
			});
		}
		if (opts.type == "confirm") {
			that.target.find(".dialog_done").bind(eventType, function(e) {
				that.hide();
				opts.doneCallback.call(that, opts);
			});
			that.target.find(".dialog_cancel").bind(eventType, function(e) {
				that.hide();
				opts.cancelCallback.call(that, opts);
			});
		}
		that.target.find(".dialog_close").bind(eventType, function(e) {
			that.hide();
		});
		if (opts.timeOut) {
			window.setTimeout(function() {
				that.hide();
			}, opts.timeOut);
		}
	},
	setPosition: function(container, target) {
		var that = this,
			style = null;
		style = {
			"z-index": OMIS.dialog.maxZ++,
			// "top" : container[0].clientHeight > target[0].clientHeight ? (container[0].clientHeight / 2.1) - (target[0].clientHeight / 2) + that.opts.offset.top : that.opts.offset.top,
			// "top" : ($(window).height() / 2) - (target[0].clientHeight / 2) + that.opts.offset.top + $(document).scrollTop(),
			"top": ($(window).height() - target[0].clientHeight) / 2 + that.opts.offset.top,
			"left": (container[0].clientWidth / 2) - (target[0].clientWidth / 2) + that.opts.offset.left
				// "margin-top": -(target[0].clientHeight / 2),
				// "margin-left": -(target[0].clientWidth / 2)
		};
		if (this.opts.isFixed) {
			style["top"] = that.opts.offset.top;
		}
		target.css(style);
	},
	showMask: function(container, opts) {
		var that = this,
			mask = "<div id=\"" + opts.id + "_mask\" class=\"dialog_mask ui_mask hidden\"></div>";
		container.append(mask);
		$("#" + opts.id + "_mask").css({
			"z-index": OMIS.dialog.maxZ++
		}).removeClass("hidden").on('click', function(e) {
			that.hide();
		});
	},
	hideMask: function(container, opts) {
		$("#" + opts.id + "_mask").remove();
	},
	close: function() {
		this.hide();
	}
};
OMIS.dialog = $.dialog = function(opts) {
	return new dialog(opts);
};
$.extend(OMIS.dialog, {
	queue: [],
	maxZ: 100,
	close: function(id) {
		//OMIS.debug(this,id,this.indexOf(OMIS.dialog.queue,id) ,this.queue);
		var i = this.indexOf(OMIS.dialog.queue, id);
		if (i != -1) {
			this.queue[i].hide();
		} else {
			return false;
		}
	},
	indexOf: function(queue, id) {
		for (var i = 0; i < queue.length; i++) {
			if (queue[i].opts.id == id)
				return i;
		}
		return -1;
	},
	remove: function(queue, id) {
		for (var i = 0; i < queue.length; i++) {
			if (queue[i].opts.id == id)
				queue.splice(i, 1);
		}
	}
});

/**
 *@param searchClass,node,tag
 */
OMIS.getElementsByClass = function(searchClass, node, tag) {
	var classElements = new Array();
	if (node == null) {
		node = document;
	}
	if (tag == null) {
		tag = '*';
	}
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
	for (var i = 0, j = 0; i < elsLen; i++) {
		if (pattern.test(els[i].className)) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
};

OMIS.uuid = function() {
	var uuId = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (uuId() + uuId() + "-" + uuId() + "-" + uuId() + "-" + uuId() + "-" + uuId() + uuId() + uuId());
};

/**
 *@author VickyHuang
 *@param
 */
OMIS.os = {};
(function() {
	/**
	 *@author VickyHuang
	 *@param
	 *@description initialization operation system detect
	 */
	var userAgent = navigator.userAgent;
	OMIS.os.msie = userAgent.match(/MSIE\/([\d.]+)/) ? true : false;
	OMIS.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
	OMIS.os.opera = (userAgent.match(/Opera Mobi/) || userAgent.match(/Opera.([\d.]+)/)) ? true : false;
	OMIS.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) || userAgent.match(/Android/) ? true : false;
	OMIS.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
	OMIS.os.iphone = !OMIS.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
	OMIS.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
	OMIS.os.touchpad = OMIS.os.webos && userAgent.match(/TouchPad/) ? true : false;
	OMIS.os.ios = OMIS.os.ipad || OMIS.os.iphone;
	OMIS.os.blackberry = userAgent.match(/BlackBerry/) || userAgent.match(/PlayBook/) ? true : false;
	OMIS.os.fennec = userAgent.match(/fennec/i) ? true : false;
	OMIS.os.desktop = !(OMIS.os.ios || OMIS.os.android || OMIS.os.blackberry || OMIS.os.opera || OMIS.os.fennec);
	OMIS.os.facebookInAppBrowser = (userAgent.indexOf("FBAN") > -1) || (userAgent.indexOf("FBAV") > -1);
	OMIS.os.lineInAppBrowser = (userAgent.indexOf("Line") > -1);
	OMIS.os.inAppBrowser = OMIS.os.facebookInAppBrowser || OMIS.os.lineInAppBrowser;

})();



// 數組
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			this.splice(i, 1);
		}
	}
};



// 字符串長度
String.prototype.len = function() {
	return this.replace(/[^\x00-\xff]/g, "rr").length;
};
// 字符串截取
String.prototype.sub = function(n) {
	var r = /[^\x00-\xff]/g;
	if (this.replace(r, "mm").length <= n) {
		return this;
	}
	var m = Math.floor(n / 2);
	for (var i = m; i < this.length; i++) {
		if (this.substr(0, i).replace(r, "mm").length >= n) {
			return this.substr(0, i);
		}
	}
	return this;
};



String.prototype.colorHex = function() {
	var that = this;
	if (/^(rgb|RGB)/.test(that)) {
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		var strHex = "#";
		for (var i = 0; i < aColor.length; i++) {
			var hex = Number(aColor[i]).toString(16);
			if (hex === "0") {
				hex += hex;
			}
			strHex += hex;
		}
		if (strHex.length !== 7) {
			strHex = that;
		}
		return strHex;
	} else if (reg.test(that)) {
		var aNum = that.replace(/#/, "").split("");
		if (aNum.length === 6) {
			return that;
		} else if (aNum.length === 3) {
			var numHex = "#";
			for (var i = 0; i < aNum.length; i += 1) {
				numHex += (aNum[i] + aNum[i]);
			}
			return numHex;
		}
	} else {
		return that;
	}
};


// 監聽事件
OMIS.addEvent = function(el, type, callback, useCapture) {
		if (el.dispatchEvent) { // w3c方式优先
			el.addEventListener(type, callback, !!useCapture);
		} else {
			el.attachEvent("on" + type, callback);
		}
		return callback; // 返回callback方便卸载时用
	}
	// 監聽鼠標事件
OMIS.addEventWheel = function(obj, callback) {
	var wheelType = "mousewheel";
	try {
		document.createEvent("MouseScrollEvents");
		wheelType = "DOMMouseScroll";
	} catch (e) {}
	OMIS.addEvent(obj, wheelType, function(event) {
		if ("wheelDelta" in event) { // 统一为±120，其中正数表示为向上滚动，负数表示向下滚动
			var delta = event.wheelDelta;
			// opera 9x系列的滚动方向与IE保持一致，10后修正
			if (window.opera && opera.version() < 10) {
				delta = -delta;
			}
			// 由于事件对象的原有属性是只读，我们只能通过添加一个私有属性delta来解决兼容问题
			event.delta = Math.round(delta) / 120; // 修正safari的浮点 bug
		} else if ("detail" in event) {
			event.wheelDelta = -event.detail * 40; // 为FF添加更大众化的wheelDelta
			event.delta = event.wheelDelta / 120; // 添加私有的delta
		}
		callback.call(obj, event); //修正IE的this指向
	});
}
