sap.ui.jsfragment("bin.forms.br.kha.forms.qp", {

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
            showSubHeader: true,
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
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 10, "L": 12, "XL": 18 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        var filtercol = ["ORD_SHIP", "ITEMNAME", "ORD_NO", "ATTN"];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;

        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        this.loadData();
    },

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        var sett = sap.ui.getCore().getModel("settings").getData();
        this.cust_code = '';

        Util.destroyID("txtTit" + this.timeInLong, this.view);
        Util.destroyID("txtName" + this.timeInLong, this.view);
        Util.destroyID("txtCust" + this.timeInLong, this.view);
        Util.destroyID("txtFromDate" + this.timeInLong, this.view);
        Util.destroyID("txtToDate" + this.timeInLong, this.view);
        Util.destroyID("txtLoc" + this.timeInLong, this.view);
        Util.destroyID("chkTonOnly" + this.timeInLong, this.view);
        Util.destroyID("txtBrName" + this.timeInLong, this.view);
        Util.destroyID("txtBr" + this.timeInLong, this.view);

        this.fromDate = UtilGen.addControl(fe, "From Date", sap.m.DatePicker, "txtFromDate" + this.timeInLong,
            {
                editable: true,
                width: "25%",
                dateValue: UtilGen.parseDefaultValue("$FIRSTDATEOFMONTH"),
                valueFormat: sett["ENGLISH_DATE_FORMAT"],
                displayFormat: sett["ENGLISH_DATE_FORMAT"],
                layoutData: new sap.ui.layout.GridData({ span: "XL2 L2 M2 S12" })
            }, "date", undefined, that.view);

        this.todate = UtilGen.addControl(fe, "@To Date", sap.m.DatePicker, "txtToDate" + this.timeInLong,
            {
                editable: true,
                dateValue: UtilGen.parseDefaultValue("$TODAY"),
                valueFormat: sett["ENGLISH_DATE_FORMAT"],
                displayFormat: sett["ENGLISH_DATE_FORMAT"],
                width: "25%",
                layoutData: new sap.ui.layout.GridData({ span: "XL2 L2 M2 S12" })
            }, "date", undefined, that.view);

        this.txtLoc = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "txtLoc" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "25%",
                selectedKey: "ALL",
                selectionChange: function (e) {
                    that.loadData();
                    var cnt = this;
                    setTimeout(function () {
                        cnt.$().find("input").attr("readonly", true);
                    }, 250);


                }
            }, "string", undefined, this.view, undefined, "select 'ALL' code,'ALL' name from dual union all select code, name from locations order by code "
        );
        this.txtCust = new sap.m.Input(this.view.createId("txtCust" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "15%", editable: true,
            showValueHelp: true,
            change: function () {
                var vl = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(that.txtCust.getValue()));
                that.txtName.setValue(vl);
                that.loadData();

            },
            valueHelpRequest: function (e) {
                var btns = [];
                var fromd = that.fromDate.getDateValue();
                var todt = that.todate.getDateValue();
                var lo = UtilGen.getControlValue(that.txtLoc);
                var ton = (that.chkTonOnly.getSelected() ? "Y" : "N");

                var sq = "SELECT O.ORD_REF CODE,Y.NAME TITLE ,COUNT(*) DELIVEREIS FROM C_YCUST Y,C_ORDER1 O WHERE O.ORD_REF=Y.CODE AND O.SALEINV IS NULL " +
                    " AND o.ORD_DATE >=:fromdate AND o.ORD_DATE <=:todate " +
                    " and (o.location_code =':locations' or ':locations' = 'ALL') " +
                    " AND ((QTY_2 > 0 AND ':show_ton' = 'Y') OR(QTY_2 = 0 AND ':show_ton' != 'Y')) " +
                    " GROUP BY O.ORD_REF,Y.NAME ORDER BY O.ORD_REF   ";
                sq = sq.replaceAll(":fromdate", Util.toOraDateString(fromd))
                    .replaceAll(":todate", Util.toOraDateString(todt))
                    .replaceAll(":locations", lo)
                    .replaceAll(":show_ton", ton);

                UtilGen.Search.do_quick_search(e, that.txtCust,
                    sq,
                    "select code,name title from c_ycust where code=:CODE", that.txtName, function () {
                        that.loadData();
                    }, undefined, btns)

            }
        });
        this.chkTonOnly = new sap.m.CheckBox(this.view.createId("chkTonOnly" + this.timeInLong), {
            select: function () {
                that.loadData();
            },
            textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: true,
        });

        this.txtName = new sap.m.Input(this.view.createId("txtName" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false,

        });
        this.txtBr = new sap.m.Input(this.view.createId("txtBr" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "15%", editable: true,
            showValueHelp: true,
            change: function () {
                var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtCust.getValue()) + " and brno=" + Util.quoted(that.txtBr.getValue()));
                that.txtBrName.setValue(vl);
                that.loadData();
            },
            valueHelpRequest: function (e) {
                var btns = [];
                UtilGen.Search.do_quick_search(e, that.txtBr,
                    "select brno code,b_name title from cbranch where cbranch.code='" + that.txtCust.getValue() + "'  order by brno ",
                    "select brno code,b_name title from cbranch where cbranch.code='" + that.txtCust.getValue() + "' and brno=:CODE", that.txtBrName, function () {
                        that.loadData();
                    }, undefined, btns)
            }
        });
        this.txtBrName = new sap.m.Input(this.view.createId("txtBrName" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false,

        });
        var tb = new sap.m.Toolbar();
        var bt1 = new sap.m.Button({
            icon: "sap-icon://refresh",
            text: "Refresh",
            press: function () {
                that.loadData();
            }
        });
        var bt2 = new sap.m.Button({
            text: "Close",
            icon: "sap-icon://decline",
            press: function () {
                that.joApp.backFunction();
            }
        });
        var bt3 = new sap.m.Button({
            icon: "sap-icon://update",
            text: "Update data",
            press: function () {
                that.updateData();
            }
        });
        tb.addContent(bt1);
        tb.addContent(bt3);
        tb.addContent(new sap.m.ToolbarSpacer());
        tb.addContent(bt2);

        var fe = [
            Util.getLabelTxt("qryPriceTon", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("fromDate", "25%"), Util.getEmptyLabel(),
            Util.getLabelTxt("toDate", "25%", "@", "", "Center"), Util.getEmptyLabel(),
            Util.getLabelTxt("locationTxt", "25%", "@", "", "Center"), Util.getEmptyLabel(),
            Util.getLabelTxt("Only Ton", "25%", "@", "", "Begin"), Util.getEmptyLabel(),
            Util.getLabelTxt("", "0px", "", "", "Center"), this.fromDate,
            Util.getLabelTxt("", "0px", "@", "Center"), this.todate,
            Util.getLabelTxt("", "0px", "@", "Center"), this.txtLoc,
            Util.getLabelTxt("", "0px", "@", "Begin"), this.chkTonOnly,
            Util.getLabelTxt("txtCust", "25%", "", "", "Center"), Util.getEmptyLabel(),
            Util.getLabelTxt("txtBranch", "41%", "@", "", "Center"), Util.getEmptyLabel(),
            Util.getLabelTxt("", "0px", ""), this.txtCust,
            Util.getLabelTxt("", "0px", "@", "Center"), this.txtName,
            Util.getLabelTxt("", "0px", "@", "Center"), this.txtBr,
            Util.getLabelTxt("", "0px", "@", "Center"), this.txtBrName,
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: ((sap.ui.Device.resize.width - 500) > 900 ? 900 : (sap.ui.Device.resize.width - 500)) + "px",
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
        // cnt.addContent(tb);
        this.mainPage.setSubHeader(tb);

        // cnt.addContent(new sap.m.VBox({ height: "40px" }));
        this.mainPage.addContent(cnt);
        this.todate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));
        this.fromDate.setDateValue(UtilGen.parseDefaultValue("$FIRSTDATEOFMONTH"));

    }
    ,
    loadData: function () {
        var that = this;
        var fromd = that.fromDate.getDateValue();
        var todt = that.todate.getDateValue();
        var cc = that.txtCust.getValue();
        var lo = UtilGen.getControlValue(that.txtLoc);
        var br = that.txtBr.getValue();
        var qv = this.qr;

        var ton = (that.chkTonOnly.getSelected() ? "Y" : "N");
        var sq = "SELECT  QTY_2, PRICE_2,'طن' packd_2, C.ORD_DATE," +
            " ( select NVL(max(PRICEU),0)  from c_contract_items " +
            " where cust_code=c.ord_ref and branch_no=c.ord_discamt and c.ORD_SHIP=refer " +
            " and c.ord_date>=startdate and c.ord_date<=enddate and PRICEU>0 ) price_u, " +
            " C.ORD_SHIP, I.DESCR ITEMNAME, " +
            " C.ORD_PKQTY ,C.PACKDX,C.ORD_NO, attn, L.NAME LOCATION_NAME, " +
            " C.LOCATION_CODE,C.KEYFLD,C.ORD_POS, " +
            " ORD_REF, ORD_DISCAMT " +
            " FROM C_ORDER1 C, ITEMS I, LOCATIONS L " +
            " WHERE C.ORD_SHIP = I.REFERENCE AND L.CODE = C.LOCATION_CODE AND C.SALEINV IS NULL " +
            // " AND C.PACKDX != 'طن' " +
            " AND C.ORD_DATE >=:fromdate AND C.ORD_DATE <=:todate " +
            " AND C.ORD_REF =':cust_code' " +
            " and (c.location_code =':locations' or ':locations' = 'ALL') " +
            " AND (C.ORD_DISCAMT =':site' OR ':site' IS NULL) " +
            " AND ((QTY_2 > 0 AND ':show_ton' = 'Y') OR(QTY_2 = 0 AND ':show_ton' != 'Y')) " +
            " ORDER BY c.ord_date,C.KEYFLD";
        sq = sq.replaceAll(":fromdate", Util.toOraDateString(fromd))
            .replaceAll(":todate", Util.toOraDateString(todt))
            .replaceAll(":cust_code", cc)
            .replaceAll(":locations", lo)
            .replaceAll(":site", br)
            .replaceAll(":show_ton", ton);

        var dt = Util.execSQL(sq);

        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.parse("{" + dt.data + "}", true);

            qv.mLctb.cols[qv.mLctb.getColPos("QTY_2")].mColClass = "sap.m.Input";
            qv.mLctb.cols[qv.mLctb.getColPos("PRICE_2")].mColClass = "sap.m.Input";

            qv.mLctb.cols[qv.mLctb.getColPos("QTY_2")].mTitle = Util.getLangText("txtQtyTon");
            qv.mLctb.cols[qv.mLctb.getColPos("PRICE_2")].mTitle = Util.getLangText("txtPriceTon");
            qv.mLctb.cols[qv.mLctb.getColPos("PACKD_2")].mTitle = Util.getLangText("Ton");
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_SHIP")].mTitle = Util.getLangText("itemCode");
            qv.mLctb.cols[qv.mLctb.getColPos("ITEMNAME")].mTitle = Util.getLangText("itemDescr");
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_PKQTY")].mTitle = Util.getLangText("dlvQty");
            qv.mLctb.cols[qv.mLctb.getColPos("PACKDX")].mTitle = Util.getLangText("itemPackD");
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].mTitle = Util.getLangText("noTxt");
            qv.mLctb.cols[qv.mLctb.getColPos("ATTN")].mTitle = Util.getLangText("branchNmTxt");

            qv.mLctb.cols[qv.mLctb.getColPos("LOCATION_CODE")].mHideCol = true;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_POS")].mHideCol = true;
            // qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].mHideCol = true;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REF")].mHideCol = true;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DISCAMT")].mHideCol = true;

            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";

            qv.mLctb.cols[qv.mLctb.getColPos("QTY_2")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("PRICE_2")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("PACKD_2")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_SHIP")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ITEMNAME")].getMUIHelper().display_width = 150;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_PKQTY")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("PACKDX")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ATTN")].getMUIHelper().display_width = 120;
            qv.mLctb.cols[qv.mLctb.getColPos("PRICE_U")].getMUIHelper().display_width = 50;
            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].getMUIHelper().display_width = 0;
            qv.mLctb.cols[qv.mLctb.getColPos("QTY_2")].eValidateColumn = function (evtx) {
                var row = evtx.getSource().getParent();
                var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                var columns = evtx.getSource().getParent().getParent().getColumns();
                var table = evtx.getSource().getParent().getParent(); // get table control.
                var oModel = table.getModel();
                var rowStart = table.getFirstVisibleRow(); //starting Row index
                var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));
                var newValue = Util.extractNumber(evtx.getSource().getValue());

                var pru = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + '/PRICE_U'));
                if (newValue > 0 && pru > 0)
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PRICE_2', pru);
            }

            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());

                UtilGen.execCmd("bin.forms.br.kha.forms.dlv formTitle=DELIVERY formType=dialog keyfld=" + kfld + " formSize=80%,70%", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    that.loadData();
                });
            };

            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
            qv.editable = true;

        }



    },
    updateData: function () {
        var that = this;
        var qv = this.qr;
        var ld = qv.mLctb;
        qv.updateDataToTable();
        var ton = (that.chkTonOnly.getSelected() ? "Y" : "N");
        if (ld.rows.length == 0) FormView.err("No data found !");
        var qt = 0; pr = 0;
        var sqs = "";
        var sqUpd1 = "update c_order1 set qty_2=:qty2 , price_2=:price2 where keyfld=:keyfld and ord_pos=:ordpos and saleinv is null;";
        var kfs = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (ton != 'Y' && ld.getFieldValue(i, "QTY_2") > 0)
                kfs[ld.getFieldValue(i, "KEYFLD")] = ld.getFieldValue(i, "ORD_NO");
            if (ton == 'Y' && ld.getFieldValue(i, "QTY_2") == 0)
                kfs[ld.getFieldValue(i, "KEYFLD")] = ld.getFieldValue(i, "ORD_NO");
        }
        var kys = Object.keys(kfs);
        for (var i = 0; i < ld.rows.length; i++) {
            if (ton != "Y" && kfs[ld.getFieldValue(i, "KEYFLD")] != undefined && ld.getFieldValue(i, "QTY_2") == 0)
                FormView.err("Ord No " + kfs[ld.getFieldValue(i, "KEYFLD")] + " must enter qty to all !");
            if (ton == "Y" && kfs[ld.getFieldValue(i, "KEYFLD")] != undefined && ld.getFieldValue(i, "QTY_2") > 0)
                FormView.err("Ord No " + kfs[ld.getFieldValue(i, "KEYFLD")] + " must zero to TON to all !");
        }
        for (var i = 0; i < ld.rows.length; i++) {
            var qt2 = ld.getFieldValue(i, "QTY_2");
            var p2 = Util.extractNumber(ld.getFieldValue(i, "PRICE_2"));
            var kf = ld.getFieldValue(i, "KEYFLD");
            var pos = ld.getFieldValue(i, "ORD_POS");
            if (ton != 'Y' && qt2 > 0) {
                var sq1 = sqUpd1.replaceAll(":qty2", qt2)
                    .replaceAll(":price2", p2)
                    .replaceAll(":keyfld", kf)
                    .replaceAll(":ordpos", pos);
                sqs += sq1;
            }
            if (ton == 'Y') {
                var sq1 = sqUpd1.replaceAll(":qty2", qt2)
                    .replaceAll(":price2", p2)
                    .replaceAll(":keyfld", kf)
                    .replaceAll(":ordpos", pos);
                sqs += sq1;
            }
        }
        if (sqs.length > 0) {
            sqs = "begin " + sqs + " end;";
            var dt = Util.execSQL(sqs);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess(Util.getLangText("msgSaved"));
                that.loadData();
            } else {
                FormView.err("Err !, contact provider or administration !");
            }
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



