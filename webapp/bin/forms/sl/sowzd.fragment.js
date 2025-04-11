sap.ui.jsfragment("bin.forms.sl.sowzd", {

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

        this.dlvPage = new sap.m.Page({
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
        this.joApp.addDetailPage(this.dlvPage);
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
                "border-style: groove;" +
                "border-color: lightgreen;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;" +
                "background-color:#faebd7"
            ]
        };
        this.tit = new sap.m.Text({ height: "25px", width: "100%", text: Util.getLangText("titPurWzd") }).addStyleClass("titleFontWithoutPad");
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
                    " and ord_date<=" + Util.toOraDateString(todt) + ") ";

                var sqWhere = "(select distinct ord_ref from c_order1 where ord_code=9 and saleinv is null and " +
                    locWhere +
                    " and ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ") ";
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
        // this.recheckPrice = new sap.m.CheckBox({
        //     selected: false,
        // })
        this.txtSO = new sap.m.Input({
            width: "30%", editable: true, showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sq = "select ord_no,ord_date,ord_ref,ord_refnm,keyfld,ord_amt,location_code from pord1 o1 where  " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + " and " +
                    " ord_flag=2 and ordacc='approve' and DELIVEREDQTY>0 and " +
                    locWhere +
                    " and  (ord_ref=" + Util.quoted(that.txtRef.getValue()) + " or " +
                    Util.quoted(that.txtRef.getValue()) + " is null ) " +
                    " order by keyfld";
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_DATE", "ORD_REF", "ORD_REFNM", "ORD_AMT"], function (data) {
                        that.selectedSOKfld = data.KEYFLD;
                        that.txtSO.setValue(data.ORD_NO);
                    }, { pWidth: "80%" }, undefined, false, Util.getLangText("titSalesOrder"), [
                    {
                        ORD_NO: {
                            colname: "ORD_NO",
                            display_width: 80,
                            mTitle: Util.getLangText("slsOrdN"),
                        }
                    },
                    {
                        ORD_DATE: {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                            display_width: 100
                        }
                    },
                    {
                        ORD_REF: {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                            display_width: 100,
                        }
                    },
                    {
                        ORD_REFNM: {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                            display_width: 250

                        }
                    },
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        }
                    },
                    {
                        ORD_AMT: {
                            colname: "ORD_AMT",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("amountTxt"),
                            display_width: 120,
                            mSummary: "SUM"
                        }
                    }
                ]);
            },
            change: function (e) {
                // var vl = Util.getSQLValue("select keyfld from pord1 where ord_no=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue()));
                // that.txtBranchName.setValue(vl);
            }
        });

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
            Util.getLabelTxt("--OR--", "40%", "#"), new sap.m.VBox({ height: "20px" }),
            Util.getLabelTxt("SO: ", "20%"), this.txtSO,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        Util.destroyID("cmdNext1", that.view);
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button(that.view.createId("cmdNext1"), {
                    text: "Next",
                    press: function () {
                        if (Util.nvl(that.selectedSOKfld, -1) == -1) {
                            that.joApp.toDetail(that.detailPage, "slide");
                            that.load_detailPage();
                        } else {
                            that.joApp.toDetail(that.dlvPage, "slide");
                            that.load_dlvPage();

                        }
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
        that.createDeliveryPage();
        that.createInfoPage();

        // this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
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
        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

    },
    validatSO: function () {
        var that = this;
        var qv = this.qvDlv;
        var errMsgAndRetFirstPage = function (msg) {
            that.joApp.toDetail(that.mainPage, "slide");
            FormView.err(msg);
        }
        if (Util.nvl(that.selectedSOKfld, -1) == -1)
            errMsgAndRetFirstPage("SO is not selected !");
        var sodt = UtilGen.SalesOrderFunc.checkSOStatus(that.selectedSOKfld, false);
        if (sodt.ORD_FLAG != 2)
            errMsgAndRetFirstPage(" SO either not approved or closed !");
        if (sodt.ORDACC != UtilGen.SalesOrderFunc.initAction.approve &&
            sodt.ORDACC != UtilGen.SalesOrderFunc.initAction.issueDeliver)
            errMsgAndRetFirstPage("Initial action for SO either should be 'APPROVE' or 'DELIVERY' ");

        var sodt = Util.execSQLWithData("select p.ord_no,p.ord_ref,p.ord_refnm,p.ord_branchno,b.b_name branchname " +
            " from pord1 p,cbranch b where p.keyfld=" + that.selectedSOKfld +
            " and b.brno=p.ord_branchno and b.code=p.ord_ref");
        if (sodt == undefined || sodt.length == 0)
            errMsgAndRetFirstPage("Unexpected error , not found SO !");
        return sodt;
    },
    load_dlvPage: function () {
        var that = this;
        var qv = this.qvDlv;

        var fromdt = UtilGen.getControlValue(this.txtFromDate);
        var todt = UtilGen.getControlValue(this.txtToDate);

        var loc = that.txtLocations.getValue();
        var brn = that.txtBranch.getValue();

        var sodt = that.validatSO();

        var refCode = sodt[0].ORD_REF;
        var refName = sodt[0].ORD_REFNM;
        var bName = sodt[0].BRANCHNAME;


        this.dlvPage.removeAllHeaderContent();
        this.dlvPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + "  SO : " + sodt[0].ORD_NO + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
        var branWhere = " ('" + brn + "' is null or '" + brn + "' like '%\"'||ORD_DISCAMT||'\"%' )";

        var getSQLWhere = function (ordDates) {
            return "        WHERE o.saleinv IS NULL" +
                "                      AND (o.ord_discamt = cbranch.brno " +
                "                    AND o.ord_ref = cbranch.code) " +
                "               AND ( (items.REFERENCE = o.ord_ship))" +
                " and o.ord_code=9 and " +
                "  o.keyfld=" + that.selectedSOKfld + " and " +
                ordDates +
                " and " + locWhere +
                " and ord_ref=" + Util.quoted(refCode) +
                " and  " + branWhere + " ";

        }
        var showDetails = function () {
            var ordDates = " o.ord_date>=" + Util.toOraDateString(fromdt) +
                " and o.ord_date<=" + Util.toOraDateString(todt);

            var sq = "SELECT   o.periodcode," +
                "               o.location_code," +
                "               o.ORD_NO," +
                "               o.ord_ref," +
                "               ord_code," +
                "               TRIM (o.ord_refnm) ORD_REFNM," +
                "               o.ord_date," +
                "               NVL (SUM (0), 0) ADD_AMT," +// chyanged to 0 
                "               SUM(c7_get_so_price(o.pord1_keyfld,o.pord_pos)*(o.TQTY/o.ord_pack)) AMOUNT, " +
                "               SUM(C7_GET_SO_DISCAMTGROSS(o.pord1_keyfld,o.pord_pos)) ord_discamt," +
                "               0 NET_AMT, " +
                "               cbranch.b_name branchname," +
                "               o.KEYFLD " +
                "        FROM   c_order1 o , " +
                "               items ," +
                "               cbranch " +
                getSQLWhere(ordDates) +
                "    GROUP BY   o.periodcode," +
                "               o.location_code," +
                "               o.ord_ref, " +
                "               TRIM (o.ord_refnm)," +
                "               o.ord_date ," +
                "               cbranch.b_name," +
                "               ord_code," +
                "               o.ORD_NO," +
                "               o.KEYFLD," +
                "               o.ATTN," +
                "               o.ORD_DISCAMT";

            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.getColByName("KEYFLD").getMUIHelper().display_width = 0;
                qv.mLctb.getColByName("ORD_DISCAMT").mTitle = "Discount";

                qv.mLctb.getColByName("LOCATION_CODE").mHideCol = true;
                qv.mLctb.getColByName("ORD_CODE").mHideCol = true;
                qv.mLctb.getColByName("PERIODCODE").mHideCol = true;
                qv.mLctb.getColByName("ORD_REF").mHideCol = true;
                qv.mLctb.getColByName("ORD_REFNM").mHideCol = true;

                qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_format = "SHORT_DATE_FORMAT";
                qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_width = 90;
                qv.mLctb.getColByName("ORD_NO").getMUIHelper().display_width = 80;
                qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_width = 80;
                qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.getColByName("NET_AMT").getMUIHelper().display_width = 120;
                qv.mLctb.getColByName("ORD_DISCAMT").getMUIHelper().display_width = 120;
                qv.mLctb.getColByName("ORD_DISCAMT").getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.getColByName("NET_AMT").getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.getColByName("ADD_AMT").getMUIHelper().display_width = 80;
                qv.mLctb.getColByName("ADD_AMT").getMUIHelper().display_format = "MONEY_FORMAT";

                qv.mLctb.getColByName("BRANCHNAME").getMUIHelper().display_width = 120;
                // qv.mLctb.getColByName("ORD_DISCAMT").getMUIHelper().display_width = 50;

                qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                    var tbl = obj.getParent().getParent();
                    var mdl = tbl.getModel();
                    var rr = tbl.getRows().indexOf(obj.getParent());
                    var rowStart = tbl.getFirstVisibleRow();
                    var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());
                    UtilGen.execCmd("bin.forms.sl.sodlv formTitle=DELIVERY formType=dialog readonly=true keyfld=" + kfld + " formSize=80%,70%", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                        that.load_dlvPage();
                    });
                };

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                qv.getControl().fireRowSelectionChange();

                var ld = qv.mLctb;
                for (var li = 0; li < ld.rows.length; li++) {
                    var amt = ld.getFieldValue(li, "AMOUNT");
                    var disc = ld.getFieldValue(li, "ORD_DISCAMT");
                    // var aa = ld.getFieldValue(li, "ADD_AMT");
                    var net = (amt - disc) //+ aa;
                    ld.setFieldValue(li, "NET_AMT", net);
                }
                qv.updateDataToControl();

            }
        }
        showDetails();



    },
    createInfoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var view = this.view;
        var formCss = {
            width: { "S": 500, "M": 650, "L": 750, "XL": 750 },
            cssText: [
                "padding-left:10px;" +
                "padding-top:20px;" +
                "border-width: thin;" +
                "border-style: solid;" +
                "border-color: lavender;" +
                "margin: 10px;" +
                "border-radius:25px;"
                // "background-color:khaki;"
            ],
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
        var endAlign = sap.ui.core.TextAlign.End;
        this.txtInfoInvNo = new sap.m.Input({ width: "35%" });
        this.txtInfoInvDate = new sap.m.DatePicker({ width: "25%" });
        this.txtInfoRef = new sap.m.Input({ width: "25%", editable: false });
        this.txtInfoRefName = new sap.m.Input({ width: "54%", editable: false });
        this.txtInfoBranch = new sap.m.Input({ width: "25%", editable: false });
        this.txtInfoBranchName = new sap.m.Input({ width: "54%", editable: false });
        this.txtInfoGross = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: false }).addStyleClass();
        this.txtInfoDisc = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: true }).addStyleClass();
        this.txtInfoAdd = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: true }).addStyleClass();
        this.txtInfoAddRemarks = new sap.m.Input({ textAlign: endAlign, width: "54%", editable: true }).addStyleClass();
        this.txtInfoDiscRemarks = new sap.m.Input({ textAlign: endAlign, width: "54%", editable: true }).addStyleClass();
        this.txtInfoAmount = new sap.m.Input({ textAlign: endAlign, width: "25%", editable: false }).addStyleClass("yellow");
        this.txtInfoDescr = new sap.m.Input({ width: "80%" });


        this.txtInfoInvDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));
        // this.txtInfoInvDate.setDateValue(that.txtFromDate.getDateValue());

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
            Util.getLabelTxt("txtOrdType", "20%", "@"), this.txtInfoInvType,
            Util.getLabelTxt("txtInvNo", "20%", ""), this.txtInfoInvNo,
            Util.getLabelTxt("dateTxt", "20%", "@"), this.txtInfoInvDate,
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
    //TODO CREATE QUERYVIEW FOR SOs which 'approve' and opened.
    
    createDetailPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.detailPage);
        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();


        var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        // this.detailPage.addContent(sc);

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        this.qv = new QueryView("qrDet" + this.timeInLong);
        // this.qv.getControl().addStyleClass("sapUiSizeCondensed");
        this.qv.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowSelector);
        this.qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        this.qv.getControl().setAlternateRowColors(true);
        this.qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        // this.qv.getControl().setRowHeight(26);        
        that.qv.getControl().setVisibleRowCount(10);
        // this.qv.setAutoDispRecords(this.detailPage, { "S": 70, "M": 70, "L": 70, "XL": 70 });
        that.qv.getControl().setRowHeight(20);
        this.qv.getControl().setFixedBottomRowCount(0);

        this.txtTotalAmount = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");
        this.txtAddAmt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");
        this.txtTotalDlv = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");

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

        this.detailPage.addContent(this.qv.getControl());
        this.detailPage.addContent(sc);

        sc.addContent(new sap.m.VBox({ items: [hbl, hbt] }));
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
    //CONTINUE : update AVERAGE COST AND CHECK COST JV.
    //DONEXT : additional amount in SO and wizard same like discount
    generatePur: function () {
        var that = this;
        var sqp = "";
        var sodt = that.validatSO();

        var selCust = sodt[0].ORD_REF;
        var selCustName = sodt[0].ORD_REFNM;
        var selBrno = sodt[0].ORD_BRANCHNO;
        var selBrName = sodt[0].BRANCHNAME;
        var selDate = that.txtToDate.getDateValue();
        var invdt = UtilGen.getControlValue(this.txtInfoInvDate);


        sqp = "pr:=c7_get_so_price(x.pord1_keyfld,x.pord_pos,'N'); idsc:= (c7_get_so_line_disc(x.pord1_keyfld,x.pord_pos)/(x.tqty/x.pack));";
        that.calcInfoAmt(true);
        var sq = "declare " +
            " pSoKfld number:= :soKeyfld;" +
            " pcode varchar2(255):=repair.GETSETUPVALUE_2('CURRENT_PERIOD');" +
            " ploc varchar2(255):=:txtLoc;" +
            " pinvno number:=:txtInv;" +
            " pdate date:=:txtDate;" +
            " ptype number:=:txtType;" +
            " pstr number:=:txtStr;" +
            " prefname varchar2(500):= :txtRefName;" +
            " pref varchar2(255):= :txtRef;" +
            " pBrNo number:=:txtBranch; " +
            " addamt number:=:addamt; " +
            " discamt number :=:discamt;" +
            " adescr_memo varchar2(500) :=':addescr';" +
            " ddescr_ctg varchar2(500) :=':ddescr';" +
            " " +
            " grossamt number :=0;" +
            " prd_date date;" +
            " exp_date date;" +
            " kfld number;" +
            " posx number:=0;" +
            " pr number;" +
            " idsc number;" +
            " refnm varchar2(500);" +
            " dag number:=0;" +
            " aag number:=0;" +
            " totdag number:=0;" +
            " totaag number:=0;" +
            " totamt number:=0;" +
            " " +
            " cursor ds is select o.*,it.packd, it.pack,it.unitd,it.pkaver,it.prd_dt prd_date,it.exp_dt exp_date from C_ORDER1 o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ;" +
            " cursor pu(kfx number) is select *from pur2 where keyfld=kfx order by itempos;" +
            " " +
            " begin" +
            " select nvl(max(keyfld),0)+1 into kfld from pur1;" +
            " for x in ds loop" +
            " " + sqp +
            "     posx:=posx+1;" +
            "     insert into pur2(PERIODCODE, LOCATION_CODE, INVOICE_NO, " +
            "                 INVOICE_CODE, TYPE, ITEMPOS, REFER, STRA, PRICE, PKCOST," +
            "                 DISC_AMT, PACK, PACKD, UNITD, DAT, QTY, PKQTY, FREEQTY, FREEPKQTY, " +
            "                 ALLQTY, PRD_DATE, EXP_DATE, YEAR, FLAG, ORDWAS, KEYFLD, RATE, CURRENCY," +
            "                 CREATDT, ORDERNO, QTYIN, QTYOUT, DISC_AMT_GROSS, SLSMNXX," +
            "                 ISSUED_KEYFLD, FREE_ALLQTY,costcent,size_of_descr,recipt_date,po_keyfld,po_posno)" +
            "                 values (" +
            "                 pcode, ploc, pinvno," +
            "                 21, ptype, posx, x.ord_ship, nvl(x.strb,x.stra) , pr,  x.pkaver ," +
            "                 idsc, x.pack, x.packd, x.unitd, pdate," +
            "                 0, x.tqty/x.pack, 0, 0," +
            "                 x.tqty, x.prd_date, x.exp_date, '2003', 2, x.keyfld ," +
            "                 kfld , 1, 'KWD', SYSDATE, X.ord_pos,0, X.tqty, 0, x.ORD_EMPNO," +
            "                 X.KEYFLD, 0,'',x.PAYTERM,x.ord_date,x.pord1_keyfld,x.pord_pos ) ;" +
            "     totamt:=totamt+((x.TQTY/x.ord_pack)*(pr-idsc));                " +
            " " +
            "   update C_ORDER1 set sale_price=pr-idsc,SALEINV=kfld,ORD_POS=X.ORD_POS,ord_flag=2 where ord_code=9 and keyfld=x.keyfld and ord_pos=x.ord_pos;" +
            "   update ORDER1 set SALEINV=kfld,ord_flag=2 where ord_code=9 and keyfld=x.keyfld; " +
            " " +
            " end loop;" +
            " select nvl(prefname,name) into refnm from c_ycust where code=pref and childcount=0 and flag=1 ;" +
            " if posx>0 then" +
            "  insert into PUR1(PERIODCODE, LOCATION_CODE, INVOICE_NO," +
            "                 INVOICE_CODE, TYPE, INVOICE_DATE, STRA, SLSMN," +
            "                  MEMO, ctg, INV_REF, INV_REFNM, INV_AMT, DISC_AMT, INV_COST,ADD_CHARGEX,deptno, " +
            "                  FLAG, CREATDT, LPNO, BKNO, KEYFLD, USERNAME, SUPINVNO, SHIPCO," +
            "                 INS_CO, BANK, LCNO, INS_NO, RATE, CURRENCY, KDCOST, CHG_KDAMT," +
            "                 ORDERNO, C_CUS_NO,YEAR,NO_OF_ISSUES,costcent,C_BRANCH_NO,PO_KEYFLD ) VALUES" +
            "                 (pcode, ploc, pinvno," +
            "                  21, ptype, pdate, pstr, null," +
            "                  adescr_memo,ddescr_ctg, (select ac_no from c_ycust where code=pref ), refnm," +
            "                   totamt, discamt, 0, addamt,addamt," +
            "                  2, sysdate, '', '', kfld,user, '', ''," +
            "                 '', '', '', '', 1,'KWD', 1 , 0," +
            "                 null, pref,'2003',1,null,pBrNo,pSoKfld );" +
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
        var slices = that.qvDlv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = that.qvDlv.getControl().getBinding("rows").aIndices;
        for (var i = 0; i < slices.length; i++) {
            var kfld = Util.nvl(Util.getCellColValue(that.qvDlv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
            kfldStr = kfldStr + (kfldStr.length > 0 ? "," : "") + kfld;
        }
        if (kfldStr.length <= 0)
            FormView.err("No rows selected !");
        sq = sq.replaceAll(":txtLoc", Util.quoted(UtilGen.getControlValue(that.txtInfoLocations)))
            .replaceAll(":soKeyfld", that.selectedSOKfld)
            .replaceAll(":txtInv", that.txtInfoInvNo.getValue())
            .replaceAll(":txtDate", Util.toOraDateString(invdt))
            .replaceAll(":txtType", UtilGen.getControlValue(that.txtInfoInvType))
            .replaceAll(":txtStr", "1")
            .replaceAll(":txtRefName", Util.quoted(selCustName))
            .replaceAll(":txtRef", Util.quoted(selCust))
            .replaceAll(":txtKflds", kfldStr)
            .replaceAll(":addamt", Util.extractNumber(that.txtInfoAdd.getValue()))
            .replaceAll(":discamt", Util.extractNumber(that.txtInfoDisc.getValue()))
            .replaceAll(":addescr", that.txtInfoAddRemarks.getValue())
            .replaceAll(":ddescr", that.txtInfoDiscRemarks.getValue())
            .replaceAll(":txtBranch", selBrno);
        var dt = Util.execSQL(sq);
        if (dt.ret != "SUCCESS") {
            FormView.err("Error , check  server log !");
        } else {
            var kfld = Util.getSQLValue("select nvl(max(keyfld),-1) from pur1 where invoice_code=21");
            that.printInv(kfld);
            that.joApp.to(that.dlvPage, "slide");
            that.load_dlvPage();
            sap.m.MessageToast.show("Sales generated successfully !");
        }

    },

    printInv: function (kfld) {
        var that = this;
        that.loadData(true);
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");
        var dt = Util.execSQLWithData("select location_code,invoice_no from pur1 where keyfld=" + kfld);
        if (dt.length > 0) {
            var invn = dt[0].INVOICE_NO;
            var loc = dt[0].LOCATION_CODE;
            Util.printServerReport("br/brsale", "_para_pfromno=" +
                invn + "&_para_ptono=" + invn + "&_para_plocation=" + loc);
        }

    },
    createDeliveryPage: function () {

        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.dlvPage);


        var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.dlvPage.removeAllHeaderContent();
        // this.dlvPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        this.qvDlv = new QueryView("qrDlv" + this.timeInLong);
        // this.qv.getControl().addStyleClass("sapUiSizeCondensed");
        this.qvDlv.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowSelector);
        this.qvDlv.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        this.qvDlv.getControl().setAlternateRowColors(true);
        this.qvDlv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        that.qvDlv.getControl().setVisibleRowCount(10);
        that.qvDlv.getControl().setRowHeight(20);
        this.qvDlv.getControl().setFixedBottomRowCount(0);

        this.txtTotalAmount = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");
        this.txtAddAmt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");
        this.txtTotalDlv = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "200px", editable: false }).addStyleClass("largeFont");

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

        this.dlvPage.addContent(this.qvDlv.getControl());
        this.dlvPage.addContent(sc);

        sc.addContent(new sap.m.VBox({ items: [hbl, hbt] }));

        sc.addContent(new sap.m.VBox({ height: "20px" }));

        Util.destroyID("cmdNext2", that.view);
        this.dlvPage.setFooter(new sap.m.Toolbar({
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
        var sodt = that.validatSO();

        var selCust = sodt[0].ORD_REF;
        var selCustName = sodt[0].ORD_REFNM;
        var selBrno = sodt[0].ORD_BRANCHNO;
        var selBrName = sodt[0].BRANCHNAME;
        var selDate = that.txtToDate.getDateValue();

        var refName = selCustName + " - " + selCust;
        var bName = + selBrName + " - " + selBrno;

        this.infoPage.removeAllHeaderContent();
        this.infoPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        var loc = UtilGen.getControlValue(that.txtLocations);
        UtilGen.setControlValue(that.txtInfoLocations, "-", "-", true);
        UtilGen.setControlValue(that.txtInfoLocations, loc, loc, true);
        that.txtInfoLocations.fireSelectionChange();
        var adamt = df.format(parseFloat("0"));
        that.txtInfoRef.setValue(selCust);
        that.txtInfoRefName.setValue(selCustName);
        that.txtInfoBranch.setValue(selBrno);
        that.txtInfoBranchName.setValue(selBrName);
        that.txtInfoDisc.setValue(df.format(0));
        that.txtInfoAdd.setValue(adamt);
        that.txtInfoGross.setValue(that.txtTotalAmount.getValue());
        that.txtInfoAmount.setValue(that.txtTotalAmount.getValue());
        this.txtInfoInvDate.setDateValue(selDate);

        // if ((selBrno + "").replaceAll('"', "").trim() == "") {
        //     var br = Util.getSQLValue("select min(brno) from cbranch where code=" + Util.quoted(selCust));
        //     var brnam = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(selCust) + " and brno=" + br);
        //     that.txtInfoBranch.setValue(br);
        //     that.txtInfoBranchName.setValue(brnam);
        // }
        that.calcInfoAmt(true, true);


    },
    calcInfoAmt: function (pRfresh, pRefreshAdd) {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var rfresh = Util.nvl(pRfresh, false);
        var rfreshAdd = Util.nvl(pRefreshAdd, false);
        if (rfresh) {
            var kfldStr = "";
            var slices = that.qvDlv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
            var slicesof = that.qvDlv.getControl().getBinding("rows").aIndices;
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.nvl(Util.getCellColValue(that.qvDlv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
                kfldStr = kfldStr + (kfldStr.length > 0 ? "," : "") + kfld;
            }
            if (kfldStr.length <= 0)
                FormView.err("No rows selected !");
            var sq = "select nvl(sum(c7_get_so_price(o.pord1_keyfld,o.pord_pos)*(o.tqty/ord_pack)),0) from C_ORDER1 o where o.ord_code=9 and o.keyfld in (:txtKflds)";
            sq = sq.replaceAll(":txtKflds", kfldStr);
            var sum = Util.getSQLValue(sq);
            that.txtInfoGross.setValue(df.format(sum));

            if (rfreshAdd) {
                var sq = "select nvl(sum(c7_get_so_discamtgross(o.pord1_keyfld,o.pord_pos)),0) from C_ORDER1 o where o.ord_code=9 and o.keyfld in (:txtKflds)";
                sq = sq.replaceAll(":txtKflds", kfldStr);
                var sumdisc = Util.getSQLValue(sq);
                that.txtInfoDisc.setValue(df.format(sumdisc));
            }

        }
        var add = Util.extractNumber(that.txtInfoAdd.getValue());
        var disc = Util.extractNumber(that.txtInfoDisc.getValue());
        var gross = Util.extractNumber(that.txtInfoGross.getValue());

        that.txtInfoAmount.setValue(df.format((gross + add) - disc));

    },
    loadData: function () {
        var thatForm = this;
        this.selectedSOKfld = undefined;
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



