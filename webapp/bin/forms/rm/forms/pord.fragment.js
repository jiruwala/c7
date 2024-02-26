sap.ui.jsfragment("bin.forms.rm.forms.pord", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        // this.vars = {
        //     keyfld: -1,
        //     flag: 1,  // 1=closed,2 opened,
        //     vou_code: 1,
        //     type: 1
        // };

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
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }
            // 
        });


        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("purchaseReceipt"),
                toolbarBG: "#fff0f5",
                formSetting: {
                    width: { "S": 400, "M": 650, "L": 800 },
                    cssText: [
                        "padding-left:10px;" +
                        "padding-top:20px;" +
                        "border-width: thin;" +
                        "border-style: solid;" +
                        "border-color: lightgreen;" +
                        "margin: 10px;" +
                        "border-radius:25px;" +
                        "background-color:khakhi;"
                    ]
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "0.000" }));
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                },
                print_templates: [],
                events: {
                    afterExeSql: function (oSql) {
                        // thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.code"));
                    },
                    afterLoadQry: function (qry) {

                        if (qry.name == "qry1") {
                            qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                            UtilGen.Search.getLOVSearchField("select name from c_ycust where code = ':CODE' ", qry.formview.objs["qry1.ref_code"].obj, undefined, that.frm.objs["qry1.ref_name"].obj);
                            UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.driver_no"].obj, undefined, that.frm.objs["qry1.drivername"].obj);
                            UtilGen.Search.getLOVSearchField("select descr name from items where reference = ':CODE' ", qry.formview.objs["qry1.refer"].obj, undefined, that.frm.objs["qry1.refername"].obj);
                            UtilGen.Search.getLOVSearchField("select b_name name from cbranch where code='" + qry.formview.objs["qry1.ref_code"].obj.getValue() + "' and  brno = :CODE ", qry.formview.objs["qry1.branch_no"].obj, undefined, that.frm.objs["qry1.branchname"].obj);

                            var kfld = Util.getSQLValue("select pur_keyfld from c7_rmpord where keyfld=" + qry.formview.getFieldValue("keyfld"));
                            if (Util.nvl(kfld, "") != "") {
                                qry.formview.setFormReadOnly();
                                var pn = Util.getSQLValue("select invoice_no from pur1 where keyfld=" + kfld);
                                that.view.byId("txtMsg" + thatForm.timeInLong).setText('Purchase # ' + pn);

                            }
                        }
                    },
                    beforeLoadQry: function (qry, sql) {
                        return sql;
                    },
                    afterSaveQry: function (qry) {

                    },
                    afterSaveForm: function (frm, nxtStatus) {
                        frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
                    },
                    beforeSaveQry: function (qry, sqlRow, rowNo) {
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                        return "";
                    },
                    afterNewRow: function (qry, idx, ld) {
                        if (qry.name == "qry1") {
                            var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_rmpord");
                            qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                            qry.formview.setFieldValue("qry1.location_code", sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                            qry.formview.setFieldValue("qry1.packqty", 0, 0, true);

                            that.frm.setFieldValue("pac", "", "", true);
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                            that.view.byId("numtxt" + thatForm.timeInLong).setText("");

                            var dt = thatForm.view.today_date.getDateValue();
                            qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);

                        }
                    },
                    beforeDeleteValidate: function (frm) {
                        // var qry = that.frm.objs["qry1"];
                        // if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        //     (qry.status == FormView.RecordStatus.VIEW)) {
                        //     var valx = that.frm.getFieldValue("pac");
                        //     var accno = that.frm.getFieldValue("qry1.code");
                        //     if (valx != accno) {
                        //         FormView.err("Account not same as " + accno + " <> " + valx + " , Refresh data !");
                        //     }
                        //     var vldtt = Util.getSQLValue("select usecount from accostcent1 where code = " + Util.quoted(valx));
                        //     if (Util.nvl(vldtt, 0) > 0) {
                        //         FormView.err("Err ! , this cost center have transaction #" + vldtt);
                        //     }
                        // }
                    },
                    beforeDelRow: function (qry, idx, ld, data) {

                    },
                    afterDelRow: function (qry, ld, data) {
                        if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                            qry.obj.addRow();
                        return "";
                    },
                    onCellRender: function (qry, rowno, colno, currentRowContext) {
                    },
                    beforePrint: function (rptName, params) {
                        return params;
                    }

                },
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
                        dml: "select *from c7_rmpord  where keyfld=':pac'",
                        where_clause: " keyfld=':keyfld'",
                        update_exclude_fields: ["ref_name", "drivername", "refername", "branchname"],
                        insert_exclude_fields: ["ref_name", "drivername", "refername", "branchname"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                            "FLAG": 1,
                        },
                        update_default_values: {},
                        table_name: "c7_rmpord",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: {
                            keyfld: {
                                colname: "keyfld",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Key Id\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            location_code: {
                                colname: "location_code",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '@{\"text\":\"locationTxt\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: sett["DEFAULT_LOCATION"],
                                list: "select code,name from locations order by code",
                                other_settings: {
                                    width: "35%",
                                    customData: [{ key: "" }],
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true
                            },
                            ord_date: {
                                colname: "ord_date",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.DATEFIELD,
                                title: '{\"text\":\"ordDate\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                default_value: "$TODAY",
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            dlv_no: {
                                colname: "dlv_no",
                                data_type: FormView.DataType.Number,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"rcptNo\",\"width\":\"25%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            driver_no: {
                                colname: "driver_no",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"txtDriver\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "25%",
                                    showValueHelp: true,
                                    change: function (e) {

                                        UtilGen.Search.getLOVSearchField("select name from salesp where type='D' and no = ':CODE'", that.frm.objs["qry1.driver_no"].obj, undefined, that.frm.objs["qry1.drivername"].obj);

                                    },
                                    valueHelpRequest: function (e) {
                                        UtilGen.Search.do_quick_search(e, this,
                                            "select no code,Name title from salesp where type='D' order by no ",
                                            "select no code,name title from salesp where type='D' and no=:CODE", that.frm.objs["qry1.drivername"].obj);

                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            drivername: {
                                colname: "drivername",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "59%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            truck_no: {
                                colname: "truck_no",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"truckNo\",\"width\":\"75%\","textAlign":"End","styleClass":""}',
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
                            ref_code: {
                                colname: "ref_code",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"refCode\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "25%",
                                    showValueHelp: true,
                                    change: function (e) {
                                        UtilGen.setControlValue(that.frm.objs["qry1.refer"].obj, "", "", false);
                                        UtilGen.setControlValue(that.frm.objs["qry1.refername"].obj, "", "", false);
                                        UtilGen.setControlValue(that.frm.objs["qry1.branch_no"].obj, "", "", false);
                                        UtilGen.setControlValue(that.frm.objs["qry1.branchname"].obj, "", "", false);

                                        UtilGen.Search.getLOVSearchField("select name from c_ycust where childcount=0 and code = ':CODE'", that.frm.objs["qry1.ref_code"].obj, undefined, that.frm.objs["qry1.ref_name"].obj);

                                    },
                                    valueHelpRequest: function (e) {
                                        UtilGen.Search.do_quick_search(e, this,
                                            "select code,Name title from c_ycust where issupp='Y' and childcount=0  order by path ",
                                            "select code,name title from c_ycust where code=:CODE", that.frm.objs["qry1.ref_name"].obj);

                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            ref_name: {
                                colname: "ref_name",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "59%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            branch_no: {
                                colname: "branch_no",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "25%",
                                    showValueHelp: true,
                                    change: function (e) {
                                        UtilGen.setControlValue(that.frm.objs["qry1.refer"].obj, "", "", false);
                                        UtilGen.setControlValue(that.frm.objs["qry1.refername"].obj, "", "", false);
                                        UtilGen.Search.getLOVSearchField("select b_name from cbranch where code='" + that.frm.objs["qry1.ref_code"].obj.getValue() + "'  and  BRNO = ':CODE'", that.frm.objs["qry1.branch_no"].obj, undefined, that.frm.objs["qry1.branchname"].obj);
                                    },
                                    valueHelpRequest: function (e) {
                                        UtilGen.Search.do_quick_search(e, this,
                                            "select brno code,b_name TITLE from CBRANCH where code='" + that.frm.objs["qry1.ref_code"].obj.getValue() + "'  order by BRNO ",
                                            "select brno code,b_name title from cbranch where code=:CODE", that.frm.objs["qry1.branchname"].obj);
                                    },
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
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "59%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            refer: {
                                colname: "refer",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"txtProd\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "25%",
                                    showValueHelp: true,
                                    change: function (e) {
                                        // UtilGen.Search.getLOVSearchField("select descr name from items where childcount=0 and reference = ':CODE'", that.frm.objs["qry1.refer"].obj, undefined, that.frm.objs["qry1.refername"].obj);

                                        var sqcnt = "select nvl(count(*),0) cnts from c_contract_items" +
                                            " where cust_code=':ref_code' and branch_no=':loc' and refer=':refer' order by refer "
                                                .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ref_code"))
                                                .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.branch_no"))
                                                .replaceAll(":refer", that.frm.objs["qry1.refer"].obj.getValue());

                                        var cnt = Util.getSQLValue(sqcnt);
                                        if (cnt <= 0) {
                                            var sq = ("SELECT refer code,ITEMS.DESCR title " +
                                                " FROM CUSTITEMS,ITEMS " +
                                                " WHERE REFERENCE=REFER AND CODE='" + thatForm.frm.getFieldValue("qry1.ref_code") + "' and custitems.refer=':refer'").replaceAll(":refer", that.frm.objs["qry1.refer"].obj.getValue());
                                            cnt = Util.getSQLValue(sq);
                                        }
                                        if (cnt <= 0) {
                                            UtilGen.setControlValue(that.frm.objs["qry1.refer"].obj, "", "", false);
                                            UtilGen.setControlValue(that.frm.objs["qry1.refername"].obj, "", "", false);
                                            FormView.err("Not found item !");
                                            return;
                                        }
                                        var txtDescr = thatForm.frm.objs['qry1.refername'].obj;
                                        var txtPackd = thatForm.frm.objs['qry1.packd'].obj;
                                        var txtUnitd = thatForm.frm.objs['qry1.unitd'].obj;
                                        var txtPack = thatForm.frm.objs['qry1.pack'].obj;
                                        var dtx = Util.execSQLWithData("select descr,packd,pack,unitd from items where flag=1 and childcounts=0 and reference = ':CODE'".replaceAll(":CODE", this.getValue()));
                                        if (dtx != undefined && dtx.length > 0) {
                                            UtilGen.setControlValue(txtDescr, dtx[0].DESCR, dtx[0].DESCR, true);
                                            UtilGen.setControlValue(txtPackd, dtx[0].PACKD, dtx[0].PACKD, true);
                                            UtilGen.setControlValue(txtUnitd, dtx[0].UNITD, dtx[0].UNITD, true);
                                            UtilGen.setControlValue(txtPack, dtx[0].PACK, dtx[0].PACK, true);
                                            // txtDescr.setValue(dtx[0].DESCR);
                                            // txtPackd.setValue(dtx[0].PACKD);
                                            // txtUnitd.setValue(dtx[0].UNITD);
                                            // txtPack.setValue(dtx[0].PACK);
                                        } else {
                                            UtilGen.setControlValue(that.frm.objs["qry1.refer"].obj, "", "", false);
                                            UtilGen.setControlValue(that.frm.objs["qry1.refername"].obj, "", "", false);
                                            FormView.err("Not found item !");
                                        }
                                    },
                                    valueHelpRequest: function (e) {
                                        var sqcnt = "select nvl(count(*),0) cnts from c_contract_items" +
                                            " where cust_code=':ref_code' and branch_no=':loc' order by refer "
                                                .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ref_code"))
                                                .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.branch_no"));

                                        var sq = "select distinct refer code,descr title from c_contract_items" +
                                            " where cust_code=':ref_code' and branch_no=':loc' order by refer "
                                                .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ref_code"))
                                                .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.branch_no"));
                                        var cnt = Util.getSQLValue(sqcnt);
                                        if (cnt <= 0) {
                                            sq = "SELECT refer code,ITEMS.DESCR title " +
                                                " FROM CUSTITEMS,ITEMS " +
                                                " WHERE REFERENCE=REFER AND CODE='" + thatForm.frm.getFieldValue("qry1.ref_code") + "'";
                                        }
                                        UtilGen.Search.do_quick_search(e, this, sq, "select reference code,descr title from items where reference=:CODE", that.frm.objs["qry1.refername"].obj);

                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            refername: {
                                colname: "refername",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "59%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: false
                            },
                            packqty: {
                                colname: "packqty",
                                data_type: FormView.DataType.Number,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"itemPackQty\",\"width\":\"75%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_END",
                                display_style: "",
                                display_value: "0",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            packd: {
                                colname: "packd",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"itemPackD\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            unitd: {
                                colname: "unitd",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"itemUnit\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                            pack: {
                                colname: "pack",
                                data_type: FormView.DataType.Number,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"itemPack\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: true
                            },
                        },
                    }

                ],
                canvas: [],
                commands: [
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
                    },
                    {
                        name: "cmdNew",
                        canvas: "default_canvas",
                        title: "New..",
                        onPress: function (e) {
                            that.frm.setFieldValue("pac", "", "", true);
                        }
                    },
                    {
                        name: "cmdList",
                        canvas:
                            "default_canvas",
                        list_name:
                            "list1"
                    }
                    ,
                    {
                        name: "cmdClose",
                        canvas:
                            "default_canvas",
                        title:
                            "Close",
                        obj:
                            new sap.m.Button({
                                icon: "sap-icon://decline",
                                press: function () {
                                    that2.joApp.backFunction();
                                }
                            })
                    }
                ],
                lists: [
                    {
                        name: 'list1',
                        title: "List ",
                        list_type: "sql",
                        cols: [
                            {
                                colname: 'KEYFLD',
                                return_field: "pac",
                            },
                            {
                                colname: 'DLV_NO'
                            },
                            {
                                colname: 'REF_CODE'
                            },
                            {
                                colname: 'NAME'
                            },

                        ],  // [{colname:'code',width:'100',return_field:'pac' }]
                        sql: "SELECT p.keyfld,TO_CHAR(p.ord_date,'DD/MM/RRRR') ORD_DATE,p.DLV_NO,p.REF_CODE, c.name from C7_RMPORD p,c_ycust c where c.code=p.ref_code order by p.keyfld desc ",
                        afterSelect: function (data) {
                            that2.frm.loadData(undefined, "view");
                            return true;
                        }
                    }
                ]

            }
        }
            ;
        this.frm = new FormView(this.mainPage);
        this.frm.view = view;
        this.frm.pg = this.mainPage;
        this.frm.parseForm(js);
        this.frm.createView();

        // this.mainPage.addContent(sc);

    },
    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";


        // this.cs = {};
        // this.cs.code = UtilGen.addControl(fe, "Code", sap.m.Input, "Cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: codSpan}),
        //     }, "string", undefined, this.view);
        // this.cs.title = UtilGen.addControl(fe, "@Title", sap.m.Input, "cs" + this.timeInLong + "_",
        //     {
        //         enabled: true,
        //         layoutData: new sap.ui.layout.GridData({span: titSpan}),
        //     }, "string", undefined, this.view);
        //
        //
        // return UtilGen.formCreate("", true, fe);
        // return UtilGen.formCreate("", true, fe, undefined, undefined, [1, 1, 1]);

    }
    ,
    loadData: function () {
        var frag = this;
        frag.oController.status = Util.nvl(frag.oController.status, 'new');
        frag.frm.readonly = Util.nvl(frag.oController.readonly, false);

        if (frag.frm.readonly)
            frag.oController.status = "view";


        if (frag.oController.nolist)
            frag.frm.cmdButtons.cmdList.setVisible(false);

        if (frag.oController.readonly) {
            frag.frm.cmdButtons.cmdNew.setVisible(false);
            frag.frm.cmdButtons.cmdEdit.setVisible(false);
            frag.frm.cmdButtons.cmdDel.setVisible(false);
        }

        if (frag.oController.status != FormView.RecordStatus.NEW) {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld), "");
            frag.frm.setQueryStatus(undefined, frag.oController.status);
        } else {
            frag.frm.setFieldValue('pac', Util.nvl(frag.qryStr), "");
            frag.frm.setQueryStatus(undefined, Util.nvl(frag.oController.status, FormView.RecordStatus.NEW));
        }
        if (frag.qryStr != "")
            frag.frm.loadData(undefined, frag.oController.status);
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



