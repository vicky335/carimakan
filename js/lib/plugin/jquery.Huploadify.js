/* jquery.Huploadify.js */
(function(a) {
	a.fn.Huploadify = function(f) {
		var e = '<div id="${fileID}" class="uploadify-queue-item"><div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div><span class="up_filename">${fileName}</span><a href="javascript:void(0);" class="uploadbtn">上传</a><a href="javascript:void(0);" class="delfilebtn">删除</a></div>';
		var g = {
			fileTypeExts: "*.*",
			mimeTypes: "*",
			uploader: "",
			auto: false,
			method: "post",
			multi: true,
			formData: null,
			fileObjName: "file",
			fileSizeLimit: 2048,
			showUploadedPercent: true,
			showUploadedSize: false,
			buttonText: "选择文件",
			removeTimeout: 1000,
			itemTemplate: e,
			useTemplate: true,
			onUploadStart: null,
			onUploadSuccess: null,
			onUploadComplete: null,
			onUploadError: null,
			onInit: null,
			onCancel: null,
			onClearQueue: null,
			onDestroy: null,
			onSelect: null,
			onQueueComplete: null
		};
		var c = a.extend(g, f);
		var d = {
			formatFileSize: function(h, i) {
				if (h > 1024 * 1024 && !i) {
					h = (Math.round(h * 100 / (1024 * 1024)) / 100).toString() + "MB"
				} else {
					h = (Math.round(h * 100 / 1024) / 100).toString() + "KB"
				}
				return h
			},
			getFileTypes: function(m) {
				var j = [];
				var k = m.split(";");
				for (var l = 0, h = k.length; l < h; l++) {
					j.push(k[l].split(".").pop())
				}
				return j
			},
			getFile: function(h, k) {
				for (var j = 0; j < k.length; j++) {
					if (k[j].index == h) {
						return k[j]
					}
				}
				return null
			}
		};
		var b = null;
		this.each(function(j, k) {
			var l = a(k);
			var i = a(".uploadify").length + 1;
			var h = {
				container: l,
				filteredFiles: [],
				init: function() {
					var m = '<input id="select_btn_' + i + '" class="selectbtn" style="display:none;" type="file"';
					m += c.multi ? " multiple" : "";
					m += ' accept="';
					m += c.mimeTypes ? c.mimeTypes : d.getFileTypes(c.fileTypeExts).join(",");
					m += '"/>';
					m += '<label id="file_upload_' + i + '-button" href="javascript:void(0)" class="uploadify-button">';
					m += c.buttonText;
					m += "</label>";
					var o = '<div id="file_upload_' + i + '-queue" class="uploadify-queue"></div>';
					l.append(m + o);
					b = {
						instanceNumber: i,
						upload: function(s) {
							if (s === "*") {
								for (var r = 0, p = h.filteredFiles.length; r < p; r++) {
									h._uploadFile(h.filteredFiles[r])
								}
							} else {
								var q = d.getFile(s, h.filteredFiles);
								q && h._uploadFile(q)
							}
						},
						cancel: function(s) {
							if (s === "*") {
								var p = h.filteredFiles.length;
								for (var r = p - 1; r >= 0; r--) {
									h._deleteFile(h.filteredFiles[r])
								}
								c.onClearQueue && c.onClearQueue(p)
							} else {
								var q = d.getFile(s, h.filteredFiles);
								q && h._deleteFile(q)
							}
						},
						disable: function(q) {
							var p = q ? a("file_upload_" + q + "-button") : a("body");
							p.find(".uploadify-button").css("background-color", "#888").off("click")
						},
						ennable: function(q) {
							var p = q ? a("file_upload_" + q + "-button") : a("body");
							p.find(".uploadify-button").css("background-color", "#707070").on("click", function() {
								p.find(".selectbtn").trigger("click")
							})
						},
						destroy: function() {
							h.container.html("");
							h = null;
							c.onDestroy && c.onDestroy()
						},
						settings: function(p, q) {
							if (arguments.length == 1) {
								return c[p]
							} else {
								if (p == "formData") {
									c.formData = a.extend(c.formData, q)
								} else {
									c[p] = q
								}
							}
						},
						Huploadify: function() {
							var p = arguments[0];
							if (p in this) {
								Array.prototype.splice.call(arguments, 0, 1);
								this[p].apply(this[p], arguments)
							}
						}
					};
					var n = this._getInputBtn();
					if (n.length > 0) {
						n.change(function(p) {
							h._getFiles(p)
						})
					}
					l.find(".uploadify-button").on("click", function() {
						l.find(".selectbtn").trigger("click")
					});
					c.onInit && c.onInit(b)
				},
				_filter: function(p) {
					var n = [];
					var r = d.getFileTypes(c.fileTypeExts);
					if (r.length > 0) {
						for (var o = 0, m = p.length; o < m; o++) {
							var q = p[o];
							if (parseInt(d.formatFileSize(q.size, true)) <= c.fileSizeLimit) {
								if (a.inArray("*", r) >= 0 || a.inArray(q.name.split(".").pop(), r) >= 0) {
									n.push(q)
								} else {
									alert('文件 "' + q.name + '" 类型不允许！')
								}
							} else {
								alert('文件 "' + q.name + '" 大小超出限制！');
								continue
							}
						}
					}
					return n
				},
				_getInputBtn: function() {
					return l.find(".selectbtn")
				},
				_getFileList: function() {
					return l.find(".uploadify-queue")
				},
				_renderFile: function(o) {
					var m = a(c.itemTemplate.replace(/\${fileID}/g, "fileupload_" + i + "_" + o.index).replace(/\${fileName}/g, o.name).replace(/\${fileSize}/g, d.formatFileSize(o.size)).replace(/\${instanceID}/g, l.attr("id")));
					if (!c.auto) {
						m.find(".uploadbtn").css("display", "inline-block")
					}
					h._getFileList().append(m);
					if (c.showUploadedSize) {
						var n = '<span class="progressnum"><span class="uploadedsize">0KB</span>/<span class="totalsize">${fileSize}</span></span>'.replace(/\${fileSize}/g, d.formatFileSize(o.size));
						m.find(".uploadify-progress").after(n)
					}
					if (c.showUploadedPercent) {
						var p = '<span class="up_percent">0%</span>';
						m.find(".uploadify-progress").after(p)
					}
					c.onSelect && c.onSelect(o);
					if (c.auto) {
						h._uploadFile(o)
					} else {
						m.find(".uploadbtn").on("click", function() {
							if (!a(this).hasClass(".disabledbtn")) {
								a(this).addClass(".disabledbtn");
								h._uploadFile(o)
							}
						})
					}
					m.find(".delfilebtn").on("click", function() {
						if (!a(this).hasClass(".disabledbtn")) {
							a(this).addClass(".disabledbtn");
							h._deleteFile(o)
						}
					})
				},
				_getFiles: function(q) {
					var p = q.target.files;
					p = h._filter(p);
					var r = l.find(".uploadify-queue .uploadify-queue-item").length;
					for (var o = 0, m = p.length; o < m; o++) {
						p[o].index = ++r;
						p[o].status = 0;
						h.filteredFiles.push(p[o]);
						var n = h.filteredFiles.length;
						if (c.useTemplate) {
							h._renderFile(h.filteredFiles[n - 1])
						} else {
							c.onSelect && c.onSelect(h.filteredFiles[n - 1])
						}
					}
				},
				_deleteFile: function(o) {
					for (var n = 0, m = h.filteredFiles.length; n < m; n++) {
						var p = h.filteredFiles[n];
						if (p.index == o.index) {
							h.filteredFiles.splice(n, 1);
							l.find("#fileupload_" + i + "_" + o.index).fadeOut();
							c.onCancel && c.onCancel(o);
							break
						}
					}
				},
				_regulateView: function(m) {
					var n = l.find("#fileupload_" + i + "_" + m.index);
					n.find(".uploadify-progress-bar").css("width", "100%");
					c.showUploadedSize && n.find(".uploadedsize").text(n.find(".totalsize").text());
					c.showUploadedPercent && n.find(".up_percent").text("100%")
				},
				onProgress: function(n, m, p) {
					var q = l.find("#fileupload_" + i + "_" + n.index + " .uploadify-progress");
					var o = (m / p * 100).toFixed(2) + "%";
					if (c.showUploadedSize) {
						q.nextAll(".progressnum .uploadedsize").text(d.formatFileSize(m));
						q.nextAll(".progressnum .totalsize").text(d.formatFileSize(p))
					}
					if (c.showUploadedPercent) {
						q.nextAll(".up_percent").text(o)
					}
					q.children(".uploadify-progress-bar").css("width", o)
				},
				_allFilesUploaded: function() {
					var n = {
						uploadsSuccessful: 0,
						uploadsErrored: 0
					};
					for (var o = 0, m = h.filteredFiles.length; o < m; o++) {
						var p = h.filteredFiles[o].status;
						if (p === 0 || p === 1) {
							n = false;
							break
						} else {
							if (p === 2) {
								n.uploadsSuccessful++
							} else {
								if (p === 3) {
									n.uploadsErrored++
								}
							}
						}
					}
					return n
				},
				_uploadFile: function(n) {
					var p = null;
					try {
						p = new XMLHttpRequest()
					} catch (o) {
						p = ActiveXobject("Msxml12.XMLHTTP")
					}
					if (p.upload) {
						p.upload.onprogress = function(q) {
							h.onProgress(n, q.loaded, q.total)
						};
						p.onreadystatechange = function(r) {
							if (p.readyState == 4) {
								if (p.status == 200) {
									h._regulateView(n);
									n.status = 2;
									c.onUploadSuccess && c.onUploadSuccess(n, p.responseText);
									setTimeout(function() {
										l.find("#fileupload_" + i + "_" + n.index).fadeOut()
									}, c.removeTimeout)
								} else {
									n.status = 3;
									c.onUploadError && c.onUploadError(n, p.responseText)
								}
								c.onUploadComplete && c.onUploadComplete(n, p.responseText);
								if (c.onQueueComplete) {
									var q = h._allFilesUploaded();
									q && c.onQueueComplete(q)
								}
								h._getInputBtn().val("")
							}
						};
						if (n.status === 0) {
							n.status = 1;
							c.onUploadStart && c.onUploadStart(n);
							p.open(c.method, c.uploader, true);
							p.setRequestHeader("X-Requested-With", "XMLHttpRequest");
							var m = new FormData();
							m.append(c.fileObjName, n);
							if (c.formData) {
								for (key in c.formData) {
									m.append(key, c.formData[key])
								}
							}
							p.send(m)
						}
					}
				}
			};
			h.init()
		});
		return b
	}
})(jQuery);
