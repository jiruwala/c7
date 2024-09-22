sap.ui.jsfragment("bin.forms.in.items", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.helperFunc.init(this);
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

        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
                that.get_new_item();
            }
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }

        });


        return this.joApp;
    },
    generateItemPath: function (pac, ac) {
        var that = this;
        var ret = "XXX\\" + ac + "\\";
        if (pac == "")
            return ret;

        var pth = Util.getSQLValue("select nvl(max(descr2),'') from items where reference=" + Util.quoted(pac));
        if (pth == "")
            return "";
        return pth + ac + "\\";
    },
    canItemParent: function (pa) {
        this.errStr = "";

        if (!Util.isNull(pa)) {
            var n = Util.getSQLValue("select nvl(count(*),0) from pur2 where refer=" + Util.quoted(pa));
            if (n > 0) {
                this.errStr = "Err ! , reference in sales/purchase transaction !";
                return false;
            }
            n = Util.getSQLValue("select nvl(count(*),0) from invoice2 where refer=" + Util.quoted(pa));
            if (n > 0) {
                this.errStr = "Err ! , reference in store transaction !";
                return false;
            }
        }
        return true;
    },
    get_new_item: function () {
        var that = this;
        var cod = Util.nvl(that.frm.getFieldValue("pac"), "");
        if (that.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            sap.m.MessageToast.show("You are  Editing Item.# " + this.qryStr);
            return;
        }
        var pacc = that.frm.objs["qry1.parentitem"].obj;
        var paccname = that.frm.objs["qry1.parentitemname"].obj;
        var accno = that.frm.objs["qry1.reference"].obj;
        if ((pacc.getEnabled()) && Util.nvl(UtilGen.getControlValue(pacc), "") == "") {
            UtilGen.doSearch(
                undefined, "select reference code,descr title from items where usecounts=0 order by descr2 ", pacc, function () {
                    if (Util.nvl(UtilGen.getControlValue(pacc), "") == "")
                        return;
                    var pac = Util.nvl(UtilGen.getControlValue(pacc), "");
                    var nn = Util.getSQLValue("select to_number(nvl(max(reference),0))+1 from items where parentitem=" + Util.quoted(pac));
                    if (nn == 1)
                        nn = pac + "001";
                    UtilGen.setControlValue(accno, nn, nn, true);
                }, "Select parent Item", paccname);
        } else {
            var pac = Util.nvl(UtilGen.getControlValue(pacc), "");
            var nn = Util.getSQLValue("select to_number(nvl(max(reference),0))+1 from items where parentitem=" + Util.quoted(pac));
            if (nn == 1)
                nn = pac + "001";

            UtilGen.setControlValue(accno, nn, nn, true);
        }

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

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("invItems"),
                toolbarBG: "#cd853f",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    // width: { "S": 500, "M": 650, "L": 850, "XL": 1000 },
                    width: ((sap.ui.Device.resize.width - 500) > 900 ? 900 : (sap.ui.Device.resize.width - 500)) + "px",
                    class:"jvForm",
                    cssText:[],
                    // cssText: [
                    //     "padding-left:10px;" +
                    //     "padding-top:20px;" +
                    //     "border-width: thin;" +
                    //     "border-style: solid;" +
                    //     "border-color: lavender;" +
                    //     "margin: 10px;" +
                    //     "border-radius:25px;"
                    //     // "background-color:khaki;"
                    // ],
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var btRawItems = new sap.m.Button(thatForm.view.createId("btci" + thatForm.timeInLong), {
                        text: Util.getLangText("rawItems"),
                        press: function () {
                            thatForm.showRawItems();
                        }
                    });

                    var hb = new sap.m.Toolbar({
                        content: [btRawItems, txt, new sap.m.ToolbarSpacer(), txtMsg]
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
                        dml: "select *from items where reference=':pac'",
                        where_clause: " reference=':qry1.reference' ",
                        update_exclude_fields: ['keyfld', 'reference', 'parentitemname', 'mfcodename'],
                        insert_exclude_fields: ['parentitemname', 'mfcodename'],
                        insert_default_values: {

                        },
                        update_default_values: {

                        },
                        table_name: "items",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
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
                afterExeSql: function (oSql) {
                    thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.reference"));
                },
                afterLoadQry: function (qry) {
                    // qry.formview.setFieldValue("pac", qry.formview.getFieldValue("qry1.reference"));
                    if (qry.name == "qry1") {
                        thatForm.fetchCustItems = false;
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select descr name from items where reference = ':CODE' ", qry.formview.objs["qry1.parentitem"].obj, undefined, that.frm.objs["qry1.parentitemname"].obj);
                        UtilGen.Search.getLOVSearchField("select name from c_ycust where code = ':CODE' ", qry.formview.objs["qry1.mfcode"].obj, undefined, that.frm.objs["qry1.mfcodename"].obj);

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
                    var par = that.frm.getFieldValue("qry1.parentitem");
                    var cod = that.frm.getFieldValue("qry1.reference");

                    if (!that.canItemParent(par))
                        FormView.err(that.errStr);

                    if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                        var v1 = Util.getSQLValue("select parentitem from items where reference=" + Util.quoted(cod));
                        if (v1 != par) {
                            n = Util.getSQLValue("select nvl(count(*),0) from items where parentitem=" + Util.quoted(par));
                            if (n > 0)
                                FormView.err("Err ! ,due to change of Parent Item,  this item have childerens  !");
                        }
                    }
                    var dt = thatForm.view.today_date.getDateValue();
                    sqlRow["descr2"] = Util.quoted(that.generateItemPath(par, cod));
                    sqlRow["levelno"] = (sqlRow["descr2"]).match((/\\/g) || []).length - 1;
                    sqlRow["prd_dt"] = Util.toOraDateString(dt);
                    sqlRow["exp_dt"] = Util.toOraDateString(dt);

                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        thatForm.fetchCustItems = false;
                        that.frm.setFieldValue("pac", "", "", true);
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from items");
                        UtilGen.setControlValue(objKf, newKf, newKf, true);
                        qry.formview.setFieldValue("qry1.price1", 0, 0, true);
                        qry.formview.setFieldValue("qry1.lsprice", 0, 0, true);
                        qry.formview.setFieldValue("qry1.packd", 'PCS', 'PCS', true);
                        qry.formview.setFieldValue("qry1.unitd", 'PCS', 'PCS', true);
                        qry.formview.setFieldValue("qry1.pack", 1, 1, true);
                        qry.formview.setFieldValue("qry1.pkaver", 0, 0, true);
                        qry.formview.setFieldValue("qry1.lpprice", 0, 0, true);
                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("reference");
                    var cntNo = Util.getSQLValue("select nvl(count(*),0) from pur2 where refer='" + kf + "'");
                    if (cntNo > 0)
                        FormView.err("This Item existed in Sales/Purchase transaction !");
                    var cntNo = Util.getSQLValue("select nvl(count(*),0) from invoice2 where refer='" + kf + "'");
                    if (cntNo > 0)
                        FormView.err("This Item existed in STORE transaction !");

                    var cntNo = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_ship='" + kf + "'");
                    if (cntNo > 0)
                        FormView.err("This Item existed in Orders / Requests  /Delivereis  !");

                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {

                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    // var no = that.frm.getFieldValue("qry1.ord_no");
                    // return params + "&_para_pfromno=" + no + "&_para_ptono=" + no;
                    return "";
                },
                afterApplyCols: function (qry) {
                    if (qry.name == "qry2") {

                    }

                },
                beforeExeSql: function (frm, sq) {
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    return sq;
                },
                addSqlAfterInsert: function (qry, rn) {

                    if (qry.name == "qry1" && thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                        var pac = that.frm.getFieldValue("qry1.parentcustomer");
                        var s1 = "";
                        if (pac != "") {
                            s1 = "update items set childcounts=(select nvl(count(*),0) from items where parentitem=':qry1.parentitem') where reference=':qry1.parentitem' ; "
                            s1 = that.frm.parseString(s1);
                        }
                        var sq2 = "";
                        if (that.fetchCustItems && that.qc != undefined && that.qc.mLctb.rows.length > 0)
                            sq2 = Util.nvl(that.doUpdateRawMat(), sq2);

                        sq2 = that.frm.parseString(sq2);
                        return s1 + sq2;
                    }

                    return "";
                },
                addSqlAfterUpdate: function (qry, rn) {
                    if (qry.name == "qry1" && thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                        var pac = that.frm.getFieldValue("qry1.parentitem");
                        var s1 = "";
                        if (pac != "") {
                            s1 = "update items set childcounts=(select nvl(count(*),0) from items where parentitem=':qry1.parentitem') where reference=':qry1.parentitem' ; "
                            s1 = that.frm.parseString(s1);
                        }
                        var sq2 = "";
                        if (that.fetchCustItems && that.qc != undefined && that.qc.mLctb.rows.length > 0)
                            sq2 = that.frm.parseString(Util.nvl(that.doUpdateRawMat(), sq2));

                        return s1 + sq2;
                    }

                    return "";
                },

            };
        },
        getSummary: function () {
            var thatForm = this.thatForm;
            var sumSpan = "XL2 L2 M2 S12";
            var sumSpan2 = "XL2 L6 M6 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
                createdBy: {
                    colname: "createdBy",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Created By\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "redText",
                    display_format: "",
                    other_settings: { enabled: false, width: "30%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                createdOn: {
                    colname: "createdOn",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Created On\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan2,
                    display_align: "ALIGN_RIGHT",
                    display_style: "redText",
                    display_format: "",
                    other_settings: { enabled: false, width: "30%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: false
                },
                totamt: {
                    colname: "totamt",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Total DR\",\"width\":\"15%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
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
            return {
                keyfld: {
                    colname: "keyfld",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Key ID\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "25%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                flag: {
                    colname: "flag",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '@{\"text\":\"txtLock\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "10%", trueValues: ["2", "1"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    trueValues: ["2", "1"]
                },
                itprice4: {
                    colname: "itprice4",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '@{\"text\":\"txtNonStk\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "10%", trueValues: ["1", "2"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    trueValues: ["1", "2"]
                },
                reference: {
                    colname: "reference",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtProdCode\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        change: function (e) {
                            thatForm.helperFunc.fetchItem(false);
                        }
                    },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                barcode: {
                    colname: "barcode",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtBarcode\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        change: function (e) {
                            thatForm.helperFunc.fetchItem(true);
                        }
                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                descr: {
                    colname: "descr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtDescr1\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "80%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                descra: {
                    colname: "descra",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtDescr2\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "80%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                parentitem: {
                    colname: "parentitem",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"parentItemDescr\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        showValueHelp: true,
                        valueHelpRequest: function (e) {
                            UtilGen.Search.do_quick_search(e, this,
                                "select reference code,descr title from items where usecounts=0 order by descr2 ",
                                "select reference code,descr title from items where usecounts=0 and reference=:CODE", thatForm.frm.objs["qry1.parentitemname"].obj, undefined, undefined, undefined);

                        },
                        change: function (e) {
                            var control = this;
                            var pacnm = thatForm.frm.objs["qry1.parentitemname"].obj;
                            UtilGen.setControlValue(pacnm, "", "", true);
                            var vl = control.getValue();
                            var dt = Util.execSQL("select descr name from items where reference = " + Util.quoted(vl));
                            if (dt.ret != "SUCCESS") {
                                sap.m.MessageToast.show("Err! ");
                                return;
                            }
                            var dtx = JSON.parse("{" + dt.data + "}").data;
                            UtilGen.setControlValue(pacnm, dtx[0].NAME, dtx[0].NAME, true);
                        }
                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                parentitemname: {
                    colname: "parentitemname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "54%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                packd: {
                    colname: "packd",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"itemPackD\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "25%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                unitd: {
                    colname: "unitd",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"itemUnitD\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "15%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                pack: {
                    colname: "pack",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"itemPack\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "15%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                remark: {
                    colname: "remark",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtRemark\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "80%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                mfcode: {
                    colname: "mfcode",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtSupplier\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        showValueHelp: true,
                        valueHelpRequest: function (e) {
                            UtilGen.Search.do_quick_search(e, this,
                                "select code,name title from c_ycust where usecount=0 order by path ",
                                "select code,name title from c_ycust where usecount=0 and code=:CODE", thatForm.frm.objs["qry1.mfcodename"].obj, undefined, undefined, undefined);

                        },
                        change: function (e) {
                            var control = this;
                            var pacnm = thatForm.frm.objs["qry1.mfcodename"].obj;
                            UtilGen.setControlValue(pacnm, "", "", true);
                            var vl = control.getValue();
                            var dt = Util.execSQL("select name  from c_ycust where code = " + Util.quoted(vl));
                            if (dt.ret != "SUCCESS") {
                                sap.m.MessageToast.show("Err! ");
                                return;
                            }
                            var dtx = JSON.parse("{" + dt.data + "}").data;
                            if (dtx.length > 0)
                                UtilGen.setControlValue(pacnm, dtx[0].NAME, dtx[0].NAME, true);
                        }
                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                mfcodename: {
                    colname: "mfcodename",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "54%",

                    },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                price1: {
                    colname: "price1",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtPrice1\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "25%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                lsprice: {
                    colname: "lsprice",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtLsPrice\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "25%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                lpprice: {
                    colname: "lpprice",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtPurPrice\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "25%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                pkaver: {
                    colname: "pkaver",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"avgCost\",\"width\":\"30%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "yellow",
                    display_format: "#,##0.00000",
                    other_settings: { width: "25%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
            };
        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of Items ",
                    list_type: "sql",
                    cols: [
                        {
                            colname: 'REFERENCE',
                            return_field: "pac",
                        },
                        {
                            colname: "DESCR"
                        },
                        {
                            colname: "PRICE1",
                        },
                        {
                            colname: "PKAVER",
                        },

                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select descr,reference,price1, pkaver Pack_cost from items order by descr2",
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
        fetchItem: function (pByBarcode) {
            var rfrFld = (Util.nvl(pByBarcode, false) ? "barcode" : "reference");
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                return;
            setTimeout(function () {
                var rfr = thatForm.frm.getFieldValue("qry1." + rfrFld);
                var qr = Util.execSQLWithData("select descr,reference from items where " + rfrFld + "='" + rfr + "'");
                if (Util.nvl(qr, "") == "" || qr.length == 0)
                    return;
                var rfrx = qr[0].REFERENCE;
                var desx = qr[0].DESCR;

                Util.simpleConfirmDialog("Item existed " + desx + " fetch data ?", function (oAction) {
                    thatForm.frm.setFieldValue('pac', rfrx);
                    thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                    thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);

                }, undefined, undefined, "OK");
            });
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            var cod = thatForm.frm.getFieldValue("qry1.reference");
            var bcod = Util.nvl(thatForm.frm.getFieldValue("qry1.barcode"), "");
            var parent = thatForm.frm.getFieldValue("qry1.parentitem");
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                var cnts = Util.getSQLValue("select nvl(max(descr),'') from items where (reference=" + Util.quoted(cod) + " or barcode=" + Util.quoted(bcod) + ")");
                if (Util.nvl(cnts, '') != '')
                    FormView.err("This item existed with " + cnts);
            }
            var cnts = Util.getSQLValue("select nvl(max(descr),'') from items where reference!=" + Util.quoted(cod) + " and barcode=" + Util.quoted(bcod) + "");
            if (Util.nvl(cnts, '') != '')
                FormView.err("This item BARCODE existed with " + cnts);

            var cnts = Util.getSQLValue("select nvl(count(*),0) from invoice2 where refer=" + Util.quoted(parent));
            if (cnts > 0)
                FormView.err("Cant select parent item # " + parent + " , transaction existed store !");
            var cnts = Util.getSQLValue("select nvl(count(*),0) from pur2 where refer=" + Util.quoted(parent));
            if (cnts > 0)
                FormView.err("Cant select parent item # " + parent + " , transaction existed in purchase/sales  !");
            var cnts = Util.getSQLValue("select nvl(max(usecounts),0) from items where reference=" + Util.quoted(parent));
            if (cnts > 0)
                FormView.err("Cant select parent item # " + parent + " ,use count>0  !");
        }
    },
    showRawItems: function () {
        var that2 = this;
        var generateCtgs = function () {
            var view = that2.view;
            Util.destroyID(view.createId("btCtg" + that2.timeInLong));
            var btctg = new sap.m.Button(view.createId("btCtg" + that2.timeInLong), {
                text: "DEFAULT",
                customData: [{ key: "DEFAULT" }],
                icon: "sap-icon://megamenu",
                press: function () {
                    var mnus = [];
                    var loadasctg = function () {
                        that2.fetchCustItems = false;
                        fetchData();
                    }
                    mnus.push(new sap.m.MenuItem({
                        text: Util.getLangText("txtNewCtg") + "..",
                        press: function () {
                            if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT
                                || that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                                UtilGen.inputDialog("New Category", "Enter New Cateogry", "", function (str) {
                                    if (Util.nvl(str, "") == "")
                                        return false;
                                    btctg.getCustomData()[0].setKey(str);
                                    btctg.setText(str);
                                    setTimeout(() => {
                                        that2.qc.getControl().focus();
                                    }, 500);
                                    return true;
                                })
                            } else sap.m.MessageToast.show("Form must be in EDIT mode !");
                        }
                    }));
                    if (btctg.getCustomData()[0].getKey() != "DEFAULT")
                        mnus.push(new sap.m.MenuItem({
                            text: "DEFAULT",
                            press: function () {
                                btctg.getCustomData()[0].setKey("DEFAULT");
                                btctg.setText("DEFAULT");
                                loadasctg()
                            }
                        }));
                    var dtx = Util.execSQLWithData("select distinct ctg from masterasm where baseitem='" + that2.frm.getFieldValue("qry1.reference") + "'");
                    for (var di in dtx) {
                        if (dtx[di].CTG != "DEFAULT")
                            mnus.push(new sap.m.MenuItem({
                                text: dtx[di].CTG,
                                customData: [{ key: dtx[di].CTG }],
                                press: function () {
                                    var dd = this.getCustomData()[0].getKey();
                                    btctg.getCustomData()[0].setKey(dd);
                                    btctg.setText(dd);
                                    loadasctg()
                                }
                            }));
                    }
                    var mnu = new sap.m.Menu({
                        title: "",
                        items: mnus
                    });
                    mnu.openBy(this);
                }
            });
            return btctg;
        };

        if (this.qc == undefined) {
            this.qc = new QueryView("qrRawitems" + that2.timeInLong);
            this.qc.getControl().setEditable(true);
            this.qc.getControl().view = that2.view;
            this.qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
            this.qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
            this.qc.getControl().setFixedBottomRowCount(0);
            this.qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
            UtilGen.createDefaultToolbar1(this.qc, ["REFER", "DESCR"], false);
            this.qc.showToolbar.toolbar.addContent(new sap.m.ToolbarSpacer());
            this.qc.insertable = true;
            this.qc.deletable = true;
        }

        this.qc.showToolbar.toolbar.addContent(generateCtgs());

        if (that2.fetchCustItems == false)
            that2.qc.reset();
        var cc = "";
        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            cc = that2.frm.getFieldValue("qry1.reference");
        }

        var eventCalc = function (qv, cx, rowno, reAmt) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

            if (reAmt)
                qv.updateDataToTable();

            var ld = qv.mLctb;
            var sumAmt = 0;

            for (var i = 0; i < ld.rows.length; i++) {
                var pr = Util.extractNumber(ld.getFieldValue(i, "PKCOST"));
                var pk = Util.extractNumber(ld.getFieldValue(i, "PACK"));
                var allqty = (Util.extractNumber(ld.getFieldValue(i, "PKQTY")) * pk) + Util.extractNumber(ld.getFieldValue(i, "QTY"));
                var amt = (pr / pk) * allqty;
                if (reAmt)
                    ld.setFieldValue(i, "AMOUNT", amt)
                sumAmt += amt;
            }

            // thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
            that2.view.byId("txtRM" + that2.timeInLong).setText("Amount : " + df.format(sumAmt));
            if (reAmt)
                qv.updateDataToControl();

        };

        var seteditale = function () {
            if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW)) {
                sap.m.MessageToast.show("Must Form EDIT or NEW mode to edit and add items ! ");
                cmdEdit.setPressed(false);
                that2.qc.editable = false
                setTimeout(function () {
                    that2.qc.colorRows();
                });
                return;
            }

            if (cmdEdit.getPressed())
                that2.qc.editable = true;
            else
                that2.qc.editable = false
            fetchData();
            setTimeout(function () {
                that2.qc.colorRows();
            });
        }
        var fetchData = function () {
            var qv = that2.qc;
            if (that2.fetchCustItems) {
                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();
                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                    that2.qc.eventCalc = eventCalc;
                    eventCalc(qv, undefined, 0, true);
                });
                return;
            }

            var dt = Util.execSQL("SELECT M.REFER,I.DESCR, M.PACKD, " +
                " M.PACK, M.UNITD, M.PKQTY, M.QTY,round(GET_ITEM_COST(M.REFER)*I.PACK,5) PKCOST," +
                " GET_ITEM_COST(M.REFER)*M.ALLQTY AMOUNT FROM MASTERASM M,ITEMS I " +
                " WHERE I.REFERENCE=M.REFER " +
                " and m.ctg='" + that2.view.byId("btCtg" + that2.timeInLong).getCustomData()[0].getKey() + "' " +
                " and m.baseitem='" + that2.frm.getFieldValue("qry1.reference") + "'" +
                " order by m.refer "
            );
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].mColClass = "sap.m.Input";

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 200;
                qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("UNITD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PACK")].getMUIHelper().display_width = 40;
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_width = 80;
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].getMUIHelper().display_width = 80;
                qv.mLctb.cols[qv.mLctb.getColPos("PKCOST")].getMUIHelper().display_width = 120;
                qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_width = 120;

                qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_format = "MONEY_FORMAT";
                // qv.mLctb.cols[qv.mLctb.getColPos("PKCOST")].getMUIHelper().display_format = "#,##0.00000";

                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mTitle = "Price Sell";
                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE_BUY")].mTitle = "Price Buy";

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].eValidateColumn = function (evtx) {
                    var row = evtx.getSource().getParent();
                    var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                    var columns = evtx.getSource().getParent().getParent().getColumns();
                    var table = evtx.getSource().getParent().getParent(); // get table control.
                    var oModel = table.getModel();
                    var rowStart = table.getFirstVisibleRow(); //starting Row index
                    var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));
                    var newValue = evtx.getSource().getValue();

                    oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', "");
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PACKD', "");
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PACK', "1");
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PKCOST', "0");

                    var dtxM = Util.execSQLWithData("select descr,packd,unitd,pack,round(GET_ITEM_COST(REFERENCE),5) PKCOST from items where reference='" + newValue + "' ")
                    if (dtxM != undefined && dtxM.length > 0) {
                        oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACKD', dtxM[0].PACKD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/UNITD', dtxM[0].UNITD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACK', dtxM[0].PACK);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PKCOST', dtxM[0].PKCOST);
                    }
                };
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mSearchSQL = "select reference code,descr title from items order by descr2";
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    UtilGen.Search.do_quick_search(evtx, input,
                        "select reference code,descr title,round(get_item_cost(reference),5) pkcost from items order by descr2 ",
                        "select reference code,descr title from items  where reference=:CODE", undefined, function () {
                            input.fireChange();
                        },
                        {
                            pWidth: "600px", pHeight: "400px",
                            "background-color": 'blue',
                            "dialogStyle": "cyanDialog"
                        });


                }
                var qtValidate = function (evtx) {
                    var sett = sap.ui.getCore().getModel("settings").getData();
                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                    var row = evtx.getSource().getParent();
                    var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                    var columns = evtx.getSource().getParent().getParent().getColumns();
                    var table = evtx.getSource().getParent().getParent(); // get table control.
                    var oModel = table.getModel();
                    var rowStart = table.getFirstVisibleRow(); //starting Row index
                    var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));

                    var pr = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + '/PKCOST'));
                    var pqt = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + '/PKQTY'));
                    var qt = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + '/QTY'));
                    var pk = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + '/PACK'));
                    var amt = (pr / pk) * (qt + (pqt * pk));
                    oModel.setProperty(currentRowoIndexContext.sPath + '/AMOUNT', df.format(amt));
                    eventCalc(qv, undefined, 0, true);

                };
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].eValidateColumn = qtValidate;
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].eValidateColumn = qtValidate;

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                that2.fetchCustItems = true;


                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "PKQTY", 0);
                    ld.setFieldValue(idx, "QTY", 0);
                    ld.setFieldValue(idx, "PACK_COST", 0);
                    ld.setFieldValue(idx, "PACK", 1);

                }

                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();

                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                });
                eventCalc(that2.qc, undefined, undefined, true);
            }
        }
        var pg = new sap.m.Page({
            showHeader: true,
            content: [],
            showFooter: true
        }).addStyleClass("sapUiSizeCompact");
        var cmdClose = new sap.m.ToggleButton({
            text: Util.getLangText("cmdDone"),
            icon: "sap-icon://accept",
            pressed: false,
            press: function () {
                dlg.close();
            }

        });
        var cmdEdit = new sap.m.ToggleButton({
            text: Util.getLangText("editRec"),
            icon: "sap-icon://edit",
            pressed: (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT
                || that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW),
            press: function () {
                if (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
                    that2.frm.cmdButtons.cmdEdit.setPressed(true);
                    that2.frm.cmdButtons.cmdEdit.firePress();
                }
                seteditale();
            }

        });
        var cmdSave = new sap.m.Button({
            text: Util.getLangText("saveRec"),
            icon: "sap-icon://save",
            press: function () {
                that2.frm.cmdButtons.cmdSave.firePress();
                cmdEdit.setPressed(false);
            }

        });
        Util.destroyID("txtRM" + that2.timeInLong, that2.view);
        var txtSumRM = new sap.m.Text(that2.view.createId("txtRM" + that2.timeInLong), { width: "300px", text: "0" }).addStyleClass("redText boldText");

        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.removeAllHeaderContent();
        pg.addHeaderContent(this.qc.showToolbar.toolbar);
        pg.addContent(this.qc.getControl());
        tbHeader.addContent(cmdSave);
        tbHeader.addContent(cmdEdit);
        tbHeader.addContent(cmdClose);
        tbHeader.addContent(new sap.m.ToolbarSpacer());
        tbHeader.addContent(txtSumRM);

        var tit = Util.getLangText("titRawItems");
        if (cc != "")
            tit = Util.getLangText("titRawItems") + " - " + that2.frm.getFieldValue("qry1.descr") + " / " + that2.frm.getFieldValue("qry1.reference");

        var dlg = new sap.m.Dialog({
            title: tit,
            content: pg,
            contentWidth: "80%",
            contentHeight: "400px",

        });
        fetchData();
        seteditale();
        dlg.open();
        dlg.attachAfterClose(function () {
            that2.qc.updateDataToTable();
            sap.m.MessageToast.show("Closing  Itmes window..");
        });
        that2.qc.eventCalc = eventCalc;
        eventCalc(that2.qc, undefined, 0, true);

    },

    doUpdateRawMat: function () {
        var that2 = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

        if (!that2.fetchCustItems || that2.qc == undefined || that2.qc.mLctb.rows.length == 0)
            return "";
        var ld = that2.qc.mLctb;
        var sqls = "";
        var rfr = that2.frm.getFieldValue("qry1.reference");
        var ctg = that2.view.byId("btCtg" + that2.timeInLong).getCustomData()[0].getKey();
        var sq2 = UtilGen.getInsertRowStringByObj(
            "MASTERASM",
            {
                "CTG": Util.quoted(ctg),
                "BASEITEM": "':XBASEITEM'",
                "REFER": "':XREFER'",
                "PACKD": "':XPACKD'",
                "PACK": ":XPACK",
                "UNITD": "':XUNITD'",
                "PKQTY": ":XPKQTY",
                "QTY": ":XQTY",
                "ALLQTY": ":XALLQTY"
            });
        var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
        var sqItm = "select packd,unitd,pack  " +
            " from items where reference=':XREFER'";
        // sqItm = that2.frm.parseString(sqItm);
        var checkDuplicate = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (Util.nvl(ld.getFieldValue(i, "REFER"), "") == "") {
                that2.showRawMat();
                FormView.err(" REFER MUST ENTER !");
            }
            if (checkDuplicate[ld.getFieldValue(i, "REFER")] != undefined) {
                that2.showRawMat();
                FormView.err("Refer  # " + ld.getFieldValue(i, "REFER") + " alredy existed for " + ld.getFieldValue(i, "DESCR"))
            } else
                checkDuplicate[ld.getFieldValue(i, "REFER")] = ld.getFieldValue(i, "DESCR");
            var sqi = sqItm.replaceAll(":XREFER", ld.getFieldValue(i, "REFER"));
            sqi = that2.frm.parseString(sqi);
            var dtx = Util.execSQLWithData(sqi, "No ITEM found .." + ld.getFieldValue(i, "REFER"));
            var pkq = ld.getFieldValue(i, "PKQTY");
            var q = ld.getFieldValue(i, "QTY");

            var sq = sq2.replaceAll(":XREFER", ld.getFieldValue(i, "REFER"))
                .replaceAll(":XBASEITEM", rfr)
                .replaceAll(":XPACKD", dtx[0].PACKD)
                .replaceAll(":XUNITD", dtx[0].UNITD)
                .replaceAll(":XPACK", dtx[0].PACK)
                .replaceAll(":XPKQTY", pkq)
                .replaceAll(":XQTY", q)
                .replaceAll(":XALLQTY", (pkq * dtx[0].PACK) + q)
            sqls += sq + ";";
        }
        sqls = "delete from masterasm where ctg='" + ctg + "' and baseitem='" + rfr + "';" + sqls;
        return sqls;
    },
    loadData: function () {
        var frag = this;
        if (Util.nvl(frag.oController.reference, "") != "") {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.refernce, ""));
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



