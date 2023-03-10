sap.ui.jsfragment("bin.forms.paraForm", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode});
        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            ord_code: 106,
            onm: ""
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
            content: []
        });
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");
        return this.joApp;
    },
    createView: function () {
        var that = this;
        var view = this.view;

        UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];
        this.frm = this.createViewHeader();
        this.frm.getToolbar().addContent(this.bk);

        Util.destroyID("poCmdSave", this.view);
        this.frm.getToolbar().addContent(new sap.m.Button(this.view.createId("poCmdSave"), {
            icon: "sap-icon://execute",
            text: "Execute",
            press: function () {
                var con = new sap.m.Page({showHeader: false, content: []});
                var dlg = new sap.m.Dialog({
                    showHeader: false,
                    content: con,
                    contentHeight: "100%",
                    contentWidth: "100%",
                    modal: true
                }).addStyleClass("sapUiSizeCompact");
                var sp = UtilGen.openForm("bin.forms.testRep4", con, {}, that.view);
                con.addContent(sp);
                dlg.open();

            }
        }));

        // that.createScrollCmds(this.frm.getToolbar());

        var sc = new sap.m.ScrollContainer();

        sc.addContent(this.frm);


        this.mainPage.addContent(sc);

    },
    createViewHeader: function () {
        var that = this;
        var fe = [];
        return UtilGen.formCreate("", true, fe);
        // return UtilGen.formCreate("", true, fe, undefined, undefined, [1, 1, 1]);

    },
    loadData: function () {

    }
    ,
    validateSave: function () {

        return true;
    }
    ,
    save_data: function () {
    },
    get_emails_sel: function () {

    }

});



