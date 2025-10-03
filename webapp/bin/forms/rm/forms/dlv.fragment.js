sap.ui.jsfragment("bin.forms.rm.forms.dlv", {
//copying from mp
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.isDialog = false;
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };
        this.helperFunc.init(this);
        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            vou_code: 9,
            type: 1,
            formname: "rm.forms.dlv"
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
            if (that.frm.isFormEditable() && oEvent.key == 'F2') {
                that.helperFunc.enterQuckEntry();
            }
        });
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
                // width: { "S": 500, "M": 650, "L": 750 },
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("btci" + thatForm.timeInLong, thatForm.view);

                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var cmdQuickEntry = new sap.m.Button(thatForm.view.createId("cmdQE" + thatForm.timeInLong), {
                        text: "Quick Entry [F2]",
                        press: function () {
                            thatForm.helperFunc.enterQuckEntry();
                        }
                    });
                    var btCustItems = new sap.m.Button(thatForm.view.createId("btci" + thatForm.timeInLong), {
                        text: Util.getLangText("rawItems"),
                        press: function () {
                            thatForm.showRawItems();
                        }
                    });

                    var hb = new sap.m.Toolbar({
                        content: [txt, btCustItems, new sap.m.ToolbarSpacer(), cmdQuickEntry, txtMsg]
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
                        dml: "select *from c_order1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'chemname', 'opname', 'salesname', 'drivername', 'empname', 'dispatchname', 'itemname', "lblLv0", "lblLv00", "lblLv", "lblLv2", "lblLv3", "lblLv4", "lblLv5", "tot_today"],
                        insert_exclude_fields: ['branchname', 'chemname', 'opname', 'salesname', 'drivername', 'empname', 'dispatchname', 'itemname', "lblLv", "lblLv0", "lblLv00", "lblLv2", "lblLv3", "lblLv4", "lblLv5", "tot_today"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_FLAG": 1,
                            "ORD_UNITD": "'PCS'",
                            "ORD_PACK": 1,
                            "ORD_POS": 1,
                            "ATTN": "':qry1.branchname'"
                        },
                        update_default_values: {
                            "ATTN": "':qry1.branchname'"
                        },
                        table_name: "C_ORDER1",
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
                        //'branchname', 'chemname', 'opname', 'salesname', 'drivername', 'empname', 'dispatchname', 'itemname'
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        var cust = thatForm.frm.getFieldValue("qry1.ord_ref");
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.drivername"].obj);
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ordered_key"].obj, undefined, that.frm.objs["qry1.empname"].obj);
                        UtilGen.Search.getLOVSearchField("select b_name from cbranch where code='" + cust + "' and brno = :CODE ", qry.formview.objs["qry1.ord_discamt"].obj, undefined, that.frm.objs["qry1.branchname"].obj);
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.op_no"].obj, undefined, that.frm.objs["qry1.opname"].obj);
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.salesp"].obj, undefined, that.frm.objs["qry1.salesname"].obj);
                        UtilGen.Search.getLOVSearchField("select descr from items where reference = ':CODE' ", qry.formview.objs["qry1.ord_ship"].obj, undefined, that.frm.objs["qry1.itemname"].obj);
                        thatForm.helperFunc.setTotToday();
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
                    if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                        var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                        qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                        var objOn = thatForm.frm.getFieldValue("qry1.location_code");
                        var no = Util.extractNumber(thatForm.frm.getFieldValue("qry1.ord_no") + "");
                        var newno = Util.getSQLValue("select nvl(max(ord_no),0) from c_order1 where ord_code=9 and location_code='" + objOn + "' and ord_no=" + no);
                        newno = Util.extractNumber(newno + "");
                        if (newno == no) {
                            Util.simpleConfirmDialog(no + " , existed , generate new no ?", function (oAction) {
                                var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from c_order1 where ord_code=9 and location_code='" + objOn + "'");
                                thatForm.frm.setFieldValue("qry1.ord_no", newno, newno, true);
                                setTimeout(() => { thatForm.frm.objs["qry1.ord_no"].focus(); }, 150);
                                return;
                            });

                        }

                    } else thatForm.helperFunc.beforeSaveValidateQry(qry);
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objSt = thatForm.frm.objs["qry1.stra"].obj;
                        var objStb = thatForm.frm.objs["qry1.strb"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var objno = thatForm.frm.objs["qry1.ord_no"].obj;
                        var objopno = thatForm.frm.objs["qry1.op_no"].obj;
                        var objtm = thatForm.frm.objs["qry1.tmplantleave"].obj;

                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");

                        var dt = thatForm.view.today_date.getDateValue();
                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objSt, sett["DEFAULT_STORE"], sett["DEFAULT_STORE"], true);
                        UtilGen.setControlValue(objStb, sett["DEFAULT_PRODUCT_STORE"], sett["DEFAULT_PRODUCT_STORE"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from c_order1 where ord_code=9 and location_code='" + objOn.getSelectedKey() + "'");
                        UtilGen.setControlValue(objno, newno, newno, true);

                        var opno = Util.getSQLValue("select max(no) from salesp where type='O'");
                        if (Util.nvl(opno, '') != '')
                            UtilGen.setControlValue(objopno, opno, opno, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);

                        var tm = Util.getSQLValue("select sysdate from dual");
                        tm = new Date(tm.replaceAll(".", ":"));
                        objtm.setDateValue(tm);
                        // var dt = Date.now();
                        // qry.formview.setFieldValue("qry1.tmplantleave", tm, tm, true);
                        objOn.fireSelectionChange();

                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var dt = Util.execSQL("select saleinv from c_order1 where keyfld=" + kf);
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
                    var delAdd = "";
                    var delIasm = "";

                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var ordn = thatForm.frm.getFieldValue("qry1.ord_no");
                        var loc = thatForm.frm.getFieldValue("qry1.location_code");

                        delAdd += "delete from order1 where keyfld=:qry1.keyfld ;";
                        var sqLog = UtilGen.getInsertLogStr({
                            grpname: thatForm.vars.formname,
                            tablename: "ORDER1",
                            rec_stat: "DELETE",
                            descr: "DELIVERY NOTE # " + ordn + " LOCATION # " + loc,
                            pvar1: ordn,
                            pvar2: "ORD_CODE=9",
                            pvar3: kf,
                            notify_type: "",
                            advance_data: "Previous Data -> " + thatForm.frm.getRawOriginData("qry1", "queryValues")
                        }, "");
                        delAdd += sqLog + "";


                        var geniasm = Util.nvl(sett["BR_GEN_IASM_ON_DELIVERY"], 'FALSE');
                        delIasm = geniasm == "TRUE" ? "c7_generate_iasm_from_dlv(" + kf + ",'Y');" : "";

                    }
                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();


                    return delIasm + " " + delAdd;
                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    var no = that.frm.getFieldValue("qry1.ord_no");
                    var loc = that.frm.getFieldValue("qry1.location_code");
                    return params + "&_para_plocation=" + loc + "&_para_pfromno=" + no + "&_para_ptono=" + no;
                },
                afterApplyCols: function (qry) {
                    if (qry.name == "qry2") {

                    }
                },
                beforeExeSql: function (frm, sq) {
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    var sq1 = "";
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var ordn = thatForm.frm.getFieldValue("qry1.ord_no");
                    var loc = thatForm.frm.getFieldValue("qry1.location_code");
                    var rfr = thatForm.frm.getFieldValue("qry1.ord_ship");
                    var sq2 = thatForm.frm.parseString("select GET_ITEM_PRICE2(':qry1.ord_ship',':qry1.ord_ref',':qry1.ord_discamt',:qry1.ord_date ) from dual");
                    var pr = Util.getSQLValue(sq2);
                    var dt = Util.execSQLWithData("select packd,unitd,pack from items where reference='" + rfr + "'", "Item # " + rfr + " not a valid !");
                    var sq1 = "update c_order1 set sale_price=:price , ord_packd=':pkd',ord_unitd=':unitd' ,ord_pack=:pack ,tqty=(ord_pkqty* :pack ) where keyfld=:kf and ord_pos=:pos ; "
                        .replaceAll(":pkd", dt[0].PACKD)
                        .replaceAll(":unitd", dt[0].UNITD)
                        .replaceAll(":pack", dt[0].PACK)
                        .replaceAll(":kf", kf)
                        .replaceAll(":pos", 1)
                        .replaceAll(":price", Util.nvl(pr, 0));

                    var sqOr = "";
                    var crdt = Util.getSQLValue("select created_time from order1 where keyfld=" + kf);
                    if (Util.nvl(crdt, undefined) != undefined)
                        crdt = Util.toOraDateTimeString(new Date((crdt + "").replaceAll(".", ":")));
                    var cols = {
                        "keyfld": ":qry1.keyfld",
                        "periodcode": Util.quoted(sett["CURRENT_PERIOD"]),
                        "location_code": "':qry1.location_code'",
                        "stra": ":qry1.stra",
                        "ord_no": ":qry1.ord_no",
                        "ord_code": thatForm.vars.vou_code,
                        "ord_refnm": "':qry1.ord_refnm'",
                        "ord_ref": "':qry1.ord_ref'",
                        "ord_discamt": ":qry1.ord_discamt",
                        "ord_date": ":qry1.ord_date",
                        "ord_ship": "':qry1.ord_ship'",
                        "ord_empno": ":qry1.ord_empno",
                        "remarks": "':qry1.remarks'",
                        "payterm": "':qry1.payterm'",
                        "validatiy": "':qry1.validatiy'",
                        "attn": "':qry1.branchname'",
                        "lcno": "':qry1.typofcem'",
                        "created_time": Util.nvl(crdt, "sysdate"),
                        "modified_time": "sysdate",
                        "usernm": Util.quoted(sett["LOGON_USER"]),
                        "ord_amt": "0",
                    }
                    sqOr = "delete from order1 where ord_code=9 and keyfld=:qry1.keyfld;";
                    sqOr += UtilGen.getInsertRowStringByObj("order1", cols);
                    sqOr = thatForm.frm.parseString(sqOr);
                    var stat = (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) ? "UPDATE" : "INSERT";
                    var sqLog = UtilGen.getInsertLogStr({
                        grpname: thatForm.vars.formname,
                        tablename: "ORDER1",
                        rec_stat: stat,
                        descr: "DELIVERY NOTE # " + ordn + " LOCATION # " + loc,
                        pvar1: ordn,
                        pvar2: "ORD_CODE=9",
                        pvar3: kf,
                        notify_type: "",
                        advance_data: stat == "UPDATE" ? "Previous Data -> " + thatForm.frm.getRawOriginData("qry1", "changedOnly") : "",
                    }, "");
                    var geniasm = Util.nvl(sett["BR_GEN_IASM_ON_DELIVERY"], 'FALSE');
                    var sqi = "";
                    if (geniasm == 'TRUE') {
                        sqi = "c7_generate_iasm_from_dlv(" + kf + ");";
                    }

                    return sq + sq1 + sqOr + ";" + sqi + sqLog + "";
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

        },
        setTotToday: function () {
            var thatForm = this.thatForm;
            var sqt = thatForm.frm.parseString("select nvl(sum(tqty),0) from c_order1 where keyfld!=:qry1.keyfld and " +
                " ord_date=:qry1.ord_date and ord_ship=':qry1.ord_ship'" +
                " and ord_discamt=':qry1.ord_discamt' and ord_ref=':qry1.ord_ref' ");
            var totqt = Util.getSQLValue(sqt);
            var tq = totqt + Util.extractNumber(Util.nvl(thatForm.frm.getFieldValue("qry1.ord_pkqty"), "0"));
            thatForm.frm.setFieldValue("qry1.tot_today", tq + " m3", tq + " m3");

        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var getSettingSalesp = function (ordref, ordrefnm, typ) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    getBtns: function () {
                        return [new sap.m.Button({
                            text: Util.getLangText('newRecord'),
                            press: function () {
                                thatForm.helperFunc.showEmpsWnd(this, typ);
                            }
                        })];
                    },
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    sqlChange: "select name from salesp where no = ':CODE'",
                    sqlList: "select no code,name title from salesp where type='" + typ + "'  order by no ",
                    sqlListChange: "select no code,name title from salesp where no=:CODE",
                    fnAfteUpdate: function () {
                        if (typ != "D") return;
                        var locval = thatForm.frm.objs[ordref].obj.getValue();
                        var s = Util.getSQLValue("select vehicleno from salesp where no='" + locval + "'");
                        thatForm.frm.setFieldValue("qry1.typofcem", s);
                    }
                });
            };
            var getSettingContItems = function (seq) {
                var ordref = "qry1.ord_ship";
                var ordrefnm = "qry1.itemname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    getBtns: function () {
                        return [new sap.m.Button({
                            text: Util.getLangText('Customer Items'),
                            press: function () {
                                thatForm.helperFunc.showCustItems(this);
                            }
                        })];
                    },
                    sqlChange: function () { return thatForm.helperFunc.getSqlChange(1); },
                    sqlList: function () { return thatForm.helperFunc.getSqlChange(2); },
                    sqlListChange: function () { return thatForm.helperFunc.getSqlChange(3); },
                    fnAfteUpdate: function () {
                        var locval = thatForm.frm.objs[ordref].obj.getValue();
                        var s = Util.getSQLValue("select packd from items where reference='" + locval + "'");
                        thatForm.frm.setFieldValue("qry1.ord_packd", s);
                        thatForm.helperFunc.setTotToday();
                    }
                });
            };


            //keyfid,15-10|location_code,10-15               ord_date,15-15|ord_no,5-15
            //ord_ref,15-12|ord_refnm,1-22                   ord_discamt,15-12|branchname,1-22
            //issue_plant_no,15-12|dispatchname,1-22         ordered_key,15-12|empname,1-22
            //ord_empno,15-12|drivername,1-22                salesp,15-12|salesname,1-22
            //op_no,15-12|opname,1-22                        chem_refer,15-12|chemname,1-22
            //ord_ship,15-12|itemname,1-22                   ord_pkqty,15-22|ord_packd,1-12
            //validatiy,15-35 (mixture)                      payterm,15-35 (pump)
            //remarks,15-35                                  stra,15-35
            return {
                //1
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                location_code: FormView.getFactoryFields.getComboField(
                    "location_code", "@", "locationTxt",
                    "10%", "", "15%",
                    {
                        list: "select code,name  from locations order by code",
                        require: true
                    }, {
                    selectionChange: function () {
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objno = thatForm.frm.objs["qry1.ord_no"].obj;
                        var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from c_order1 where ord_code=9 and location_code='" + objOn.getSelectedKey() + "'");
                        UtilGen.setControlValue(objno, newno, newno, true);
                    }
                }),
                ord_date: FormView.getFactoryFields.getDateField(
                    "ord_date", "@", "ordDate", "15%", "", "18%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, {}),
                ord_no: FormView.getFactoryFields.getGeneralField(
                    "ord_no", "@", "txtNo", "7%", "redText boldText", "10%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                        thatForm.helperFunc.fetchItem(false);
                    }
                }),
                //2
                ord_ref: FormView.getFactoryFields.getGeneralField(
                    "ord_ref", "", "txtCust", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsOrdRef2({
                        thatForm: thatForm,
                        fnAfteUpdate: function () {
                            var locval = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
                            thatForm.frm.setFieldValue("qry1.ord_discamt", "", "", true);
                            thatForm.frm.setFieldValue("qry1.salesp", "", "", true);
                            if (locval != "") {
                                var s = Util.getSQLValue("select salesp from c_ycust where code='" + locval + "'");
                                thatForm.frm.setFieldValue("qry1.salesp", s, s, true);
                            }
                        },
                    })),
                ord_refnm: FormView.getFactoryFields.getGeneralField(
                    "ord_refnm", "@", "", "1%", "", "22%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
                ord_discamt: FormView.getFactoryFields.getGeneralField(
                    "ord_discamt", "@", "txtBranch", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,

                    }, FormView.getFactoryFields.getSettingsBr({
                        thatForm: thatForm,
                        getBtns: function () {
                            return [new sap.m.Button({
                                text: 'New Branch', press: function () {
                                    thatForm.helperFunc.showBranch(this);
                                }
                            })]
                        },
                        fnBeforeChange: function () {
                            thatForm.frm.setFieldValue("qry1.ord_ship", "", "", true);
                        }
                    })),
                branchname: FormView.getFactoryFields.getGeneralField(
                    "branchname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),

                //3
                ord_ship: FormView.getFactoryFields.getGeneralField(
                    "ord_ship", "", "itemTxt", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, getSettingContItems()),
                itemname: FormView.getFactoryFields.getGeneralField(
                    "itemname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                ord_pkqty: FormView.getFactoryFields.getNumberField(
                    "ord_pkqty", "@", "itemPackQty", "15%", "violetText", "22%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {
                    change: function () {
                        thatForm.helperFunc.setTotToday();
                    }
                }),
                ord_packd: FormView.getFactoryFields.getGeneralField(
                    "ord_packd", "@", "", "1%", "", "12%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                //4
                issue_plant_no: FormView.getFactoryFields.getGeneralField(
                    "issue_plant_no", "", "Dispatch", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.issue_plant_no", "qry1.dispatchname", "DI")),
                dispatchname: FormView.getFactoryFields.getGeneralField(
                    "dispatchname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                ordered_key: FormView.getFactoryFields.getGeneralField(
                    "ordered_key", "@", "txtEmp", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.ordered_key", "qry1.empname", "E")),
                empname: FormView.getFactoryFields.getGeneralField(
                    "empname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),

                //5                
                ord_empno: FormView.getFactoryFields.getGeneralField(
                    "ord_empno", "", "txtDriver", "15%", "violetText", "8%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.ord_empno", "qry1.drivername", "D")),
                drivername: FormView.getFactoryFields.getGeneralField(
                    "drivername", "@", "", "1%", "", "13%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                typofcem: FormView.getFactoryFields.getGeneralField(
                    "typofcem", "@", "truckNo", "7%", "", "7%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        keyboardFocus: true,

                    }, {}),
                salesp: FormView.getFactoryFields.getGeneralField(
                    "salesp", "@", "txtSalesPerson", "15%", "", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.salesp", "qry1.salesname", "S")),
                salesname: FormView.getFactoryFields.getGeneralField(
                    "salesname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                //6
                op_no: FormView.getFactoryFields.getGeneralField(
                    "op_no", "", "txtOpNo", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.op_no", "qry1.opname", "O")),
                opname: FormView.getFactoryFields.getGeneralField(
                    "opname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                chem_refer: FormView.getFactoryFields.getGeneralField(
                    "chem_refer", "@", "Chemical", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, FormView.getFactoryFields.getSettingsItem({ thatForm: thatForm, refer: "qry1.chem_refer", descr: "qry1.chemname" })),
                chemname: FormView.getFactoryFields.getGeneralField(
                    "chemname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                //7
                validatiy: FormView.getFactoryFields.getGeneralField(
                    "validatiy", "", "Mixture", "15%", "violetText", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select name code,name from relists where idlist='MIXERS' order by name",
                    }, FormView.getFactoryFields.getListSettings(thatForm, "qry1.validatiy", "MIXERS")), //mixture
                payterm: FormView.getFactoryFields.getGeneralField(
                    "payterm", "@", "Pump", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select name code,name from relists where idlist='PUMPS' order by name",
                    }, FormView.getFactoryFields.getListSettings(thatForm, "qry1.payterm", "PUMPS")), // pump

                //8                    
                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "", "txtRemark", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
                stra: FormView.getFactoryFields.getComboField(
                    "stra", "@", "storeNo", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select no code,name  from store order by no",
                    }, {}),
                strb: FormView.getFactoryFields.getComboField(
                    "strb", "", "Product store", "65%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select no code,name  from store order by no",
                    }, {}),
                lblLv0: FormView.getFactoryFields.getTextField("lblLv0", "", "", "15%", "", {}, {}),
                lblLv: FormView.getFactoryFields.getTextField("lblLv", "@", "txtDlvPlantLeave", "17%", "boldText", {}, {}),
                lblLv2: FormView.getFactoryFields.getTextField("lblLv2", "@", "txtDlvPlantArrive", "17%", "boldText", {}, {}),
                lblLv3: FormView.getFactoryFields.getTextField("lblLv3", "@", "txtDlvStartBatch", "17%", "boldText", {}, {}),
                lblLv4: FormView.getFactoryFields.getTextField("lblLv4", "@", "txtDlvTimeSite", "17%", "boldText", {}, {}),
                lblLv5: FormView.getFactoryFields.getTextField("lblLv5", "@", "txtDlvTimeSiteArrive", "17%", "boldText", {}, {}),
                lblLv00: FormView.getFactoryFields.getTextField("lblLv00", "", "", "15%", "", {}, {}),
                tmplantleave: FormView.getFactoryFields.getGeneralField(
                    "tmplantleave", "@", "", "0px%", "", "17%",
                    {
                        data_type: FormView.DataType.Date,
                        class_name: FormView.ClassTypes.TIMEFIELD,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    displayFormat: "hh:mm a",
                    valueFormat: "hh:mm a"
                }),
                tmsitearrival: FormView.getFactoryFields.getGeneralField(
                    "tmsitearrival", "@", "", "0px%", "", "17%",
                    {
                        data_type: FormView.DataType.Date,
                        class_name: FormView.ClassTypes.TIMEFIELD,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    displayFormat: "hh:mm a",
                    valueFormat: "hh:mm a"
                }),
                tmmixingstart: FormView.getFactoryFields.getGeneralField(
                    "tmmixingstart", "@", "", "0px%", "", "17%",
                    {
                        data_type: FormView.DataType.Date,
                        class_name: FormView.ClassTypes.TIMEFIELD,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    displayFormat: "hh:mm a",
                    valueFormat: "hh:mm a"
                }),
                tmsiteleave: FormView.getFactoryFields.getGeneralField(
                    "tmsiteleave", "@", "", "0px%", "", "17%",
                    {
                        data_type: FormView.DataType.Date,
                        class_name: FormView.ClassTypes.TIMEFIELD,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    displayFormat: "hh:mm a",
                    valueFormat: "hh:mm a"
                }),
                tmofplanarrival: FormView.getFactoryFields.getGeneralField(
                    "tmofplanarrival", "@", "", "0px%", "", "17%",
                    {
                        data_type: FormView.DataType.Date,
                        class_name: FormView.ClassTypes.TIMEFIELD,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    displayFormat: "hh:mm a",
                    valueFormat: "hh:mm a"
                }),
                tot_today: FormView.getFactoryFields.getNumberField(
                    "tot_today", "", "Total Today", "15%", "violetText", "22%",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "keyIdText redText"
                    }, {}),
            };

        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of Deliveries",
                    list_type: "sql",
                    list_para: {
                        selectStr: "@100/Last 100,200/Last 200,1000/Last 1000,-1/All",
                        defaultKey: "1000",
                    },
                    cols: [
                        {
                            colname: "ORD_NO",
                            mTitle: Util.getLangText("txtNo"),
                        },
                        {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                        },
                        {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                        },
                        {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                        },
                        {
                            colname: "ORD_DISCAMT",
                            mTitle: Util.getLangText("branchNoTxt"),
                        },
                        {
                            colname: "B_NAME",
                            mTitle: Util.getLangText("branchNmTxt"),
                        },
                        {
                            colname: "ORD_SHIP",
                            mTitle: Util.getLangText("itemCode"),
                        },
                        {
                            colname: "TQTY",
                            mTitle: Util.getLangText("orderQtyTxt"),
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select *from (select o1.ord_no,o1.ord_date,o1.ord_ref,o1.ord_refnm," +
                        " o1.ord_discamt, c.b_name," +
                        " o1.ord_ship, o1.tqty||' '||o1.ord_packd tqty, o1.keyfld,o1.location_code from c_order1 o1,cbranch c where " +
                        " o1.location_code=':qry1.location_code' and " +
                        " o1.ord_ref=c.code and " +
                        " c.brno=o1.ord_discamt and " +
                        " o1.ord_code =" + that2.vars.vou_code +
                        " order by o1.ord_date desc,o1.ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1)",
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
        canEdiOrDel: function (raiseErr) {
            var thatForm = this.thatForm;
            var qry = thatForm.frm.objs["qry1"];
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW)
                return true;
            var kf = thatForm.frm.getFieldValue("qry1.keyfld");
            var ret = Util.nvl(
                Util.getSQLValue("select saleinv from c_order1 where keyfld=" + kf), "") == "";

            if (!ret && Util.nvl(raiseErr, true)) {
                var invno = Util.getSQLValue("select invoice_no from pur1 where keyfld=" + salinv)
                FormView.err("Err !, Invoice existed for this delivery !");
            }
            return ret;
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
            }
            thatForm.helperFunc.canEdiOrDel(true);
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");

            //customer flag=1 and 
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
            if (sqcnt == 0) {
                setTimeout(() => { thatForm.frm.objs["qry1.ord_ref"].focus(); }, 150);
                FormView.err("Save Denied : Customer is invalid !");
            }

            //customer , parent customer
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) {
                setTimeout(() => { thatForm.frm.objs["qry1.ord_ref"].focus(); }, 150);
                FormView.err("Save Denied : Parent customer not allowed !");
            }


            //branch
            var brno = thatForm.frm.getFieldValue("qry1.ord_discamt");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from cbranch where code='" + cod + "' and brno=" + brno);
            if (sqcnt == 0) {
                setTimeout(() => { thatForm.frm.objs["qry1.ord_discamt"].focus(); }, 150);
                FormView.err("Save Denied : Branch  is invalid !");
            }

            // driver
            var driv = thatForm.frm.getFieldValue("qry1.ord_empno");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from salesp where no='" + driv + "' and type='D'");
            if (sqcnt == 0) {
                setTimeout(() => { thatForm.frm.objs["qry1.ord_empno"].focus(); }, 150);
                FormView.err("Save Denied : Driver  is invalid !");
            }

            // issue_plant_no
            driv = thatForm.frm.getFieldValue("qry1.issue_plant_no");
            if (Util.nvl(driv, '') != '') {
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from salesp where no='" + driv + "' and type='DI'");
                if (sqcnt == 0) {
                    setTimeout(() => { thatForm.frm.objs["qry1.issue_plant_no"].focus(); }, 150);
                    FormView.err("Save Denied : Dispatch is invalid !");
                }
            }

            // ordered_key
            driv = thatForm.frm.getFieldValue("qry1.ordered_key");
            if (Util.nvl(driv, '') != '') {
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from salesp where no='" + driv + "' and type='E'");
                if (sqcnt == 0) {
                    setTimeout(() => { thatForm.frm.objs["qry1.ordered_key"].focus(); }, 150);
                    FormView.err("Save Denied : Emp no is invalid !");
                }
            }
            //salesp
            driv = thatForm.frm.getFieldValue("qry1.salesp");
            if (Util.nvl(driv, '') != '') {
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from salesp where no='" + driv + "' and type='S'");
                if (sqcnt == 0) {
                    setTimeout(() => { thatForm.frm.objs["qry1.salesp"].focus(); }, 150);
                    FormView.err("Save Denied : Sales Man is invalid !");
                }
            }
            var mx = thatForm.frm.getFieldValue("qry1.validatiy");
            mx = Util.getSQLValue("select name code,name from relists where idlist='MIXERS' and name='" + mx + "'");
            if (Util.nvl(mx, "") == "")
                FormView.err("Err !, Mixtures : " + mx + " not found !");
            mx = thatForm.frm.getFieldValue("qry1.payterm");
            if (Util.nvl(mx, "") != "") {
                mx = Util.getSQLValue("select name code,name from relists where idlist='PUMPS' and name='" + mx + "'");
                if (Util.nvl(mx, "") == "")
                    FormView.err("Err !, Pump : " + mx + " not found !");
            }


        },
        fetchItem: function () {
            var rfrFld = "ord_no";
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                return;
            setTimeout(function () {
                var rfr = thatForm.frm.getFieldValue("qry1." + rfrFld);
                var loc = thatForm.frm.getFieldValue("qry1.location_code");
                var qr = Util.execSQLWithData("select keyfld,ord_refnm from c_order1 where ORD_CODE=9 AND " + rfrFld + "='" + rfr + "'");
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
        },
        getSqlChange: function (seq) {
            var thatForm = this.thatForm;
            var locval = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
            var sq = thatForm.frm.parseString("select nvl(count(*),0) " +
                " from c_contract_items " +
                " where cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_discamt' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate");
            var sqChange = thatForm.frm.parseString("select descr name " +
                " from c_contract_items " +
                " where refer='CODE' and cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_discamt' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate").replaceAll("'CODE'", "':CODE'");
            var sqlLst = thatForm.frm.parseString("select refer code ,descr title ,price " +
                " from c_contract_items " +
                " where cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_discamt' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate order by 1");
            var sqLstChange = thatForm.frm.parseString("select refer code,descr title " +
                " from c_contract_items " +
                " where refer='CODE' and cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_discamt' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate").replaceAll("'CODE'", ":CODE");
            var cnt = Util.getSQLValue(sq);
            if (cnt <= 0) {
                sq = "select nvl(count(*),0) from C_CUSTOMER_ITEMS where code=':qry1.ord_ref'";
                sq = thatForm.frm.parseString(sq);
                cnt = Util.getSQLValue(sq);
                sqChange = thatForm.frm.parseString("select descr name from C_CUSTOMER_ITEMS" +
                    " where code=':qry1.ord_ref' and refer='CODE'").replaceAll("'CODE'", "':CODE'");
                sqlLst = thatForm.frm.parseString("select refer code,descr title,price from C_CUSTOMER_ITEMS" +
                    " where code=':qry1.ord_ref'");
                sqLstChange = thatForm.frm.parseString("select refer code,descr title from C_CUSTOMER_ITEMS" +
                    " where code=':qry1.ord_ref' and refer='CODE'").replaceAll("'CODE'", ":CODE")
            }
            if (cnt <= 0) {
                sqChange = thatForm.frm.parseString("select descr name from items " +
                    " where reference='CODE'").replaceAll("'CODE'", "':CODE'");
                sqlLst = thatForm.frm.parseString("select reference code,descr title,price1 price from items " +
                    " order by descr2 ");
                sqLstChange = thatForm.frm.parseString("select reference code,descr title from items" +
                    " where reference='CODE'").replaceAll("'CODE'", ":CODE")
            }
            if (seq == 1)
                return sqChange;
            else if (seq == 2) {
                return sqlLst;
            } else if (seq == 3) {
                return sqLstChange;
            }


        },
        enterQuckEntry: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                FormView.err("Form is not in NEW record status");

            this.qr = ["ord_ref", "ord_discamt", "ord_ship"];
            var getSqlItem = function (sn) {
                return thatForm.helperFunc.getSqlChange(sn);
            };


            var qryStr = [

                { //customer
                    sql:
                        "SELECT C_YCUST.CODE,C_YCUST.NAME FROM C_YCUST WHERE iscust='Y' and " +
                        " (mov_type='^^list_key' or    '^^list_key'='ALL')  " +
                        " ORDER BY C_YCUST.path ",
                    return:
                    {
                        code: "qry1.ord_ref",
                        // brno: "qry1.ord_discamt",
                    }
                    ,
                    listPara: {
                        selectStr: "@ALL/txtAll,ACTIVE/txtCustActive,STOPPED/txtCustStopped,LEGAL/txtCustUnderLegal",
                        defaultKey: "ACTIVE",
                    },
                    cols: ["CODE", "NAME"],
                    width: "60%",
                    height: "80%",
                    title: Util.getLangText("txtCountCust")

                },
                { // branch
                    sql:
                        "SELECT brno,b_name||' - '||area b_name FROM cbranch WHERE  " +
                        " code=':qry1.ord_ref' " +
                        " ORDER BY CBRANCH.BRNO ",
                    return:
                    {
                        // code: "qry1.ord_ref",
                        brno: "qry1.ord_discamt",
                    }
                    ,
                    listPara: {
                        selectStr: "@ALL/txtAll,ACTIVE/txtCustActive,STOPPED/txtCustStopped,LEGAL/txtCustUnderLegal",
                        defaultKey: "ACTIVE",
                    },
                    cols: ["BRNO", "B_NAME"],
                    width: "60%",
                    height: "80%",
                    title: Util.getLangText("txtCountCust")

                },
                { //items
                    sql: getSqlItem,
                    return:
                    {
                        code: "qry1.ord_ship",
                    }
                    ,
                    cols: ["CODE", "TITLE"],
                    width: "500px",
                    height: "500px",
                    title: Util.getLangText("custItems"),
                },
                { //qty
                    sql: "qtyInput"
                },
                { //driver
                    sql: "select no code,name title from salesp where type='D'  order by no ",
                    return:
                    {
                        code: "qry1.ord_empno",
                    }
                    ,
                    cols: ["CODE", "TITLE"],
                    width: "300px",
                    height: "500px",
                    title: Util.getLangText("txtDriver"),
                },
                { //mixer
                    sql: "select name code from relists where idlist='MIXERS' order by name",
                    return:
                    {
                        code: "qry1.validatiy",
                    }
                    ,
                    cols: ["CODE"],
                    width: "300px",
                    height: "500px",
                    title: Util.getLangText("Mixers"),
                },

            ]
            this.cn = 0;
            var fnExe = function (cn) {
                if (cn >= qryStr.length) {
                    setTimeout(() => {
                        thatForm.frm.objs["qry1.ord_ref"].obj.focus();
                    }, 200);
                    return;
                }
                var custcode = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
                var custname = thatForm.frm.objs["qry1.ord_refnm"].obj.getValue();
                var itemcode = thatForm.frm.objs["qry1.ord_ship"].obj.getValue();
                var itemname = thatForm.frm.objs["qry1.itemname"].obj.getValue();

                var sqlist = Util.isFunction(qryStr[cn].sql) ? qryStr[cn].sql(2) : thatForm.frm.parseString(qryStr[cn].sql);
                if (sqlist != "qtyInput")
                    Util.show_list(sqlist, qryStr[cn].cols, "", function (data) {
                        var rets = Object.keys(qryStr[cn].return);
                        for (var r in rets) {
                            var ky = rets[r];
                            var val = qryStr[cn].return[ky];
                            thatForm.frm.objs[val].obj.setValue(data[ky.toUpperCase()]);
                            thatForm.frm.setFieldValue(val, data[ky.toUpperCase()], data[ky.toUpperCase()], true);
                            thatForm.frm.objs[val].obj.fireChange();
                        }
                        fnExe(++cn);
                        return true;
                    }, qryStr[cn].width, qryStr[cn].height, undefined, false, undefined, undefined, undefined, undefined, undefined, undefined, qryStr[cn].listPara, qryStr[cn].title);
                if (sqlist == "qtyInput") {
                    UtilGen.inputDialog(custcode + " / " + custname,
                        itemcode + " / " + itemname, 0, function (str) {
                            var qt = Util.extractNumber(str);
                            if (qt <= 0) { FormView.msgCustom("Err !, Must enter valid qty !"); return false; }
                            thatForm.frm.setFieldValue("qry1.ord_pkqty", qt, qt, true);
                            fnExe(++cn);
                            return true;
                        }, function () {
                            FormView.err("Must enter QTY !");
                        }, undefined, undefined, {});
                }
            }
            fnExe(0);
        },
        showCustItems: function () {
            var thatForm = this.thatForm;
            if (UtilGen.Security.isReadOnly("formsec_custitems", "", false))
                FormView.err("you can not add/edit items");

            var vb = new sap.m.VBox();
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var nam = thatForm.frm.getFieldValue("qry1.ord_refnm");
            if (Util.nvl(cod, "") == "")
                FormView.err("Must assign customer to add new items !");
            var txtCustCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtCustName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");
            var txtBrNo = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtBName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");
            var brno = thatForm.frm.getFieldValue("qry1.ord_discamt");
            var brnam = thatForm.frm.getFieldValue("qry1.branchname");
            var btAp = new sap.m.Button({
                text: Util.getLangText("saveRec"),
                enabled: true,
                press: function () {
                    saveData();
                }
            });

            var enableDisableSave = function () {
                var ed = false;
                // var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                if (txtItem.getValue() != "" && parseFloat(txtNewPrice.getValue()) >= 0) ed = true;
                btAp.setEnabled(ed);
            }

            var txtCustCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtCustName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");
            var txtBrNo = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Center, width: "25%" }).addStyleClass("redText");
            var txtBName = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%" }).addStyleClass("redText");

            var txtItem = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: true,
                showValueHelp: true,
                valueHelpRequest: function (e) {
                    var locval = txtItem.getValue();

                    UtilGen.Search.do_quick_search(e, this,
                        "select reference code,descr title from items " +
                        "where reference not in (select refer from custitems where code='" + cod + "' ) order by descr2 ",
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
                    FormView.err("Item is not valid or! " + exis);
                txtItemName.setValue(exis);
                var exis = Util.getSQLValue("select nvl(max(refer),'') from custitems " +
                    "where code='" + cod + "' and refer='" + txtItem.getValue() + "' ");
                if (msg && Util.nvl(exis, '').trim() != '')
                    FormView.err("this item is existed for customer !");
                return (msg ? true : msg);
            };

            txtItem.attachChange(function () {
                checkItemExist(true);
            });
            var saveData = function () {
                checkItemExist(true);
                var sq = "insert into custitems (CODE, REFER, PRICE, PACKD, UNITD, PACK ) " +
                    " values (':CODE', ':REFER', :PRICE, :PACKD,:UNITD,:PACK )";
                sq = sq.replaceAll(":CODE", cod)
                    .replaceAll(":REFER", txtItem.getValue())
                    .replaceAll(":PRICE", Util.extractNumber(txtNewPrice.getValue()))
                    .replaceAll(":PACKD", "(select packd from items where reference='" + txtItem.getValue() + "')")
                    .replaceAll(":UNITD", "(select unitd from items where reference='" + txtItem.getValue() + "')")
                    .replaceAll(":PACK", "(select pack from items where reference='" + txtItem.getValue() + "')");
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    FormView.msgSuccess(Util.getLangText("msgSaved"));
                    dlg.close();
                }
            };

            var fe = [
                Util.getLabelTxt("txtCust", "25%", ""), txtCustName,
                Util.getLabelTxt("txtBranch", "25%", ""), txtBName,
                Util.getLabelTxt("itemTxt", "25%"), txtItem,
                Util.getLabelTxt("", "1%", "@"), txtItemName,
                Util.getLabelTxt("txtNewPrice", "25%", ""), txtNewPrice
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
                title: Util.getLangText("New Customer Item.."),
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 520 }) + "px",
                contentHeight: "200px",
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
            if (UtilGen.Security.isReadOnly("formsec_custbranches", "", false))
                FormView.err("you can not add/edit branches");

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
                        text: Util.getLangText("cmdClose"),
                        press: function () {
                            dlg.close();
                        }
                    })
                ]
            }).addStyleClass("sapUiSizeCompact");;
            dlg.open();
        },
        showEmpsWnd: function (obj, empType) {
            var thatForm = this.thatForm;
            if (UtilGen.Security.isReadOnly("formsec_drivers", "", false))
                FormView.err("you can not add/edit drivers");

            var empTypeWrd = {
                "D": "Driver",
                "E": "Employee",
                "DI": "Dispatcher",
                "S": "Sales man ",
                "O": "Operator"
            };

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
                    FormView.err("Emp No Existed .with name " + exis);
                return (msg ? true : pmsg);
            };

            var checkNameExist = function (pmsg) {
                var msg = Util.nvl(pmsg, true);
                var exis = Util.getSQLValue("select nvl(max(no||''),'') from salesp where upper(name)=upper('" + txtName.getValue() + "')");
                if (msg && Util.nvl(exis, '') != '')
                    FormView.err("Emp NAME Existed .with NO # " + exis);
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
                    " (:NO,':NAME',':NAMEA',':EMPTYPE',':VEHICLENO',':MOBILE') ";
                sq = sq.replaceAll(":NO", txtNo.getValue())
                    .replaceAll(":NAME", txtName.getValue())
                    .replaceAll(":EMPTYPE", empType)
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
                title: "New " + empTypeWrd[empType],//Util.getLangText("newDriverText"),
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
    }
    ,
    showRawItems: function () {
        var thatForm = this;
        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
        var jokf = Util.getSQLValue("select jobno from c_order1 where keyfld=" + kf);
        UtilGen.execCmd("bin.forms.br.forms.iasm formTitle=Assembly formType=dialog readonly=true keyfld=" + jokf + " formSize=80%,80%", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {

        });

    },
    showRawItemsOld: function () {
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
                    var dtx = Util.execSQLWithData("select distinct ctg from masterasm where baseitem='" + that2.frm.getFieldValue("qry1.ord_ship") + "'");
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
            cc = that2.frm.getFieldValue("qry1.ord_ship");
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
                " and m.baseitem='" + that2.frm.getFieldValue("qry1.ord_ship") + "'" +
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
            tit = Util.getLangText("titRawItems") + " - " + that2.frm.getFieldValue("qry1.itemname") + " / " + that2.frm.getFieldValue("qry1.ord_ship");

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

    loadData: function () {
        var frag = this;
        var frag = this;
        frag.frm.readonly = Util.nvl(frag.oController.readonly, false);
        if (frag.frm.readonly == "true") frag.frm.readonly = true;
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
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

});



