sap.ui.jsfragment("bin.forms.rp.in.st2", {
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
        var repCodeStk1 = "ST001";
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
            title: Util.getLangText("stkCardRepTit"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: repCodeStk1,
                    name: Util.getLangText("stkCardRep1"),
                    descr: Util.getLangText("stkCardRep1Descr"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("stkCardRep1");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;
                    },
                    showCustomPara: function (vbPara, rep) {
                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas1(repCodeStk1),
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry1",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: { "S": 7, "M": 11, "L": 15, "XL": 18 },
                                execOnShow: false,
                                showToolbar: true,
                                canvas: "qryMCanvas",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                isMaster: false,
                                masterToolbarInMain: false,
                                dml: "select 0 bal from dual",
                                fields: thatForm.helperFunc.getHeadFields(repCodeStk1)
                            },
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                dispRecords: { "S": 7, "M": 11, "L": 15, "XL": 18 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: [],
                                canvasType: ReportView.CanvasType.VBOX,
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                },
                                eventCalc: function (qv, cx, rowno, reAmt) {
                                    var sett = sap.ui.getCore().getModel("settings").getData();
                                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                                    if (rowno >= 0) return;
                                    var bal = 0;
                                    var bfBal = 0, totin = 0, totout = 0;
                                    thatForm.frm.setFieldValue("ST001@qry1.bfBal", bfBal, bfBal, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.totIn", totin, totin, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.totOut", totout, totout, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.bal", bal, bal, true);
                                    if (qv.mLctb.rows.length == 0) return;
                                    var pkd = qv.mLctb.getFieldValue(0, "PACKD");
                                    var ud = qv.mLctb.getFieldValue(0, "UNITD");
                                    for (var i = 0; i < qv.mLctb.rows.length; i++) {
                                        var pk = qv.mLctb.getFieldValue(i, "PACK");
                                        var qi = qv.mLctb.getFieldValue(i, "QTYIN");
                                        var qo = qv.mLctb.getFieldValue(i, "QTYOUT");
                                        var kf = qv.mLctb.getFieldValue(i, "KEYFLD");
                                        bal += (qi - qo) != 0 ? (qi - qo) : 0;

                                        qv.mLctb.setFieldValue(i, "BALANCE", bal);
                                        if (kf == -1)
                                            bfBal = (qi - qo) != 0 ? (qi - qo) : 0;

                                        totin += qi;
                                        totout += qo;

                                    }

                                    var pk = qv.mLctb.getFieldValue(0, "PACK");
                                    totin = totin != 0 ? (totin) : 0;
                                    totout = totout != 0 ? (totout) : 0;
                                    pkd = pkd + (pk > 1 ? " (" + ud + "x" + pk + ")" : "");
                                    var itm = thatForm.frm.getFieldValue("parameter.prefer") + "-" + thatForm.frm.getFieldValue("parameter.prefname");
                                    thatForm.frm.setFieldValue("ST001@qry1.bal", ((totin - totout) + " " + pkd), ((totin - totout) + " " + pkd), true);
                                    thatForm.frm.setFieldValue("ST001@qry1.item", itm, itm, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.bfBal", bfBal, bfBal, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.totIn", totin, totin, true);
                                    thatForm.frm.setFieldValue("ST001@qry1.totOut", totout, totout, true);
                                    thatForm.frm.setFieldValue("ST001@qry3.tit1", " pack = " + pkd, " pack = " + pkd, true);

                                    var cl = thatForm.calcAge(thatForm.frm.getFieldValue("parameter.todate"), qv.mLctb, {
                                        colDebit: "QTYIN",
                                        colCredit: "QTYOUT",
                                        colDate: "INVOICE_DATE"
                                    });

                                    thatForm.frm.setFieldValue("ST001@qry3.b30", cl.b30, cl.b30, true);
                                    thatForm.frm.setFieldValue("ST001@qry3.b60", cl.b60, cl.b60, true);
                                    thatForm.frm.setFieldValue("ST001@qry3.b90", cl.b90, cl.b90, true);
                                    thatForm.frm.setFieldValue("ST001@qry3.b120", cl.b120, cl.b120, true);
                                    thatForm.frm.setFieldValue("ST001@qry3.b150", cl.b150, cl.b150, true);

                                },
                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                beforeLoadQry: function (sql) {
                                    return thatForm.helperFunc.getQry1(repCodeStk1);
                                },
                                afterApplyCols: function (qryObj) {
                                    if (qryObj.name == "qry2") {
                                        var showCost = thatForm.frm.getFieldValue("parameter.showCost");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("AVGCOST")].mHideCol = (showCost != "Y");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("TOTCOST")].mHideCol = (showCost != "Y");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("COSTPRICE")].mHideCol = (showCost != "Y");
                                    }
                                },
                                fields: thatForm.helperFunc.getField1(repCodeStk1)
                            },
                            {
                                type: "query",
                                name: "qry3",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                execOnShow: false,
                                showToolbar: true,
                                canvas: "qryMCanvas3",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                cavasSett: {
                                    width: "700px",
                                    cssText: [
                                        "padding-left:50px;" +
                                        "padding-top:20px;" +
                                        "border-style: inset;" +
                                        "margin-left: 10%;" +
                                        "margin-right: 10%;" +
                                        "border-radius:25px;" +
                                        "background-color:#dcdcdc;"
                                    ]
                                },
                                isMaster: false,
                                masterToolbarInMain: false,
                                dml: "select 0 bal from dual",
                                fields: thatForm.helperFunc.getFields3()
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
        getParas1: function (repCode) {
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
                    default_value: "$FIRSTDATEOFMONTH",
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.prefer", vl, vl, false);
                            var vlnm = Util.getSQLValue("select descr from items where reference =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.prefname", vlnm, vlnm, false);
                        },
                        valueHelpRequest: function (event) {
                            UtilGen.Search.do_quick_search(event, this,
                                "select reference code,descr title from items where itprice4=0 order by path",
                                "select reference code,descr title from items where reference=:CODE", thatForm.frm.objs[repCode + "@parameter.prefname"].obj);
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
                store: {
                    colname: "store",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtStore\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "0",
                    other_settings: { width: "35%", editable: true, value: "0" },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                },
                showCost: {
                    colname: "showCost",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"chkShowCost\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { selected: false, width: "10%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
            };
            return para;
        },
        getHeadFields: function (repCode) {
            var colSpan = "";
            var sett = sap.ui.getCore().getModel("settings").getData();
            var thatForm = this.thatForm;
            var flds = {
                item: {
                    colname: "item",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '{\"text\":\"itemTxt\",\"width\":\"15%\","textAlign":"End","styleClass":"boldText paddingBottom10px"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "boldText paddingBottom10px",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "50%",
                        editable: false
                    },
                },

                txtBfBal: {
                    colname: "txtBfBal",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '{\"text\":\"B/F\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "QTY_FORMAT",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtTotIn: {
                    colname: "txtTotIn",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"txtTotIn\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: sett["FORMAT_QTY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtTotOut: {
                    colname: "txtTotOut",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"txtTotOut\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: sett["FORMAT_QTY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtBal: {
                    colname: "txtBal",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"balanceTxt\",\"width\":\"20%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                bfBal: {
                    colname: "bfBal",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"\",\"width\":\"5%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "20%",
                        editable: false
                    },
                },
                totIn: {
                    colname: "totIn",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_QTY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "20%",
                        editable: false
                    },
                },
                totOut: {
                    colname: "totOut",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_QTY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "20%",
                        editable: false
                    },
                },
                bal: {
                    colname: "bal",
                    data_type: FormView.DataType.Number,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "redText",
                    display_format: sett["FORMAT_QTY_1"],
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "24%",
                        editable: false
                    },
                },
            };
            return flds;
        },

        getField1: function (repCode) {
            var colSpan = "XL2 L2 M2 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();
            var that2 = this.thatForm;
            var thatForm = this.thatForm;
            var view = this.thatForm.view;
            var cmdLink = undefined;
            var cmdLinkPo = function (obj, rowno, colno, lctb, frm) {
                if (obj == undefined) return;
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat("MM/dd/yyyy");

                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var cont = tbl.getContextByIndex(rr);
                var todate = sdf.format(frm.getFieldValue("parameter.todate"));
                var fromdate = frm.getFieldValue("parameter.fromdate" == undefined) ? "01/01/" + todate.substr(6) : sdf.format(frm.getFieldValue("parameter.fromdate"));

                var gkfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "GR_KEYFLD")].getText());
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "PO_KEYFLD")].getText());
                var jvpos = parseInt(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "PO_POSNO")].getText());
                var typd = (tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "INVOICE_CODE")].getText());
                // if (Util.nvl(gkfld, "") != "") FormView.err("Click on delivery to check transaction !");
                if (Util.nvl(kfld, "") != "" && (typd == 21 || typd == "21"))
                    UtilGen.execCmd("bin.forms.sl.so formType=page readonly=true keyfld=" + kfld, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            };
            var cmdLinkGo = function (obj, rowno, colno, lctb, frm) {
                if (obj == undefined) return;
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat("MM/dd/yyyy");

                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var cont = tbl.getContextByIndex(rr);
                var todate = sdf.format(frm.getFieldValue("parameter.todate"));
                var fromdate = frm.getFieldValue("parameter.fromdate" == undefined) ? "01/01/" + todate.substr(6) : sdf.format(frm.getFieldValue("parameter.fromdate"));

                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "GR_KEYFLD")].getText());
                // var jvpos = parseInt(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "GO_POSNO")].getText());
                var typd = (tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "INVOICE_CODE")].getText());
                if (Util.nvl(kfld, "") != "" && (typd == 21 || typd == "21"))
                    UtilGen.execCmd("bin.forms.sl.sodlv formType=page readonly=true keyfld=" + kfld, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            };
            var flds = {
                invoice_date: {
                    colname: "invoice_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "transDate",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "SHORT_DATE_FORMAT",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                type_name: {
                    colname: "type_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "transType",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "font-size:11px;",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                invoice_no: {
                    colname: "invoice_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "noTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "80",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                pord_no: {
                    colname: "pord_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtPoSO",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "80",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLinkPo
                },
                gord_no: {
                    colname: "gord_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtDlvNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "80",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLinkGo
                },
                qtyin: {
                    colname: "qtyin",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "qtyIn",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: UtilGen.DBView.style_debit_numbers + ";",
                    display_format: "QTY_FORMAT",
                    default_value: "",
                    summary: "SUM",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                qtyout: {
                    colname: "qtyout",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "qtyOut",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: UtilGen.DBView.style_credit_numbers + ";",
                    display_format: "QTY_FORMAT",
                    summary: "SUM",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                totqty: {
                    colname: "totqty",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "balanceTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "QTY_FORMAT",
                    default_value: "",
                    summary: "LAST",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                packd: {
                    colname: "itpackd",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemPackD",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                avgcost: {
                    colname: "avgcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtAvgCost1",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "#,##0.00000",
                    default_value: "",
                    summary: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                totcost: {
                    colname: "totcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "totalCost",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    summary: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                costprice: {
                    colname: "costprice",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCostPrice",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    summary: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                strno: {
                    colname: "strno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "storeNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    summary: "LAST",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                reference: {
                    colname: "reference",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemCode",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                descr: {
                    colname: "descr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "descrTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "150",
                    display_align: "ALIGN_LEFT",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                inv_ref: {
                    colname: "inv_ref",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refCode",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                inv_refnm: {
                    colname: "inv_refnm",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "150",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                keyfld: {
                    colname: "keyfld",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                po_keyfld: {
                    colname: "po_keyfld",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                po_posno: {
                    colname: "po_posno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                po_keyfld: {
                    colname: "po_keyfld",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                gr_keyfld: {
                    colname: "gr_keyfld",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                invoice_code: {
                    colname: "invoice_code",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "refName",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
            };
            return flds;
        },
        getFields3: function () {
            var colSpan = "XL2 L2 M2 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();
            var that2 = this.thatForm;
            var thatForm = this.thatForm;
            var view = this.thatForm.view;
            var cmdLink = undefined;
            return {
                tit1: {
                    colname: "tit1",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '{\"text\":\"stockAgeingTxt\",\"width\":\"25%\","textAlign":"Begin","styleClass":"boldText paddingBottom10px"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "boldText paddingBottom10px",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "25%",
                        editable: false
                    }
                },
                txtB30: {
                    colname: "txtB30",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '{\"text\":\"b30Txt\",\"width\":\"19%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtB60: {
                    colname: "txtB60",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"b60Txt\",\"width\":\"19%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtB90: {
                    colname: "txtB90",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"b90Txt\",\"width\":\"19%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtB120: {
                    colname: "txtB120",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"b120Txt\",\"width\":\"19%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                txtB150: {
                    colname: "txtB150",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.LABEL,
                    title: '@{\"text\":\"b150Txt\",\"width\":\"19%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "1%",
                        editable: false
                    },
                },
                b30: {
                    colname: "b30",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"\",\"width\":\"5%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "19%",
                        editable: false
                    },
                },
                b60: {
                    colname: "b60",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "19%",
                        editable: false
                    },
                },
                b90: {
                    colname: "b90",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "19%",
                        editable: false
                    },
                },
                b120: {
                    colname: "b120",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "19%",
                        editable: false
                    },
                },
                b150: {
                    colname: "b150",
                    data_type: FormView.DataType.String,
                    class_name: ReportView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    onPrintField: function () {
                        return this.obj.$().outerHTML();
                    },
                    other_settings: {
                        width: "19%",
                        editable: false
                    },
                },
            };
        },
        getQry1: function (repCode) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            this.saveStk1();
            var sq = "select *from c7_stockcard where usernm='" + sett["LOGON_USER"] + "' order by posx";
            return sq;
        },
        saveStk1: function (repCode) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            // var bk = UtilGen.getBackYears(fromdt, todt);

            var str = thatForm.frm.getFieldValue("parameter.store");
            var rfr = thatForm.frm.getFieldValue("parameter.prefer");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var sq = "begin c7_exe_stkc(:str,':refer',:fromdate,:todate,':user');end;"
            sq = sq.replaceAll(":str", str)
                .replaceAll(":refer", rfr)
                .replaceAll(":fromdate", Util.toOraDateString(fromdt))
                .replaceAll(":todate", Util.toOraDateString(todt))
                .replaceAll(":user", sett["LOGON_USER"])
                ;
            var dt = Util.execSQL(sq);

        }
    },
    calcAge: function (currDate, ld, sett) {
        var b150, b120, b90, b60, b30 = 0;
        if (ld.rows.length == 0) return;
        var totdebit = 0, totcredit = 0, balance = 0;
        var getBal = function () {
            var tot = 0;
            for (var i = 0; i < ld.rows.length; i++) {
                tot += (ld.getFieldValue(i, sett.colDebit) - ld.getFieldValue(i, sett.colCredit));
                if (sett.colDebit != sett.colCredit) {
                    totdebit += ld.getFieldValue(i, sett.colDebit);
                    totcredit += ld.getFieldValue(i, sett.colCredit);
                } else {
                    if (ld.getFieldValue(i, sett.colDebit) > 0)
                        totdebit += ld.getFieldValue(i, sett.colDebit);
                    else
                        totcredit += Math.abs(ld.getFieldValue(i, sett.colCredit));
                }

            }
            balance = tot;
            return tot;
        };
        var getDebitByDate = function (fromdt, todt) {
            var dr = 0;
            for (var i = 0; i < ld.rows.length; i++) {
                var dt = new Date(ld.getFieldValue(i, sett.colDate));
                if ((fromdt == undefined || dt.setHours(0, 0, 0, 0) >= fromdt.setHours(0, 0, 0, 0)) && dt.setHours(0, 0, 0, 0) <= todt.setHours(0, 0, 0, 0))
                    if (sett.colDebit == sett.colCredit)
                        dr += (ld.getFieldValue(i, sett.colDebit) > 0 ? ld.getFieldValue(i, sett.colDebit) : 0);
                    else
                        dr += ld.getFieldValue(i, sett.colDebit);

            }
            return dr;
        };
        var getCreditByDate = function (fromdt, todt) {
            var cr = 0;
            for (var i = 0; i < ld.rows.length; i++) {
                var dt = new Date(ld.getFieldValue(i, sett.colDate));
                if ((fromdt == undefined || dt.setHours(0, 0, 0, 0) >= fromdt.setHours(0, 0, 0, 0)) && dt.setHours(0, 0, 0, 0) <= todt.setHours(0, 0, 0, 0))
                    if (sett.colDebit == sett.colCredit)
                        cr += (ld.getFieldValue(i, sett.colCredit) < 0 ? Math.abs(ld.getFieldValue(i, sett.colCredit)) : 0);
                    else
                        cr += ld.getFieldValue(i, sett.colCredit);

            }
            return cr;
        }
        balance = getBal();
        b150 = getDebitByDate(undefined, Util.addDaysFromDate(currDate, -121));
        if (b150 - totcredit < 0 && totcredit > 0) {
            totcredit = totcredit - b150;
            b150 = 0;
        } else {
            b150 = b150 - totcredit;
            totcredit = 0;
        }

        b120 = getDebitByDate(Util.addDaysFromDate(currDate, -120), Util.addDaysFromDate(currDate, -91));
        if (b120 - totcredit < 0 && totcredit > 0) {
            totcredit = totcredit - b120;
            b120 = 0;
        } else {
            b120 = b120 - totcredit;
            totcredit = 0;
        }

        b90 = getDebitByDate(Util.addDaysFromDate(currDate, -90), Util.addDaysFromDate(currDate, -61));
        if (b90 - totcredit < 0 && totcredit > 0) {
            totcredit = totcredit - b90;
            b90 = 0;
        } else {
            b90 = b90 - totcredit;
            totcredit = 0;
        }

        b60 = getDebitByDate(Util.addDaysFromDate(currDate, -60), Util.addDaysFromDate(currDate, -31));
        if (b60 - totcredit < 0 && totcredit > 0) {
            totcredit = totcredit - b60;
            b60 = 0;
        } else {
            b60 = b60 - totcredit;
            totcredit = 0;
        }

        b30 = getDebitByDate(Util.addDaysFromDate(currDate, -30), currDate);
        if (b30 - totcredit < 0 && totcredit > 0) {
            totcredit = totcredit - b30;
            b30 = 0;
        } else {
            b30 = b30 - totcredit;
            totcredit = 0;
        }

        return {
            "b150": b150,
            "b120": b120,
            "b90": b90,
            "b60": b60,
            "b30": b30
        };
    },
    loadData: function () {
    }

});