sap.ui.jsfragment("bin.forms.rm.rmpl", {
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
                    code: "RMPL01",
                    name: Util.getLangText("finStat3"),
                    descr: Util.getLangText("finStat3Descr"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var up = thatForm.frm.getFieldValue("parameter.unposted");
                        var tbstr = Util.getLangText("finStat1") + ": " + thatForm.frm.getFieldValue("parameter.acname");
                        var ua = Util.getLangText("unAudited");
                        var cs = thatForm.frm.getFieldValue("parameter.costcent");
                        var csnm = thatForm.frm.getFieldValue("parameter.csname");
                        var ht = "<div class='reportTitle'>" + tbstr + (up == "Y" ? " (" + ua + ") " : "") + "</div > ";
                        if (cs != "")
                            ht += "<div class='reportTitle2'>" + Util.getLangText("costCent") + " : " + cs + "-" + csnm + "</div > ";
                        return ht;
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
                                            var showmonth = thatForm.frm.getFieldValue("parameter.showMonth");
                                            thatForm.qr = new sap.ui.core.HTML({}).addStyleClass("sapUiSmallMargin");
                                            var vb = new sap.m.VBox({
                                                width: "1500px", //(showmonth == "Y" ? "1500px" : "-1px"),
                                                items: [thatForm.qr]
                                            }).addStyleClass("sapUiSmallMargin");
                                            // this.toolbar = that.getToolbar();
                                            this.obj.addContent(vb);
                                            thatForm.qr.attachBrowserEvent("click", function (ev) {
                                                console.log(ev);
                                            });

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            var showmonth = thatForm.frm.getFieldValue("parameter.showMonth");
                                            if (showmonth == "Y")
                                                return thatForm.helperFunc.addQryPL3_1(qryObj, ps, "RMPL01");

                                            return thatForm.helperFunc.addQryPL3(qryObj, ps, "RMPL01");

                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            var showmonth = thatForm.frm.getFieldValue("parameter.showMonth");
                                            if (showmonth == "Y")
                                                return thatForm.helperFunc.getQryPL3_1(qryObj);

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
                showMonth: {
                    colname: "showMonth",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"txtBreakMonthly\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "N",
                    other_settings: { selected: false, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
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
            this.codes = this.assignCodes();
            var delStr = "delete from temporary where usernm='01' and idno=66105;";
            var insx = "insert into temporary(usernm,idno,field1,field2,field3," +
                " field4,field5,field6,field7,field8 ) values " +
                "('01',66105,:pos,:code,:descr," +
                ":levelno,:parentacc,:balance,:post_val,round(:balance,3)||' '||:post_val);";
            var pos = 1; var amt = 0; var ins = [];
            var getBalance = function (pCod) {
                var acs = Util.getSQLValue("select nvl(max(para_value),'') from c7_rep_paras where repcode='" + repCode + "' and para_name=" + Util.quoted(pCod));
                if (acs == "") return 0;
                var bl = 0;
                var acdt = Util.execSQLWithData("select accno,path from acaccount where '" + acs + "' like '%\"'||accno||'\"%' order by path");
                if (acdt == undefined || acdt.length == 0) return 0;
                for (ai in acdt) {
                    var bl1 = Util.getSQLValue("select nvl(sum(debit-credit),0) from acc_transaction_up where " +
                        " vou_date>=" + Util.toOraDateString(fromdt) +
                        " and vou_date<=" + Util.toOraDateString(todt) +
                        " and path like '" + (acdt[ai].PATH + "%'"));
                    bl += (pCod == "totsales" ? bl1 * -1 : bl1);
                }

                return bl;
            }
            var insSq = function (cod, pos) {
                var sq = insx.replaceAll(":code", Util.quoted(cod.code))
                    .replaceAll(":descr", Util.quoted(Util.getLangText(cod.descr)))
                    .replaceAll(":levelno", Util.quoted(cod.levelno))
                    .replaceAll(":parentacc", Util.quoted(cod.parentacc))
                    .replaceAll(":balance", Util.quoted(cod.balance))
                    .replaceAll(":post_val", Util.quoted(cod.post_val))
                    .replaceAll(":balance", cod.balance)
                    .replaceAll(":pos", pos)
                    // .replaceAll(":", Util.quoted(""))
                    ;
                return sq;

            }
            var totqty = 0; var sqls = "";
            for (var ai in this.codes) {
                var balance = 0;
                var cod = this.codes[ai];
                if (cod.code == "prodqty") {
                    totqty = Util.getSQLValue("select sum(tqty) from c_order1 where saleinv is not null and " +
                        " ord_date>=" + Util.toOraDateString(fromdt) +
                        " and ord_date<=" + Util.toOraDateString(todt)
                    );
                    cod["balance"] = totqty;
                }
                if (cod.code == "purchase") {
                    cod["balance"] = Util.getSQLValue("select nvl(sum(inv_amt-disc_amt),0) from pur1  where invoice_code=11 and " +
                        " invoice_date>=" + Util.toOraDateString(fromdt) +
                        " and invoice_date<=" + Util.toOraDateString(todt)
                    );

                }
                if (cod.code == "totsales") {
                    cod["balance"] = Util.getSQLValue("select NVL(SUM(((PRICE+add_amt_gross)/PACK)*ALLQTY),0) from pur2  where invoice_code=21 and " +
                        " dat>=" + Util.toOraDateString(fromdt) +
                        " and dat<=" + Util.toOraDateString(todt)

                    );
                }
                if (cod.code == "discount") {
                    cod["balance"] = Util.getSQLValue("select NVL(SUM(DISC_AMT_GROSS*ALLQTY),0) from pur2  where invoice_code=21 and " +
                        " dat>=" + Util.toOraDateString(fromdt) +
                        " and dat<=" + Util.toOraDateString(todt)
                    );
                }
                if (cod.code == "expenses_1" ||
                    cod.code == "expenses_2" || cod.code == "totsales" ||
                    cod.code == "totdisc")
                    cod["balance"] = getBalance(cod.code);
                if (cod.code == "com_1")
                    cod["balance"] = (totqty == 0 ? 0 :
                        this.getAssignCode("purchase").balance / totqty);
                if (cod.code == "com_2")
                    cod["balance"] = (totqty == 0 ? 0 :
                        this.getAssignCode("expenses_1").balance / totqty);
                if (cod.code == "com_3")
                    cod["balance"] = (totqty == 0 ? 0 :
                        this.getAssignCode("expenses_2").balance / totqty);
                if (cod.code == "com_4")
                    cod["balance"] = (totqty == 0 ? 0 :
                        (this.getAssignCode("expenses_1").balance +
                            this.getAssignCode("expenses_2").balance) / totqty);
                if (cod.code == "netsales")
                    cod["balance"] = (this.getAssignCode("totsales").balance -
                        this.getAssignCode("totdisc").balance);
                if (cod.code == "avgsales")
                    cod["balance"] = (totqty == 0 ? 0 :
                        this.getAssignCode("netsales").balance / totqty);
                if (cod.code == "netcostm3")
                    cod["balance"] = (totqty == 0 ? 0 :
                        (this.getAssignCode("purchase").balance +
                            this.getAssignCode("expenses_1").balance +
                            this.getAssignCode("expenses_2").balance) / totqty);
                if (cod.code == "netmargin")
                    cod["balance"] = (totqty == 0 ? 0 :
                        (this.getAssignCode("avgsales").balance -
                            this.getAssignCode("netcostm3").balance));
                if (cod.code == "netmarginp")
                    cod["balance"] = (totqty == 0 ? 0 :
                        ((this.getAssignCode("netmargin").balance / this.getAssignCode("netcostm3").balance) * 100));

                sqls += insSq(cod, pos);
                pos++;
            }
            var dt = Util.execSQL("declare begin " + delStr + sqls + " end;");
            if (dt.ret != "SUCCESS")
                FormView.err("Error in executing sqls");
            var sq = "select TO_NUMBER(field1) pos,field2 code,field3 descr," +
                " to_number(field4) levelno,field5 parentacc,to_number(field6) balance,field7 post_val,field8 disp_val,0 CHILDCOUNT " +
                " from temporary where idno=66105 and usernm='01' ORDER BY TO_NUMBER(FIELD1)";
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
                        mColCode: "CODE",
                        mColName: "DESCR",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");

                    ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("CODE")].mTitle = Util.getLangText("codeTxt");
                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("CODE")].mHideCol = true;
                    ld.cols[ld.getColPos("DESCR")].mTitle = Util.getLangText("titleTxt");

                    ld.cols[ld.getColPos("BALANCE")].data_type = "number";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_width = "200";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_style = "";
                    ld.cols[ld.getColPos("BALANCE")].mTitle = Util.getLangText("txtValue");

                    ld.cols[ld.getColPos("POS")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("POST_VAL")].mHideCol = true;
                    ld.cols[ld.getColPos("DISP_VAL")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;

                    ld.parse("{" + dt.data + "}", true);

                    var fntsize = Util.getLangDescrAR("16px", "16px");
                    paras["tableClass"] = "class=\"tbl2\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
                        // if ((col == "CODE" || col == "DESCR") && oData[rowno]["CODE"] != null)
                        //     st = "linkLabel";
                        return st;
                    }
                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "CODE" || col == "DESCR") && oData[rowno]["REFER"] != null) {
                            // var sq1="";
                            // st = "UtilGen.execCmd('', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                        
                            
                        }
                        return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        var st = "padding-left:10px;padding-right:10px;";
                        if (oData[rowno]["CODE"] == "prodqty")
                            st += "font-weight:bold;color:blue;";

                        if (oData[rowno]["CODE"].startsWith("com_") ||
                            oData[rowno]["CODE"] == "avgsales")
                            st += "vertical-align:top;font-weight:bold;";

                        if (oData[rowno]["CODE"].startsWith("com_") && col == "BALANCE")
                            st += "vertical-align:top;"
                        if (oData[rowno]["CODE"] == "netmarginp")
                            st += "height:40px;vertical-aign:top;color:blue;font-weight:bold;";
                        if ((oData[rowno]["CODE"] == "com_1" ||
                            oData[rowno]["CODE"] == "com_2" ||
                            oData[rowno]["CODE"] == "prodqty" ||
                            oData[rowno]["CODE"] == "netsales"))
                            st += "height:40px;vertical-align:top;";
                        if (oData[rowno]["CODE"] == "totsales")
                            st += "height:40px;color:blue;vertical-align:bottom;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "netcostm3")
                            st += "background-color:lightgrey;color:red;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "avgsales")
                            st += "background-color:lightgrey;vertical-align:bottom;color:green;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "netmargin")
                            st += "height:40px;vertical-align:bottom;font-weight:bold;";

                        return st;
                    }
                    paras["fnOnCellValue"] = function (oData, rowno, col, cellValue) {
                        var vl = cellValue;
                        if (col == "BALANCE" && cellValue != "")
                            vl = oData[rowno]["POST_VAL"] + " " + cellValue + ""
                        return vl;
                    };
                    paras["formatNumber"] = function (oData, rowno, col) {
                        if (col == "BALANCE")
                            return new DecimalFormat(sett['FORMAT_MONEY_1']);
                        return undefined;
                    }
                    paras["reFormatNumber"] = true;
                    paras["hideSubTotals"] = true;
                    paras["hideTotals"] = false; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                    };
                    // ld.parse("{" + dt.data + "}", true);
                    // ld.do_cross_tab();
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
        addQryPL3_1: function (qryObj, ps, repCode) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.todate");
            var bk = UtilGen.getBackYears(fromdt, todt);
            this.codes = this.assignCodes();
            /*field1 =pos
            field2=code
            field3=descr
            field4=levelno
            field5=parentacc
            field6=balance
            field7=post_val
            field8=dispval
            field=9 month
            */
            var delStr = "delete from temporary where usernm='01' and idno=66105;";
            var insx = "insert into temporary(usernm,idno,field1,field2,field3," +
                " field4,field5,field6,field7,field8,field9 ) values " +
                "('01',66105,:pos,:code,:descr," +
                ":levelno,:parentacc,:balance,:post_val,round(:balance,3)||' '||:post_val,:mnth);";
            var pos = 1; var amt = 0; var ins = [];
            var getBalance = function (pCod, mnth) {
                var acs = Util.getSQLValue("select nvl(max(para_value),'') from c7_rep_paras where repcode='" + repCode + "' and para_name=" + Util.quoted(pCod));
                if (acs == "") return 0;
                var bl = 0;
                var acdt = Util.execSQLWithData("select accno,path from acaccount where '" + acs + "' like '%\"'||accno||'\"%' order by path");
                if (acdt == undefined || acdt.length == 0) return 0;
                for (ai in acdt) {
                    var bl1 = Util.getSQLValue("select nvl(sum(debit-credit),0) from acc_transaction_up where " +
                        " to_char(vou_date,'rrrr/mm')=" + Util.quoted(mnth) +
                        " and path like '" + (acdt[ai].PATH + "%'"));
                    bl += (pCod == "totsales" ? bl1 * -1 : bl1);
                }

                return bl;
            }
            var insSq = function (cod, pos, mnth) {
                var sq = insx.replaceAll(":code", Util.quoted(cod.code))
                    .replaceAll(":descr", Util.quoted(Util.getLangText(cod.descr)))
                    .replaceAll(":levelno", Util.quoted(cod.levelno))
                    .replaceAll(":parentacc", Util.quoted(cod.parentacc))
                    .replaceAll(":balance", Util.quoted(cod.balance))
                    .replaceAll(":post_val", Util.quoted(cod.post_val))
                    .replaceAll(":balance", cod.balance)
                    .replaceAll(":pos", pos)
                    .replaceAll(":mnth", Util.quoted(mnth))
                    // .replaceAll(":", Util.quoted(""))
                    ;
                return sq;

            }
            var totqty = 0; var sqls = "";
            var dtx = Util.execSQLWithData("select distinct to_char(dt,'rrrr/mm') mnth from (" +
                "(select " + Util.toOraDateString(fromdt) + "+ level - 1 dt " +
                " from   dual  connect by level <= (" +
                Util.toOraDateString(todt) + " - " +
                Util.toOraDateString(fromdt) + " + 1 ))) order by 1 ");
            if (dtx.length <= 0) {
                FormView.err("No production months found !");
                return false;
            }
            for (var di in dtx) {
                var mnth = dtx[di].MNTH;
                for (var ai in this.codes) {
                    var balance = 0;
                    var cod = this.codes[ai];
                    if (cod.code == "prodqty") {
                        totqty = Util.getSQLValue("select round(nvl(sum(tqty),0)) from c_order1 where saleinv is not null and " +
                            " to_char(ord_date,'rrrr/mm')=" + Util.quoted(mnth)
                        );
                        cod["balance"] = totqty;
                    }
                    if (cod.code == "purchase") {
                        cod["balance"] = Util.getSQLValue("select nvl(sum(inv_amt-disc_amt),0) from pur1  where invoice_code=11 and " +
                            " to_char(invoice_date,'rrrr/mm')=" + Util.quoted(mnth)
                        );
                    }
                    if (cod.code == "totsales") {
                        cod["balance"] = Util.getSQLValue("select NVL(SUM(((PRICE+add_amt_gross)/PACK)*ALLQTY),0) from pur2  where invoice_code=21 and " +
                            " to_char(dat,'rrrr/mm')=" + Util.quoted(mnth)
                        );
                    }
                    if (cod.code == "discount") {
                        cod["balance"] = Util.getSQLValue("select NVL(SUM(DISC_AMT_GROSS*ALLQTY),0) from pur2  where invoice_code=21 and " +
                            " to_char(dat,'rrrr/mm')=" + Util.quoted(mnth)
                        );

                    }

                    if (cod.code == "expenses_1" ||
                        cod.code == "expenses_2")
                        cod["balance"] = getBalance(cod.code, mnth);
                    if (cod.code == "com_1")
                        cod["balance"] = (totqty == 0 ? 0 :
                            this.getAssignCode("purchase").balance / totqty);
                    if (cod.code == "com_2")
                        cod["balance"] = (totqty == 0 ? 0 :
                            this.getAssignCode("expenses_1").balance / totqty);
                    if (cod.code == "com_3")
                        cod["balance"] = (totqty == 0 ? 0 :
                            this.getAssignCode("expenses_2").balance / totqty);
                    if (cod.code == "com_4")
                        cod["balance"] = (totqty == 0 ? 0 :
                            (this.getAssignCode("expenses_1").balance +
                                this.getAssignCode("expenses_2").balance) / totqty);
                    if (cod.code == "netsales")
                        cod["balance"] = (this.getAssignCode("totsales").balance -
                            this.getAssignCode("totdisc").balance);
                    if (cod.code == "avgsales")
                        cod["balance"] = (totqty == 0 ? 0 :
                            this.getAssignCode("netsales").balance / totqty);
                    if (cod.code == "netcostm3")
                        cod["balance"] = (totqty == 0 ? 0 :
                            (this.getAssignCode("purchase").balance +
                                this.getAssignCode("expenses_1").balance +
                                this.getAssignCode("expenses_2").balance) / totqty);
                    if (cod.code == "netmargin")
                        cod["balance"] = (totqty == 0 ? 0 :
                            (this.getAssignCode("avgsales").balance -
                                this.getAssignCode("netcostm3").balance));
                    if (cod.code == "netmarginp")
                        cod["balance"] = (totqty == 0 ? 0 :
                            ((this.getAssignCode("netmargin").balance / this.getAssignCode("netcostm3").balance) * 100));

                    sqls += insSq(cod, pos, mnth);
                    pos++;
                }
            }
            var dt = Util.execSQL("declare begin " + delStr + sqls + " end;");
            if (dt.ret != "SUCCESS")
                FormView.err("Error in executing sqls");
            var sq = "SELECT CODE,DESCR,PARENTACC,LEVELNO,MNTH||'__BALANCE' MNTH_BAL, BALANCE,childcount,POST_VAL from " +
                " (select REPLACE(FIELD9,'/','_') MNTH , TO_NUMBER(field1) pos,field2 code,field3 descr," +
                " to_number(field4) levelno,field5 parentacc,to_number(field6) balance,field7 post_val,field8 disp_val,0 CHILDCOUNT,field9 mnthX " +
                " from temporary where idno=66105 and usernm='01') order by pos ";
            // var sq = "select TO_NUMBER(field1) pos,field2 code,field3 descr," +
            // " to_number(field4) levelno,field5 parentacc,to_number(field6) balance,field7 post_val,field8 disp_val,0 CHILDCOUNT,field9 mnth " +
            // " from temporary where idno=66105 and usernm='01' ORDER BY TO_NUMBER(FIELD1)";
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
        getQryPL3_1: function (qryObj) {
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
                        mColCode: "CODE",
                        mColName: "DESCR",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    var ld = new LocalTableData();
                    ld.parseCol("{" + dt.data + "}");

                    ld.cols[ld.getColPos("CODE")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("DESCR")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("CODE")].ct_row = "Y";
                    ld.cols[ld.getColPos("CODE")].mTitle = Util.getLangText("txtCode");
                    ld.cols[ld.getColPos("DESCR")].ct_row = "Y";
                    ld.cols[ld.getColPos("CODE")].mHideCol = true;
                    ld.cols[ld.getColPos("DESCR")].mTitle = Util.getLangText("titleTxt");
                    ld.cols[ld.getColPos("PARENTACC")].ct_row = "Y";
                    ld.cols[ld.getColPos("LEVELNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("CHILDCOUNT")].ct_row = "Y";
                    ld.cols[ld.getColPos("POST_VAL")].ct_row = "Y";
                    ld.cols[ld.getColPos("POST_VAL")].mHideCol = true;

                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";
                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos("BALANCE")].ct_val = "Y";
                    ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].data_type = "number";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_width = "200";
                    // ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_style = "";

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab(function (ld, rowno) {
                        var sett = sap.ui.getCore().getModel("settings").getData();
                        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                        var totqty = ld.getFieldValue(0, "tot__BALANCE");

                        var setAvgAmt = function (rowno, srcCode1, srcCode2, srcCode3, srcCode4, srcCode5) {

                            var srcRowno1 = -1, srcRowno2 = -1, srcRowno3 = -1, srcRowno4 = -1, srcRowno5 = -1;
                            for (var li = 0; li < ld.rows.length; li++) {
                                if (srcCode1 == ld.getFieldValue(li, "CODE"))
                                    srcRowno1 = li;
                                if (Util.nvl(srcCode2, "") == ld.getFieldValue(li, "CODE"))
                                    srcRowno2 = li;
                                if (Util.nvl(srcCode3, "") == ld.getFieldValue(li, "CODE"))
                                    srcRowno3 = li;
                                if (Util.nvl(srcCode4, "") == ld.getFieldValue(li, "CODE"))
                                    srcRowno4 = li;
                                if (Util.nvl(srcCode5, "") == ld.getFieldValue(li, "CODE"))
                                    srcRowno5 = li;

                            }
                            if (srcRowno1 >= 0 && totqty > 0) {
                                var totAmt = (ld.getFieldValue(srcRowno1, "tot__BALANCE") +
                                    (srcRowno2 >= 0 ? ld.getFieldValue(srcRowno2, "tot__BALANCE") : 0) +
                                    (srcRowno3 >= 0 ? ld.getFieldValue(srcRowno3, "tot__BALANCE") : 0)) -
                                    (srcRowno4 >= 0 ? ld.getFieldValue(srcRowno4, "tot__BALANCE") : 0);
                                var avg = 0;
                                if (srcRowno1 >= 0 && srcRowno2 == -1 && srcRowno3 == -1 &&
                                    srcRowno4 >= 0 && srcRowno5 == -1)
                                    avg = totAmt;
                                else
                                    avg = (totAmt / totqty);
                                if (srcRowno5 >= 0)
                                    avg = (srcRowno5 >= 0 && ld.getFieldValue(srcRowno5, "tot__BALANCE") != 0 ?
                                        (totAmt / ld.getFieldValue(srcRowno5, "tot__BALANCE")) * 100 : 0);

                                ld.setFieldValue(rowno, "tot__BALANCE", avg);
                            } else
                                ld.setFieldValue(rowno, "tot__BALANCE", 0);

                        }
                        ld.getFieldValue(rowno, "CODE") == "com_1" ? setAvgAmt(rowno, "purchase") : "";
                        ld.getFieldValue(rowno, "CODE") == "com_2" ? setAvgAmt(rowno, "expenses_1") : "";
                        ld.getFieldValue(rowno, "CODE") == "com_3" ? setAvgAmt(rowno, "expenses_2") : "";
                        ld.getFieldValue(rowno, "CODE") == "com_4" ? setAvgAmt(rowno, "expenses_1", "expenses_2") : "";
                        ld.getFieldValue(rowno, "CODE") == "netcostm3" ? setAvgAmt(rowno, "expenses_1", "purchase", "expenses_2") : "";
                        ld.getFieldValue(rowno, "CODE") == "avgsales" ? setAvgAmt(rowno, "netsales") : "";
                        ld.getFieldValue(rowno, "CODE") == "netmargin" ? setAvgAmt(rowno, "avgsales", "", "", "netcostm3") : "";
                        ld.getFieldValue(rowno, "CODE") == "netmarginp" ? setAvgAmt(rowno, "netmargin", "", "", "", "netcostm3") : "";



                    });
                    var ez = thatForm.frm.getFieldValue("parameter.exclzero");

                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;
                    ld.cols[ld.getColPos("tot__BALANCE")].mUIHelper.display_style = "background-color:lightgrey;";
                    ld.cols[ld.getColPos("tot__BALANCE")].mTitle = "balanceTxt";

                    var lc = ld;
                    for (var li = 0; li < lc.cols.length; li++) {
                        if (Util.nvl(lc.cols[li].ct_val, "N") == "Y") {
                            var tit = parseInt(lc.cols[li].mTitle.split("_")[1]);
                            lc.cols[li].mTitle = (UtilGen.DBView.sLangu == "AR" ? thatForm.monthsAr[tit - 1] : thatForm.monthsEn[tit - 1]) + "-" + lc.cols[li].mTitle.split("_")[0];
                        }
                    }

                    var fntsize = Util.getLangDescrAR("12px", "16px");
                    paras["tableClass"] = "class=\"tbl2\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
                        // if ((col == "CODE" || col == "DESCR") && oData[rowno]["CODE"] != null)
                        //     st = "linkLabel";
                        return st;
                    }
                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "CODE" || col == "DESCR") && oData[rowno]["CODE"] != null)
                            // st = "UtilGen.execCmd('testRep5 formType=dialog formSize=100%,100% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + oData[rowno]["CODE"] + " toacc=" + oData[rowno]["CODE"] + "', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                            return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        var st = "padding-left:10px;padding-right:10px;";
                        if (oData[rowno]["CODE"] == "prodqty")
                            st += "font-weight:bold;color:blue;";

                        if (oData[rowno]["CODE"].startsWith("com_") ||
                            oData[rowno]["CODE"] == "avgsales")
                            st += "vertical-align:top;font-weight:bold;";

                        if (oData[rowno]["CODE"].startsWith("com_") && col == "BALANCE")
                            st += "vertical-align:top;"
                        if (oData[rowno]["CODE"] == "netmarginp")
                            st += "height:40px;vertical-aign:top;color:blue;font-weight:bold;";
                        if ((oData[rowno]["CODE"] == "com_1" ||
                            oData[rowno]["CODE"] == "com_2" ||
                            oData[rowno]["CODE"] == "prodqty" ||
                            oData[rowno]["CODE"] == "netsales"))
                            st += "height:40px;vertical-align:top;";
                        if (oData[rowno]["CODE"] == "totsales")
                            st += "height:40px;color:blue;vertical-align:bottom;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "netcostm3")
                            st += "background-color:lightgrey;color:red;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "avgsales")
                            st += "background-color:lightgrey;vertical-align:bottom;color:green;font-weight:bold;";
                        if (oData[rowno]["CODE"] == "netmargin")
                            st += "height:40px;vertical-align:bottom;font-weight:bold;";

                        return st;
                    }
                    paras["fnOnCellValue"] = function (oData, rowno, col, cellValue) {
                        var sett = sap.ui.getCore().getModel("settings").getData();
                        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                        var vl = cellValue;
                        if (col.indexOf("BALANCE") >= 0 && cellValue != "")
                            vl = oData[rowno]["POST_VAL"] + " " + df.format(cellValue) + ""
                        return vl;
                    };
                    paras["formatNumber"] = function (oData, rowno, col) {
                        if (col.indexOf("BALANCE") >= 0)
                            return new DecimalFormat(sett['FORMAT_MONEY_1']);
                        return undefined;
                    }

                    paras["reFormatNumber"] = true;
                    paras["hideSubTotals"] = true;
                    paras["hideTotals"] = false; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                    };

                    // ld.parse("{" + dt.data + "}", true);
                    // ld.do_cross_tab();
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
        getAssignCode: function (pCod) {
            for (var ci in this.codes)
                if (this.codes[ci].code == pCod)
                    return this.codes[ci];
            return undefined;
        },
        assignCodes: function () {
            var sett = sap.ui.getCore().getModel("settings").getData();
            return [
                {
                    code: "prodqty",
                    descr: "prodQty",
                    levelno: 1,
                    parentacc: "",
                    post_val: "M3",
                    balance: 0
                },
                {
                    code: "purchase",
                    descr: "totPurchase",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "com_1",//cost of m3 from purchase
                    descr: "txtCom1",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "expenses_1", // indirect expenses
                    descr: "inExp",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "com_2", // cost of m3 from expenses 1
                    descr: "txtCom2",
                    levelno: 2,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "expenses_2",// direct expneses
                    descr: "diExp",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "com_3", //cost of m3 from expenses 2
                    descr: "txtCom3",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "com_4",//cost of m3 from expenses 1 + expneses 2 / prodqty
                    descr: "txtCom4",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "totsales",
                    descr: "totSales",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "totdisc",
                    descr: "totDisc",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "netsales",
                    descr: "netSales",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "avgsales",
                    descr: "avgSales",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "netcostm3",
                    descr: "netCostm3",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "netmargin",
                    descr: "netMargin",
                    levelno: 1,
                    parentacc: "",
                    post_val: sett["DEFAULT_CURRENCY"],
                    balance: 0
                },
                {
                    code: "netmarginp",
                    descr: "netMarginp",
                    levelno: 1,
                    parentacc: "",
                    post_val: "%",
                    balance: 0
                },

            ];
        },

    },
    loadData: function () {
    }

})
    ;



