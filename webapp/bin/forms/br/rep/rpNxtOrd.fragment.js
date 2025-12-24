sap.ui.jsfragment("bin.forms.br.rep.rpNxtOrd", {
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
            title: Util.getLangText("titSalesOrders"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "NXTORD1",
                    name: Util.getLangText("titSalesOrders"),
                    descr: Util.getLangText("titSalesOrders"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titSalesOrders");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("NXTORD1"),
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                dispRecords: -1,// { "S": 7, "M": 14, "L": 15, "XL": 18 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["ORD_NO", "ORD_REFNM", "ITEM_DESCR", "ORD_DATE", "BRANCH_NAME", "AMOUNT", "CUST_BALANCE", "BAL_AFTER", "SLSNAME", "TEL", "SLSMN", "OQTY", "SALE_PRICE"],
                                canvasType: ReportView.CanvasType.VBOX,
                                eventAfterQV: function (qryObj) {
                                    // var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                    // if (iq != "none")
                                    qryObj.obj.showToolbar.showGroupFilter = true;//!(iq == "1");

                                },
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    var oModel = this.getControl().getModel();
                                    var bl = Util.extractNumber(oModel.getProperty("AMOUNT", currentRowContext));
                                    var bl = bl + Util.extractNumber(oModel.getProperty("CUST_BALANCE", currentRowContext));
                                    var cl = Util.extractNumber(oModel.getProperty("CRD_LIMIT", currentRowContext));
                                    if (cl != 0 && bl > cl)
                                        for (var i = startCell; i < endCell; i++) {
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", "red");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", "red");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("background-color", "lightgrey");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("background-color", "lightgrey");

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
                                eventCalc: function (qv, cx, rowno, reAmt) {
                                    var sett = sap.ui.getCore().getModel("settings").getData();
                                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                                    if (rowno >= 0) return;
                                    var ld = qv.mLctb;
                                    for (var i = 0; i < ld.rows.length; i++) {
                                        var bl = ld.getFieldValue(i, "CUST_BALANCE");
                                        var amt = bl + ld.getFieldValue(i, "AMOUNT");
                                        ld.setFieldValue(i, "BAL_AFTER", amt);
                                    }
                                },
                                beforeLoadQry: function (sql) {
                                    var eq = thatForm.frm.getFieldValue("NXTORD1@parameter.grpby");
                                    var oy = thatForm.frm.getFieldValue("NXTORD1@parameter.ordby");
                                    var ordby = oy == "ord_no" ? " ORDER BY n.ord_date,n.ord_no " : " order by n." + oy;
                                    var sq = "select " +
                                        "n.KEYFLD, n.PERIODCODE, n.LOCATION_CODE, n.ORD_NO, n.ORD_CODE, n.ORD_DATE,to_char(ORD_TIME,'HH24 MI') ord_time " +
                                        ", c7_get_cb(ord_ref) cust_balance , " +
                                        " 0 balance_after, n.sale_price,(n.sale_price*n.oqty) amount, c.b_name," +
                                        "n.ORD_REF, n.ORD_BRANCH, n.ORD_ITEM, n.OQTY, n.ORD_DESCR, n.DRIVER_CODE, i.descr descr,y.crd_limit2 crd_limit , " +
                                        "n.DELIVERY_NO, n.CREATDT, n.ORD_REFNM, n.PUMP, n.SLSMN, n.TEL,  n.CAST_TYPE,s.name slsname ,l.name loc_name " +
                                        "from c_nextordx n,salesp s,items i,cbranch c,locations l,c_ycust y " +
                                        " where i.reference=n.ord_item and s.no(+)=n.slsmn and ord_date=:parameter.todate " +
                                        " and c.code=n.ord_ref and c.brno=n.ord_branch " +
                                        " and l.code=n.location_code and y.code=n.ord_ref " +
                                        " AND (n.ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL)" +
                                        " AND (n.ORD_BRANCH=':parameter.psite' OR RTRIM(':parameter.psite') IS NULL)" +
                                        " AND (i.DESCR2 LIKE (select nvl(max(descr2),'zzz') from items where i.reference=':parameter.rmix' )||'%'  OR RTRIM(':parameter.rmix') IS NULL)  " +
                                        " and (':parameter.ploc' like '%\"'||n.location_code||'\"%' ) " +

                                        ordby;
                                    return thatForm.frm.parseString(sq);
                                },
                                afterApplyCols: function (qryObj) {
                                    if (qryObj.name == "qry2") {
                                        var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ORD_REFNM")].mGrouped = iq == "customers";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ORD_ITEM")].mGrouped = iq == "items";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("DESCR")].mGrouped = iq == "items";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("SLSNAME")].mGrouped = iq == "salesp";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("SLSMN")].mGrouped = iq == "salesp";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("ORD_BRANCH")].mGrouped = iq == "branches";
                                    }
                                },
                                fields: thatForm.helperFunc.getFields("NXTORD1")

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
                    class_name: FormView.ClassTypes.MULTICOMBOBOX,
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
                        showSelectAll: true,
                        selectedKeys: Util.getSQLColArray("select code from locations order by code")
                    },
                    list: "select code,name from locations order by code",
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
                            var sq = "select code,name from c_ycust where iscust='Y' and (mov_type='^^list_key' or    '^^list_key'='ALL') and childcount=0 order by path";
                            var pListPara = {
                                selectStr: "@ALL/txtAll,ACTIVE/txtCustActive,STOPPED/txtCustStopped,LEGAL/txtCustUnderLegal",
                                defaultKey: "ACTIVE",
                            };

                            Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcust", data.CODE, data.CODE, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcustname", data.NAME, data.NAME, true);
                                return true;
                            }, "100%", "100%", undefined, false, undefined, undefined, undefined, undefined, undefined, undefined, pListPara);
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
                psite: {
                    colname: "psite",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End"}',
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
                            var cust = thatForm.frm.getFieldValue(repCode + "@parameter.pcust");
                            thatForm.frm.setFieldValue(repCode + "@parameter.psite", vl, vl, false);
                            var vlnm = Util.getSQLValue("select b_name from cbranch where code ='" + cust + "' and brno=" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.psitename", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            var cust = thatForm.frm.getFieldValue(repCode + "@parameter.pcust");
                            var sq = "select brno code,b_name name from cbranch where code='" + cust + "' order by brno";
                            Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.psite", data.CODE, data.CODE, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.psitename", data.NAME, data.NAME, true);
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
                psitename: {
                    colname: "psitename",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "49%",
                        editable: false
                    },
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
                        selectedKey: "none",
                    },
                    list: "@none/txtNone,customers/txtCountCust,items/itemTxt,salesp/txtSalesPerson,branches/txtBranches",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ordby: {
                    colname: "ordby",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"ordByTxt\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "ord_no",
                    },
                    list: "@ord_no/txtByOrdNo,ord_date/txtByDate,ord_ref/txtByCust,ord_discamt/Branch,ord_ship/Items",
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
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());
                UtilGen.execCmd("bin.forms.rm.forms.dlvord readonly=true formType=dialog formSize=900px,500px status=view keyfld=" + kfld, thatForm.view, obj, undefined);
            };
            var flds = {
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
                    summary: "COUNT_UNIQUE",
                    count_unique_label: "txtCountDate",

                },
                ord_ref: {
                    colname: "ord_ref",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCode",
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
                ord_refnm: {
                    colname: "ord_refnm",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCust",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "200",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    summary: "COUNT_UNIQUE",
                    count_unique_label: "txtCountCust",
                    other_settings: {},
                    commandLinkClick: cmdLink

                },
                b_name: {
                    colname: "b_name",
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
                descr: {
                    colname: "descr",
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
                    commandLinkClick: cmdLink
                },
                cust_balance: {
                    colname: "cust_balance",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "balanceTxt",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "150",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    summary: "SUM",
                    other_settings: {},
                },
                oqty: {
                    colname: "oqty",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "totalQty",
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
                sale_price: {
                    colname: "sale_price",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtPrice",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "80",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
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
                    display_width: "80",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                },
                bal_after: {
                    colname: "bal_after",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "Balance After",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "color:darkblue;background-color:#f5f5dc",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                },
                crd_limit: {
                    colname: "crd_limit",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCreditLimit",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_END",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                },
                ord_time: {
                    colname: "ord_time",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "Time",
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
                pump: {
                    colname: "pump",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtEquipment",
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
                cast_type: {
                    colname: "cast_type",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "castType",
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
                slsname: {
                    colname: "slsname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtSalesPerson",
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
                slsmn: {
                    colname: "slsmn",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtNo",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "60",
                    display_align: "ALIGN_BEGIN",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},

                },
                loc_name: {
                    colname: "loc_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "locationTxt",
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
                ord_descr: {
                    colname: "ord_descr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtRemark",
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

                keyfld: {
                    colname: "keyfld",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "0",
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



