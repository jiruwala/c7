sap.ui.jsfragment("bin.forms.rm.forms.cont", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        // this.vars = {
        //     keyfld: -1,
        //     flag: 1,  // 1=closed,2 opened,
        //     vou_code: 1,
        //     type: 1
        // };

        // this.pgDetail = new sap.m.Page({showHeader: false});

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        this.mainPage = new sap.m.Page({
            showHeader: false,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }

        });


        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("supplierContract"),
                toolbarBG: "#fff0f5",
                formSetting: {
                    width: { "S": 400, "M": 500, "L": 600 },
                    cssText: [
                        "padding-left:10px;" +
                        "padding-top:20px;" +
                        "border-width: thin;" +
                        "border-style: solid;" +
                        "border-color: lightgreen;" +
                        "margin: 10px;" +
                        "border-radius:25px;" +
                        "background-color:#fff0f5;"
                    ]
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "0.000" }));
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                },
                print_templates: [],
                events: {
                    afterExeSql: function (oSql) {
                        // thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.code"));
                    },
                    afterLoadQry: function (qry) {
                        if (qry.name == "qry1") {
                            qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                            UtilGen.Search.getLOVSearchField("select name from c_ycust where code = :CODE ", qry.formview.objs["qry1.ref_code"].obj, undefined, that.frm.objs["qry1.ref_name"].obj);
                        }
                    },
                    beforeLoadQry: function (qry, sql) {
                        return sql;
                    },
                    afterSaveQry: function (qry) {

                    },
                    afterSaveForm: function (frm, nxtStatus) {
                        frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
                    },
                    beforeSaveQry: function (qry, sqlRow, rowNo) {
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                        var exist = Util.getSQLValue("select max(keyfld) from c7_rmcont where keyfld!=" +
                            qry.formview.getFieldValue("keyfld") + " and location_code=" +
                            qry.formview.getFieldValue("location_code") + " and ref_code=" +
                            qry.formview.getFieldValue("ref_code"));
                        if (Util.nvl(exist, "") != "")
                            FormView.err(qry.formview.getFieldValue("location_code") +
                                " ,  supplier # " + qry.formview.getFieldValue("ref_code") + " Existed in KEYFLD # " + exist);

                        return "";
                    },
                    afterNewRow: function (qry, idx, ld) {
                        if (qry.name == "qry1") {
                            var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_rmcont");
                            qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);

                            that.frm.setFieldValue("pac", "", "", true);
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                            that.view.byId("numtxt" + thatForm.timeInLong).setText("");

                            var dt = thatForm.view.today_date.getDateValue();
                            qry.formview.setFieldValue("qry1.cont_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);

                        }
                    },
                    beforeDeleteValidate: function (frm) {
                        // var qry = that.frm.objs["qry1"];
                        // if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        //     (qry.status == FormView.RecordStatus.VIEW)) {
                        //     var valx = that.frm.getFieldValue("pac");
                        //     var accno = that.frm.getFieldValue("qry1.code");
                        //     if (valx != accno) {
                        //         FormView.err("Account not same as " + accno + " <> " + valx + " , Refresh data !");
                        //     }
                        //     var vldtt = Util.getSQLValue("select usecount from accostcent1 where code = " + Util.quoted(valx));
                        //     if (Util.nvl(vldtt, 0) > 0) {
                        //         FormView.err("Err ! , this cost center have transaction #" + vldtt);
                        //     }
                        // }
                    },
                    beforeDelRow: function (qry, idx, ld, data) {

                    },
                    afterDelRow: function (qry, ld, data) {
                        if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                            qry.obj.addRow();
                        return "";
                    },
                    onCellRender: function (qry, rowno, colno, currentRowContext) {
                    },
                    beforePrint: function (rptName, params) {
                        return params;
                    }

                },
                parameters: [
                    {
                        para_name: "pac",
                        data_type: FormView.DataType.String,
                        value: ""
                    }
                ],
                db: [
                    {
                        type: "query",
                        name: "qry1",
                        dml: "select *from c7_rmcont  where keyfld=':pac'",
                        where_clause: " keyfld=':keyfld'",
                        update_exclude_fields: ["ref_name"],
                        insert_exclude_fields: ["ref_name"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                        },
                        update_default_values: {},
                        table_name: "c7_rmcont",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: {
                            keyfld: {
                                colname: "keyfld",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Key Id\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            location_code: {
                                colname: "location_code",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '@{\"text\":\"locationTxt\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                list: "select code,name from locations order by code",
                                other_settings: {
                                    width: "25%",
                                    customData: [{ key: "" }],
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true
                            },
                            ref_code: {
                                colname: "ref_code",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"refCode\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "25%",
                                    showValueHelp: true,
                                    change: function (e) {

                                        var exist = Util.getSQLValue("select max(keyfld) from c7_rmcont where keyfld!=" +
                                            thatForm.frm.getFieldValue("keyfld") + " and location_code=" +
                                            thatForm.frm.getFieldValue("location_code") + " and ref_code=" +
                                            thatForm.frm.getFieldValue("ref_code"));

                                        if (Util.nvl(exist, "") != "")
                                            FormView.err(thatForm.frm.getFieldValue("location_code") +
                                                " ,  supplier # " + thatForm.frm.getFieldValue("ref_code") + " Existed in KEYFLD # " + exist);

                                        UtilGen.Search.getLOVSearchField("select name from c_ycust where childcount=0 and code = ':CODE'", that.frm.objs["qry1.ref_code"].obj, undefined, that.frm.objs["qry1.ref_name"].obj);

                                    },
                                    valueHelpRequest: function (e) {
                                        UtilGen.Search.do_quick_search(e, this,
                                            "select code,Name title from c_ycust where issupp='Y' and childcount=0  order by path ",
                                            "select code,name title from c_ycust where code=:CODE", that.frm.objs["qry1.ref_name"].obj);

                                    },
                                },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true
                            },
                            ref_name: {
                                colname: "ref_name",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "49%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            cont_date: {
                                colname: "cont_date",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.DATEFIELD,
                                title: '{\"text\":\"txtDate\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                default_value: "$TODAY",
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true
                            },
                        },
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.RMCONTITEMS",
                        addRowOnEmpty: true,
                        dml: "select c.POS,C.REFER,I.DESCR,I.PACKD,I.PACK,C.PRICE,C.KEYFLD from C7_RMCONTITEMS C,ITEMS I WHERE C.KEYFLD=':qry1.keyfld' AND REFERENCE=REFER ORDER BY C.POS",
                        dispRecords: { "S": 7, "M": 9, "L": 13, "XL": 20, "XXL": 25 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from C7_RMCONTITEMS where keyfld=':qry1.keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', "DESCR", "PACKD", "PACK"],
                        insert_exclude_fields: ["DESCR", "PACKD", "PACK"],
                        insert_default_values: {
                            "KEYFLD": ":qry1.keyfld",
                        },
                        update_default_values: {

                        },
                        table_name: "c7_rmcontitems",
                        before_add_table: function (scrollObjs, qrj) { },
                        when_validate_field: function (table, currentRowoIndexContext, cx, rowno, colno) { },
                        eventCalc: function (qv, cx, rowno, reAmt) { },
                        summary: {},
                    },

                ],
                canvas: [],
                commands: [
                    {
                        name: "cmdSave",
                        canvas: "default_canvas",
                        onPress: function (e) {

                            return true;
                        }
                    },
                    {
                        name: "cmdDel",
                        canvas: "default_canvas",
                    }, {
                        name: "cmdEdit",
                        canvas: "default_canvas",
                    },
                    {
                        name: "cmdNew",
                        canvas: "default_canvas",
                        title: "New..",
                        onPress: function (e) {
                            that.frm.setFieldValue("pac", "", "", true);
                        }
                    },
                    {
                        name: "cmdList",
                        canvas:
                            "default_canvas",
                        list_name:
                            "list1"
                    }
                    ,
                    {
                        name: "cmdClose",
                        canvas:
                            "default_canvas",
                        title:
                            "Close",
                        obj:
                            new sap.m.Button({
                                icon: "sap-icon://decline",
                                press: function () {
                                    that2.joApp.backFunction();
                                }
                            })
                    }
                ],
                lists: [
                    {
                        name: 'list1',
                        title: "List ",
                        list_type: "sql",
                        cols: [
                            {
                                colname: "NAME"
                            },
                            {
                                colname: "LOCATION_NAME"
                            },
                            {
                                colname: "CONT_DATE"
                            },
                            {
                                colname: 'KEYFLD',
                                return_field: "pac",
                            },
                            {
                                colname: "DESCR",
                            },
                        ],  // [{colname:'code',width:'100',return_field:'pac' }]
                        sql: "SELECT L.NAME LOCATION_NAME,C.LOCATION_CODE,C.REF_CODE,Y.NAME,C.CONT_DATE,C.DESCR,C.KEYFLD  FROM " +
                            " C7_RMCONT C,C_YCUST Y ,LOCATIONS L WHERE C.LOCATION_CODE=L.CODE AND Y.CODE=C.REF_CODE ORDER BY C.KEYFLD DESC",
                        afterSelect: function (data) {
                            that2.frm.loadData(undefined, "view");
                            return true;
                        }
                    }
                ]

            }
        }
            ;
        this.frm = new FormView(this.mainPage);
        this.frm.view = view;
        this.frm.pg = this.mainPage;
        this.frm.parseForm(js);
        this.frm.createView();

        // this.mainPage.addContent(sc);

    },
    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";


        // this.cs = {};
        // this.cs.code = UtilGen.addControl(fe, "Code", sap.m.Input, "Cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: codSpan}),
        //     }, "string", undefined, this.view);
        // this.cs.title = UtilGen.addControl(fe, "@Title", sap.m.Input, "cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: titSpan}),
        //     }, "string", undefined, this.view);
        //
        //
        // return UtilGen.formCreate("", true, fe);
        // return UtilGen.formCreate("", true, fe, undefined, undefined, [1, 1, 1]);

    }
    ,
    loadData: function () {
        // if (Util.nvl(this.oController.accno, "") != "" &&
        //     Util.nvl(this.oController.status, "view") == FormView.RecordStatus.VIEW) {
        //     this.frm.setFieldValue("pac", this.oController.accno, this.oController.accno, true);
        //     this.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        //     this.oController.accno = "";
        //     return;

        // }
        this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
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

});


