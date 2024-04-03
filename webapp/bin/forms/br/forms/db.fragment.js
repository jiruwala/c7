sap.ui.jsfragment("bin.forms.br.forms.db", {

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

        };


        setTimeout(function () {

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
        var recs = UtilGen.dispTblRecsByDevice({ "S": 9, "M": 14, "L": 20, "XL": 25 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(true);
        qr.getControl().view = that2;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;


        this.mainPage.addContent(this.qr.getControl());

        this.loadData();
    },

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        this.cust_code = '';
        Util.destroyID("txtTit" + this.timeInLong, this.view);
        Util.destroyID("txtName" + this.timeInLong);
        Util.destroyID("txtCust" + this.timeInLong);
        var tit = new sap.m.Title(this.view.createId("txtTit" + this.timeInLong), { text: "Sales" });
        var cb = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "cb1" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "35%",
                value: "15",
                selectionChange: function (e) {
                    that.loadData();
                }
            }, "string", undefined, this.view, undefined, "@15/15 Last,30/30 Last,-1/All"
        );
        var txtCust = new sap.m.Input(this.view.createId("txtCust" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false,

        });

        var txtName = new sap.m.Input(this.view.createId("txtName" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "37%", editable: false,

        });
        var bt1 = new sap.m.Button({
            icon: "sap-icon://value-help",
            width: "10%",
            press: function (e) {
                var btns = [];

                UtilGen.Search.do_quick_search(e, txtCust,
                    "select code,name title from c_ycust  order by path ",
                    "select code,name title from c_ycust where code=:CODE", txtName, function () {
                        that.loadData();
                    }, undefined, btns)
            }
        })
        var bt = new sap.m.Button({
            icon: "sap-icon://refresh",
            width: "10%",
            press: function () {
                txtName.setValue('');
                UtilGen.setControlValue(cb, '15', '15', false);
                txtCust.setValue('');
                that.loadData();
            }
        });
        var fe = [
            Util.getLabelTxt("txtDaysOff", "15%"), cb,
            Util.getLabelTxt("txtCust", "15%", ""), txtCust,
            Util.getLabelTxt("", "1%", "@"), txtName,
            Util.getLabelTxt("", "1%", "@"), bt1,
            Util.getLabelTxt("", "1%", "@"), bt,
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 380, "M": 580, "L": 680, "XL": 780, "XXL": 800 },
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
        // cnt.addContent(new sap.m.VBox({ height: "40px" }));
        this.mainPage.addContent(cnt);
    }
    ,
    loadData: function () {

        var that = this;
        var qv = this.qr;
        var cb = this.view.byId("cb1" + this.timeInLong);
        var txtCust = this.view.byId("txtCust" + this.timeInLong);
        var dys = Util.nvl(UtilGen.getControlValue(cb), 15);
        var cst = txtCust.getValue();
        var dt = Util.execSQL("select *from (select INVOICE_NO,INVOICE_DATE,C_CUS_NO,INV_REFNM, " +
            "  INV_AMT,DEPTNO ADD_AMT,DISC_AMT,(INV_AMT+DEPTNO)-DISC_AMT NET_AMT,keyfld FROM PUR1 " +
            " WHERE INVOICE_CODE=21 order by invoice_date desc ) i1  where (rownum<=" +
            dys + " or " + dys + "=-1 ) and (c_cus_no='" + cst + "' or '" + cst + "' is null) ");

        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_NO")].mTitle = Util.getLangText("txtInvNo");
            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_DATE")].mTitle = Util.getLangText("txtInvDate");
            qv.mLctb.cols[qv.mLctb.getColPos("C_CUS_NO")].mTitle = Util.getLangText("refCode");
            qv.mLctb.cols[qv.mLctb.getColPos("INV_REFNM")].mTitle = Util.getLangText("refName");
            qv.mLctb.cols[qv.mLctb.getColPos("INV_AMT")].mTitle = Util.getLangText("txtGrossAmt");
            qv.mLctb.cols[qv.mLctb.getColPos("ADD_AMT")].mTitle = Util.getLangText("txtAddAmt");
            qv.mLctb.cols[qv.mLctb.getColPos("DISC_AMT")].mTitle = Util.getLangText("txtDisc");
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mTitle = Util.getLangText("txtNetAmt");

            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].getMUIHelper().display_width = 0;
            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_NO")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("C_CUS_NO")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("INV_REFNM")].getMUIHelper().display_width = 120;
            qv.mLctb.cols[qv.mLctb.getColPos("INV_AMT")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("DISC_AMT")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ADD_AMT")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_DATE")].getMUIHelper().display_width = 100;

            qv.mLctb.cols[qv.mLctb.getColPos("INV_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("ADD_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("DISC_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";

            qv.mLctb.cols[qv.mLctb.getColPos("INVOICE_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());

                UtilGen.execCmd("bin.forms.br.forms.unpost formTitle=Unposted formType=dialog keyfld=" + kfld + " formSize=620px,350px", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    // sap.m.MessageToast.show("closing...");
                });
            };
            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
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

    }

});



