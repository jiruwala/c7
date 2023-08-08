sap.ui.jsfragment("bin.forms.ut.bw", {
    //batches.
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        // this.vars = {
        //     keyfld: -1,
        //     flag: 1,  // 1=closed,2 opened,
        //     vou_code: 1,
        //     type: 1
        // };

        // this.pgDetail = new sap.m.Page({showHeader: false});

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {

                that.joApp.backFunction();
            }
        });

        this.mainPage = new sap.m.Page({
            showHeader: false,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
            }
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }

        });


        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.qv = new QueryView("batchqry" + this.timeInLong);
        this.qv.getControl().setEditable(false);
        this.qv.getControl().view = this.view;
        this.qv.getControl().addStyleClass("sapUiSizeCondensed sapUiMediumMargin");
        this.qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        this.qv.getControl().setFixedBottomRowCount(0);
        this.qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        this.qv.getControl().setVisibleRowCount(10);
        this.qv.insertable = false;
        this.qv.deletable = false;
        var btAdd = new sap.m.Button({
            text: "Add",
            press: function () {

            }
        });
        var btDelete = new sap.m.Button({
            text: "Delete",
            press: function () {

            }
        });
        var btEdit = new sap.m.Button({
            text: "Edit",
            press: function () {

            }
        });
        var btClose = new sap.m.Button({
            text: "Close",
            press: function () {
                that2.joApp.backFunction();
            }
        });
        var tb = new sap.m.Toolbar({
            content: [
                btAdd, btDelete, btEdit, btClose
            ]
        });
        this.mainPage.addContent(new sap.m.VBox({ height: "20px" }));
        this.mainPage.addContent(new sap.m.Title({
            text: "Batches"
        })).addStyleClass("sapUiMediumMargin");

        this.mainPage.addContent(tb);
        this.mainPage.addContent(this.qv.getControl());

        // this.mainPage.addContent(sc);

    },
    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";


        // this.cs = {};
        // this.cs.code = UtilGen.addControl(fe, "Code", sap.m.Input, "Cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: codSpan}),
        //     }, "string", undefined, this.view);
        // this.cs.title = UtilGen.addControl(fe, "@Title", sap.m.Input, "cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: titSpan}),
        //     }, "string", undefined, this.view);
        //
        //
        // return UtilGen.formCreate("", true, fe);
        // return UtilGen.formCreate("", true, fe, undefined, undefined, [1, 1, 1]);

    }
    ,
    loadData: function () {
        var that = this;
        var dt = Util.execSQL("select keyfld,bat_date,title,descr,owner from c7_batches order by keyfld");
        if (dt.ret == "SUCCESS") {
            this.qv.setJsonStrMetaData("{" + dt.data + "}");
            // var c = qv.mLctb.getColPos("DEBIT");
            // qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
            // qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mHideCol = true;
            this.qv.mLctb.parse("{" + dt.data + "}", true);
            this.qv.loadData();
        }

    }
    ,
    validateSave: function () {

        return true;
    }
    ,
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    },
    wzBatch: function () {
        
    }
});



