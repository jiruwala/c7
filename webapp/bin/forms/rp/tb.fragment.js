sap.ui.jsfragment("bin.forms.rp.tb", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.helperFunc.init(this);
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.timeInLong = (new Date()).getTime();
        this.monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

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
        var colSpan = "XL2 L2 M2 S12";
        var sumSpan = "XL2 L2 M2 S12";

        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("finStat"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "TB001",
                    name: Util.getLangText("tbName1"),
                    descr: Util.getLangText("tbTit1"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var up = thatForm.frm.getFieldValue("parameter.unposted");
                        var tbstr = Util.getLangText("tbName1") + ": " + thatForm.frm.getFieldValue("parameter.acname");
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
                        parameters: thatForm.helperFunc.getParas("TB001"),
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
                                            var vb = new sap.m.VBox({ width: "-1px", items: [thatForm.qr] }).addStyleClass("sapUiSmallMargin");
                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {

                                            var ag = thatForm.frm.getFieldValue("TB001@parameter.accno");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
                                            }

                                            return thatForm.helperFunc.addQryPL1(qryObj, ps);
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryPL1(qryObj);
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

    }
    ,
    helperFunc: {
        init: function (frm) {
            this.thatForm = frm;
        },
        getParas3: function (repCode) {
            var para = this.getParas(repCode); // get all standard parameters
            return para;
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
                accno: {
                    colname: "accno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"accNo\",\"width\":\"15%\","textAlign":"End"}',
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.accno", vl, vl, false);
                            var vlnm = Util.getSQLValue("select name from acaccount where actype=0  and childcount>0 and accno =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.acname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            Util.showSearchList("select accno,name from acaccount where actype=0 order by path", "NAME", "ACCNO", function (valx, val) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.accno", valx, valx, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.acname", val, val, true);
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
                acname: {
                    colname: "acname",
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
                levelno: {
                    colname: "levelno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"levelNo\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "3",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                unposted: {
                    colname: "unposted",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"unAudited\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    showInPreview: false,
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
                    other_settings: { selected: true, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
                exclzero: {
                    colname: "exclzero",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '@{\"text\":\"exclZero\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
                    other_settings: { selected: true, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
                hideTotals: {
                    colname: "hideTotals",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"hideTotals\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
                    other_settings: { selected: true, width: "20%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
            };
            return para;
        },
        addQryPL1: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var ret = true;
            var sq =
                "begin " +
                "  cp_acc.plevelno:=:parameter.levelno;" +
                "  cp_acc.pfromdt:=:parameter.fromdate;" +
                "  cp_acc.ptodt:=:parameter.todate; " +
                "  cp_acc.pfromacc:=':parameter.accno'; " +
                "  cp_acc.prnp:=':parameter.incrp'; " +
                "  cp_acc.pcc:=':parameter.costcent'; " +
                "  cp_acc.punposted:=':parameter.unposted'; " +
                "  cp_acc.build_gl('01'); " +
                "  commit; " +
                "end;";
            sq = thatForm.frm.parseString(sq);
            Util.doAjaxJson("sqlmetadata?", {
                sql: sq,
                ret: "NONE",
                data: null
            }, false).done(function (data) {
            });
            var ez = thatForm.frm.getFieldValue("parameter.exclzero");
            var sq = "select field1 accno,field2 name,field19 parentacc,field17 path," +
                " to_number(field5) bdeb,to_number(field6) bcrd," +
                " to_number(field7) tdeb, to_number(field8) tcrd, " +
                " to_number(field13) cdeb, to_number(field14) ccrd, " +
                " to_number(FIELD16) levelno , to_number(field18) childcount " +
                " from temporary " +
                " where idno=66601 " +
                (ez == "Y" ? " and to_number(field13)-to_number(field14)!=0  " : "") +
                " and usernm='01' order by field17 ";
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

        getQryPL1: function (qryObj) {
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

                    ld.getColByName("PATH").mHideCol = true;
                    ld.getColByName("PARENTACC").mHideCol = true;
                    // ld.getColByName("BDEB").mHideCol = true;
                    // ld.getColByName("BCRD").mHideCol = true;
                    // ld.getColByName("TDEB").mHideCol = true;
                    // ld.getColByName("TCRD").mHideCol = true;
                    // ld.getColByName("CDEB").mHideCol = true;
                    // ld.getColByName("CCRD").mHideCol = true;
                    // ld.getColByName("BALANCE").mHideCol =true;
                    ld.getColByName("ACCNO").mHideCol = true;
                    ld.getColByName("LEVELNO").mHideCol = true;
                    // ld.getColByName("FLG").mHideCol = true;
                    ld.getColByName("CHILDCOUNT").mHideCol = true;
                    ld.getColByName("NAME").mUIHelper.display_width = "450";
                    ld.getColByName("ACCNO").mTitle = Util.getLangText("accNo");
                    ld.getColByName("NAME").mTitle = Util.getLangText("titleTxt");




                    var scl = ["BDEB", "BCRD", "TDEB", "TCRD", "CDEB", "CCRD"];
                    var sct = ["debitTxt", "creditTxt", "debitTxt", "creditTxt", "debitTxt", "creditTxt"];
                    var scp = ["bfBal", "bfBal", "transactionTxt", "transactionTxt", "closeBal", "closeBal"];

                    for (var cl in scl) {
                        ld.getColByName(scl[cl]).mUIHelper.display_width = "120";
                        ld.getColByName(scl[cl]).mUIHelper.data_type = "NUMBER";
                        ld.getColByName(scl[cl]).mUIHelper.display_format = "QTY_FORMAT";
                        ld.getColByName(scl[cl]).mTitle = Util.getLangText(sct[cl]);
                        ld.getColByName(scl[cl]).mTitleParent = Util.getLangText(scp[cl]);
                        ld.getColByName(scl[cl]).mTitleParentSpan = 2;
                        ld.getColByName(scl[cl]).mSummary = "SUM";
                    }

                    var fntsize = Util.getLangDescrAR("12px", "16px");
                    paras["tableClass"] = "class=\"tbl1\"";
                    paras["styleTableDetails"] = "style='font-size: " + fntsize + ";font-family: Arial;'";
                    paras["styleTableHeader"] = "style='background-color:lightblue;font-family: Arial'";
                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "ACCNO" || col == "NAME") && oData[rowno]["ACCNO"] != null)
                            st = "linkLabel";

                        return st;
                    }
                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "ACCNO" || col == "NAME") && oData[rowno]["ACCNO"] != null)
                            st = "UtilGen.execCmd('testRep5 formType=dialog formSize=100%,100% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + oData[rowno]["ACCNO"] + " toacc=" + oData[rowno]["ACCNO"] + "', UtilGen.DBView, this, UtilGen.DBView.newPage)";
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
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                        // footerNode_fg["RVN_PRATE"] = mapNode_fg["RVN_PRATE"];
                        // footerNode_fg["RVN_YRATE"] = mapNode_fg["RVN_YRATE"];

                    };
                    ld.parse("{" + dt.data + "}", true);

                    // calculating ytd rate.
                    paras["showFooter"] = true;
                    paras["fnOnFooter"] = function (footer) {
                        // var dfq1 = new DecimalFormat("#,##0");
                        // var totbdeb = 0;
                        // for (var li = 0; li < ld.rows.length; li++) {
                        //     var lvl = ld.getFieldValue(li, "LEVELNO");
                        //     if (lvl == 1)
                        //         totbdeb += ld.getFieldValue(li, "BDEB");
                        // }
                        // footer["BDEB"] = totbdeb;
                        footer["LEVELNO"] = -1;
                    }

                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);
                }
            });

        }
    },// helperFunc
    validateSave: function () {
        return true;
    }
    ,
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

})
    ;



