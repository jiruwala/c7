sap.ui.jsfragment("bin.forms.jo.rep.prods", {
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
            title: Util.getLangText("Production Progress Report"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "JOPROD1", // Items Daily Sales
                    name: Util.getLangText("Production Progress Report"),
                    descr: Util.getLangText("Production Progress Report"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    // printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("Production Progress Report");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("JOPROD1"),
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
                                            qr.setAutoDispRecords(thatForm.mainPage, { "S": 45, "M": 55, "L": 60, "XL": 50 });
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
                                            return thatForm.helperFunc.addQry(qryObj, ps, "JOPROD1");
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
                    showInPreview: false,
                },
                pStepType: {
                    colname: "pStepType",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.MULTICOMBOBOX,
                    title: '{\"text\":\"Step Type\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKeys: Util.getSQLColArray("select code from PORD_JO_STEPS_INFO order by code")

                    },
                    list: "select code,descr name from PORD_JO_STEPS_INFO order by code",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                    showInPreview: false,
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
                        selectedKey: "pending",
                    },
                    list: "@pending/Only Pending Production,started_steps/Started Prods",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                pJoNo: {
                    colname: "pJoNo",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"JO # \",\"width\":\"15%\","textAlign":"End"}',
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
                showDetails: {
                    colname: "showDetails",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"Show Details\",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { selected: true, width: "5%", trueValues: ["Y", "N"] },
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
            var showDetails = thatForm.frm.getFieldValue("parameter.showDetails");
            var pStepType = thatForm.frm.objs["JOPROD1@parameter.pStepType"].obj;
            var reptype = thatForm.frm.getFieldValue("parameter.reptype");
            var pJoNO = thatForm.frm.getFieldValue("parameter.pJoNo");
            var sett = sap.ui.getCore().getModel("settings").getData();
            // "@all/Open JOs,pending/Only Pending Production,started_steps/Started Prods",
            var repCond = {
                "all": "",
                "pending": " and JO_PROD_USER is null ",
                "pending_steps": " and PROD_STATUS = 1 ",
                "started_steps": " and PROD_STATUS= 2 "
            }
            var stepsclause = "", repTypeClause = "", pJoNOClause = "";
            if (Util.nvl(pJoNO, "") != "")
                pJoNOClause = " and ORD_NO=" + pJoNO + " ";
            else {
                repTypeClause = Util.nvl(repCond[reptype], "and JO_PROD_USER is null ");
                var kys = pStepType.getSelectedKeys();
                for (k in kys)
                    stepsclause += (stepsclause.length > 0 ? "," : "") + kys[k];
                if (stepsclause.length > 0) stepsclause = " and step_code in (" + stepsclause + ")";
            }

            var sq = `SELECT ORD_REF,ORD_REFNM,ORD_NO,ORD_DATE,STEP_CODE STEP,
            PROD_STATUS STAT,STEP_CODE||'__STAT' STEP_STAT ,KEYFLD
                FROM C7_V_PRODS where ord_flag!=3 :pJoNO  :repType :stepClause
                 and ord_date>=:parameter.fromdate and ord_date<=:parameter.todate 
                    ORDER BY STEP_CODE,ORD_NO`;
            if (showDetails == 'Y') {
                sq = `SELECT ORD_REF,ORD_REFNM,ORD_NO,ORD_DATE,ITEM_DESCR,QTY,MATERIAL,PAYTERM,DLVP,PURP,STEP_CODE STEP,EMP_NAME,
                        STEP_START,STEP_END,ord_shpdt,
                        case when dlvp>='100%' and purp<'100%' then 'Ready' 
                             when purp='100%' then 'Invoiced'
                             when dlvp<'100%' and purp<'100%' then 'Process'
                        end rec_stat,
                        PROD_STATUS STAT,STEP_CODE||'__STAT' STEP_STAT ,KEYFLD
                            FROM C7_JO_PRODS where ord_flag!=3 :pJoNO  :repType :stepClause
                             and ord_date>=:parameter.fromdate and ord_date<=:parameter.todate 
                                ORDER BY STEP_CODE,ORD_NO`;
            }

            sq = sq.replaceAll(":pJoNO", pJoNOClause)
                .replaceAll(":repType", repTypeClause)
                .replaceAll(":stepClause", stepsclause);
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
            var stats = { 0: "-", 1: "⚠️", 2: "⏰", 3: "✅" }
            var stepstats = {};
            var showDetails = thatForm.frm.getFieldValue("parameter.showDetails");
            that.ld = undefined;
            function moveElement(arr, fromIndex, toIndex) {
                // Remove the element from its current position
                const [element] = arr.splice(fromIndex, 1);
                // Insert it into the new position
                arr.splice(toIndex, 0, element);
                return arr;
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
                    var qr = thatForm.qr;
                    var ld = new LocalTableData();
                    var rt = thatForm.frm.getFieldValue("parameter.reptype");
                    var incIn = thatForm.frm.getFieldValue("parameter.incInvoiceNo");
                    var repcolname = rt == "QTY" ? "QTY" : "AMOUNT";
                    ld.parseCol("{" + dt.data + "}");
                    ld.cols[ld.getColPos("ORD_REF")].mUIHelper.display_width = "30";
                    ld.cols[ld.getColPos("ORD_REFNM")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("KEYFLD")].ct_row = "Y";
                    ld.cols[ld.getColPos("ORD_REF")].ct_row = "Y";
                    ld.cols[ld.getColPos("ORD_REFNM")].ct_row = "Y";

                    ld.cols[ld.getColPos("ORD_NO")].ct_row = "Y";
                    ld.cols[ld.getColPos("ORD_NO")].mUIHelper.display_width = "30";

                    ld.cols[ld.getColPos("ORD_DATE")].ct_row = "Y";
                    ld.cols[ld.getColPos("ORD_DATE")].mUIHelper.display_width = "70";
                    ld.cols[ld.getColPos("ORD_DATE")].mUIHelper.display_format = "SHORT_DATE_FORMAT";


                    ld.cols[ld.getColPos("STEP_STAT")].ct_col = "Y";

                    ld.cols[ld.getColPos("STAT")].ct_val = "Y";

                    //ITEM_DESCR,MATERIAL,PAYTERM,DLVP,PURP
                    if (showDetails == 'Y') {
                        ld.cols[ld.getColPos("ITEM_DESCR")].ct_row = "Y";
                        ld.cols[ld.getColPos("PAYTERM")].ct_row = "Y";
                        ld.cols[ld.getColPos("DLVP")].ct_row = "Y";
                        ld.cols[ld.getColPos("PURP")].ct_row = "Y";
                        ld.cols[ld.getColPos("EMP_NAME")].ct_row = "Y";
                        ld.cols[ld.getColPos("QTY")].ct_row = "Y";
                        ld.cols[ld.getColPos("REC_STAT")].ct_row = "Y";
                        // ld.cols[ld.getColPos("STEP")].ct_row = "Y";
                        ld.cols[ld.getColPos("MATERIAL")].ct_row = "Y";
                        ld.cols[ld.getColPos("STEP_START")].ct_row = "Y";
                        ld.cols[ld.getColPos("STEP_END")].ct_row = "Y";
                        ld.cols[ld.getColPos("ORD_SHPDT")].ct_row = "Y";


                    }

                    ld.parse("{" + dt.data + "}", true);
                    // mapping counts of steps
                    for (var li = 0; li < ld.rows.length; li++)
                        if (Util.nvl(ld.getFieldValue(li, "STEP"), 0) != 0)
                            stepstats[ld.getFieldValue(li, "ORD_NO") + "-" + ld.getFieldValue(li, "STEP")]
                                = Util.nvl(stepstats[ld.getFieldValue(li, "ORD_NO") + "-" + ld.getFieldValue(li, "STEP")], "")
                                + String(ld.getFieldValue(li, "STAT"));
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
                    var colsStat = [];
                    var ditm = Util.execSQLWithData("select code,descr||' '||code descr from PORD_JO_STEPS_INFO order by code");
                    for (var di in ditm)
                        itms[ditm[di].CODE] = ditm[di].DESCR;
                    var fltcols = ["ORD_REF", "ORD_REFNM", "ORD_NO"];
                    for (var li = 0; li < ld2.cols.length; li++)
                        if (ld2.cols[li].mColName.endsWith("__STAT")) {
                            var cn = (ld2.cols[li].mColName).replaceAll("__STAT", "");
                            ld2.cols[li].mTitle = itms[cn];
                            ld2.cols[li].mUIHelper.display_width = showDetails == 'Y' ? 140 : "75";
                            ld2.cols[li].mUIHelper.display_align = "ALIGN_CENTER";
                            fltcols.push(ld2.cols[li].mColName);
                            colsStat.push(ld2.cols[li].mColName);
                        }
                    ld2.cols[ld2.getColPos("KEYFLD")].mUIHelper.display_width = 0;
                    ld2.cols[ld2.getColPos("tot__STAT")].mHideCol = true;
                    ld2.cols[ld2.getColPos("ORD_REF")].mUIHelper.display_width = "75";
                    ld2.cols[ld2.getColPos("ORD_REFNM")].mUIHelper.display_width = "120";
                    ld2.cols[ld2.getColPos("ORD_NO")].mUIHelper.display_width = "75";
                    ld2.cols[ld2.getColPos("ORD_DATE")].mUIHelper.display_width = "90";
                    ld2.cols[ld2.getColPos("ORD_DATE")].mUIHelper.display_format = "SHORT_DATE_FORMAT";

                    ld2.cols[ld2.getColPos("ORD_REF")].mTitle = Util.getLangText("txtCode");
                    ld2.cols[ld2.getColPos("ORD_REFNM")].mTitle = Util.getLangText("txtName");
                    ld2.cols[ld2.getColPos("ORD_DATE")].mTitle = Util.getLangText("ordDate");

                    if (showDetails == "Y") {
                        ld2.cols[ld2.getColPos("STEP_START")].mHideCol = true;
                        ld2.cols[ld2.getColPos("STEP_END")].mHideCol = true;

                        ld2.cols[ld.getColPos("ITEM_DESCR")].mUIHelper.display_width = "120";
                        ld2.cols[ld.getColPos("PAYTERM")].mUIHelper.display_width = "100";
                        ld2.cols[ld.getColPos("DLVP")].mUIHelper.display_width = "60";
                        ld2.cols[ld.getColPos("PURP")].mUIHelper.display_width = "60";
                        ld2.cols[ld.getColPos("MATERIAL")].mUIHelper.display_width = "90";
                        ld2.cols[ld.getColPos("REC_STAT")].mUIHelper.display_width = "90";

                        ld2.cols[ld.getColPos("ITEM_DESCR")].mTitle = Util.getLangText("descrTxt");
                        ld2.cols[ld.getColPos("PAYTERM")].mTitle = Util.getLangText("Section");
                        ld2.cols[ld.getColPos("DLVP")].mTitle = Util.getLangText("Dlv %");
                        ld2.cols[ld.getColPos("PURP")].mTitle = Util.getLangText("Sold %");
                        ld2.cols[ld.getColPos("MATERIAL")].mTitle = Util.getLangText("Material");

                        ld2.cols[ld2.getColPos("QTY")].mUIHelper.display_width = "75";
                        ld2.cols[ld2.getColPos("QTY")].mUIHelper.display_format = "QTY_FORMAT";

                        ld2.cols[ld2.getColPos("EMP_NAME")].mUIHelper.display_width = "60";
                        ld2.cols[ld2.getColPos("EMP_NAME")].mTitle = Util.getLangText("Emp");
                        ld2.cols[ld2.getColPos("REC_STAT")].mTitle = Util.getLangText("Status");
                        ld2.cols[ld2.getColPos("ORD_SHPDT")].mUIHelper.display_width = "90";

                        ld2.cols[ld2.getColPos("ORD_SHPDT")].mUIHelper.display_format = "SHORT_DATE_FORMAT";
                        ld2.cols[ld2.getColPos("ORD_SHPDT")].mTitle = Util.getLangText("dueDate");

                        moveElement(ld2.cols, ld2.getColPos("ORD_SHPDT"), ld2.cols.length - 1);
                        moveElement(ld2.cols, ld2.getColPos("EMP_NAME"), ld2.cols.length - 1);
                        moveElement(ld2.cols, ld2.getColPos("DLVP"), ld2.cols.length - 1);
                        moveElement(ld2.cols, ld2.getColPos("PURP"), ld2.cols.length - 1);
                        moveElement(ld2.cols, ld2.getColPos("REC_STAT"), ld2.cols.length - 1);
                        colsStat.push("DLVP");
                        colsStat.push("PURP");

                    }
                    ld2.cols[ld2.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                        var tbl = obj.getParent().getParent();
                        var mdl = tbl.getModel();
                        var rr = tbl.getRows().indexOf(obj.getParent());
                        var rowStart = tbl.getFirstVisibleRow();
                        var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());
                        var frm = "bin.forms.jo.jo";
                        UtilGen.execCmd(frm + " formTitle=JO formType=dialog formSize=80%,80% keyfld=" + kfld + "", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                            // that.loadData();
                        });
                    };

                    qr.onRowRender = function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                        var oModel = this.getControl().getModel();
                        var dd = showDetails == 'Y' ? oModel.getProperty("ORD_SHPDT", currentRowContext) : undefined;
                        var todt = thatForm.frm.getFieldValue("parameter.todate");
                        var purp = Util.extractNumber(oModel.getProperty("PURP", currentRowContext));
                        var dlvp = Util.extractNumber(oModel.getProperty("DLVP", currentRowContext));
                        var flg = Util.extractNumber(oModel.getProperty("ORD_FLAG", currentRowContext));
                        var doRender = function (clr, bkclr) {
                            for (var i = startCell; i < endCell; i++) {
                                if (clr != "") {
                                    qr.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", clr);
                                    qr.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", clr);
                                }
                                if (bkclr != "") {
                                    qr.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("background-color", bkclr);
                                    qr.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("background-color", bkclr);
                                }

                            }

                        }
                        if (!dd) return;
                        var dd2 = Util.parseDate(dd, sett["ENGLISH_DATE_FORMAT"]);
                        if (purp < 100) {
                            if (todt.getTime() >= dd2.getTime())
                                doRender("white", "red");
                            else if (todt.getTime() > (dd2.getTime() - 86400000))
                                doRender("white", "orange");
                        } else
                            doRender("green", "white");
                    };
                    // following will replace status numbers with legends

                    fltcols = [];
                    for (var li = 0; li < ld2.cols.length; li++)
                        fltcols.push(ld2.cols[li].mColName)
                    thatForm.frm.objs["JOPROD1@qry2"].filterCols = fltcols;
                    qr.showToolbar.filterCols = fltcols;
                    qr.mLctb.parse(dt2, true);

                    var ld3 = qr.mLctb;

                    for (var li = 0; li < ld3.rows.length; li++)
                        for (var ci in colsStat) {
                            var cn = colsStat[ci].replaceAll("__STAT", "");;
                            var jostep = ld3.getFieldValue(li, "ORD_NO") + "-" + cn;
                            var vl = String(Util.nvl(stepstats[jostep], ""));
                            if ((cn == "DLVP" || cn == "PURP"))
                                vl = ld3.getFieldValue(li, cn);
                            if (showDetails != 'Y')
                                if (Util.nvl(vl, "") != "") {
                                    vl = vl.replaceAll("0", "-")
                                        .replaceAll("1", "" + stats[1])
                                        .replaceAll("2", "" + stats[2])
                                        .replaceAll("3", "" + stats[3]);
                                } else vl = ""; // if (Util.nvl(vl, "") != "") {
                            else { //if (showDetails != 'Y')
                                if ((cn == "DLVP" || cn == "PURP"))
                                    vl = vl.trim() == "100%" ? stats[3] : vl;
                                if (!(cn == "DLVP" || cn == "PURP")) { //if ((cn == "DLVP" || ....
                                    var sdf = new simpleDateFormat("dd \(h:m");
                                    var sdf2 = new simpleDateFormat("h:m )");
                                    var std = "", etd = "";
                                    if (Util.nvl(ld3.getFieldValue(li, "STEP_START"), "") != "")
                                        std = sdf.format(new Date(ld3.getFieldValue(li, "STEP_START").replaceAll(".", ":")));
                                    if (Util.nvl(ld3.getFieldValue(li, "STEP_END"), "") != "")
                                        etd = sdf2.format(new Date(ld3.getFieldValue(li, "STEP_END").replaceAll(".", ":")));
                                    else etd = stats[2] + ")";
                                    vl = std + "-" + etd;
                                }
                            }
                            if (!(cn == "DLVP" || cn == "PURP"))
                                ld3.setFieldValue(li, cn + "__STAT", vl);
                            else
                                ld3.setFieldValue(li, cn, vl);
                        }

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



