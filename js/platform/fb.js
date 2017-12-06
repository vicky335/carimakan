/**
 * @author VickyHuang
 * @description 平台接口
 */
var Api = {

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 初始化Api
	 */
	init: function(args) {
		var onFacebookReady = null;
		window.fbAsyncInit = function() {
			// init the FB JS SDK
			FB.init({
				appId: args.appId, // App ID from the app dashboard
				status: true, // Check Facebook Login status
				xfbml: true, // Look for social plugins on the page
				cookie: true,
				oauth: true,
				version: "v2.2"
			});
			// Additional initialization code such as adding Event Listeners goes here
			FB.Event.subscribe("edge.create", function(response) {
				console.log("edge.create", response, pageId);
				// $("#action").html("edge.create");
				// $.cookie("liked", "1", {expires: 3650, path: "/", domain: ".1point1.com"});

				// if (response == pageUrl){
				// jQuery.cookie('facebook_liked', '1', {expires: 365,path:'/',domain:'.fbmojo.com'});
				// }

				// if (!localStorage.getItem(pageId)) {
				// 	localStorage.showLike = true;
				// }
				if (!$.cookie('show_fb_like')) {
					$.cookie('show_fb_like', 1, {
						expires: 365,
						path: '/'
					});
				}
				($("#win_like").length != 0) && OMIS.dialog.close("win_like");
			});
			FB.Event.subscribe('edge.remove', function(response) {
				console.log("edge.remove", response, pageId);
				if ($.cookie('show_fb_like')) {
					$.cookie('show_fb_like', '', {
						expires: 365,
						path: '/'
					});
				}
			});
			// FB.Event.subscribe("comment.create", function(response) {
			// console.log("comment.create", response);
			// // $("#action").html("edge.create");
			// // $.cookie("liked", "1", {expires: 3650, path: "/", domain: ".1point1.com"});
			// });
			if (null != onFacebookReady) {
				onFacebookReady();
			}
		};
		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/zh_TW/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, "script", "facebook-jssdk"));
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 初始化Api
	 */
	checkResponse: function() {
		FB.getLoginStatus(function(response) {
			/* 如果有授權資料
		 		也可以用 response.status 來判斷
		        response.status = "connected"  已連接
		        response.status = "not_authorized"  未授權
		                請參考 FB SDK  FB.getLoginStatus
		        https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
		    */
			// console.log("checkResponse", response);
			if (response.status === "connected") {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token
				// and signed request each expire
				var uid = response.authResponse.userID,
					accessToken = response.authResponse.accessToken;
				Api.retrieveProfiles(response);
			} else {
				// FB.login(Api.handleSessionResponse, {scope: "email, publish_actions, public_profile, user_friends, user_about_me, user_likes", return_scopes: true});
				FB.login(Api.handleSessionResponse, {
					scope: "email, public_profile, user_likes",
					return_scopes: true
				});
			}
		});
	},

	handleSessionResponse: function(response) {
		if (response.authResponse) {
			// OMIS.debug("handleSessionResponse authResponse", response);
			var accessToken = response.authResponse.accessToken;
			Api.retrieveProfiles(response);
		} else {
			// OMIS.debug("handleSessionResponse !authResponse", response);
		}
	},

	retrieveProfiles: function(response) {
		Platform.opt.response = response;
		FB.api("/me", function(response) {
			//OMIS.debug("获取用户信息", response);
			Platform.opt.me = response;
			if (Platform.opt.type == "ckLike") {
				Api.ckLikes();
			} else {
				Platform.doLoginCallback();
			}
		});
	},

	postFeed: function(args, callback) {
		FB.api("/me/feed", "post", args, function(response) {
			if (!response || response.error) {
				// console.log("Error occured", response.error);
			} else {
				// console.log("Post ID: " + response.id);
				typeof callback === "function" && callback.call(this, args);
			}
		});
	},

	ckLikes: function() {
		FB.api("/me/likes/" + Platform.opt.fansPageId, function(response) {
			if (response && !response.error) {
				// console.log("likes " ,  response);
				typeof Platform.opt.callback === "function" && Platform.opt.call(this, response);
			}
		});
	}
};

/**
 *@author VickyHuang
 *@param {Object} options include:
 *@description 接口調用
 */
var Platform = {
	opt: {
		"type": "",
		"email": "",
		"fansPageId": "",
		"response": "",
		"me": "",

		"callback": ""
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 登录
	 */
	doLogin: function(args) {
		Platform.opt = $.extend(true, Platform.opt, args);
		Api.checkResponse();
	},

	doLoginCallback: function(response, args) {
		// typeof args.callback === "function" && args.callback.call(this, args);
		if (Platform.opt.type === "po") {
			Api.postFeed({
				// "message": Platform.opt.message,
				// "link": Platform.opt.link,
				// "picture": Platform.opt.picture,
				// "name": Platform.opt.name,
				// "caption": Platform.opt.caption,
				// "description": Platform.opt.description
			}, Platform.opt.callback);
		}

		OMIS.doAjax({
			success: function(json) {
				typeof Platform.opt.callback === "function" && Platform.opt.callback.call(this, args);
			},
			options: {
				url: "/site/connect",
				data: {
					"access_token": Platform.opt.response.authResponse.accessToken
				}
			}
		});
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 检查是否已like
	 */
	ckLikes: function(args) {
		Platform.opt = $.extend(true, Platform.opt, args);
		Api.checkResponse();
	},

	/**
	 *@author VickyHuang
	 *@param {Object} options include:
	 *@description 检查是否已like callback
	 */
	ckLikesCallback: function(args) {
		Api.ckLikes(args);
		// typeof args.callback === "function" && args.callback.call(this, args);
	}
};
