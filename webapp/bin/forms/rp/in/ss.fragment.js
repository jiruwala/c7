sap.ui.jsfragment("bin.forms.rp.in.ss", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
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

        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("ssRepTit"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SS001",
                    name: Util.getLangText("ssRep1Name"),
                    descr: Util.getLangText("ssRep1Descr"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    showCustomPara: function (vbPara, rep) {

                    },
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("ssRep1Name");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getPara(),
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
                                            qr.setAutoDispRecords(thatForm.mainPage, /*{ "S": 70, "M": 40, "L": 35, "XL": 50 }*/);
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
                                            return thatForm.helperFunc.addQry(qryObj, ps, "SS001");
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQry(qryObj);
                                            if (qryObj.rep.hideMainMenu)
                                                UtilGen.DBView.autoShowHideMenu(!qryObj.rep.hideMainMenu, thatForm.jp);

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
        getPara: function (repCode) {
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
                strno: {
                    colname: "strno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"storeNo\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "0",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                prefer: {
                    colname: "prefer",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"itemCode\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        showValueHelp: true,
                        change: function (e) {
                            var vl = e.oSource.getValue();
                            thatForm.frm.setFieldValue("SS001@parameter.prefer", vl, vl, false);
                            var vlnm = Util.getSQLValue("select descr from items where reference =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue("SS001@parameter.prefname", vlnm, vlnm, false);
                        },
                        valueHelpRequest: function (event) {
                            UtilGen.Search.do_quick_search(event, this,
                                "select reference code,descr title from items where itprice4=0 order by descr2",
                                "select reference code,descr title from items where reference=:CODE", thatForm.frm.objs["SS001@parameter.prefname"].obj);
                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                prefname: {
                    colname: "prefname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "49%", editable: false },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                },
                levelno: {
                    colname: "levelno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"levelNo\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "0",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                exclzero: {
                    colname: "exclzero",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"exclZero\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { selected: true, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
            };
            return para;
        },
        addQry: function (qryObj, ps, repCode) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var rt = thatForm.frm.getFieldValue("parameter.reptype");
            var str = Util.nvl(thatForm.frm.getFieldValue("parameter.strno"), 0);

            // var inCol = incIn == "Y" ? ", (SELECT MAX(INVOICE_NO) FROM PUR1 WHERE INVOICE_CODE=21 AND JOINED_CORDER.SALEINV) INVOICE_NO  " : "";
            // var inColGrp = incIn == "Y" ? ", (SELECT MAX(INVOICE_NO) FROM PUR1 WHERE INVOICE_CODE=21 AND JOINED_CORDER.SALEINV) INVOICE_NO  " : "";
            var sqe = "begin c7_stock_sum_rep(':user',:store,:fromdate,:todate);end;";
            sqe = sqe.replaceAll(":store", str)
                .replaceAll(":user", sett["LOGON_USER"])
                .replaceAll(":fromdate", Util.toOraDateString(fromdt))
                .replaceAll(":todate", Util.toOraDateString(todt));
            var exDt = Util.execSQL(sqe);
            var sq = "SELECT field1 refer," +
                " field9 descr," +
                " field10 descr2," +
                " field2 packd," +
                // "(case when SUM (TO_NUMBER (field3))!=0 then SUM (TO_NUMBER (field4)) / SUM (TO_NUMBER (field3)) end  ) pkaver," +
                " 0 pkaver ," +
                " TO_NUMBER (field6) pack," +
                " TO_NUMBER (field8) invoice_code," +
                " field7||'__'||'PKQTY' short_name_a," +
                " field7||'__'||'AMT' short_name_b," +
                " field7 short_name," +
                " SUM(TO_NUMBER(field3)) pkqty, " +
                " sum(TO_NUMBER (field4)) amt " +
                // " TO_NUMBER (field5) sal_amt" +
                " FROM   TEMPORARY" +
                " WHERE   idno = 909 " +
                " and usernm='" + sett["LOGON_USER"] + "'" +
                " GROUP BY field1,field9,field10,field2," +
                " to_number(field6),to_number(field8),field7, " +
                "field7||'__'||'PKQTY' " +
                " order by field10,TO_NUMBER (field8)";
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
            var cmdLink = function (obj, rowno, colno, lctb, frm) {
                if (obj == undefined) return;
                var frm = thatForm.frm;
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat("MM/dd/yyyy");

                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var cont = tbl.getContextByIndex(rr);
                var todate = sdf.format(frm.getFieldValue("parameter.todate"));
                var fromdate = frm.getFieldValue("parameter.fromdate" == undefined) ? "01/01/" + todate.substr(6) : sdf.format(frm.getFieldValue("parameter.fromdate"));
                var it = tbl.getRows()[rr].getCells()[0].getText().replaceAll(" ", "%20");

                UtilGen.execCmd("rp.in.st2 formType=dialog formSize=100%,100% repno=0 para_PARAFORM=false para_EXEC_REP=true showCost=Y prefer=" + it + " fromdate=@" + fromdate + " todate=@" + todate, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            }
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
                    var repcolname = "PKQTY";
                    var repcolnamea = "AMT";
                    var qr = thatForm.qr;
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");
                    ld.cols[ld.getColPos("REFER")].mUIHelper.display_width = "50";
                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "275";
                    ld.cols[ld.getColPos("PACKD")].mUIHelper.display_width = "50";
                    ld.cols[ld.getColPos("PACK")].mUIHelper.display_width = "50";

                    ld.cols[ld.getColPos("REFER")].commandLinkClick = thatForm.cmdLink;
                    ld.cols[ld.getColPos("DESCR")].commandLinkClick = thatForm.cmdLink;

                    ld.cols[ld.getColPos("REFER")].ct_row = "Y";
                    ld.cols[ld.getColPos("DESCR")].ct_row = "Y";
                    ld.cols[ld.getColPos("PACKD")].ct_row = "Y";

                    ld.cols[ld.getColPos("PKAVER")].ct_row = "Y";
                    ld.cols[ld.getColPos("PKAVER")].mUIHelper.display_format = "MONEY_FORMAT";

                    ld.cols[ld.getColPos("PACK")].mHideCol = true;
                    ld.cols[ld.getColPos("DESCR2")].mHideCol = true;
                    ld.cols[ld.getColPos("INVOICE_CODE")].mHideCol = true;
                    ld.cols[ld.getColPos("SHORT_NAME")].mHideCol = true;

                    ld.cols[ld.getColPos("SHORT_NAME_A")].ct_col = "Y";
                    ld.cols[ld.getColPos("SHORT_NAME_B")].ct_col = "Y";

                    ld.cols[ld.getColPos(repcolname)].ct_val = "Y";
                    ld.cols[ld.getColPos(repcolname)].mUIHelper.display_format = "QTY_FORMAT";
                    ld.cols[ld.getColPos(repcolname)].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos(repcolnamea)].ct_val = "Y";
                    ld.cols[ld.getColPos(repcolnamea)].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos(repcolnamea)].mUIHelper.display_width = "100";

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();

                    if (ld.cols.length == 0 || ld.rows.length == 0) {
                        sap.m.MessageToast.show("No data found !");
                        qr.reset();
                        return;
                    }
                    for (var ri = 0; ri < ld.rows.length; ri++) {
                        var totq = ld.getFieldValue(ri, "tot__" + repcolname);
                        var totc = ld.getFieldValue(ri, "tot__" + repcolnamea);
                        var pkc = 0;
                        if (totq != 0)
                            pkc = totc / totq;
                        ld.setFieldValue(ri, "PKAVER", pkc);

                    }
                    var dt2 = ld.format();
                    // qr.mLctb.parseCol(dt2);
                    qr.setJsonStrMetaData(dt2);
                    var ld2 = qr.mLctb;
                    var itms = {};
                    var fltcols = ["REFER", "DESCR", "PKAVER", "PACKD", "tot__" + repcolname, "tot__" + repcolnamea];

                    for (var li = 0; li < ld2.cols.length; li++)
                        if (ld2.cols[li].mColName.endsWith("__" + repcolname) ||
                            ld2.cols[li].mColName.endsWith("__" + repcolnamea)) {
                            var repc = (ld2.cols[li].mColName.endsWith("__" + repcolname) ? repcolname : repcolnamea);
                            var cn = ld2.cols[li].mColName.replaceAll("__" + repc, "");

                            ld2.cols[li].mTitleParent = cn;
                            ld2.cols[li].mTitleParentSpan = 2;
                            ld2.cols[li].mTitle = repc == "PKQTY" ? "txtQty" : "txtValue";
                            ld2.cols[li].mUIHelper.display_format = repc == "PKQTY" ? "QTY_FORMAT" : "MONEY_FORMAT";
                            ld2.cols[li].mUIHelper.display_align = repc == "PKQTY" ? "ALIGN_CENTER" : "ALIGN_END";
                            ld2.cols[li].mUIHelper.display_width = repc == "PKQTY" ? "80" : "120";
                            ld2.cols[li].mUIHelper.display_style = "background-color:#ffffe0;";
                            ld2.cols[li].valOnZero = "";
                            ld2.cols[li].mSummary = "SUM";
                            // fltcols.push(ld2.cols[li].mColName);
                        }

                    ld2.cols[ld2.getColPos("REFER")].mSummary = "COUNT_UNIQUE";
                    ld2.cols[ld2.getColPos("REFER")].count_unique_label = "txtCounts";
                    ld2.cols[ld2.getColPos("PKAVER")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld2.cols[ld2.getColPos("PKAVER")].mUIHelper.display_width = "80";
                    ld2.cols[ld2.getColPos("PKAVER")].mTitle = Util.getLangText("avgCost");
                    ld2.cols[ld2.getColPos("PACKD")].mUIHelper.display_width = "100";

                    // ld2.cols[ld2.getColPos("LOCATION_CODE")].mGrouped = true;
                    // ld2.cols[ld2.getColPos("LOCATION_NAME")].mGrouped = true;
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].mTitle = Util.getLangText("totalQty");
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].valOnZero = "";

                    ld2.cols[ld2.getColPos("tot__" + repcolnamea)].mTitle = Util.getLangText("amountTxt");
                    ld2.cols[ld2.getColPos("tot__" + repcolnamea)].valOnZero = "";

                    ld2.cols[ld2.getColPos("REFER")].commandLinkClick = cmdLink;
                    ld2.cols[ld2.getColPos("DESCR")].commandLinkClick = cmdLink;

                    ld2.cols[ld2.getColPos("REFER")].mUIHelper.display_width = "80";
                    ld2.cols[ld2.getColPos("DESCR")].mUIHelper.display_width = "275";
                    ld2.cols[ld2.getColPos("PACKD")].mUIHelper.display_width = "60";


                    thatForm.frm.objs["SS001@qry2"].filterCols = fltcols;
                    qr.showToolbar.filterCols = fltcols;
                    qr.mLctb.parse(dt2, true);
                    qr.loadData();
                    qr.getControl().setFirstVisibleRow(0);
                    qr.getControl().setFixedColumnCount(4);

                }
            });
        },
    }
    ,
    loadData: function () {
    }

});