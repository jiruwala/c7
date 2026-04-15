sap.ui.jsfragment("bin.forms.hr.dept", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
        this.isDialog = false;
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };
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
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
            }
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
                title: Util.getLangText("txtDept"),
                toolbarBG: "#fff0f5",
                formSetting: {
                    class: "",
                    width: "550px",
                    cssText: [
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
                events: thatForm.helperFunc.getEvents(),
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
                        dml: "select *from c7hr_dept where deptno=':pac'",
                        where_clause: " deptno=':deptno'",
                        update_exclude_fields: ["no", "attachment", "vehiclename"],
                        insert_exclude_fields: ["attachment", "vehiclename"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                        },
                        update_default_values: {},
                        table_name: "c7hr_dept",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    }
                ],
                canvas: [],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getLists(),
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
    },
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getEvents: function () {
            var thatForm = this.thatForm;
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
                afterExeSql: function (oSql) {
                    // thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.code"));
                },
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("code"));
                    if (qry.name == "qry1") {
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        // UtilGen.Search.getLOVSearchField("select name from acaccount where accno = :CODE ", qry.formview.objs["qry1.expense_ac"].obj, undefined, that.frm.objs["qry1.expensename"].obj);
                        // UtilGen.Search.getLOVSearchField("select max(title) from accostcent1 where code = :CODE ", qry.formview.objs["qry1.costcent"].obj, undefined, that.frm.objs["qry1.costcentname"].obj);
                    }
                },
                beforeLoadQry: function (qry, sql) {
                    return sql;
                },
                afterSaveQry: function (qry) {
                },
                afterSaveForm: function (frm, nxtStatus) {
                },
                beforeSaveQry: function (qry, sqlRow, rowNo) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("no"));
                    // if (qry.name == "qry1") {
                    //     var par = that.frm.getFieldValue("qry1.parentcostcent");
                    //     var ac = that.frm.getFieldValue("qry1.code");
                    //     if (!that.canAcParent(par))
                    //         FormView.err(that.errStr);
                    //     sqlRow["path"] = Util.quoted(that.generateAcPath(par, ac));
                    // }

                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        that.frm.setFieldValue("pac", "", "", true);
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        that.view.byId("numtxt" + thatForm.timeInLong).setText("");
                        var newKf = Util.getSQLValue("select nvl(max(no),0)+1 from salesp");
                        that.frm.setFieldValue("qry1.no", newKf, newKf, true);
                    }
                },
                beforeDeleteValidate: function (frm) {
                    var qry = that.frm.objs["qry1"];
                    if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        (qry.status == FormView.RecordStatus.VIEW)) {
                        var valx = that.frm.getFieldValue("pac");
                        var no = that.frm.getFieldValue("qry1.no");
                        var vldtt = Util.getSQLValue(
                            "select nvl(max(ord_no),-1) from c_order1 where (" +
                            " issue_plant_no =" + no + " or " +
                            " ordered_key=" + no + " or " +
                            " ord_empno=" + no + " or " +
                            " salesp=" + no + " ) "
                        );
                        if (Util.nvl(vldtt, -1) >= 0)
                            FormView.err("Err ! , This staff exist in delivery # " + vldtt);
                        vldtt = Util.getSQLValue(
                            "select nvl(max(code||'-'||name),'') from c_ycust where salesp=" + no +
                            "");
                        if (Util.nvl(vldtt, '') != '')
                            FormView.err("Found in customer " + vldtt);
                        vldtt = Util.getSQLValue(
                            "select nvl(max(keyfld),'') from pur1 where slsmn=" + no +
                            "");
                        if (Util.nvl(vldtt, '') != '')
                            FormView.err("Found in Purchase / Sales KeyId # " + vldtt);

                        if (Util.nvl(vldtt, 0) > 0) {
                            FormView.err("Err ! , this cost center have transaction #" + vldtt);
                        }
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {

                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    return params;
                }

            };
        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            // code                  ,
            // title                
            // title2
            // expenses/name
            // costcent/name

            return {
                flag: {
                    colname: "flag",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"flagAskLock\",\"width\":\"95%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "5%", trueValues: ["2", "1"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    trueValues: ["2", "1"]
                },
                deptno: {
                    colname: "deptno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtNo\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "35%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                title: {
                    colname: "title",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtName\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "85%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                title2: {
                    colname: "title2",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"titleTxt2\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "85%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
            };
        },
        getCommands: function () {
            var that2 = this.thatForm;
            return [
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
                        that2.frm.setFieldValue("pac", "", "", true);
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
            ]
        },
        getLists: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List ",
                    list_type: "sql",
                    cols: [
                        {
                            colname: 'DEPTNO',
                            return_field: "pac",
                        },
                        {
                            colname: "TITLE",
                        },
                        {
                            colname: "TITLE2",
                        },

                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select deptno,title,title2 from c7hr_dept order by deptno",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ]

        }
    }

});



