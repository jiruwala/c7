sap.ui.jsfragment("bin.forms.br.rep.rpDrivers", {
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
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("titDriverTrips"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "RPDRIVER1",
                    name: Util.getLangText("titDriverTrips"),
                    descr: Util.getLangText("titDriverTrips"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titDriverTrips");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("RPDRIVER1"),
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                dispRecords: { "S": 7, "M": 14, "L": 15, "XL": 18 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["ORD_REFNM", "ITEM_DESCR", "ORD_DATE", "BRANCH_NAME", "AMOUNT", "TOTALQTY", "PACKD_X", "DRIVER_NAME", "TEL", "TRUCKNO", "INVOICE_NO"],
                                canvasType: ReportView.CanvasType.VBOX,
                                eventAfterQV: function (qryObj) {
                                    // var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                    // if (iq != "none")
                                    qryObj.obj.showToolbar.showGroupFilter = true;//!(iq == "1");

                                },
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    var oModel = this.getControl().getModel();
                                    var pk = (oModel.getProperty("SALEINV", currentRowContext));
                                    if (Util.nvl(pk, "") != "") {
                                        qv.getControl().getRows()[dispRow].getCells()[0].$().css("cssText", "background-color:yellow;text-align:center;");
                                        qv.getControl().getRows()[dispRow].getCells()[0].$().parent().parent().css("cssText", "background-color:yellow;text-align:center;");
                                    }
                                },
                                onPrintRenderAdd: function (ld, idx, col) {
                                    if (idx >= ld.rows.length) return "";
                                    var pk = Util.nvl(ld.getFieldValue(idx, "SALEINV"), "");
                                    if (pk != "" && col.mColName == "ORD_DATE")
                                        return "background-color:yellow;";
                                    return;

                                },
                                bat7CustomAddQry: function (qryObj, ps) {
                                },
                                beforeLoadQry: function (sql) {
                                    var oy = thatForm.frm.getFieldValue("RPDRIVER1@parameter.showTruck");
                                    var tr = oy == "Y" ? ",NVL(JOINED_CORDER.payterm,vehicleno) vehicleno, haddr ,JOINED_CORDER.location_name" : "";
                                    var tr1 = oy == "Y" ? ",NVL(JOINED_CORDER.payterm,vehicleno), haddr,JOINED_CORDER.location_name " : "";
                                    var sq = "SELECT " +
                                        " SUM(qty_x/pack_x) TOTALQTY,SUM(((price_x)/pack_x)*(qty_x*pack_x)) AMOUNT," +
                                        " count(*) counts,ord_empno,driver_name " + tr +
                                        " FROM " +
                                        " JOINED_CORDER,PUR1 INVOICE1 " +
                                        " WHERE ( ORD_CODE=9 " +
                                        " AND SALEINV=INVOICE1.KEYFLD (+) " +
                                        " AND ORD_DATE>=:parameter.fromdate " +
                                        " AND ORD_DATE<=:parameter.todate  " +
                                        "  )" +
                                        " AND (ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL)" +
                                        " AND (JOINED_CORDER.location_code=':parameter.ploc' or NVL(':parameter.ploc','ALL') ='ALL') " +
                                        " GROUP BY ord_empno," +
                                        " DRIVER_NAME" + tr1 +
                                        " ORDER BY ord_empno ";
                                    return thatForm.frm.parseString(sq);
                                },
                                afterApplyCols: function (qryObj) {
                                    if (qryObj.name == "qry2") {
                                        var iq = thatForm.frm.getFieldValue("parameter.showTruck");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("DRIVER_NAME")].mGrouped = iq == "Y";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ORD_EMPNO")].mGrouped = iq == "Y";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("VEHICLENO")].mHideCol = iq != "Y";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("HADDR")].mHideCol = iq != "Y";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("LOCATION_NAME")].mHideCol = iq != "Y";
                                    }
                                },
                                fields: thatForm.helperFunc.getFields("RPDRIVER1")

                            }
                        ]
                    }
                }
            ]
        };

        this.frm = new ReportView(this.mainPage);
        this.frm.parasAsLabels = true;
        return this.frm.createViewMain(this, js);

    }
    ,
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
                ploc: {
                    colname: "ploc",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"Location\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "ALL",
                    },
                    list: "select 'ALL' code,'ALL' name from dual union all select code,name from locations order by code",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                pcust: {
                    colname: "pcust",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtCust\",\"width\":\"15%\","textAlign":"End"}',
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.pcust", vl, vl, false);
                            var vlnm = Util.getSQLValue("select name from c_ycust where code =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.pcustname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            var sq = "select code,name from c_ycust where iscust='Y' and childcount=0 order by path";
                            Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcust", data.CODE, data.CODE, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcustname", data.NAME, data.NAME, true);
                                return true;
                            }, "100%", "100%", undefined, false, undefined, undefined, undefined, undefined, undefined, undefined);
                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pcustname: {
                    colname: "pcustname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
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
                showTruck: {
                    colname: "showTruck",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"txtShowTrucks\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
                    other_settings: { selected: false, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
            };
            return para;
        },
        getFields: function (repCode) {
            var colSpan = "XL2 L2 M2 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();
            var that2 = this.thatForm;
            var thatForm = this.thatForm;
            var view = this.thatForm.view;
            var cmdLink = function (obj, rowno, colno, lctb, frm) {
                if (obj == undefined) return;
                var tbl = obj.getParent().getParent();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "SALEINV")].getText());
                UtilGen.execCmd("bin.forms.br.forms.dlv formType=dialog formSize=900px,400px status=view keyfld=" + kfld, thatForm.view, obj, undefined);
            };
            var flds = {
                ord_empno: {
                    colname: "ord_empno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtNo",
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

                },
                drier_name: {
                    colname: "driver_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtDriver",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "300",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                vehicleno: {
                    colname: "vehicleno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "truckNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "150",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                haddr: {
                    colname: "haddr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "truckSize",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "150",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                location_name: {
                    colname: "location_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "locationTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "200",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                counts: {
                    colname: "counts",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCountsTrips",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    summary: "SUM",
                    other_settings: {},
                },
                totalqty: {
                    colname: "totalqty",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "m3Qty",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "QTY_FORMAT",
                    default_value: "",
                    summary: "SUM",
                    other_settings: {},
                },
            }
            return flds;
        },
    },
    loadData: function () {
    }
});



