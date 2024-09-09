sap.ui.jsfragment("bin.forms.rp.slscol", {
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
                    printCSS: "print2.css",
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
                                showType: FormView.QueryShowType.FORM,
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
                                filterCols: ["COL1", "COL2"],
                                canvasType: ReportView.CanvasType.SCROLLCONTAINER,
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
                                        other_settings: { vertical: true },
                                        onPrintField: function () {
                                            return thatForm.qr.getContent();
                                        },
                                        afterAddOBject: function () {
                                            thatForm.qr = new sap.ui.core.HTML({}).addStyleClass("sapUiSmallMargin");
                                            var vb = new sap.m.ScrollContainer({ vertical: true, width: "1500px", height: "auto", content: [thatForm.qr] }).addStyleClass("sapUiSmallMargin");
                                            this.obj.addContent(vb);
                                            this.obj.addContent(new sap.m.VBox({ height: "100px" }));

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
            // var sq =
            //     "begin " +
            //     "  commit; " +
            //     "end;";
            // sq = thatForm.frm.parseString(sq);
            // Util.doAjaxJson("sqlmetadata?", {
            //     sql: sq,
            //     ret: "NONE",
            //     data: null
            // }, false).done(function (data) {
            // });
            var sq = "SELECT '' PARENTACC ,1 LEVELNO , 0 CHILDCOUNT, j.SLSMN,SLSMN_NAME," +
                " sum(allqty/pack) pkqty,SUM(((PRICE+ADD_AMT_GROSS)/PACK)*(QTYOUT-QTYIN)) SAL_AMT," +
                " NVL ( (col.amt), 0) COLL_AMT,0 avgsales FROM JOINED_PUR j, ( " +
                " SELECT slsmn,nvl(sum(credit),0) amt from acc_transaction_up where vou_code=2 group by slsmn) col  " +
                "" +
                " WHERE j.INVOICE_CODE=21 " +
                " and j.slsmn=col.slsmn(+) " +
                " GROUP BY j.SLSMN,j.SLSMN_NAME,NVL ( (col.amt), 0) " +
                " ORDER BY 1 ";
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
                        mColCode: "SLSMN",
                        mColName: "SLSMN_NAME",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");
                    // YTD Balance to be hidden in case period from starting of the year
                    ld.getColByName("PARENTACC").mHideCol = true;
                    ld.getColByName("LEVELNO").mHideCol = true;
                    ld.getColByName("CHILDCOUNT").mHideCol = true;
                    
                    ld.getColByName("SLSMN").mTitle = Util.getLangText("txtNo");
                    ld.getColByName("SLSMN").mUIHelper.display_width = "60";

                    ld.getColByName("SLSMN_NAME").mTitle = Util.getLangText("txtSalesPerson");
                    ld.getColByName("SLSMN_NAME").mUIHelper.display_width = "200";

                    ld.getColByName("PKQTY").mUIHelper.display_width = "100";
                    ld.getColByName("PKQTY").mUIHelper.display_align = "ALIGN_CENTER";
                    ld.getColByName("PKQTY").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("PKQTY").mUIHelper.display_format = "QTY_FORMAT";
                    ld.getColByName("PKQTY").mTitle = Util.getLangText("txtSalm3Qty");

                    ld.getColByName("AVGSALES").mUIHelper.display_width = "100";
                    ld.getColByName("AVGSALES").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("AVGSALES").mUIHelper.display_format = "QTY_FORMAT";
                    ld.getColByName("AVGSALES").mTitle = Util.getLangText("txtAvgSalesM3");

                    ld.getColByName("SAL_AMT").mUIHelper.display_width = "150";
                    ld.getColByName("SAL_AMT").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("SAL_AMT").mUIHelper.display_format = "MONEY_FORMAT";
                    ld.getColByName("SAL_AMT").mTitle = Util.getLangText("txtSellAmt") + "\n(" + sett["DEFAULT_CURRENCY"] + ")";
                    ld.getColByName("COLL_AMT").mTitle = Util.getLangText("txtCollAmt") + "\n(" + sett["DEFAULT_CURRENCY"] + ")";
                    ld.getColByName("COLL_AMT").mUIHelper.display_width = "150";
                    ld.getColByName("COLL_AMT").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("COLL_AMT").mUIHelper.display_format = "MONEY_FORMAT";

                    ld.getColByName("COLL_AMT").mSummary = "SUM";
                    ld.getColByName("SAL_AMT").mSummary = "SUM";

                    var fntsize = Util.getLangDescrAR("12px", "16px");
                    paras["tableClass"] = "class=\"tbl1\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
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
                        var st = "padding-left:10px;padding-right:10px;height:24px;";
                        paras["hideTotals"] = false;
                        if (oData[rowno]["LEVELNO"] == -1)
                            st = "font-weight:bold;border-bottom:groove;background-color:lightgrey;";

                        return st;
                    }
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        // footerNode_fg["YTD_RATE"] = mapNode_fg["YTD_RATE"];                        
                    };
                    paras["fnOnFooter"] = function (footer) {

                        footer["LEVELNO"] = -1;
                    };
                    paras["showFooter"] = true;

                    ld.parse("{" + dt.data + "}", true);

                    for (var i = 0; i < ld.rows.length; i++)
                        if (ld.getFieldValue(i, "PKQTY") > 0)
                            ld.setFieldValue(i, "AVGSALES",
                                (ld.getFieldValue(i, "SAL_AMT") / ld.getFieldValue(i, "PKQTY")))

                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);
                }
            });
        }

    }
});



