sap.ui.jsfragment("bin.forms.rp.pl", {
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
                    code: "PL001",
                    name: Util.getLangText("finStat1"),
                    descr: Util.getLangText("finStat1Descr"),
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
                        parameters: thatForm.helperFunc.getParas("PL001"),
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

                                            var ag = thatForm.frm.getFieldValue("PL001@parameter.accno");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
                                            }

                                            return thatForm.helperFunc.addQryPL1(qryObj, ps);
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryPL1(qryObj);
                                        }
                                    },
                                }
                            }
                        ]
                    }
                },
                {
                    code: "PL002",
                    name: Util.getLangText("monthPL"),
                    descr: Util.getLangText("monthPL1"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    printCSS: "print2.css",
                    onSubTitHTML: function () {
                        var up = thatForm.frm.getFieldValue("parameter.unposted");
                        var tbstr = Util.getLangText("profitAndLoss");
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
                    mainParaContainerSetting: {
                        width: "600px",
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
                        parameters: thatForm.helperFunc.getParas("PL002"),
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
                                        other_settings: {
                                            width: "100%",
                                            height: UtilGen.dispTblRecsByDevice({ "S": 350, "M": 425, "L": 575, "XL": 650 }) + "px",
                                            horizontal: true,
                                            vertical: true
                                        },
                                        onPrintField: function () {
                                            return thatForm.qr.getContent();
                                        },
                                        afterAddOBject: function () {

                                            thatForm.qr = new sap.ui.core.HTML({}).addStyleClass("sapUiSmallMargin");
                                            var vb = new sap.m.VBox({ width: "1000px", items: [thatForm.qr] }).addStyleClass("sapUiSmallMargin");;
                                            this.obj.addContent(vb);

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            var ret = true;
                                            var ag = thatForm.frm.getFieldValue("PL002@parameter.accno");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
                                            }
                                            return thatForm.helperFunc.addQryPL2(qryObj, ps);
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            var thatObj = this;
                                            thatForm.helperFunc.getQryPL2(qryObj);
                                        }
                                    },
                                }
                            }
                        ]
                    }
                },
                {
                    code: "PL003",
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
                        parameters: thatForm.helperFunc.getParas3("PL003"),
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

                                            var ag = thatForm.frm.getFieldValue("PL001@parameter.accno");
                                            if (ag == "NONE") {
                                                this.obj.setVisible(false);
                                                return;
                                            }

                                            return thatForm.helperFunc.addQryPL3(qryObj, ps);
                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQryPL3(qryObj);
                                        }
                                    },
                                }
                            }
                        ]
                    }
                },

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
                            var vlnm = Util.getSQLValue("select name from acaccount where actype=1 and accno =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.acname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            Util.showSearchList("select accno,name from acaccount where actype=1 order by path", "NAME", "ACCNO", function (valx, val) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.accno", valx, valx, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.acname", val, val, true);
                            });

                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
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
            if (repCode == "PL001") {
                para["onlyYTD"] = {
                    colname: "onlyYTD",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"onlyYtd\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                };
                para["rvn_accno"] = {
                    colname: "rvn_accno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"totAccNo\",\"width\":\"30%\","textAlign":"End"}',
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.rvn_accno", vl, vl, false);
                            var vlnm = Util.getSQLValue("select name from acaccount where actype=0 and accno =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.rvn_acname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            Util.showSearchList("select accno,name from acaccount where actype=0 order by path", "NAME", "ACCNO", function (valx, val) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.rvn_accno", valx, valx, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.rvn_acname", val, val, true);
                            });

                        },
                        width: "30%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                };
                para["rvn_acname"] = {
                    colname: "rvn_acname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "39%", editable: false },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                };
                para["exp_accno"] = {
                    colname: "exp_accno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"ratioAccNo\",\"width\":\"30%\","textAlign":"End"}',
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
                            thatForm.frm.setFieldValue(repCode + "@parameter.exp_accno", vl, vl, false);
                            var vlnm = Util.getSQLValue("select name from acaccount where actype=0 and accno =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.exp_acname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            Util.showSearchList("select accno,name from acaccount where actype=0 order by path", "NAME", "ACCNO", function (valx, val) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.exp_accno", valx, valx, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.exp_acname", val, val, true);
                            });

                        },
                        width: "30%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                };
                para["exp_acname"] = {
                    colname: "exp_acname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "39%", editable: false },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                }
            }
            return para;
        },
        addQryPL1: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var ret = true;
            var sq =
                "begin " +
                "  cp_acc_pl.plevelno:=:parameter.levelno;" +
                "  cp_acc_pl.pfromdt:=:parameter.fromdate;" +
                "  cp_acc_pl.ptodt:=:parameter.todate; " +
                "  cp_acc_pl.pfromacc:=':parameter.accno'; " +
                "  cp_acc_pl.punposted:=':parameter.unposted'; " +
                "  cp_acc_pl.pcc:=':parameter.costcent'; " +
                "  cp_acc_pl.build_gl('01'); " +
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
            var fld = Util.getLangDescrAR("field2", "nvl(field25,field2)");
            sq = "select field1 accno, " + fld + " name,field19 parentacc,field17 path," +
                " to_number(field5) bdeb,to_number(field6) bcrd," +
                " to_number(field7) tdeb, to_number(field8) tcrd, " +
                " to_number(field13) cdeb, to_number(field14) ccrd, " +
                " to_number(field13) -to_number(field14) balance,0 rvn_prate, " +
                " to_number(FIELD16) levelno,field20 flg,to_number(FIELD18) childcount, " +
                " (to_number(field5)+to_number(field7))-(to_number(field6)+to_number(field8)) ytd_balance ,0 rvn_yrate,0 YTD_RATE " +
                " from temporary " +
                " where idno=66602 " +
                (ez == "Y" ? " and ((to_number(field5)+to_number(field7))-(to_number(field6)+to_number(field8))!=0  or field1='-' ) " : "") +
                " and usernm='01' and (:parameter.levelno=0 or to_number(FIELD16)<=:parameter.levelno )  order by field17 ";
            sq = thatForm.frm.parseString(sq);
            var pars = Util.nvl(qryObj.rep.rep.parameters, []);

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
                    ld.getColByName("BDEB").mHideCol = true;
                    ld.getColByName("BCRD").mHideCol = true;
                    ld.getColByName("TDEB").mHideCol = true;
                    ld.getColByName("TCRD").mHideCol = true;
                    ld.getColByName("CDEB").mHideCol = true;
                    ld.getColByName("CCRD").mHideCol = true;
                    ld.getColByName("ACCNO").mHideCol = true;
                    ld.getColByName("RVN_PRATE").mHideCol = true;
                    ld.getColByName("RVN_YRATE").mHideCol = true;

                    ld.getColByName("LEVELNO").mHideCol = true;
                    ld.getColByName("FLG").mHideCol = true;
                    ld.getColByName("CHILDCOUNT").mHideCol = true;
                    ld.getColByName("NAME").mUIHelper.display_width = "450";
                    ld.getColByName("ACCNO").mTitle = Util.getLangText("accNo");
                    ld.getColByName("NAME").mTitle = Util.getLangText("titleTxt");

                    ld.getColByName("BALANCE").mUIHelper.display_width = "120";
                    ld.getColByName("BALANCE").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("BALANCE").mUIHelper.display_format = "QTY_FORMAT";
                    ld.getColByName("BALANCE").mTitle = Util.getLangText("periodicBalanceTxt") + "\n(" + sett["DEFAULT_CURRENCY"] + ")";
                    ld.getColByName("BALANCE").mSummary = "SUM";

                    ld.getColByName("YTD_BALANCE").mUIHelper.display_width = "120";
                    ld.getColByName("YTD_BALANCE").mUIHelper.data_type = "NUMBER";
                    ld.getColByName("YTD_BALANCE").mUIHelper.display_format = "QTY_FORMAT";
                    ld.getColByName("YTD_BALANCE").mTitle = Util.getLangText("ytdBalanceTxt") + "\n(" + sett["DEFAULT_CURRENCY"] + ")";
                    ld.getColByName("YTD_BALANCE").mSummary = "SUM";

                    ld.getColByName("YTD_RATE").mUIHelper.display_align = "center";
                    ld.getColByName("YTD_RATE").mTitle = Util.getLangText("ytdRateTxt");

                    ld.getColByName("RVN_PRATE").mTitle = Util.getLangText("rvnPRate");
                    ld.getColByName("RVN_YRATE").mTitle = Util.getLangText("rvnYRate");
                    ld.getColByName("RVN_PRATE").mUIHelper.display_align = "center";
                    ld.getColByName("RVN_YRATE").mUIHelper.display_align = "center";

                    var racn = Util.nvl(thatForm.frm.getFieldValue("parameter.rvn_accno"), "");
                    if (racn != "") {
                        ld.getColByName("RVN_PRATE").mHideCol = false;
                        ld.getColByName("RVN_YRATE").mHideCol = false;
                        ld.getColByName("YTD_RATE").mHideCol = true;
                    }

                    if (new Date(fisc.fiscal_from).setHours(0, 0, 0) == thatForm.frm.getFieldValue("parameter.fromdate").setHours(0, 0, 0)) {
                        ld.getColByName("YTD_BALANCE").mHideCol = true;
                        ld.getColByName("YTD_RATE").mHideCol = true;
                        ld.getColByName("RVN_YRATE").mHideCol = true;
                    }
                    var onlyYtd = Util.nvl(thatForm.frm.getFieldValue("parameter.onlyYTD"), "N");

                    if (onlyYtd == "Y") {
                        ld.getColByName("YTD_BALANCE").mHideCol = false;
                        ld.getColByName("YTD_RATE").mHideCol = true;
                        ld.getColByName("BALANCE").mHideCol = true;
                        ld.getColByName("RVN_PRATE").mHideCol = true;
                        var racn = Util.nvl(thatForm.frm.getFieldValue("parameter.rvn_accno"), "");
                        if (racn != "")
                            ld.getColByName("RVN_YRATE").mHideCol = false;

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
                        footerNode_fg["YTD_RATE"] = mapNode_fg["YTD_RATE"];
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                        footerNode_fg["RVN_PRATE"] = mapNode_fg["RVN_PRATE"];
                        footerNode_fg["RVN_YRATE"] = mapNode_fg["RVN_YRATE"];
                    };
                    ld.parse("{" + dt.data + "}", true);

                    // calculating ytd rate.
                    if (!ld.getColByName("YTD_RATE").mHideCol)
                        for (var li = 0; li < ld.rows.length; li++) {
                            var yb = ld.getFieldValue(li, "YTD_BALANCE");
                            var bl = ld.getFieldValue(li, "BALANCE");
                            var rt = (yb != 0 ? (bl / yb) * 100 : "");
                            if (rt == 0)
                                ld.setFieldValue(li, "YTD_RATE", "")
                            else {
                                rt = Math.round(rt);
                                rt = (rt + "").startsWith("-") ? "(" + Math.abs(rt) + "%)" : rt + "%";
                                ld.setFieldValue(li, "YTD_RATE", rt);
                            }
                        }
                    if (!ld.getColByName("RVN_PRATE").mHideCol || !ld.getColByName("RVN_YRATE").mHideCol) {
                        var rvn_balance = 0;
                        var rvn_ybalance = 0;

                        var rvn_acc = thatForm.frm.getFieldValue("parameter.rvn_accno");
                        var exp_acc = thatForm.frm.getFieldValue("parameter.exp_accno");
                        var exp_pth = Util.getSQLValue("select nvl(max(path),'') from acaccount where accno='" + exp_acc + "'");
                        //get rvn_balance;
                        for (var li = 0; li < ld.rows.length; li++)
                            if (rvn_acc == ld.getFieldValue(li, "ACCNO")) {
                                rvn_balance = ld.getFieldValue(li, "BALANCE");
                                rvn_ybalance = ld.getFieldValue(li, "YTD_BALANCE");
                            }
                        if (rvn_balance + rvn_ybalance != 0)
                            for (var li = 0; li < ld.rows.length; li++)
                                if (Util.nvl(ld.getFieldValue(li, "PATH"), "") != "" && (ld.getFieldValue(li, "PATH").startsWith(exp_pth) || exp_pth == "")) {
                                    var yb = ld.getFieldValue(li, "YTD_BALANCE");
                                    var bl = ld.getFieldValue(li, "BALANCE");
                                    var rtb = (rvn_balance != 0 ? ((bl * -1) / rvn_balance) * 100 : "");
                                    var rty = (rvn_ybalance != 0 ? ((yb * -1) / rvn_ybalance) * 100 : "");
                                    rtb = Math.round(rtb)
                                    if (rtb == 0 || rtb == "0")
                                        ld.setFieldValue(li, "RVN_PRATE", "")
                                    else {
                                        rtb = (rtb + "").startsWith("-") ? "(" + Math.abs(rtb) + "%)" : rtb + "%";
                                        ld.setFieldValue(li, "RVN_PRATE", rtb);
                                    }
                                    rty = Math.round(rty);
                                    if (rty == 0 || rty == "0")
                                        ld.setFieldValue(li, "RVN_YRATE", "")
                                    else {

                                        rty = (rty + "").startsWith("-") ? "(" + Math.abs(rty) + "%)" : rty + "%";
                                        ld.setFieldValue(li, "RVN_YRATE", rty);
                                    }
                                } else {
                                    ld.setFieldValue(li, "RVN_YRATE", "");
                                    ld.setFieldValue(li, "RVN_PRATE", "")
                                }

                    }
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);
                }
            });

        },
        addQryPL2: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var ret = true;
            var sq =
                "begin " +
                "  cp_acc_pl_monthly.plevelno:=:parameter.levelno;" +
                "  cp_acc_pl_monthly.pfromdt:=:parameter.fromdate;" +
                "  cp_acc_pl_monthly.ptodt:=:parameter.todate; " +
                "  cp_acc_pl_monthly.pfromacc:=':parameter.accno'; " +
                "  cp_acc_pl_monthly.pcc:=':parameter.costcent'; " +
                "  cp_acc_pl_monthly.punposted:=':parameter.unposted'; " +
                "  cp_acc_pl_monthly.build_gl('01'); " +
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
            var fld = Util.getLangDescrAR("field2", "nvl(field25,field2)");
            sq = "SELECT ACCNO,NAME,PARENTACC,LEVELNO,MNTH||'__BALANCE' MNTH_BAL, TDEB-TCRD BALANCE,childcount FROM " +
                " (select REPLACE(FIELD30,'/','_') MNTH,field1 accno," + fld + " name,field19 parentacc,field17 path, " +
                "to_number(field5) bdeb,to_number(field6) bcrd, " +
                "to_number(field7) tdeb, to_number(field8) tcrd," +
                "to_number(field13) cdeb, to_number(field14) ccrd," +
                "to_number(FIELD16) levelno,field20 flg ,0 childcount " +
                " from temporary " +
                " where idno=66602 " +
                (ez == "Y" ? " and to_number(field7)-to_number(field8)!=0 " : "") +
                " and usernm='01' and (0=0 or to_number(FIELD16)<=0 )  order by TO_NUMBER(FIELD15)) ";
            sq = thatForm.frm.parseString(sq);
            var pars = Util.nvl(qryObj.rep.rep.parameters, []);

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
        getQryPL2: function (qryObj) {
            var thatForm = this.thatForm;
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

                    ld.cols[ld.getColPos("ACCNO")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("NAME")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("ACCNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("ACCNO")].mTitle = Util.getLangText("accNo");
                    ld.cols[ld.getColPos("NAME")].ct_row = "Y";
                    ld.cols[ld.getColPos("NAME")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("ACCNO")].mHideCol = true;
                    ld.cols[ld.getColPos("NAME")].mTitle = Util.getLangText("titleTxt");
                    ld.cols[ld.getColPos("PARENTACC")].ct_row = "Y";
                    ld.cols[ld.getColPos("LEVELNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("CHILDCOUNT")].ct_row = "Y";

                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";
                    ld.cols[ld.getColPos("MNTH_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos("BALANCE")].ct_val = "Y";
                    ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].data_type = "number";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_width = "120";
                    // ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_style = "";

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();
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
                    //ld.parse("{" + dt.data + "}", true);
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
                        var st = "padding-left:5px;padding-right:5px;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && oData[rowno]["PARENTACC"] != "")
                            st += "font-weight:bold;height:30px;vertical-align:bottom;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && col == "NAME")
                            st += "font-weight:bold;";
                        if (oData[rowno]["PARENTACC"] == "")
                            st += "font-weight:bold;height:40px;vertical-align:bottom;";
                        if (oData[rowno]["LEVELNO"] == -1)
                            st = "font-weight:bold;border-bottom:groove;background-color:lightgrey;";

                        return st;
                    }
                    paras["hideTotals"] = true; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        footerNode_fg["YTD_RATE"] = mapNode_fg["YTD_RATE"];
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                    };
                    // ld.parse("{" + dt.data + "}", true);
                    // ld.do_cross_tab();
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
        addQryPL3: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var fisc = sap.ui.getCore().getModel("fiscalData").getData();
            var ret = true;
            var fromdt = thatForm.frm.getFieldValue("parameter.fromdate");
            var todt = thatForm.frm.getFieldValue("parameter.fromdate");
            var bk = UtilGen.getBackYears(fromdt, todt);
            var ez = thatForm.frm.getFieldValue("parameter.exclzero");

            // order by TO_NUMBER(FIELD15)
            var proc = Util.getSQLValue("select custom_obj from c7_secs_tiles where tile_id=99990");
            var sqx = "SELECT ACCNO,NAME,PARENTACC,LEVELNO,YR||'__BALANCE' YR_BAL, TDEB-TCRD BALANCE,childcount,path,yr_code FROM " +
                " (select ':YEAR_CODE' YR,field1 accno,field2 name,field19 parentacc,field17 path, ':YR_CODE' YR_CODE, " +
                " to_number(field5) bdeb,to_number(field6) bcrd, to_number(field7) tdeb, to_number(field8) tcrd,to_number(field13) cdeb, " +
                " to_number(field14) ccrd,to_number(FIELD16) levelno,field20 flg ,0 childcount " +
                " from :temporary  where idno=66602 " +
                (ez == "Y" ? " and ((to_number(field5)+to_number(field7))-(to_number(field6)+to_number(field8))!=0  or field1='-' ) " : "") +
                " and usernm='01' and (:parameter.levelno=0 or to_number(FIELD16)<=:parameter.levelno ))  ";
            var plsqx =
                "DECLARE " +
                "  plevelno number:=:parameter.levelno;" +
                "  pfromdt date:=:parameter.fromdate;" +
                "  ptodt date:=:parameter.todate; " +
                "  pfromacc varchar2(200):=':parameter.accno'; " +
                "  punposted varchar2(100):=':parameter.unposted'; " +
                "  pcc varchar2(100):=':parameter.costcent'; " + proc;

            var plsqs = [plsqx.replaceAll(":CP_ACCBAL_GL_TRANS", "CP_ACCBAL_GL_TRANS")
                .replaceAll(":temporary", "temporary")
                .replaceAll(":ACVOUCHER2", "ACVOUCHER2")
                .replaceAll(":acaccount", "acaccount")
                .replaceAll(":accostcent1", "accostcent1")];
            var sqs = [sqx.replaceAll(":temporary", "temporary").replaceAll(":YEAR_CODE", fisc.fiscal_title).replaceAll(":YR_CODE", fisc.fiscal_code)];
            for (var bi in bk) {
                plsqs.push(plsqx.replaceAll(":CP_ACCBAL_GL_TRANS", bk[bi].fiscal_schema + ".CP_ACCBAL_GL_TRANS")
                    .replaceAll(":temporary", bk[bi].fiscal_schema + ".temporary")
                    .replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2")
                    .replaceAll(":acaccount", bk[bi].fiscal_schema + ".acaccount")
                    .replaceAll(":accostcent1", bk[bi].fiscal_schema + ".accostcent1"));
                sqs.push(sqx.replaceAll(":temporary", bk[bi].fiscal_schema + ".temporary").
                    replaceAll(":YEAR_CODE", bk[bi].fiscal_title).
                    replaceAll(":YR_CODE", bk[bi].fiscal_code));
            }
            for (var pi in plsqs) {
                plsqs[pi] = thatForm.frm.parseString(plsqs[pi]);
                Util.doAjaxJson("sqlmetadata?", {
                    sql: plsqs[pi],
                    ret: "NONE",
                    data: null
                }, false).done(function (data) {
                });
            }
            var sq = "";
            for (var si in sqs)
                sq += (sq.length > 0 ? " union all " : "") + sqs[si];
            sq = sq + " order by path,yr_code ";
            sq = thatForm.frm.parseString(sq);
            var pars = Util.nvl(qryObj.rep.rep.parameters, []);
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
        getQryPL3: function (qryObj) {
            var thatForm = this.thatForm;
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

                    ld.cols[ld.getColPos("ACCNO")].mUIHelper.display_width = "180";
                    ld.cols[ld.getColPos("NAME")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("ACCNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("ACCNO")].mTitle = Util.getLangText("accNo");
                    ld.cols[ld.getColPos("NAME")].ct_row = "Y";
                    ld.cols[ld.getColPos("NAME")].mUIHelper.display_width = "400";
                    ld.cols[ld.getColPos("ACCNO")].mHideCol = true;
                    ld.cols[ld.getColPos("NAME")].mTitle = Util.getLangText("titleTxt");
                    ld.cols[ld.getColPos("PARENTACC")].ct_row = "Y";
                    ld.cols[ld.getColPos("LEVELNO")].ct_row = "Y";
                    ld.cols[ld.getColPos("CHILDCOUNT")].ct_row = "Y";

                    ld.cols[ld.getColPos("YR_BAL")].ct_col = "Y";
                    ld.cols[ld.getColPos("YR_BAL")].ct_col = "Y";

                    ld.cols[ld.getColPos("BALANCE")].ct_val = "Y";
                    ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].data_type = "number";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_format = "MONEY_FORMAT";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_width = "120";
                    // ld.cols[ld.getColPos("BALANCE")].mSummary = "SUM";
                    ld.cols[ld.getColPos("BALANCE")].mUIHelper.display_style = "";

                    ld.parse("{" + dt.data + "}", true);
                    ld.do_cross_tab();
                    var ez = thatForm.frm.getFieldValue("parameter.exclzero");
                    var cx = ld.addColumn("AGR");
                    cx.mColClass = "sap.m.Label";
                    cx.mUIHelper.data_type = "string";
                    cx.mUIHelper.display_align = "center";
                    cx.mUIHelper.display_format = "";
                    cx.mUIHelper.display_width = 100;
                    cx.mUIHelper.display_style = "";
                    cx.mTitle = Util.getLangText("agrRate");
                    ld.cols[ld.getColPos("PARENTACC")].mHideCol = true;
                    ld.cols[ld.getColPos("LEVELNO")].mHideCol = true;
                    ld.cols[ld.getColPos("CHILDCOUNT")].mHideCol = true;
                    // ld.cols[ld.getColPos("tot__BALANCE")].mUIHelper.display_style = "background-color:lightgrey;";
                    // ld.cols[ld.getColPos("tot__BALANCE")].mTitle = "balanceTxt";
                    ld.cols[ld.getColPos("tot__BALANCE")].mHideCol = true;

                    var lc = ld;
                    for (var ri = 0; ri < lc.rows.length; ri++) {
                        var bl = [], grs = [];
                        for (var li = 0; li < lc.cols.length; li++) {
                            if (bl.length == 0 && lc.cols[li].mColName.endsWith("__BALANCE") && lc.cols[li].mColName != "tot__BALANCE") {
                                bl.push(lc.getFieldValue(ri, lc.cols[li].mColName));
                                grs.push(0);
                                continue;
                            }
                            if (bl.length > 0 && lc.cols[li].mColName.endsWith("__BALANCE") && lc.cols[li].mColName != "tot__BALANCE")
                                if (bl[bl.length - 1] != 0) {
                                    grs.push(((lc.getFieldValue(ri, lc.cols[li].mColName) / bl[bl.length - 1]) - 1) * 100);
                                    bl.push(lc.getFieldValue(ri, lc.cols[li].mColName));
                                }
                        }
                        if (grs.length > 1) {
                            var agr = 0; var tot = 0;
                            grs.forEach(ky => {
                                tot += ky;
                            });
                            agr = Math.round(tot / (grs.length - 1));
                            lc.setFieldValue(ri, "AGR", (agr == 0) ? "" :
                                (agr < 0 ? "(" + Math.abs(agr) + "%)" : agr + "%"));
                        } else
                            lc.setFieldValue(ri, "AGR", "");

                    }
                    /*
                    var lc = ld;
                    for (var li = 0; li < lc.cols.length; li++) {
                        if (Util.nvl(lc.cols[li].ct_val, "N") == "Y") {
                            var tit = parseInt(lc.cols[li].mTitle.split("_")[1]);
                            lc.cols[li].mTitle = (UtilGen.DBView.sLangu == "AR" ? thatForm.monthsAr[tit] : thatForm.monthsEn[tit]) + "-" + lc.cols[li].mTitle.split("_")[0];
                        }
                    }
                    */
                    //ld.parse("{" + dt.data + "}", true);
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
                        var st = "padding-left:5px;padding-right:5px;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && oData[rowno]["PARENTACC"] != "")
                            st += "font-weight:bold;height:30px;vertical-align:bottom;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && col == "NAME")
                            st += "font-weight:bold;";
                        if (oData[rowno]["PARENTACC"] == "")
                            st += "font-weight:bold;height:40px;vertical-align:bottom;";
                        if (oData[rowno]["LEVELNO"] == -1)
                            st = "font-weight:bold;border-bottom:groove;background-color:lightgrey;";

                        return st;
                    }
                    paras["hideTotals"] = true; //(thatForm.frm.getFieldValue("parameter.hideTotals") == "Y");
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {
                        footerNode_fg["YTD_RATE"] = mapNode_fg["YTD_RATE"];
                        footerNode_fg["AGR"] = mapNode_fg["AGR"];
                        footerNode_fg["LEVELNO"] = mapNode_fg["LEVELNO"];
                    };
                    // ld.parse("{" + dt.data + "}", true);
                    // ld.do_cross_tab();
                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    thatForm.qr.setContent(str);

                }
            });
        },
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



