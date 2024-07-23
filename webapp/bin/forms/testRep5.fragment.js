sap.ui.jsfragment("bin.forms.testRep5", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.timeInLong = (new Date()).getTime();

        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            ord_code: 106,
            onm: ""
        };
        // this.pgDetail = new sap.m.Page({showHeader: false});

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        // this.mainPage = new sap.m.Page({
        //     showHeader: false,
        //     showNavButton: false,
        //     enableScroll: true,
        //     height: "100%",
        //     content: []
        // });
        //
        // this.mainParaPg = new sap.m.Page({
        //     showHeader: false,
        //     showNavButton: false,
        //     enableScroll: true,
        //     height: "100%",
        //     content: []
        // });
        // this.pgMaster = new sap.m.Page({
        //     showHeader: false,
        //     showFooter: true,
        //     showNavButton: false,
        //     enableScroll: true,
        //     height: "100%",
        //     content: [new sap.m.Title({text: "Settings"})]
        // });
        // this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addMasterPage(this.pgMaster);
        // setTimeout(function () {
        //     that.joApp.showMaster();
        // }, 10);
        //
        // this.joApp.to(this.mainPage, "show");
        // // this.joApp.hideMaster();
        // this.joApp.setMasterButtonText("Setup");
        //
        //

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
            if (obj == undefined) return;
            var tbl = obj.getParent().getParent();
            var mdl = tbl.getModel();
            var rr = tbl.getRows().indexOf(obj.getParent());
            var rowStart = tbl.getFirstVisibleRow();
            // var rx = mdl.getData()[rowStart + rr]._rowid;
            // if (rx == undefined) return;
            // var vcd = parseInt(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "VOU_CODE")].getText());
            // var typ = parseInt(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "VOU_TYPE")].getText());
            var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());
            var jvpos = parseInt(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "JVPOS")].getText());
            // var  = tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "")].getText();

            var dtx = Util.execSQLWithData("select vou_code,type from acvoucher1 where keyfld=" + kfld, "No data found ..");
            var vcd = dtx[0].VOU_CODE;
            var typ = dtx[0].TYPE;

            if (vcd == 1 && typ == 1) {
                UtilGen.execCmd("gl.jv formType=dialog formSize=100%,80% status=view keyfld=" + kfld + " jvpos=" + jvpos, thatForm.view, obj, undefined);
            } else if (vcd == 3 && (typ == 1 || typ == 6)) {
                UtilGen.execCmd("gl.pv formType=dialog formSize=100%,80% status=view keyfld=" + kfld + " jvpos=" + jvpos, thatForm.view, obj, undefined);
            } else if (vcd == 2 && (typ == 1 || typ == 6)) {
                UtilGen.execCmd("gl.rv formType=dialog formSize=100%,80% status=view keyfld=" + kfld + " jvpos=" + jvpos, thatForm.view, obj, undefined);
            } else if (vcd == 2 && (typ == 2 || typ == 7)) {
                UtilGen.execCmd("gl.rvc formType=dialog formSize=100%,80% status=view keyfld=" + kfld + " jvpos=" + jvpos, thatForm.view, obj, undefined);
            } else if (vcd == 3 && (typ == 2 || typ == 7)) {
                UtilGen.execCmd("gl.pvc formType=dialog formSize=100%,80% status=view keyfld=" + kfld + " jvpos=" + jvpos, thatForm.view, obj, undefined);
            }
            else {
                sap.m.MessageToast.show("Not a JV..");
            }
        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        // this.frm = this.createViewHeader();
        // this.frm.getToolbar().addContent(this.bk);

        // Util.destroyID("poCmdSave", this.view);
        // this.frm.getToolbar().addContent(new sap.m.Button(this.view.createId("poCmdSave"), {
        //     icon: "sap-icon://save", press: function () {
        //         that.save_data();
        //     }
        // }));
        //
        // Util.destroyID("poCmdDel", this.view);
        // this.frm.getToolbar().addContent(new sap.m.Button(this.view.createId("poCmdDel"), {
        //     icon: "sap-icon://delete", press: function () {
        //         that.delete_data();
        //     }
        // }));
        // that.createScrollCmds(this.frm.getToolbar());

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: "SOA",
            title2: "Statement Of A/C",
            show_para_pop: false,
            reports: [
                {
                    code: "SOA001",
                    name: "SOA",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
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
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: {
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
                                            thatForm.frm.setFieldValue("SOA001@parameter.paccno", "", "", true);
                                            return;
                                        }
                                        Util.showSearchList("select accno,name from acaccount order by path", "NAME", "ACCNO", function (valx, val) {
                                            thatForm.frm.setFieldValue("SOA001@parameter.paccno", valx, val, true);
                                            sap.m.MessageToast.show(thatForm.frm.getFieldValue("SOA001@parameter.paccno"));
                                        });
                                    },
                                    change: function (event) {
                                        var vl = event.oSource.getValue();
                                        thatForm.frm.setFieldValue("SOA001@parameter.paccno", vl, vl, true);
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
                                            thatForm.frm.setFieldValue("SOA001@parameter.pcc", "", "", true);
                                            return;
                                        }
                                        Util.showSearchList("select code,title name from accostcent1 order by path", "NAME", "CODE", function (valx, val) {
                                            // UtilGen.setControlValue(obj, val, valx, true);
                                            thatForm.frm.setFieldValue("SOA001@parameter.pcc", valx, val, true);
                                            sap.m.MessageToast.show(thatForm.frm.getFieldValue("SOA001@parameter.pcc"));
                                        });

                                    },
                                    change: function (event) {
                                        var vl = event.oSource.getValue();
                                        thatForm.frm.setFieldValue("SOA001@parameter.pcc", vl, vl, true);
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
                                            thatForm.frm.setFieldValue("SOA001@parameter.pref", "", "", true);
                                            return;
                                        }
                                        Util.showSearchList("select code,name from c_ycust order by path", "NAME", "CODE", function (valx, val) {
                                            thatForm.frm.setFieldValue("SOA001@parameter.pref", valx, val, true);
                                            sap.m.MessageToast.show(thatForm.frm.getFieldValue("SOA001@parameter.pref"));
                                        });

                                    },
                                    change: function (event) {
                                        var vl = event.oSource.getValue();
                                        thatForm.frm.setFieldValue("SOA001@parameter.pref", vl, vl, true);
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
                            inclUnpost: {
                                colname: "inclUnpost",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '{\"text\":\"paraInclUnpost\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                        },
                        print_templates: [
                            {
                                title: "Customer SOA",
                                reportFile: "soa001_2",
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
                                rowHeight: 18,
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
                                    thatForm.save_soa();
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
                                    branch_name: {
                                        colname: "branch_name",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Branch",
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
                                            var ag = thatForm.frm.getFieldValue("SOA001@parameter.pageing");
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
                                            var ag = thatForm.frm.getFieldValue("SOA001@parameter.pageing");
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
                {

                    code: "SOA002",
                    name: "SOA- By Accounts",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: false,
                    showDispCols: true,
                    clearCatchReportImmediate: false,
                    saveReportBeforeClear: true,
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: {
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
                            fromacc: {
                                colname: "fromacc",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.SEARCHFIELD,
                                title: '{\"text\":\"From A/c\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                                            thatForm.frm.setFieldValue("SOA002@parameter.fromacc", "", "", true);
                                            return;
                                        }
                                        Util.showSearchList("select accno,name from acaccount where childcount=0 order by path", "NAME", "ACCNO", function (valx, val) {
                                            thatForm.frm.setFieldValue("SOA002@parameter.fromacc", valx, val, true);
                                            sap.m.MessageToast.show(thatForm.frm.getFieldValue("SOA002@parameter.fromacc"));
                                        });
                                    },
                                    change: function (event) {
                                        var vl = event.oSource.getValue();
                                        thatForm.frm.setFieldValue("SOA002@parameter.fromacc", vl, vl, true);
                                    }


                                },
                                list: "select accno,name from acaccount where childcount=0 order by path",
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                            },
                            toacc: {
                                colname: "toacc",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.SEARCHFIELD,
                                title: '{\"text\":\"To A/c\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                                            thatForm.frm.setFieldValue("SOA002@parameter.toacc", "", "", true);
                                            return;
                                        }
                                        Util.showSearchList("select accno,name from acaccount where childcount=0 order by path", "NAME", "ACCNO", function (valx, val) {
                                            thatForm.frm.setFieldValue("SOA002@parameter.toacc", valx, val, true);
                                            sap.m.MessageToast.show(thatForm.frm.getFieldValue("SOA002@parameter.toacc"));
                                        });
                                    },
                                    change: function (event) {
                                        var vl = event.oSource.getValue();
                                        thatForm.frm.setFieldValue("SOA002@parameter.toacc", vl, vl, true);
                                    }

                                },
                                list: "",
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                            }
                        },
                        print_templates: [
                            {
                                title: "Print PDF",
                                reportFile: "soa_10102_1",
                            }
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qryAc1",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                canvas: "qryAc1Canvas",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                execOnShow: false,
                                showToolbar: true,
                                isMaster: true,
                                masterToolbarInMain: true,
                                dml: "select accno,acname,acbal from c7_gl_ac1" +
                                    " where usernm=c6_session.get_user_session  and acbal!=0  order by accno ",
                                // beforeLoadQry: function (sql, qryObj) {
                                //     return "";
                                // },
                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                bat7CustomGetData: function (qryObj) {

                                },
                                onCustomValueFields: function (qrtObj) {
                                    //thatForm.frm.setFieldValue("SOA001@qry3.accno", "xxx11");
                                    //thatForm.frm.setFieldValue("SOA001@qry3.descr", "custom descr");
                                },
                                fields: {
                                    accno: {
                                        colname: "accno",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '{\"text\":\"Acc No\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: { width: "20%", editable: false },
                                    },
                                    acname: {
                                        colname: "acname",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: { width: "50%", editable: false },
                                    }

                                }
                            },
                            {
                                type: "query",
                                name: "qryAc2",
                                disp_class: "paddingLR5P",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                canvas: "qryAc2Canvas",
                                showToolbar: true,
                                canvasType: ReportView.CanvasType.VBOX,
                                dispRecords: { "S": 6, "M": 15, "L": 18, "XL": 22, "XXL": 35 },
                                execOnShow: false,
                                masterQry: "SOA002@qryAc1",
                                masterDetailRelation: ":accno==accno",   //  .match(/=\s*([A-Za-z_0-9.]*)/gm)
                                dml: "select '01' accno , 'do it' descr from dual",
                                // parent: "PARENTACC",
                                code: "ACCNO",
                                title: "NAME",
                                filterCols: ["ACCNO", "VOU_DATE", "DESCR", "DEBIT", "CREDIT", "NAME"],
                                beforeLoadQry: function (sql) {
                                    /*                                    
                                    var sq =
                                        "BEGIN C7_STATMENT_ACCS(:parameter.fromdate,:parameter.todate,':parameter.fromacc',':parameter.toacc'); COMMIT; END;";
                                    sq = thatForm.frm.parseString(sq);
                                    Util.doAjaxJson("sqlmetadata?", {
                                        sql: sq,
                                        ret: "NONE",
                                        data: null
                                    }, false).done(function (data) {
                                    });
                                    */
                                    thatForm.save_soa_acc();
                                    return "select *from c7_gl_ac2 where 1=1 and usernm=c6_session.get_user_session order by accno,pos";
                                },
                                fields: {
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
                                        display_style: "color:maroon;",
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
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
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
                                        display_width: "120",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    vou_date: {
                                        colname: "vou_date",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Date",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        canvas: "default_canvas",
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "SHORT_DATE_FORMAT",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},
                                        // commandLink: "gl.jv formSize=100%,550px status=view keyfld=:keyfld",
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
                                        display_width: "200",
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
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
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
                                    subaccno: {
                                        colname: "SUBACCNO",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Sub A/c",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
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
                                        display_width: "150",
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
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    costcent: {
                                        colname: "COSTCENT",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Cost Center",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
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
                                name: "qryAc3",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                canvas: "qryAc1Canvas2",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                execOnShow: false,
                                showToolbar: false,
                                masterQry: "SOA002@qryAc1",
                                masterDetailRelation: "",
                                masterToolbarInMain: true,
                                dml: "select 0 totob,0 totdeb, 0 totcrd from dual",
                                fields: {
                                    totob: {
                                        colname: "totob",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.TEXTFIELD,
                                        title: '{\"text\":\"openBal\",\"width\":\"10%\","textAlign":"End"}',
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: { width: "20%", editable: false },
                                    },
                                    totdeb: {
                                        colname: "totdeb",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.TEXTFIELD,
                                        title: '@{\"text\":\"debitTxt\",\"width\":\"10%\","textAlign":"End"}',
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: { width: "20%", editable: false },
                                    },
                                    totcrd: {
                                        colname: "totcrd",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.TEXTFIELD,
                                        title: '@{\"text\":\"creditTxt\",\"width\":\"10%\","textAlign":"End"}',
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: { width: "20%", editable: false },
                                    }
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
    save_soa_acc: function () {
        var thatForm = this;

        var bk = UtilGen.getBackYears(thatForm.frm.getFieldValue("parameter.fromdate"), thatForm.frm.getFieldValue("parameter.todate"));
        // if (bk.length > 0) {
        var plsql = "declare ";
        //cursor su is ----in getaccbal function to replace
        var sqxAB = "SELECT nvl(sum(deb-crd),0) bal FROM :V_STATMENT_1 v " +
            " WHERE v.PATH LIKE ACNo AND VOU_DATE<DT AND " +
            " (cost_PATH  LIKE CC||'%' or cc is null) " +
            " and (cust_path like cd||'%' or cd is null) :KEYFLD_CONDITION ";
        //cursor acx1 is  --- GETPATHDEBIT 
        var sqxAx1 = "select SUM(DEBIT) DRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
            " A.ACCNO=V.ACCNO AND V.VOU_DATE>=FROMDATE AND " +
            " V.VOU_DATE<=TODATE :KEYFLD_CONDITION";
        //cursor acx2 is  --- GETPATHCREDIT
        var sqxAx2 = "select SUM(DEBIT) CRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
            " A.ACCNO=V.ACCNO AND  " +
            " V.VOU_DATE<=TODATE :KEYFLD_CONDITION ";

        var sqx = " SELECT sum(CREDIT) crD,sum(DEBIT) deb,NO,vou_code,DESCR2,DESCR,V.COSTCENT,V.type,vou_date,POS,V.KEYFLD,A.PATH,A.ACCNO ,SUM(FCDEBIT) FCDEBIT,FCRATE,SUM(FCCREDIT) FCCREDIT,FCCODE,cust_code FROM :ACVOUCHER2 V, ACACCOUNT A " +
            " WHERE PATH LIKE ACN AND VOU_DATE>=FROMDT AND VOU_DATE<=TODT" +
            " AND V.ACCNO=A.ACCNO :KEYFLD_CONDITION " +
            " group by no,vou_code,V.type,descr2,VOU_DATE,DESCR,POS,V.KEYFLD,V.COSTCENT,A.PATH,A.ACCNO,FCRATE,FCCODE,cust_code "

        var sqs = [sqx.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs1 = [sqxAB.replaceAll(":V_STATMENT_1", "V_STATMENT_1").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs2 = [sqxAx1.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs3 = [sqxAx2.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];

        for (var bi in bk) {
            sqs.push(sqx.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs1.push(sqxAB.
                replaceAll(":V_STATMENT_1", bk[bi].fiscal_schema + ".V_STATMENT_1").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs2.push(sqxAx1.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs3.push(sqxAx2.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
        }
        var sqls = "";
        var sqls1 = "", sqls2 = "", sqls3 = "";
        for (var si in sqs)
            sqls += (sqls.length > 0 ? " union all " : "") + sqs[si];
        for (var si in sqs1)
            sqls1 += (sqls1.length > 0 ? " union all " : "") + sqs1[si];
        for (var si in sqs2)
            sqls2 += (sqls2.length > 0 ? " union all " : "") + sqs2[si];
        for (var si in sqs3)
            sqls3 += (sqls3.length > 0 ? " union all " : "") + sqs3[si];

        var paras = "fromdt date := :parameter.fromdate;";
        paras += "todt date := :parameter.todate;";
        paras += "fromacc varchar2(100) := ':parameter.fromacc';";
        paras += "toacc varchar2(100) := ':parameter.toacc'; ";
        sqls = "declare " + paras + " CURSOR XX(ACN VARCHAR2) IS " + sqls + " ORDER BY vou_date;";
        var str = Util.getSQLValue("select custom_obj from c7_secs_tiles where tile_id=99991");
        sqls = sqls + str;
        sqls = sqls.replaceAll(":_CURSOR_SU_ACCBAL", sqls1);
        sqls = sqls.replaceAll(":_CURSOR_ACX1", sqls2);
        sqls = sqls.replaceAll(":_CURSOR_ACX2", sqls3);

        sqls = thatForm.frm.parseString(sqls);
        console.log(sqls);
        var dt = Util.execSQL(sqls);
        if (dt.ret != "SUCCESS")
            FormView.err("Err. executing sql for multiple years !");
        // }
        // else {
        //     var sq =
        //         "BEGIN C7_STATMENT_ACCS(:parameter.fromdate,:parameter.todate,':parameter.fromacc',':parameter.toacc'); COMMIT; END;";
        //     sq = thatForm.frm.parseString(sq);
        //     Util.doAjaxJson("sqlmetadata?", {
        //         sql: sq,
        //         ret: "NONE",
        //         data: null
        //     }, false).done(function (data) {
        //     });
        // }

    }
    ,
    save_soa: function () {
        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var bk = UtilGen.getBackYears(thatForm.frm.getFieldValue("parameter.fromdate"), thatForm.frm.getFieldValue("parameter.todate"));
        var incUnpost = thatForm.frm.getFieldValue("parameter.inclUnpost");
        var vflg = (incUnpost == "Y" ? "" : " and v.flag=2 ");
        // if (bk.length > 0) {
        var plsql = "declare ";
        //cursor su is ----in getaccbal function to replace
        var sqxAB = "SELECT nvl(sum(deb-crd),0) bal FROM :V_STATMENT_1 v " +
            " WHERE (v.PATH LIKE ACNo||'%' or acno is null)  AND VOU_DATE<DT AND " +
            " (cost_PATH  LIKE CC||'%' or cc is null) " +
            " and (cust_path like cd||'%' or cd is null) :KEYFLD_CONDITION ";
        //cursor acx1 is  --- GETPATHDEBIT 
        var sqxAx1 = "select SUM(DEBIT) DRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
            " A.ACCNO=V.ACCNO AND V.VOU_DATE>=FROMDATE AND " +
            " V.VOU_DATE<=TODATE :KEYFLD_CONDITION";
        //cursor acx2 is  --- GETPATHCREDIT
        var sqxAx2 = "select SUM(DEBIT) CRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
            " A.ACCNO=V.ACCNO AND  " +
            " V.VOU_DATE<=TODATE :KEYFLD_CONDITION ";
        var sqx = "SELECT sum(CREDIT) crD,sum(DEBIT) deb,NO,vou_code,DESCR2,DESCR,V.COSTCENT,V.type,vou_date,POS,V.KEYFLD,A.PATH,A.ACCNO ,SUM(FCDEBIT) FCDEBIT,FCRATE,SUM(FCCREDIT) FCCREDIT,FCCODE,cust_code,v.BRANCH_NO FROM :ACVOUCHER2 V, ACACCOUNT A " +
            " WHERE PATH LIKE ACN AND VOU_DATE>=FROMDT AND VOU_DATE<=TODT " +
            " AND V.ACCNO=A.ACCNO AND (V.COSTCENT=CC or cc is null) " + vflg +
            " AND (CUST_CODE=PCUST OR PCUST IS NULL)  :KEYFLD_CONDITION " +
            " group by no,vou_code,V.type,descr2,VOU_DATE,DESCR,POS,V.KEYFLD,V.COSTCENT,A.PATH,A.ACCNO,FCRATE,FCCODE,cust_code,v.BRANCH_NO ";
        // var sqx = " SELECT sum(CREDIT) crD,sum(DEBIT) deb,NO,vou_code,DESCR2,DESCR,V.COSTCENT,V.type,vou_date,POS,V.KEYFLD,A.PATH,A.ACCNO ,SUM(FCDEBIT) FCDEBIT,FCRATE,SUM(FCCREDIT) FCCREDIT,FCCODE,cust_code FROM :ACVOUCHER2 V, ACACCOUNT A " +
        //     " WHERE PATH LIKE ACN AND VOU_DATE>=FROMDT AND VOU_DATE<=TODT" +
        //     " AND V.ACCNO=A.ACCNO :KEYFLD_CONDITION " +
        //     " group by no,vou_code,V.type,descr2,VOU_DATE,DESCR,POS,V.KEYFLD,V.COSTCENT,A.PATH,A.ACCNO,FCRATE,FCCODE,cust_code "
        var sqs = [sqx.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs1 = [sqxAB.replaceAll(":V_STATMENT_1", "V_STATMENT_1").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs2 = [sqxAx1.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
        var sqs3 = [sqxAx2.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];

        for (var bi in bk) {
            sqs.push(sqx.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs1.push(sqxAB.
                replaceAll(":V_STATMENT_1", bk[bi].fiscal_schema + ".V_STATMENT_1").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs2.push(sqxAx1.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
            sqs3.push(sqxAx2.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));

        }
        var sqls = "";
        var sqls1 = "", sqls2 = "", sqls3 = "";
        for (var si in sqs)
            sqls += (sqls.length > 0 ? " union all " : "") + sqs[si];
        for (var si in sqs1)
            sqls1 += (sqls1.length > 0 ? " union all " : "") + sqs1[si];
        for (var si in sqs2)
            sqls2 += (sqls2.length > 0 ? " union all " : "") + sqs2[si];
        for (var si in sqs3)
            sqls3 += (sqls3.length > 0 ? " union all " : "") + sqs3[si];



        var paras = "fromdt date := :parameter.fromdate;";
        paras += "todt date := :parameter.todate;";
        paras += "pincup varchar2(255) := ':parameter.inclUnpost';";
        paras += "toacc varchar2(100) := ':parameter.paccno'; ";
        paras += "pbrno varchar2(100) := '';";
        paras += "cstcent varchar2(100) := ':parameter.pcc';";
        paras += "pcust varchar2(100) := ':parameter.pref';";
        paras += "PAGEING varchar2(100) := ':parameter.pageing';";
        paras += "TYPEX varchar2(100) := 'ALL';";
        paras += "DEL_OLD_DATA boolean := true;";
        paras += "ses_id varchar2(200) :='" + sett["SESSION_ID"] + "';";
        paras += "logon_user varchar2(200) :='" + sett["LOGON_USER"] + "';";


        sqls = "declare " + paras + " CURSOR XX(ACN VARCHAR2,CC VARCHAR2) IS " + sqls + " ORDER BY vou_date; ";
        var str = Util.getSQLValue("select custom_obj from c7_secs_tiles where tile_id=99992.1");
        sqls = sqls + str;
        sqls = sqls.replaceAll(":_CURSOR_SU_ACCBAL", sqls1);
        sqls = sqls.replaceAll(":_CURSOR_ACX1", sqls2);
        sqls = sqls.replaceAll(":_CURSOR_ACX2", sqls3);

        sqls = thatForm.frm.parseString(sqls);
        console.log(sqls);
        var dt = Util.execSQL(sqls);
        if (dt.ret != "SUCCESS")
            FormView.err("Err. executing sql for multiple years !");
        // }
        // else {
        //     var sq =
        //         "BEGIN C6_STATMENT(:parameter.fromdate,:parameter.todate,':parameter.paccno',':parameter.pcc',':parameter.pref','ALL',TRUE,':parameter.pageing'); COMMIT; END;";
        //     sq = thatForm.frm.parseString(sq);
        //     Util.doAjaxJson("sqlmetadata?", {
        //         sql: sq,
        //         ret: "NONE",
        //         data: null
        //     }, false).done(function (data) {
        //     });
        // }

    },

    loadData: function () {
        // var that = this;
        // var sq = "select accno,name,debit,credit from acc_balance_1 order by path";
        // Util.doAjaxJson("sqlmetadata", {sql: sq}, false).done(function (data) {
        //     if (data.ret == "SUCCESS") {
        //         that.qv.setJsonStrMetaData("{" + data.data + "}");
        //         var c = that.qv.mLctb.getColPos("DEBIT");
        //         that.qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
        //         that.qv.mLctb.cols[c].mSummary = "SUM";
        //         c = that.qv.mLctb.getColPos("CREDIT");
        //         that.qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
        //         that.qv.mLctb.cols[c].mSummary = "SUM";
        //
        //         that.qv.mLctb.parse("{" + data.data + "}", true);
        //         that.qv.loadData();
        //         // that.qv.getControl().setVisibleRowCount(that.qv.mLctb.rows.length + 3);
        //     }
        // });

    }
    ,
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



