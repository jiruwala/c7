sap.ui.jsfragment("bin.forms.rm.forms.svs1", {
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
            title: "Sales Invoices Prints",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SVS1",
                    name: "Sales Invoices Prints",
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
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(undefined, "500px"),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("SVS1"),
                        print_templates: [
                            {
                                title: "Print..",
                                reportFile: "br/brsale",
                                beforeExec: function (idx, rptName) {
                                    var paras = {};
                                    var rptNo = idx;
                                    paras["pfromno"] = thatForm.frm.objs["SVS1@parameter.pfromno"].obj.mainObj;
                                    paras["ptono"] = thatForm.frm.objs["SVS1@parameter.ptono"].obj.mainObj;
                                    paras["ptype"] = thatForm.frm.objs["SVS1@parameter.ptype"].obj.mainObj;
                                    paras["vouType"] = thatForm.frm.objs["SVS1@parameter.vouType"].obj.mainObj;
                                    for (var fld in paras) {
                                        var vl = UtilGen.getControlValue(paras[fld]);
                                        var parent = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + thatForm.frm.timeInLong);
                                        var para = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + "Para" + thatForm.frm.timeInLong);
                                        UtilGen.setControlValue(parent, vl, vl, true);
                                        UtilGen.setControlValue(para, vl, vl, true);

                                        if (Util.nvl(vl, "") == "" && thatForm.frm.helperFunctions.misc.getObjectByObj(parent).require) {
                                            UtilGen.errorObj(paras[fld]);
                                            ReportView.err(thatForm.helperFunctions.misc.getObjectByObj(parent).colname + " field rquired a value !");
                                        }
                                    }
                                    var rpt = rptName;
                                    var pt = UtilGen.getControlValue(thatForm.frm.objs["SVS1@parameter.ptype"].obj.mainObj);
                                    var pt2 = UtilGen.getControlValue(thatForm.frm.objs["SVS1@parameter.vouType"].obj.mainObj);
                                    var rpt = "br/" + pt;

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
                        selectedKey: "brsale",
                        selectionChange: function () {
                            // var cbttype = thatForm.frm.objs["SVS1@parameter.ptype"].obj.mainObj
                            thatForm.frm.objs["SVS1@parameter.vouType"].obj.mainObj.setEnabled(true);
                            // if (cbttype.getSelectedKey() == "purord")
                            //     thatForm.frm.objs["SVS1@parameter.vouType"].obj.mainObj.setEnabled(false);
                            thatForm.frm.objs["SVS1@parameter.plocation"].obj.mainObj.fireSelectionChange();;
                        }
                    },
                    list: "@brsale/Sales Invoices",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                plocation: {
                    colname: "plocation",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"Location\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: sett["DEFAULT_LOCATION"],
                        selectionChange: function (e) {
                            var cbtyp = thatForm.frm.objs["SVS1@parameter.ptype"].obj.mainObj;
                            if (cbtyp.getSelectedKey() == "brpur") {
                                var cb = thatForm.frm.objs["SVS1@parameter.vouType"].obj.mainObj;
                                var lo = this.getSelectedKey();
                                Util.fillCombo(cb, "select no code,descr name from invoicetype " +
                                    " where accno is null and location_code='" + lo + "' " +
                                    " order by no "
                                );
                                if (cb.getItems().length > 0)
                                    cb.setSelectedItem(cb.getItems()[0]);
                            }
                        },
                    },
                    list: "select code,name from locations order by code",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                vouType: {
                    colname: "vouType",
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
                            template: new sap.ui.core.ListItem({ text: "{CODE}- {NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectedKey: "1",
                    },
                    list: "select '1' code,'credit' name  from dual",
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
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



