sap.ui.jsfragment("bin.forms.gl.faitems", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.helperFunc.init(this);
        this.isDialog = false;
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };

        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            vou_code: 27,
            type: 1
        };

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
        });
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");
        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        return this.joApp;
    },
    createView: function () {
        //testuing2
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var fullSpan = "XL8 L8 M8 S12";
        var codSpan = "XL3 L3 M3 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var sumSpan2 = "XL2 L6 M6 S12";
        var dmlSq = "";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("Fixed Assets Items"),
                toolbarBG: "orange",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var cmdQuickEntry = new sap.m.Button(thatForm.view.createId("cmdQE" + thatForm.timeInLong), {
                        text: "Quick Entry",
                        press: function () {
                            thatForm.helperFunc.enterQuckEntry();
                        }
                    });
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), cmdQuickEntry, txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                },
                print_templates: [
                    {
                        title: "Print",
                        reportFile: "br/salord",
                    }
                ],
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
                        dml: "select *from order1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                        },
                        update_default_values: {
                        },
                        table_name: "ORDER1",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },

                ],
                canvas: [],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getList()
            }
        }
            ;
        this.frm = new FormView(this.mainPage);
        this.frm.view = view;
        this.frm.pg = this.mainPage;
        this.frm.frag = this;
        this.frm.parseForm(js);
        this.frm.createView();

        // this.mainPage.addContent(sc);

    },

    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
    },
    helperFunc: {
        init: function (frm) {
            this.thatForm = frm;
            this.validity.init(frm);
        },
        getEvents: function () {
            var thatForm = this.thatForm;
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            return {
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    if (qry.name == "qry1") {
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.txt_empname"].obj);
                        var saleinv = Util.getSQLValue("select saleinv from order1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("Delivery is POSTED ,INV # " + invno);
                        }

                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("ORD_SHIP").beforeSearchEvent = function (sq, ctx, model) {
                            qry.obj.mLctb.getColByName("ORD_SHIP").btnsx = [new sap.m.Button({
                                text: 'Add Item in Contract',
                                press: function () {
                                    thatForm.helperFunc.addInContract();
                                }
                            }
                            )];
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_type"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdType"));
                            return thatForm.frm.parseString(sq);
                        };



                },
                beforeLoadQry: function (qry, sql) {
                    return sql;
                },
                afterSaveQry: function (qry) {

                },
                afterSaveForm: function (frm, nxtStatus) {
                    // frm.loadData(undefined, FormView.RecordStatus.NEW);
                },
                beforeSaveQry: function (qry, sqlRow, rowno) {
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {

                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var dt = Util.execSQL("select saleinv from order1 where keyfld=" + kf);
                    if (dt.ret == "SUCCESS") {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        if (dtx.length > 0 && dtx[0].SALEINV != undefined) {
                            // frm.setFormReadOnly();
                            FormView.err("This Delivery is posted to invoice !");
                        }
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {

                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();

                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    var no = that.frm.getFieldValue("qry1.ord_no");
                    return params + "&_para_pfromno=" + no + "&_para_ptono=" + no;
                },
                afterApplyCols: function (qry) {
                    if (qry.name == "qry2") {

                    }

                },
                beforeExeSql: function (frm, sq) {
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    return sq;
                }
            };
        },
        validity: {
            init: function (frm) {
                this.thatForm = frm;
            },

        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var getacSet = function (ordref, ordrefnm) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    sqlChange: "select name||'-'||namea from acaccount where actype=0 and childcount=0 and accno = ':CODE'",
                    sqlList: "select accno code,name||'-'||namea title from acaccount where actype=0 and childcount=0 order by path ",
                    sqlListChange: "select accno code,name||'-'||namea title from acaccount where actype=0 and childcount=0  and accno=:CODE ",
                });
            };
            //TODO fields and completion of this FAITEMS

            //keyfid,15-10|code,10-15               catno,15-12|cname,0-23
            //descr,15,35                           pur_inv_date,15,35
            //accno,15-12,acname-0,23               depaccno,15-12,depname-0,23
            //expaccno,15-12,expname-0,23           costcent,15-12,costname-0,23
            //purdate,30,20                         purprice,20,30
            //deprate,30,20                         pricedep,20,30
            //priordepamt,30,20                     totalvalue,0,30
            //lastdepdate,30,20                     netbookvalue,20,30

            return {
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                code: FormView.getFactoryFields.getGeneralField(
                    "code", "@", "txtCode", "10%", "violetText", "15%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {}),
                catno: FormView.getFactoryFields.getGeneralField(
                    "catno", "@", "txtGroup", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsGeneral({
                        thatForm: thatForm,
                        code: Util.nvl("catno"),
                        name: Util.nvl("catname"),
                        sqlChange: "select catname name from facat where  catno = ':CODE'",
                        sqlList: "select catno code,catname title from facat order by catno ",
                        sqlListChange: "select catno code,catname title from facat where catno=:CODE",

                    })),
                catname: FormView.getFactoryFields.getGeneralField(
                    "catname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                descr: FormView.getFactoryFields.getGeneralField(
                    "descr", "", "txtDescr", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
                pur_inv_date: FormView.getFactoryFields.getDateField(
                    "pur_inv_date", "@", "Purchase Date", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                accno: FormView.getFactoryFields.getGeneralField(
                    "accno", "", "txtFAAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getacSet("accno", "acname")),
                acname: FormView.getFactoryFields.getGeneralField(
                    "acname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                depaccno: FormView.getFactoryFields.getGeneralField(
                    "depaccno", "@", "txtDepAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getacSet("depaccno", "depacname")),
                depacname: FormView.getFactoryFields.getGeneralField(
                    "depacname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                expaccno: FormView.getFactoryFields.getGeneralField(
                    "expaccno", "", "txtExpAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getacSet("expaccno", "expacname")),
                expacname: FormView.getFactoryFields.getGeneralField(
                    "expacname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                costcent: FormView.getFactoryFields.getGeneralField(
                    "costcent", "@", "txtExpAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsGeneral({
                        thatForm: thatForm,
                        code: Util.nvl("costcent"),
                        name: Util.nvl("ccname"),
                        sqlChange: "select title name from accostcent1 where  catno = ':CODE'",
                        sqlList: "select code,title from accostcent1 order by catno ",
                        sqlListChange: "select code,title from accostcent1 where code=:CODE",

                    })),
                ccname: FormView.getFactoryFields.getGeneralField(
                    "ccname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),

            };
        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of Orders",
                    list_type: "sql",
                    cols: [
                        {
                            colname: "ORD_NO",
                        },
                        {
                            colname: "ORD_REF",
                        },
                        {
                            colname: "ORD_REFNM"
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select ord_no,ord_date,ord_ref,ord_refnm,keyfld from order1 o1 where ord_code =" + that2.vars.vou_code +
                        " order by o1.ord_date desc,ord_no desc",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ];
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
                    onPress: function (e) {
                        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
                            var saleinv = Util.getSQLValue("select saleinv from order1 where keyfld=" + that2.frm.getFieldValue("keyfld"));
                            if (Util.nvl(saleinv, '') != '') {
                                var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                                that2.view.byId("txtMsg" + that2.timeInLong).setText("Delivery is POSTED ,INV # " + invno);
                                // that2.frm.setFormReadOnly();
                                return false;
                            }
                        }
                        return true;
                    }
                },
                {
                    name: "cmdNew",
                    canvas: "default_canvas",
                    title: Util.getLangText("newRec")
                }, {
                    name: "cmdList",
                    canvas: "default_canvas",
                    list_name: "list1"
                },
                {
                    name: "cmdPrint",
                    canvas: "default_canvas",
                    title: Util.getLangText("printRec")
                },
                {
                    name: "cmdOther",
                    canvas: "default_canvas",
                    title: "Action",

                    obj: new sap.m.Button({
                        icon: "sap-icon://action",
                        press: function () {
                            var mnus = [];
                            var bts = [];
                            if (
                                (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW ||
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW)) {
                                // mnus.push(new sap.m.MenuItem({
                                //     icon: "sap-icon://letter",
                                //     text: Util.getLangText("generateInvoice"),
                                //     press: function () {
                                //         that2.helperFunc.generateInvoice(this);
                                //     }
                                // }));
                            }
                            if (bts.length > 0) {
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://indent",
                                    text: Util.getLangText("quickEntries"),
                                    items: bts
                                }));
                            }


                            var mnu = new sap.m.Menu({
                                items: mnus
                            });
                            mnu.openBy(this);
                        }
                    })
                },
                {
                    name: "cmdClose",
                    canvas: "default_canvas",
                    title: Util.getLangText("cmdClose"),
                    obj: new sap.m.Button({
                        icon: "sap-icon://decline",
                        press: function () {
                            that2.joApp.backFunction();
                        }
                    })
                },

            ];
        },

        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {

            }
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Customer is invalid !");
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) FormView.err("Save Denied : Parent customer not allowed !");


            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                // var rfr = ld.getFieldValue(i, "ORD_SHIP");
                // var qty = ld.getFieldValue(i, "TQTY");
                // var pr = ld.getFieldValue(i, "SALE_PRICE");
                // if (dup[rfr] != undefined)
                //     FormView.err("Save Denied : Duplicate item entry # " + rfr);
                // dup[rfr] = rfr;
                // var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                // if (cnt > 0)
                //     FormView.err("Save Denied : Item " + rfr + " is a group item !");
                // var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                // if (cnt == 0)
                //     FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                // if (pr < 0)
                //     FormView.err("Save Denied: PRICE invalid value !");
                // if (qty <= 0)
                //     FormView.err("Save Denied: QTY invalid value !");
            }

        }
    }
    ,

    loadData: function () {
        var frag = this;
        if (Util.nvl(frag.oController.keyfld, "") != "") {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld, ""));
            frag.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
            frag.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        } else {
            UtilGen.Vouchers.formLoadData(this);
        }

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



