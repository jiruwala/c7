sap.ui.jsfragment("bin.forms.in.lists", {

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
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.btSave.firePress();
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
        this.createViewHeader();
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(false);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(7);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = true;
        qr.deletable = true;
        qr.editable = true;
        this.qr = qr;
        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        this.qv = qr;
        // this.mainPage.addContent(sc);

    },
    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
        var that = this;
        var fe = [];
        this.cbListName = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "cb1" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{CODE}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "35%",
                value: "15",
                selectionChange: function (e) {
                    that.loadData_details();
                    var cnt = this;
                    setTimeout(function () {
                        cnt.$().find("input").attr("readonly", true);
                    }, 250);

                }
            }, "string", undefined, this.view, undefined, "select distinct idlist code from relists order by 1"
        );
        this.btSave = new sap.m.Button({
            icon: "sap-icon://save",
            text: Util.getLangText("saveRec"),
            press: function () {

            }
        });
        this.btEdit = new sap.m.ToggleButton({
            icon: "sap-icon://edit",
            text: Util.getLangText("editRec"),
            press: function () {
                if (this.getPressed()) {
                    that.loadData_details();
                    that.qv.getControl().setEditable(true);
                }
                else {
                    that.qv.getControl().setEditable(false);
                    that.loadData_details();
                }
            }
        });
        var btClose = new sap.m.Button({
            icon: "sap-icon://decline",
            text: Util.getLangText("cmdClose"),
            press: function () {
                that.joApp.backFunction();
            }
        });

        var fe = [
            Util.getLabelTxt("Lists", "100%", "", "titleFontWithoutPad2 boldText", "Center"),
            Util.getLabelTxt("List Name ", "25%", ""), that.cbListName,

        ];
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 600, "M": 600, "L": 600, "XL": 600, "XXL": 600 },
            cssText: [
                "padding-left:2px ;" +
                "padding-top:2px;" +
                "border-style: groosve;" +
                "margin-left: 1%;" +
                "margin-right: 1%;" +
                "border-radius:20px;" +
                "margin-top: 2px;"
            ]
        }, "sapUiSizeCompact", "");
        var tb = new sap.m.Toolbar({
            content: [btClose, that.btSave, this.btEdit]
        })
        this.mainPage.setShowSubHeader(true);
        this.mainPage.setSubHeader(tb);
        this.mainPage.addContent(cnt);
        setTimeout(function () {
            that.cbListName.$().find("input").attr("readonly", true);
            that.cbListName.$().find("input").focus(function () {
                that.cbListName.$().find("input").attr("readonly", true);
            });
        });

    }
    ,
    loadData: function () {
        if (this.cbListName.getItems().length > 0)
            this.cbListName.setSelectedItem(this.cbListName.getItems()[0]);

        if (Util.nvl(this.oController.idlist, "").trim() != "")
            this.cbListName.setSelectedKey(Util.nvl(this.oController.idlist, "").trim());
        // if (Util.nvl(this.oController.readonly, false))

    },
    loadData_details: function () {
        var thatForm = this;
        var vl = thatForm.cbListName.getSelectedKey();
        var sq = "select descr,pos from relists where idlist='" + vl + "' order by pos,descr";
        var dt = Util.execSQL(sq);
        var qv = this.qv;
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].mColClass = "sap.m.Input";
            qv.mLctb.cols[qv.mLctb.getColPos("POS")].mColClass = "sap.m.Input";
            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
        }
    }
});



