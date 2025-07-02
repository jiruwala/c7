sap.ui.jsfragment("bin.forms.in.store", {

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
                title: Util.getLangText("txtStore"),
                toolbarBG: "#fff0f5",
                formSetting: {
                    width: { "S": 500, "M": 650, "L": 700, "XL": 800 },
                    class: "strTvForm"
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
                        dml: "select *from store where no=':pac'",
                        where_clause: " no=':no'",
                        update_exclude_fields: ["no", "saladdaccnm", "saldiscaccnm", "salraccnm", "salaccnm", "lbllv3", "lbllv2", "lbllv1", "lbllv0", "graccnm", "expaccnm", "storeaccnm"],
                        insert_exclude_fields: ["saladdaccnm", "saldiscaccnm", "salraccnm", "salaccnm", "lbllv3", "lbllv2", "lbllv1", "lbllv0", "graccnm", "expaccnm", "storeaccnm"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                            "FLAG": 1
                        },
                        update_default_values: {},
                        table_name: "store",
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
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("no"));
                    var getAccnm = function (fld, fldname) {
                        UtilGen.Search.getLOVSearchField("select name from acaccount where accno = :CODE ", qry.formview.objs[fld].obj, undefined, that.frm.objs[fldname].obj);
                    }
                    if (qry.name == "qry1") {
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        getAccnm("qry1.saladdacc", "qry1.saladdaccnm");
                        getAccnm("qry1.saldiscacc", "qry1.saldiscaccnm");
                        getAccnm("qry1.salracc", "qry1.salraccnm");
                        getAccnm("qry1.salacc", "qry1.salaccnm");
                        getAccnm("qry1.gracc", "qry1.graccnm");
                        getAccnm("qry1.expacc", "qry1.expaccnm");
                        getAccnm("qry1.storeacc", "qry1.storeaccnm");

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
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        that.frm.setFieldValue("pac", "", "", true);
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        that.view.byId("numtxt" + thatForm.timeInLong).setText("");
                        var newKf = Util.getSQLValue("select nvl(max(no),0)+1 from store");
                        that.frm.setFieldValue("qry1.no", newKf, newKf, true);
                    }
                },
                beforeDeleteValidate: function (frm) {
                    var qry = that.frm.objs["qry1"];
                    if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        (qry.status == FormView.RecordStatus.VIEW)) {
                        var valx = that.frm.getFieldValue("pac");
                        var no = that.frm.getFieldValue("qry1.no");
                        var vldtt = Util.execSQLWithData(
                            "select nvl(max(invoice_no),-1) invoice_no,max(dat) dat from invoice2 where (" +
                            " stra =" + no + " or strb = " + no + " ) "
                        );
                        if (vldtt.length > 0)
                            FormView.err("Err ! , This STORE is exist in store tansaction No # " + vldtt.INVOICE_NO + " , Date # " + vldtt.DAT);
                        vldtt = Util.execSQLWithData(
                            "select nvl(max(invoice_no),-1) invoice_no,max(to_char(dat,'rrrr/mm/dd')) dat from invoice2 where (" +
                            " stra =" + no + " or strb = " + no + " ) ");
                        if (vldtt.length > 0)
                            FormView.err("Err ! , This STORE is exist in Store Transfer / Sales /Purchase or Return ,  No # " + vldtt.INVOICE_NO + " , Date # " + vldtt.DAT);
                        vldtt = Util.execSQLWithData(
                            "select nvl(max(ord_no),-1) ord_no,max(ord_date) dat from pord1 where (" +
                            " stra =" + no + " or strb = " + no + " ) ");
                        if (vldtt.length > 0)
                            FormView.err("Err ! , Existed in PO / SO or Requests ,No # " + vldtt.ORD_NO + " , Date # " + vldtt.DAT);
                    }
                },
                beforeExeSql: function (frm, sq) {
                    var kf = frm.getFieldValue("qry1.no");
                    var str = frm.getFieldValue("qry1.storeacc");
                    var sql = "update store set PURACC=':STOREACC', PURRACC=':STOREACC'," +
                        " ADJPACC=':STOREACC', ADJMACC=':STOREACC', PURDISCACC=':STOREACC' " +
                        " WHERE NO=:NO;";
                    sql = sql.replaceAll(":STOREACC", str)
                        .replaceAll(":NO", kf);
                    return sq + sql;

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
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var getAcc = function (str, strnm) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(str, "storeacc"),
                    name: Util.nvl(strnm, "storeaccnm"),
                    sqlChange: "select name from acaccount where actype=0 and childcount=0 and accno = ':CODE'",
                    sqlList: "select accno code,name title from acaccount where actype=0 and childcount=0 order by path ",
                    sqlListChange: "select accno code,name title from acaccount where actype=0 and childcount=0 and accno=:CODE",
                });
            }
            // no               name            25,25,15,35
            // namea                            25,75
            // tel              area            25,25,25,25
            // storeacc,storeaccnm,expacc,expaccnm  , 15,35,15,35
            // gracc,graccname, 
            // salacc,salaccnm, salracc,salraccnm , 15,35,15,35
            // saldiscacc,saldiscaccnm,saladdacc,saladdaccnm

            return {
                no: FormView.getFactoryFields.getNumberField(
                    "no", "", "txtNo", "25%", "redText", "25%",
                    {
                        edit_allowed: false,
                        require: true

                    }),
                name: FormView.getFactoryFields.getGeneralField(
                    "name", "@", "txtName", "15%", "redText", "35%",
                    { require: true },
                ),
                namea: FormView.getFactoryFields.getGeneralField(
                    "namea", "", "txtName2", "25%", "", "75%",
                    {},
                ),
                tel: FormView.getFactoryFields.getGeneralField(
                    "tel", "", "txtTel", "25%", "", "25%",
                    {},
                ),
                area: FormView.getFactoryFields.getGeneralField(
                    "area", "@", "txtAddr", "25%", "", "25%",
                    {},
                ),


                lbllv0: FormView.getFactoryFields.getTextField("lbllv0", "", "", "15%", "", { height: "30px" }, {}),
                lbllv1: FormView.getFactoryFields.getTextField("lbllv1", "@", "txtPurAccs", "85%", "boldText", {}, {}),
                storeacc: FormView.getFactoryFields.getGeneralField(
                    "storeacc", "", "txtStore", "15%", "", "12%",
                    { require: true }, getAcc("qry1.storeacc", "qry1.storeaccnm")
                ),
                storeaccnm: FormView.getFactoryFields.getGeneralField(
                    "storeaccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                expacc: FormView.getFactoryFields.getGeneralField(
                    "expacc", "@", "txtExpenseAc", "15%", "", "12%",
                    { require: true }, getAcc("qry1.expacc", "qry1.expaccnm")
                ),
                expaccnm: FormView.getFactoryFields.getGeneralField(
                    "expaccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                gracc: FormView.getFactoryFields.getGeneralField(
                    "gracc", "", "txtGrAc", "15%", "", "12%",
                    { require: true }, getAcc("qry1.gracc", "qry1.graccnm")
                ),
                graccnm: FormView.getFactoryFields.getGeneralField(
                    "graccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                lbllv2: FormView.getFactoryFields.getTextField("lbllv2", "", "", "15%", "", { height: "30px" }, {}),
                lbllv3: FormView.getFactoryFields.getTextField("lbllv3", "@", "txtSalesAccs", "85%", "boldText", {}, {}),
                salacc: FormView.getFactoryFields.getGeneralField(
                    "salacc", "", "txtSales", "15%", "", "12%",
                    { require: true }, getAcc("qry1.salacc", "qry1.salaccnm")
                ),
                salaccnm: FormView.getFactoryFields.getGeneralField(
                    "salaccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                salracc: FormView.getFactoryFields.getGeneralField(
                    "salracc", "@", "txtSalesRet", "15%", "", "12%",
                    { require: true }, getAcc("qry1.salracc", "qry1.salraccnm")
                ),
                salraccnm: FormView.getFactoryFields.getGeneralField(
                    "salraccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                saldiscacc: FormView.getFactoryFields.getGeneralField(
                    "saldiscacc", "", "txtSalesDisc", "15%", "", "12%",
                    { require: true }, getAcc("qry1.saldiscacc", "qry1.saldiscaccnm")
                ),
                saldiscaccnm: FormView.getFactoryFields.getGeneralField(
                    "saldiscaccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                saladdacc: FormView.getFactoryFields.getGeneralField(
                    "saladdacc", "@", "txtSalesAdd", "15%", "", "12%",
                    { require: true }, getAcc("qry1.saladdacc", "qry1.saladdaccnm")
                ),
                saladdaccnm: FormView.getFactoryFields.getGeneralField(
                    "saladdaccnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
            };
        },
        getCommands: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: "cmdSave",
                    canvas: "default_canvas",
                    onPress: function (e) {
                        // var ac = that2.frm.getFieldValue("accno");
                        // var ac = that2.frm.parseString("select from acaccount where accno=':pac'");
                        // var sv = that2.frm.getSQLUpdateString("qry1", undefined, ['code'], " CODE=':code' ");
                        // console.log(sv);
                        // sap.m.MessageToast.show("Saved...", {
                        //     my: sap.ui.core.Popup.Dock.RightBottom,
                        //     at: sap.ui.core.Popup.Dock.RightBottom
                        // });

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
                            colname: 'NO',
                            return_field: "pac",
                        },
                        {
                            colname: "NAME",
                        },
                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select no, name " +
                        " from store order by no",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ]

        }
    }

});



