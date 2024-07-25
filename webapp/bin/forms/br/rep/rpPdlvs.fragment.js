sap.ui.jsfragment("bin.forms.br.rep.rpPdlvs", {
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
            title: "Report Title",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "RPPDLV1",
                    name: Util.getLangText("namePdlvDetails"),
                    descr: Util.getLangText("descrPdlvDetails"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titPdlvDetails");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("RPPDLV1"),
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
                                filterCols: ["ORD_REFNM", "ITEM_DESCR", "ORD_DATE", "BRANCH_NAME", "AMOUNT", "TOTALQTY"],
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
                                    var eq = thatForm.frm.getFieldValue("RPPDLV1@parameter.grpby");
                                    var sq = "SELECT ORD_REF, ORD_REFNM," +
                                        " ORD_DATE, ORD_SHIP,  ORD_DISCAMT,saleinv," +
                                        " SUM(TQTY) TOTALQTY,SUM(SALE_PRICE*TQTY) AMOUNT," +
                                        " MAX(SALE_PRICE) PRICEX,ITEM_DESCR, BRANCH_NAME,count(*) counts,driver_name,TRUCKNO,TEL, " +
                                        " JOINED_CORDER.ORD_NO," +
                                        " ORD_POS " +
                                        " FROM " +
                                        " JOINED_CORDER,PUR1 INVOICE1 " +
                                        " WHERE ( ORD_CODE=11 " +
                                        " AND SALEINV=INVOICE1.KEYFLD (+) " +
                                        " and (invoice1.invoice_no=':parameter.pinvoice_no' or ':parameter.pinvoice_no' is null)  " +
                                        " AND ORD_DATE>=:parameter.fromdate " +
                                        " AND ORD_DATE<=:parameter.todate  " +
                                        "  )" +
                                        " AND (ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL)" +
                                        " AND (DESCR2 LIKE (select nvl(max(descr2),'zzz') from items where reference=':parameter.rmix' )||'%'  OR RTRIM(':parameter.rmix') IS NULL)  " +
                                        " GROUP BY " +
                                        " ORD_REF, ORD_REFNM," +
                                        " JOINED_CORDER.ORD_NO," +
                                        " ORD_POS," +
                                        " DRIVER_NAME ,TEL,TRUCKNO," +
                                        " ORD_DATE, ORD_SHIP,  ORD_DISCAMT, " +
                                        " SALE_PRICE,item_descr, BRANCH_NAME , saleinv " +
                                        " ORDER BY ord_date,ord_no ";
                                    return thatForm.frm.parseString(sq);
                                },
                                afterApplyCols: function (qryObj) {
                                    if (qryObj.name == "qry2") {
                                        var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ORD_REFNM")].mGrouped = iq == "customers";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ITEM_DESCR")].mGrouped = iq == "items";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("DRIVER_NAME")].mGrouped = iq == "drivers";
                                    }
                                },
                                fields: thatForm.helperFunc.getFields("RPPDLV1")

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
                    title: '{\"text\":\"txtSupplier\",\"width\":\"15%\","textAlign":"End"}',
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
                rmix: {
                    colname: "rmix",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"itemTxt\",\"width\":\"15%\","textAlign":"End"}',
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.rmix", vl, vl, false);
                            var vlnm = Util.getSQLValue("select descr name from items where reference =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.rmixname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            var sq = "select reference code,descr name from items where childcounts=0 order by descr2";
                            Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.rmix", data.CODE, data.CODE, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.rmixname", data.NAME, data.NAME, true);
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
                rmixname: {
                    colname: "rmixname",
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
                pinvoice_no: {
                    colname: "pinvoice_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtInvNo\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                grpby: {
                    colname: "grpby",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"grpByTxt\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "customers",
                    },
                    list: "@none/None,customers/Suppliers,items/Items,drivers/Drivers",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
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
                UtilGen.execCmd("bin.forms.br.forms.pdlv formType=dialog formSize=900px,400px status=view keyfld=" + kfld, thatForm.view, obj, undefined);
            };
            var flds = {
                ord_no: {
                    colname: "ord_no",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "50",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                },
                ord_date: {
                    colname: "ord_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "ordDate",
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

                },
                ord_refnm: {
                    colname: "ord_refnm",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtSupplier",
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
                totalqty: {
                    colname: "totalqty",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "totalQty",
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
                },
                item_descr: {
                    colname: "item_descr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemDescr",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "200",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                pricex: {
                    colname: "pricex",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtPrice",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                },
                branch_name: {
                    colname: "branch_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "branchNmTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_BEGIN",
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
                    display_width: "120",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                truckno: {
                    colname: "truckno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "truckNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "80",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                tel: {
                    colname: "tel",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtTel",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "50",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                amount: {
                    colname: "amount",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "amountTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                    summary: "SUM",

                },
                saleinv: {
                    colname: "saleinv",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "keyfld",
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
            }
            return flds;
        },
    },
    loadData: function () {
    }
});



