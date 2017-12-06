/**
 * @author VickyHuang
 * @param {Object} "args":
 * @description 按需加載圖片
 */
var lazyImg = {
	init: function(args) {
		this.setOptions(args);
		this.load();
		this.fnLoad = this.bind(this, this.load);
		this.addHandler(window, 'scroll', this.fnLoad);
		this.addHandler(window, 'resize', this.fnLoad);
	},
	setOptions: function(args) {
		this.holderSrc = args.holderSrc || 'data-src';
		this.wrapId = args.wrapId;
		this.resetImgSize = args.resetImgSize || false;
		this.imgList = [];
		this.timer = null;
		var targets = null;
		if (document.querySelectorAll) {
			targets = document.querySelectorAll("#" + this.wrapId + " img")
		} else {
			targets = document.getElementById(this.wrapId).getElementsByTagName("img")
		}
		var n = 0,
			len = targets.length;
		// 把元素存到数组里
		for (; n < len; n++) {
			if (targets[n].getAttribute(this.holderSrc)) {
				this.imgList.push(targets[n]);
			}
		}
	},
	load: function() {
		// 全部加装，解除事件
		if (this.imgList.length == 0) {
			this.removeHandler(window, 'scroll', this.fnLoad);
			this.removeHandler(window, 'resize', this.fnLoad);
			return
		}
		var st = document.body.scrollTop || document.documentElement.scrollTop,
			clientH = document.documentElement.clientHeight,
			scrollArea = st + clientH;
		for (var n = 0; n < this.imgList.length; n++) {
			var offsetTop = this.imgList[n].getBoundingClientRect().top + st,
				imgH = this.imgList[n].clientHeight;
			if (scrollArea > (offsetTop - 200) && (imgH + offsetTop) > st) {
				var _src = this.imgList[n].getAttribute(this.holderSrc);
				this.imgList[n].setAttribute('src', _src);

				this.resetImgSize && this.setImgSize(this.imgList[n]);

				this.imgList.splice(n, 1); //删除已经加载完的元素
				n--;
			}
		}

	},
	setImgSize: function(obj) {
		var $this = $(obj),
			$imgObj = $this.parent(),
			data = {
				width: $imgObj.width(),
				height: $imgObj.height() //Math.floor($imgObj.width() / ratio)
			},
			ratio = data.width / data.height,
			_src = $this.attr('src');

		imgReady(_src, function() {
			if (this.width / this.height > ratio) {
				$this.css({
					height: '100%'
				});
			} else {
				$this.css({
					width: '100%'
				});
			}
		});
	},
	bind: function(obj, fn) {
		var _this = this;
		return function() {
			if (_this.timer) clearTimeout(_this.timer);
			_this.timer = setTimeout(function() {
				fn.apply(obj, arguments);
			}, 300);

		}
	},
	addHandler: function(node, type, fn) {
		if (node.addEventListener) {
			node.addEventListener(type, fn, false);
		} else {
			node.attachEvent('on' + type, function() {
				fn.apply(node, arguments);
			});
		}
	},
	removeHandler: function(node, type, fn) {
		if (node.addEventListener) {
			node.removeEventListener(type, fn, false);
		} else {
			node.detachEvent("on" + type, fn);
		}
	}
};
