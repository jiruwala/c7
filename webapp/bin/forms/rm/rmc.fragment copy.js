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
            title: Util.getLangText("nameCustBranchSales"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "RMC001", // Items Daily Sales
                    name: Util.getLangText("nameItemsFormulaCosting"),
                    descr: Util.getLangText("nameItemsFormulaCosting"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    // printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("nameItemsFormulaCosting");
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
            var rt = thatForm.frm.getFieldValue("parameter.reptype");
            var incIn = thatForm.frm.getFieldValue("parameter.incInvoiceNo");
            var sq = "select i.reference,i.descr baseitem,m.refer rfr,"+
                " i2.descr||' - '||m.packd refer,sum(m.allqty/m.pack) qty," +                
                " i2.descr||' - '||m.packd||'__QTY' REFER_QTY " +
                " from items i, masterasm m,items i2 where m.baseitem=i.reference " +
                " and m.refer=i2.reference " +
                " group by i.reference,i.descr,m.refer,i2.descr||' - '||m.packd, i2.descr || ' - ' || m.packd || '__QTY' " +
                " order by 1,rfr";
            sq = thatForm.frm.parseString(sq);
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
                qrNo: 1001,
            }, false).done(function (data) {
                if (!data.ret == "SUCCESS") {
                    ret = false;
                }
            });
            return true;
        },
        getQry: function (qryObj) {
            var thatForm = this.thatForm;
            var that = this;
            var sett = sap.ui.getCore().getModel("settings").getData();
            that.ld = undefined;
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
                qrNo: 1001,
            }, false).done(function (dt) {
                if (dt.ret == "SUCCESS" && thatForm.qr != undefined) {
                    // var paras = {
                    //     mColParent: "PARENTACC",
                    //     mColCode: "CODE",
                    //     mColName: "NAME",
                    //     mColLevel: "LEVELNO",
                    //     mColChild: "CHILDCOUNT"
                    // };
                    var qr = thatForm.qr;
                    var ld = new LocalTableData();
                    var repcolname = "QTY";
                    ld.parseCol("{" + dt.data + "}");
                    ld.cols[ld.getColPos("BASEITEM")].ct_row = "Y";
                    // ld.cols[ld.getColPos("ORD_DATE")].ct_row = "Y";
                    ld.cols[ld.getColPos("REFERENCE")].mHideCol = true;

                    ld.cols[ld.getColPos("BASEITEM")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("REFER_QTY")].ct_col = "Y";

                    ld.cols[ld.getColPos(repcolname)].ct_val = "Y";
                    ld.cols[ld.getColPos(repcolname)].mUIHelper.display_format = "QTY_FORMAT";

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();
                    if (ld.cols.length == 0 || ld.rows.length == 0) {
                        sap.m.MessageToast.show("No data found !");
                        qr.reset();
                        return;
                    }

                    var dt2 = ld.format();
                    // qr.mLctb.parseCol(dt2);
                    qr.setJsonStrMetaData(dt2);
                    var ld2 = qr.mLctb;
                    // var itms = {};
                    // var ditm = Util.execSQLWithData("select reference,descr from items order by reference");
                    // for (var di in ditm)
                    //     itms[ditm[di].REFERENCE] = ditm[di].DESCR;
                    var fltcols = ["BASEITEM", "tot__" + repcolname];

                    for (var li = 0; li < ld2.cols.length; li++)
                        if (ld2.cols[li].mColName.endsWith("__" + repcolname)) {
                            var cn = ld2.cols[li].mColName.replaceAll("__" + repcolname, "");
                            ld2.cols[li].mTitle = cn;
                            ld2.cols[li].mUIHelper.display_format = "QTY_FORMAT";
                            ld2.cols[li].mUIHelper.display_align = "ALIGN_CENTER";
                            ld2.cols[li].mUIHelper.display_width = "100";
                            ld2.cols[li].valOnZero = "";
                            ld2.cols[li].mSummary = "SUM";
                            fltcols.push(ld2.cols[li].mColName);
                        }
                    ld2.cols[ld2.getColPos("BASEITEM")].mSummary = "COUNT_UNIQUE";
                    ld2.cols[ld2.getColPos("BASEITEM")].count_unique_label = "txtCountCust";

                    ld2.cols[ld2.getColPos("tot__" + repcolname)].mTitle = Util.getLangText("totalQty");
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].valOnZero = "";
                    thatForm.frm.objs["RMC001@qry2"].filterCols = fltcols;
                    qr.showToolbar.filterCols = fltcols;
                    qr.mLctb.parse(dt2, true);
                    qr.loadData();
                    qr.getControl().setFirstVisibleRow(0);
                    qr.getControl().setFixedColumnCount(1);

                }
            });
        },

    },
    loadData: function () {
    }

});