sap.ui.define([
	"./Captcha"
],function() {
	"use strict";
	return {
		customMethod: function() {
			var alpha = ["A", "B", "C", "D", "E", "F", "G","H", "I", "J", 
                    	"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                    	"U", "V", "W","X", "Y", "Z", "a", "b", "c", "d", 
                    	"e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
                    	"o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
		    			"y", "z"];
			var i;
			for (i = 0; i < 6; i++) {
				var a = alpha[Math.floor(Math.random() * alpha.length)];
        		var b = Math.ceil(Math.random() * 9) + "";
				var c = alpha[Math.floor(Math.random() * alpha.length)];
				var d = alpha[Math.floor(Math.random() * alpha.length)];
				var e = Math.ceil(Math.random() * 9) + "";
				var f = alpha[Math.floor(Math.random() * alpha.length)];
				var g = alpha[Math.floor(Math.random() * alpha.length)];
				var h = alpha[Math.floor(Math.random() * alpha.length)];
			}
			var code = a + " " + b + " " + " " + c + " " + d + " " + e + " " + f + " " + g + " " + h;
			var bCode = code.split(" ").join("");
			return bCode;
		},
		drawCaptcha: function(canvas,value) {
			 //var canvas = oThis.getView().byId("captcha-pad");
			 var ctx = canvas.getContext("2d");
			 ctx.clearRect(0, 0, canvas.width, canvas.height);
			 ctx.font = "25px Georgia";
			 //var bCode = this.customMethod();
			 var bCode = value;
			 ctx.strokeText(bCode, 0, 30);
			 return bCode;
		}
		
	};
});