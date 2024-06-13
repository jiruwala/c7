sap.ui.controller('bin.Dashboard', {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bin.Dashboard **/
    onInit: function () {
        $('<div class=loadingDiv>Loading libraries</div>').prependTo(document.body);
        this.getView().addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");
        // sap.m.TreeItemBase.prototype.ExpandedIconURI = sap.ui.core.IconPool.getIconURI("less");
        // sap.m.TreeItemBase.prototype.CollapsedIconURI = sap.ui.core.IconPool.getIconURI("add");
        Util.setLanguageModel(this.getView());
        var that = this.getView();

        var keypress = function (event) {
            if (event.keyCode == 27) {
                var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode);
                md = (that.standAlonMode ? sap.m.SplitAppMode.HideMode : md);
                that.app.setMode(md);
            }
            if (event.key == "F1") {
                var focused = document.activeElement;
                var fitm = sap.ui.getCore().byId(focused.id);
                if (fitm == undefined)
                    fitm = sap.ui.getCore().byId(focused.parentElement.id);
                if (fitm == undefined)
                    fitm = sap.ui.getCore().byId(focused.parentElement.parentElement.id);

                if (fitm == undefined)
                    console.log(focused.id);
                else {
                    console.log(JSON.parse(Util.simpleStringify(fitm)));
                    if (fitm.tableCol != undefined) {
                        console.log(JSON.parse(Util.simpleStringify(fitm.tableCol)));
                        sap.m.MessageToast.show(JSON.parse(Util.simpleStringify(fitm.tableCol)).colname);
                    }
                }


            }
        };
        setTimeout(function () {
            document.removeEventListener("keydown", keypress); //Remove the event listener
            document.addEventListener("keydown", keypress);
        });
        //  thatForm.frag.mainPage.attachBrowserEvent("keydown", function (e) {
        //         if (e.key == "ESC")
        //             UtilGen.DBView.autoShowHideMenu(true, thatForm.navApp.getParent());
        //     });

    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf bin.Dashboard
     **/
    onBeforeRendering: function () {
        $('<div class=loadingDiv>Loading libraries</div>').prependTo(document.body);
    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf bin.Dashboard **/
    onAfterRendering: function () {
        $('<div class=loadingDiv>Loading libraries</div>').prependTo(document.body);
        // console.log("rendering...");
    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bin.Dashboard
     **/
    onExit: function () {

    },
    frag_liveChange: function (event) {
    },
    frag_confirm: function (event) {

    }
});
