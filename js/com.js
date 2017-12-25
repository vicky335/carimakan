/**
 * @author Vickyhuang
 */
var Com = {
	init: function() {

		// load svg
		this.loadSvg();

		// share btn
		this.showShare();
		this.bindShare();

		// 頭部
		// this.fnHeader();

		// bindFilter
		this.bindFilter();

		// downloadApp
		this.downloadApp();

		// getAppsDialog
		this.getAppsDialog();

		// showPhotos
		this.showPhotos();

		// bindActionClick
		this.bindActionClick();

		// bindGoTo
		this.bindGoTo();
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 滑動到...
	 */
	fnGoTop: function(top, fn) {
		$("body, html").animate({
			scrollTop: top || 1
		}, "fast", function() {
			(typeof fn === "function") && fn.call(this);
		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description bindActionClick 綁定滑動到...事件
	 */
	bindGoTo: function(args) {
		var self = this;
		$('#wrap').on('click', '.btn_goTo', function() {
			var $this = $(this),
				obj = $this.attr('data-obj');
			if ($(obj)) {
				var top = $(obj).offset().top;
				// if ($('.scrollBar')) {
				// 	var $scrollBars = $('.scrollBar');
				// }
				self.fnGoTop(top);
			}
		});
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
	showShare: function() {
		var self = this;
		$('#wrap').on('click', '.btn_sharebox', function() {
			var $this = $(this);

			OMIS.dialog({
				id: 'win_shareBox',
				html: $.templates("#tpl_shareBox").render({
					url: $this.attr('data-url'),
					title: $this.attr('data-title')
				})
			});
		});
	},
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
	shareToWeb: function(args) {
		var type = args.type,
			url = args.url,
			title = args.title,
			encodedUrl = encodeURIComponent(url),
			encodedTitle = encodeURIComponent(title),
			shareLink = "";

		switch (type) {
			case "facebook":
				shareLink = ("https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl);
				// ("https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl + "&title=" + encodedTitle + "&picture=" + encodedImage + "&description=" + encodedDescription);
				break;
			case "google":
				shareLink = ("https://plus.google.com/share?url=" + encodedUrl);
				break;
			case "pinterest":
				shareLink = ("http://pinterest.com/pin/create/button/?url=" + encodedUrl);
				break;
			case "linkedIn":
				shareLink = ("http://www.linkedin.com/cws/share?url=" + encodedUrl + "&original_referer=" + encodedUrl + "&isFramed=false&ts=" + (new Date).getTime());
				break;
			case "twitter":
				shareLink = ("https://twitter.com/intent/tweet?text=" + encodedTitle + "&url=" + encodedUrl);
				break;
			case "line":
				if ((!OMIS.os.inAppBrowser)) {
					if (OMIS.os.android) {
						shareLink = "intent://msg/text/" + encodedUrl + "#Intent;scheme=line;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=jp.naver.line.android;end;";
					} else {
						shareLink = "line://msg/text/" + encodedUrl;
					}
				} else {
					shareLink = "http://line.me/R/msg/text/?" + encodedTitle + "%0D%0A" + encodedUrl;
				}
				// shareLink = ("http://line.me/R/msg/text/?" + encodedTitle + "%0D%0A" + encodedUrl);
				break;
			case "whatsapp":
				var phoneNumber = '8591759390';
				shareLink = ("https://api.whatsapp.com/send?phone=" + phoneNumber + "&text=" + encodedTitle + encodedUrl);
				break;
			case "messenger":
				if (OMIS.os.desktop) {
					FB.ui({
						method: 'send',
						link: url,
						title: encodedTitle,
						picture: encodedImage,
						description: encodedDescription,
					});
					return;
				} else {
					if (OMIS.os.android) {
						if (OMIS.os.inAppBrowser) {
							shareLink = ("fb-messenger://share?link=" + encodedUrl + '&app_id=' + encodedAppId);
						} else {
							shareLink = "intent://share/#Intent;scheme=fb-messenger;package=com.facebook.orca;S.android.intent.extra.TEXT=" + encodedUrl + ";end";
						}
					} else {
						shareLink = ("fb-messenger-share://?type=FBShareableTypeURL&link=" + encodedUrl);
					}
				}
				break;
			case "wechat":
				shareLink = "http://apps.example8.com/app/wechat?url=" + encodedUrl;
				break;
		}
		this.popupCenter(shareLink, 685, 500);
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

			OMIS.dialog({
				id: 'win_getAppsDialog',
				html: $.templates("#tpl_getAppsDialog").render()
			});

		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description 圖片預覽彈層
	 */
	showPhotos: function(args) {
		var self = this;
		$('#wrap').on('click', '.btn_photosbox', function() {
			var $this = $(this);

			OMIS.dialog({
				id: 'win_photosBox',
				html: $.templates("#tpl_photosbox").render({
					src: $this.attr('data-src'),
					title: $this.attr('data-title'),
					name: $this.attr('data-name'),
					time: $this.attr('data-time')
				})
			});

		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description bindActionClick 綁定用戶點讚/收藏功能
	 */
	bindActionClick: function(args) {
		var self = this;
		$('#wrap').on('click', '.btn_action', function() {
			var $this = $(this),
				type = $this.attr('data-ctype'),
				data = {},
				url = '';

			switch (type) {
				case 'like':
					url = '';
					break;
				case 'save':
					url = '';
					break;
			}

			// OMIS.doAjax({
			// 	success: function(json) {
			// 		if (json.success) {
			var $icon = $this.find('.ui_icon.' + type);
			if ($icon.hasClass('cur')) {
				alert('取消{讚/收藏}成功!');
				$icon.removeClass('cur');
			} else {
				alert('{讚/收藏}成功!');
				$icon.addClass('cur');
			}
			// 		} else {}
			// 	},
			// 	options: {
			// 		type: "GET",
			// 		url: '/images/icons.svg',
			// 		dataType: "html"
			// 	}
			// });

		});
	},

	/**
	 * @author VickyHuang
	 * @param {Object} "args":
	 * @description ui filter filter導航效果
	 */
	bindFilter: function(args) {
		var self = this,
			$obj = $('.ui_filter'),
			objOffsetTop = $obj.offset().top,
			objHeight = $obj.outerHeight(true),
			contentTop = 0;

		Com.fnOnScroll(function() {
			var $this = $(this),
				scrollTop = objOffsetTop - 1,
				headerHeight = 0;
			if ($('.wrap_header .scrollfix')) {
				headerHeight = $('.wrap_header .scrollfix').outerHeight(true);
			}

			scrollTop -= headerHeight;

			if ($this.scrollTop() >= scrollTop) {
				var top = 0;
				if ($('.wrap_header .scrollfix')) {
					top = $('.wrap_header .scrollfix').outerHeight(true);
				}
				$obj.addClass('fixed');
			} else {
				$obj.removeClass('fixed');
				$obj.find('.filter_nav').children('.content').css('top', objHeight + headerHeight);
			}
		});

		$obj.on('click', '.filter_nav', function() {
			var $this = $(this),
				titleHeight = $this.outerHeight(true);

			if (!$obj.hasClass('fixed')) {
				var goTopHeight = objOffsetTop,
					headerHeight = 0;

				if ($('.wrap_header .scrollfix')) {
					headerHeight = $('.wrap_header .scrollfix').outerHeight(true);
				}

				goTopHeight -= headerHeight;

				self.fnGoTop(goTopHeight, function() {
					var top = objHeight + $obj.children('.content').position().top;
					if (!$obj.hasClass('fixed')) {
						top -= $(window).scrollTop();
					}
					$this.children('.content').css('top', top);
				});
			} else {
				$this.children('.content').css('top', objHeight + headerHeight);
			}

			self.fnGoTop(goTopHeight, function() {
				var top = objHeight + $obj.children('.content').position().top;
				if (!$obj.hasClass('fixed')) {
					top -= $(window).scrollTop();
				}
				$this.children('.content').css('top', top);
			});

			$this.siblings().removeClass('cur');
			if (!$this.hasClass('cur')) {
				$this.addClass('cur').siblings().removeClass('cur');
			} else {
				$this.removeClass('cur');
			}
		});
	}

};



$(document).ready(function() {

	// Api.init({
	// 	"appId": $.trim($("meta[property='fb:app_id']").attr("content"))
	// });

	Com.init();
});
