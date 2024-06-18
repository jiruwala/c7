sap.ui.jsfragment("bin.forms.br.forms.iasm", {

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
        var dmlSq = "select O1.*,IT.DESCR,IT.PACKD,IT.PACK,O1.SALE_PRICE*O1.TQTY AMOUNT from C_ORDER1 o1 ,ITEMS IT where " +
            " IT.REFERENCE=O1.ORD_SHIP AND O1.KEYFLD=':keyfld' and ord_code=" + that.vars.vou_code + " ORDER BY O1.ORD_POS ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("dlvNoteBR"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 500, "M": 650, "L": 750 },
                    cssText: [
                        "padding-left:10px;" +
                        "padding-top:20px;" +
                        "border-width: thin;" +
                        "border-style: solid;" +
                        "border-color: lavender;" +
                        "margin: 10px;" +
                        "border-radius:25px;"
                        // "background-color:khaki;"
                    ],
                },
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
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.BRDLV1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 5, "M": 7, "L": 10, "XL": 14, "XXL": 18 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from c_order1 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCR', 'AMOUNT', 'PACKD', 'PACK'],
                        insert_exclude_fields: ['DESCR', 'AMOUNT', 'PACKD', 'PACK'],
                        insert_default_values: {
                            "PERIODCODE": sett["CURRENT_PERIOD"],
                            "LOCATION_CODE": ":qry1.location_code",
                            "ORD_NO": ":qry1.ord_no",
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_REF": ":qry1.ord_ref",
                            "ORD_REFNM": ":qry1.ord_refnm",
                            "ORD_DISCAMT": ":qry1.ord_discamt",
                            "ORD_DATE": ":qry1.ord_date",
                            "ORD_EMPNO": ":qry1.ord_empno",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": ":qry1.stra",

                        },
                        update_default_values: {
                        },
                        table_name: "c_order1",
                        before_add_table: function (scrollObjs, qrj) {
                            UtilGen.createDefaultToolbar1(qrj, ["ORD_SHIP", "DESCR"], true);
                            scrollObjs.push(qrj.showToolbar.toolbar);
                            qrj.eventKey = function (key, rowno, colno, firstVis) {
                                var totalRows = qrj.getControl().getModel().getData().length;
                                var visRows = qrj.getControl().getVisibleRowCount();
                                var cl = UtilGen.getTableColNo(qrj.getControl(), "ORD_SHIP");
                                var vl = qrj.getControl().getRows()[rowno].getCells()[cl].getValue();
                                if (vl == "") {
                                    qrj.deleteRow(firstVis + rowno);
                                    var rn = (rowno - 1 < 0) ? 0 : (rowno == visRows - 1 ? rowno : rowno - 1);
                                    if (totalRows - 1 <= visRows - 1)
                                        rn = totalRows - 2;
                                    qrj.getControl().getRows()[rn].getCells()[cl].focus();
                                    return false;
                                }
                                return true;
                            }

                        },
                        when_validate_field: function (table, currentRowoIndexContext, cx, rowno, colno) {
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_type"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdType"));
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_ref"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdRef"));
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_discamt"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterBranch"));

                            thatForm.helperFunc.validity.updateFieldsEditing();
                            return true;
                        },
                        eventCalc: function (qv, cx, rowno, reAmt) {
                            var sett = sap.ui.getCore().getModel("settings").getData();
                            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                            if (reAmt)
                                qv.updateDataToTable();

                            var ld = qv.mLctb;
                            var sumAmt = 0;

                            for (var i = 0; i < ld.rows.length; i++)
                                sumAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "AMOUNT"), df), 0);

                            thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
                            if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                                thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("Amount : " + df.format(sumAmt));

                        },
                        summary: thatForm.helperFunc.getSummary()

                    }
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
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                        var dt = thatForm.view.today_date.getDateValue();


                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();

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
                    class_name: FormView.ClassTypes.LABEL,
                    title: '{\"text\":\"Key ID\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "20%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                stra: {
                    colname: "stra",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"storeNo\",\"width\":\"40%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "25%",

                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                        },
                    },

                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    list: "select no code,name  from store order by no"
                },
                location_code: {
                    colname: "location_code",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"locationTxt\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "20%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            vl = UtilGen.getControlValue(this);
                            var objOrd = thatForm.frm.objs["qry1.ord_no"].obj;
                            UtilGen.setControlValue(objOrd, "", "", true);
                            if (vl != "") {
                                var nwOn = Util.getSQLValue("select nvl(max(ord_no),0)+1 from order1 " +
                                    " where  ord_code=" + thatForm.vars.vou_code + " and location_code=" + Util.quoted(vl));
                                UtilGen.setControlValue(objOrd, nwOn, nwOn);
                            }
                        },
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "select code,name  from locations order by code"
                },
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



