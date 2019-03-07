sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	], function (Controller, History) { 
		
	"use strict";

	return Controller.extend("app.sap.resetSAPResetApp.controller.BaseController", {	
		setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
		},
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
	});
});