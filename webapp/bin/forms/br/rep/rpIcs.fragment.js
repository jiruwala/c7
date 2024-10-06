sap.ui.jsfragment("bin.forms.br.rep.rpIcs", {
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
            // var mdl = frm.objs["CAGE1@qry2"].obj.getControl().getModel();
            // var rr = frm.objs["CAGE1@qry2"].obj.getControl().getRows().indexOf(obj.getParent());
            // var cont = frm.objs["CAGE1@qry2"].obj.getControl().getContextByIndex(rr);
            // var rowid = mdl.getProperty("_rowid", cont);
            // var ac = Util.nvl(lctb.getFieldValue(rowid, "CODE"), "");
            // var ac = frm.objs["CAGE1@qry2"].obj.getControl().getRows()[rr].getCells()[0].getText();

            // var mnu = new sap.m.Menu();
            // mnu.removeAllItems();

            // mnu.addItem(new sap.m.MenuItem({
            //     text: "SOA A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var CODE = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + CODE + " toacc=" + CODE + " fromdate=@01/01/2020", UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.addItem(new sap.m.MenuItem({
            //     text: "View A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var CODE = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("bin.forms.gl.masterAc formType=dialog formSize=650px,300px status=view CODE=" + CODE, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.openBy(obj);

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("nameCustItemSales"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "ICS01", // Items Daily Sales
                    name: Util.getLangText("nameCustItemSales"),
                    descr: Util.getLangText("nameCustItemSales"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    // printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("nameCustItemSales");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("ICS01"),
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
                                            qr.setAutoDispRecords(thatForm.mainPage, { "S": 70, "M": 40, "L": 50, "XL": 20 });
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
                                            return thatForm.helperFunc.addQry(qryObj, ps, "ICS01");
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
                ptype: {
                    colname: "ptype",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtOrdType\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "1",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                reptype: {
                    colname: "reptype",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"reportType\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "QTY",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "QTY",
                    },
                    list: "@QTY/Quantity,AMOUNT/Amount",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                incInvoiceNo: {
                    colname: "incInvoiceNo",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"txtInclInvoiceNo\",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { selected: false, width: "5%", trueValues: ["Y", "N"] },
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
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var rt = thatForm.frm.getFieldValue("parameter.reptype");
            var incIn = thatForm.frm.getFieldValue("parameter.incInvoiceNo");
            var rtypecol = rt == "QTY" ? "ORD_PKQTY" : "(qty_x*price_x)";
            var repcolname = rt == "QTY" ? "QTY" : "AMOUNT";

            // var inCol = incIn == "Y" ? ", (SELECT MAX(INVOICE_NO) FROM PUR1 WHERE INVOICE_CODE=21 AND JOINED_CORDER.SALEINV) INVOICE_NO  " : "";
            // var inColGrp = incIn == "Y" ? ", (SELECT MAX(INVOICE_NO) FROM PUR1 WHERE INVOICE_CODE=21 AND JOINED_CORDER.SALEINV) INVOICE_NO  " : "";

            var sq = "select location_code,location_name,ord_ref,ord_ship item,sum(:RTYPECOL) :REPCOLNAME , " +
                " ord_ref||'-'||ord_refnm CUST,ord_ship||'__:REPCOLNAME' ITEM_BAL " +
                " from joined_corder where " +
                " ORD_DATE>=:parameter.fromdate " +
                " AND ORD_DATE<=:parameter.todate  " +
                " and (':parameter.ploc' like '%\"'||JOINED_CORDER.location_code||'\"%' ) " +
                " AND (ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL) " +
                " AND (ord_type=':parameter.ptype' OR RTRIM(':parameter.ptype') IS NULL)" +
                " group by  location_code,location_name,ord_ref ,ord_ship, " +
                " ord_ref||'-'||ord_refnm , ord_ship||'__:REPCOLNAME'" +
                " order by location_code,ord_ref,ord_ship";
            if (incIn == "Y")
                sq = "select location_code,location_name,ord_ref,ord_ship item,sum(:RTYPECOL) :REPCOLNAME , " +
                    " ord_ref||'-'||ord_refnm CUST,ord_ship||'__:REPCOLNAME' ITEM_BAL, pur.invoice_no " +
                    " from joined_corder , " +
                    "(select KEYFLD,invoice_no from pur1 where invoice_code=21 ) pur " +
                    " where " +
                    " pur.keyfld(+)=joined_corder.saleinv and " +
                    " ORD_DATE>=:parameter.fromdate " +
                    " AND ORD_DATE<=:parameter.todate  " +
                    " and (':parameter.ploc' like '%\"'||JOINED_CORDER.location_code||'\"%' ) " +
                    " AND (ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL) " +
                    " AND (ord_type=':parameter.ptype' OR RTRIM(':parameter.ptype') IS NULL)" +
                    " group by  location_code,location_name,ord_ref ,ord_ship, pur.invoice_no ," +
                    " ord_ref||'-'||ord_refnm , ord_ship||'__:REPCOLNAME'" +
                    " order by location_code,ord_ref,ord_ship";

            sq = sq.replaceAll(":RTYPECOL", rtypecol)
                .replaceAll(":REPCOLNAME", repcolname);
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
                    var rt = thatForm.frm.getFieldValue("parameter.reptype");
                    var incIn = thatForm.frm.getFieldValue("parameter.incInvoiceNo");
                    var repcolname = rt == "QTY" ? "QTY" : "AMOUNT";
                    ld.parseCol("{" + dt.data + "}");
                    ld.cols[ld.getColPos("LOCATION_CODE")].mUIHelper.display_width = "50";
                    ld.cols[ld.getColPos("LOCATION_NAME")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("LOCATION_CODE")].ct_row = "Y";
                    ld.cols[ld.getColPos("LOCATION_NAME")].ct_row = "Y";

                    ld.cols[ld.getColPos("CUST")].ct_row = "Y";
                    // ld.cols[ld.getColPos("ORD_DATE")].ct_row = "Y";
                    ld.cols[ld.getColPos("ORD_REF")].mHideCol = true;
                    ld.cols[ld.getColPos("CUST")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("ITEM_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos(repcolname)].ct_val = "Y";
                    ld.cols[ld.getColPos(repcolname)].mUIHelper.display_format = "QTY_FORMAT";

                    if (incIn == "Y") {
                        ld.cols[ld.getColPos("INVOICE_NO")].ct_row = "Y";
                        ld.cols[ld.getColPos("INVOICE_NO")].mUIHelper.display_width = "70";
                    }
                    /*
                    ld.cols[ld.getColPos("CODE")].mTitle = Util.getLangText("txtCode");
                    ld.cols[ld.getColPos("NAME")].ct_row = "Y";
                    ld.cols[ld.getColPos("CODE")].mHideCol = true;
                    ld.cols[ld.getColPos("NAME")].mTitle = Util.getLangText("titleTxt");
                    ld.cols[ld.getColPos("PARENTACC")].ct_row = "Y";
                    ld.cols[ld.getColPos("LEVELNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("CHILDCOUNT")].ct_row = "Y";

                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";
                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos("AMOUNT")].ct_val = "Y";
                    ld.cols[ld.getColPos("AMOUNT")].mSummary = "SUM";
                    ld.cols[ld.getColPos("AMOUNT")].data_type = "number";
                    ld.cols[ld.getColPos("AMOUNT")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("AMOUNT")].mUIHelper.display_width = "200";

                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;
                    */

                    // ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";        

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
                    var itms = {};
                    var ditm = Util.execSQLWithData("select reference,descr from items order by reference");
                    for (var di in ditm)
                        itms[ditm[di].REFERENCE] = ditm[di].DESCR;
                    var fltcols = ["CUST", "INVOICE_NO", "tot__" + repcolname];
                    for (var li = 0; li < ld2.cols.length; li++)
                        if (ld2.cols[li].mColName.endsWith("__" + repcolname)) {
                            var cn = ld2.cols[li].mColName.replaceAll("__" + repcolname, "");
                            ld2.cols[li].mTitle = itms[cn];
                            ld2.cols[li].mUIHelper.display_format = rt == "QTY" ? "QTY_FORMAT" : "MONEY_FORMAT";
                            ld2.cols[li].mUIHelper.display_align = rt == "QTY" ? "ALIGN_CENTER" : "ALIGN_END";
                            ld2.cols[li].mUIHelper.display_width = "100";
                            ld2.cols[li].valOnZero = "";
                            ld2.cols[li].mSummary = "SUM";
                            fltcols.push(ld2.cols[li].mColName);
                        }
                    ld2.cols[ld2.getColPos("CUST")].mSummary = "COUNT_UNIQUE";
                    ld2.cols[ld2.getColPos("CUST")].count_unique_label = "txtCountCust";
                    if (incIn == "Y") {
                        ld2.cols[ld2.getColPos("INVOICE_NO")].mSummary = "COUNT_UNIQUE";
                        ld2.cols[ld2.getColPos("INVOICE_NO")].count_unique_label = "txtCountInvs";
                        ld2.cols[ld2.getColPos("INVOICE_NO")].mTitle="txtInvNo";
                        ld.cols[ld.getColPos("INVOICE_NO")].mUIHelper.display_width = "70";
                    }

                    ld2.cols[ld2.getColPos("LOCATION_CODE")].mGrouped = true;
                    ld2.cols[ld2.getColPos("LOCATION_NAME")].mGrouped = true;
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].mTitle = Util.getLangText(rt == "QTY" ? "totalQty" : "amountTxt");
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].valOnZero = "";
                    thatForm.frm.objs["ICS01@qry2"].filterCols = fltcols;
                    qr.showToolbar.filterCols = fltcols;
                    qr.mLctb.parse(dt2, true);
                    qr.loadData();
                    qr.getControl().setFirstVisibleRow(0);
                    qr.getControl().setFixedColumnCount(3);

                }
            });
        },

    },
    loadData: function () {
    }

});



