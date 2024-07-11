sap.ui.jsfragment("bin.forms.rm.su", {
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
            title: "PL By Productions",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SU001",
                    name: Util.getLangText("repMonthlySup"),
                    descr: Util.getLangText("repMonthlySupDescr"),
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
                        parameters: thatForm.helperFunc.getParas("RMPL01"),
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
                                            thatForm.qr = new sap.ui.core.HTML({}).addStyleClass("sapUiSmallMargin");
                                            var vb = new sap.m.VBox({
                                                width: "1000px", //(showmonth == "Y" ? "1500px" : "-1px"),
                                                items: [thatForm.qr]
                                            }).addStyleClass("sapUiSmallMargin");
                                            // this.toolbar = that.getToolbar();
                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            return thatForm.helperFunc.addQryPL3(qryObj, ps, "RMPL01");

                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryPL3(qryObj);

                                        }
                                    },
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
                                            return thatForm.qrC.$().outerHTML();
                                        },
                                        afterAddOBject: function () {
                                            Util.destroyID("graphAccnoPop" + thatForm.timeInLong, view);
                                            Util.destroyID("graphAccno" + thatForm.timeInLong, view);
                                            this.obj.removeAllContent();

                                            thatForm.qrC = new sap.viz.ui5.controls.VizFrame(view.createId("graphAccno" + thatForm.timeInLong), {
                                                uiConfig: { applicationSet: 'fiori' },
                                                vizType: "column",
                                                height: "300px",
                                                width: "100%",
                                                legendVisible: true

                                            });
                                            var vb = new sap.m.VBox({
                                                width: "-1px", //(showmonth == "Y" ? "1500px" : "-1px"),
                                                items: [
                                                    new sap.viz.ui5.controls.Popover(view.createId("graphAccnoPop" + thatForm.timeInLong)),
                                                    thatForm.qrC
                                                ]
                                            }).addStyleClass("sapUiSmallMargin");
                                            // this.toolbar = that.getToolbar();

                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            return thatForm.helperFunc.addQryGraph(qryObj, ps, "RMPL01");
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryGraph(qryObj);

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
                }
            };

            return para;
        },
        addQryPL3: function (qryObj, ps, repCode) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var bk = UtilGen.getBackYears(fromdt, todt);

            var sq = "SELECT C_CUS_NO CODE,INV_REFNM NAME,TO_CHAR(DAT,'RRRR/MM') MNTH, " +
                " TO_CHAR(DAT,'RRRR_MM')||'__AMOUNT' MNTH_BAL,SUM(PKCOST*ALLQTY) AMOUNT, " +
                " 1 levelno,'' parentacc ,0 childcount FROM JOINED_SIMPLE " +
                " WHERE INVOICE_CODE=11 GROUP BY C_CUS_NO,INV_REFNM,TO_CHAR(DAT,'RRRR/MM'),TO_CHAR(DAT,'RRRR_MM')||'__AMOUNT' " +
                " ORDER BY C_CUS_NO,MNTH";
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
                    var paras = {
                        mColParent: "PARENTACC",
                        mColCode: "CODE",
                        mColName: "NAME",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    that.ld = new LocalTableData();
                    var ld = that.ld;
                    ld.parseCol("{" + dt.data + "}");
                    ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("NAME")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("CODE")].ct_row = "Y";
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

                    // ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";                    
                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();

                    var lc = ld;
                    for (var li = 0; li < lc.cols.length; li++) {
                        if (Util.nvl(lc.cols[li].ct_val, "N") == "Y") {
                            var tit = parseInt(lc.cols[li].mTitle.split("_")[1]);
                            lc.cols[li].mTitle = (UtilGen.DBView.sLangu == "AR" ? thatForm.monthsAr[tit - 1] : thatForm.monthsEn[tit - 1]) + "-" + lc.cols[li].mTitle.split("_")[0];
                        }
                    }
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
                        var st = "padding-left:10px;padding-right:10px;height:24px;";
                        if (oData[rowno]["NAME"].toUpperCase() == "TOTAL")
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
                        if (col.indexOf("AMOUNT") >= 0)
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
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
        addQryGraph: function (qryObj, ps, repCode) {
            return true;
        },
        getQryGraph: function () {
            var thatForm = this.thatForm;
            var that = this;
            var view = thatForm.view;
            if (this.ld == undefined) return;
            var ld = this.ld;
            var dtx = ld.getData(true);
            var ob = view.byId("graphAccno" + thatForm.timeInLong);//thatForm.frm.getObject("01@qry3.accno").obj.getContent()[0];
            var dimensions = [{
                name: "NAME",
                value: "{NAME}"
            }];
            var measures = [];
            for (var li = 0; li < ld.cols.length; li++)
                if (ld.cols[li].mColName.endsWith("AMOUNT") &&
                    !ld.cols[li].mColName.startsWith("tot__"))
                    measures.push({
                        name: ld.cols[li].mTitle,
                        value: "{" + ld.cols[li].mColName + "}"
                    });
            this.dataSetDone = (ob.getModel() != undefined);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(dtx);
            ob.setModel(undefined);
            ob.setModel(oModel);

            ob.setDataset(new sap.viz.ui5.data.FlattenedDataset({
                dimensions: dimensions,
                measures: measures,
                data: {
                    path: "/"
                }
            }));

            if (Util.nvl(this.dataSetDone, false) == false) {
                var formatPattern = sap.viz.ui5.format.DefaultPattern;
                var vls = []
                for (var mi in measures)
                    vls.push(measures[mi].name);

                var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': vls
                });

                var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["NAME"]
                });
                ob.addFeed(feedCategoryAxis);
                ob.addFeed(feedValueAxis);

                ob.setVizProperties({
                    general: {
                        layout: {
                            padding: 0.04
                        }
                    },
                    valueAxis: {
                        label: {
                            formatString: '',
                        },
                        title: {
                            visible: true
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: true
                        }
                    },
                    plotArea: {
                        dataLabel: {
                            visible: true,
                            formatString: '',
                            style: {
                                color: null
                            }
                        }
                    },
                    legendGroup: { layout: { position: 'top' } },
                    legend: {
                        visible: true,
                        title: {
                            visible: true
                        }
                    },
                    title: {
                        visible: false,
                        text: ''
                    }
                });
                var pop = view.byId("graphAccnoPop" + thatForm.timeInLong);
                pop.connect(ob.getVizUid());
                this.dataSetDone = true;
            }

            else this.dataSetDone = undefined;
        }

    },
    loadData: function () {
    }

});



