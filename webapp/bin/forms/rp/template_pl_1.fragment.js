sap.ui.jsfragment("bin.forms.rp.slsmn", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.timeInLong = (new Date()).getTime();

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
            title: Util.getLangText("titSalesManAna"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SLSMN1",
                    name: Util.getLangText("titSalesManAna"),
                    descr: Util.getLangText("titSalesManAna"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titSalesManAna");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: thatForm.helperFunc.getParas(),
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
                                dml: "select '' accno from dual",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["COL1", "COL2"],
                                canvasType: ReportView.CanvasType.VBOX,
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    // var oModel = this.getControl().getModel();
                                    // var bal = parseFloat(oModel.getProperty("BALANCE", currentRowContext));
                                    // if (bal >= 0)
                                    //     qv.getControl().getRows()[dispRow].getCells()[3].$().css("color", "green");
                                    // else
                                    //     qv.getControl().getRows()[dispRow].getCells()[3].$().css("color", "red");


                                },
                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                beforeLoadQry: function (sql) {
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
                                            var vb = new sap.m.VBox({ width: "-1px", items: [thatForm.qr] }).addStyleClass("sapUiSmallMargin");
                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {

                                            return thatForm.helperFunc.addQry1(qryObj, ps);
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQry1(qryObj);
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

    }
    ,
    loadData: function () {
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
        addQry1: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var ret = true;
            var sq =
                "begin " +
                "  commit; " +
                "end;";
            sq = thatForm.frm.parseString(sq);
            Util.doAjaxJson("sqlmetadata?", {
                sql: sq,
                ret: "NONE",
                data: null
            }, false).done(function (data) {
            });
            sq = "select from ...";
            sq = thatForm.frm.parseString(sq);
            var pars = Util.nvl(qryObj.rep.parameters, []);

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
            return ret;
        },
        getQry1: function (qryObj) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
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
                    // var dtx = JSON.parse("{" + dt.data + "}").data;  
                    var paras = {
                        mColParent: "PARENTACC",
                        mColCode: "ACCNO",
                        mColName: "NAME",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");
                    // YTD Balance to be hidden in case period from starting of the year

                    // ld.getColByName("PATH").mHideCol = true;
                    // ld.getColByName("ACCNO").mTitle = Util.getLangText("accNo");

                    // ld.getColByName("BALANCE").mUIHelper.display_width = "120";
                    // ld.getColByName("BALANCE").mUIHelper.data_type = "NUMBER";
                    // ld.getColByName("BALANCE").mUIHelper.display_format = "QTY_FORMAT";
                    // ld.getColByName("BALANCE").mTitle = Util.getLangText("periodicBalanceTxt") + "\n(" + sett["DEFAULT_CURRENCY"] + ")";
                    // ld.getColByName("BALANCE").mSummary = "SUM";
                    

                    var fntsize = Util.getLangDescrAR("12px", "16px");
                    paras["tableClass"] = "class=\"tbl1\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        // var st = "";
                        // if ((col == "ACCNO" || col == "NAME") && oData[rowno]["ACCNO"] != null)
                        //     st = "linkLabel";

                        return st;
                    }
                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        // if ((col == "ACCNO" || col == "NAME") && oData[rowno]["ACCNO"] != null) {
                        //     var sdf = new simpleDateFormat("MM/dd/yyyy");
                        //     var fromdt = sdf.format(thatForm.frm.objs["PL001@parameter.fromdate"].obj.getDateValue());
                        //     var todt = sdf.format(thatForm.frm.objs["PL001@parameter.todate"].obj.getDateValue());
                        //     st = "UtilGen.execCmd('testRep5 formType=dialog formSize=100%,100% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + oData[rowno]["ACCNO"] + " toacc=" + oData[rowno]["ACCNO"] + " fromdate=@" + fromdt + " todate=@" + todt + "', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                        // }
                        return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        paras["hideTotals"] = (thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                        var st = "padding-left:5px;padding-right:5px;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && oData[rowno]["PARENTACC"] != "")
                            st += "font-weight:bold;height:30px;vertical-align:bottom;";
                        if (oData[rowno]["ACCNO"] == null && col.endsWith("BALANCE"))
                            st += "vertical-align:top;";
                        if (oData[rowno]["ACCNO"] == null && col == "NAME")
                            st += "vertical-align:top;";
                        if (oData[rowno]["ACCNO"] == "-" && col == "NAME")
                            st += "vertical-align:top;";
                        if (oData[rowno]["ACCNO"] == "-" && col.endsWith("BALANCE"))
                            st += "vertical-align:top;font-weight:bold;font-size:14px;";
                        if (oData[rowno]["PARENTACC"] == "")
                            st += "font-weight:bold;height:40px;vertical-align:bottom!important;";
                        if (oData[rowno]["LEVELNO"] == -1)
                            st = "font-weight:bold;border-bottom:groove;background-color:lightgrey;";

                        return st;
                    }
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        // footerNode_fg["YTD_RATE"] = mapNode_fg["YTD_RATE"];
                    };
                    ld.parse("{" + dt.data + "}", true);

                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);
                }
            });
        }

    }
});



