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
        var dmlSq = "SELECT O1.*, PRICE*O1.QTY AMOUNT from C7_CONTRACTS1_ITEMS o1 "
        " WHERE O1.KEYFLD=':keyfld' ORDER BY O1.ORD_POS ";

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
                        dispRecords: { "S": 5, "M": 7, "L": 10, "XL": 14, "XXL": 18 },
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
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        thatForm.fetchCustItems = false;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_contracts1");
                        var dt = thatForm.view.today_date.getDateValue();
                        var dtx = new Date(dt.toDateString());
                        thatForm.frm.setFieldValue("qry1.cont_type", "cont", "cont");
                        thatForm.frm.setFieldValue("qry1.qty", 0, 0);
                        thatForm.frm.setFieldValue("qry1.cont_amt", 0, 0);
                        thatForm.frm.setFieldValue("qry1.cont_trans_amt", 0, 0);

                        thatForm.frm.setFieldValue("qry1.keyfld", newKf, newKf);
                        qry.formview.setFieldValue("qry1.cont_date", dtx, dtx, true);

                        thatForm.frm.objs["qry1.cont_type"].obj.fireSelectionChange();

                    }

                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0) {

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

                    if (qry.name == "qry1") {
                        return "delete from c7_contracts1_steps where keyfld=:pac ;" + delAdd;
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
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    return sq;
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
            }
            //1keyfid cont_type 15-10,10,15              cont_no,cont_date 15-10,10,15
            //2parent_cust pname 15-10,25                cust_code cust_nmame,15,10,25            
            //3 dlv_no qty 15,10,10,15                   dlv_date , cont_amt 15,35
            //4rec_no,unit,15,10,10,15                   cont_trans_amt,15,35
            //5civil_id,15,35                            tel1,tel2,15,10,10,15
            //6pay_no_1,pay_no_2,15,10,10,15             pay_date,15,35
            //7govt,area,15,10,10,15                     address 15,35
            //8revenue_ac,_racname 15,15,20                        remarks,15,35

            return {
                //1
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                cont_type: FormView.getFactoryFields.getComboField(
                    "cont_type", "@", "contractType",
                    "10%", "", "15%",
                    {
                        list: "@quot/txtQuotaton,cont/Contract",
                        require: true
                    }, {
                    selectionChange: function () {
                        var objOn = thatForm.frm.objs["qry1.cont_type"].obj;
                        var objno = thatForm.frm.objs["qry1.cont_no"].obj;
                        var newno = Util.getSQLValue("select nvl(max(cont_no),0)+1 from c7_contracts1 where cont_type='" + objOn.getValue() + "' ");
                        UtilGen.setControlValue(objno, newno, newno, true);
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
                    "cont_date", "@", "contractDate", "10%", "", "15%",
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
                        require: true,
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
                qty: FormView.getFactoryFields.getGeneralField(
                    "qty", "@", "txtQty", "10%", "", "15%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
                cont_amt: FormView.getFactoryFields.getMoneyField(
                    "cont_amt", "@", "contractAmt", "15%", "", "10%",
                    {

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
                    "unitd", "@", "itemUnitD", "15%", "", "10%",
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
                    "cont_trans_amt", "@", "contractTransAmt", "15%", "", "35%",
                    {

                    }, {}),
                //5
                civil_id: FormView.getFactoryFields.getGeneralField(
                    "civil_id", "", "civilId", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
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
                    "pay_no_1", "", "txtPayNo1", "15%", "", "10%",
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
                    "pay_no_2", "@", "txtPayNo1", "10%", "", "15%",
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
                    "remarks", "@", "txtRemarks", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {

                    }
                }),
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
            var cod = thatForm.frm.getFieldValue("qry1.cust_code");
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

        },
        fetchItem: function () {

        },

    }
    ,
    showSteps: function () {
        var that2 = this;

        if (this.qc == undefined) {
            this.qc = new QueryView("qrRawitems" + that2.timeInLong);
            this.qc.getControl().setEditable(true);
            this.qc.getControl().view = that2.view;
            this.qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
            this.qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
            this.qc.getControl().setFixedBottomRowCount(0);
            this.qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
            UtilGen.createDefaultToolbar1(this.qc, ["REFER", "DESCR"], false);
            // this.qc.showToolbar.toolbar.addContent(generateCpy());
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

            for (var i = 0; i < ld.rows.length; i++) {
                var pr = Util.extractNumber(ld.getFieldValue(i, "PAY_AMT"));
                sumAmt += pr;
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

                Util.setColProperties(qv, "PAY_AMT", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "payAmt",
                    "display_width": 120,
                    "display_format": "MONEY_FORMAT"
                });

                Util.setColProperties(qv, "EXPECTED_DATE", {
                    "mColClass": "sap.m.DatePicker",
                    "mTitle": "expectedDate",
                    "display_width": 120,
                    "display_format": "SHORT_DATE_FORMAT"
                });
                Util.setColProperties(qv, "DONE_DATE", {
                    "mColClass": "sap.m.DatePicker",
                    "mTitle": "doneDate",
                    "display_width": 120,
                    "display_format": "SHORT_DATE_FORMAT"
                });

                Util.setColProperties(qv, "REMARKS", {
                    "mColClass": "sap.m.Input",
                    "mTitle": "txtRemark",
                    "display_width": 250,
                    "display_format": ""
                });


                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].eValidateColumn = function (evtx) {
                    var row = evtx.getSource().getParent();
                    var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                    var columns = evtx.getSource().getParent().getParent().getColumns();
                    var table = evtx.getSource().getParent().getParent(); // get table control.
                    var oModel = table.getModel();
                    var rowStart = table.getFirstVisibleRow(); //starting Row index
                    var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));
                    var newValue = evtx.getSource().getValue();

                    oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', "");

                    var dtxM = Util.execSQLWithData("select descr from c7_steps_info where grp_code='CNT1' and code='" + newValue + "' ")
                    if (dtxM != undefined && dtxM.length > 0) {
                        oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                    }
                };
                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].mSearchSQL = "select  code,descr title,default_p from C7_STEPS_INFO where grp_code='CNT1' order by descr2";
                qv.mLctb.cols[qv.mLctb.getColPos("CODE")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    UtilGen.Search.do_quick_search(evtx, input,
                        "select code,descr title,DEFAULT_P  from C7_STEPS_INFO where grp_code='CNT1' order by descr2 ",
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
                    eventCalc(qv, undefined, 0, true);

                };
                qv.mLctb.cols[qv.mLctb.getColPos("PAY_AMT")].eValidateColumn = qtValidate;
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
        var ld = that2.qc.mLctb;
        var sqls = "";
        var rfr = that2.frm.getFieldValue("qry1.keyfld");
        var ctg = that2.view.byId("btCtg" + that2.timeInLong).getCustomData()[0].getKey();
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
        for (var i = 0; i < ld.rows.length; i++) {
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
                .replaceAll(":XEXPECTED_DATE", Util.toOraDateString(ld.getFieldValue(i, "EXTRACT_DATE")))
                .replaceAll(":XDONE_DATE", Util.toOraDateString(ld.getFieldValue(i, "DONE_DATE")))
                .replaceAll(":XREMARKS", ld.getFieldValue(i, "REMARKS"));
            // .replaceAll(":", ld.getFieldValue(i, ""))
            sqls += sq + ";";
        }
        sqls = "delete from C7_CONTRACTS1_STEPS where keyfld='" + rfr + "';" + sqls;
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



