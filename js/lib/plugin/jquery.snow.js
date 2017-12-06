/* jquery.snow.js */
(function(a) {
	a.fn.snow = function(d) {
		var g = a("<div id='flake' />").css({
				position: "absolute",
				top: "-50px"
			}).html("❄"),
			f = a(document).height(),
			b = a(document).width(),
			e = {
				minSize: 10,
				maxSize: 20,
				newOn: 500,
				flakeColor: "#FFFFFF"
			},
			d = a.extend({}, e, d);
		var c = setInterval(function() {
			var l = Math.random() * b - 100,
				j = 0.5 + Math.random(),
				h = d.minSize + Math.random() * d.maxSize,
				i = f - 40,
				k = l - 100 + Math.random() * 200,
				m = f * 10 + Math.random() * 5000;
			g.clone().appendTo("body").css({
				left: l,
				opacity: j,
				"font-size": h,
				color: d.flakeColor
			}).animate({
				top: i,
				left: k,
				opacity: 0.2
			}, m, "linear", function() {
				a(this).remove()
			})
		}, d.newOn)
	}
})(jQuery);
