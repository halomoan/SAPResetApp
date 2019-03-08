sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent"
	], function (Controller, UIComponent) { 
		
	"use strict";

	return Controller.extend("app.sap.resetSAPResetApp.controller.BaseController", {	
		setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
		},
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		}
	});
});