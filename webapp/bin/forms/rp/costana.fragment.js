sap.ui.jsfragment("bin.forms.rp.costana", {
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

        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("titCostCentAnaReport"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "CC01", // Items Daily Sales
                    name: Util.getLangText("titCostCentAnaReport"),
                    descr: Util.getLangText("titCostCentAnaReport"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    // printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titCostCentAnaReport");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;
                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("CC01"),
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
                                            qr.setAutoDispRecords(thatForm.mainPage, { "S": 70, "M": 40, "L": 35, "XL": 20 });
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
                                            return thatForm.helperFunc.addQry(qryObj, ps, "CC01");
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
                costcent: {
                    colname: "costcent",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"costCent\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    showInPreview: false,
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        showValueHelp: true,
                        change: function (e) {

                            var vl = e.oSource.getValue();
                            thatForm.frm.setFieldValue(repCode + "@parameter.costcent", vl, vl, false);
                            var vlnm = Util.getSQLValue("select title from accostcent1 where CODE =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.csname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            Util.showSearchList("select code,title from accostcent1 order by path", "TITLE", "CODE", function (valx, val) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.costcent", valx, valx, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.csname", val, val, true);
                            });

                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                csname: {
                    colname: "csname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    showInPreview: false,
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
                exclVarious: {
                    colname: "exclVarious",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"exclVarious\",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
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
            var ev = (thatForm.frm.getFieldValue("parameter.exclVarious") == 'Y' ?
                " v.costcent is not null and " : " ");

            var sq = "select nvl(v.costcent,'(nil)') code ,nvl(cc.title,'various') title," +
                " v.accno,sum(debit-credit) balance,v.accno||'__BALANCE' ACCNO_BALANCE " +
                " from acaccount ac,accostcent1 cc,acvoucher2 v where " +
                ev + " v.accno=ac.accno and v.costcent=cc.code(+) " +
                " and v.vou_date>=:parameter.fromdate and v.vou_date<=:parameter.todate " +
                " group by  v.costcent,cc.title,v.accno order by v.costcent,v.accno ";
            // var sq = "select location_code,location_name,ord_date,ord_ship item,sum(:RTYPECOL) :REPCOLNAME , " +
            //     " TO_CHAR(ord_date,'DD/MM/RRRR') DAT,ord_ship||'__:REPCOLNAME' ITEM_BAL " +
            //     " from joined_corder where " +
            //     " ORD_DATE>=:parameter.fromdate " +
            //     " AND ORD_DATE<=:parameter.todate  " +
            //     " and (':parameter.ploc' like '%\"'||JOINED_CORDER.location_code||'\"%' ) " +
            //     " AND (ORD_REF=':parameter.pcust' OR RTRIM(':parameter.pcust') IS NULL) " +
            //     " AND (ord_type=':parameter.ptype' OR RTRIM(':parameter.ptype') IS NULL)" +
            //     " group by  location_code,location_name,ord_date ,ord_ship, " +
            //     " TO_CHAR(ord_date,'DD/MM/RRRR') ,ord_ship||'__:REPCOLNAME'" +
            //     " order by location_code,ord_date,ord_ship";
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
            var frm = thatForm.frm;
            var cmdLink = function (obj, rowno, colno, lctb, frm) {
                var mdl = thatForm.qr.getControl().getModel();
                var rr = thatForm.qr.getControl().getRows().indexOf(obj.getParent());

                var cont = thatForm.qr.getControl().getContextByIndex(rr);
                var rowid = mdl.getProperty("_rowid", cont);
                var code = Util.nvl(lctb.getFieldValue(rowid, "CODE"), "");
                // var ac = thatForm.qr.getControl().getRows()[rr].getCells()[0].getText().split("__");

                var sdf = new simpleDateFormat("MM/dd/yyyy");

                var fromdt = sdf.format(thatForm.frm.objs["CC01@parameter.fromdate"].obj.getDateValue());
                var todt = sdf.format(thatForm.frm.objs["CC01@parameter.todate"].obj.getDateValue());

                var st = "testRep5 formType=dialog formSize=100%,100% repno=0 para_PARAFORM=false para_EXEC_REP=true pcc=" + code + " fromdate=@" + fromdt + " todate=@" + todt;
                UtilGen.execCmd(st, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            }
            var cmdLink2 = function (obj, rowno, colno, lctb, frm) {
                var mdl = thatForm.qr.getControl().getModel();
                var rr = thatForm.qr.getControl().getRows().indexOf(obj.getParent());
                var cc = obj.getParent().indexOfCell(obj);
                var cont = thatForm.qr.getControl().getContextByIndex(rr);
                var rowid = mdl.getProperty("_rowid", cont);
                var code = Util.nvl(lctb.getFieldValue(rowid, "CODE"), "");
                var acno = lctb.cols[cc].mColName.split("__")[0];

                var sdf = new simpleDateFormat("MM/dd/yyyy");

                var fromdt = sdf.format(thatForm.frm.objs["CC01@parameter.fromdate"].obj.getDateValue());
                var todt = sdf.format(thatForm.frm.objs["CC01@parameter.todate"].obj.getDateValue());

                var st = "testRep5 formType=dialog formSize=100%,100% repno=0 para_PARAFORM=false para_EXEC_REP=true pcc=" + code + " paccno=" + acno + " fromdate=@" + fromdt + " todate=@" + todt;
                UtilGen.execCmd(st, UtilGen.DBView, obj, UtilGen.DBView.newPage);
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
                    var repcolname = "BALANCE";
                    ld.parseCol("{" + dt.data + "}");
                    // ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "50";
                    // ld.cols[ld.getColPos("TITLE")].mUIHelper.display_width = "200";

                    ld.cols[ld.getColPos("CODE")].ct_row = "Y";
                    ld.cols[ld.getColPos("TITLE")].ct_row = "Y";



                    // ld.cols[ld.getColPos("DAT")].ct_row = "Y";
                    // ld.cols[ld.getColPos("ORD_DATE")].ct_row = "Y";
                    // ld.cols[ld.getColPos("ORD_DATE")].mHideCol = true;
                    // ld.cols[ld.getColPos("DAT")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("ACCNO_BALANCE")].ct_col = "Y";

                    ld.cols[ld.getColPos("BALANCE")].ct_val = "Y";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_format = "MONEY_FORMAT";

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
                    var ditm = Util.execSQLWithData("select accno,name from acaccount order by path");
                    for (var di in ditm)
                        itms[ditm[di].ACCNO] = ditm[di].NAME;
                    var fltcols = ["DAT", "tot__" + repcolname];
                    for (var li = 0; li < ld2.cols.length; li++)
                        if (ld2.cols[li].mColName.endsWith("__" + repcolname)) {
                            var cn = ld2.cols[li].mColName.replaceAll("__" + repcolname, "");
                            ld2.cols[li].mTitle = cn + "-\n" + Util.nvl(itms[cn], '').substring(0, 30);
                            ld2.cols[li].mUIHelper.display_format = "MONEY_FORMAT";
                            ld2.cols[li].mUIHelper.display_align = "ALIGN_CENTER";
                            ld2.cols[li].mUIHelper.display_width = "100";
                            ld2.cols[li].valOnZero = "";
                            ld2.cols[li].mSummary = "SUM";
                            ld2.cols[li].commandLinkClick = cmdLink2;
                            fltcols.push(ld2.cols[li].mColName);

                        }
                    ld2.cols[ld2.getColPos("TITLE")].mSummary = "COUNT_UNIQUE";
                    ld2.cols[ld2.getColPos("TITLE")].count_unique_label = "txtCounts";
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].mTitle = Util.getLangText("amountTxt");
                    ld2.cols[ld2.getColPos("tot__" + repcolname)].valOnZero = "";
                    ld2.cols[ld.getColPos("CODE")].mUIHelper.display_width = "50";
                    ld2.cols[ld.getColPos("TITLE")].mUIHelper.display_width = "200";
                    ld2.cols[ld.getColPos("TITLE")].commandLinkClick = cmdLink;
                    ld2.cols[ld.getColPos("CODE")].commandLinkClick = cmdLink;

                    thatForm.frm.objs["CC01@qry2"].filterCols = fltcols;
                    qr.showToolbar.filterCols = fltcols;
                    qr.mLctb.parse(dt2, true);
                    qr.loadData();
                    qr.getControl().setFirstVisibleRow(0);
                    qr.getControl().setFixedColumnCount(2);

                }
            });
        },

    },
    loadData: function () {
    }

});



