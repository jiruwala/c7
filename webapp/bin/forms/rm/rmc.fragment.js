SQ = sap.ui.jsfragment("bin.forms.rm.rmc", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        this.timeInLong = (new Date()).getTime();

        this.helperFunc.init(this);
        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        this.jp = this.createView();

        this.loadData();
        this.jp.onWndClose = function () {
            sap.m.MessageToast.show("Closing the report !");
            that.frm.helperFunctions.destoryRV();
        };
        return this.jp;
    },
    createView: function () {
        var that = this;
        var view = this.view;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var fullSpan = "XL8 L8 M8 S12";
        var colSpan = "XL2 L2 M2 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var cmdLink = function (obj, rowno, colno, lctb, frm) {
        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("Item Formula Qty And Costing"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "RMC001", // Items Daily Sales
                    name: Util.getLangText("Item Formula Qty And Costing"),
                    descr: Util.getLangText("Item Formula Qty And Costing"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    // printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("Item Formula Qty And Costing");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("RMC001"),
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.FORM,
                                disp_class: "",
                                dispRecords: -1,
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                isCrossTb: "N",
                                showToolbar: false,
                                masterToolbarInMain: false,
                                filterCols: [],
                                canvasType: ReportView.CanvasType.SCROLLCONTAINER,

                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                fields: {
                                    accno2: {
                                        colname: "accno2",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.SCROLLCONTAINER,
                                        title: '',
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {
                                        },
                                        onPrintField: function () {
                                            return thatForm.qr.getHTMLTable(thatForm.view);
                                        },
                                        afterAddOBject: function () {
                                            thatForm.qr = new QueryView("lstRepTbl" + that.timeInLong);
                                            var qr = thatForm.qr;
                                            qr.getControl().view = thatForm.view;
                                            qr.getControl().addStyleClass("sapUiSizeCondensed reportTable2 ");
                                            qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
                                            qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
                                            qr.getControl().setAlternateRowColors(false);
                                            qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
                                            // var r = UtilGen.dispTblRecsByDevice({ "S": 10, "M": 17, "L": 22, "XL": 30 });
                                            qr.getControl().setVisibleRowCount(10);
                                            qr.setAutoDispRecords(thatForm.mainPage, { "S": 70, "M": 40, "L": 50, "XL": 35 });
                                            qr.getControl().setRowHeight(18);
                                            qr.getControl().attachColumnResize(undefined, function (e) { e.preventDefault(); });
                                            qr.filterCols = [];
                                            qr.createToolbar(qr.disp_class, qr.filterCols,
                                                // EVENT ON APPLY PERSONALIZATION
                                                function (prsn, qv) {
                                                },
                                                // EVENT ON REVERT PERSONALIZATION TO ORIGINAL
                                                function (qv) {
                                                }
                                            );
                                            this.obj.addContent(qr.showToolbar.toolbar);
                                            this.obj.addContent(qr.getControl());


                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            return thatForm.helperFunc.addQry(qryObj, ps, "RMC001");
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQry(qryObj);
                                        }
                                    },
                                }
                            }
                        ]
                    }
                }
            ]
        };

        this.frm = new ReportView(this.mainPage);
        this.frm.parasAsLabels = true;
        return this.frm.createViewMain(this, js);

    },
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getParas: function (repCode) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var that2 = this.thatForm;
            var thatForm = this.thatForm;
            var view = this.thatForm.view;
            var colSpan = "XL2 L2 M2 S12";
            var sumSpan = "XL2 L2 M2 S12";
            var para = {
                fromdate: {
                    colname: "fromdate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"fromDate\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "$FIRSTDATEOFYEAR",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                todate: {
                    colname: "todate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"toDate\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "$TODAY",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
            };

            return para;
        },
        addQry: function (qryObj, ps, repCode) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var addQry = function (sq, rn) {
                Util.doAjaxJson("bat7addQry?" + ps, {
                    sql: sq,
                    ret: "",
                    data: "",
                    repCode: qryObj.rep.code,
                    repNo: qryObj.repNo,
                    command: "",
                    scheduledAt: "",
                    p1: "",
                    p2: "",
                    qrNo: rn,
                }, false).done(function (data) {
                    if (!data.ret == "SUCCESS") {
                        ret = false;
                    }
                });
            }
            var sqitm = "select ord_ship,I.DESCR,sum(O.tqty) totqty from c_order1 o,ITEMS I " +
                " where ord_code=9 AND I.REFERENCE=O.ORD_SHIP " +
                " and ord_date>=:parameter.fromdate and ord_date<=:parameter.todate " +
                " group by ord_ship,I.DESCR ORDER BY ORD_SHIP";

            var sq = "select i.reference,i.descr baseitem,m.refer rfr," +
                " i2.descr||' - '||m.packd refer,sum(m.allqty/m.pack) qty," +
                " i2.descr||' - '||m.packd||'__QTY' REFER_QTY " +
                " from items i, masterasm m,items i2 where m.baseitem=i.reference " +
                " and m.refer=i2.reference " +
                " and baseitem in " +
                " (select distinct ord_ship from c_order1 where ord_date>=:parameter.fromdate and ord_date<=:parameter.todate) " +
                " group by i.reference,i.descr,m.refer,i2.descr||' - '||m.packd, i2.descr || ' - ' || m.packd || '__QTY' " +
                " order by 1,rfr";
            var sqcst = "select i.reference,i.descr baseitem,m.refer rfr," +
                " i2.descr||' - '||m.packd refer,sum((m.allqty/m.pack)*i2.pkaver) cst," +
                " i2.descr||' - '||m.packd||'__CST' REFER_CST " +
                " from items i, masterasm m,items i2 where m.baseitem=i.reference " +
                " and m.refer=i2.reference " +
                " and baseitem in " +
                " (select distinct ord_ship from c_order1 where ord_date>=:parameter.fromdate and ord_date<=:parameter.todate) " +
                " group by i.reference,i.descr,m.refer,i2.descr||' - '||m.packd, i2.descr || ' - ' || m.packd || '__CST' " +
                " order by 1,rfr";
            var sqavg = "select i.reference,i.descr baseitem,m.refer rfr," +
                " i2.descr||' - '||m.packd refer,max(i2.pkaver) avg," +
                " i2.descr||' - '||m.packd||'__AVG' REFER_AVG " +
                " from items i, masterasm m,items i2 where m.baseitem=i.reference " +
                " and m.refer=i2.reference " +
                " and baseitem in " +
                " (select distinct ord_ship from c_order1 where ord_date>=:parameter.fromdate and ord_date<=:parameter.todate) " +
                " group by i.reference,i.descr,m.refer,i2.descr||' - '||m.packd, i2.descr || ' - ' || m.packd || '__AVG' " +
                " order by 1,rfr";
            sq = thatForm.frm.parseString(sq);
            sqitm = thatForm.frm.parseString(sqitm);
            sqcst = thatForm.frm.parseString(sqcst);
            sqavg = thatForm.frm.parseString(sqavg);
            addQry(sqitm, 1000);
            addQry(sq, 1001);
            addQry(sqcst, 1002);
            addQry(sqavg, 1003);
            return true;
        },
        getQry: function (qryObj) {
            var thatForm = this.thatForm;
            var that = this;
            var sett = sap.ui.getCore().getModel("settings").getData();
            that.ld = undefined;
            var getQryData = function (qn) {
                var dat = undefined;
                Util.doAjaxJson("bat7getData", {
                    sql: "",
                    ret: "",
                    data: "",
                    repCode: qryObj.rep.code,
                    repNo: qryObj.repNo,
                    command: "",
                    scheduledAt: "",
                    p1: "",
                    p2: "",
                    qrNo: qn,
                }, false).done(function (dt) {
                    if (dt.ret == "SUCCESS")
                        dat = dt;

                });
                return dat;
            };
            var doCrossTabLd = function (ld, typ, dtx) {
                ld.parseCol("{" + dtx.data + "}");
                ld.cols[ld.getColPos("BASEITEM")].ct_row = "Y";
                ld.cols[ld.getColPos("REFERENCE")].ct_row = "Y";
                ld.cols[ld.getColPos("BASEITEM")].mUIHelper.display_width = "100";
                ld.cols[ld.getColPos("REFER_" + typ)].ct_col = "Y";
                ld.cols[ld.getColPos(typ)].ct_val = "Y";
                ld.parse("{" + dtx.data + "}", true);
                ld.do_cross_tab();
            };
            var addItmQtyCols = function () {
                var lngthSpan = 0;
                for (var i = 0; i < ldCst.cols.length; i++)
                    if (ldCst.cols[i].ct_val == "Y" && ldCst.cols[i].mColName != "tot__CST")
                        lngthSpan++;
                for (var i = 0; i < ld.cols.length; i++) {
                    if (ld.cols[i].ct_val == "Y" && ld.cols[i].mColName != "tot__QTY") {
                        var cx = ldItm.addColumn(ld.cols[i].mColName);
                        cx.mTitle = ld.cols[i].mTitle;
                        cx.mTitleParent = "Qty";
                        cx.ct_val = "Y";
                        cx.mTitleParentSpan = lngthSpan;
                        cx.data_type = "number";
                        cx.mUIHelper.display_width = 80;
                        cx.mSummary = "SUM";
                        cx.mUIHelper.display_format = "QTY_FORMAT";
                        cx.mUIHelper.display_align = "ALIGN_CENTER";
                        // ldItm.cols.push(cx);
                    }
                }
            }
            var addItmCostCols = function () {
                var lngthSpan = 0;
                for (var i = 0; i < ldCst.cols.length; i++)
                    if (ldCst.cols[i].ct_val == "Y" && ldCst.cols[i].mColName != "tot__CST")
                        lngthSpan++;
                for (var i = 0; i < ldCst.cols.length; i++) {
                    if (ldCst.cols[i].ct_val == "Y" && ldCst.cols[i].mColName != "tot__CST") {
                        var cx = ldItm.addColumn(ldCst.cols[i].mColName);
                        cx.mTitle = ldCst.cols[i].mTitle;
                        cx.mTitleParent = "Cost Value";
                        cx.ct_val = "Y";
                        cx.mTitleParentSpan = lngthSpan;
                        cx.data_type = "number";
                        cx.mSummary = "SUM";
                        cx.mUIHelper.display_width = 90;
                        cx.mUIHelper.display_format = "MONEY_FORMAT";
                        cx.mUIHelper.display_align = "ALIGN_END";
                        cx.mUIHelper.display_style = "background-color:lightgrey;"
                        // ldItm.cols.push(cx);
                    }
                }
            }
            var addItmAvgCols = function () {
                var lngthSpan = 0;
                for (var i = 0; i < ldAvg.cols.length; i++)
                    if (ldAvg.cols[i].ct_val == "Y" && ldAvg.cols[i].mColName != "tot__AVG")
                        lngthSpan++;
                for (var i = 0; i < ldAvg.cols.length; i++) {
                    if (ldAvg.cols[i].ct_val == "Y" && ldAvg.cols[i].mColName != "tot__AVG") {
                        var cx = ldItm.addColumn(ldAvg.cols[i].mColName);
                        cx.mTitle = ldAvg.cols[i].mTitle;
                        cx.mTitleParent = "Average Cost";
                        cx.ct_val = "Y";
                        cx.mTitleParentSpan = lngthSpan;
                        cx.data_type = "number";
                        cx.mUIHelper.display_width = 90;
                        // cx.mUIHelper.display_format = "MONEY_FORMAT";
                        cx.mUIHelper.display_align = "ALIGN_END";
                        cx.mUIHelper.display_style = "background-color:khaki;"
                        // ldItm.cols.push(cx);
                    }
                }
            }
            var setItmQtytVals = function () {
                for (var i = 0; i < ldCst.rows.length; i++) {
                    var rf = ldCst.getFieldValue(i, "REFERENCE");
                    var itmrec = ldItm.find("ORD_SHIP", rf);
                    if (itmrec >= 0) {
                        for (var j = 0; j < ldCst.cols.length; j++)
                            if (ldCst.cols[j].ct_val == "Y" && ldCst.cols[j].mColName != "tot__CST") {
                                var vl = ldCst.getFieldValue(i, ldCst.cols[j].mColName);
                                if (vl != undefined && vl > 0) {
                                    var qrx = ldItm.getFieldValue(itmrec, "TOTQTY") * vl;
                                    ldItm.setFieldValue(itmrec, ldCst.cols[j].mColName, qrx);
                                }
                            }
                    }
                }
            };
            var setItmCosttVals = function () {
                for (var i = 0; i < ld.rows.length; i++) {
                    var rf = ld.getFieldValue(i, "REFERENCE");
                    var itmrec = ldItm.find("ORD_SHIP", rf);
                    if (itmrec >= 0) {
                        for (var j = 0; j < ld.cols.length; j++)
                            if (ld.cols[j].ct_val == "Y" && ld.cols[j].mColName != "tot__CST") {
                                var vl = ld.getFieldValue(i, ld.cols[j].mColName);
                                if (vl != undefined && vl > 0) {
                                    var qrx = ldItm.getFieldValue(itmrec, "TOTQTY") * vl;
                                    ldItm.setFieldValue(itmrec, ld.cols[j].mColName, qrx);
                                }
                            }
                    }
                }
            };
            var setItmAvgtVals = function () {
                for (var i = 0; i < ldAvg.rows.length; i++) {
                    var rf = ldAvg.getFieldValue(i, "REFERENCE");
                    var itmrec = ldItm.find("ORD_SHIP", rf);
                    if (itmrec >= 0) {
                        for (var j = 0; j < ldAvg.cols.length; j++)
                            if (ldAvg.cols[j].ct_val == "Y" && ldAvg.cols[j].mColName != "tot__AVG") {
                                var vl = ldAvg.getFieldValue(i, ldAvg.cols[j].mColName);
                                if (vl != undefined && vl > 0) {
                                    var qrx = vl;
                                    ldItm.setFieldValue(itmrec, ldAvg.cols[j].mColName, qrx);
                                }
                            }
                    }
                }
            };
            var deleteEmptyCols = function () {
                var chkCol = function (colname) {
                    var empt = true;
                    for (var j = 0; j < ldItm.rows.length; j++) {
                        var vl = ldItm.getFieldValue(j, colname);
                        if (Util.nvl(vl, 0) != 0)
                            return false;
                    }
                    return true;
                }
                for (var i = ldItm.cols.length - 1; i >= 0; i--) {
                    if (ldItm.cols[i].ct_val == "Y") {
                        if (chkCol(ldItm.cols[i].mColName))
                            ldItm.deleteCol(i);
                    }

                }
            }

            var dt = getQryData(1001);
            var dtCst = getQryData(1002);
            var dtItm = getQryData(1000);
            var dtAvg = getQryData(1003);





            if (dtItm == undefined) return;

            var qr = thatForm.qr;


            var ld = new LocalTableData();
            var ldCst = new LocalTableData();
            var ldAvg = new LocalTableData();

            doCrossTabLd(ld, "QTY", dt);
            doCrossTabLd(ldCst, "CST", dtCst);
            doCrossTabLd(ldAvg, "AVG", dtAvg);

            var ldItm = qr.mLctb;

            ldItm.parseCol("{" + dtItm.data + "}");
            addItmQtyCols();
            addItmCostCols();
            addItmAvgCols();
            ldItm.cols[ldItm.getColPos("TOTQTY")].mSummary = "SUM";
            ldItm.cols[ldItm.getColPos("ORD_SHIP")].mTitle = "Item";
            ldItm.cols[ldItm.getColPos("TOTQTY")].mTitle = "M3 qty";
            ldItm.cols[ldItm.getColPos("ORD_SHIP")].mSummary = "COUNT_UNIQUE";
            ldItm.cols[ldItm.getColPos("ORD_SHIP")].count_unique_label = "Items";
            ldItm.cols[ldItm.getColPos("TOTQTY")].mUIHelper.display_width = "100";

            ldItm.parse("{" + dtItm.data + "}", true);

            if (ldItm.cols.length == 0 || ldItm.rows.length == 0) {
                sap.m.MessageToast.show("No data found !");
                qr.reset();
                return;
            }



            setItmQtytVals();
            setItmCosttVals();
            setItmAvgtVals();
            // deleteEmptyCols();
            qr.loadData();

            qr.getControl().setFirstVisibleRow(0);
            qr.getControl().setFixedColumnCount(3);

        },

    },
    loadData: function () {
    }

});