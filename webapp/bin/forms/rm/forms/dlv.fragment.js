sap.ui.jsfragment("bin.forms.rm.forms.dlv", {

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
                // width: { "S": 500, "M": 650, "L": 750 },
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
                        dml: "select *from c_order1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'chemname', 'opname', 'salesname', 'drivername', 'empname', 'dispatchname', 'itemname', "lblLv0", "lblLv00", "lblLv", "lblLv2", "lblLv3", "lblLv4", "lblLv5"],
                        insert_exclude_fields: ['branchname', 'chemname', 'opname', 'salesname', 'drivername', 'empname', 'dispatchname', 'itemname', "lblLv", "lblLv0", "lblLv00", "lblLv2", "lblLv3", "lblLv4", "lblLv5"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_FLAG": 1,
                            "ORD_UNITD": "'PCS'",
                            "ORD_PACK": 1,
                            "ORD_POS": 1
                        },
                        update_default_values: {
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
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var objno = thatForm.frm.objs["qry1.ord_no"].obj;
                        var objopno = thatForm.frm.objs["qry1.op_no"].obj;
                        var objtm = thatForm.frm.objs["qry1.tmplantleave"].obj;

                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");

                        var dt = thatForm.view.today_date.getDateValue();
                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objSt, sett["DEFAULT_STORE"], sett["DEFAULT_STORE"], true);
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
                    var sq1 = "";
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var rfr = thatForm.frm.getFieldValue("qry1.ord_ship");
                    var dt = Util.execSQLWithData("select packd,unitd,pack from items where reference='" + rfr + "'", "Item # " + rfr + " not a valid !");
                    var sq1 = "update c_order1 set ord_packd=':pkd',ord_unitd=':unitd' ,ord_pack=:pack where keyfld=:kf and ord_pos=:pos ; "
                        .replaceAll(":pkd", dt[0].PACKD)
                        .replaceAll(":unitd", dt[0].UNITD)
                        .replaceAll(":pack", dt[0].PACK)
                        .replaceAll(":kf", kf)
                        .replaceAll(":pos", 1);



                    return sq + sq1;
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
            var getSettingSalesp = function (ordref, ordrefnm, typ) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    sqlChange: "select name from salesp where no = ':CODE'",
                    sqlList: "select no code,name title from salesp where type='" + typ + "'  order by no ",
                    sqlListChange: "select no code,name title from salesp where no=:CODE",
                });
            };
            var getSettingContItems = function (seq) {
                var ordref = "qry1.ord_ship";
                var ordrefnm = "qry1.itemname";
                var getSqlChange = function (seq) {
                    var locval = thatForm.frm.objs[ordref].obj.getValue();
                    var sq = thatForm.frm.parseString("select nvl(count(*),0) " +
                        " from c_contract_items " +
                        " where cust_code=:qry1.ord_ref and branch_no=:qry1.ord_discamt " +
                        " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate");
                    var sqChange = thatForm.frm.parseString("select descr name " +
                        " from c_contract_items " +
                        " where refer='CODE' and cust_code=:qry1.ord_ref and branch_no=:qry1.ord_discamt " +
                        " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate").replaceAll("'CODE'", "':CODE'");
                    var sqlLst = thatForm.frm.parseString("select refer code ,descr title ,price " +
                        " from c_contract_items " +
                        " where cust_code=:qry1.ord_ref and branch_no=:qry1.ord_discamt " +
                        " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate order by 1");
                    var sqLstChange = thatForm.frm.parseString("select refer code,descr title " +
                        " from c_contract_items " +
                        " where refer='CODE' and cust_code=:qry1.ord_ref and branch_no=:qry1.ord_discamt " +
                        " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate").replaceAll("'CODE'", ":CODE");
                    var cnt = Util.getSQLValue(sq);
                    if (cnt < 0) {
                        sq = "select nvl(count(*),0) from C_CUSTOMER_ITEMS where code=:qry1.ord_ref and :qry1.ord_ship=refer";
                        sq = thatForm.frm.parseString(sq);
                        cnt = Util.getSQLValue(sq);
                    }
                    if (cnt < 0) FormView.err("No Contract or price forund for this customer and branch !");
                    if (seq == 1)
                        return sqChange;
                    else if (seq == 2) {
                        return sqlLst;
                    } else if (seq == 3) {
                        return sqLstChange;
                    }


                };
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    sqlChange: function () { return getSqlChange(1); },
                    sqlList: function () { return getSqlChange(2); },
                    sqlListChange: function () { return getSqlChange(3); },
                    fnAfteUpdate: function () {
                        var locval = thatForm.frm.objs[ordref].obj.getValue();
                        var s = Util.getSQLValue("select packd from items where reference='" + locval + "'");
                        thatForm.frm.setFieldValue("qry1.ord_packd", s);
                    }
                });
            };
            var getListSettings = function (ordref, lsttype) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: ordref,
                    name: ordref,
                    sqlChange: "select name title from relists where idlist='" + lsttype + "' and name=':CODE'",
                    sqlList: "select name code from relists where idlist='" + lsttype + "' order by name",
                    sqlListChange: "select name code,name title from relists where idlist='" + lsttype + "' and name=:CODE",
                });
            }

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
                        edit_allowed: true,
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
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsOrdRef({
                        thatForm: thatForm,
                        fnAfteUpdate: function () {
                            var locval = thatForm.frm.getFieldValue("qry1.ord_ref");
                            var s = Util.getSQLValue("select salesp from c_ycust where code='" + locval + "'");
                            thatForm.frm.setFieldValue("qry1.salesp", s, s, true);
                        }
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
                        edit_allowed: true,
                        insert_allowed: true,

                    }, FormView.getFactoryFields.getSettingsBr({ thatForm: thatForm })),
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
                        edit_allowed: true,
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
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
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
                    "ord_empno", "", "txtDriver", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.ord_empno", "qry1.drivername", "D")),
                drivername: FormView.getFactoryFields.getGeneralField(
                    "drivername", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

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
                    }, getListSettings("qry1.validatiy", "MIXERS")), //mixture
                payterm: FormView.getFactoryFields.getGeneralField(
                    "payterm", "@", "Pump", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select name code,name from relists where idlist='PUMPS' order by name",
                    }, getListSettings("qry1.payterm", "PUMPS")), // pump

                //8                    
                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "", "txtRemark", "15%", "", "35%",
                    {
                        require: true,
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
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from order1");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
            }

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



