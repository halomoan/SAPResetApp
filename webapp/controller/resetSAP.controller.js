sap.ui.define([
	"app/sap/resetSAPResetApp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"app/sap/resetSAPResetApp/model/captcha"
], function(BaseController,JSONModel,captcha) {
	"use strict";

	return BaseController.extend("app.sap.resetSAPResetApp.controller.resetSAP", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf app.sap.resetSAPResetApp.view.resetSAP
		 */
		 sCaptcha: "",
		 oModel: null,
		 onInit: function() {
		 		/*var sCaptcha = captcha.customMethod();
		 		var oViewData = {
		 			captcha: sCaptcha
		 		};*/
		 		
		 		var oThis = this,
		 			oViewModel,
					fnSetAppNotBusy,
					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "detailView");
				
				fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
					oThis.oModel = oThis.getOwnerComponent().getModel();
					oThis.onRefreshCaptcha(null);
					
				};
				
		 		this.getView().byId("html").setContent("<canvas id='captcha' width='130' height='50' class='captcha-pad'></canvas>");
				
				this.getOwnerComponent().getModel().metadataLoaded()
						.then(fnSetAppNotBusy);
		 },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf app.sap.resetSAPResetApp.view.resetSAP
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf app.sap.resetSAPResetApp.view.resetSAP
		 */
		onAfterRendering: function() {
				
				var canvas = document.getElementById("captcha");
				this.sCaptcha = captcha.drawCaptcha(canvas);
			
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf app.sap.resetSAPResetApp.view.resetSAP
		 */
		//	onExit: function() {
		//
		//	}
		
		onSAPIDLiveChange: function(oEvent){
			 var input = oEvent.getSource();
			 if (input.getValue().length > 0) {
				input.setValue(input.getValue().toUpperCase());
				input.setValueState(sap.ui.core.ValueState.Success); 
			 } else {
				input.setValueState(sap.ui.core.ValueState.None); 
			 }
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
		onRefreshCaptcha: function(oEvent){
			var oViewModel = this.getModel("detailView");
			var iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			var canvas = document.getElementById("captcha");
			var oThis = this;
			
			oViewModel.setProperty("/busy", true);
			oViewModel.setProperty("/delay", 0);
			
			this.oModel.callFunction("/GenCaptcha", {
				    method: "GET",
				    urlParameters:  {"Param1" : "xx0xx"  }, 
					success: function(oData, oResponse) {
						
						oThis.sCaptcha = captcha.drawCaptcha(canvas,oData.TEXT);
						oThis.getView().byId("inputCaptcha").setValue("");
						oThis.getView().byId("inputCaptcha").focus();
						oThis.getView().byId("inputCaptcha").setValueState(sap.ui.core.ValueState.None);
						
						oViewModel.setProperty("/busy", false);
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
						
					},
					error: function(error) {
						oViewModel.setProperty("/busy", false);
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					},
				async: false
						
				});
		},
		onSubmit: function(oEvent){
			var isvalid = true;
			var userid = this.byId("inputSAPID").getValue();
			var captcha = this.byId("inputCaptcha").getValue();
			var saperp = this.byId("ERP_PRD").getSelected();
			var sapbw = this.byId("BW_PRD").getSelected();
			
			if (!userid) {
				isvalid = false;
				this.getView().byId("inputSAPID").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("SAP User ID Is Mandatory. Please Enter A Valid SAP User ID", {
    				duration: 3000});
			} else if (captcha !== this.sCaptcha){
				isvalid = false;
				this.getView().byId("inputCaptcha").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("Wrong Captcha. Please Enter Captcha Again", {
    				duration: 3000});
			} else if ( ! ( saperp || sapbw ) ) {
				isvalid = false;
				sap.m.MessageToast.show("Please Select A System", {
    				duration: 3000});
			}
			
			if(isvalid){
				
			}
		}

	});

});