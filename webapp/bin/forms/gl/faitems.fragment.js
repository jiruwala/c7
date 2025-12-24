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
                toolbarBG: "lightblue",
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
                        dml: "select *from faitems where code=:pac",
                        where_clause: " code=':keyfld' ",
                        update_exclude_fields: ['code', "totadd", "totded", "netvalue", "acname", "expname", "depname", "costname", "totdep"],
                        insert_exclude_fields: ["totadd", "totded", "netvalue", "acname", "expname", "depname", "costname", "totdep"],
                        insert_default_values: {
                        },
                        update_default_values: {
                        },
                        table_name: "faitems",
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
                        var cod = thatForm.frm.getFieldValue("qry1.code");
                        var fnEditObjs = function (ed) {
                            qry.formview.objs["qry1.priordep"].obj.setEditable(ed);
                            qry.formview.objs["qry1.purprice"].obj.setEditable(ed);
                            qry.formview.objs["qry1.lastdepdate"].obj.setEditable(ed);
                            qry.formview.objs["qry1.purdate"].obj.setEditable(ed);
                            qry.formview.objs["qry1.deprate"].obj.setEditable(ed);
                        }

                        var sq = "select :name from acaccount where accno = :CODE ".replaceAll(":name", Util.getLangDescrAR("name", "mvl(namea,name) name "));
                        UtilGen.Search.getLOVSearchField(sq, qry.formview.objs["qry1.accno"].obj, undefined, that.frm.objs["qry1.acname"].obj);
                        UtilGen.Search.getLOVSearchField(sq, qry.formview.objs["qry1.depaccno"].obj, undefined, that.frm.objs["qry1.depname"].obj);
                        UtilGen.Search.getLOVSearchField(sq, qry.formview.objs["qry1.expaccno"].obj, undefined, that.frm.objs["qry1.expname"].obj);
                        UtilGen.Search.getLOVSearchField("select title from accostcent1 where code = :CODE", qry.formview.objs["qry1.costcent"].obj, undefined, that.frm.objs["qry1.costname"].obj);

                        var cnt = Util.getSQLValue("select nvl(count(*),0) from fadep where code=" + cod);
                        fnEditObjs(true);
                        if (cnt > 0)
                            fnEditObjs(false);
                        thatForm.helperFunc.calcVal();
                    }


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
                        var dt = thatForm.view.today_date.getDateValue();
                        qry.formview.setFieldValue("qry1.pur_inv_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        qry.formview.setFieldValue("qry1.purdate", new Date(dt.toDateString()), new Date(dt.toDateString()), true);

                        thatForm.frm.setFieldValue("qry1.purprice", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.deprate", 1, 1, true);
                        thatForm.frm.setFieldValue("qry1.priordep", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.priordepamt", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.totalvalue", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.netbookvalue", 1, 1, true);

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
        calcVal: function (fetchRec) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var code = thatForm.frm.getFieldValue("qry1.code");
            if (Util.nvl(fetchRec, true)) {
                var tadd = Util.getSQLValue("SELECT NVL(SUM(TRANSACTIONAMNT),0) FROM FATRANSACTION WHERE ITEMNO='" + cod + "' AND TRANSACTIONTYPE=1");
                var tded = Util.getSQLValue("SELECT NVL(SUM(TRANSACTIONAMNT),0) FROM FATRANSACTION WHERE ITEMNO='" + cod + "' AND TRANSACTIONTYPE=2");
                var tdep = Util.getSQLValue("SELECT NVL(SUM(depamt),0) FROM fadep WHERE code='" + cod + "' AND TRANSACTIONTYPE=2");
                thatForm.frm.setFieldValue("qry1.totadd", tadd, tadd, true);
                thatForm.frm.setFieldValue("qry1.totded", tded, tded, true);
                thatForm.frm.setFieldValue("qry1.totdep", tdep, tdep, true);
            }

            var pp = Util.extractNumber(thatForm.frm.getFieldValue("qry1.purprice"));
            var tadd = Util.extractNumber(thatForm.frm.getFieldValue("qry1.totadd"));
            var tded = Util.extractNumber(thatForm.frm.getFieldValue("qry1.totded"));
            var tdep = Util.extractNumber(thatForm.frm.getFieldValue("qry1.priordep"));
            var tot = (pp + tadd) - (tded + tdep);
            thatForm.frm.setFieldValue("qry1.netvalue", df.format(tot), df.format(tot));

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

            //keyfid,15-10|code,10-15               catno,15-12|cname,0-23
            //descr,15,35                           pur_inv_date,15,35
            //accno,15-12,acname-0,23               depaccno,15-12,depname-0,23
            //expaccno,15-12,expname-0,23           costcent,15-12,costname-0,23
            //purdate,30,20                         purprice,20,20
            //deprate,30,20                         netbookvalue,20,30 
            //lastdepdate,30,20                     priordep,20,20
            // Title : Valuation
            //                                      totadd,70,20
            //                                      totded,70,20
            //                                      netvalue,70,20
            return {
                code: FormView.getFactoryFields.getGeneralField(
                    "code", "", "txtCode", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {}),
                descr: FormView.getFactoryFields.getGeneralField(
                    "descr", "@", "", "0px", "", "23%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    placeHolder: "Enter Description of assets"
                }),
                catno: FormView.getFactoryFields.getGeneralField(
                    "catno", "@", "txtGroup", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsGeneral({
                        thatForm: thatForm,
                        code: Util.nvl("qry1.catno"),
                        name: Util.nvl("qry1.catname"),
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
                        keyboardFocus: false,
                    }, {}),
                accno: FormView.getFactoryFields.getGeneralField(
                    "accno", "", "shortTxtFAAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getacSet("qry1.accno", "qry1.acname")),
                acname: FormView.getFactoryFields.getGeneralField(
                    "acname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                depaccno: FormView.getFactoryFields.getGeneralField(
                    "depaccno", "@", "shortTxtDepAccNo", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getacSet("qry1.depaccno", "qry1.depacname")),
                depacname: FormView.getFactoryFields.getGeneralField(
                    "depacname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                expaccno: FormView.getFactoryFields.getGeneralField(
                    "expaccno", "", "txtExpenseAc", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, getacSet("qry1.expaccno", "qry1.expacname")),
                expacname: FormView.getFactoryFields.getGeneralField(
                    "expacname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                costcent: FormView.getFactoryFields.getGeneralField(
                    "costcent", "@", "costCent", "15%", "", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsGeneral({
                        thatForm: thatForm,
                        code: Util.nvl("qry1.costcent"),
                        name: Util.nvl("qry1.ccname"),
                        sqlChange: "select title name from accostcent1 where  code = ':CODE'",
                        sqlList: "select code,title from accostcent1 order by code ",
                        sqlListChange: "select code,title from accostcent1 where code=:CODE",
                    })),
                ccname: FormView.getFactoryFields.getGeneralField(
                    "ccname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                pur_inv_date: FormView.getFactoryFields.getDateField(
                    "pur_inv_date", "", "shortTxtPurDate", "15%", "", "17%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                pur_date: FormView.getFactoryFields.getDateField(
                    "pur_date", "@", "txtFABeginDate", "17%", "", "17%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                purprice: FormView.getFactoryFields.getMoneyField(
                    "purprice", "@", "shortTxtFAPurPrice", "17%", "", "17%",
                    {

                    }, {}),
                _lblLv: FormView.getFactoryFields.getTextField("_lblLv", "", "", "100%", "", {}, {}),
                deprate: FormView.getFactoryFields.getNumberField(
                    "deprate", "", "shortTxtDepRate", "30%", "", "20%",
                    {
                    }, {
                    change: function (e) {
                        var vl = Util.extractNumber(this.getValue());
                        var cnt = this;
                        if (vl < 1 || vl > 100) {
                            cnt.setValue(1);
                            setTimeout(() => { cnt.focus(); cnt.selectText(0, 999); }, 500);
                            FormView.err("Invalid rate !");
                        };
                    }
                }),
                netbookvalue: FormView.getFactoryFields.getMoneyField(
                    "netbookvalue", "@", "netBookValue", "20%", "", "20%",
                    {

                    }, {}),
                lastdepdate: FormView.getFactoryFields.getDateField(
                    "bf_depdate", "", "lastDepDate", "30%", "", "20%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                priordep: FormView.getFactoryFields.getMoneyField(
                    "bf_depamt", "@", "shortTxtPriorDep", "20%", "", "20%",
                    {
                        insert_allowed: true,
                        edit_allowed: false

                    }, {}),
                _lblLv1: FormView.getFactoryFields.getTextField("_lblLv1", "", "", "100%", "", {}, {}),
                _lblLv2: FormView.getFactoryFields.getTextField("_lblLv2", "", "", "100%", "", {}, {}),
                titVal: FormView.getFactoryFields.getGeneralField(
                    "titVal", "", "titFAValuation", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "Center"),
                totadd: FormView.getFactoryFields.getMoneyField(
                    "totadd", "", "totAdd", "13%", "", "12%",
                    {
                        insert_allowed: false,
                        edit_allowed: false
                    }, {}),
                totded: FormView.getFactoryFields.getMoneyField(
                    "totded", "@", "totDed", "12%", "", "12%",
                    {
                        insert_allowed: false,
                        edit_allowed: false
                    }, {}),
                totdep: FormView.getFactoryFields.getMoneyField(
                    "totdep", "@", "shortTotDep", "12%", "", "12%",
                    {
                        insert_allowed: true,
                        edit_allowed: false

                    }, {}),
                totalvalue: FormView.getFactoryFields.getMoneyField(
                    "totalvalue", "@", "totalValue", "12%", "", "12%",
                    {
                        insert_allowed: false,
                        edit_allowed: false,
                        display_style: "totInput",
                    }, {}),

            };
        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of FA ITEMS",
                    list_type: "sql",
                    cols: [
                        {
                            colname: "DESCR",
                        },
                        {
                            colname: 'CODE',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select code,descr from faitems where order by code",
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
            var errObj = function (msg, obj) {
                var o = thatForm.frm.objs[obj].obj;
                UtilGen.errorObj(o, 3500);
                if (o instanceof sap.m.InputBase)
                    o.focus();
                FormView.err(msg);

            };
            var validateAcc = function (fldAcc) {
                var cod = thatForm.frm.getFieldValue(fldAcc);
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from acaccount where " + flg + " accno='" + cod + "'");
                if (sqcnt == 0) errObj("Save Denied : ACCOUNT is invalid !", fldAcc);
                sqcnt = Util.getSQLValue("select nvl(count(*),0) from acaccount where parentacc='" + cod + "'");
                if (sqcnt > 0) errObj("Save Denied : Parent ACCOUNT not allowed !", fldAcc);
            }
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {

            }
            validateAcc("qry1.accno");
            validateAcc("qry1.depaccno");
            validateAcc("qry1.expaccno");
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



