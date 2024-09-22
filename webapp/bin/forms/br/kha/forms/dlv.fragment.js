sap.ui.jsfragment("bin.forms.br.kha.forms.dlv", {

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
            vou_code: 9,
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
        var dmlSq = "select O1.*,IT.DESCR,IT.PACKD,IT.PACK,O1.SALE_PRICE*O1.ORD_PKQTY AMOUNT from C_ORDER1 o1 ,ITEMS IT where " +
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
                            "STRB": Util.nvl(sett["BR_DLV_STRB"], ":qry1.stra"),
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
                            "ORD_REFNM": ":qry1.ord_refnm",
                            "ORD_REF": ":qry1.ord_ref",
                            "ORD_DISCAMT": ":qry1.ord_discamt",
                            "ORD_DATE": ":qry1.ord_date",
                            "ORD_EMPNO": ":qry1.ord_empno",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": ":qry1.stra",
                            "STRB": Util.nvl(sett["BR_DLV_STRB"], ":qry1.stra"),
                            "ATTN": ":qry1.branchname",
                            // "ORD_PACKD": "(select max(packd) from items where reference=ord_ship)",
                            // "ORD_UNITD": "(select max(unitd) from items where reference=ord_ship)",
                            // "ORD_PACK": "(select max(PACK) from items where reference=ord_ship)"

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
                        var strInvType = "select descr title from invoicetype where location_code=':locationx' and no = ':CODE' ".replaceAll(":locationx", UtilGen.getControlValue(qry.formview.objs["qry1.location_code"].obj));
                        var strInvs = "select b_name title from cbranch where code=':cust_code' and brno = ':CODE' ".replaceAll(":cust_code", UtilGen.getControlValue(qry.formview.objs["qry1.ord_ref"].obj));
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.txt_empname"].obj);
                        UtilGen.Search.getLOVSearchField(strInvType, qry.formview.objs["qry1.ord_type"].obj, undefined, that.frm.objs["qry1.typename"].obj);
                        UtilGen.Search.getLOVSearchField(strInvs, qry.formview.objs["qry1.ord_discamt"].obj, undefined, that.frm.objs["qry1.branchname"].obj);
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
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_ref"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdRef"));
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_discamt"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterBranch"));

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
                    if (qry.name == "qry2") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var ld = qry.obj.mLctb;
                        var rfr = ld.getFieldValue(rowno, "ORD_SHIP");
                        var pos = ld.getFieldValue(rowno, "ORD_POS");
                        var rfnm = ld.getFieldValue(rowno, "ORD_REFNM");
                        var dt = Util.execSQLWithData("select packd,unitd,pack from items where reference='" + rfr + "'", "Item # " + rfr + " not a valid !");
                        var sq = "update c_order1 set ord_packd=':pkd',ord_unitd=':unitd' ,ord_pack=:pack , packdx=':pkd', ord_refnm=':rfnm', tqty=ord_pkqty*:pack where keyfld=:kf and ord_pos=:pos "
                            .replaceAll(":pkd", dt[0].PACKD)
                            .replaceAll(":unitd", dt[0].UNITD)
                            .replaceAll(":pack", dt[0].PACK)
                            .replaceAll(":kf", kf)
                            .replaceAll(":pos", pos)
                            .replaceAll(":rfnm", rfnm);
                        return sqlRow + ";" + sq;
                    }
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objTyp = thatForm.frm.objs["qry1.ord_type"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                        var dt = thatForm.view.today_date.getDateValue();


                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);
                        UtilGen.setControlValue(objTyp, sett["DEFAULT_TYPE"], sett["DEFAULT_TYPE"], true);
                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        qry.formview.setFieldValue("qry1.stra", sett["DEFAULT_STORE"], sett["DEFAULT_STORE"], true);
                        qry.formview.setFieldValue("qry1.ord_addamt", 0, 0, true);


                        objOn.fireSelectionChange();
                        // thatForm.helperFunc.validity.updateFieldsEditing();

                    }
                    // if (qry.name == "qry2")
                    //     ld.setFieldValue(idx, "MP", "N");
                },
                afterEditRow(qry, index, ld) {
                    if (qry.name == "qry1")
                        thatForm.helperFunc.validity.updateFieldsEditing();
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
                    // var delAdd = "";
                    // if (qry.name == "qry1")
                    //     delAdd += "delete from c7_attach where kind_of='VOU'and refer=:qry1.keyfld ;";
                    var kf = thatForm.frm.getFieldValue("keyfld");
                    if (qry.name == "qry1") {
                        var dt = Util.execSQL("select saleinv from order1 where keyfld=" + kf);
                        if (dt.ret == "SUCCESS") {
                            var dtx = JSON.parse("{" + dt.data + "}").data;
                            if (dtx.length > 0 && dtx[0].SALEINV != undefined) {
                                qry.formview.setFormReadOnly();
                                FormView.err("This Delivery is posted to invoice !");
                            }
                            var geniasm = Util.nvl(sett["BR_GEN_IASM_ON_DELIVERY"], 'FALSE');
                            return geniasm == "TRUE" ? "c7_generate_iasm_from_dlv(" + kf + ",'Y');" : "";
                        }
                    }

                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();

                    // return delAdd;
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
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var geniasm = Util.nvl(sett["BR_GEN_IASM_ON_DELIVERY"], 'FALSE');
                    var sq1 = "";
                    if (geniasm == 'TRUE') {
                        sq1 = "c7_generate_iasm_from_dlv(" + kf + ");";
                    }
                    return sq + sq1 + "update_dlv_add_amt(" + kf + ");";
                },
                addSqlBeforeUpdate: function (qry, rn) {
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    if (qry.name == "qry1" && thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                        var sq1 = "";
                        sq1 = "c7_generate_iasm_from_dlv(" + kf + ",'Y');";
                        return sq1;
                    }
                    return "";
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
            checkCustomer: function (pmsg) {
                var thatForm = this.thatForm;
                var msg = Util.nvl(pmsg, true);
                var custCod = thatForm.frm.getFieldValue("qry1.ord_ref");
                var dtx = Util.getSQLValue("select childcount,flag from c_ycust where childcount=0 and flag=1 and code=" + Util.quoted(custCod));
                if (msg && (dtx == undefined || dtx.length <= 0))
                    FormView.err("Customer code is not valid ! ");
                return (msg ? true : pmsg);
            },
            checkDriver: function (pmsg) {
                var thatForm = this.thatForm;
                var msg = Util.nvl(pmsg, true);
                var driv = thatForm.frm.getFieldValue("qry1.ord_empno");
                var dtx = Util.getSQLValue("select name from salesp where flag=1 and no=" + Util.quoted(driv));
                if (msg && (dtx == undefined || dtx.length <= 0))
                    FormView.err("Driver is not valid ! ");
                return (msg ? true : pmsg);
            },
            updateFieldsEditing: function () {
                var thatForm = this.thatForm;
                var qv = thatForm.frm.objs["qry2"].obj;
                var ld = qv.mLctb;
                var itmCount = 0;
                if (!(thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                    thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
                    return;
                var setControls = function (ed) {
                    thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(ed);
                    thatForm.frm.objs["qry1.ord_refnm"].obj.setEditable(ed);
                    thatForm.frm.objs["qry1.ord_discamt"].obj.setEditable(ed);
                    thatForm.frm.objs["qry1.ord_type"].obj.setEditable(ed);
                }

                setControls(true);
                qv.updateDataToTable();
                for (var i = 0; i < ld.rows.length; i++)
                    if (Util.nvl(ld.getFieldValue(i, "ORD_SHIP"), "").trim() != "")
                        itmCount++;

                if (itmCount > 0) {
                    setControls(false);
                }
            }
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
                    display_style: "keyIdText",
                    display_format: "",
                    other_settings: { editable: false, width: "30%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                stra: {
                    colname: "stra",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"storeNo\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "30%",

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
                        editable: true, width: "30%",
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
                ord_type: {
                    colname: "ord_type",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtOrdType\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "10%",
                        showValueHelp: true,
                        change: function (e) {
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.location_code"].obj)
                            var sq = "select descr name ,accno from invoicetype " +
                                " where location_code=':LOCATION' and no = ':CODE'".replaceAll(":LOCATION", locval).replaceAll(":CODE", thatForm.frm.objs["qry1.ord_type"].obj.getValue());
                            var dtx = Util.execSQLWithData(sq, "No data found ..");
                            thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(true);
                            if (dtx != undefined) {
                                UtilGen.setControlValue(thatForm.frm.objs["qry1.typename"].obj, dtx[0].NAME);
                                UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_ref"].obj, dtx[0].ACCNO);
                                var nm = Util.getSQLValue("select name from c_ycust where code='" + dtx[0].ACCNO + "'");
                                UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_refnm"].obj, nm);
                                if (Util.nvl(dtx[0].ACCNO, '') != "")
                                    thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(false);
                            }
                            // UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_type"].obj, undefined, thatForm.frm.objs["qry1.typename"].obj);


                        },
                        valueHelpRequest: function (e) {
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.location_code"].obj)
                            UtilGen.Search.do_quick_search(e, this,
                                "select no code,descr title from invoicetype where location_code=':locationx' order by no ".replaceAll(":locationx", locval),
                                "select no code,descr title from invoicetype where location_code=':locationx' and no=:CODE".replaceAll(":locationx", locval), thatForm.frm.objs["qry1.typename"].obj, undefined,
                                {
                                    pWidth: "300px", pHeight: "400px",
                                    "background-color": 'blue',
                                    "dialogStyle": "cyanDialog"
                                });
                        }

                    },

                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                typename: {
                    colname: "typename",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "19%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    keyboardFocus: false,
                },
                ord_no: {
                    colname: "ord_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"rcptNo\",\"width\":\"15%\","textAlign":"End","styleClass":"redText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "30%",
                        change: function () {
                            thatForm.helperFunc.fetchItem(false);
                        }
                    },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },

                ord_empno: {
                    colname: "ord_empno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtDriver\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true,
                        width: "10%",
                        showValueHelp: true,
                        change: function (e) {
                            var sq = "select name from salesp where no = :CODE";
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_empno"].obj, undefined, thatForm.frm.objs["qry1.txt_empname"].obj);
                            var objEmp = thatForm.frm.objs["qry1.ord_empno"].obj;
                            var objTel = thatForm.frm.objs["qry1.ord_ship"].obj;
                            var objV = thatForm.frm.objs["qry1.payterm"].obj;
                            var dtxM = Util.execSQLWithData("select mobile,vehicleno,HADDR from salesp where no=" + objEmp.getValue());
                            UtilGen.setControlValue(objTel, dtxM[0]["MOBILE"], dtxM[0]["MOBILE"], true);
                            UtilGen.setControlValue(objV, dtxM[0]["payterm"], dtxM[0]["payterm"], true);

                        },
                        valueHelpRequest: function (e) {
                            var btns = [new sap.m.Button({
                                text: Util.getLangText('newDriverText'), press: function () {
                                    thatForm.helperFunc.showDrivers(this);
                                }
                            })];
                            UtilGen.Search.do_quick_search(e, this,
                                "select no code,name title from salesp  order by no ",
                                "select no code,name title from salesp where NO=:CODE", thatForm.frm.objs["qry1.txt_empname"].obj, undefined, undefined, btns);
                        }

                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                txt_empname: {
                    colname: "txt_empname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "19%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    keyboardFocus: false,
                },
                ord_date: {
                    colname: "ord_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"ordDate\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "30%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },

                ord_ship: {// telephone no
                    colname: "ord_ship",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtTel\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "30%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                ord_ref: {
                    colname: "ord_ref",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtCust\",\"width\":\"15%\","textAlign":"End","styleClass":"darkBlueText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "12%",
                        showValueHelp: true,
                        change: function (e) {

                            var objBr = thatForm.frm.objs["qry1.ord_discamt"].obj;
                            var objBrNm = thatForm.frm.objs["qry1.branchname"].obj;
                            UtilGen.setControlValue(objBr, "", "", true);
                            UtilGen.setControlValue(objBrNm, "", "", true);

                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_type"), '') == '') {
                                thatForm.frm.objs["qry1.ord_ref"].obj.setValue("");
                                FormView.err(Util.getLangText("msgBRMustEnterOrdType"));

                            }

                            var sq = "select name from c_ycust where  code = ':CODE'";
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_ref"].obj, undefined, thatForm.frm.objs["qry1.ord_refnm"].obj);
                            var objCd = thatForm.frm.objs["qry1.ord_ref"].obj;
                            var objBal = thatForm.frm.objs["qry1.txt_balance"].obj;

                            var dtxM = Util.execSQLWithData("select nvl(sum(debit-credit),0) bal from acvoucher2 where cust_code=" + Util.quoted(objCd.getValue()));
                            var dt2 = Util.getSQLValue("select sum(sale_price*tqty) from c_order1 where saleinv is null and  ord_ref=" + Util.quoted(objCd.getValue()));
                            var bl = dtxM[0]["BAL"] + dt2;
                            UtilGen.setControlValue(objBal, bl, bl, true);

                        },
                        valueHelpRequest: function (e) {
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_type"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdType"));

                            var btns = [new sap.m.Button({
                                text: Util.getLangText('newCustomer'), press: function () {
                                    UtilGen.execCmd("gl.rp formType=dialog formSize=850px,450px", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {

                                    });
                                }
                            })];

                            UtilGen.Search.do_quick_search(e, this,
                                "select code,name title from c_ycust where iscust='Y'  order by path ",
                                "select code,name title from c_ycust where code=:CODE", thatForm.frm.objs["qry1.ord_refnm"].obj, undefined, undefined, btns);
                        }

                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                ord_refnm: {
                    colname: "ord_refnm",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "17%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    keyboardFocus: false,
                },
                payterm: {
                    colname: "payterm",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"truckNo\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "30%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                ord_discamt: {// branch no
                    colname: "ord_discamt",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_START",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "10%",
                        showValueHelp: true,
                        change: function (e) {
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.ord_ref"].obj)
                            var sq = "select b_name name from cbranch where code=':CUSTCODE' and brno = ':CODE'".replaceAll(":CUSTCODE", locval);
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_discamt"].obj, undefined, thatForm.frm.objs["qry1.branchname"].obj);

                        },
                        valueHelpRequest: function (e) {
                            var btns = [new sap.m.Button({
                                text: 'New Branch ', press: function () {
                                    thatForm.helperFunc.showBranch(this);
                                }
                            })];
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.ord_ref"].obj)
                            UtilGen.Search.do_quick_search(e, this,
                                "select brno code,b_name  title,AREA,BLOCK,JEDDA,QASIMA from cbranch where code=':locationx' order by brno ".replaceAll(":locationx", locval),
                                "select brno code,b_name title from cbranch where code=':locationx' and brno=:CODE".replaceAll(":locationx", locval), thatForm.frm.objs["qry1.branchname"].obj, undefined, { pWidth: "80%" }, btns);
                        }

                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                branchname: {
                    colname: "branchname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    keyboardFocus: false,
                    other_settings: { editable: true, width: "19%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                txt_balance: {
                    colname: "txt_balance",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"balanceTxt\",\"width\":\"25%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { editable: true, width: "30%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                cmdSOA: {
                    colname: "cmdSOA",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.BUTTON,
                    title: '@{\"text\":\" \",\"width\":\"1%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: {
                        editable: true, width: "14%", text: Util.getLangText("soaTxt"), press: function () {
                            var ac = thatForm.frm.getFieldValue("qry1.ord_ref");
                            if (Util.nvl(ac, "") != "")
                                UtilGen.execCmd("testRep5 formType=dialog repno=0 para_PARAFORM=false para_EXEC_REP=true pref=" + ac + "", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage);
                            return true;

                        }
                    },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },

                ord_addamt: {
                    colname: "ord_addamt",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"addAmt\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { editable: true, width: "30%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
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
                    list_para: {
                        selectStr: "@100/Last 100,200/Last 200,1000/Last 1000,-1/All",
                        defaultKey: "-1",
                    },
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
                    sql: "select *from (select ord_no,ord_date,ord_ref,ord_refnm,keyfld,location_code from order1 o1 where " +
                        " location_code=':qry1.location_code' and " +
                        " ord_type=':qry1.ord_type' and " +
                        " ord_code =" + that2.vars.vou_code +
                        " order by ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1)",
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
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://letter",
                                    text: Util.getLangText("generateInvoice"),
                                    press: function () {
                                        that2.helperFunc.generateInvoice(this);
                                    }
                                }));
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
        getItemPrice: function (refer) {

            var thatForm = this.thatForm;
            var dt = thatForm.frm.getFieldValue("qry1.ord_date");
            var sqcnt = ("select get_item_price2(:refer,':ref_code',:loc,:ord_date) from dual ")
                .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ord_ref"))
                .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.ord_discamt"))
                .replaceAll(":refer", refer)
                .replaceAll(":ord_date", Util.toOraDateString(dt));

            var cnt = Util.getSQLValue(sqcnt);
            return cnt;

            // var thatForm = this.thatForm;
            // var dt = thatForm.frm.getFieldValue("qry1.ord_date");
            // var sqcnt = ("select nvl(max(price),0) cnts from c_contract_items" +
            //     " where cust_code=':ref_code' and branch_no=':loc' and " +
            //     " trunc(:ord_date)>=startdate and trunc(:ord_date)<=enddate " +
            //     " and refer=:refer order by refer ")
            //     .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ord_ref"))
            //     .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.ord_discamt"))
            //     .replaceAll(":refer", refer)
            //     .replaceAll(":ord_date", Util.toOraDateString(dt));

            // var cnt = Util.getSQLValue(sqcnt);
            // if (cnt <= 0) {
            //     var sq = ("SELECT custitems.price " +
            //         " FROM CUSTITEMS,ITEMS " +
            //         " WHERE REFERENCE=REFER AND CODE='" +
            //         thatForm.frm.getFieldValue("qry1.ord_ref") +
            //         "' and custitems.refer=:refer").replaceAll(":refer", refer);
            //     cnt = Util.getSQLValue(sq);
            // }
            // if (cnt <= 0) {
            //     var sq = "select price1 from items where reference=" + refer;
            //     cnt = Util.getSQLValue(sq);
            // }
            // return cnt;
        },
        showDrivers: function (obj) {
            var thatForm = this.thatForm;
            var vb = new sap.m.VBox();
            var btAp = new sap.m.Button({
                text: Util.getLangText("saveRec"),
                enabled: false,
                press: function () {
                    saveData();
                }
            });
            var enableDisableSave = function () {
                var ed = false;
                if (txtNo.getValue() != "" && txtName.getValue() != "") ed = true;
                btAp.setEnabled(ed);
            }

            var txtNo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "20%", editable: true });
            var txtName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "55%", editable: true });
            var txtName2 = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "55%", editable: true });
            var txtVehicleNo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: true });
            var txtMobile = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: true });

            txtNo.attachLiveChange(enableDisableSave);
            txtName.attachLiveChange(enableDisableSave);

            var checkDriverExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(name),'') from salesp where no=" + txtNo.getValue());
                if (pmsg == Util.nvl(exis, '') != '')
                    FormView.err("Driver No Existed .with name " + exis);
                return (msg ? true : pmsg);
            };

            var checkNameExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(no||''),'') from salesp where upper(name)=upper('" + txtName.getValue() + "')");
                if (msg && Util.nvl(exis, '') != '')
                    FormView.err("Driver NAME Existed .with NO # " + exis);
                return (msg ? true : pmsg);
            };

            var checkDriverExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(name),'') from salesp where no=" + txtNo.getValue());
                if (msg && Util.nvl(exis, '') != '')
                    FormView.err("Driver No Existed .with name " + exis);
                return (msg ? true : pmsg);
            };


            txtNo.attachChange(function () {
                checkDriverExist(true);
            });
            txtName.attachChange(function () {
                checkNameExist(true);
            });
            var saveData = function () {
                checkDriverExist(true);
                checkNameExist(true);
                var sq = "Insert into salesp (NO,NAME,NAMEA,TYPE,VEHICLENO,MOBILE) VALUES  " +
                    " (:NO,':NAME',':NAMEA','D',':VEHICLENO',':MOBILE') ";
                sq = sq.replaceAll(":NO", txtNo.getValue())
                    .replaceAll(":NAME", txtName.getValue())
                    .replaceAll(":NAMEA", txtName2.getValue())
                    .replaceAll(":VEHICLENO", txtVehicleNo.getValue())
                    .replaceAll(":MOBILE", txtVehicleNo.getValue());

                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    sap.m.MessageToast.show("Successfully Saved new, refresh list ");
                    dlg.close();
                }

            }
            var fe = [
                Util.getLabelTxt("txtDriverNo", "15%"), txtNo,
                Util.getLabelTxt("txtDriverName", "10%", "@"), txtName,
                Util.getLabelTxt("txtDriverName2", "45%", ""), txtName2,
                Util.getLabelTxt("txtVehicleNo", "15%"), txtVehicleNo,
                Util.getLabelTxt("txtMobile", "30%", "@"), txtMobile,
            ];
            var newNo = Util.getSQLValue("select nvl(max(no),0)+1 from salesp");
            txtNo.setValue(newNo + "");
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                width: { "S": 280, "M": 380, "L": 480 },
                cssText: [
                    "padding-left:5px ;" +
                    "padding-top:3px;" +
                    "border-style: groosve;" +
                    "margin-left: 1%;" +
                    "margin-right: 1%;" +
                    "border-radius:20px;" +
                    "margin-top: 3px;"
                ]
            }, "sapUiSizeCompact", "");
            cnt.addContent(new sap.m.VBox({ height: "40px" }));
            vb.addItem(cnt);
            Util.navEnter(fe);
            var dlg = new sap.m.Dialog({
                title: Util.getLangText("newDriverText"),
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 500 }) + "px",
                contentHeight: "150px",
                content: [vb],
                modal: true,
                buttons: [
                    btAp,
                    new sap.m.Button({
                        text: Util.getLangText("cmdClose"),
                        press: function () {
                            dlg.close();
                        }
                    })

                ]
            }).addStyleClass("sapUiSizeCompact");;
            dlg.open();
        },
        showBranch: function () {
            var thatForm = this.thatForm;
            var vb = new sap.m.VBox();
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var nam = thatForm.frm.getFieldValue("qry1.ord_refnm");
            if (Util.nvl(cod, '') == "")
                FormView.err("Err !, No customer is assigned !");
            var btAp = new sap.m.Button({
                text: Util.getLangText("saveRec"),
                enabled: false,
                press: function () {
                    saveData();
                }
            });
            var enableDisableSave = function () {
                var ed = false;
                if (txtBrNo.getValue() != "" && txtbname.getValue() != "") ed = true;
                btAp.setEnabled(ed);
            }
            var txtCustCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtCustName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "85%" }).addStyleClass("redText");
            var txtBrNo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: true });
            var txtbname = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "59%", editable: true });
            var txtbName2 = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "59%", editable: true });
            var txtArea = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });
            var txtBlock = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });
            var txtStreet = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });
            var txtJedda = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });
            var txtQasima = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });
            var txtTel = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "17%", editable: true });

            txtBrNo.attachLiveChange(enableDisableSave);
            txtbname.attachLiveChange(enableDisableSave);

            var newNo = Util.getSQLValue("select nvl(max(brno),0)+1 from cbranch where code='" + cod + "'");
            txtBrNo.setValue(newNo + "");
            txtCustCode.setText(cod);
            txtCustName.setText(nam);

            var checkBrNoExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(b_name),'') from cbranch where code='" + cod + "' and  brno=" + txtBrNo.getValue());
                if (msg && Util.nvl(exis, '') != '')
                    FormView.err("Branch No Existed .with name " + exis);
                return (msg ? true : pmsg);
            };

            var checkNameExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(brno||''),'') from cbranch where code='" + cod + "' and upper(b_name)=upper('" + txtbname.getValue() + "')");
                if (msg && Util.nvl(exis, '') != '')
                    FormView.err("Branch NAME Existed .with NO # " + exis);
                return (msg ? true : pmsg);
            };

            txtBrNo.attachChange(function () {
                checkBrNoExist(true);
            });
            txtbname.attachChange(function () {
                checkNameExist(true);
            });


            var saveData = function () {
                checkBrNoExist(true);
                checkNameExist(true);
                var acno = Util.getSQLValue("select ac_no from c_ycust where code='" + txtCustCode.getText() + "'");
                var sq = "Insert into cbranch (BRNO, CODE, ACCNO, B_NAME, B_NAMEA, AREA, TEL, BLOCK, STREET, JEDDA, QASIMA) VALUES  " +
                    " (:BRNO, ':CODE', ':ACCNO', ':B_NAME', ':B_NAMEA', ':AREA', ':TEL', ':BLOCK', ':STREET', ':JEDDA', ':QASIMA') ";
                sq = sq.replaceAll(":BRNO", txtBrNo.getValue())
                    .replaceAll(":CODE", txtCustCode.getText())
                    .replaceAll(":B_NAMEA", txtbName2.getValue())
                    .replaceAll(":B_NAME", txtbname.getValue())
                    .replaceAll(":ACCNO", acno)
                    .replaceAll(":AREA", txtArea.getValue())
                    .replaceAll(":TEL", txtTel.getValue())
                    .replaceAll(":BLOCK", txtBlock.getValue())
                    .replaceAll(":STREET", txtStreet.getValue())
                    .replaceAll(":JEDDA", txtJedda.getValue())
                    .replaceAll(":QASIMA", txtQasima.getValue());

                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    sap.m.MessageToast.show("Successfully Saved new BRANCH, refresh list ");
                    dlg.close();
                }

            }
            var fe = [
                Util.getLabelTxt("txtCust", "15%", ""), txtCustName,
                Util.getLabelTxt("txtBranch", "15%"), txtBrNo,
                Util.getLabelTxt("", "1%", "@"), txtbname,
                Util.getLabelTxt("txtName2", "41%", ""), txtbName2,
                Util.getLabelTxt("Area", "15%", ""), txtArea,
                Util.getLabelTxt("Block", "17%", "@"), txtBlock,
                Util.getLabelTxt("Street", "17%", "@"), txtStreet,
                Util.getLabelTxt("Jedda", "15%", ""), txtJedda,
                Util.getLabelTxt("Qasima", "17%", "@"), txtQasima,
                Util.getLabelTxt("Tel", "17%", "@"), txtTel,

            ];

            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                width: { "S": 280, "M": 380, "L": 520 },
                cssText: [
                    "padding-left:5px ;" +
                    "padding-top:3px;" +
                    "border-style: groosve;" +
                    "margin-left: 1%;" +
                    "margin-right: 1%;" +
                    "border-radius:20px;" +
                    "margin-top: 3px;"
                ]
            }, "sapUiSizeCompact", "");

            cnt.addContent(new sap.m.VBox({ height: "40px" }));
            vb.addItem(cnt);
            Util.navEnter(fe);
            var dlg = new sap.m.Dialog({
                title: Util.getLangText("newBranch"),
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 550 }) + "px",
                contentHeight: "200px",
                content: [vb],
                modal: true,
                buttons: [
                    btAp,
                    new sap.m.Button({
                        text: Util.getLangText("closeTxt"),
                        press: function () {
                            dlg.close();
                        }
                    })
                ]
            }).addStyleClass("sapUiSizeCompact");;
            dlg.open();
        },
        addInContract: function () {
            var thatForm = this.thatForm;
            var vb = new sap.m.VBox();
            var sett = sap.ui.getCore().getModel("settings").getData();
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var nam = thatForm.frm.getFieldValue("qry1.ord_refnm");
            var brno = thatForm.frm.getFieldValue("qry1.ord_discamt");
            var brnam = thatForm.frm.getFieldValue("qry1.branchname");
            var lastDate = undefined;
            var lastPrice = 0;

            var todt = thatForm.frm.getFieldValue("qry1.ord_date");
            if (Util.nvl(cod, '') == "")
                FormView.err("Err !, No CUSTOMER is assigned !");

            if (Util.nvl(brno, '') == "")
                FormView.err("Err !, No BRANCH is assigned !");

            var btAp = new sap.m.Button({
                text: Util.getLangText("saveRec"),
                enabled: false,
                press: function () {
                    saveData();
                }
            });
            var getPrevData = function () {
                var pcust = txtCustCode.getText();
                var pitem = txtItem.getValue();
                var pbranch = txtBrNo.getText();
                lastPrice = 0
                lastDate = undefined;
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                var sq = "select max(startdate) from c_contract_items " +
                    " where refer=':pitem' and cust_code=':pcust' and branch_no=:pbranch ";
                sq = sq.replaceAll(":pitem", pitem)
                    .replaceAll(":pcust", pcust)
                    .replaceAll(":pbranch", pbranch);

                var dtx = Util.getSQLValue(sq);
                if (Util.nvl(dtx, '') != '') {
                    lastDate = new Date(dtx.replaceAll(".", ":"));
                    var sq2 = "select price from c_contract_items " +
                        " where refer=':pitem' and cust_code=':pcust' and branch_no=:pbranch and startdate=:stdt";

                    sq2 = sq2.replaceAll(":pitem", pitem)
                        .replaceAll(":pcust", pcust)
                        .replaceAll(":pbranch", pbranch)
                        .replaceAll(":stdt", Util.toOraDateString(lastDate));

                    lastPrice = Util.nvl(Util.getSQLValue(sq2), 0);
                    lblLastFrom.setText("Last date : " + sdf.format(lastDate));
                    lblOldPrice.setText("Last Price : " + lastPrice);
                }

            };

            var enableDisableSave = function () {
                var ed = false;
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                if (txtStartDate.getValue() != "" && txtItem.getValue() != "" && parseFloat(txtNewPrice.getValue()) > 0) ed = true;
                if (lastDate != undefined && sdf.format(lastDate) == sdf.format(txtStartDate.getDateValue())) ed = false;

                btAp.setEnabled(ed);
            }
            var txtStartDate = new sap.m.DatePicker({
                textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: true,
                dateValue: todt,
                valueFormat: sett["ENGLISH_DATE_FORMAT"],
                displayFormat: sett["ENGLISH_DATE_FORMAT"],
                change: function (e) {
                    enableDisableSave();
                }
            });

            var txtCustCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtCustName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");
            var txtBrNo = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtBName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");

            var lblLastFrom = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "39%" });
            var txtItem = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: true,
                showValueHelp: true,
                valueHelpRequest: function (e) {
                    var locval = txtItem.getValue();
                    UtilGen.Search.do_quick_search(e, this,
                        "select reference code,descr title from items order by descr2 ",
                        "select reference code,descr title from items  where reference=:CODE", txtItemName, undefined,
                        {
                            pWidth: "300px", pHeight: "400px",
                            "background-color": 'blue',
                            "dialogStyle": "cyanDialog"
                        });
                }

            });
            var txtItemName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "39%", editable: true });
            var txtNewPrice = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: true });
            var lblOldPrice = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "39%" });

            // txtStartDate.attachLiveChange(enableDisableSave);
            txtItem.attachLiveChange(enableDisableSave);
            txtNewPrice.attachLiveChange(enableDisableSave);

            txtNewPrice.setValue("0");
            txtCustCode.setText(cod);
            txtCustName.setText(cod + " / " + nam);
            txtBrNo.setText(brno);
            txtBName.setText(brno + " / " + brnam);


            var checkItemExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(descr),'') from items where reference='" + txtItem.getValue() + "' and  flag=1 and childcounts=0");
                if (msg && Util.nvl(exis, '').trim() == '')
                    FormView.err("Item is not valid ! " + exis);
                txtItemName.setValue(exis);
                return (msg ? true : msg);
            };


            txtItem.attachChange(function () {
                checkItemExist(true);
                getPrevData();
            });

            var saveData = function () {

                checkItemExist(true);
                getPrevData();
                var sq1 = "declare pcust varchar2(100):=':pcust' ; " +
                    " pbr  number:=':pbranch' ; " +
                    " pord_date date:=:ord_date ; " +
                    " pitem varchar2(255):=':pitem' ; " +
                    " pprice number:=:pprice  ; ";
                sq1 = sq1.replaceAll(":pcust", txtCustCode.getText())
                    .replaceAll(":pbranch", txtBrNo.getText())
                    .replaceAll(":ord_date", Util.toOraDateString(txtStartDate.getDateValue()))
                    .replaceAll(":pprice", txtNewPrice.getValue())
                    .replaceAll(":pitem", txtItem.getValue());

                var sq = sq1 + " pbr_name varchar2(500);" +
                    " tmp number;" +
                    " kf number;" +
                    " cno number;" +
                    " refadr varchar2(500);" +
                    " ptel varchar2(100);" +
                    " psl number;" +
                    " lastkf number;" +
                    " ldt date;" +
                    " itdescr varchar2(500);" +
                    " itpackd varchar2(100);" +
                    " itunitd varchar2(100);" +
                    " itpack number;" +
                    " begin" +
                    " select max(keyfld) into kf from c_contract where cust_code=pcust and branch_no=pbr;" +
                    " select area,tel,b_name into refadr,ptel,pbr_name from cbranch where brno=pbr and code=pcust;" +
                    " select nvl(salesp,(select max(no) from salesp where type='S')) into psl from c_ycust where code=pcust;" +
                    " select descr,packd,unitd,pack into itdescr,itpackd, itunitd,itpack from items where reference=pitem and flag=1 and childcounts=0;" +
                    " " +
                    " if kf is  null then" +
                    "  select nvl(max(no),0)+1,nvl(max(keyfld),0)+1  into cno,kf from c_contract;" +
                    "  insert into c_contract( KEYFLD, NO, CONTRACT_TYPE, CONTRACT_DATE, CUST_CODE, REF_TITLE, " +
                    "              REF_ADDRESS, REF_ID, TEL, FAX, PROJECT_NAME, REMARKS, END_PRICE_DATE, FLAG, " +
                    "              PROJECT_ADDRESS, REF_NAME, BRANCH_NO, PAYTERM, PROJECT_NO, SALESP, DISCP, COLLECTORS)" +
                    "              values" +
                    "              (kf,cno,1,pord_date,pcust,'.'," +
                    "              refadr, null,ptel,'',pbr_name,'',null,1," +
                    "              refadr,',',pbr,null,pbr,psl,0,null); " +
                    " end if;" +
                    " " +
                    " SELECT NVL(MAX(STARTDATE),TO_DATE('31/12/2099','DD/MM/YYYY')) INTO LDT FROM C_CUSTITEMS WHERE STARTDATE<pord_date AND KEYFLD=kf AND REFER=pitem;" +
                    " " +
                    " UPDATE C_CUSTITEMS" +
                    "  SET ENDDATE=pord_date-1" +
                    "  WHERE KEYFLD=kf AND STARTDATE=LDT AND REFER=pitem;" +
                    " " +
                    " " +
                    " insert into c_custitems( KEYFLD, STARTDATE, REFER, PRICE, DESCR, PACKD, UNITD," +
                    "             PACK, ENDDATE, FLAG, UPDATE_TIME, DISC_AMT, PRE_PRICE, PRE_DISC_AMT)" +
                    "             values " +
                    "             (kf,pord_date,pitem,pprice,itdescr,itpackd,itunitd," +
                    "             itpack,TO_DATE('31/12/2099','DD/MM/YYYY'),2,sysdate,0,pprice,0);" +
                    " end;";

                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    sap.m.MessageToast.show("Successfully Added new Contract Item, refresh list ");
                    dlg.close();
                }

            }
            var fe = [
                Util.getLabelTxt("txtCust", "25%", ""), txtCustName,
                Util.getLabelTxt("txtBranch", "25%", ""), txtBName,
                Util.getLabelTxt("txtStartDate", "25%"), txtStartDate,
                Util.getLabelTxt("", "1%", "@"), lblLastFrom,
                Util.getLabelTxt("itemTxt", "25%"), txtItem,
                Util.getLabelTxt("", "1%", "@"), txtItemName,
                Util.getLabelTxt("txtNewPrice", "25%", ""), txtNewPrice,
                Util.getLabelTxt("Area", "1%", "@"), lblOldPrice,
            ];

            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                width: { "S": 280, "M": 380, "L": 480 },
                cssText: [
                    "padding-left:5px ;" +
                    "padding-top:3px;" +
                    "border-style: groosve;" +
                    "margin-left: 1%;" +
                    "margin-right: 1%;" +
                    "border-radius:20px;" +
                    "margin-top: 3px;"
                ]
            }, "sapUiSizeCompact", "");
            cnt.addContent(new sap.m.VBox({ height: "40px" }));
            vb.addItem(cnt);
            Util.navEnter(fe);
            var dlg = new sap.m.Dialog({
                title: Util.getLangText("addContractItem"),
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 520 }) + "px",
                contentHeight: "200px",
                content: [vb],
                modal: true,
                buttons: [
                    btAp,
                    new sap.m.Button({
                        text: Util.getLangText("closeTxt"),
                        press: function () {
                            dlg.close();
                        }
                    })
                ]
            }).addStyleClass("sapUiSizeCompact");;
            dlg.open();
        },
        generateInvoice: function (obj) {
            var thatForm = this.thatForm;
            var sdf = new simpleDateFormat("MM/dd/yyyy");
            if (thatForm.frm.objs['qry1'].status == FormView.RecordStatus.EDIT ||
                thatForm.frm.objs['qry1'].status == FormView.RecordStatus.NEW)
                thatForm.frm.save_data();
            if (thatForm.frm.objs['qry1'].status == FormView.RecordStatus.VIEW) {
                var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
                var nam = thatForm.frm.getFieldValue("qry1.ord_refnm");
                var brno = thatForm.frm.getFieldValue("qry1.ord_discamt");
                var brnam = thatForm.frm.getFieldValue("qry1.branchname");
                var ordno = thatForm.frm.getFieldValue("qry1.ord_no");
                var fromdate = sdf.format(thatForm.frm.getFieldValue("qry1.ord_date"));
                var str = "bin.forms.br.kha.forms.wzd formType=dialog formSize=900px,430px formTitle=Sales_Wizard pcust=:pcust fromdate=:fromdate todate=:todate ordno=:ordno";
                str = str.replaceAll(":pcust", cod)
                    .replaceAll(":fromdate", fromdate)
                    .replaceAll(":todate", fromdate)
                    .replaceAll(":ordno", ordno);
                UtilGen.execCmd(str, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            }


            // "bin.forms.br.forms.wzd formType=dialog formSize=900px,430px formTitle=Sales_Wizard pcust=0002 fromdate=01/03/2023 todate=12/31/2023 ordno=8112"
        },
        enterQuckEntry: function () {
            var thatForm = this.thatForm;
            var itmCount = 0;
            var qv = thatForm.frm.objs["qry2"].obj;
            var ld = qv.mLctb;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                FormView.err("Form is not in NEW Record Mode ");

            for (var i = 0; i < ld.rows.length; i++)
                if (Util.nvl(ld.getFieldValue(i, "ORD_SHIP"), "").trim() != "")
                    itmCount++;

            if (itmCount > 0)
                FormView.err("Item details have been entered !");

            var btns = [];
            var afterCustSel = function () {
                var cn = qv.getControl().getRows()[0].getCells()[1];
                cn.focus();
                cn.fireValueHelpRequest({ fromSuggestions: true });
            };
            if (thatForm.frm.objs["qry1.ord_type"].obj.getValue() == "") {
                thatForm.frm.objs["qry1.ord_type"].obj.setValue("1");
                thatForm.frm.objs["qry1.ord_type"].obj.fireChange();
            }
            var afterDriverSel = function (e) {
                var sq = "SELECT C_YCUST.CODE,C_YCUST.NAME,BRNO,B_NAME FROM C_YCUST ,CBRANCH WHERE C_YCUST.CODE=CBRANCH.CODE  " +
                    " ORDER BY C_YCUST.CODE,CBRANCH.BRNO ";
                Util.show_list(sq, ["CODE", "NAME", "BRNO", "B_NAME"], "", function (data) {
                    thatForm.frm.objs["qry1.ord_ref"].obj.setValue(data.CODE);
                    thatForm.frm.objs["qry1.ord_ref"].obj.fireChange();
                    thatForm.frm.objs["qry1.ord_discamt"].obj.setValue(data.BRNO);
                    thatForm.frm.objs["qry1.ord_discamt"].obj.fireChange();
                    afterCustSel();
                    return true;
                }, "100%", "100%", undefined, false);
            };
            var drv = thatForm.frm.getFieldValue("qry1.ord_empno");

            if (Util.nvl(drv, "") == "") {
                UtilGen.Search.do_quick_search(undefined, thatForm.frm.objs["qry1.ord_empno"].obj,
                    "select no code,name title from salesp  order by no ",
                    "select no code,name title from salesp where NO=:CODE", thatForm.frm.objs["qry1.txt_empname"].obj, afterDriverSel, undefined, btns);
            } else afterDriverSel();



        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));

                var on = qry.formview.getFieldValue("qry1.ord_no");
                var findno = 0;
                if (Util.nvl(on, "") != "")
                    findno = Util.getSQLValue("select nvl(max(ord_no),'') from order1 where ord_no=" + on + " and ord_code=" + thatForm.vars.vou_code);
                if (Util.nvl(findno, '') != '') {
                    var no = Util.getSQLValue("select nvl(max(ord_no),0)+1 from order1 where ord_code=" + thatForm.vars.vou_code);
                    qry.formview.setFieldValue("qry1.ord_no", no, no, true);
                }
            }




            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Customer is invalid !");
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) FormView.err("Save Denied : Parent customer not allowed !");

            //branch
            var brno = thatForm.frm.getFieldValue("qry1.ord_discamt");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from cbranch where code='" + cod + "' and brno=" + brno);
            if (sqcnt == 0) FormView.err("Save Denied : Branch no is invalid !");

            // driver
            var driv = thatForm.frm.getFieldValue("qry1.ord_empno");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from salesp where no='" + driv + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Driver no is invalid !");

            // location
            var loc = thatForm.frm.getFieldValue("qry1.location_code");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from locations where code='" + loc + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Location no is invalid !");


            // store
            var str = thatForm.frm.getFieldValue("qry1.stra");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from store where no='" + str + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Store no is invalid !");


            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                var rfr = ld.getFieldValue(i, "ORD_SHIP");
                var qty = ld.getFieldValue(i, "ORD_PKQTY");
                var pr = ld.getFieldValue(i, "SALE_PRICE");
                if (dup[rfr] != undefined)
                    FormView.err("Save Denied : Duplicate item entry # " + rfr);
                dup[rfr] = rfr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    FormView.err("Save Denied : Item " + rfr + " is a group item !");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                if (cnt == 0)
                    FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0)
                    FormView.err("Save Denied: PRICE invalid value !");
                if (qty <= 0)
                    FormView.err("Save Denied: QTY invalid value !");
            }

        }
        ,
        fetchItem: function () {
            var rfrFld = "ord_no";
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                return;
            setTimeout(function () {
                var rfr = thatForm.frm.getFieldValue("qry1." + rfrFld);
                var loc = thatForm.frm.getFieldValue("qry1.location_code");
                var qr = Util.execSQLWithData("select keyfld,ord_refnm from order1 where ORD_CODE=9 AND " + rfrFld + "='" + rfr + "'");
                if (Util.nvl(qr, "") == "" || qr.length == 0)
                    return;
                var rfrx = qr[0].KEYFLD;
                var desx = qr[0].ORD_DESCR;
                if (qr.length == 1)
                    Util.simpleConfirmDialog("Delivery existed for client :" + desx + " fetch data ?", function (oAction) {
                        thatForm.frm.setFieldValue('pac', rfrx);
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);

                    }, undefined, undefined, "OK");
                else
                    UtilGen.Search.do_quick_search_simple("select O.location_code,L.NAME,it.DESCR typedescr, o.ord_no,o.ord_ref,o.ord_refnm, o.keyfld from order1 o,locations l,invoicetype it where o.ord_code=9 and it.location_code=o.location_code and l.code=o.location_code and it.no=o.ord_type and o." + rfrFld + " = '" + rfr + "' order by o.location_code,o.ord_no ",
                        ["ORD_NO", "ORD_REFNM", "AREA"], function (data) {
                            var bn = data.KEYFLD;
                            thatForm.frm.setFieldValue('pac', bn);
                            thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                            thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                        });

            });
        }
    }
    ,

    loadData: function () {
        var frag = this;
        frag.frm.readonly = Util.nvl(frag.oController.readonly, false);
        if (Util.nvl(frag.oController.keyfld, "") != "") {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld, ""));
            frag.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
            frag.frm.loadData(undefined, FormView.RecordStatus.VIEW);
            UtilGen.Vouchers.formLoadData(this);
        } else {
            UtilGen.Vouchers.formLoadData(this);
        }

    }
    ,
    validateSave: function () {

        return true;
    }
    ,
    getLogDlvCustAboveCredit: function (grpname) {
        var frag = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var frm = frag.frm;
        var cust = frm.getFieldValue("ord_ref");
        var insq = "";
        var inslog = false;
        var cl = 0;

        var getSq = function () {
            var sqx = "c7_insert_log_proc(':GRPNAME'," +
                "':USERNAME',':TABLENAME',':REC_STAT',':GRPNAME'||' # '||:JVNO||' :REC_STAT '" +
                ",:KEYFLD,':PVAR2',:JVNO,':PVAR4',':PVAR5',':NOTIFY_TYPE'); ";
            sqx = sqx.replaceAll(":REC_STAT", stat)
                .replaceAll(":USERNAME", sett["LOGON_USER"])
                .replaceAll(":GRPNAME", Util.nvl(grpname, "JV"))
                .replaceAll(":JVNO", vono)
                .replaceAll(":KEYFLD", kfld)
                .replaceAll(":PVAR2", pv2)
                .replaceAll(":PVAR4", pv4)
                .replaceAll(":PVAR5", pv5)
                .replaceAll(":TABLENAME", Util.nvl(tablename, "ACVOUCHER1"))
                .replaceAll(":NOTIFY_TYPE", Util.nvl(notifyType, ""));
            return sqx;
        }
        var chkAboveCl = function () {
            if (Util.nvl(sett["DLV_CUST_ABOVE_CREDIT_NOTIFY"], "false") != "TRUE")
                return false;
            cl = Util.getSQLValue("select nvl(crd_limit,0) from c_ycust where code='" + cust + "'");
            if (cl == 0) return false;
            var totamt = frm.getFieldValue("totamt");
            var bal = Util.getSQLValue("select c7_get_cb('" + vono + "' , 'Y','Y') from dual");
        }

        var stat = frm.objs["qry1"].status != FormView.RecordStatus.EDIT ?
            "INSERTED" : "UPDATED";

        stat = Util.nvl(pNotify, stat);
        var notifyType = grpname + "_" + stat;

        var kfld = frm.getFieldValue("qry1.keyfld");
        var pv5 = "";
        var pv4 = "";
        var pv2 = "";
        insq = getSq();

    },
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

});



