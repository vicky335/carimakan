/**
 * @author Vickyhuang
 */
var Com = {
	init: function() {

		// load svg
		this.loadSvg();

		// share btn
		// this.bindShare();

		// 頭部
		// this.fnHeader();

		// downloadApp
		this.downloadApp();

		// getAppsDialog
		this.getAppsDialog();
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 滾到頂部
	 */
	fnGoTop: function(top) {
		$("body, html").animate({
			scrollTop: top || 1
		}, "fast");
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include: target: id, expiry: expiry, html: html
	 *@description 通用提示弹层
	 */
	fnPopupWin: function(args) {
		var opt = $.extend(true, {
			ev: null,
			// 弹窗ID name
			id: "uiPopupWin",
			title: "",
			// 弹窗内容
			content: "",
			// 是否显示关闭图标
			showCloseIcon: true,
			// 是否显示遮罩
			mask: true,
			// 延时关闭时间
			expiry: 0,

			showBtn: false,

			// 確定
			doneBtn: true,
			doneBtnText: '確&nbsp;定',
			doneCallback: null, // 确定的回调函数
			doneReturn: false,

			// 关闭按钮
			cancelBtn: true,
			cancelBtnText: '取&nbsp;消',
			cancelCallback: null, // 取消的回调函数

			onShow: null, //弹层显示后回调
			onBeforeShow: null, //弹层显示前回调
			onHide: null, //弹层关闭后回调
			onBeforeHide: null, //弹层关闭前回调
			// 偏移值
			offset: {
				left: 0,
				top: 0
			}
		}, args);

		var popHtmlTpl = $.templates("#tpl_ui_popup_window");

		OMIS.dialog({
			id: opt.id,
			html: popHtmlTpl.render(opt),
			mask: opt.mask,
			ev: opt.ev,
			offset: opt.offset,
			timeOut: opt.expiry,
			onShow: opt.onShow, //弹层显示后回调
			onBeforeShow: opt.onBeforeShow, //弹层显示前回调
			onHide: opt.onHide, //弹层关闭后回调
			onBeforeHide: opt.onBeforeHide, //弹层关闭前回调
		});

		if (opt.showBtn) {
			var that = this,
				eventType = "click";
			$("#" + opt.id).find(".dialog_done").off().on(eventType, function(e) {
				(typeof opt.doneCallback === "function") && opt.doneCallback.call(that, opt);
				(!opt.doneReturn) && OMIS.dialog.close(opt.id);
			});
			$("#" + opt.id).find(".dialog_cancel").off().on(eventType, function(e) {
				(typeof opt.cancelCallback === "function") && opt.cancelCallback.call(that, opt);
				OMIS.dialog.close(opt.id);
			});
		}

	},


	/**
	 * @author VickyHuang
	 * @param {Object} options include: "args" :
	 * @description 滚动
	 */
	fnOnScroll: function(fn) {
		var oldMethod = window.onscroll;
		window.onscroll = function() {
			(typeof oldMethod === "function") && oldMethod.call(this);
			(typeof fn === "function") && fn.call(this);
		};
	},


	/**
	 * @author VickyHuang
	 * @param {Object} options include: "args" :
	 * @description 離開頁面
	 */
	fnOnUnload: function(fn) {
		var oldMethod = window.onbeforeunload;
		window.onbeforeunload = function() {
			(typeof oldMethod === "function") && oldMethod.call(this);
			(typeof fn === "function") && fn.call(this);
		};
	},


	/**
	 * @author VickyHuang
	 * @param {Object} options include: "args" :
	 * @description 阻止选择和右键
	 */
	fnStopSelectAndContextmenu: function() {
		document.body.oncopy = function(e) {
			if (window.clipboardData) {
				window.clipboardData.clearData();
			}
			return false;
		};
		document.body.onselectstart = function(e) {
			return false;
		};
		document.oncontextmenu = function() {
			return false;
		};
	},


	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description share
	 */
	bindShare: function() {
		var self = this;
		$("#wrap").on("click", ".btn_share", function() {
			var $this = $(this);
			if ($this.attr("data-type") === "gocomments") {
				self.fnGoTop($("#fbComments").offset().top - ($(window).height() / 2));
			} else {
				self.shareToWeb({
					type: $this.attr("data-share"),
					url: $this.attr("data-url") || window.location.href,
					title: $this.attr("data-title") || ""
				});
			}
		});
	},
	shareTrack: function(type, path) {
		$.post("/site/sharetrack", {
			type: type,
			path: path
		});
	},
	shareToWeb: function(args) {
		var type = args.type,
			url = args.url,
			title = args.title,
			encodedUrl = encodeURIComponent(url),
			encodedTitle = encodeURIComponent(title),
			shareLink = "";

		switch (type) {
			case "facebook":
				shareLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl;
				break;
			case "google":
				shareLink = "https://plus.google.com/share?url=" + encodedUrl;
				break;
			case "pinterest":
				shareLink = "http://pinterest.com/pin/create/button/?url=" + encodedUrl;
				break;
			case "linkedIn":
				shareLink = "http://www.linkedin.com/cws/share?url=" + encodedUrl + "&original_referer=" + encodedUrl + "&isFramed=false&ts=" + (new Date).getTime();
				console.log("shareLink", shareLink);
				this.popupCenter(shareLink, 685, 500);
				break;
			case "twitter":
				shareLink = "https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl;
				break;
			case "line":
				shareLink = "http://line.me/R/msg/text/?" + encodedTitle + "%0D%0A" + encodedUrl;
				break;
		}
		this.popupCenter(shareLink, 685, 500);
		this.shareTrack(type, url);
	},
	popupCenter: function(e, t, n, i) {
		var r = screen.width / 2 - t / 2,
			s = screen.height / 2 - n / 2;
		return window.open(e, i, "menubar=no,toolbar=no,status=no,width=" + t + ",height=" + n + ",toolbar=no,left=" + r + ",top=" + s);
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description 加載全局svg
	 */
	loadSvg: function() {
		var siteType = $.trim($("meta[property='site-type']").attr("content"));
		OMIS.doAjax({
			success: function(html) {
				$("body").append('<div style="display:none">' + html + '</div>');
			},
			options: {
				type: "GET",
				url: '/images/icons.svg',
				dataType: "html"
			}
		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description 加載google map api
	 */
	loadGoogleMapsApi: function(args) {
		var script = document.createElement('script'),
			callback = args.callback,
			region = args.region || 'TW',
			language = args.language || 'zh-TW',
			googleApi = 'https://maps.googleapis.com/maps/api/js',
			key = 'AIzaSyALV-sVn_vRMQdB8_gMY9iDj-NvbxWLnAg';

		script.id = 'googleMapsApi';
		script.async = 'async';
		script.defer = 'defer';
		script.type = 'text/javascript';
		script.src = googleApi + '?key=' + key + '&region=' + region + '&language=' + language + '&callback=' + callback;
		document.body.appendChild(script);
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description 下載app
	 */
	downloadApp: function(args) {
		var self = this;
		$('#wrap').on('click', '.btn_downloadapp', function() {
			var url = '';
			if (OMIS.os.ios) {
				url = '下載 ios app';
			} else {
				url = '下載 android app';
			}
			alert(url);
			// self.popupCenter(url, 685, 500);
		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description 下載app彈層
	 */
	getAppsDialog: function(args) {
		var self = this;
		$('#wrap').on('click', '.btn_getAppsDialog', function() {
			var $this = $(this);


			var getAppsDialogHtml = $.templates("#tpl_getAppsDialog");

			OMIS.dialog({
				id: 'win_getAppsDialog',
				html: $.templates("#tpl_getAppsDialog").render(),
				mask: true,
				// ev: opt.ev,
				// offset: opt.offset,
				// timeOut: opt.expiry,
				// onShow: opt.onShow, //弹层显示后回调
				// onBeforeShow: opt.onBeforeShow, //弹层显示前回调
				// onHide: opt.onHide, //弹层关闭后回调
				// onBeforeHide: opt.onBeforeHide, //弹层关闭前回调
			});

		});
	}

};



$(document).ready(function() {

	// Api.init({
	// 	"appId": $.trim($("meta[property='fb:app_id']").attr("content"))
	// });

	Com.init();
});
