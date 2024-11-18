sap.ui.jsfragment("bin.forms.pur.powzd", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        this.mainPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            showSubHeader: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.detailPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.infoPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.joApp.addDetailPage(this.mainPage);
        this.joApp.addDetailPage(this.detailPage);
        this.joApp.addDetailPage(this.infoPage);
        this.joApp.toDetail(this.mainPage, "show");
        this.createView();
        this.loadData();


        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };

        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog) {
                that.oController.getForm().getParent().setShowHeader(false);
                // that.oController.getForm().getParent().setContentHeight("100%");
            }
            var oMasterNav = that.joApp.getAggregation("_navMaster");
            oMasterNav.setVisible(false);
        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.mainPage);
        var formCss = {
            width: "700px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;" +
                "background-color:#faebd7"
            ]
        };
        this.tit = new sap.m.Text({ height: "25px", width: "100%", text: Util.getLangText("titPurWzd") }).addStyleClass("titleFontWithoutPad");
        this.txtLocations = new sap.m.ComboBox(
            {
                width: "50%",
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                },
                value: "-1"
            });
        Util.fillCombo(this.txtLocations, "select '-1' code,'ALL' from dual union all select code,name from locations  order by 1 ");
        this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));


        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("", "", "#"), this.tit,
            Util.getLabelTxt("locationTxt", "50%"), this.txtLocations,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        that.qc = new QueryView("qv" + that.timeInLong);
        var qr = that.qc;
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;
        cnt.addContent(this.qr.showToolbar.toolbar);
        cnt.addContent(this.qr.getControl());

        Util.destroyID("cmdNext1", that.view);
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button(that.view.createId("cmdNext1"), {
                    text: "Next",
                    press: function () {
                        that.joApp.toDetail(that.detailPage, "slide");
                        that.load_detailPage();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]

        }));

        that.createDetailPage();
        that.createInfoPage();

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titPurWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
        this.mainPage.addContent(cnt);
        setTimeout(function () {
            var ar = [].concat(formCss["cssText"]);
            for (var ix in ar)
                cnt.$().css("cssText", ar);

        }, 150);
        // this.mainPage.addContent(sc);


    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qv;

    },
    createInfoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var view = this.view;
        var formCss = {
            width: "750px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "margin-left: 5px;" +
                "margin-right: 5px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };

        UtilGen.clearPage(this.infoPage);
        this.infoPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                    text: "Back",
                    press: function () {
                        that.joApp.toDetail(that.mainPage, "slide");
                        // that.loadData();
                    }
                }),
                new sap.m.Button({
                    text: "Finish",
                    press: function () {
                        that.joApp.toDetail(that.infoPage, "slide");
                        that.generatePur();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]

        }));

        setTimeout(function () {

        }, 100);
    },
    createDetailPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.detailPage);


        var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        this.detailPage.addContent(sc);

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titPurWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        sc.addContent(new sap.m.VBox({ height: "20px" }));

        Util.destroyID("cmdNext2", that.view);
        this.detailPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                    text: "Back",
                    press: function () {
                        that.joApp.toDetail(that.mainPage, "slide");
                        // that.loadData();
                    }
                }),
                new sap.m.Button(that.view.createId("cmdNext2"), {
                    text: "Next",
                    press: function () {
                        that.joApp.toDetail(that.infoPage, "slide");
                        that.load_infoPage();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]

        }));


    },
    setFormEditable: function () {

    },
    createViewHeader: function () {
    },
    load_infoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

    },
    loadData: function () {
        var thatForm = this;
    },

    validateSave: function () {

        return true;
    }
    ,
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

});



