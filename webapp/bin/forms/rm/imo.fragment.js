sap.ui.jsfragment("bin.forms.rm.imo", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.timeInLong = (new Date()).getTime();
        this.monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

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
            title: "Product Monthly Sales",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "IMO01",
                    name: Util.getLangText("repImo1"),
                    descr: Util.getLangText("repImo1Descr"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    printCSS: "print2.css",
                    onSubTitHTML: function () {
                        // var up = thatForm.frm.getFieldValue("parameter.unposted");
                        // var tbstr = Util.getLangText("finStat1") + ": " + thatForm.frm.getFieldValue("parameter.acname");
                        // var ua = Util.getLangText("unAudited");
                        // var cs = thatForm.frm.getFieldValue("parameter.costcent");
                        // var csnm = thatForm.frm.getFieldValue("parameter.csname");
                        // var ht = "<div class='reportTitle'>" + tbstr + (up == "Y" ? " (" + ua + ") " : "") + "</div > ";
                        // if (cs != "")
                        //     ht += "<div class='reportTitle2'>" + Util.getLangText("costCent") + " : " + cs + "-" + csnm + "</div > ";
                        // return ht;
                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportUtils.Report.getMainParaContainerSettings(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("IMO01"),
                        print_templates: [
                            {
                                title: "PL Report",
                                reportFile: "trans_1",
                            }
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
                                    accno: {
                                        colname: "accno",
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
                                        other_settings: {},
                                        onPrintField: function () {
                                            return thatForm.qr.getContent();
                                        },
                                        afterAddOBject: function () {
                                            var showmonth = thatForm.frm.getFieldValue("parameter.showMonth");
                                            thatForm.qr = new sap.ui.core.HTML({}).addStyleClass("sapUiSmallMargin");
                                            var vb = new sap.m.VBox({
                                                width: "1500px", //(showmonth == "Y" ? "1500px" : "-1px"),
                                                items: [thatForm.qr]
                                            }).addStyleClass("sapUiSmallMargin");
                                            // this.toolbar = that.getToolbar();
                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            return thatForm.helperFunc.addQryPL3(qryObj, ps, "IMO01");

                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryPL3(qryObj);

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
                    list: "@QTY/Quantity,SALES/Sales",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
            };

            return para;
        },
        addQryPL3: function (qryObj, ps, repCode) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var todt = thatForm.frm.getFieldValue("parameter.rpttype");
            var bk = UtilGen.getBackYears(fromdt, todt);
            // this.codes = this.assignCodes();
            var delStr = "delete from temporary where usernm='01' and idno=66105;";
            var insx = "";
            var rt = thatForm.frm.getFieldValue("parameter.reptype");
            var str = (rt != "QTY" ? "*sale_price" : "");
            var sq = "SELECT ORD_SHIP CODE, I.DESCR, SUM(TQTY" + str + ") QTY," +
                " TO_CHAR(ORD_DATE,'RRRR/MM') MNTH,TO_CHAR(ORD_DATE,'RRRR_MM')||'__QTY' MNTH_BAL," +
                " i.packd, 1 levelno,'' parentacc ,0 CHILDCOUNT " +
                " FROM C_ORDER1 O,ITEMS I " +
                " WHERE I.REFERENCE=O.ORD_SHIP " +
                " GROUP BY ORD_SHIP,TO_CHAR(ORD_DATE,'RRRR/MM'),I.DESCR,TO_CHAR(ORD_DATE,'RRRR_MM')||'__QTY',i.packd " +
                " ORDER BY TO_CHAR(ORD_DATE,'RRRR/MM'),ord_ship";
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
        getQryPL3: function (qryObj) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
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
                    var rt = thatForm.frm.getFieldValue("parameter.reptype");
                    var paras = {
                        mColParent: "PARENTACC",
                        mColCode: "CODE",
                        mColName: "DESCR",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");

                    ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "250";
                    ld.cols[ld.getColPos("PACKD")].mUIHelper.display_width = "60";
                    ld.cols[ld.getColPos("CODE")].ct_row = "Y";
                    ld.cols[ld.getColPos("CODE")].mTitle = Util.getLangText("txtCode");
                    ld.cols[ld.getColPos("DESCR")].ct_row = "Y";
                    ld.cols[ld.getColPos("CODE")].mHideCol = true;
                    ld.cols[ld.getColPos("DESCR")].mTitle = Util.getLangText("titleTxt");
                    ld.cols[ld.getColPos("PARENTACC")].ct_row = "Y";
                    ld.cols[ld.getColPos("LEVELNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("CHILDCOUNT")].ct_row = "Y";
                    ld.cols[ld.getColPos("PACKD")].ct_row = "Y";

                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos("QTY")].ct_val = "Y";
                    ld.cols[ld.getColPos("QTY")].mSummary = "SUM";
                    ld.cols[ld.getColPos("QTY")].data_type = "number";
                    ld.cols[ld.getColPos("QTY")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("QTY")].mUIHelper.display_width = "100";

                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;

                    if (rt != "QTY")
                        ld.cols[ld.getColPos("PACKD")].mHideCol = true;

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();
                    ld.sortCol(ld.getColPos("DESCR"), true);
                    var cx = ld.addColumn("AGR");
                    cx.mColClass = "sap.m.Label";
                    cx.mUIHelper.data_type = "string";
                    cx.mUIHelper.display_align = Util.getLangDescrAR("end", "begin");
                    cx.mUIHelper.display_format = "";
                    cx.mUIHelper.display_width = 100;
                    cx.mUIHelper.display_style = "";
                    cx.mTitle = Util.getLangText("txtAvg");

                    UtilGen.setAvg(ld, "QTY", "AGR", (rt != "QTY" ? sett['FORMAT_MONEY_1'] : undefined));

                    UtilGen.getMonthTitleCrossTable(ld);
                    var fntsize = Util.getLangDescrAR("14px", "16px");
                    paras["tableClass"] = "class=\"tbl1 bottom_border\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
                        return st;
                    }
                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        // if ((col == "CODE" || col == "DESCR") && oData[rowno]["CODE"] != null) {
                        //     var sq1="";
                        //     st = "UtilGen.execCmd('', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                        // }
                        return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        if (rowno == -1)
                            return "border:groove;";
                        var st = "padding-left:10px;padding-right:10px;height:24px;";
                        if (oData[rowno]["DESCR"] == Util.getLangText("totalTxt"))
                            st += "vertical-align:center;font-weight:bold;border-top:groove;background-color:lightgrey;";
                        return st;
                    }
                    paras["fnOnCellValue"] = function (oData, rowno, col, cellValue) {
                        var vl = cellValue;
                        // if (col == "BALANCE" && cellValue != "")
                        //     vl = oData[rowno]["POST_VAL"] + " " + cellValue + ""
                        return vl;
                    };
                    paras["formatNumber"] = function (oData, rowno, col) {
                        if (rt != "QTY")
                            return new DecimalFormat(sett['FORMAT_MONEY_1']);
                        return undefined;
                    }
                    paras["reFormatNumber"] = true;
                    paras["hideSubTotals"] = true;
                    paras["hideTotals"] = false; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["showFooter"] = true;
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        // footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                    };
                    paras["fnOnFooter"] = function (footer) {
                        var dfq1 = new DecimalFormat("#,##0");
                        var cnt = 0, tot = 0;
                        for (var fi in footer)
                            if (fi.endsWith("__QTY") && fi != "tot__QTY") {
                                tot += Util.extractNumber(footer[fi]);
                                cnt++;
                            }
                        if (cnt == 0) return;
                        var avg = tot / cnt;
                        if (avg < 0) avg = dfq1.format(Math.abs(avg)); else avg = dfq1.format(avg);
                        footer["AGR"] = avg;
                    };

                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
    },
    loadData: function () {
    }

})
    ;



