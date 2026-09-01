sap.ui.jsfragment("bin.forms.alum.cont1", {

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
        var dmlSq = "SELECT O1.*, PRICE*O1.QTY AMOUNT from C7_CONTRACTS1_ITEMS o1 " +
            " WHERE O1.KEYFLD=':keyfld' ORDER BY O1.ITEMPOS ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("locContract"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 500, "M": 650, "L": 750, "XL": 850 },
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
                        text: "Steps",
                        press: function () {
                            thatForm.showSteps();
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
                        dml: "select *from C7_CONTRACTS1 where  keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld',],
                        insert_exclude_fields: [],
                        insert_default_values: {
                        },
                        update_default_values: {
                        },
                        table_name: "C7_CONTRACTS1",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.XCN1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: 4,//{ "S": 5, "M": 7, "L": 10, "XL": 14, "XXL": 18 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from C7_CONTRACTS1_ITEMS where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'AMOUNT'],
                        insert_exclude_fields: ['AMOUNT'],
                        insert_default_values: {
                            "KEYFLD": ":qry1.keyfld",
                        },
                        update_default_values: {
                        },
                        table_name: "c7_contracts1_items",
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
                            thatForm.frm.setFieldValue('qry1.cont_amt', df.format(sumAmt));
                            if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                                thatForm.view.byId("numtxt" + thatForm.timeInLong).setText(Util.getLangText("amountTxt") + " : " + df.format(sumAmt));

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
                        thatForm.fetchCustItems = false;
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select name from c_ycust where code = :CODE ", qry.formview.objs["qry1.parent_cust"].obj, undefined, that.frm.objs["qry1._pname"].obj);
                        UtilGen.Search.getLOVSearchField("select name from acaccount where accno = :CODE ", qry.formview.objs["qry1.revenue_ac"].obj, undefined, that.frm.objs["qry1._racname"].obj);
                        UtilGen.Search.getLOVSearchField("select title name from accostcent1 where code = :CODE ", qry.formview.objs["qry1.costcent"].obj, undefined, that.frm.objs["qry1._ccname"].obj);
                        var cmdS = thatForm.frm.objs["qry1._cmdSearch"].obj;
                        cmdS.setEnabled(false);
                        UtilGen.Vouchers.attachLoadQry(thatForm, qry, 'cont1', thatForm.frm.getFieldValue("qry1.keyfld"));
                    }
                    // if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)

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
                    if (qry.name == "qry1") {
                        thatForm.helperFunc.beforeSaveValidateQry(qry);
                        UtilGen.Vouchers.attachSaveQry(thatForm, "cont1", thatForm.frm.getFieldValue("qry1.keyfld"));
                    }
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        thatForm.fileUpload = undefined;
                        thatForm.fetchCustItems = false;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_contracts1");
                        var dt = thatForm.view.today_date.getDateValue();
                        var dtx = new Date(dt.toDateString());
                        var cmdS = thatForm.frm.objs["qry1._cmdSearch"].obj;
                        thatForm.frm.setFieldValue("qry1.cont_type", "cont", "cont", true);
                        thatForm.frm.setFieldValue("qry1.qty", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.cont_amt", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.cont_trans_amt", 0, 0, true);
                        thatForm.frm.setFieldValue("qry1.revenue_ac", sett["CONT_RVN_AC"], sett["CONT_RVN_AC"], true);

                        thatForm.frm.setFieldValue("qry1.keyfld", newKf, newKf, true);
                        qry.formview.setFieldValue("qry1.cont_date", dtx, dtx, true);
                        qry.formview.setFieldValue("qry1.unitd", 'EA', 'EA', true);
                        qry.formview.setFieldValue("qry1.qty", 0, 0, true);

                        thatForm.frm.objs["qry1.cont_type"].obj.fireSelectionChange();

                        var ctype = thatForm.frm.getFieldValue("qry1.cont_type");
                        cmdS.setEnabled(true);
                        cmdS.setText("Quots");
                        if (ctype == "quot")
                            cmdS.setEnabled(false);
                        if (ctype != "cont") {
                            cmdS.setEnabled(false);
                            cmdS.setText("");
                        }



                    }

                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0) {
                        ld.setFieldValue(idx, "QTY", 1);
                        ld.setFieldValue(idx, "PRICE", 0);
                        ld.setFieldValue(idx, "ITEMPOS", idx + 1);

                    }

                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");

                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {
                    var delAdd = "";
                    var kf = thatForm.frm.getFieldValue("keyfld");
                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();

                    if (qry.name == "qry1") {
                        delAdd = "C7_CONTRACTS1_POSTJV(" + kf + ",'Y');" +
                            "delete from c7_attach where kind_of='cont1'and refer=:qry1.keyfld ;" +
                            "delete from c7_contracts1_items where keyfld=:pac;" +
                            "delete from c7_contracts1_steps where keyfld=:pac ;" + delAdd;
                        return delAdd;
                    }

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
                    var kf = frm.getFieldValue("qry1.keyfld");
                    var ct = frm.getFieldValue("qry1.cont_type");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    var sql = ""
                    if (ct == "cont") sql = "C7_CONTRACTS1_POSTJV(" + kf + ");"
                    return sq + sql;
                },
                addSqlAfterInsert: function (qry, rn) {

                    if (qry.name == "qry1" && thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                        var s1 = "";
                        var sq2 = "";
                        if (that.fetchCustItems && that.qc != undefined && that.qc.mLctb.rows.length > 0)
                            sq2 = Util.nvl(that.doUpdateSteps(), sq2);

                        sq2 = that.frm.parseString(sq2);
                        return s1 + sq2;
                    }

                    return "";
                },
                addSqlAfterUpdate: function (qry, rn) {
                    if (qry.name == "qry1" && thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                        var s1 = "";
                        var sq2 = "";
                        if (that.fetchCustItems && that.qc != undefined && that.qc.mLctb.rows.length > 0)
                            sq2 = that.frm.parseString(Util.nvl(that.doUpdateSteps(), sq2));

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
            var getParentCust = function () {
                var ordref = "qry1.parent_cust";
                var ordrefnm = "qry1._pname";
                var pSet = {};
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: pSet, thatForm,
                    fnBeforeChange: Util.nvl(pSet.fnBeforeChange, undefined),
                    fnAfteUpdate: Util.nvl(pSet.fnAfteUpdate, undefined),
                    fnBeforeValHelp: Util.nvl(pSet.fnBeforeValHelp, undefined),
                    fnAfterValHelp: Util.nvl(pSet.fnAfterValHelp, undefined),
                    code: ordref,
                    name: ordrefnm,
                    sqlChange: "select name from c_ycust where  code = ':CODE'",
                    sqlList: "select code,name title from c_ycust where flag=1 and childcount>0 and iscust='Y'  order by path ",
                    sqlListChange: "select code,name title from c_ycust where code=:CODE",
                });
            };

            //1keyfid cont_type 15-10,10,15              cont_no,cont_date 15-10,10,15
            //2parent_cust pname 15-10,25                cust_code cust_nmame,15,10,25            
            //3 dlv_no qty 15,10,10,15                   dlv_date , cont_amt 15,35
            //4rec_no,unit,15,10,10,15                   cont_trans_amt,15,35
            //5civil_id,15,35                            tel1,tel2,15,10,10,15
            //6pay_no_1,pay_no_2,15,10,10,15             pay_date,15,35
            //7govt,area,15,10,10,15                     address 15,35
            //8revenue_ac,_racname 15,15,20                        remarks,15,35

            return {
                reference: FormView.getFactoryFields.getGeneralField(
                    "reference", "", "", "0px", "boldText", "5%",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "boldText"
                    }, {
                    change: function () {

                    }
                }),
                _attachment: {
                    colname: "_attachment",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Attachment\",\"width\":\"60%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_BEGIN",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        showValueHelp: true,
                        editable: false,
                        width: "15%",
                        valueHelpRequest: function (e) {
                            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.EDIT &&
                                thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                                return;
                            UtilGen.Vouchers.attachShowUpload(thatForm);
                        }
                    },

                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                _cmdSearch: {
                    colname: "_cmdSearch",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.BUTTON,
                    title: '@{\"text\":\"\",\"width\":\"0px\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    other_settings: {
                        text: "List",
                        width: "20%",
                        press: function () {
                            thatForm.helperFunc.showRefList();
                        }
                    }
                },
                //1
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                cont_type: FormView.getFactoryFields.getComboField(
                    "cont_type", "@", "contractType",
                    "10%", "", "15%",
                    {
                        list: "@quot/txtQuot,cont/locContract",
                        require: true
                    }, {
                    selectionChange: function () {
                        var objOn = thatForm.frm.objs["qry1.cont_type"].obj;
                        var objno = thatForm.frm.objs["qry1.cont_no"].obj;
                        var objrfr = thatForm.frm.objs["qry1.reference"].obj;
                        var newno = Util.getSQLValue("select nvl(max(cont_no),0)+1 from c7_contracts1 where cont_type='" + objOn.getSelectedKey() + "' ");
                        UtilGen.setControlValue(objno, newno, newno, true);

                        var cmdS = thatForm.frm.objs["qry1._cmdSearch"].obj;
                        UtilGen.setControlValue(objrfr, "", "", true);
                        var ctype = thatForm.frm.getFieldValue("qry1.cont_type");
                        cmdS.setEnabled(true);
                        cmdS.setText("Quots");
                        if (ctype == "quot")
                            cmdS.setEnabled(false);
                        if (ctype != "cont") {
                            cmdS.setEnabled(false);
                            cmdS.setText("");
                        }

                    }
                }),
                cont_no: FormView.getFactoryFields.getGeneralField(
                    "cont_no", "@", "contractNo", "15%", "redText boldText", "10%",
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
                cont_date: FormView.getFactoryFields.getDateField(
                    "cont_date", "@", "dateTxt", "10%", "", "15%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                //2
                parent_cust: FormView.getFactoryFields.getGeneralField(
                    "parent_cust", "", "parentTxt", "15%", "", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, getParentCust()),
                _pname: FormView.getFactoryFields.getGeneralField(
                    "_pname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                cust_code: FormView.getFactoryFields.getGeneralField(
                    "cust_code", "@", "txtCust", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsOrdRef2({
                        thatForm: thatForm,
                        ord_ref: "qry1.cust_code",
                        ord_refnm: "qry1.cust_name",
                        fnAfteUpdate: function () {

                        },
                    })),
                cust_name: FormView.getFactoryFields.getGeneralField(
                    "cust_name", "@", "", "0px", "", "23%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
                //3               
                dlv_no: FormView.getFactoryFields.getGeneralField(
                    "dlv_no", "", "deliveryNo", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                qty: FormView.getFactoryFields.getNumberField(
                    "qty", "@", "txtQty", "10%", "", "15%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: "#,##0.0"
                    }, {
                    change: function () {

                    }
                }),
                cont_amt: FormView.getFactoryFields.getMoneyField(
                    "cont_amt", "@", "contractAmt", "15%", "greenText", "10%",
                    {
                        display_style: "greenText",
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                dlv_date: FormView.getFactoryFields.getDateField(
                    "dlv_date", "@", "deliveryDate", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                //4
                rec_no: FormView.getFactoryFields.getGeneralField(
                    "rec_no", "", "recNo", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                unitd: FormView.getFactoryFields.getGeneralField(
                    "unitd", "@", "itemUnitD", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                cont_trans_amt: FormView.getFactoryFields.getMoneyField(
                    "cont_trans_amt", "@", "contractTransAmt", "15%", "greenText", "10%",
                    {
                        display_style: "greenText"
                    }, {}),

                civil_id: FormView.getFactoryFields.getGeneralField(
                    "civil_id", "@", "civilId", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                //5
                salesp: FormView.getFactoryFields.getGeneralField(
                    "salesp", "", "txtSalesPerson", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingSalesp({
                        thatForm: thatForm,
                        ord_ref: "qry1.salesp",
                        ord_refnm: "qry1._sname",
                        typ: "S"
                    })),
                _sname: FormView.getFactoryFields.getGeneralField(
                    "_sname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                tel1: FormView.getFactoryFields.getGeneralField(
                    "tel1", "@", "txtTel", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                tel2: FormView.getFactoryFields.getGeneralField(
                    "tel2", "@", "txtTel", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                //6
                pay_no_1: FormView.getFactoryFields.getGeneralField(
                    "pay_no_1", "", "txtPayNo1", "15%", "", "13%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                pay_no_2: FormView.getFactoryFields.getGeneralField(
                    "pay_no_2", "@", "txtPayNo2", "10%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                pay_date: FormView.getFactoryFields.getDateField(
                    "pay_date", "@", "payDate", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                //7
                govt: FormView.getFactoryFields.getGeneralField(
                    "govt", "", "txtGovt", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, FormView.getFactoryFields.getListSettings(thatForm, "qry1.govt", "GOVERNERS")),
                area: FormView.getFactoryFields.getGeneralField(
                    "area", "@", "txtArea",
                    "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, FormView.getFactoryFields.getListSettings(thatForm, "qry1.area", "AREAS")),
                address: FormView.getFactoryFields.getGeneralField(
                    "address", "@", "txtAddr", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                //8
                revenue_ac: FormView.getFactoryFields.getGeneralField(
                    "revenue_ac", "", "revenueAc", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsAccNoChilds({
                        thatForm: thatForm,
                        ord_ref: "qry1.revenue_ac",
                        ord_refnm: "qry1._racname",
                        pPoints: { pWidth: "600px" },
                        fnAfteUpdate: function () {
                            return true;
                        },
                    })),
                _racname: FormView.getFactoryFields.getGeneralField(
                    "_racname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "@", "txtRemark", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                costcent: FormView.getFactoryFields.getGeneralField(
                    "costcent", "", "costCent", "65%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, FormView.getFactoryFields.getSettingsGeneral({
                        thatForm: thatForm,
                        code: Util.nvl("qry1.costcent"),
                        name: Util.nvl("qry1._ccname"),
                        sqlChange: "select title name from accostcent1 where  code = ':CODE'",
                        sqlList: "select code,title from accostcent1 order by code ",
                        sqlListChange: "select code,title from accostcent1 where code=:CODE",
                    })),
                _ccname: FormView.getFactoryFields.getGeneralField(
                    "_ccname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
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
                    list_para: {
                        selectStr: "@100/Last 100,200/Last 200,1000/Last 1000,-1/All",
                        defaultKey: "1000",
                    },
                    list_type: "sql",
                    cols: [
                        {
                            colname: "CONT_NO",
                        },
                        {
                            colname: "CUST_CODE",
                        },
                        {
                            colname: "CUST_NAME"
                        },
                        {
                            colname: 'KEYFLD',
                            hide: true,
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select *from (" +
                        "select cont_no,cont_date,cust_code,cust_name,cont_amt,cont_trans_amt,keyfld " +
                        " from c7_contracts1 where cont_type=':qry1.cont_type' order by cont_date desc,cont_no desc " +
                        ")  where (rownum <=^^list_key or ^^list_key=-1) ",
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
                            // var saleinv = Util.getSQLValue("select saleinv from order1 where keyfld=" + that2.frm.getFieldValue("keyfld"));
                            // if (Util.nvl(saleinv, '') != '') {
                            //     var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                            //     that2.view.byId("txtMsg" + that2.timeInLong).setText("Delivery is POSTED ,INV # " + invno);
                            //     // that2.frm.setFormReadOnly();
                            //     return false;
                            // }
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
                    title: Util.getLangText("printRec"),
                    onPress: function (e) {
                        var ms = [];
                        Util.doAjaxGet("exe?command=get-files-in-folder", "path=reports%2Fdocx%2Fcont1%2F&filetype=.docx", false).done(function (data) {
                            var dta = JSON.parse(data);
                            for (var d in dta)
                                ms.push(dta[d].file)
                        });

                        var mnus = [];
                        for (var i in ms)
                            mnus.push(new sap.m.MenuItem({
                                text: (ms[i]).replaceAll(".docx", ""),
                                icon: "sap-icon://doc-attachment",
                                customData: { key: ms[i] },
                                press: function () {
                                    var cd = this.getCustomData()[0].getKey();
                                    that2.printDoc(cd);
                                }
                            }));
                        new sap.m.Menu({
                            title: "",
                            items: mnus
                        }).openBy(e.getSource());



                    }
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
                                    icon: "sap-icon://pdf-attachment",
                                    text: "Attachment",
                                    press: function () {
                                        UtilGen.Vouchers.attachShowUpload(that2, false);
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

        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
            }
            var cod = thatForm.frm.getFieldValue("qry1.cust_code");
            var pa = thatForm.frm.getFieldValue("qry1.parent_cust");
            var ct = thatForm.frm.getFieldValue("qry1.cont_type");
            var camt = Util.extractNumber(thatForm.frm.getFieldValue("qry1.cont_trans_amt"));

            // if (ct != "quot" && Util.nvl(cod, "") == "") {
            //     UtilGen.errorObj(thatForm.frm.objs["qry1.cust_code"].obj, undefined, true);
            //     FormView.err("Customer code can't be null !");
            // }

            if (ct != "quot" && Util.nvl(pa, "") == "") {
                UtilGen.errorObj(thatForm.frm.objs["qry1.parent_cust"].obj, undefined, true);
                FormView.err("Parent Customer can't be null !");
            }

            if (Util.nvl(cod, "") != "") {
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
                if (sqcnt == 0) {
                    UtilGen.errorObj(thatForm.frm.objs["qry1.cust_code"].obj, undefined, true);
                    FormView.err("Save Denied : Customer is invalid !");
                }
                sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
                if (sqcnt > 0) {
                    UtilGen.errorObj(thatForm.frm.objs["qry1.parent_cust"].obj, undefined, true);
                    FormView.err("Save Denied : Parent customer not allowed !");
                }
            }
            if (camt <= 0) {
                UtilGen.errorObj(thatForm.frm.objs["qry1.cont_amt"].obj, undefined, true);
                FormView.err("Contract trans amount must have value !");
            }

            if (ct == "cont" && !thatForm.helperFunc.canCustParent(pa)) {
                UtilGen.errorObj(thatForm.frm.objs["qry1.parent_cust"].obj, undefined, true);
                FormView.err(thatForm.helperFunc.errStr);
            }

            if (ct == "cont" && (thatForm.qc == undefined || thatForm.qc.mLctb.rows.length == 0))
                FormView.err("Steps must have atleast 1 record !");

            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                // var rfr = ld.getFieldValue(i, "ORD_SHIP");
                var qty = ld.getFieldValue(i, "QTY");
                var pr = ld.getFieldValue(i, "PRICE");
                // if (dup[rfr] != undefined)
                //     FormView.err("Save Denied : Duplicate item entry # " + rfr);
                // dup[rfr] = rfr;
                // var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                // if (cnt > 0)
                //     FormView.err("Save Denied : Item " + rfr + " is a group item !");
                // var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                // if (cnt == 0)
                //     FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0)
                    FormView.err("Save Denied: PRICE invalid value !");
                if (qty <= 0)
                    FormView.err("Save Denied: QTY invalid value !");
            }

        },
        fetchItem: function () {

        },
        generateCustPath: function (pac, ac) {
            var that = this;
            var ret = "XXX\\" + ac + "\\";
            if (pac == "")
                return ret;

            var pth = Util.getSQLValue("select nvl(max(path),'') from c_ycust where code=" + Util.quoted(pac));
            if (pth == "")
                return "";
            return pth + ac + "\\";
        },
        canCustParent: function (pa) {
            this.errStr = "";

            if (!Util.isNull(pa)) {
                var n = Util.getSQLValue("select nvl(count(*),0) from acvoucher2 where cust_code=" + Util.quoted(pa));
                if (n > 0) {
                    this.errStr = "Err ! , reference in account transaction !";
                    return false;
                }
                n = Util.getSQLValue("select nvl(count(*),0) from pur1 where c_cus_no=" + Util.quoted(pa));
                if (n > 0) {
                    this.errStr = "Err ! , reference in sales/purchase transaction !";
                    return false;
                }
            }
            return true;
        },
        showRefList: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                return;
            var ctype = thatForm.frm.getFieldValue("qry1.cont_type");
            if (ctype != "cont") return;
            var sq = "select cont_no,cont_date,cust_code,cust_name,cont_amt,cont_trans_amt,keyfld " +
                " from c7_contracts1 where cont_type='quot' order by cont_date desc,cont_no desc ";
            UtilGen.Search.do_quick_search_simple(sq,
                ["TRAMS_DESCR"], function (data) {
                    var kf = data.KEYFLD;
                    var dtx = Util.execSQLWithData("select * from c7_contracts1 where keyfld=" + kf);
                    thatForm.frm.setFieldValue("qry1.reference", dtx[0].KEYFLD, dtx[0].KEYFLD, true);
                    thatForm.frm.setFieldValue("qry1.cust_code", dtx[0].CUST_CODE, dtx[0].CUST_CODE, true);
                    thatForm.frm.setFieldValue("qry1.cust_name", dtx[0].CUST_NAME, dtx[0].CUST_NAME, true);
                    thatForm.frm.setFieldValue("qry1.dlv_no", dtx[0].DLV_NO, dtx[0].DLV_NO, true);
                    thatForm.frm.setFieldValue("qry1.qty", dtx[0].QTY, dtx[0].QTY, true);
                    thatForm.frm.setFieldValue("qry1.cont_amt", dtx[0].CONT_AMT, dtx[0].CONT_AMT, true);
                    thatForm.frm.setFieldValue("qry1.dlv_date", dtx[0].DLV_DATE, dtx[0].DLV_DATE, true);
                    thatForm.frm.setFieldValue("qry1.rec_no", dtx[0].REC_NO, dtx[0].REC_NO, true);
                    thatForm.frm.setFieldValue("qry1.unitd", dtx[0].UNITD, dtx[0].UNITD, true);
                    thatForm.frm.setFieldValue("qry1.cont_trans_amt", dtx[0].CONT_TRANS_AMT, dtx[0].CONT_TRANS_AMT, true);
                    thatForm.frm.setFieldValue("qry1.civil_id", dtx[0].CIVIL_ID, dtx[0].CIVIL_ID, true);
                    thatForm.frm.setFieldValue("qry1.salesp", dtx[0].SALESP, dtx[0].SALESP, true);
                    thatForm.frm.setFieldValue("qry1.tel1", dtx[0].TEL1, dtx[0].TEL1, true);
                    thatForm.frm.setFieldValue("qry1.tel2", dtx[0].TEL2, dtx[0].TEL2, true);
                    thatForm.frm.setFieldValue("qry1.pay_no_1", dtx[0].PAY_NO_1, dtx[0].PAY_NO_1, true);
                    thatForm.frm.setFieldValue("qry1.pay_no_2", dtx[0].PAY_NO_2, dtx[0].PAY_NO_2, true);
                    thatForm.frm.setFieldValue("qry1.pay_date", dtx[0].PAY_DATE, dtx[0].PAY_DATE, true);
                    thatForm.frm.setFieldValue("qry1.govt", dtx[0].GOVT, dtx[0].GOVT, true);
                    thatForm.frm.setFieldValue("qry1.area", dtx[0].AREA, dtx[0].AREA, true);
                    thatForm.frm.setFieldValue("qry1.address", dtx[0].ADDRESS, dtx[0].ADDRESS, true);
                    thatForm.frm.setFieldValue("qry1.revenue_ac", dtx[0].REVENUE_AC, dtx[0].REVENUE_AC, true);
                    thatForm.frm.setFieldValue("qry1.remarks", dtx[0].REMARKS, dtx[0].REMARKS, true);
                    var qvi = thatForm.frm.objs["qry2"].obj;
                    var ld = qvi.mLctb;
                    ld.removeAllRows();

                    var dti = Util.execSQLWithData("select *from c7_contracts1_items " +
                        " where keyfld=" + kf + " order by itempos");
                    for (var i = 0; i < dti.length; i++) {
                        var rn = ld.addRow();
                        ld.setFieldValue(rn, "ITEMPOS", dti[i].ITEMPOS);
                        ld.setFieldValue(rn, "REFER", dti[i].REFER);
                        ld.setFieldValue(rn, "DESCR", dti[i].DESCR);
                        ld.setFieldValue(rn, "SIZE_DESCR", dti[i].SIZE_DESCR);
                        ld.setFieldValue(rn, "QTY", dti[i].QTY);
                        ld.setFieldValue(rn, "PRICE", dti[i].PRICE);
                        ld.setFieldValue(rn, "AMOUNT", (dti[i].PRICE * dti[i].QTY));
                    }

                    qvi.updateDataToControl();
                    qvi.eventCalc(qvi, undefined, 0, true);

                    // thatForm.frm.setFieldValue("qry1.", dtx[0]., dtx[0]. , true);
                }, { pWidth: "80%" }, undefined, undefined, "Quotation List ... ", [
                {
                    KEYFLD: {
                        colname: 'KEYFLD',
                        hide: true
                    }
                },

            ]);

        }
    },
    showSteps: function () {
        var that2 = this;
        var generateCpy = function () {
            return new sap.m.Button({
                icon: "sap-icon://copy",
                press: function () {
                    if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                        that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW)) {
                        FormView.err("Must Form EDIT or NEW mode to edit and add items ! ");
                    }
                    var ca = Util.extractNumber(that2.frm.getFieldValue("qry1.cont_amt"));
                    if (ca <= 0) {
                        FormView.err("Contract Amount must have value !");
                        dlg.close();
                        UtilGen.errorObj(that2.frm.objs["qry1.cont_amt"].obj, undefined, true);

                    }

                    var dt = Util.execSQLWithData("select *from c7_steps_info where grp_code='CNT1' order by code");
                    var ld = that2.qc.mLctb;
                    ld.removeAllRows();
                    for (var i = 0; i < dt.length; i++) {
                        var rn = ld.addRow();
                        ld.setFieldValue(rn, "POSNO", rn + 1);
                        ld.setFieldValue(rn, "CODE", dt[i].CODE);
                        ld.setFieldValue(rn, "DESCR", dt[i].DESCR);
                        ld.setFieldValue(rn, "PAY_P", dt[i].DEFAULT_P);
                        var pa = (ca / 100) * dt[i].DEFAULT_P;
                        ld.setFieldValue(rn, "PAY_AMT", pa);
                    }
                    that2.qc.updateDataToControl();
                    eventCalc(that2.qc, undefined, 0, true);
                }
            });
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
            this.qc.showToolbar.toolbar.addContent(generateCpy());
            this.qc.showToolbar.toolbar.addContent(new sap.m.ToolbarSpacer());
            this.qc.insertable = true;
            this.qc.deletable = true;
        }

        // this.qc.showToolbar.toolbar.addContent(generateCtgs());

        if (that2.fetchCustItems == false)
            that2.qc.reset();
        var cc = that2.frm.getFieldValue("qry1.keyfld");
        // if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
        //     that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
        //     cc = that2.frm.getFieldValue("qry1.keyfld");
        // }
        var eventCalc = function (qv, cx, rowno, reAmt) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var p = 0;

            if (reAmt)
                qv.updateDataToTable();

            var ld = qv.mLctb;
            var sumAmt = 0;
            var sump = 0;
            for (var i = 0; i < ld.rows.length; i++) {
                sumAmt += Util.extractNumber(ld.getFieldValue(i, "PAY_AMT"))
                sump += Util.extractNumber(ld.getFieldValue(i, "PAY_P"));
            }

            // thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
            that2.view.byId("txtRM" + that2.timeInLong).setText(sump + "%,  Amount : " + df.format(sumAmt));
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
        };


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

            var dt = Util.execSQL("SELECT POSNO,CODE, DESCR, PAY_P, PAY_AMT, EXPECTED_DATE, DONE_DATE, REMARKS " +
                " from C7_CONTRACTS1_STEPS " +
                " WHERE keyfld= " + that2.frm.getFieldValue("qry1.keyfld") +
                " order by POSNO "
            );
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");

                Util.setColProperties(qv, "POSNO", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "txtNo",
                    "display_width": 50,
                });

                Util.setColProperties(qv, "CODE", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "txtCode",
                    "display_width": 100,
                });
                Util.setColProperties(qv, "DESCR", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "txtDescr",
                    "display_width": 175,
                });

                Util.setColProperties(qv, "PAY_P", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "payAmt",
                    "display_width": 120,
                    "display_format": "QTY_FORMAT",
                });

                Util.setColProperties(qv, "PAY_AMT", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "payAmt",
                    "display_width": 120,
                    "display_format": "MONEY_FORMAT"
                });

                Util.setColProperties(qv, "EXPECTED_DATE", {
                    "mColClass": "sap.m.DatePicker",
                    "mTitle": "expectedDate",
                    "display_width": 145,
                    "display_format": "SHORT_DATE_FORMAT"
                });
                Util.setColProperties(qv, "DONE_DATE", {
                    "mColClass": "sap.m.Text",
                    "mTitle": "doneDate",
                    "display_width": 145,
                    "insert_allowed": false,
                    "edit_allowed": false,
                    "display_format": "SHORT_DATE_FORMAT"
                });

                Util.setColProperties(qv, "REMARKS", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "txtRemark",
                    "display_width": 250,
                    "display_format": ""
                });
                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].eValidateColumn = function (evtx) {
                    var info = UtilGen.getTableFromValidateEvent(evtx);
                    info.oModel.setProperty(info.currentRowoIndexContext.sPath + '/DESCR', "");

                    var dtxM = Util.execSQLWithData("select descr from c7_steps_info where grp_code='CNT1' and code='" + info.newValue + "' ")
                    if (dtxM != undefined && dtxM.length > 0) {
                        info.oModel.setProperty(info.currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                    }
                };
                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].mSearchSQL = "select  code,descr title,default_p from C7_STEPS_INFO where grp_code='CNT1' order by descr2";
                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    UtilGen.Search.do_quick_search(evtx, input,
                        "select code,descr title,DEFAULT_P  from C7_STEPS_INFO where grp_code='CNT1' order by code ",
                        "select  code,descr title from C7_STEPS_INFO  where grp_code='CNT1' and code=:CODE", undefined, function () {
                            input.fireChange();
                        },
                        {
                            pWidth: "600px", pHeight: "400px",
                            "background-color": 'blue',
                            "dialogStyle": "cyanDialog"
                        });
                }
                var qtValidate = function (evtx) {
                    var info = UtilGen.getTableFromValidateEvent(evtx);
                    var colnm = info.columns[info.column_no].tableCol.mColName;

                    if (colnm == "PAY_P") {
                        var ca = that2.frm.getFieldValue("qry1.cont_amt");
                        var pa = 0;
                        if (ca > 0)
                            pa = (ca / 100) * info.newValue;
                        info.oModel.setProperty(info.currentRowoIndexContext.sPath + '/PAY_AMT', pa);
                    }
                    if (colnm == "PAY_AMT") {
                        var ca = that2.frm.getFieldValue("qry1.cont_amt");
                        var pp = 0;
                        if (ca > 0)
                            pp = ((info.newValue / ca) * 100).toFixed(2);
                        pp = Util.extractNumber(String(pp));
                        info.oModel.setProperty(info.currentRowoIndexContext.sPath + '/PAY_P', pp);
                    }
                    eventCalc(qv, undefined, 0, true);
                };

                qv.mLctb.cols[qv.mLctb.getColPos("PAY_AMT")].eValidateColumn = qtValidate;
                qv.mLctb.cols[qv.mLctb.getColPos("PAY_P")].eValidateColumn = qtValidate;

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                that2.fetchCustItems = true;
                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "POSNO", idx + 1);
                    ld.setFieldValue(idx, "PAY_AMT", 0);
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
        };

        var pg = new sap.m.Page({
            showHeader: true,
            content: [],
            showFooter: true
        }).addStyleClass("sapUiSizeCompact");
        var cmdClose = new sap.m.Button({
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
            sap.m.MessageToast.show("Closing  window..");
        });
        that2.qc.eventCalc = eventCalc;
        eventCalc(that2.qc, undefined, 0, true);
    },
    doUpdateSteps: function () {
        var that2 = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

        if (!that2.fetchCustItems || that2.qc == undefined || that2.qc.mLctb.rows.length == 0)
            return "";
        that2.qc.updateDataToTable();
        var ld = that2.qc.mLctb;
        var sqls = "";
        var rfr = that2.frm.getFieldValue("qry1.keyfld");
        var sq2 = UtilGen.getInsertRowStringByObj(
            "C7_CONTRACTS1_STEPS",
            {
                "KEYFLD": Util.quoted(rfr),
                "CODE": "':XCODE'",
                "POSNO": ":XPOSNO",
                "DESCR": "':XDESCR'",
                "DESCRA": "':XDESCRA'",
                "PAY_P": ":XPAY_P",
                "PAY_AMT": ":XPAY_AMT",
                "EXPECTED_DATE": ":XEXPECTED_DATE",
                "DONE_DATE": ":XDONE_DATE",
                "FLAG": "1",
                "REMARKS": "':XREMARKS'",
            });
        var checkDuplicate = {};
        var sumP = 0;
        var sumAmt = 0;
        for (var i = 0; i < ld.rows.length; i++) {
            var p = Util.extractNumber(ld.getFieldValue(i, "PAY_P"));
            var pa = Util.extractNumber(ld.getFieldValue(i, "PAY_AMT"));
            if (p > 100 || p < 0) { FormView.err("Invalid Pay % in steps !"); thatForm.showSteps(); }
            if (pa < 0) { FormView.err("Invalid Pay Amount in steps !"); thatForm.showSteps(); }
            sumP += p; sumAmt += pa;

            if (Util.nvl(ld.getFieldValue(i, "CODE"), "") == "") {
                that2.showSteps();
                FormView.err(" REFER MUST ENTER !");
            }
            if (checkDuplicate[ld.getFieldValue(i, "COCDE")] != undefined) {
                that2.showSteps();
                FormView.err("STEP  # " + ld.getFieldValue(i, "CODE") + " alredy existed for " + ld.getFieldValue(i, "DESCR"))
            } else
                checkDuplicate[ld.getFieldValue(i, "CODE")] = ld.getFieldValue(i, "DESCR");

            var sq = sq2.replaceAll(":XCODE", ld.getFieldValue(i, "CODE"))
                .replaceAll(":XPOSNO", ld.getFieldValue(i, "POSNO"))
                .replaceAll(":XDESCRA", "")
                .replaceAll(":XDESCR", ld.getFieldValue(i, "DESCR"))
                .replaceAll(":XPAY_P", Util.extractNumber(ld.getFieldValue(i, "PAY_P")))
                .replaceAll(":XPAY_AMT", Util.extractNumber(ld.getFieldValue(i, "PAY_AMT")))
                .replaceAll(":XEXPECTED_DATE", Util.toOraDateString(ld.getFieldValue(i, "EXPECTED_DATE")))
                .replaceAll(":XDONE_DATE", Util.toOraDateString(ld.getFieldValue(i, "DONE_DATE")))
                .replaceAll(":XREMARKS", ld.getFieldValue(i, "REMARKS"));
            // .replaceAll(":", ld.getFieldValue(i, ""))
            sqls += sq + ";";
        }

        if (sumP != 100) { FormView.err("Must 100% PAY in steps !"); thatForm.showSteps(); }
        // if (sumAmt != ) { FormView.err("Invalid Pay Amount in steps !"); thatForm.showSteps(); }

        sqls = "delete from C7_CONTRACTS1_STEPS where keyfld='" + rfr + "';" + sqls;
        return sqls;
    },
    printDoc: function (docfile) {
        var thatForm = this;
        var qryObj = thatForm.frm.objs["qry1"];
        if (qryObj.status == FormView.RecordStatus.EDIT || qryObj.status == FormView.RecordStatus.NEW) {
            thatForm.frm.save_data(undefined, FormView.RecordStatus.VIEW);
        }
        if (qryObj.status != FormView.RecordStatus.VIEW)
            FormView.err("must save data to print !");

        var kf = thatForm.frm.getFieldValue("qry1.keyfld");

        var dt = {};
        var tmp = Util.execSQLWithData("select *from v_c7_contracts1 where keyfld=" + kf);
        if (tmp.length > 0) {
            var dtx = tmp[0];
            var keys = Object.keys(dtx);
            for (var d in keys)
                dt['c76' + keys[d]] = dtx[keys[d]];
        }
        thatForm.downloadFilledTemplate(docfile, dt);
    },
    downloadFilledTemplate: function (docfile, data) {
        var that = this;

        // If no data provided, use default (or fetch from form)
        var replacements = data || {
            empname: 'yusuf',
            date: '0101023',
            company: 'MetaSoft'
        };

        // Show busy indicator
        Util.doSpin('Preparing document...');

        // Load libraries, then fetch and process template
        this._loadDocxLibraries()
            .then(function () {
                // 1. Fetch the template from Spring Boot endpoint
                return new Promise(function (resolve, reject) {
                    var docpath = "docx%2Fcont1%2F" + docfile;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'template?filename=' + docpath, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error('HTTP ' + xhr.status));
                        }
                    };
                    xhr.onerror = function () { reject(new Error('Network error')); };
                    xhr.send();
                });
            })
            .then(function (arrayBuffer) {
                // 2. Create zip and docxtemplater instance
                var zip = new PizZip(arrayBuffer);
                var docXml = zip.file('word/document.xml').asText();

                // Replace each placeholder (exact string) with its value
                for (var key in replacements) {
                    // Since the placeholder is just the key (no braces), we replace the key itself
                    var escapedKey = (key.replace(/[.*+?^${}()|[\]\\]/gi, '  \\$&'));
                    var vl = Util.nvl(replacements[key], " ");
                    vl = Util.canDate(vl, "yyyy/MM/dd");
                    // Match both {key} and key (with optional surrounding braces)
                    var regex = new RegExp(escapedKey, "gi");
                    docXml = docXml.replace(regex, vl);
                }

                // Update the zip
                zip.file('word/document.xml', docXml);

                // 4. Generate blob
                var outBlob = zip.generate({
                    type: 'blob',
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });
                var cnm = that.frm.getFieldValue("qry1.cust_name");
                var ct = that.frm.getFieldValue("qry1.cont_type");

                // 5. Trigger download
                if (window.saveAs) {
                    window.saveAs(outBlob, ct + "_" + cnm + '.docx');
                } else {
                    // Manual fallback (works in modern browsers)
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(outBlob);
                    link.download = ct + "_" + cnm + '.docx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }

                Util.stopSpin();
                sap.m.MessageToast.show('Document downloaded successfully.');
            })
            .catch(function (err) {
                Util.stopSpin();
                console.error(err);
                sap.m.MessageBox.error('Failed to generate document: ' + err.message);
            });
    },
    _loadDocxLibraries: function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            // Already loaded?
            if (window.PizZip && window.docxtemplater && window.saveAs) {
                resolve();
                return;
            }

            var loadScript = function (src) {
                return new Promise(function (res, rej) {
                    var script = document.createElement('script');
                    script.src = src;
                    script.onload = res;
                    script.onerror = function () { rej(new Error('Failed to load ' + src)); };
                    document.head.appendChild(script);
                });
            };

            // Load in sequence: PizZip → docxtemplater → FileSaver
            loadScript('js/pizzip.min.js')
                .then(function () {
                    return loadScript('js/docxtemplater.min.js');
                })
                .then(function () {
                    return loadScript('js/FileSaver.min.js');
                })
                .then(function () {
                    resolve();
                })
                .catch(function (err) {
                    reject(err);
                });
        });
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



