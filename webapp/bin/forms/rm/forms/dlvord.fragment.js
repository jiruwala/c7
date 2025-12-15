sap.ui.jsfragment("bin.forms.rm.forms.dlvord", {

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
        var dmlSq = "select O1.*,IT.DESCR,IT.PACKD,IT.PACK,O1.SALE_PRICE*O1.TQTY AMOUNT from c_nextordx o1 ,ITEMS IT where " +
            " IT.REFERENCE=O1.ord_item AND O1.KEYFLD=':keyfld' and ord_code=" + that.vars.vou_code + " ORDER BY O1.ORD_POS ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("titSalesOrder"),
                toolbarBG: "orange",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), txtMsg]
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
                        dml: "select *from c_nextordx where  keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'itemname', 'ord_packd', "lblLv0", "lblLv", "txtprice", "txtamt", "txtbal", "txtcl", "txtod", "lblLv1", "lblLv01", "lblLv02", "lblLv03", "lblLv04", "lblLv05"],
                        insert_exclude_fields: ['branchname', 'itemname', 'ord_packd', "lblLv0", "lblLv", "txtprice", "txtamt", "txtbal", "txtcl", "txtod", "lblLv1", "lblLv01", "lblLv02", "lblLv03", "lblLv04", "lblLv05"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "CREATDT": "sysdate"
                        },
                        update_default_values: {
                        },
                        table_name: "C_NEXTORDX",
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
    clearAmts: function () {
        var thatForm = this;
        thatForm.frm.setFieldValue("qry1.txtamt", 0, 0, true);
        thatForm.frm.setFieldValue("qry1.txtcl", 0, 0, true);
        thatForm.frm.setFieldValue("qry1.txtbal", 0, 0, true);
        thatForm.frm.setFieldValue("qry1.txtod", 0, 0, true);
        thatForm.checkCLColor();
    },
    fetchAmts: function (fetchPrice) {
        var thatForm = this;
        thatForm.clearAmts();

        if (Util.nvl(fetchPrice, true)) {
            var sq = thatForm.frm.parseString("select get_item_price2(':qry1.ord_item',':qry1.ord_ref',':qry1.ord_branch',:qry1.ord_date) from dual");
            var pr = Util.getSQLValue(sq);
            thatForm.frm.setFieldValue("qry1.txtprice", pr, pr, true);
        }
        if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
            return true;

        var pr = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtprice"));
        var qt = Util.extractNumber(thatForm.frm.getFieldValue("qry1.oqty"));
        var amt = pr * qt;
        var sq2 = thatForm.frm.parseString("select c7_get_cb(':qry1.ord_ref','Y','Y') from dual");
        var bl = Util.extractNumber(Util.getSQLValue(sq2)) + amt;
        var cl = Util.getSQLValue("select crd_limit from c_ycust where code='" + thatForm.frm.getFieldValue("qry1.ord_ref") + "'");
        thatForm.frm.setFieldValue("qry1.txtamt", amt, amt, true);
        thatForm.frm.setFieldValue("qry1.txtcl", cl, cl, true);
        thatForm.frm.setFieldValue("qry1.txtbal", bl, bl, true);
        thatForm.frm.setFieldValue("qry1.txtod", 0, 0, true);
        if (cl != 0)
            thatForm.frm.setFieldValue("qry1.txtod", (bl - cl), (bl - cl), true);
        thatForm.checkCLColor();
    },
    checkCLColor: function () {
        var thatForm = this;
        var objCl = thatForm.frm.objs["qry1.txtod"].obj;
        var cl = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtcl"));
        var bl = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtbal"));
        objCl.removeStyleClass("greenInp");
        objCl.removeStyleClass("redInp");
        if (cl == 0) { objCl.addStyleClass("greenInp"); return; };
        if (bl > cl)
            objCl.addStyleClass("redInp");
        else objCl.addStyleClass("greenInp");
    },
    checkCL: function (pErr, pFetchaount) {
        var err = Util.nvl(pErr, true);
        var fa = Util.nvl(pFetchaount, true);

        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
        var cust = thatForm.frm.getFieldValue("qry1.ord_ref");
        if (Util.nvl(sett["DLV_CUST_ABOVE_CREDIT_BLOCK"], "TRUE") != "TRUE")
            return false;
        if (fa)
            thatForm.fetchAmts();
        var cl = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtcl"));
        var totamt = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtamt"));
        var bal = Util.extractNumber(thatForm.frm.getFieldValue("qry1.txtbal"));

        if (cl == 0) return true;

        // var totamt = Util.extractNumber(thatForm.frm.getFieldValue("amt"));

        if (totamt <= 0) FormView.err("Cant save AMOUNT = 0  !");
        if (bal > cl) {
            var msg = Util.getLangText("txtCreditLimit") + " # " + df.format(cl) + " , " +
                Util.getLangText("needCreditLimit") + " = " + df.format(bal);
            FormView.msgCustom(msg, "white", "red", "20px");
            if (err) throw msg;
            return false;
        }

        return true;
    },
    checkExisted: function () {
        var thatForm = this;
        var sq = thatForm.frm.parseString("select nvl(max(ord_no),0) from c_nextordx where ord_ref=':qry1.ord_ref' and" +
            " ord_date=:qry1.ord_date and ord_branch=':ord_branch' and ord_item=':qry1.ord_item'");
        var dt = Util.getSQLValue(sq);
        if (dt != 0) FormView.err("This customer , branch and item existed ! Order # " + dt);

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
                        var strInvs = "select b_name title from cbranch where code=':cust_code' and brno = ':CODE' ".replaceAll(":cust_code", UtilGen.getControlValue(qry.formview.objs["qry1.ord_ref"].obj));
                        UtilGen.Search.getLOVSearchField(strInvs, qry.formview.objs["qry1.ord_branch"].obj, undefined, that.frm.objs["qry1.branchname"].obj);
                        UtilGen.Search.getLOVSearchField("select descr from items where reference = ':CODE'", qry.formview.objs["qry1.ord_item"].obj, undefined, that.frm.objs["qry1.itemname"].obj);
                        thatForm.frm.setFieldValue("qry1.ord_packd", "M3", "M3", true);
                        thatForm.fetchAmts(true);
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
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var objNo = thatForm.frm.objs["qry1.ord_no"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c_nextordx");
                        var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from c_nextordx");
                        var dt = thatForm.view.today_date.getDateValue();


                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);
                        UtilGen.setControlValue(objNo, newno, newno, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();
                        thatForm.clearAmts();

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
        getSqlChange: function (seq) {
            var thatForm = this.thatForm;
            var locval = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
            var sq = thatForm.frm.parseString("select nvl(count(*),0) " +
                " from c_contract_items " +
                " where cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_branch' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate");
            var sqChange = thatForm.frm.parseString("select descr name " +
                " from c_contract_items " +
                " where refer='CODE' and cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_branch' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate").replaceAll("'CODE'", "':CODE'");
            var sqlLst = thatForm.frm.parseString("select refer code ,descr title ,price " +
                " from c_contract_items " +
                " where cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_branch' " +
                " and :qry1.ord_date >= startdate and :qry1.ord_date <= enddate order by 1");
            var sqLstChange = thatForm.frm.parseString("select refer code,descr title " +
                " from c_contract_items " +
                " where refer='CODE' and cust_code=':qry1.ord_ref' and branch_no=':qry1.ord_branch' " +
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
                sqlLst = thatForm.frm.parseString("select reference code,descr title,price1 price from items where 1=2 " +
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
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var getSettingContItems = function (seq) {
                var code = "qry1.ord_item";
                var name = "qry1.itemname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(code),
                    name: Util.nvl(name),
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
                        var locval = thatForm.frm.objs[code].obj.getValue();
                        var s = Util.getSQLValue("select packd from items where reference='" + locval + "'");
                        thatForm.frm.setFieldValue("qry1.ord_packd", s);
                        thatForm.fetchAmts();

                    }
                });
            };
            //1-keyfid,15-10|location_code,10-15               ord_date,15-15|ord_no,5-15
            //2-ord_ref,15-12|ord_refnm,1-22                   ord_item,15-12|branchname,1-22
            //3-ord_item,15-12|itemname,1-22                   ord_pkqty,15-22|ord_packd,1-12
            //4-remarks,15-35                                  stra,15-35            
            return {
                //1
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                location_code: FormView.getFactoryFields.getComboField(
                    "location_code", "@", "locationTxt",
                    "10%", "", "15%",
                    {
                        list: "select code,name  from locations order by code",
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {
                    selectionChange: function () {
                        // var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        // var objno = thatForm.frm.objs["qry1.ord_no"].obj;
                        // var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from c_order1 where ord_code=9 and location_code='" + objOn.getSelectedKey() + "'");
                        // UtilGen.setControlValue(objno, newno, newno, true);
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
                        // thatForm.helperFunc.fetchItem(false);
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
                            // var locval = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
                            thatForm.frm.setFieldValue("qry1.ord_branch", "", "", true);
                            thatForm.checkCLColor();
                            // thatForm.frm.setFieldValue("qry1.salesp", "", "", true);
                            // if (locval != "") {
                            //     var s = Util.getSQLValue("select salesp from c_ycust where code='" + locval + "'");
                            //     thatForm.frm.setFieldValue("qry1.salesp", s, s, true);
                            // }
                        },
                    })),
                ord_refnm: FormView.getFactoryFields.getGeneralField(
                    "ord_refnm", "@", "", "1%", "", "22%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {}),
                ord_branch: FormView.getFactoryFields.getGeneralField(
                    "ord_branch", "@", "txtBranch", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,

                    }, FormView.getFactoryFields.getSettingsBr({
                        thatForm: thatForm,
                        ord_discamt: "qry1.ord_branch",
                        getBtns: function () {
                            return []
                        },
                        fnBeforeChange: function () {
                            thatForm.frm.setFieldValue("qry1.ord_item", "", "", true);
                            thatForm.checkCLColor();
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
                ord_item: FormView.getFactoryFields.getGeneralField(
                    "ord_item", "", "itemTxt", "15%", "violetText", "12%",
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
                oqty: FormView.getFactoryFields.getNumberField(
                    "oqty", "@", "itemPackQty", "15%", "violetText", "22%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, {
                    change: function () {
                        thatForm.fetchAmts();
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
                pump: FormView.getFactoryFields.getGeneralField(
                    "pump", "", "Pump", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        list: "select name code,name from relists where idlist='PUMPS' order by name",
                    }, FormView.getFactoryFields.getListSettings(thatForm, "qry1.pump", "PUMPS")), // pump

                ord_descr: FormView.getFactoryFields.getGeneralField(
                    "ord_descr", "@", "txtRemark", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {}),
                lblLv: FormView.getFactoryFields.getTextField("lblLv", "", "", "100%", "", {}, {}),
                lblLv0: FormView.getFactoryFields.getTextField("lblLv0", "", "txtBalancesCreditLimit", "100%", "qrGroup", {}, {}),
                lblLv1: FormView.getFactoryFields.getTextField("lblLv1", "", "", "100%", "", {}, {}),
                lblLv01: FormView.getFactoryFields.getTextField("lblLv01", "", "txtPrice", "20%", "boldText", {}, {}),
                lblLv02: FormView.getFactoryFields.getTextField("lblLv02", "@", "amountTxt", "20%", "boldText", {}, {}),
                lblLv03: FormView.getFactoryFields.getTextField("lblLv03", "@", "balanceTxt", "20%", "boldText", {}, {}),
                lblLv04: FormView.getFactoryFields.getTextField("lblLv04", "@", "txtCreditLimit", "20%", "boldText", {}, {}),
                lblLv05: FormView.getFactoryFields.getTextField("lblLv05", "@", "overDue", "20%", "boldText", {}, {}),
                txtprice: FormView.getFactoryFields.getMoneyField(
                    "txtprice", "", "", "0px", "", "20%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                        display_style: "totInput",
                    }, {}),
                txtamt: FormView.getFactoryFields.getMoneyField(
                    "txtamt", "@", "", "0px", "", "20%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                        display_style: "totInput",

                    }, {}),
                txtbal: FormView.getFactoryFields.getMoneyField(
                    "txtbal", "@", "", "0px", "", "20%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                        display_style: "totInput",
                    }, {}),
                //credit limit
                txtcl: FormView.getFactoryFields.getMoneyField(
                    "txtcl", "@", "", "0px", "", "20%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                        display_style: "totInput",
                    }, {}),
                //over due
                txtod: FormView.getFactoryFields.getMoneyField(
                    "txtod", "@", "", "0px", "", "20%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                        display_style: "greenInp",

                    }, {}),

            };
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
                            colname: "ORD_BRANCH",
                            mTitle: Util.getLangText("branchNoTxt"),
                        },
                        {
                            colname: "B_NAME",
                            mTitle: Util.getLangText("branchNmTxt"),
                        },
                        {
                            colname: "ORD_ITEM",
                            mTitle: Util.getLangText("itemCode"),
                            hide: true
                        },
                        {
                            colname: "ITEM_NAME",
                            mTitle: Util.getLangText("itemDescr"),
                        },
                        {
                            colname: "OQTY",
                            mTitle: Util.getLangText("orderQtyTxt"),
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select *from (select o1.ord_no,o1.ord_date,o1.ord_ref,o1.ord_refnm," +
                        " o1.ord_branch, c.b_name," +
                        " o1.ord_item, it.descr item_name,o1.oqty||' M3' tqty, " +
                        " o1.keyfld,o1.location_code,o1.ord_descr from c_nextordx o1,cbranch c,items it where " +
                        " it.reference=o1.ord_item and " +
                        " o1.ord_ref=c.code and " +
                        " c.brno=o1.ord_branch " +
                        " order by o1.ord_date desc,o1.ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1)",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ];
        },

        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c_nextordx");
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
            var brno = thatForm.frm.getFieldValue("qry1.ord_branch");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from cbranch where code='" + cod + "' and brno=" + brno);
            if (sqcnt == 0) {
                setTimeout(() => { thatForm.frm.objs["qry1.ord_branch"].focus(); }, 150);
                FormView.err("Save Denied : Branch  is invalid !");
            }
            thatForm.checkCL();
            thatForm.checkExisted();
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



