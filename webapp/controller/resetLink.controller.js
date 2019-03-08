sap.ui.define([
	"app/sap/resetSAPResetApp/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("app.sap.resetSAPResetApp.controller.resetLink", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		onInit: function() {
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0,
					htmlmsg : ""
				});
				this.setModel(oViewModel, "detailView");
				this.getRouter().getRoute("resetLink").attachPatternMatched(this._onRouteMatch, this);
		},
		 _onRouteMatch : function(oEvent){
		 		
		 		
		 		var oViewModel = this.getModel("detailView"),
		 			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay(),
		 			oArgs = oEvent.getParameter("arguments"),
		 			oView = this.getView();
		 			
		 		var oThis = this;
		 		
		 		
		 		var fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
					oThis.oModel = oThis.getOwnerComponent().getModel();

				};
				
				
				
		 		this.getOwnerComponent().getModel().metadataLoaded()
						.then(fnSetAppNotBusy);
			
				console.log(oArgs);
				if (oArgs.resetcode && oArgs.sourceid === 'email') {		
						oView.bindElement({
							path : "/ResetLinkSet('" + oArgs.resetcode + "')",
							events : {
								change: this._onBindingChange.bind(this),
								dataRequested: function (oEvent) {
									oViewModel.setProperty("/busy", true);
									oViewModel.setProperty("/delay", 0);
								},
								dataReceived: function (oEvent) {
									oViewModel.setProperty("/busy", false);
									oViewModel.setProperty("/delay", iOriginalBusyDelay);
								}
							}
					});
						
				} else {
					this.getRouter().getTargets().display("notFound");
				}
		 },
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		//	onExit: function() {
		//
		//	}

	});

});