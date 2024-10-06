sap.ui.jsfragment("bin.forms.br.kha.forms.wzd", {

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
            width: "600px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "border-color: lightgreen;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };
        this.tit = new sap.m.Text({ height: "25px", width: "100%", text: Util.getLangText("titSalWzd") }).addStyleClass("titleFontWithoutPad");
        // this.txtLocations = new sap.m.ComboBox(
        //     {
        //         width: "50%",
        //         customData: [{ key: "" }],
        //         items: {
        //             path: "/",
        //             template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
        //             templateShareable: true
        //         },
        //         selectionChange: function (ev) {
        //         },
        //         selectedKey: "-1"
        //     });
        // Util.fillCombo(this.txtLocations, "select '-1' code,'ALL' from dual union all select code,name from locations  order by 1 ");
        // this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));
        this.txtLocations = new sap.m.Input({
            editable: true,
            showValueHelp: true,
            width: "60%",
            valueHelpRequest: function (e) {
                var sq = "select code,name title from locations order by code";
                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select code,name title from c_ycust where code=:CODE", that.txtRefName, function (dt) {
                        console.log(dt);
                    }, undefined, undefined, true);
            }
        });
        var dt = Util.execSQLWithData("select code from locations order by code");
        var loc = "";
        for (var li = 0; li < dt.length; li++)
            loc += " \"" + dt[li].CODE + "\"";
        this.txtLocations.setValue(loc);
        this.txtFromDate = new sap.m.DatePicker({ width: "50%" });
        this.txtToDate = new sap.m.DatePicker({ width: "50%" });

        this.txtRef = new sap.m.Input({
            width: "30%", showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sqDlvCounts = "(select count(*)  from c_order1 where c_ycust.code=c_order1.ord_ref and ord_code=9 and saleinv is null and " +
                    locWhere +
                    " and ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ")";

                var sqWhere = "(select distinct ord_ref from c_order1 where ord_code=9 and saleinv is null and " +
                    locWhere +
                    " and ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ")";
                var sq = "select code,name from c_ycust where code in " + sqWhere +
                    " and " +
                    " childcount=0 order by path ";


                var sq = "select code,name," + sqDlvCounts + " deliveries from c_ycust where code in " + sqWhere +
                    " and " +
                    " childcount=0 order by path ";



                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select code,name title from c_ycust where code=:CODE", that.txtRefName, undefined, undefined, undefined, false);
            },
            change: function (e) {
                var vl = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(that.txtRef.getValue()));
                that.txtRefName.setValue(vl);
            }
        });
        this.txtRefName = new sap.m.Input({
            width: "49%", editable: false
        });

        this.txtBranch = new sap.m.Input({

            width: "30%", showValueHelp: true,            
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sq = "select brno code,b_name name from cbranch where brno in " +
                    " (select distinct ORD_DISCAMT from C_ORDER1 where ord_code=9 and SALEINV is null and " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + " and " +
                    locWhere +
                    " and  ORD_REF=" + Util.quoted(that.txtRef.getValue()) +
                    ") and  code=" + Util.quoted(that.txtRef.getValue()) +
                    " order by brno";
                // search multiple select
                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select '' from dual ", that.txtBranchName, function (dt) {
                        console.log(dt);
                        // if (dt.length == 1) {
                        //     var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue().replaceAll('"',"")));
                        //     that.txtBranchName.setValue(vl);
                        // }

                    }, undefined, undefined, true);

                // Util.showSearchList(sq, "NAME", "CODE", function (valx, val) {
                //     that.txtBranch.setValue(valx);
                //     that.txtBranchName.setValue(val);
                // });
            },
            change: function (e) {
                // var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue()));
                // that.txtBranchName.setValue(vl);
            }
        });
        this.txtBranchName = new sap.m.Input({
            width: "49%", editable: false
        });
        this.recheckPrice = new sap.m.CheckBox({
            selected: false,
        })
        this.txtFromDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDateValue(UtilGen.parseDefaultValue("$FIRSTDATEOFMONTH"))
        this.txtToDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));

        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("", "", "#"), this.tit,
            Util.getLabelTxt("locationTxt", "50%"), this.txtLocations,
            Util.getLabelTxt("fromDate", "50%"), this.txtFromDate,
            Util.getLabelTxt("toDate", "50%"), this.txtToDate,
            Util.getLabelTxt("refName", "20%"), this.txtRef,
            Util.getLabelTxt("", "1%", "@"), this.txtRefName,
            Util.getLabelTxt("txtBranch", "20%"), this.txtBranch,
            Util.getLabelTxt("", "1%", "@"), this.txtBranchName,
            Util.getLabelTxt("", "100%", "#"), new sap.m.VBox({ height: "20px" }),
            Util.getLabelTxt("recheckPrice", "20%"), this.recheckPrice,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
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

        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
        this.mainPage.addContent(cnt);

        // this.mainPage.addContent(sc);
        setTimeout(function () {
            var ar = [].concat(formCss["cssText"]);
            for (var ix in ar)
                cnt.$().css("cssText", ar);

        }, 150);


    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qv;
        var fromdt = UtilGen.getControlValue(this.txtFromDate);
        var todt = UtilGen.getControlValue(this.txtToDate);

        if (Util.nvl(that.txtRef.getValue(), "") == "") {
            that.joApp.to(that.mainPage, "slide");
            FormView.err("Must select Customer !");
        }

        if (fromdt == null || todt == null) { that.joApp.to(that.mainPage, "slide"); return; };
        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText").addStyleClass("redText boldText"));
        this.txtAddAmt.setValue(0);
        this.txtTotalAmount.setValue(0);
        this.txtTotalDlv.setValue(0);

        var loc = that.txtLocations.getValue();
        var brn = that.txtBranch.getValue(); 

        var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
        var branWhere = " ('" + brn + "' like '%\"'||ORD_DISCAMT||'\"%' )"; 

        var sq = "SELECT   o.periodcode," +
            "               o.location_code," +
            "               locations.name location_name," +
            "               o.ORD_NO," +
            "               o.ord_ref," +
            "               ord_code," +
            "               TRIM (o.ord_refnm) ORD_REFNM," +
            "               o.ord_date," +
            "               COUNT (o.ord_no) counting," +
            "               sum(tqty/ord_pack) tqty , " +
            "               sum(qty_2) qty_ton," +
            "               'طن' PACKD_ton, " +
            "               1 PACK_ton, " +
            "               max(ord_packd) packd," +
            "               GETAVGPRICEDLV_TON(o.keyfld,'N') AVG_PRICE_TON ," +
            "               GETAVGPRICEDLV(o.keyfld,'N') AVG_PRICE ," +
            "               NVL (SUM (OP_NO * TQTY), 0) ADD_AMT," +
            "               GETSUMPRICEDLV(o.keyfld,'N') AMOUNT," +
            "               GETSUMPRICEDLV_TON(o.keyfld,'N') AMOUNT_TON," +
            "               SUM(SALE_PRICE*ord_pkqty) +NVL (SUM (OP_NO * ord_pkqty), 0) NET_AMT, " +
            "               o.ord_discamt," +
            "               cbranch.b_name branchname," +
            "               GETAVGPRICEDLV(o.keyfld) PRICE2 ," +
            "               GETSUMPRICEDLV(o.keyfld) AMT2 ," +
            "               GETAVGPRICEDLV_TON(o.keyfld) PRICE2_TON ," +
            "               GETSUMPRICEDLV_TON(o.keyfld) AMT2_TON ," +
            "               o.KEYFLD" +
            "        FROM   c_order1 o , " +
            "               items ," +
            "               cbranch , " +
            "               LOCATIONS " +
            "        WHERE locations.code=o.location_code and o.saleinv IS NULL" +
            "                      AND (o.ord_discamt = cbranch.brno " +
            "                    AND o.ord_ref = cbranch.code) " +
            "               AND ( (items.REFERENCE = o.ord_ship))" +
            " and o.ord_code=9 " +
            " and o.ord_date>=" + Util.toOraDateString(fromdt) +
            " and o.ord_date<=" + Util.toOraDateString(todt) +
            " and " + locWhere +
            " and ord_ref=" + Util.quoted(that.txtRef.getValue()) +
            " and (" + Util.quoted(that.txtBranch.getValue().trim()) + " is null " +
            // " or " + Util.quoted(that.txtBranch.getValue()) + " is null )" +
            " OR " + branWhere + " ) " + 
            "    GROUP BY   o.periodcode," +
            "               locations.name,o.location_code ," +
            "               o.ord_ref, " +
            "               TRIM (o.ord_refnm)," +
            "               o.ord_date ," +
            "               o.ord_discamt ," +
            "               cbranch.b_name," +
            "               ord_code," +
            "               o.ORD_NO," +
            "               o.KEYFLD," +
            "               o.ATTN," +
            "               GETAVGPRICEDLV(o.keyfld) , " +
            "               GETSUMPRICEDLV(o.keyfld), " +
            "               GETAVGPRICEDLV_TON(o.keyfld) , " +
            "               GETAVGPRICEDLV(o.keyfld,'N') , " +
            "               GETSUMPRICEDLV(o.keyfld,'N') , " +
            "               GETAVGPRICEDLV_TON(o.keyfld,'N') , " +
            "                'طن'," +
            "                1 ," +
            "               o.ORD_DISCAMT";

        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.getColByName("KEYFLD").getMUIHelper().display_width = 0;
            qv.mLctb.getColByName("ORD_DISCAMT").mTitle = "Branch";
            // qv.mLctb.getColByName("LOCATION_CODE").mHideCol = true;
            qv.mLctb.getColByName("ORD_CODE").mHideCol = true;
            qv.mLctb.getColByName("PERIODCODE").mHideCol = true;
            qv.mLctb.getColByName("ORD_REF").mHideCol = true;
            qv.mLctb.getColByName("ORD_REFNM").mHideCol = true;
            qv.mLctb.getColByName("COUNTING").mHideCol = true;
            qv.mLctb.getColByName("QTY_TON").mHideCol = true;
            qv.mLctb.getColByName("AVG_PRICE_TON").mHideCol = true;
            qv.mLctb.getColByName("AMOUNT_TON").mHideCol = true;
            qv.mLctb.getColByName("PRICE2_TON").mHideCol = true;
            qv.mLctb.getColByName("AMT2_TON").mHideCol = true;
            qv.mLctb.getColByName("PACKD_TON").mHideCol = true;
            qv.mLctb.getColByName("PACK_TON").mHideCol = true;



            qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_format = "SHORT_DATE_FORMAT";
            qv.mLctb.getColByName("LOCATION_CODE").getMUIHelper().display_width = 50;
            qv.mLctb.getColByName("LOCATION_NAME").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_width = 90;
            qv.mLctb.getColByName("ORD_NO").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("TQTY").getMUIHelper().display_width = 60;
            qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.getColByName("NET_AMT").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("NET_AMT").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.getColByName("ADD_AMT").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("ADD_AMT").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.getColByName("AVG_PRICE").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("AVG_PRICE").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.getColByName("PACKD").getMUIHelper().display_width = 40;

            qv.mLctb.getColByName("AVG_PRICE").mTitle = Util.getLangText("txtPrice");
            qv.mLctb.getColByName("PRICE2").mTitle = Util.getLangText("txtChkPrice");

            qv.mLctb.getColByName("PRICE2").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("PRICE2").getMUIHelper().display_format = "MONEY_FORMAT";

            qv.mLctb.getColByName("AMT2").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("AMT2").getMUIHelper().display_format = "MONEY_FORMAT";

            qv.mLctb.getColByName("BRANCHNAME").getMUIHelper().display_width = 120;
            qv.mLctb.getColByName("ORD_DISCAMT").getMUIHelper().display_width = 50;

            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());

                UtilGen.execCmd("bin.forms.br.kha.forms.dlv formTitle=DELIVERY formType=dialog keyfld=" + kfld + " formSize=80%,70%", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    that.load_detailPage();
                });
            };

            qv.onRowRender = function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                var oModel = this.getControl().getModel();
                var ap = Util.extractNumber(oModel.getProperty("AVG_PRICE", currentRowContext));
                var p2 = Util.extractNumber(oModel.getProperty("PRICE2", currentRowContext));
                if (ap != p2)
                    for (var i = startCell; i < endCell; i++) {
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", "red");
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", "red");
                    }

            }

            qv.mLctb.parse("{" + dt.data + "}", true);
            // setPriceData();
            qv.loadData();
            var ld = qv.mLctb;
            // check if qty_ton have value...
            for (var li = 0; li < ld.rows.length; li++) {
                var tq = ld.getFieldValue(li, "QTY_TON");
                if (tq > 0) {
                    var p1 = ld.getFieldValue(li, "AVG_PRICE_TON");
                    var amt1 = ld.getFieldValue(li, "AMOUNT_TON");
                    var p2 = ld.getFieldValue(li, "PRICE2_TON");
                    var amt2 = ld.getFieldValue(li, "AMT2_TON");
                    var pkd = ld.getFieldValue(li, "PACKD_TON");
                    var adamt = ld.getFieldValue(li, "ADD_AMT");

                    ld.setFieldValue(li, "TQTY", tq);
                    ld.setFieldValue(li, "AVG_PRICE", p1);
                    ld.setFieldValue(li, "AMOUNT", amt1);
                    ld.setFieldValue(li, "PRICE2", p2);
                    ld.setFieldValue(li, "AMT2", amt2);
                    ld.setFieldValue(li, "PACKD", pkd);
                    ld.setFieldValue(li, "NET_AMT", (p1 * tq) + (adamt));
                }
            }
            qv.updateDataToControl();
            // recheck price selecgted
            if (that.recheckPrice.getSelected()) {
                for (var li = 0; li < ld.rows.length; li++) {
                    var p2 = ld.getFieldValue(li, "PRICE2");
                    var tq = ld.getFieldValue(li, "TQTY");
                    var aa = ld.getFieldValue(li, "ADD_AMT");
                    var net = (p2 * tq) + aa;
                    ld.setFieldValue(li, "AVG_PRICE", p2);
                    ld.setFieldValue(li, "AMOUNT", (p2 * tq));
                    ld.setFieldValue(li, "NET_AMT", net);
                }
                qv.updateDataToControl();
            }
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
        this.txtInfoLocations = new sap.m.ComboBox(
            {
                width: "35%",
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{DESCR}", key: "{NO}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                    var vl =
                        Util.fillCombo(that.txtInfoInvType, "select no ,descr from invoicetype where location_code='" + UtilGen.getControlValue(this) + "' order by no");
                    that.txtInfoInvType.setSelectedItem(that.txtInfoInvType.getItems()[0]);
                    setTimeout(function () {
                        that.txtInfoInvType.fireSelectionChange();
                    });
                },
                value: ""
            });
        Util.fillCombo(this.txtInfoLocations, "select code,name from locations order by code");
        // this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));
        //UtilGen.setControlValue(that.txtInfoLocations, sett["DEFAULT_LOCATION"]);

        this.txtInfoInvType = new sap.m.ComboBox({
            width: "25%",
            customData: [{ key: "" }],
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                templateShareable: true
            },
            selectionChange: function (ev) {
                var sq = "select nvl(max(invoice_no),0)+1 from pur1 " +
                    " where location_code=':location' and invoice_code=21 and type=:type "
                        .replaceAll(":location", UtilGen.getControlValue(that.txtInfoLocations))
                        .replaceAll(":type", UtilGen.getControlValue(that.txtInfoInvType));
                var nwPurNo = Util.getSQLValue(sq);
                that.txtInfoInvNo.setValue(nwPurNo);
            },
            value: ""
        });
        this.txtInfoSalesp = new sap.m.ComboBox({
            width: "35%",
            customData: [{ key: "" }],
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{NAME}-{CODE}", key: "{CODE}" }),
                templateShareable: true
            },
            selectionChange: function (ev) {
            },
            selectedKey: ""
        });

        Util.fillCombo(that.txtInfoSalesp, "select no code ,name from salesp where type='S' order by no");

        var endAlign = sap.ui.core.TextAlign.End;
        var beginAlign = sap.ui.core.TextAlign.Begin;
        this.txtInfoInvNo = new sap.m.Input({ width: "35%" });
        this.txtInfoInvDate = new sap.m.DatePicker({ width: "25%" });

        this.txtInfoPoNo = new sap.m.Input({ width: "25%" });

        this.txtInfoRef = new sap.m.Input({ width: "25%", editable: false });
        this.txtInfoRefName = new sap.m.Input({ width: "54%", editable: false });
        this.txtInfoBranch = new sap.m.Input({ width: "25%", editable: false });
        this.txtInfoBranchName = new sap.m.Input({ width: "54%", editable: false });
        this.txtInfoGross = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: false }).addStyleClass();
        this.txtInfoDisc = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: true }).addStyleClass();
        this.txtInfoAdd = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: true }).addStyleClass();
        this.txtInfoAddRemarks = new sap.m.Input({ textAlign: beginAlign, width: "54%", editable: true }).addStyleClass();
        this.txtInfoDiscRemarks = new sap.m.Input({ textAlign: beginAlign, width: "54%", editable: true }).addStyleClass();
        this.txtInfoAmount = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: false }).addStyleClass("yellow");
        this.txtInfoDescr = new sap.m.Input({ width: "80%" });


        this.txtInfoInvDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));

        this.txtInfoAdd.attachChange(function () {
            that.calcInfoAmt(false);
        });
        this.txtInfoDisc.attachChange(function () {
            that.calcInfoAmt(false);
        });


        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("", "100%", "#", undefined, "Begin"),
            Util.getLabelTxt("locationTxt", "20%"), this.txtInfoLocations,
            Util.getLabelTxt("txtInvType", "20%", "@"), this.txtInfoInvType,
            Util.getLabelTxt("txtInvNo", "20%", ""), this.txtInfoInvNo,
            Util.getLabelTxt("dateTxt", "20%", "@"), this.txtInfoInvDate,
            Util.getLabelTxt("txtSalesPerson", "20%", ""), this.txtInfoSalesp,
            Util.getLabelTxt("txtPoNo", "20%", "@"), this.txtInfoPoNo,
            Util.getLabelTxt("", "100%", "#", undefined, "Begin"),
            Util.getLabelTxt("txtCust", "20%", ""), this.txtInfoRef,
            Util.getLabelTxt("", "1%", "@"), this.txtInfoRefName,
            Util.getLabelTxt("txtBranch", "20%", ""), this.txtInfoBranch,
            Util.getLabelTxt("", "1%", "@"), this.txtInfoBranchName,
            Util.getLabelTxt("", "100%", "#", undefined, "Begin"),
            Util.getLabelTxt("txtGrossAmt", "20%", ""), this.txtInfoGross,
            Util.getLabelTxt("txtAddInvoice", "20%", ""), this.txtInfoAdd,
            Util.getLabelTxt("", "1%", "@"), this.txtInfoAddRemarks,
            Util.getLabelTxt("txtDisc", "20%", ""), this.txtInfoDisc,
            Util.getLabelTxt("", "1%", "@"), this.txtInfoDiscRemarks,
            Util.getLabelTxt("txtNetAmt", "20%", "", "redText"), this.txtInfoAmount,
            Util.getLabelTxt("descrTxt", "20%"), this.txtInfoDescr,
            Util.getLabelTxt("", "25%"), new sap.m.VBox({ height: "25px" }),
        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");

        this.infoPage.addContent(cnt);
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
            that.txtInfoLocations.fireSelectionChange();
        }, 100);
    },
    createDetailPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.detailPage);
        this.qv = new QueryView("qrDet" + this.timeInLong);
        // this.qv.getControl().addStyleClass("sapUiSizeCondensed");
        this.qv.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowSelector);
        this.qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        this.qv.getControl().setAlternateRowColors(true);
        this.qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        that.qv.getControl().setVisibleRowCount(5);
        this.qv.getControl().setFixedBottomRowCount(0);
        UtilGen.createDefaultToolbar1(this.qv, ["ORD_NO", "ORD_DATE"], true);

        var sc = new sap.m.ScrollContainer({
            width: "100%", height: "100%",
            vertical: true,
            content: [
                this.qv.showToolbar.toolbar,
                this.qv.getControl()
            ]
        });

        this.detailPage.addContent(sc);
        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        this.qv.getControl().attachRowSelectionChange(function (e) {
            var tot = 0;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var slices = this.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
            var slicesof = that.qv.getControl().getBinding("rows").aIndices;
            var amtx = 0;
            var addamt = 0;
            var totalcounts = 0;
            for (var i = 0; i < slices.length; i++) {
                amtx += Util.extractNumber(Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "NET_AMT"), "0"));
                addamt += Util.extractNumber(Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "ADD_AMT"), "0"));
                totalcounts++;
            }

            that.txtTotalAmount.setValue(df.format(amtx));
            that.txtAddAmt.setValue(df.format(addamt));
            that.txtTotalDlv.setValue(totalcounts);
        });

        this.txtTotalAmount = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");
        this.txtAddAmt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");;
        this.txtTotalDlv = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");;
        var hbl = new sap.m.HBox({
            items: [
                new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, text: "Net Amount", width: "200px" }),
                new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, text: "Additional", width: "200px" }),
                new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, text: "Selected Deliveries", width: "200px" })
            ]
        })
        var hbt = new sap.m.HBox({
            items: [that.txtTotalAmount, that.txtAddAmt, that.txtTotalDlv]
        })

        sc.addContent(new sap.m.VBox({ height: "20px" }));
        sc.addContent(new sap.m.VBox({ items: [hbl, hbt] }));

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
        var slices = this.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        if (slices.length <= 0) {
            that.joApp.toDetail(that.detailPage, "slide");
            FormView.err("No Any delivery selected !");
        }
        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.infoPage.removeAllHeaderContent();
        this.infoPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        var loc = UtilGen.getControlValue(sett["DEFAULT_LOCATION"]);
        UtilGen.setControlValue(that.txtInfoLocations, "-", "-", true);
        UtilGen.setControlValue(that.txtInfoLocations, loc, loc, true);
        that.txtInfoLocations.fireSelectionChange();
        var adamt = df.format(parseFloat(that.txtAddAmt.getValue()));
        that.txtInfoRef.setValue(that.txtRef.getValue());
        that.txtInfoRefName.setValue(that.txtRefName.getValue());
        // that.txtInfoBranch.setValue(that.txtBranch.getValue());
        // that.txtInfoBranchName.setValue(that.txtBranchName.getValue());
        that.txtInfoDisc.setValue(df.format(0));
        that.txtInfoAdd.setValue(adamt);
        that.txtInfoGross.setValue(that.txtTotalAmount.getValue());
        that.txtInfoAmount.setValue(that.txtTotalAmount.getValue());

        if (that.txtInfoBranch.getValue().trim() == "") {
            var br = Util.getSQLValue("select min(brno) from cbranch where code=" + Util.quoted(that.txtInfoRef.getValue()));
            var brnam = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtInfoRef.getValue()) + " and brno=" + br);
            that.txtInfoBranch.setValue(br);
            that.txtInfoBranchName.setValue(brnam);
        }
        var slp = Util.getSQLValue("select salesp from c_ycust where code='" + that.txtInfoRef.getValue() + "'");
        if (slp != "")
            that.txtInfoSalesp.setSelectedKey(slp);
        that.calcInfoAmt(true, true);
    },
    loadData: function () {
        var thatForm = this;
        if (Util.nvl(this.oController.pcust, "") != "") {
            var pcust = this.oController.pcust;
            var pbrno = Util.nvl(this.oController.pbrno, '');
            var fromdt = Util.nvl(this.oController.fromdate, '');
            var todt = Util.nvl(this.oController.todate, '');
            var ordno = Util.nvl(this.oController.ordno, '');
            thatForm.txtRef.setValue(pcust);
            thatForm.txtRef.fireChange();
            thatForm.txtBranch.setValue(pbrno);
            thatForm.txtBranch.fireChange();
            if (fromdt != '')
                thatForm.txtFromDate.setDateValue(new Date(fromdt));
            if (todt != '')
                thatForm.txtToDate.setDateValue(new Date(todt));

            thatForm.view.byId("cmdNext1").firePress();
            if (ordno != '')
                setTimeout(function () {
                    var ld = thatForm.qv.mLctb;
                    var rn = ld.find("ORD_NO", ordno);
                    if (rn > -1) {
                        thatForm.qv.getControl().setSelectedIndex(rn);
                        thatForm.qv.getControl().setFirstVisibleRow(rn);
                        // thatForm.view.byId("cmdNext2").firePress();
                    }

                }, 100);


        }
        // if (Util.nvl(this.oController.pcust, "") != "" &&
        //     Util.nvl(this.oController.status, "view") == FormView.RecordStatus.VIEW) {
        //     this.frm.setFieldValue("pac", this.oController.accno, this.oController.accno, true);
        //     this.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        //     this.oController.accno = "";
        //     return;

        // }
        // this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
    },
    calcInfoAmt: function (pRfresh, pRefreshAdd) {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var rfresh = Util.nvl(pRfresh, false);
        var rfreshAdd = Util.nvl(pRefreshAdd, false);
        if (rfresh) {
            var kfldStr = "";
            var slices = that.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
            var slicesof = that.qv.getControl().getBinding("rows").aIndices;
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
                kfldStr = kfldStr + (kfldStr.length > 0 ? "," : "") + kfld;
            }
            if (kfldStr.length <= 0)
                FormView.err("No rows selected !");
            var sq = "select nvl(sum((o.price_x)*(o.qty_x)),0) from joined_corder o where o.ord_code=9 and o.keyfld in (:txtKflds)";
            if (that.recheckPrice.getSelected())
                sq = "select nvl(sum((o.price_calc)*(o.qty_x)),0) from joined_corder2 o where o.ord_code=9 and o.keyfld in (:txtKflds)";
            sq = sq.replaceAll(":txtKflds", kfldStr);
            var sum = Util.getSQLValue(sq);
            that.txtInfoGross.setValue(df.format(sum));
            if (rfreshAdd) {
                var sq = "select nvl(sum(op_no*tqty),0) from C_ORDER1 o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds)";
                sq = sq.replaceAll(":txtKflds", kfldStr);
                var sumadd = Util.getSQLValue(sq);
                that.txtInfoAdd.setValue(df.format(sumadd));
            }

        }
        var add = Util.extractNumber(that.txtInfoAdd.getValue());
        var disc = Util.extractNumber(that.txtInfoDisc.getValue());
        var gross = Util.extractNumber(that.txtInfoGross.getValue());
        that.txtInfoAmount.setValue(df.format((gross + add) - disc));
    },
    generatePur: function () {
        var that = this;
        var invdt = UtilGen.getControlValue(this.txtInfoInvDate);
        var sqp = "", sqp2 = "", spkd = "", spk = 1;
        sqp = (that.recheckPrice.getSelected() ?
            "pr:=get_item_price2(x.ord_ship,x.ord_ref,x.ord_discamt,x.ord_date);" : "pr:= x.sale_price;");
        sqp2 = (that.recheckPrice.getSelected() ?
            "pr:=get_item_price2_ton(x.ord_ship,x.ord_ref,x.ord_discamt,x.ord_date);" : "pr:= x.price_2;");
        that.calcInfoAmt(true);
        var jn = (that.recheckPrice.getSelected() ?
            "cursor ds is select o.*,o.price_calc price_xx from JOINED_CORDER2 o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ; " :
            "cursor ds is select o.*,o.price_x price_xx from JOINED_CORDER o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ;");
        var sq = "declare " +
            " pcode varchar2(255):=repair.GETSETUPVALUE_2('CURRENT_PERIOD');" +
            " ploc varchar2(255):=:txtLoc;" +
            " pinvno number:=:txtInv;" +
            " pdate date:=:txtDate;" +
            " ptype number:=:txtType;" +
            " pstr number:=:txtStr;" +
            " pref varchar2(255):= :txtRef;" +
            " pBrNo number:=:txtBranch; " +
            " addamt number:=:addamt; " +
            " discamt number :=:discamt;" +
            " adescr_memo varchar2(500) :=':addescr';" +
            " ddescr_ctg varchar2(500) :=':ddescr';" +
            " salesp varchar2(500) :=':txtSalesp';" +
            " pono varchar2(500) :=':txtPoNo';" +
            " " +
            " grossamt number :=0;" +
            " prd_date date;" +
            " exp_date date;" +
            " kfld number;" +
            " posx number:=0;" +
            " pr number;" +
            " refnm varchar2(500);" +
            " dag number:=0;" +
            " aag number:=0;" +
            " totdag number:=0;" +
            " totaag number:=0;" +
            " totamt number:=0;" +
            " " +
            jn +
            // " cursor ds is select o.*,it.packd, it.pack,it.unitd,it.pkaver,it.prd_dt prd_date,it.exp_dt exp_date from C_ORDER1 o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ;" +
            // " cursor ds is select o.* from JOINED_CORDER o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ;" +
            " cursor pu(kfx number) is select *from pur2 where keyfld=kfx order by itempos;" +
            " " +
            " begin" +
            " select nvl(max(keyfld),0)+1 into kfld from pur1;" +
            " for x in ds loop" +
            "     pr:=x.price_xx; " +
            "     posx:=posx+1;" +
            "     insert into pur2(PERIODCODE, LOCATION_CODE, INVOICE_NO, " +
            "                 INVOICE_CODE, TYPE, ITEMPOS, REFER, STRA, PRICE, PKCOST," +
            "                 DISC_AMT, PACK, PACKD, UNITD, DAT, QTY, PKQTY, FREEQTY, FREEPKQTY, " +
            "                 ALLQTY, PRD_DATE, EXP_DATE, YEAR, FLAG, ORDWAS, KEYFLD, RATE, CURRENCY, " +
            "                 CREATDT, ORDERNO, QTYIN, QTYOUT, DISC_AMT_GROSS, SLSMNXX," +
            "                 RECIEVED_KEYFLD, FREE_ALLQTY,costcent,size_of_descr,recipt_date )" +
            "                 values (" +
            "                 pcode, ploc, pinvno, " +
            "                 21, ptype, posx, x.ord_ship, nvl(x.strb,x.stra) , pr ,  x.pkaver ," +
            "                 0, x.pack_x, x.packd_x, x.unitd, pdate," +
            "                 0, x.qty_x, 0, 0," +
            "                 x.qty_x*x.pack_x , x.prd_date, x.exp_date, '2003', 2, x.keyfld ," +
            "                 kfld , 1, 'KWD', SYSDATE, X.ord_pos, 0, x.qty_x*x.pack_x, 0, x.ORD_EMPNO," +
            "                 null, 0,'',x.PAYTERM, x.ord_date ) ;" +
            "     totamt:= totamt + ((x.qty_x) * (pr) ); " +
            " " +
            "  if x.pack_x=1 then " +
            "   update C_ORDER1 set price_2=pr, SALEINV=kfld,ORD_POS=X.ORD_POS,ord_flag=2 where ord_code=9 and keyfld=x.keyfld; " +
            " else " +
            "   update C_ORDER1 set sale_price=pr,SALEINV=kfld,ORD_POS=X.ORD_POS,ord_flag=2 where ord_code=9 and keyfld=x.keyfld; " +
            " end if;" +
            "   update ORDER1 set SALEINV=kfld,ord_flag=2 where ord_code=9 and keyfld=x.keyfld; " +
            " " +
            " end loop;" +
            " select name into refnm from c_ycust where code=pref and childcount=0 and flag=1 ;" +
            " if posx>0 then" +
            "  insert into PUR1(PERIODCODE, LOCATION_CODE, INVOICE_NO," +
            "                 INVOICE_CODE, TYPE, INVOICE_DATE, STRA, SLSMN," +
            "                  MEMO, ctg, INV_REF, INV_REFNM, INV_AMT, DISC_AMT, INV_COST,ADD_CHARGEX,deptno, " +
            "                  FLAG, CREATDT, LPNO, BKNO, KEYFLD, USERNAME, SUPINVNO, SHIPCO," +
            "                 INS_CO, BANK, LCNO, INS_NO, RATE, CURRENCY, KDCOST, CHG_KDAMT," +
            "                 ORDERNO, C_CUS_NO,YEAR,NO_OF_RECIEVED,costcent,C_BRANCH_NO, REFERENCE_INFORMATION ) VALUES" +
            "                 (pcode, ploc, pinvno," +
            "                  21, ptype, pdate, pstr, salesp," +
            "                  adescr_memo,ddescr_ctg, (select ac_no from c_ycust where code=pref ), refnm," +
            "                   totamt, discamt, 0, addamt,addamt," +
            "                  2, sysdate, '', '', kfld,user, '', ''," +
            "                 '', '', '', '', 1,'KWD', 1 , 0," +
            "                 null, pref,'2003',0,null,pBrNo ,pono);" +
            " for xx in pu(kfld) loop " +
            " IF DISCAMT>0 and totamt>0 THEN " +
            " dag:=((discamt / totamt) * (((xx.price)/xx.PACK)*(xx.allqty))) / (xx.allqty/xx.pack);" +
            " end if;" +
            "  IF addamt>0 THEN " +
            " aag:=((addamt / totamt) * (((xx.price)/xx.PACK)*(xx.allqty))) / (xx.allqty/xx.pack); " +
            " END IF;" +
            " update pur2 set add_amt_gross=aag,disc_amt_gross=dag where keyfld=xx.keyfld and itempos=xx.itempos;" +
            " end loop;" +
            " x_post_sale_invoice(kfld);" +
            " " +
            " " +
            " end if;" +
            " " +
            " end;";

        var kfldStr = "";
        var slices = that.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = that.qv.getControl().getBinding("rows").aIndices;
        for (var i = 0; i < slices.length; i++) {
            var kfld = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
            kfldStr = kfldStr + (kfldStr.length > 0 ? "," : "") + kfld;
        }
        if (kfldStr.length <= 0)
            FormView.err("No rows selected !");
        sq = sq.replaceAll(":txtLoc", Util.quoted(UtilGen.getControlValue(that.txtInfoLocations)))
            .replaceAll(":txtInv", that.txtInfoInvNo.getValue())
            .replaceAll(":txtDate", Util.toOraDateString(invdt))
            .replaceAll(":txtType", UtilGen.getControlValue(that.txtInfoInvType))
            .replaceAll(":txtStr", "1")
            .replaceAll(":txtRef", Util.quoted(that.txtInfoRef.getValue()))
            .replaceAll(":txtKflds", kfldStr)
            .replaceAll(":addamt", Util.extractNumber(that.txtInfoAdd.getValue()))
            .replaceAll(":discamt", Util.extractNumber(that.txtInfoDisc.getValue()))
            .replaceAll(":addescr", that.txtInfoAddRemarks.getValue())
            .replaceAll(":ddescr", that.txtInfoDiscRemarks.getValue())
            .replaceAll(":txtBranch", that.txtInfoBranch.getValue())
            .replaceAll(":txtPoNo", that.txtInfoPoNo.getValue())
            .replaceAll(":txtSalesp", that.txtInfoSalesp.getSelectedKey());
        var dt = Util.execSQL(sq);
        if (dt.ret != "SUCCESS") {
            FormView.err("Error , check  server log !");
        } else {
            var kfld = Util.getSQLValue("select nvl(max(keyfld),-1) from pur1 where invoice_code=21");
            that.printInv(kfld);
            that.joApp.to(that.detailPage, "slide");
            that.load_detailPage();
            sap.m.MessageToast.show("Sales generated successfully !");
        }

    },
    printInv: function (kfld) {
        var that = this;
        that.loadData(true);
        var dt = Util.execSQLWithData("select location_code,invoice_no from pur1 where keyfld=" + kfld);
        if (dt.length > 0) {
            var invn = dt[0].INVOICE_NO;
            var loc = dt[0].LOCATION_CODE;
            if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");
            Util.simpleConfirmDialog1(Util.getLangText("msgPrintOptions1"), "Printing Invoice",
                function (oAction) {
                    var addStr = "";
                    if (oAction == "PRICE") addStr = "price/";
                    Util.printServerReport("br/kha/" + Util.nvl(addStr, "") + "brsale", "_para_pfromno=" +
                        invn + "&_para_ptono=" + invn + "&_para_plocation=" + loc);
                }, ["PRICE", "ITEMS"]

            );
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



