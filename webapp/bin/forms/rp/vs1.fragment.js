sap.ui.jsfragment("bin.forms.rp.vs1", {
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

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: "Vouchers",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "VS101",
                    name: "vouchers",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    showXLSMenu: true,
                    showHTMLMenu: false,
                    showQueryPage: false,
                    showCustomPara: function (vbPara, rep) {
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
                        parameters: thatForm.helperFunc.getParas("VS101"),
                        print_templates: [
                            {
                                title: "Print..",
                                reportFile: "vouchers/jv_rng",
                                beforeExec: function (idx, rptName) {
                                    var paras = {};
                                    var rptNo = idx;
                                    paras["pfromno"] = thatForm.frm.objs["VS101@parameter.pfromno"].obj.mainObj;
                                    paras["ptono"] = thatForm.frm.objs["VS101@parameter.ptono"].obj.mainObj;
                                    paras["ptype"] = thatForm.frm.objs["VS101@parameter.ptype"].obj.mainObj;
                                    paras["ptype2"] = thatForm.frm.objs["VS101@parameter.ptype2"].obj.mainObj;
                                    for (var fld in paras) {
                                        var vl = UtilGen.getControlValue(paras[fld]);
                                        var parent = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + thatForm.frm.timeInLong);
                                        var para = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + "Para" + thatForm.frm.timeInLong);
                                        UtilGen.setControlValue(parent, vl, vl, true);
                                        UtilGen.setControlValue(para, vl, vl, true);

                                        if (Util.nvl(vl, "") == "" && thatForm.helperFunctions.misc.getObjectByObj(parent).require) {
                                            UtilGen.errorObj(paras[fld]);
                                            ReportView.err(thatForm.helperFunctions.misc.getObjectByObj(parent).colname + " field rquired a value !");
                                        }
                                    }
                                    var rpt = rptName;
                                    var pt = UtilGen.getControlValue(thatForm.frm.objs["VS101@parameter.ptype"].obj.mainObj);
                                    var pt2 = UtilGen.getControlValue(thatForm.frm.objs["VS101@parameter.ptype2"].obj.mainObj);
                                    var rpts = ["vouchers/jv_rng", "vouchers/rv_rng" + pt2, "vouchers/pv_rng" + pt2];
                                    if (pt == 1)
                                        rpt = rpts[0];
                                    if (pt == 2 || pt == 3)
                                        rpt = rpts[pt - 1];

                                    return { reportFile: rpt, paras: "&_para_vouType=" + pt2 };
                                }
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
                                dml: "select '' accno from dual",
                                // beforeLoadQry: function (sql, qryObj) {
                                //     return "";
                                // },
                                bat7CustomAddQry: function (qryObj, ps) {
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
                pfromno: {
                    colname: "pfromno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"From No\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "0",
                    other_settings: {
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ptono: {
                    colname: "ptono",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"To No \",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "0",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ptype: {
                    colname: "ptype",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"acvouType\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "-1",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "1",
                    },
                    list: "@JV,2/Recipt Vouchers/,3/Payment Vouchers",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ptype: {
                    colname: "ptype",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"acvouType\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "-1",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "1",
                    },
                    list: "@-/General JV,2/Recipt Vouchers/,3/Payment Vouchers",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ptype: {
                    colname: "ptype",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"acvouType\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "1",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            var cnt = this;
                            var cntVal = UtilGen.getControlValue(cnt);
                            var cbt2 = thatForm.frm.objs["VS101@parameter.ptype2"].obj.mainObj;
                            if (cntVal == "1")
                                Util.fillCombo(cbt2, "@1/General JV,2/Purchase JV,3/Sales JV");
                            if (cntVal == "2" || cntVal == 3)
                                Util.fillCombo(cbt2, "@1/Bank,2/Cash");
                            if (cbt2.getItems().length > 0)
                                cbt2.setSelectedItem(cbt2.getItems()[0]);


                        },
                        selectedKey: "1",
                    },
                    list: "@1/General JV,2/Recipt Vouchers/,3/Payment Vouchers",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                ptype2: {
                    colname: "ptype2",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"acvouType2\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "-1",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "1",
                    },
                    list: "@1/General JV,2/Purchase JV,3/Sales JV",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
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



