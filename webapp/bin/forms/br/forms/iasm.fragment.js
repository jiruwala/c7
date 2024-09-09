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
        thatForm.iss_kf = undefined;
        var dmlSq = "select p2.*,i.descr descrx,(p2.price/p2.pack)*p2.allqty amount from pur2 p2,items i " +
            " where p2.type=1 and i.reference=p2.refer and p2.keyfld=:keyfld order by itempos";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("iAsmTit"),
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
                        dml: "select *from pur1 where invoice_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld'],
                        insert_exclude_fields: [],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "INVOICE_CODE": thatForm.vars.vou_code,
                            "TYPE": 1,
                            "YEAR": "2003",
                            "CREATDT": "SYSDATE",
                            "USERNAME": Util.quoted(sett["LOGON_USER"]),
                            "FLAG": 2,

                        },
                        update_default_values: {
                        },
                        table_name: "PUR1",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.IASM1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 4, "M": 6, "L": 8, "XL": 12, "XXL": 18 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from pur2 where keyfld=':keyfld' and type=1;",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCRX', 'AMOUNT'],
                        insert_exclude_fields: ['DESCRX', 'AMOUNT'],
                        insert_default_values: {
                            "PERIODCODE": sett["CURRENT_PERIOD"],
                            "LOCATION_CODE": ":qry1.location_code",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": ":qry1.strb",
                            "TYPE": 1,
                            "YEAR": "2003",
                            "CREATDT": "SYSDATE",
                            "INVOICE_NO": ":qry1.invoice_no",
                            "KEYFLD": ":qry1.keyfld",
                            "INVOICE_CODE": thatForm.vars.vou_code,
                            "DAT": ":qry1.invoice_date",
                            "FLAG": 2


                        },
                        update_default_values: {
                        },
                        table_name: "pur2",
                        before_add_table: function (scrollObjs, qrj) {
                            UtilGen.createDefaultToolbar1(qrj, ["REFER", "DESCR"], true);
                            scrollObjs.push(qrj.showToolbar.toolbar);
                            qrj.eventKey = function (key, rowno, colno, firstVis) {
                                var totalRows = qrj.getControl().getModel().getData().length;
                                var visRows = qrj.getControl().getVisibleRowCount();
                                var cl = UtilGen.getTableColNo(qrj.getControl(), "REFER");
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
                            thatForm.frm.objs["qry2"].obj.eventCalc(thatForm.frm.objs["qry2"].obj, undefined, undefined, true);
                            return true;
                        },
                        eventCalc: function (qv, cx, rowno, reAmt) {
                            var sett = sap.ui.getCore().getModel("settings").getData();
                            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                            if (reAmt)
                                qv.updateDataToTable();

                            var ld = qv.mLctb;
                            var sumAmt = 0;

                            for (var i = 0; i < ld.rows.length; i++) {
                                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                                var pk = Util.extractNumber(ld.getFieldValue(i, "PACK"));
                                var allqty = (Util.extractNumber(ld.getFieldValue(i, "PKQTY")) * pk) + Util.extractNumber(ld.getFieldValue(i, "QTY"));
                                var amt = (pr / pk) * allqty;
                                if (reAmt)
                                    ld.setFieldValue(i, "AMOUNT", amt)

                                sumAmt += amt;
                            }
                            if (reAmt)
                                qv.updateDataToControl();

                            thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
                            if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                                thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("Amount : " + df.format(sumAmt));

                        },
                        summary: thatForm.helperFunc.getSummary()

                    }
                ],
                canvas: [
                    {
                        name: "default_canvas",
                        objType: FormView.ObjTypes.CANVAS,
                        after_add_canvas: function (cont) {
                            Util.destroyID(thatForm.view.createId("cmdAddDate_" + thatForm.timeInLong), thatForm.view);
                            Util.destroyID(thatForm.view.createId("cmdDelDate_" + thatForm.timeInLong), thatForm.view);
                            cont.addContent(new sap.m.Button(thatForm.view.createId("cmdAddDate_" + thatForm.timeInLong),
                                {
                                    text: "Raw Materials",
                                    press: function () {
                                        thatForm.showRawMat();
                                    }
                                }));
                            // cont.addContent(new sap.m.Button(thatForm.view.createId("cmdDelDate_" + thatForm.timeInLong),
                            //     {
                            //         text: "Delete date",
                            //         press: function () {
                            //             thatForm.helperFunc.deleteDate();
                            //         }
                            //     }));
                            thatForm.cont = cont;
                        }
                    }
                ],
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
                    thatForm.fetchRM = false;
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    if (qry.name == "qry1") {
                        var kf = qry.formview.getFieldValue("keyfld")
                        thatForm.iss_kf = Util.nvl(Util.getSQLValue("select max(keyfld) from invoice1 where invoice_keyfld='" + kf + "' and invoice_code=25 and type=27"), undefined);

                        var saleinv = Util.getSQLValue("select ord_no from c_order1 where ord_code=9 and jobno=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = saleinv;
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("Assembly is POSTED ,Order No # " + invno);
                        }

                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("REFER").beforeSearchEvent = function (sq, ctx, model) {
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
                    thatForm.updateCostToItems();
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        thatForm.iss_kf = undefined;
                        thatForm.fetchRM = false;
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var objstra = thatForm.frm.objs["qry1.stra"].obj;
                        var objstrb = thatForm.frm.objs["qry1.strb"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pur1");
                        var dt = thatForm.view.today_date.getDateValue();


                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objstra, sett["DEFAULT_STORE"], sett["DEFAULT_STORES"], true);
                        UtilGen.setControlValue(objstrb, sett["DEFAULT_STORE"], sett["DEFAULT_STORES"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        qry.formview.setFieldValue("qry1.chg_no", 1, 1, true);
                        qry.formview.setFieldValue("qry1.startdt", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        qry.formview.setFieldValue("qry1.duedate", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        qry.formview.setFieldValue("qry1.invoice_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();
                        thatForm.updateCostToItems();

                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var dt = Util.execSQL("select ord_no from c_order1 where ord_code=9 and jobno=" + kf);
                    if (dt.ret == "SUCCESS") {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        if (dtx.length > 0 && dtx[0].ORD_NO != undefined) {
                            // frm.setFormReadOnly();
                            FormView.err("This Item Assembly is posted by Deliver Note # " + dtx[0].ORD_NO);
                        }
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {

                    var delAdd = "";
                    if (qry.name == "qry1") {
                        var kf = qry.formview.getFieldValue("keyfld")
                        delAdd += "delete from pur2 where type=2 and keyfld=:qry1.keyfld ; ";
                        delAdd += "x_post_job_voucher(:qry1.keyfld,'N','Y'); ";                        
                        var dt = Util.execSQL("select ord_no from c_order1 where ord_code=9 and jobno=" + kf);
                        if (dt.ret == "SUCCESS") {
                            var dtx = JSON.parse("{" + dt.data + "}").data;
                            if (dtx.length > 0 && dtx[0].ORD_NO != undefined) {
                                // frm.setFormReadOnly();
                                FormView.err("This Item Assembly is posted by Deliver Note # " + dtx[0].ORD_NO);
                            }
                        }
                    }

                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();
                    return delAdd;
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
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var sql = sq + " update pur2 set pkcost=price/pack,allqty=(pkqty*pack)+qty, qtyin=(pkqty*pack)+qty,qtyout=0 where type=1 and invoice_code=" +
                        thatForm.vars.vou_code + " and keyfld=" + kf + "; X_Post_job_voucher(" + kf + "); ";
                    return sql;
                },
                addSqlAfterInsert: function (qry, rn) {
                    if (qry.name == "qry1") {
                        var sq2 = "";
                        if (thatForm.fetchRM && thatForm.qc != undefined && thatForm.qc.mLctb.rows.length > 0)
                            sq2 = Util.nvl(thatForm.doUpdateRawMat(), sq2);
                        else
                            FormView.err("Must require raw materials.")
                        sq2 = thatForm.frm.parseString(sq2);
                        return sq2;
                    }

                    return "";
                },
                addSqlAfterUpdate: function (qry, rn) {
                    if (qry.name == "qry1") {
                        var sq2 = "";
                        if (thatForm.fetchRM && thatForm.qc != undefined && thatForm.qc.mLctb.rows.length > 0)
                            sq2 = Util.nvl(thatForm.doUpdateRawMat(), sq2);
                        else
                            FormView.err("Must require raw materials.")

                        sq2 = thatForm.frm.parseString(sq2);
                        return sq2;
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
                    class_name: FormView.ClassTypes.LABEL,
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
                location_code: {
                    colname: "location_code",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"locationTxt\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "25%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            vl = UtilGen.getControlValue(this);
                            var objOrd = thatForm.frm.objs["qry1.invoice_no"].obj;
                            UtilGen.setControlValue(objOrd, "", "", true);
                            if (vl != "") {
                                var nwOn = Util.getSQLValue("select nvl(max(invoice_no),0)+1 from pur1 " +
                                    " where  invoice_code=" + thatForm.vars.vou_code + " and location_code=" + Util.quoted(vl));
                                UtilGen.setControlValue(objOrd, nwOn, nwOn);
                            }
                        },
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "select code,name  from locations order by code"
                },
                invoice_no: {
                    colname: "invoice_no",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtJobNo\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "25%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                chg_no: {
                    colname: "chg_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"txtJOType\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
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
                    list: "@1/Factorial Process,2/Transform Goods"
                },
                invoice_date: {
                    colname: "invoice_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"txtInvDate\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },
                startdt: {
                    colname: "startdt",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"startDate\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },
                duedate: {
                    colname: "duedate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"dueDate\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "25%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },
                memo: {
                    colname: "memo",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"memoTxt\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "80%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                stra: {
                    colname: "stra",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"rawMaterialStore\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
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
                strb: {
                    colname: "strb",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"finishedProdStore\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
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
                // bkno: {
                //     colname: "bkno",
                //     data_type: FormView.DataType.Number,
                //     class_name: FormView.ClassTypes.TEXTFIELD,
                //     title: '{\"text\":\"issKeyid\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                //     title2: "",
                //     canvas: "default_canvas",
                //     display_width: codSpan,
                //     display_align: "ALIGN_CENTER",
                //     display_style: "",
                //     display_format: "",
                //     other_settings: { editable: false, width: "25%" },
                //     edit_allowed: false,
                //     insert_allowed: false,
                //     require: false
                // },
                // jvno: {
                //     colname: "jvno",
                //     data_type: FormView.DataType.Number,
                //     class_name: FormView.ClassTypes.TEXTFIELD,
                //     title: '@{\"text\":\"RcptKeyid\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                //     title2: "",
                //     canvas: "default_canvas",
                //     display_width: codSpan,
                //     display_align: "ALIGN_CENTER",
                //     display_style: "",
                //     display_format: "",
                //     other_settings: { editable: false, width: "25%" },
                //     edit_allowed: false,
                //     insert_allowed: false,
                //     require: false
                // },
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
                            colname: "INVOICE_NO",
                        },
                        {
                            colname: "MEMO",
                        },
                        {
                            colname: "INVOICE_DATE"
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select invoice_no,invoice_date,memo,keyfld from pur1 where invoice_code=27 order by invoice_date desc,invoice_no",
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
                        var saleinv = Util.getSQLValue("select ord_no from c_order1 where ord_code=9 and jobno=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = saleinv;
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("Assembly is POSTED ,Order No # " + invno);
                            return false;
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
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pur1");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));

                var on = qry.formview.getFieldValue("qry1.invoice_no");
                var findno = 0;
                if (Util.nvl(on, "") != "")
                    findno = Util.getSQLValue("select nvl(max(invoice_no),'') from pur1 where invoice_no=" + on + " and invoice_code=" + thatForm.vars.vou_code);
                if (Util.nvl(findno, '') != '') {
                    var no = Util.getSQLValue("select nvl(max(invoice_no),0)+1 from pur1 where invoice_code=" + thatForm.vars.vou_code);
                    qry.formview.setFieldValue("qry1.invoice_no", no, no, true);
                }
            }



            // locations
            var loc = thatForm.frm.getFieldValue("qry1.location_code");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from locations where code='" + loc + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Location no is invalid !");

            //store
            var str = thatForm.frm.getFieldValue("qry1.stra");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from store where no='" + str + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Store no is invalid !");

            //storeb
            var str = thatForm.frm.getFieldValue("qry1.strb");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from store where no='" + str + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Store no is invalid !");



            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                var rfr = ld.getFieldValue(i, "REFER");
                var pkqty = ld.getFieldValue(i, "PKQTY");
                var qty = ld.getFieldValue(i, "QTY");
                var pr = ld.getFieldValue(i, "PRICE");
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
                if (qty < 0 || pkqty < 0)
                    FormView.err("Save Denied: QTY invalid value !");
                if (qty == 0 && pkqty == 0)
                    FormView.err("Save Denied: QTY can be zero !");
            }

        },

    }
    ,
    showRawMat: function () {
        var that2 = this;
        if (this.qc == undefined) {
            this.qc = new QueryView("qrCustitems" + that2.timeInLong);
            this.qc.getControl().setEditable(true);
            this.qc.getControl().view = that2.view;
            this.qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
            this.qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
            this.qc.getControl().setFixedBottomRowCount(0);
            this.qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
            UtilGen.createDefaultToolbar1(this.qc, ["REFER", "DESCR"], true);
            this.qc.insertable = true;
            this.qc.deletable = true;
        }
        if (that2.fetchRM == false)
            that2.qc.reset();
        var cc = "";
        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            cc = that2.frm.getFieldValue("qry1.keyfld");
        }
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
        var eventCalc = function (qv, cx, rowno, reAmt) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

            if (reAmt)
                qv.updateDataToTable();

            var ld = qv.mLctb;
            var sumAmt = 0;

            for (var i = 0; i < ld.rows.length; i++) {
                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
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
        var fetchFormula = function () {
            var that = this;
            var totqt = 0;
            if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
                FormView.err("Must Form EDIT or NEW mode to edit and add items ! ");
            var ld2 = that2.frm.objs["qry2"].obj.mLctb;
            that2.frm.objs["qry2"].obj.updateDataToTable();
            var pitm = {};
            for (var i = 0; i < ld2.rows.length; i++) {
                var qt = Util.nvl(ld2.getFieldValue(i, "PKQTY") * ld2.getFieldValue(i, "PACK")) + ld2.getFieldValue(i, "QTY")
                var rfr = ld2.getFieldValue(i, "REFER");
                totqt += qt;
                if (pitm[rfr] != undefined)
                    FormView.err("Finished product # " + rfr + " duplicated !");
                pitm[rfr] = qt;
            }
            if (totqt <= 0)
                FormView.err("Must 'Finished Products' have assigned QTY > 0 !");
            that2.qc.updateDataToTable();
            var ld = that2.qc.mLctb;
            for (var i = ld.rows.length - 1; i >= 0; i--)
                ld.deleteRow(i);
            that2.qc.updateDataToControl();
            var rs = "";
            var kys = Object.keys(pitm);
            var sqp = "insert into temporary(idno,usernm,field1,field2) " +
                " values (-1,'a',':rfr',:qt);";
            var sqps = "";
            for (var k in kys) {
                var rs = (rs.length > 0 ? "," : "") + Util.quoted(kys[k]) + " ";
                sqps += sqp.replaceAll(":rfr", kys[k])
                    .replaceAll(":qt", pitm[kys[k]]);
            }
            var dt = Util.execSQL("begin delete from temporary where idno=-1 and usernm='a';" + sqps + " end;");
            if (dt.ret != "SUCCESS")
                FormView.err("Saving temporary table have err !");
            var sq2 = "select REFER,SUM(ALLQTY* (TO_NUMBER(FIELD2)) )  PQT,PACK from MASTERASM, TEMPORARY " +
                " WHERE IDNO=-1 AND BASEITEM=FIELD1 AND USERNM='a' " +
                " GROUP BY REFER,PACK ";
            var dt2 = Util.execSQLWithData(sq2, "No data found !");
            var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
            for (var d = 0; d < dt2.length; d++) {
                ld.addRow();
                ld.setFieldValue(d, "ITEMPOS", d + 1);
                ld.setFieldValue(d, "REFER", dt2[d].REFER);
                ld.setFieldValue(d, "PKQTY", dt2[d].PQT);
                ld.setFieldValue(d, "QTY", 0);
                var dtxM = Util.execSQLWithData("select descr,packd,unitd,pack,PKAVER,(GET_ITEM_COST(REFERENCE,null," + isskf + " )*PACK) PACK_COST from items where reference='" + dt2[d].REFER + "' ")
                if (dtxM != undefined && dtxM.length <= 0) FormView.err(dt2[d].REFER + " ,Item not found !");
                ld.setFieldValue(d, "DESCR", dtxM[0].DESCR);
                ld.setFieldValue(d, "PACKD", dtxM[0].PACKD);
                ld.setFieldValue(d, "PACK", dtxM[0].PACK);
                ld.setFieldValue(d, "PRICE", dtxM[0].PACK_COST);
            }

            that2.qc.updateDataToControl();
            eventCalc(that2.qc, undefined, undefined, true);
        }
        var fetchData = function () {
            var qv = that2.qc;
            if (that2.fetchRM) {
                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();
                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                });
                return;
            }
            var dmlSq = "select p2.itempos,p2.refer,i.descr,p2.packd,p2.pack,p2.pkqty,p2.qty,p2.price, (p2.price/p2.pack)*p2.allqty amount from pur2 p2,items i " +
                " where p2.type=2 and i.reference=p2.refer and p2.keyfld=:keyfld order by itempos";
            dmlSq = that2.frm.parseString(dmlSq);
            var dt = Util.execSQL(dmlSq);
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 80;

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("ITEMPOS")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].mColClass = "sap.m.Input";

                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].mColClass = "sap.m.Text";
                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mColClass = "sap.m.Text";

                qv.mLctb.cols[qv.mLctb.getColPos("ITEMPOS")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 130;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 220;
                qv.mLctb.cols[qv.mLctb.getColPos("PACK")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].getMUIHelper().display_width = 100;

                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].getMUIHelper().display_width = 120;
                qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_width = 100;


                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_format = "MONEY_FORMAT";

                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].mTitle = "PK QTY";

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
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PRICE', 0);
                    var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
                    var dtxM = Util.execSQLWithData("select descr,packd,unitd,pack,PKAVER,(GET_ITEM_COST(REFERENCE,null," + isskf + " )*PACK) PACK_COST from items where reference='" + newValue + "' ")
                    if (dtxM != undefined && dtxM.length > 0) {

                        oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACKD', dtxM[0].PACKD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACK', dtxM[0].PACK);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PRICE', dtxM[0].PACK_COST);

                    }
                    eventCalc(qv, undefined, 0, true);
                };
                var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mSearchSQL = "select reference code,descr title,ROUND(GET_ITEM_COST(REFERENCE,null," + isskf + ")*PACK,3) PACK_COST from items order by descr2";
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
                    UtilGen.Search.do_quick_search(evtx, input,
                        "select reference code,descr title,ROUND(GET_ITEM_COST(REFERENCE,null," + isskf + ")*PACK,3) PACK_COST from items order by descr2 ",
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

                    var pr = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + '/PRICE'));
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
                that2.fetchRM = true;

                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "PRICE", 0);
                    ld.setFieldValue(idx, "PKQTY", 0);
                    ld.setFieldValue(idx, "QTY", 0);
                    ld.setFieldValue(idx, "ITEMPOS", idx + 1);

                }

                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();

                setTimeout(function () {
                    qv.updateDataToControl();

                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                });
            }
            that2.qc.eventCalc = eventCalc;
            eventCalc(qv, undefined, 0, true);

        }

        var pg = new sap.m.Page({
            showHeader: true,
            content: [],
            showFooter: true
        }).addStyleClass("sapUiSizeCompact");
        var cmdClose = new sap.m.ToggleButton({
            text: Util.getLangText("cmdClose"),
            icon: "sap-icon://decline",
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
                seteditale();
            }

        });
        Util.destroyID("txtRM" + that2.timeInLong, that2.view);
        Util.destroyID("cmdFF" + that2.timeInLong, that2.view);
        var txtSumRM = new sap.m.Text(that2.view.createId("txtRM" + that2.timeInLong), { width: "300px", text: "0" }).addStyleClass("redText boldText");
        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        this.qc.showToolbar.toolbar.addContent(new sap.m.Button(
            that2.view.createId("cmdFF" + that2.timeInLong),
            {
                text: Util.getLangText("cmdFetchFormula"),
                press: function () {
                    fetchFormula();
                }
            }));
        pg.removeAllHeaderContent();
        pg.addHeaderContent(this.qc.showToolbar.toolbar);
        pg.addContent(this.qc.getControl());
        tbHeader.addContent(cmdEdit);
        tbHeader.addContent(cmdClose);
        tbHeader.addContent(new sap.m.ToolbarSpacer());
        tbHeader.addContent(txtSumRM);

        var tit = Util.getLangText("titCustItems");
        if (cc != "")
            tit = Util.getLangText("titCustItems") + " - " + that2.frm.getFieldValue("qry1.name");

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
            that2.updateCostToItems();
            sap.m.MessageToast.show("Closing  Itmes window..");
            that2.frm.objs["qry2"].obj.eventCalc(that2.frm.objs["qry2"].obj, undefined, undefined, true);

        });
        setTimeout(function () {
            eventCalc(that2.qc, undefined, 0, true);
        });
    },
    updateCostToItems: function () {
        var that2 = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
            return;


        if (!that2.fetchRM || that2.qc == undefined || that2.qc.mLctb.rows.length == 0)
            return;

        var ld = that2.qc.mLctb;
        var sumAmt = 0;
        for (var i = 0; i < ld.rows.length; i++)
            sumAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "AMOUNT"), df), 0);
        var ld2 = that2.frm.objs["qry2"].obj.mLctb;
        var totqt = 0;
        that2.frm.objs["qry2"].obj.updateDataToTable();
        var sqItm = "select " +
            " prd_dt,exp_dt , " +
            " packd, unitd, pack " +
            " from items where reference=':XREFER'";

        for (var i = 0; i < ld2.rows.length; i++) {

            // var sqt = sqItm.replaceAll(":XREFER", ld2.getFieldValue(i, "REFER"));
            // var dtx = Util.execSQLWithData(sqt, "No ITEM found .." + ld.getFieldValue(i, "REFER"));

            var pkqty = Util.nvl(Util.extractNumber(ld2.getFieldValue(i, "PKQTY"), df), 0);
            var qty = Util.nvl(Util.extractNumber(ld2.getFieldValue(i, "QTY"), df), 0);
            var pk = Util.nvl(Util.extractNumber(ld2.getFieldValue(i, "PACK"), df), 0);
            var allqty = (pkqty * pk) + qty;
            ld2.setFieldValue(i, "ALLQTY", allqty);
            // ld2.setFieldValue(i, "PRD_DATE", new Date(dtx[0].PRD_DT.replaceAll(".",":")));
            // ld2.setFieldValue(i, "EXP_DATE", new Date(dtx[0].EXP_DT.replaceAll(".",":")));
            totqt += allqty;
        }
        if (totqt <= 0) FormView.err("Total qty 0 for production !");
        for (var i = 0; i < ld2.rows.length; i++) {
            var pk = Util.nvl(Util.extractNumber(ld2.getFieldValue(i, "PACK"), df), 0);
            var cst = (sumAmt / totqt) * pk;
            ld2.setFieldValue(i, "PRICE", cst);
            ld2.setFieldValue(i, "PKCOST", cst / pk);
        }
        that2.frm.objs["qry2"].obj.updateDataToControl();
    },
    doUpdateRawMat: function () {
        var that2 = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

        if (!that2.fetchRM || that2.qc == undefined || that2.qc.mLctb.rows.length == 0)
            FormView.err("No raw materials found !");
        var ld = that2.qc.mLctb;
        var sqls = "";
        var sq2 = UtilGen.getInsertRowStringByObj(
            "PUR2",
            {
                "KEYFLD": ":qry1.keyfld",
                "INVOICE_NO": ":qry1.invoice_no",
                "LOCATION_CODE": "':qry1.location_code'",
                "DAT": ":qry1.invoice_date",
                "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                "INVOICE_CODE": that2.vars.vou_code,
                "TYPE": 2,
                "ITEMPOS": ":XITEMPOS",
                "REFER": "':XREFER'",
                "PRICE": ":XPRICE",
                "PKCOST": ":XPRICE",
                "PACKD": "':XPACKD'",
                "PACK": ":XPACK",
                "UNITD": "':XUNITD'",
                "PKQTY": ":XPKQTY",
                "QTY": ":XQTY",
                "ALLQTY": ":XALLQTY",
                "QTYIN": "0",
                "QTYOUT": ":XALLQTY",
                "PRD_DATE": ":XPRD_DATE",
                "EXP_DATE": ":XEXP_DATE",
                "YEAR": "'2003'",
                "FLAG": "2",
                "CREATDT": "SYSDATE",
                "STRA": ":qry1.stra",
                // "": "",
            });
        // sq2 = that2.frm.parseString(sq2);
        var isskf = that2.iss_kf == undefined ? "null" : that2.iss_kf;
        var sqItm = "select get_item_cost(':XREFER',:qry1.invoice_date ," + isskf + ")*pack cst," +
            " TO_CHAR(prd_dt,'MM/DD/RRRR') PRD_DT,TO_CHAR(exp_dt,'MM/DD/RRRR') EXP_DT , " +
            " packd, unitd, pack " +
            " from items where reference=':XREFER'";
        // sqItm = that2.frm.parseString(sqItm);
        var checkDuplicate = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (Util.nvl(ld.getFieldValue(i, "REFER"), "") == "") {
                that2.showRawMat();
                FormView.err(" REFER MUST ENTER !");
            }
            var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
            if (pr < 0) {
                that2.showRawMat();
                FormView.err(" PRICE IS INVALID !");
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
                .replaceAll(":XPACKD", dtx[0].PACKD)
                .replaceAll(":XUNITD", dtx[0].UNITD)
                .replaceAll(":XPACK", dtx[0].PACK)
                .replaceAll(":XPRICE", dtx[0].CST)
                .replaceAll(":XPKCOST", dtx[0].CST)
                .replaceAll(":XITEMPOS", ld.getFieldValue(i, "ITEMPOS"))
                .replaceAll(":XPKQTY", pkq)
                .replaceAll(":XQTY", q)
                .replaceAll(":XALLQTY", (pkq * dtx[0].PACK) + q)
                .replaceAll(":XPRD_DATE", Util.toOraDateString(new Date(dtx[0].PRD_DT)))
                .replaceAll(":XEXP_DATE", Util.toOraDateString(new Date(dtx[0].EXP_DT)))
            sqls += sq + ";";
        }
        sqls = "delete from pur2 where invoice_code=27 and type=2 and keyfld=':qry1.keyfld';" + sqls;
        return sqls;
    },
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



