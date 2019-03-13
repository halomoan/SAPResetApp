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
		 		
		 	
				
				var oViewModel = new JSONModel({
					busy : true,
					delay : 0,
					htmlmsg : ""
				});
				this.setModel(oViewModel, "detailView");
				
				this.getRouter().getRoute("resetSAP").attachPatternMatched(this._onRouteMatch, this);

		 },

		 _onRouteMatch : function(){
		 		
		 		
		 		var oViewModel = this.getModel("detailView"),
		 			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
		 		var oThis = this;
		 		
		 		var fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
					oThis.oModel = oThis.getOwnerComponent().getModel();
					oThis.onRefreshCaptcha(null);
					
				};
				
				
				
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
		/*onAfterRendering: function() {
				
				//var canvas = document.getElementById("captcha");
				//this.oCanvas = canvas;
			
			
		},
		*/
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
			 	if (input.getValue().length === 1) {
			 		var oViewModel = this.getModel("detailView");
					oViewModel.setProperty("/htmlmsg","");
			 	}
			 	
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
			var oThis = this;
		
			oViewModel.setProperty("/busy", true);
			oViewModel.setProperty("/delay", 0);
			
			this.oModel.setHeaders({
				'X-Requested-With': 'X'
			});
			this.oModel.callFunction("/GenCaptcha", {
				    method: "GET",
				    urlParameters:  {"Param1" : "xx0xx"  }, 
					success: function(oData, oResponse) {
						
						var canvas = document.getElementById("captcha");
						oThis.sCaptcha = captcha.drawCaptcha(canvas,oData.TEXT);
						oThis.getView().byId("inputCaptcha").setValue("");
						oThis.getView().byId("inputCaptcha").setValueState(sap.ui.core.ValueState.None);
						if (oEvent) {
							oThis.getView().byId("inputCaptcha").focus();
						} else {
							oThis.getView().byId("inputSAPID").focus();
						}
	
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
			var oThis = this;
			var oViewModel = this.getModel("detailView");
			var iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			var userid = this.byId("inputSAPID").getValue();
			var sysid = "";
			var msg = "";
			var sCaptcha = this.byId("inputCaptcha").getValue();
			var saperp = this.byId("ERP_PRD").getSelected();
			var sapbw = this.byId("BW_PRD").getSelected();
			
			if (!userid) {
				isvalid = false;
				this.getView().byId("inputSAPID").setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageToast.show("SAP User ID Is Mandatory. Please Enter A Valid SAP User ID", {
    				duration: 3000});
			} else if (sCaptcha !== this.sCaptcha){
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
				
				
				if (saperp) {
					sysid = "ERP_SYS";
				}
				if (sapbw) {
					sysid = "BW_SYS";
				}
				
			
			/*	this.oModel.refreshSecurityToken();
				var sToken = this.oModel.getSecurityToken();
				console.log(sToken);
				
				this.oModel.setHeaders({
					"x-csrf-token" : "C6gsZsYgg0YzSMpa3-ST8w=="
				});*/
				
		    	oViewModel.setProperty("/busy", true);
				oViewModel.setProperty("/delay", 0);
				
			
				this.oModel.callFunction("/SetRequest", {
				    method: "POST",
				    urlParameters:  {"SYSID" : sysid, "USERID": userid }, 
					success: function(oData, oResponse) {
						
						if (oData.ID) {
							if (oData.ID === "00") {
								msg = "<p style='color:green;'>";
								msg += oData.TEXT + "</p>";
							
								
							} else {
								msg = "<p style='color:red;'>";
								msg += oData.TEXT + "</p>";
							}
							oThis.getView().byId("inputSAPID").setValue("");
							oThis.getView().byId("inputSAPID").setValueState(sap.ui.core.ValueState.None);
							oThis.getView().byId("inputCaptcha").setValue("");
							oThis.getView().byId("inputCaptcha").setValueState(sap.ui.core.ValueState.None);
							oThis.onRefreshCaptcha(null);
							
						}
						
						oViewModel.setProperty("/htmlmsg",msg);
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
			}
		}

	});

});