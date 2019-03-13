sap.ui.define([
	"app/sap/resetSAPResetApp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"app/sap/resetSAPResetApp/model/captcha"
], function(BaseController,JSONModel,captcha) {
	"use strict";

	return BaseController.extend("app.sap.resetSAPResetApp.controller.resetLink", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		sCaptcha: "",
		oArgs: null,
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
		 			oView = this.getView();
		 			
		 		var oThis = this;
		 		this.oArgs = oEvent.getParameter("arguments");
		 		
		 		var fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
					oThis.oModel = oThis.getOwnerComponent().getModel();

				};
				
				
				
		 		this.getOwnerComponent().getModel().metadataLoaded()
						.then(fnSetAppNotBusy);
			
		
				if (this.oArgs.resetcode && this.oArgs.syscode && this.oArgs.sourceid === 'email') {	
					
						oView.bindElement({
							path : "/ResetLinkSet('" + this.oArgs.resetcode + "')",
							events : {
								change: this._onBindingChange.bind(this),
								dataRequested: function (oEvent) {
									oViewModel.setProperty("/busy", true);
									oViewModel.setProperty("/delay", 0);
								},
								dataReceived: function (oEvent) {
									oThis.onRefreshCaptcha(null);
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
		},
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
		/*onAfterRendering: function() {
				var canvas = document.getElementById("captcha");
				this.oCanvas = canvas;
		},*/

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf app.sap.resetSAPResetApp.view.resetLink
		 */
		//	onExit: function() {
		//
		//	}
		onRefreshCaptcha: function(oEvent){
		
			var oContext = this.getView().getBindingContext();
			var canvas = document.getElementById("captcha");
			this.sCaptcha = captcha.drawCaptcha(canvas,oContext.getProperty("SEED"));
			
		},
		onCaptchaLiveChange: function(oEvent){
		
			
			var input = oEvent.getSource();
			if (input.getValue() === this.sCaptcha) {
                  input.setValueState(sap.ui.core.ValueState.Success); 
            }
            else {
            	if (input.getValue().length === 8) {
                  input.setValueState(sap.ui.core.ValueState.Error); 
            	}else{
            		 input.setValueState(sap.ui.core.ValueState.None); 
            	}
            	
            }
		},
		onSubmit: function(oEvent){
			var msg;
			var oViewModel = this.getModel("detailView");
			var iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			
			if (this.sCaptcha === this.byId("inputCode").getValue()) {
				
					oViewModel.setProperty("/busy", true);
					oViewModel.setProperty("/delay", 0);
				
					this.oModel.setHeaders({
						'X-Requested-With': 'X'
					});
					
					this.oModel.callFunction("/SetReset", {
				    method: "POST",
				    urlParameters:  {"SYSID" : this.oArgs.syscode,  "UUID": this.oArgs.resetcode }, 
					success: function(oData, oResponse) {
						if (oData.ID) {
							if (oData.ID === "00") {
								msg = "<p style='color:green;'>";
								msg += oData.TEXT + "</p>";
								oViewModel.setProperty("/htmlmsg",msg);
								
							} else {
								msg = "<p style='color:red;'>";
								msg += oData.TEXT + "</p>";
								oViewModel.setProperty("/htmlmsg",msg);
							}
						}
						
					
						oViewModel.setProperty("/busy", false);
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
						
					},
					error: function(error) {
						msg = "<p style='color:red;'>";
						msg += error.responseText + "</p>";
						oViewModel.setProperty("/htmlmsg",msg);
						
						oViewModel.setProperty("/busy", false);
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					},
				async: false
						
				});
			} else {
				msg = "<p style='color:red;'>";
				msg += "Error: Invalid Reset Code" + "</p>";
				
				oViewModel.setProperty("/htmlmsg",msg);
			}
		},
		onReset: function(){
			var oViewModel = this.getModel("detailView");
			
			this.byId("inputCode").setValue("");
			oViewModel.setProperty("/htmlmsg","");
		}
		
			
		
	});

});