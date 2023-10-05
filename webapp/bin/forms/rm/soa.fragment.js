sap.ui.jsfragment("bin.forms.rm.soa", {
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
                    code: "RMSOA1",
                    name: "SOA",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    showXLSMenu: true,
                    showHTMLMenu: false,
                    showCustomPara: function (vbPara, rep) {
                        var vb = new sap.m.VBox({
                            items: [
                                new sap.m.CheckBox({
                                    text: "Show Debit>0",
                                    select: function (ev) {
                                        if (ev.getParameters().selected) {
                                            rep.db[1].obj.mViewSettings["filterStr"] = "debit>0";
                                            rep.db[1].obj.loadData();
                                            that2.frm.helperFunctions.misc.showDisplayRecs(rep.rptNo);
                                        }
                                        else {
                                            rep.db[1].obj.mViewSettings["filterStr"] = "";
                                            rep.db[1].obj.loadData();
                                            that2.frm.helperFunctions.misc.showDisplayRecs(rep.rptNo);

                                        }

                                    }
                                })
                            ]
                        });
                        vbPara.addItem(vb);
                    },
                    mainParaContainerSetting: {
                        width: { "S": 400, "M": 500, "L": 650 },
                        cssText: [
                            "padding-left:50px;" +
                            "padding-top:20px;" +
                            "border-style: inset;" +
                            "margin: 10px;" +
                            "border-radius:25px;" +
                            "background-color:#dcdcdc;"
                        ]
                    },
                    rep: {
                        parameters: thatForm.helperFunc.getParas("RMSOA1"),
                        print_templates: [
                            {
                                title: "PDF-1",
                                reportFile: "soa001_1",
                            }
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qryM",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                execOnShow: false,
                                showToolbar: true,
                                canvas: "qryMCanvas",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                isMaster: false,
                                masterToolbarInMain: false,
                                dml: "select distinct accno,nvl(rfr_name,acname)||' '||COST_CENT_NAME name,b30,b60,b90,b120,b150,acbal from c6_gl1 " +
                                    "  order by accno ",
                                // beforeLoadQry: function (sql, qryObj) {
                                //     return "";
                                // },
                                bat7CustomAddQry: function (qryObj, ps) {
                                    var sq = "select distinct accno,nvl(rfr_name,acname)||' '||COST_CENT_NAME name from c6_gl1 " +
                                        "  order by accno ";
                                },
                                bat7CustomGetData: function (qryObj) {

                                },
                                onCustomValueFields: function (qrtObj) {
                                    //thatForm.frm.setFieldValue("01@qry3.accno", "xxx11");
                                    //thatForm.frm.setFieldValue("01@qry3.descr", "custom descr");
                                },
                                fields: {
                                    accno: {
                                        colname: "accno",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '{\"text\":\"Reference\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: {
                                            width: "35%",
                                            editable: false
                                        },
                                    },
                                    acbal: {
                                        colname: "acbal",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '@{\"text\":\"Balance\",\"width\":\"15%\","textAlign":"End","styleClass":"redText"}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "redText",
                                        display_format: "FORMAT_MONEY_1",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: {
                                            width: "35%",
                                            editable: false
                                        },
                                    },
                                    name: {
                                        colname: "name",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '{\"text\":\"Name\",\"width\":\"15%\","textAlign":"End"}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: {
                                            width: "85%",
                                            editable: false
                                        },
                                    }

                                }
                            },
                            {
                                type: "query",
                                name: "qry2",
                                // disp_class: "paddingLR5P",
                                disp_class: "reportTable2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                dispRecords: { "S": 8, "M": 12, "L": 16, "XL": 22, "XXL": 35 },                                
                                execOnShow: false,
                                canvas: "qry2Canvas",
                                canvasType: ReportView.CanvasType.VBOX,
                                showToolbar: true,
                                filterCols: ["ACCNO", "VOU_DATE", "DESCR", "DEBIT", "CREDIT", "NAME"],
                                masterQry: "",
                                masterDetailRelation: "",   //  .match(/=\s*([A-Za-z_0-9.]*)/gm)
                                dml: "select '01' accno , 'do it' descr from dual",
                                // parent: "PARENTACC",
                                code: "ACCNO",
                                title: "NAME",
                                beforeLoadQry: function (sql) {
                                    // var sq =
                                    //     "BEGIN C6_STATMENT(:parameter.fromdate,:parameter.todate,':parameter.paccno',':parameter.pcc',':parameter.pref','ALL',TRUE,':parameter.pageing'); COMMIT; END;";
                                    // sq = thatForm.frm.parseString(sq);
                                    // Util.doAjaxJson("sqlmetadata?", {
                                    //     sql: sq,
                                    //     ret: "NONE",
                                    //     data: null
                                    // }, false).done(function (data) {
                                    // });
                                    // thatForm.save_soa();
                                    return "select *from C6_GL2 where 1=1 and usernm=c6_session.get_user_session order by pos";
                                },
                                fields: {
                                    vou_date: {
                                        colname: "vou_date",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Date",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "SHORT_DATE_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        // commandLink: "gl.jv formSize=100%,550px status=view keyfld=:keyfld",
                                        commandLinkClick: cmdLink
                                    },
                                    balance: {
                                        colname: "balance",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Balance",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "120",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "color:maroon;font-size:medium;",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        summary: "LAST",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    debit: {
                                        colname: "debit",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Debit",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_END",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    credit: {
                                        colname: "credit",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Credit",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    descr: {
                                        colname: "DESCR",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Descr",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "300",
                                        display_align: "ALIGN_BEGIN",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    vou_no: {
                                        colname: "VOU_NO",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Vou No",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "70",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    accno: {
                                        colname: "ACCNO",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "AC NO",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    name: {
                                        colname: "NAME",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Name",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "200",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    type_descr: {
                                        colname: "TYPE_DESCR",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Trans Type",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    jvpos: {
                                        colname: "JVPOS",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Vou No",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "0",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    keyfld: {
                                        colname: "keyfld",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Vou No",
                                        title2: "",
                                        parentTitle: undefined,
                                        parentSpan: 1,
                                        display_width: "0",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                }
                            },
                            {
                                type: "query",
                                name: "qryM2",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                execOnShow: false,
                                showToolbar: true,
                                canvas: "qryM2Canvas",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                isMaster: false,
                                masterToolbarInMain: false,
                                dml: "",
                                bat7CustomAddQry: function (qryObj, ps) {
                                    var sq = "select distinct accno,nvl(rfr_name,acname)||' '||COST_CENT_NAME name from c6_gl1 " +
                                        "  order by accno ";
                                },
                                bat7CustomGetData: function (qryObj) {

                                },
                                onCustomValueFields: function (qrtObj) {
                                    //thatForm.frm.setFieldValue("01@qry3.accno", "xxx11");
                                    //thatForm.frm.setFieldValue("01@qry3.descr", "custom descr");
                                },
                                fields: {
                                    ageing: {
                                        colname: "ageing",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.HTML,
                                        title: '{\"text\":\" \",\"width\":\"1%\","textAlign":"End"}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.getContent();
                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            var ret = true;
                                            var sq = "select distinct accno,nvl(rfr_name,acname)||' '||COST_CENT_NAME name,b30,b60,b90,b120,b150,acbal BALANCE from c6_gl1 " +
                                                "  order by accno ";
                                            var ag = thatForm.frm.getFieldValue("RMSOA1@parameter.pageing");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
                                            }
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
                                                var thatObj = this;
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
                                                    if (dt.ret == "SUCCESS") {
                                                    }
                                                });
                                            });
                                            return ret;

                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            var thatObj = this;
                                            var ag = thatForm.frm.getFieldValue("RMSOA1@parameter.pageing");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
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
                                                if (dt.ret == "SUCCESS") {
                                                    var dtx = JSON.parse("{" + dt.data + "}");
                                                    // var h = "<div>150 :" + dtx.data[0]["B150"] + "</div>";

                                                    var hp = "style=\"text-align:center;width:65px;background-color:yellow\"";
                                                    var h = UtilGen.toHTMLTableFromData(dtx, ["ACCNO", "NAME"], function (colName, attr) {

                                                        var tit = "";

                                                        if (colName == "BALANCE") {
                                                            // hp = "onclick=\"UtilGen.execCmd('testRep5 formType=dialog repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=1 toacc=1 fromdate=@01/01/2020',UtilGen.DBView,UtilGen.DBView,UtilGen.DBView.newPage)\"" +
                                                            //     "class=\"htmlLnk\" style=\"text-align:center;width:100px;background-color:yellow\"";
                                                            hp = " style=\"text-align:center;width:100px;background-color:yellow\"";
                                                            tit = "Balance"
                                                        }
                                                        if (colName == "B30")
                                                            tit = "0-30";
                                                        if (colName == "B60")
                                                            tit = "31-60";
                                                        if (colName == "B90")
                                                            tit = "61-90";
                                                        if (colName == "B120")
                                                            tit = "91-120";
                                                        if (colName == "B150")
                                                            tit = "121-150";


                                                        return { title: tit, prop: hp };

                                                    },
                                                        function (colName, attr, val) {
                                                            var vl;
                                                            var sett = sap.ui.getCore().getModel("settings").getData();
                                                            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                                                            if (val != undefined)
                                                                vl = df.format(parseFloat(val));
                                                            var hp = "";
                                                            if (colName == "BALANCE")
                                                                hp = "style=\"text-align:center;width:100px;background-color:yellow\"";
                                                            return {
                                                                prop: hp,
                                                                val: vl
                                                            };
                                                        });
                                                    h = "<div style='font-size:large;text-align:center'>Ageing in Days</div><br>" + h;
                                                    thatObj.obj.setContent(h);
                                                }
                                            });
                                        },
                                        other_settings: {
                                            width: "99%",
                                            height: "200px",
                                            editable: false
                                        },
                                    }

                                }
                            },
                        ]

                    }
                },
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
            var fullSpan = "XL8 L8 M8 S12";
            var sumSpan = "XL2 L2 M2 S12";

            var para = {
                fromdate: {
                    colname: "fromdate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"From Date\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
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
                    title: '@{\"text\":\"To Date\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    canvas: "para_canvas",
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
                paccno: {
                    colname: "paccno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.SEARCHFIELD,
                    title: '{\"text\":\"A/c No \",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: fullSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "85%",
                        customData: [{ key: "" }],
                        search: function (event) {
                            if (event != undefined
                                && (event.getParameters().clearButtonPressed
                                    || event.getParameters().refreshButtonPressed)) {
                                // UtilGen.setControlValue(event.oSource, "", "", true);
                                thatForm.frm.setFieldValue("RMSOA1@parameter.paccno", "", "", true);
                                return;
                            }
                            Util.showSearchList("select accno,name from acaccount order by path", "NAME", "ACCNO", function (valx, val) {
                                thatForm.frm.setFieldValue("RMSOA1@parameter.paccno", valx, val, true);
                                sap.m.MessageToast.show(thatForm.frm.getFieldValue("RMSOA1@parameter.paccno"));
                            });
                        },
                        change: function (event) {
                            var vl = event.oSource.getValue();
                            thatForm.frm.setFieldValue("RMSOA1@parameter.paccno", vl, vl, true);
                        }


                    },
                    list: "select accno,name from acaccount order by path",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pcc: {
                    colname: "pcc",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.SEARCHFIELD,
                    title: '{\"text\":\"Cost Center\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: fullSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "85%",
                        customData: [{ key: "" }],
                        search: function (event) {
                            if (event != undefined
                                && (event.getParameters().clearButtonPressed
                                    || event.getParameters().refreshButtonPressed)) {
                                thatForm.frm.setFieldValue("RMSOA1@parameter.pcc", "", "", true);
                                return;
                            }
                            Util.showSearchList("select code,title name from accostcent1 order by path", "NAME", "CODE", function (valx, val) {
                                // UtilGen.setControlValue(obj, val, valx, true);
                                thatForm.frm.setFieldValue("RMSOA1@parameter.pcc", valx, val, true);
                                sap.m.MessageToast.show(thatForm.frm.getFieldValue("RMSOA1@parameter.pcc"));
                            });

                        },
                        change: function (event) {
                            var vl = event.oSource.getValue();
                            thatForm.frm.setFieldValue("RMSOA1@parameter.pcc", vl, vl, true);
                        }


                    },
                    list: "",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pref: {
                    colname: "pref",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.SEARCHFIELD,
                    title: '{\"text\":\"Reference\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: fullSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "85%",
                        customData: [{ key: "" }],
                        search: function (event) {
                            if (event != undefined
                                && (event.getParameters().clearButtonPressed
                                    || event.getParameters().refreshButtonPressed)) {
                                thatForm.frm.setFieldValue("RMSOA1@parameter.pref", "", "", true);
                                return;
                            }
                            Util.showSearchList("select code,name from c_ycust order by path", "NAME", "CODE", function (valx, val) {
                                thatForm.frm.setFieldValue("RMSOA1@parameter.pref", valx, val, true);
                                sap.m.MessageToast.show(thatForm.frm.getFieldValue("RMSOA1@parameter.pref"));
                            });

                        },
                        change: function (event) {
                            var vl = event.oSource.getValue();
                            thatForm.frm.setFieldValue("RMSOA1@parameter.pref", vl, vl, true);
                        }
                    },
                    list: "",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pageing: {
                    colname: "pageing",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"Ageing\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: fullSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "85%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "NONE",
                    },
                    list: "@NONE/NONE,DEBIT/DEBIT,CREDIT/CREDIT",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
            };
            return para;
        },
        addQryPL3: function (qryObj, ps, repCode) {
    
        },
        getQryPL3: function (qryObj) {
        }
    },
    loadData: function () {
    }

})
    ;



