sap.ui.jsfragment("bin.forms.pur.pocst", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.isDialog = false;
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };

        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.helperFunc.init(this);
        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            vou_code: 11,
            type: 1
        };

        // this.pgDetail = new sap.m.Page({showHeader: false});

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        this.mainPage = new sap.m.Page({
            showHeader: false,
            showFooter: true,
            floatingFooter:true,
            content: []
        });
        this.createView();
        this.loadData();

        this.joApp.addDetailPage(this.mainPage);

        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.toDetail(this.mainPage, "show");
        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        return this.joApp;
    },
    createView: function () {
        //testuing2
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        UtilGen.clearPage(this.mainPage);
        var tb = new sap.m.Toolbar({
            content: [
                new sap.m.Button({
                    text: Util.getLangText("cmdClose"),
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]
        });
        this.mainPage.setFooter(tb);
    }
    ,
    loadData: function () {
    }
    ,
    validateSave: function () {

        return true;
    }
    ,
    save_data: function () {
    }
    ,
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;

        }
    }

});



