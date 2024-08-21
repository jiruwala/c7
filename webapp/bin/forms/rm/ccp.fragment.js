sap.ui.jsfragment("bin.forms.rm.ccp", {
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
                    code: "CCP01",
                    name: Util.getLangText("Consumption1"),
                    descr: Util.getLangText("Consumption1Descr"),
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
                        parameters: thatForm.helperFunc.getParas("CCP01"),
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
                                            return thatForm.helperFunc.addQryPL3(qryObj, ps, "CCP01");

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
                    default_value: "qty",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "qty",
                    },
                    list: "@qty/Quantity,cost/Cost",
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
            var bk = UtilGen.getBackYears(fromdt, todt);
            var insx = "declare " +
                " cursor cst is select I.packd,I.unitd,I.pack,p.refer,i.descr,nvl(iss.iss_ucost,i.pkaver) ucost,ISS.ISSUED_QTY," +
                "     (i.pkaver/i.pack)*I.pack sprice ,SUM(p.allqty *C.TQTY) ALLQTY  ,0 ,SUM(p.allqty *C.TQTY) QTY   from masterasm p,items i ,C_ORDER1 C," +
                "     (SELECT REFER ISS_REFER,SUM(ALLQTY) ISSUED_QTY, (sum((pkcost*allqty))/sum(allqty)) iss_ucost FROM INVOICE2 WHERE INVOICE_CODE=25 AND TYPE=27 GROUP BY REFER) ISS" +
                "    where p.BASEITEM=C.ORD_SHIP and refer=reference AND REFER=ISS_REFER(+) and " +
                " ord_date>=" + Util.toOraDateString(fromdt) +
                " and ord_date<=" + Util.toOraDateString(todt) +
                "    AND C.ORD_DATE<=(SELECT MAX(DAT) FROM INVOICE2 WHERE INVOICE_CODE=25 AND TYPE=27 " +
                " and dat>=" + Util.toOraDateString(fromdt) +
                " and dat<=" + Util.toOraDateString(todt) + " )" +
                "    GROUP BY I.packd,I.unitd,I.pack,P.refer,i.descr,i.pkaver/i.pack,i.prd_dt,i.exp_dt,ISSUED_QTY,iss.iss_ucost,i.pkaver" +
                "    ORDER BY P.REFER;" +
                " begin" +
                " delete from temporary where idno=12001 and usernm='01';" +
                " for x in cst loop" +
                "  insert into temporary(usernm,idno,field1,field2,field3,field4,field5,field6,field7,field8,field9,field10,field11) values " +
                "   ('01',12001, x.refer, x.descr, x.packd, x.pack, x.ucost, x.qty, " +
                "   x.issued_qty,x.ucost*x.ISSUED_QTY , x.ucost*x.qty, (x.ucost*x.issued_qty)-(x.ucost*x.qty), (x.ISSUED_QTY-x.qty) );" +
                " end loop;" +
                " end;";
            var dt = Util.execSQL(insx);
            if (dt.ret != "SUCCESS")
                FormView.err("Error in executing sqls");
            var sq = "select field1 refer,field2 descr,field3 packd, to_number(field4) pack, " +
                "to_number(field5) PKCOST,to_number(field6) PH_QTY,to_number(field7) ISS_QTY," +
                "to_number(field8) ISS_COST,to_number(field9) ph_cost ,to_number(field10) varCost ,to_number(field11) varQty,'' varRate, " +
                "0 childcount, 1 levelno , '' parentacc from temporary where idno=12001  " +
                " order by field1 ";
            ;
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
                    var paras = {
                        mColParent: "PARENTACC",
                        mColCode: "REFER",
                        mColName: "DESCR",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var rt = thatForm.frm.getFieldValue("parameter.reptype");
                    var ld = new LocalTableData();
                    var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
                    var todt = thatForm.frm.getFieldValue("parameter.todate");

                    ld.parseCol("{" + dt.data + "}");

                    ld.cols[ld.getColPos("REFER")].mUIHelper.display_width = "180";

                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("PACKD")].mUIHelper.display_width = "120";
                    ld.cols[ld.getColPos("PACK")].mUIHelper.display_width = "120";

                    ld.cols[ld.getColPos("VARRATE")].mUIHelper.display_align = "center"

                    ld.cols[ld.getColPos("PH_QTY")].mUIHelper.display_format = "QTY_FORMAT";
                    ld.cols[ld.getColPos("ISS_QTY")].mUIHelper.display_format = "QTY_FORMAT";
                    ld.cols[ld.getColPos("VARQTY")].mUIHelper.display_format = "QTY_FORMAT";

                    ld.cols[ld.getColPos("VARCOST")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("ISS_COST")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("PH_COST")].mUIHelper.display_format = "MONEY_FORMAT";

                    ld.cols[ld.getColPos("PH_QTY")].mTitle = Util.getLangText("rptCcpPhQty");
                    ld.cols[ld.getColPos("ISS_QTY")].mTitle = Util.getLangText("rptCcpIssQty");
                    ld.cols[ld.getColPos("VARQTY")].mTitle = Util.getLangText("rptCcpVarQty");
                    ld.cols[ld.getColPos("VARRATE")].mTitle = Util.getLangText("rptCcpVarRate");

                    ld.cols[ld.getColPos("REFER")].mHideCol = true;
                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("PKCOST")].mHideCol = true;
                    ld.cols[ld.getColPos("PACK")].mHideCol = true;

                    if (rt == "qty") {
                        ld.cols[ld.getColPos("ISS_COST")].mHideCol = true;
                        ld.cols[ld.getColPos("VARCOST")].mHideCol = true;
                        ld.cols[ld.getColPos("PH_COST")].mHideCol = true;
                    } else {
                        ld.cols[ld.getColPos("ISS_QTY")].mHideCol = true;
                        ld.cols[ld.getColPos("VARQTY")].mHideCol = true;
                        ld.cols[ld.getColPos("PH_QTY")].mHideCol = true;

                    }
                    ld.cols[ld.getColPos("PACKD")].mHideCol = true;

                    // ld.cols[ld.getColPos("")].mHideCol = true;
                    // ld.cols[ld.getColPos("")].mHideCol = true;



                    ld.parse("{" + dt.data + "}", true);

                    for (var li = 0; li < ld.rows.length; li++) {
                        var vr = 0;
                        var phqty = ld.getFieldValue(li, "PH_QTY");
                        var issqty = ld.getFieldValue(li, "ISS_QTY");
                        if (rt != "qty") {
                            phqty = ld.getFieldValue(li, "PH_COST");
                            issqty = ld.getFieldValue(li, "ISS_COST");

                        }
                        if (issqty == 0)
                            vr = 0;
                        else
                            vr = Math.round(100 - ((phqty / issqty) * 100));
                        if (vr == 0)
                            vr = "";
                        else
                            if (vr < 0)
                                vr = "(" + Math.abs(vr) + ") %";
                            else
                                vr = vr + " %";
                        ld.setFieldValue(li, "VARRATE", vr);

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
                        var df = new simpleDateFormat(sett["SHORT_DATE_FORMAT"]);
                        if ((col == "REFER" || col == "DESCR") && oData[rowno]["REFER"] != null) {
                            // var showList = "show_list select ";
                            // st = "UtilGen.execCmd('', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                            st = "var mn = new sap.m.Menu({" +
                                "items: [new sap.m.MenuItem({ text: 'Stock card..',press:function(){" +
                                " UtilGen.execCmd('rp.in.st formType=dialog formSize=100%,100% repno=1 para_PARAFORM=false para_EXEC_REP=true prefer=:item fromdate=@:fromdate', UtilGen.DBView, this, UtilGen.DBView.newPage);" +
                                "} })]" +
                                "}); mn.openBy(this);"
                            st = st.replaceAll(":item", oData[rowno]["REFER"]
                                .replaceAll(" ", "%20"))
                                .replaceAll(":fromdate", df.format(fromdt));
                        }
                        return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        var st = "padding-left:10px;padding-right:10px;height:24px;";
                        if (oData[rowno]["CODE"] == "prodqty")
                            st += "font-weight:bold;color:blue;";

                        // if (oData[rowno]["CODE"].startsWith("com_") ||
                        //     oData[rowno]["CODE"] == "avgsales")
                        //     st += "vertical-align:top;font-weight:bold;";
                        return st;
                    }
                    paras["fnOnCellValue"] = function (oData, rowno, col, cellValue) {
                        var vl = cellValue;
                        if ((col == "ISS_QTY" || col == "VARQTY" || col == "PH_QTY")
                            && cellValue != "")
                            vl = cellValue + " " + oData[rowno]["PACKD"].toLowerCase();
                        if ((col == "ISS_COST" || col == "VARCOST" || col == "PH_COST")
                            && cellValue != "")
                            vl = cellValue + " " + sett["DEFAULT_CURRENCY"];
                        return vl;
                    };
                    paras["formatNumber"] = function (oData, rowno, col) {
                        if (col.indexOf("cost") >= 0)
                            return new DecimalFormat(sett['FORMAT_MONEY_1']);
                        return undefined;
                    }
                    paras["reFormatNumber"] = true;
                    paras["hideSubTotals"] = true;
                    paras["hideTotals"] = false; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        // footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
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



