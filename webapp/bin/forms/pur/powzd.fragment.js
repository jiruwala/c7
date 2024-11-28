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
    createView: function (pCreateOtherPage) {
        var that = this;
        that.selKf = -1;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var createOtherPage = Util.nvl(pCreateOtherPage, true);
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
        qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
        qr.getControl().setFixedBottomRowCount(1);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(7);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;

        this.mainPage.addContent(cnt);

        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        Util.destroyID("cmdNext1", that.view);
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button(that.view.createId("cmdNext1"), {
                    text: "Next",
                    press: function () {
                        var slices = that.qc.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
                        var slicesof = that.qc.getControl().getBinding("rows").aIndices;

                        slices.length > 1 || slices.length < 1 ? FormView.err("Must Select single  PO !") : "";
                        var rn = slicesof[slices[0]];
                        that.selKf = that.qc.mLctb.getFieldValue(rn, "KEYFLD");
                        that.selOn = that.qc.mLctb.getFieldValue(rn, "ORD_NO");
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
        if (createOtherPage) {
            that.createDetailPage();
            that.createInfoPage();
            that.detailPage.removeAllHeaderContent();
        }
        setTimeout(function () {
            var ar = [].concat(formCss["cssText"]);
            for (var ix in ar)
                cnt.$().css("cssText", ar);

        }, 150);
    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qcDet;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var df2 = new DecimalFormat("#,##0.00000");
        if (Util.nvl(that.selKf, -1) == -1) FormView.err("PO is not selected !");
        var dt = Util.execSQLWithData("select *from pord1 where keyfld=" + that.selKf, "No data found ..");
        var setVal = (varr, str) => {
            that.mp[varr].setValue(str);
        };
        var kys = Object.keys(that.mp);
        for (var k in kys)
            that.mp[kys[k]].setValue("");

        for (var k in kys)
            if (Util.nvl(dt[0][kys[k].toUpperCase()], "") != "")
                if (kys[k] != "ord_date")
                    setVal(kys[k], dt[0][kys[k].toUpperCase()]);
                else
                    setVal(kys[k], sdf.format(new Date(dt[0][kys[k].toUpperCase()].replaceAll(".", ":"))));
        var sqAmt = "select nvl(sum(amount),0) from c7_polandcost where pship_keyfld in (select keyfld from c7_purship where po_keyfld=" + that.selKf + ")";
        var ex = Util.getSQLValue(sqAmt);
        var totamt = dt[0].ORD_AMT + ex;
        var kdcost = dt[0].ORD_AMT > 0 ? (totamt / dt[0].ORD_AMT) : 1

        setVal("amount", df.format(dt[0].ORD_AMT));
        setVal("other_expenses", df.format(ex));
        setVal("totalamt", df.format(totamt));
        setVal("kdcost", df2.format(kdcost));
        that.load_detailPageData();
    },
    load_detailPageData: function () {
        var that = this;
        var qv = this.qcDet;
        var cstFormat = "#,##0.00000";
        var sq = "SELECT ORD_POS,ORD_REFER,ITEM_DESCR," +
            " CASE WHEN ORD_PACK>1 THEN ORD_PACKD||'x'||ORD_UNITD ELSE ORD_PACKD END ORD_PACKD, " +
            " ORD_PACK,ORD_ALLQTY/ORD_PACK ORD_PKQTY,ORD_PRICE," +
            " ORD_PRICE*(ORD_ALLQTY/ORD_PACK) ORD_AMOUNT," +
            " NVL(RCVD_ALLQTY,0)/ORD_PACK RCVD_PKQTY ," +
            " 0 RCVD_COST,0 RCVD_AMT,0 RCVD_P,0 VARIA_QTY,0 VARIA_AMT  " +
            " FROM PORD_JOINED p ," +
            " (SELECT ORD_SHIP,SUM(TQTY) RCVD_ALLQTY FROM C_ORDER1 WHERE PORD1_KEYFLD="
            + that.selKf + " GROUP BY ORD_SHIP ) C " +
            " where keyfld=" + that.selKf +
            " AND C.ORD_SHIP(+)=P.ORD_REFER " +
            " order by ord_pos";
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            Util.setColProp(qv, "ORD_POS", "display_width", 50);
            Util.setColProp(qv, "ORD_POS", "mTitle", "Sn");
            Util.setColProp(qv, "ORD_REFER", "mTitle", "itemCode");
            Util.setColProp(qv, "ORD_REFER", "display_width", 70);
            Util.setColProp(qv, "ITEM_DESCR", "mTitle", "descrTxt");
            Util.setColProp(qv, "ITEM_DESCR", "display_width", 120);
            Util.setColProp(qv, "ORD_PACKD", "mTitle", "itemPackD");
            Util.setColProp(qv, "ORD_PACKD", "display_width", 70);
            Util.setColProp(qv, "ORD_PACK", "mTitle", "itemPack");
            Util.setColProp(qv, "ORD_PACK", "display_width", 50);

            // Util.setColProp(qv, "ORD_UNITD", "mHideCol", true);
            // Util.setColProp(qv, "ORD_UNITD", "mTitle", "itemUnitD");
            // Util.setColProp(qv, "ORD_UNITD", "display_width", 60);

            Util.setColProp(qv, "ORD_PKQTY", "mTitleParent", "titPurOrd");
            Util.setColProp(qv, "ORD_PKQTY", "mTitleParentSpan", 3);
            Util.setColProp(qv, "ORD_PKQTY", "mTitle", "itemPackQty");
            Util.setColProp(qv, "ORD_PKQTY", "display_width", 90);
            Util.setColProp(qv, "ORD_PKQTY", "display_style", "background-color:#d8bfd8;");

            Util.setColProp(qv, "ORD_PRICE", "mTitle", "txtPrice");
            Util.setColProp(qv, "ORD_PRICE", "display_width", 80);
            Util.setColProp(qv, "ORD_PRICE", "display_format", cstFormat);
            Util.setColProp(qv, "ORD_PRICE", "display_align", "ALIGN_END");
            Util.setColProp(qv, "ORD_PRICE", "mTitleParent", "titPurOrd");
            Util.setColProp(qv, "ORD_PRICE", "display_style", "background-color:#d8bfd8;");
            // Util.setColProp(qv, "ORD_PRICE", "mTitleParentSpan", 3);            

            Util.setColProp(qv, "ORD_AMOUNT", "mTitle", "amountTxt");
            Util.setColProp(qv, "ORD_AMOUNT", "display_width", 80);
            Util.setColProp(qv, "ORD_AMOUNT", "display_format", "MONEY_FORMAT");
            Util.setColProp(qv, "ORD_AMOUNT", "mTitleParent", "titPurOrd");
            Util.setColProp(qv, "ORD_AMOUNT", "mSummary", "SUM");
            Util.setColProp(qv, "ORD_AMOUNT", "display_style", "background-color:#d8bfd8;");

            Util.setColProp(qv, "RCVD_PKQTY", "mTitleParent", "goodsRecieved");
            Util.setColProp(qv, "RCVD_PKQTY", "mTitleParentSpan", 4);
            Util.setColProp(qv, "RCVD_PKQTY", "display_style", "background-color:khaki;");

            Util.setColProp(qv, "RCVD_PKQTY", "mTitle", "itemPackQty");
            Util.setColProp(qv, "RCVD_PKQTY", "display_width", 60);
            Util.setColProp(qv, "RCVD_COST", "mTitleParent", "goodsRecieved");
            Util.setColProp(qv, "RCVD_COST", "mTitle", "itemPackCost");
            Util.setColProp(qv, "RCVD_COST", "display_width", 80);
            Util.setColProp(qv, "RCVD_COST", "display_format", cstFormat);
            Util.setColProp(qv, "RCVD_COST", "display_align", "ALIGN_END");
            Util.setColProp(qv, "RCVD_COST", "display_style", "background-color:khaki;");


            Util.setColProp(qv, "RCVD_AMT", "mTitleParent", "goodsRecieved");
            Util.setColProp(qv, "RCVD_AMT", "mTitle", "amountTxt");
            Util.setColProp(qv, "RCVD_AMT", "display_width", 80);
            Util.setColProp(qv, "RCVD_AMT", "display_format", "MONEY_FORMAT");
            Util.setColProp(qv, "RCVD_AMT", "mSummary", "SUM");
            Util.setColProp(qv, "RCVD_AMT", "display_style", "background-color:khaki;");

            Util.setColProp(qv, "RCVD_P", "mTitle", "txtRecvdP");
            Util.setColProp(qv, "RCVD_P", "mTitleParent", "goodsRecieved");
            Util.setColProp(qv, "RCVD_P", "display_width", 50);
            Util.setColProp(qv, "RCVD_P", "display_style", "background-color:khaki;");

            Util.setColProp(qv, "VARIA_QTY", "mTitleParent", "txtVariance");
            Util.setColProp(qv, "VARIA_QTY", "mTitleParentSpan", 2);
            Util.setColProp(qv, "VARIA_QTY", "mTitle", "itemPackQty");
            Util.setColProp(qv, "VARIA_QTY", "display_width", 60);
            Util.setColProp(qv, "VARIA_QTY", "display_style", "background-color:#e6e6fa;");


            Util.setColProp(qv, "VARIA_AMT", "mTitleParent", "txtVariance");
            Util.setColProp(qv, "VARIA_AMT", "mTitle", "amountTxt");
            Util.setColProp(qv, "VARIA_AMT", "display_width", 80);
            Util.setColProp(qv, "VARIA_AMT", "display_format", "MONEY_FORMAT");
            Util.setColProp(qv, "VARIA_AMT", "mSummary", "SUM");
            Util.setColProp(qv, "VARIA_AMT", "display_style", "background-color:#e6e6fa;");
            qv.mLctb.parse("{" + dt.data + "}", true);


            that.calcSumDetails();

            qv.onRowRender = function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                var oModel = this.getControl().getModel();
                var rcvqt = Util.extractNumber(oModel.getProperty("RCVD_PKQTY", currentRowContext));
                var ordqt = Util.extractNumber(oModel.getProperty("ORD_PKQTY", currentRowContext));
                if (rcvqt != ordqt)
                    for (var i = startCell; i < endCell; i++) {
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", "red");
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", "red");
                    }

            }

            var cmdclik = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var rfr = tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "ORD_REFER")].getText();
                var oqt = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "ORD_PKQTY")].getText());
                var rqt = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "RCVD_PKQTY")].getText());
                var mnu = new sap.m.Menu();
                if (oqt != rqt) {
                    mnu.removeAllItems();
                    mnu.addItem(new sap.m.MenuItem({
                        text: "Ammend PO qty..",
                        customData: { key: rfr },
                        press: function () {
                            var rfr = this.getCustomData()[0].getKey();
                            // UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=0 inclUnpostDlv=Y inclUnpost=Y para_PARAFORM=false para_EXEC_REP=true pref=" + accno, UtilGen.DBView, obj, UtilGen.DBView.newPage);
                            that.ammendPOqty(rfr, obj);
                        }
                    }));
                }

                if (mnu.getItems().length > 0)
                    mnu.openBy(obj);
            };
            for (var cl = 0; cl < qv.mLctb.cols.length; cl++)
                qv.mLctb.cols[cl].commandLinkClick = cmdclik;

            qv.loadData();
        }

    },
    ammendAllQty: function (pOnlyNotMatch) {
        var that = this;
        var ld = that.qcDet.mLctb;
        var onlyNotMatch = Util.nvl(pOnlyNotMatch, true);
        var showAmendQt = function (rfr) {
            that.ammendPOqty(rfr);
        };
        for (var l = 0; l < ld.rows.length; l++) {
            var rfr = ld.getFieldValue(l, "ORD_REFER");
            var grQty = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where PORD1_KEYFLD=" + that.selKf + " and ord_ship='" + rfr + "'");
            var poQty = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where keyfld=" + that.selKf + " and ord_refer='" + rfr + "'");
        }
    },
    ammendPOqty: function (rfr) {
        var that = this;
        var ld = that.qcDet.mLctb;
        var rn = ld.find("ORD_REFER", rfr);
        if (rn < 0) FormView.err("Err! Not found item " + rfr);
        var des = "PO # " + that.mp["ord_no"].getValue() + ld.getFieldValue(rn, "DESCR") + " - " + rfr;
        var msg = "";
        var grQty = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where PORD1_KEYFLD=" + that.selKf + " and ord_ship='" + rfr + "'");
        var poQty = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where keyfld=" + that.selKf + " and ord_refer='" + rfr + "'");
        msg = ""
        UtilGen.inputDialog(des, "Purchase Order qty " + ld.getFieldValue(rn, "ORD_PACKD") + " : " + poQty, grQty, function (str) {
            if (Util.nvl(str, "") == "")
                doCancel();

            doOk(str);
            return true;
        }, function () {
            doCancel();
            return true;
        }, undefined, undefined, {});
        var doCancel = function () {
            return;
        };
        var doOk = function (qt) {
            var qty = Util.extractNumber(qt + "");
            var pkd = ld.getFieldValue(rn, "ORD_PACKD");
            var sq = "update pord2 set ord_unqty=0,ord_allqty=:qty, ord_pkqty=:qty where keyfld=:keyfld and ord_refer=':refer' ; ";
            sq += "update pord1 set ORDERDQTY=(select sum(ord_allqty) from pord2 where pord2.keyfld=':keyfld') where pord1.keyfld=':keyfld' ;";
            sq = sq.replaceAll(":keyfld", that.selKf)
                .replaceAll(":refer", rfr)
                .replaceAll(":qty", qty);
            var dt = Util.execSQL("begin " + sq + " end;");
            if (dt.ret == "SUCCESS")
                FormView.msgSuccess(qty + " " + pkd + "  Updated ,# " + rfr + "-" + ld.getFieldValue(rn, "DESCR"));
            else
                FormView.err("Can't ammend quanity for " + rfr + "-" + ld.getFieldValue(rn, "DESCR"));
            that.load_detailPage();
        }

    },
    calcSumDetails: function () {
        var that = this;
        var qv = this.qcDet;
        var ld = qv.mLctb;
        var kdcost = Util.extractNumber(that.mp["kdcost"].getValue());
        for (var i = 0; i < ld.rows.length; i++) {
            var pprice = ld.getFieldValue(i, "ORD_PRICE");
            var rqt = ld.getFieldValue(i, "RCVD_PKQTY");
            var oqt = ld.getFieldValue(i, "ORD_PKQTY");
            var varr = oqt - rqt;
            var vamat = (varr * pprice);

            var rprice = pprice * kdcost;
            var ramt = rprice * rqt;
            var rpt = rqt > 0 && oqt > 0 ? Math.round((rqt / oqt) * 100) : 0; //(250/2500)*100

            ld.setFieldValue(i, "RCVD_COST", rprice);
            ld.setFieldValue(i, "RCVD_AMT", ramt);
            ld.setFieldValue(i, "RCVD_P", rpt + " %");
            ld.setFieldValue(i, "VARIA_QTY", varr);
            ld.setFieldValue(i, "VARIA_AMT", vamat);
        }
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


        // var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        // this.detailPage.addContent(sc);

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titPurWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
        var fe = [];
        this.mp = {};
        var mp = this.mp;
        var addFe = function (ar) {
            mp[ar[1].colname] = ar[1];
            fe = [...fe, ...ar.slice(0)];
        }
        //ord_no+ord_date             net_amt
        //ord_ref+ord_refnm           landing_cost
        //kd_cost                     total

        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_no", "", "txtPoNo", "15%", "", "10%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.LABEL,
                display_style: "keyIdText",
            }));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_date", "@", "txtPoNo", "10%", "", "15%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "amount", "@", "amountTxt", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]

            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_ref", "", "txtSupplier", "15%", "", "12%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_refnm", "@", "", "1%", "", "22%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
                keyboardFocus: false,
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "other_expenses", "@", "landingCostShort", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "kdcost", "", "kdCost", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "totalamt", "@", "totalTxt", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));

        var wdt = 800;
        var dlg = that.oController.getForm().getParent();
        if (Util.nvl(dlg, undefined) != undefined && dlg instanceof sap.m.Dialog && Util.nvl(dlg.$().width(), 0) > 0) {
            wdt = dlg.$().width() - 100;
            if (wdt > 800) wdt = 800;
            if (wdt < 200) wdt = 400;
        }
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, { width: wdt + "px" }, "sapUiSizeCompact", "");
        this.detailPage.addContent(cnt);
        that.qcDet = new QueryView("qv" + that.timeInLong);
        var qr = that.qcDet;
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        // qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        // qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
        qr.getControl().setFixedBottomRowCount(1);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(7);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;

        this.detailPage.addContent(this.qr.showToolbar.toolbar);
        this.detailPage.addContent(qr.getControl());
        this.qr.showToolbar.toolbar.addContent(new sap.m.Button({
            text: "Ammend Qty..",
            press: function () {
                Util.simpleConfirmDialog("Only ammend Qty not received  equal to PO ?", function (oAction) {
                    that.ammendAllQty(true);
                }, function () {
                    that.ammendAllQty(false);
                });
            }
        }));

        Util.navEnter(fe);

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
                        that.validateDetail();
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
    validateDetail: function () {
        var that = this;
        var grQty = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where po=" + that.selKf);
        var poQty = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where po=" + that.selKf);
        if (poQty == 0 || grQty != poQty)
            FormView.err("Err ! Quanitty of PO and Good receipt not matched !");
    },    
    generatePur: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        if (Util.nvl(that.selKf, -1) <= -1)
            FormView.err("PO is not selected !");
        var sq1 = " update pord1 set close_date=trunc(sysdate),closed_by='" + sett["LOGON_USER"] + "' where keyfld=" + that.selKf + "; "
        var sq = "begin " + sq1 + "c7_po_close(" + that.selKf + "); end;";
        var dtPo = UtilGen.PurchaseOrderFunc.checkPOStatus(that.selKf, true);
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            FormView.msgSuccess("Successfully Closed PO !");            
            that.joApp.backFunction();
        }

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
        thatForm.selKf = -1;
        thatForm.joApp.toDetail(thatForm.mainPage, "slide");
        var sq = "SELECT ORD_NO,ORD_DATE,ORD_REF,ORD_REFNM,ORD_AMT-ORD_DISCAMT NET_AMT,'0%' RECIEVED,KEYFLD FROM PORD1 WHERE ORD_CODE=11 AND ORD_FLAG=2 order by ord_no";
        var dt = Util.execSQL(sq);
        var qv = this.qc;
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");

            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].mHideCol = true;

            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";

            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].getMUIHelper().display_width = 50;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REF")].getMUIHelper().display_width = 50;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REFNM")].getMUIHelper().display_width = 120;
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].getMUIHelper().display_width = 70;
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mSummary = "SUM";
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_style = "background-color:lightgrey;";



            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].getMUIHelper().display_align = "ALIGN_CENTER";
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].getMUIHelper().display_align = "ALIGN_CENTER";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REF")].getMUIHelper().display_align = "ALIGN_CENTER";

            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].mTitle = "titleTxt";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].mTitle = "txtPoNo";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].mTitle = "txtPoNo";
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mTitle = "txtNetAmt";
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].mTitle = "rcptDateTxt";

            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();

        }

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
