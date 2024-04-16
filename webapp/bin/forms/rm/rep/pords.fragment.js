sap.ui.jsfragment("bin.forms.rm.rep.pords", {
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
        var cmdLink = function (obj, rowno, colno, lctb, frm) {
            // var mdl = frm.objs["CAGE1@qry2"].obj.getControl().getModel();
            // var rr = frm.objs["CAGE1@qry2"].obj.getControl().getRows().indexOf(obj.getParent());
            // var cont = frm.objs["CAGE1@qry2"].obj.getControl().getContextByIndex(rr);
            // var rowid = mdl.getProperty("_rowid", cont);
            // var ac = Util.nvl(lctb.getFieldValue(rowid, "ACCNO"), "");
            // var ac = frm.objs["CAGE1@qry2"].obj.getControl().getRows()[rr].getCells()[0].getText();

            // var mnu = new sap.m.Menu();
            // mnu.removeAllItems();

            // mnu.addItem(new sap.m.MenuItem({
            //     text: "SOA A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var accno = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + accno + " toacc=" + accno + " fromdate=@01/01/2020", UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.addItem(new sap.m.MenuItem({
            //     text: "View A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var accno = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("bin.forms.gl.masterAc formType=dialog formSize=650px,300px status=view accno=" + accno, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.openBy(obj);

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: "Report Title",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "PORD1",
                    name: "Purchase Receipts",
                    descr: "Purchase Receipts",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("Purchase Receipts");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: {
                        width: "600px",
                        cssText: [
                            "padding-left:50px;" +
                            "padding-top:20px;" +
                            "border-style: inset;" +
                            "margin: 10px;" +
                            "border-radius:25px;" +
                            "background-color:#dcdcdc;"
                        ]
                    },
                    rep: {
                        parameters: thatForm.helperFunc.getParas("PORD1"),
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                dispRecords: { "S": 10, "M": 16, "L": 20 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["REF_NAME", "DESCR", "DLV_NO", "BRANCH_NAME", "DRIVER_NAME", "REF_CODE"],
                                canvasType: ReportView.CanvasType.VBOX,
                                eventAfterQV: function (qryObj) {
                                    qryObj.obj.showToolbar.showGroupFilter = true;//!(iq == "1");
                                },
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    var oModel = this.getControl().getModel();
                                    var pk = (oModel.getProperty("PUR_KEYFLD", currentRowContext));
                                    if (Util.nvl(pk, "") == "")
                                        for (var i = startCell; i < endCell; i++) {
                                            var cellValue = oModel.getProperty(qv.mLctb.cols[0].mColName, currentRowContext);
                                            if (!(cellValue + "").startsWith(String.fromCharCode(4094)) && qv.getControl().getColumns()[i - startCell].getWidth() != '0px') {
                                                var align = (qv.getControl().getColumns()[i - startCell].tableCol.mColName == "AMOUNT" ? "right" : "center");
                                                qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("cssText", "color:blue;text-align:" + align + ";");
                                                qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("cssText", "color:blue;text-align:" + align + ";");
                                            }
                                        }
                                },
                                bat7CustomAddQry: function (qryObj, ps) {
                                },
                                beforeLoadQry: function (sql) {
                                    var posted = thatForm.frm.getFieldValue("parameter.postedinv");
                                    var sq2 = "";
                                    if (posted == "2")
                                        sq2 = " and pur_keyfld is not null";
                                    if (posted == "3")
                                        sq2 = " and pur_keyfld is null";

                                    var sq = "select po.ref_code||'-'||yc.name ref_name,po.KEYFLD, po.LOCATION_CODE, po.ORD_DATE, po.DRIVER_NO, po.DLV_NO, " +
                                        " po.TRUCK_NO, po.REF_CODE, po.BRANCH_NO, po.REFER, po.PACKD, po.UNITD, " +
                                        " po.PACK, po.PACKQTY, po.PUR_KEYFLD, po.FLAG, " +
                                        " case when po.PUR_KEYFLD is not null then po.SALE_PRICE else get_item_price2(po.refer,po.ref_code,po.branch_no,po.ord_date) end sale_price ,  " +
                                        " IT.DESCR, yc.name ref_name2 , cb.b_name branch_name ,sp.name driver_name ," +
                                        " po.packqty||' '||initcap(po.packd) pkqtystr , " +
                                        " ( case when po.PUR_KEYFLD is not null then po.SALE_PRICE else get_item_price2(po.refer,po.ref_code,po.branch_no,po.ord_date) end  *  po.packqty) amount " +
                                        " from C7_RMPORD po,items it, c_ycust yc,cbranch cb , SALESP sp " +
                                        " where it.reference=po.refer " +
                                        " and po.branch_no=cb.brno " +
                                        " and po.ref_code=cb.code " +
                                        " and yc.code=po.ref_code " +
                                        " and po.driver_no=sp.no(+) " +
                                        sq2 +
                                        " and  po.ORD_DATE >=:parameter.fromdate and po.ord_date<=:parameter.todate "
                                    " order by po.keyfld ";
                                    return thatForm.frm.parseString(sq);
                                },
                                fields: thatForm.helperFunc.getFields("PORD1")
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
                postedinv: {
                    colname: "postedinv",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"posted\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "1",
                    },
                    list: "@1/All,2/Invoiced,3/Un-Invoiced",
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
                UtilGen.execCmd("bin.forms.rm.forms.pord formType=dialog formSize=900px,400px status=view keyfld=" + kfld, thatForm.view, obj, undefined);
            };
            var flds = {
                ref_name: {
                    colname: "ref_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtCust",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_CENTER",
                    grouped: true,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
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
                    commandLinkClick: cmdLink
                },
                dlv_no: {
                    colname: "dlv_no",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "rcptNo",
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
                driver_no: {
                    colname: "driver_no",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtDriver",
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
                    commandLinkClick: cmdLink
                },
                driver_name:
                {
                    colname: "driver_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "txtDriver",
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
                truck_no: {
                    colname: "truck_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "truckNo",
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
                branch_no: {
                    colname: "branch_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "branchNoTxt",
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
                    commandLinkClick: cmdLink
                },
                branch_name: {
                    colname: "branch_name",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "branchNmTxt",
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
                refer: {
                    colname: "refer",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemCode",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "60",
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
                    title: "txtProd",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "120",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    commandLinkClick: cmdLink
                },
                packd: {
                    colname: "PACKD",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemPackD",
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
                packqty: {
                    colname: "packqty",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "itemPackQty",
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
                sale_price: {
                    colname: "sale_price",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "price",
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
                    commandLinkClick: cmdLink
                },
                amount: {
                    colname: "amount",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: "amount",
                    title2: "",
                    parentTitle: "",
                    parentSpan: 1,
                    display_width: "100",
                    display_align: "ALIGN_CENTER",
                    grouped: false,
                    display_style: "",
                    display_format: "MONEY_FORMAT",
                    default_value: "",
                    other_settings: {},
                    summary: "SUM",
                    commandLinkClick: cmdLink
                },
                pur_keyfld: {
                    colname: "pur_keyfld",
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
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    display_type: "NONE",
                    commandLinkClick: cmdLink
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
                    display_format: "",
                    default_value: "",
                    other_settings: {},
                    display_type: "",
                    commandLinkClick: cmdLink
                }
            }
            return flds;
        },
    },
    loadData: function () {
    }
});



