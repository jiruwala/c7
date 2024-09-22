sap.ui.jsfragment("bin.forms.gl.rp", {

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
        this.brPage = new sap.m.Page({
            showHeader: false,
            content: []
        }).addStyleClass("sapUiSizeCompact");

        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        this.joApp.addDetailPage(this.brPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };

        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
                that.get_new_cust();
            }
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }

        });


        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    get_new_cust: function () {
        var that = this;
        var cod = Util.nvl(that.frm.getFieldValue("pac"), "");
        if (cod != "") {
            sap.m.MessageToast.show("You are  Editing Customer.# " + this.qryStr);
            return;
        }
        var pacc = that.frm.objs["qry1.parentcustomer"].obj;
        var paccname = that.frm.objs["qry1.parentcustname"].obj;
        var accno = that.frm.objs["qry1.code"].obj;
        if ((pacc.getEnabled()) && Util.nvl(UtilGen.getControlValue(pacc), "") == "") {
            UtilGen.doSearch(
                undefined, "select code,name title from c_ycust where usecount=0 order by path ", pacc, function () {
                    if (Util.nvl(UtilGen.getControlValue(pacc), "") == "")
                        return;
                    var pac = Util.nvl(UtilGen.getControlValue(pacc), "");
                    var nn = Util.getSQLValue("select to_number(nvl(max(code),0))+1 from c_ycust where parentcustomer=" + Util.quoted(pac));
                    if (nn == 1)
                        nn = pac + "01";
                    UtilGen.setControlValue(accno, nn, nn, true);
                }, "Select parent Cost center", paccname);
        } else {
            var pac = Util.nvl(UtilGen.getControlValue(pacc), "");
            var nn = Util.getSQLValue("select to_number(nvl(max(code),0))+1 from c_ycust where parentcustomer=" + Util.quoted(pac));
            if (nn == 1)
                nn = pac + "001";

            UtilGen.setControlValue(accno, nn, nn, true);
        }

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
    canAccAssign: function (ac) {
        if (Util.isNull(ac)) {
            this.errStr = "Err ! No account is assigned !";
            UtilGen.errorObj(this.frm.objs["qry1.ac_no"].obj);
            return false;
        }
        var n = Util.getSQLValue("select nvl(count(*),0) from acaccount where parentacc=" + Util.quoted(ac));
        if (n > 0) {
            this.errStr = "Err ! , Account  is having sub-accounts , cant assign  !";
            return false;
        }
        return true;
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
        // this.createBranches();
        var js = {
            form: {
                title: "R&P Card",
                toolbarBG: Util.nvl(UtilGen.toolBarBackColor, "#d1e189"),
                formSetting: {
                    width: { "S": 400, "M": 700, "L": 800 },
                    cssText: [
                        "padding-left:10px;" +
                        "padding-top:20px;" +
                        "border-width: thin;" +
                        "border-style: solid;" +
                        "border-color: lightgreen;" +
                        "margin: 5px;" +
                        "border-radius:25px;" +
                        "background-color:#d1e189;"
                    ]
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("btBranch" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("btci" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("btCont" + thatForm.timeInLong, thatForm.view);


                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "0.000" }));


                    var btBranch = new sap.m.Button(thatForm.view.createId("btBranch" + thatForm.timeInLong), {
                        text: Util.getLangText("txtBranches"),
                        press: function () {
                            thatForm.showBranches();
                        }
                    });
                    var btCustItems = new sap.m.Button(thatForm.view.createId("btci" + thatForm.timeInLong), {
                        text: Util.getLangText("custItems"),
                        press: function () {
                            thatForm.showCustItems();
                        }
                    });
                    var btCustContract = new sap.m.Button(thatForm.view.createId("btCont" + thatForm.timeInLong), {
                        text: Util.getLangText("custContract"),
                        press: function () {

                            if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                                that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                                Util.simpleConfirmDialog(Util.getLangText("msgSaveFormData"), function (oAction) {
                                    that.frm.cmdButtons.cmdSave.firePress();
                                    thatForm.showCustContract();
                                });
                            } else
                                thatForm.showCustContract();
                        }
                    });

                    var hb = new sap.m.Toolbar({
                        content: [btBranch, btCustItems, btCustContract, txt, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                },
                print_templates: [],
                events: {
                    afterExeSql: function (oSql) {
                        thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.code"));
                    },
                    afterLoadQry: function (qry) {
                        var sett = sap.ui.getCore().getModel("settings").getData();
                        thatForm.fetchBranch = false;
                        thatForm.fetchCustItems = false;
                        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                        if (qry.name == "qry1") {
                            var par = that.frm.getFieldValue("qry1.parentcustomer");
                            if (Util.nvl(par, "") != "") {
                                var s = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(par));
                                UtilGen.setControlValue(that.frm.objs["qry1.parentcustomer"].obj, par, par, false);
                                UtilGen.setControlValue(that.frm.objs["qry1.parentcustname"].obj, s, s, false);
                            }
                            var acn = that.frm.getFieldValue("qry1.ac_no");
                            if (Util.nvl(acn, "") != "") {
                                var s = Util.getSQLValue("select name from acaccount where accno=" + Util.quoted(acn));
                                UtilGen.setControlValue(that.frm.objs["qry1.ac_no"].obj, acn, acn, false);
                                UtilGen.setControlValue(that.frm.objs["qry1.acname"].obj, s, s, false);
                            }
                            var sls = that.frm.getFieldValue("qry1.salesp");
                            if (Util.nvl(sls, "") != "") {
                                var s = Util.getSQLValue("select name from acaccount where accno=" + Util.quoted(sls));
                                UtilGen.setControlValue(that.frm.objs["qry1.salesp"].obj, sls, sls, false);
                                UtilGen.setControlValue(that.frm.objs["qry1.salesname"].obj, s, s, false);
                            }
                            UtilGen.Vouchers.attachLoadQry(that2, qry, 'RP', that2.frm.getFieldValue("qry1.code"));
                        }
                    },
                    addSqlAfterInsert: function (qry, rn) {
                        if (qry.name == "qry1" && Util.nvl(that.frm.getFieldValue("par"), "") == "") {
                            var pac = that.frm.getFieldValue("qry1.parentcustomer");
                            var s1 = "";
                            if (pac != "") {
                                s1 = "update c_ycust set childcount=(select nvl(count(*),0) from c_ycust where parentcustomer=':qry1.parentcustomer') where code=':qry1.parentcustomer' ; "
                                s1 = that.frm.parseString(s1);
                            }

                            var sq = "insert into cbranch(BRNO, CODE, ACCNO, B_NAME) VALUES (1,':qry1.code',':qr1.ac_no',':qry1.name');";
                            if (that2.fetchBranch && that2.qb != undefined && that2.qb.mLctb.rows.length > 0)
                                sq = Util.nvl(that2.doUpdateBranches(), sq);

                            var sq2 = "";
                            if (that2.fetchCustItems && that2.qc != undefined && that2.qc.mLctb.rows.length > 0)
                                sq2 = Util.nvl(that2.doUpdateCustItems(), sq2);

                            sq = that.frm.parseString(sq);
                            sq2 = that.frm.parseString(sq2);
                            return s1 + sq + sq2;
                        }

                        return "";
                    },
                    addSqlAfterUpdate: function (qry, rn) {
                        if (qry.name == "qry1" && Util.nvl(that.frm.getFieldValue("par"), "") == "") {
                            var pac = that.frm.getFieldValue("qry1.parentcustomer");
                            var s1 = "";
                            if (pac != "") {
                                s1 = "update c_ycust set childcount=(select nvl(count(*),0) from c_ycust where parentcustomer=':qry1.parentcustomer') where code=':qry1.parentcustomer' ; "
                                s1 = that.frm.parseString(s1);
                            }
                            var sq = "";
                            if (that2.fetchBranch && that2.qb != undefined && that2.qb.mLctb.rows.length > 0)
                                sq = that.frm.parseString(Util.nvl(that2.doUpdateBranches(), sq));

                            var sq2 = "";
                            if (that2.fetchCustItems && that2.qc != undefined && that2.qc.mLctb.rows.length > 0)
                                sq2 = that.frm.parseString(Util.nvl(that2.doUpdateCustItems(), sq2));

                            return s1 + sq + sq2;
                        }

                        return "";
                    },
                    addSqlBeforeUpdate: function (qry, rn) {
                        if (qry.name == "qry1" && Util.nvl(that.frm.getFieldValue("par"), "") == "") {
                            var pac = Util.getSQLValue("select parentcustomer from c_ycust where code=" + that.frm.getFieldValue("qry1.code"));
                            var s1 = "";
                            if (pac != "") {
                                s1 = "update c_ycust set childcount=(select nvl(count(*),0) from c_ycust where parentcustomer=':qry1.parentcustomer') where code=':qry1.parentcustomer' ; "
                                s1 = that.frm.parseString(s1);
                            }
                            return s1;
                        }

                        return "";
                    },
                    beforeLoadQry: function (qry, sql) {
                        return sql;
                    },
                    afterSaveQry: function (qry) {

                    },
                    afterSaveForm: function (frm, nxtStatus) {

                    },
                    beforeSaveQry: function (qry, sqlRow, rowNo) {
                        if (qry.name == "qry1") {
                            var par = that.frm.getFieldValue("qry1.parentcustomer");
                            var cod = that.frm.getFieldValue("qry1.code");
                            var acn = that.frm.getFieldValue("qry1.ac_no");
                            if (!that.canCustParent(par))
                                FormView.err(that.errStr);
                            if (!that.canAccAssign(acn))
                                FormView.err(that.errStr);


                            if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                                var v1 = Util.getSQLValue("select parentcustomer from c_ycust where code=" + Util.quoted(cod));
                                if (v1 != par) {
                                    n = Util.getSQLValue("select nvl(count(*),0) from c_ycust where code=" + Util.quoted(cod));
                                    if (n > 0)
                                        FormView.err("Err ! ,due to change of Parent customer,  this customer have childerens  !");
                                }
                            }

                            sqlRow["path"] = Util.quoted(that.generateCustPath(par, cod));
                            sqlRow["levelno"] = (sqlRow["path"]).match((/\\/g) || []).length - 1;
                            UtilGen.Vouchers.attachSaveQry(that2, "RP", that2.frm.getFieldValue("qry1.code"));
                        }

                        return "";
                    },
                    afterNewRow: function (qry, idx, ld) {
                        thatForm.fetchBranch = false;
                        thatForm.fetchCustItems = false;
                        if (qry.name == "qry1") {
                            thatForm.fileUpload = undefined;
                            that.frm.setFieldValue("pac", "", "", true);
                            that.frm.setFieldValue("qry1.crd_limit2", 0, 0, true);
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                            that.view.byId("numtxt" + thatForm.timeInLong).setText("");
                            that.frm.objs["qry1.etype"].obj.setSelectedItem(that.frm.objs["qry1.etype"].obj.getItems()[0]);
                            that.frm.objs["qry1.type"].obj.setSelectedItem(that.frm.objs["qry1.type"].obj.getItems()[0]);
                        }
                    },
                    beforeDeleteValidate: function (frm) {
                        var qry = that.frm.objs["qry1"];
                        if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                            (qry.status == FormView.RecordStatus.VIEW)) {
                            var valx = that.frm.getFieldValue("pac");
                            var accno = that.frm.getFieldValue("qry1.code");
                            if (valx != accno) {
                                FormView.err("Customer is not same as " + accno + " <> " + valx + " , Refresh data !");
                            }
                            var vldtt = Util.getSQLValue("select nvl(count(*),0) from pur1 where c_cus_no = " + Util.quoted(valx));
                            if (Util.nvl(vldtt, 0) > 0) {
                                FormView.err("Err ! , this customer have transaction in Purchase/Sales # " + vldtt);
                            }

                            var vldtt = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_ref = " + Util.quoted(valx));
                            if (Util.nvl(vldtt, 0) > 0) {
                                FormView.err("Err ! , this customer have transaction in Delieries # " + vldtt);
                            }

                            var vldtt = Util.getSQLValue("select nvl(count(*),0) from acvoucher2 where cust_code = " + Util.quoted(valx));
                            if (Util.nvl(vldtt, 0) > 0) {
                                FormView.err("Err ! , this customer have transaction in Accounts # " + vldtt);
                            }
                            var vldtt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer = " + Util.quoted(valx));
                            if (Util.nvl(vldtt, 0) > 0) {
                                FormView.err("Err ! , this customer have sub-customers  #" + vldtt);
                            }
                        }
                    },
                    beforeDelRow: function (qry, idx, ld, data) {

                    },
                    afterDelRow: function (qry, ld, data) {
                        var delAdd = "";
                        if (qry.name == "qry1") {
                            delAdd = "delete from c7_attach where kind_of='RP'and refer=:qry1.code ;";

                            var pac = that.frm.getFieldValue("qry1.parentcustomer");
                            var s1 = "";
                            if (pac != "") {
                                s1 = "update c_ycust set childcount=(select nvl(count(*),0) from c_ycust where parentcustomer=':qry1.parentcustomer') where code=':qry1.parentcustomer' ; "
                                s1 = that.frm.parseString(s1);
                            }

                            return s1 + "delete from cbranch where code=:pac ;" + delAdd;
                        }

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
                        dml: "select *from c_ycust where code=':pac'",
                        where_clause: " code=':code'",
                        update_exclude_fields: ["parentcustname", "acname", "salesname", "code", "tit1", "attachment"],
                        insert_exclude_fields: ["parentcustname", "acname", "salesname", "tit1", "attachment"],
                        insert_default_values: {
                            "CREATDT": "sysdate",
                            "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                        },
                        update_default_values: {},
                        table_name: "c_ycust",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: {
                            iscust: {
                                colname: "iscust",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '{\"text\":\"Is Cust\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "10%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                trueValues: ["Y", "N"]
                            },
                            issupp: {
                                colname: "issupp",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '@{\"text\":\"Is Supp\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "10%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                trueValues: ["Y", "N"]
                            },
                            isbankcash: {
                                colname: "isbankcash",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '@{\"text\":\"Bank/Cash\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "10%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                trueValues: ["Y", "N"]
                            },
                            attachment: {
                                colname: "attachment",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Attachment\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_BEGIN",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    showValueHelp: true,
                                    editable: false,
                                    width: "20%",
                                    valueHelpRequest: function (e) {
                                        if (that2.frm.objs["qry1"].status != FormView.RecordStatus.EDIT &&
                                            that2.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                                            return;
                                        UtilGen.Vouchers.attachShowUpload(that2);
                                    }
                                },

                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            code: {
                                colname: "code",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Code\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true
                            },
                            etype: {
                                colname: "etype",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '@{\"text\":\"Type\",\"width\":\"30%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "35%",
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                list: "@1/Local,2/Foreign"
                            },
                            name: {
                                colname: "name",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Name\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            namea: {
                                colname: "namea",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Name 2\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            parentcustomer: {
                                colname: "parentcustomer",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Parent\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "20%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (e) {
                                        UtilGen.Search.do_quick_search(e, this,
                                            "select code,name title from c_ycust where usecount=0 order by path ",
                                            "select code,name title from c_ycust where usecount=0 and code=:CODE", thatForm.frm.objs["qry1.parentcustname"].obj, undefined, undefined, undefined);

                                    },
                                    change: function (e) {
                                        var control = this;
                                        var pacnm = thatForm.frm.objs["qry1.parentcustname"].obj;
                                        UtilGen.setControlValue(pacnm, "", "", true);
                                        var acn = thatForm.frm.objs["qry1.ac_no"].obj;
                                        var iscust = thatForm.frm.objs["qry1.iscust"].obj;
                                        var issupp = thatForm.frm.objs["qry1.issupp"].obj;
                                        var isbc = thatForm.frm.objs["qry1.isbankcash"].obj;
                                        var vl = control.getValue();
                                        var dt = Util.execSQL("select name,ac_no,iscust,issupp,isbankcash from c_ycust where code = " + Util.quoted(vl));
                                        if (dt.ret != "SUCCESS") {
                                            sap.m.MessageToast.show("Err! ");
                                            return;
                                        }
                                        var dtx = JSON.parse("{" + dt.data + "}").data;
                                        // var pnm = Util.getSQLValue("select name from c_ycust where code = " + Util.quoted(vl));
                                        UtilGen.setControlValue(pacnm, dtx[0].NAME, dtx[0].NAME, true);
                                        UtilGen.setControlValue(control, vl, vl, false);
                                        UtilGen.setControlValue(acn, dtx[0].AC_NO, dtx[0].AC_NO, true);
                                        UtilGen.setControlValue(iscust, dtx[0].ISCUST, dtx[0].ISCUST, true);
                                        UtilGen.setControlValue(issupp, dtx[0].ISSUPP, dtx[0].ISSUPP, true);
                                        UtilGen.setControlValue(isbc, dtx[0].ISBANKCASH, dtx[0].ISBANKCASH, true);
                                        that.get_new_cust(vl);

                                    }
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            parentcustname: {
                                colname: "parentcustname",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\" \",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "64%"
                                },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: false,
                            },
                            ac_no: {
                                colname: "ac_no",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"A/c No\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "20%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (e) {

                                        UtilGen.Search.do_quick_search(e, this,
                                            "select accno code,name title from acaccount where actype=0 and childcount=0 order by path ",
                                            "select accno code,name title from acaccount where actype=0 and childcount=0 and accno=:CODE", thatForm.frm.objs["qry1.acname"].obj, undefined, undefined, undefined);
                                    },
                                    change: function (e) {

                                        var control = this;
                                        var vl = control.getValue();
                                        var pacnm = thatForm.frm.objs["qry1.acname"].obj;
                                        UtilGen.setControlValue(pacnm, "", "", true);
                                        var pnm = Util.getSQLValue("select name from acaccount where childcount=0 and accno = " + Util.quoted(vl));
                                        UtilGen.setControlValue(pacnm, pnm, pnm, true);
                                        UtilGen.setControlValue(control, vl, vl, false);


                                    }
                                },
                                edit_allowed: false,
                                insert_allowed: true,
                                require: true,

                            },
                            acname: {
                                colname: "acname",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "64%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: false
                            },
                            crd_limit2: {
                                colname: "crd_limit2",
                                data_type: FormView.DataType.Number,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Crd Limit\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: sett["FORMAT_MONEY_1"],
                                default_value: "0",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true
                            },
                            type: {
                                colname: "type",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '@{\"text\":\"Selling\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "35%",
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                list: "@ANY/ANY,WHOLESALE/WHOLESALE,RETAIL/RETAIL"

                            },
                            salesp: {
                                colname: "salesp",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Sales Man\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: {
                                    width: "20%",
                                    showValueHelp: true,
                                    valueHelpRequest: function (e) {
                                        if (e.getParameters().clearButtonPressed || e.getParameters().refreshButtonPressed) {
                                            UtilGen.setControlValue(this, "", "", true);
                                            UtilGen.setControlValue(thatForm.frm.objs["qry1.salesname"].obj, "", "", true);
                                            return;
                                        }
                                        var control = this;
                                        var pacnm = thatForm.frm.objs["qry1.salesname"].obj
                                        var sq = "select no,name from salesp where order by NO ";
                                        Util.showSearchList(sq, "NAME", "NO", function (valx, val) {
                                            UtilGen.setControlValue(control, valx, valx, true);
                                            UtilGen.setControlValue(pacnm, val, val, true);
                                        }, "Select Sales person");

                                    },
                                },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,

                            },
                            salesname: {
                                colname: "salesname",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "64%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: false,
                            },
                            tit1: {
                                colname: "tit1",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.LABEL,
                                title: '#{\"text\":\"Additional Details :\",\"width\":\"99%\","textAlign":"Begin","styleClass":"qrGroup","style":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "1%" },
                                edit_allowed: false,
                                insert_allowed: false,
                                require: false
                            },
                            reference: {
                                colname: "reference",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Reference\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            license: {
                                colname: "license",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Licnese\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },

                            tel: {
                                colname: "tel",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Tel\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            addr: {
                                colname: "addr",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Address\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "25%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            area: {
                                colname: "area",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Area\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            fax: {
                                colname: "fax",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Fax\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "20%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            email: {
                                colname: "email",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"Email\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                            remark: {
                                colname: "remark",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"Remark\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                canvas: "default_canvas",
                                display_width: codSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                other_settings: { width: "35%" },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false
                            },
                        }
                    }
                ],
                canvas: [],
                commands: [
                    {
                        name: "cmdSave",
                        canvas: "default_canvas",
                        onPress: function (e) {
                            // var ac = that2.frm.getFieldValue("accno");
                            // var ac = that2.frm.parseString("select from acaccount where accno=':pac'");
                            // var sv = that2.frm.getSQLUpdateString("qry1", undefined, ['code'], " CODE=':code' ");
                            // console.log(sv);
                            // sap.m.MessageToast.show("Saved...", {
                            //     my: sap.ui.core.Popup.Dock.RightBottom,
                            //     at: sap.ui.core.Popup.Dock.RightBottom
                            // });

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
                    },
                    {
                        name: "cmdAttach",
                        canvas: "default_canvas",
                        title: "Attachment",

                        obj: new sap.m.Button({
                            icon: "sap-icon://pdf-attachment",
                            press: function () {
                                UtilGen.Vouchers.attachShowUpload(that2, false);
                            }
                        })
                    },
                    // {
                    //     name: "cmdPrint",
                    //     canvas:
                    //         "default_canvas",
                    //     title:
                    //         "SOA",
                    //     onPress:

                    //         function (e) {
                    //             var ac = that.frm.getFieldValue("pac");
                    //             UtilGen.execCmd("testRep5 formType=dialog repno=0 para_PARAFORM=false para_EXEC_REP=true costcent=" + ac + " fromdate=@01/01/2020", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage);
                    //             return true;
                    //         }
                    // }
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
                                colname: 'CODE',
                                return_field: "pac",
                            },
                            {
                                colname: "NAME",
                            },
                        ],  // [{colname:'code',width:'100',return_field:'pac' }]
                        sql: "select code, name from c_ycust order by path",
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
        // if (Util.nvl(this.oController.accno, "") != "" &&
        //     Util.nvl(this.oController.status, "view") == FormView.RecordStatus.VIEW) {
        //     this.frm.setFieldValue("pac", this.oController.accno, this.oController.accno, true);
        //     this.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        //     this.oController.accno = "";
        //     return;

        // }
        this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
    }
    ,
    showBranches: function () {
        var that2 = this;
        if (this.qb == undefined) {
            this.qb = new QueryView("qrBranches" + that2.timeInLong);
            this.qb.getControl().setEditable(true);
            this.qb.getControl().view = that2.view;
            this.qb.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
            this.qb.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
            this.qb.getControl().setFixedBottomRowCount(0);
            this.qb.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
            UtilGen.createDefaultToolbar1(this.qb, ["B_NAME", "AREA"], true);
            // this.qb.getControl().setVisibleRowCount(10);
            this.qb.insertable = true;
            this.qb.deletable = true;
            // this.qb.setEditable(false);
        }
        if (that2.fetchBranch == false)
            that2.qb.reset();
        var cc = "";
        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            cc = that2.frm.getFieldValue("qry1.code");
        }
        var seteditale = function () {
            if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW)) {
                sap.m.MessageToast.show("Must Form EDIT or NEW mode to edit and add branches ! ");
                cmdEdit.setPressed(false);
                that2.qb.editable = false
                setTimeout(function () {
                    that2.qb.colorRows();
                });
                return;
            }

            if (cmdEdit.getPressed())
                that2.qb.editable = true;
            else
                that2.qb.editable = false
            fetchData();
            setTimeout(function () {
                that2.qb.colorRows();
            });
        }
        var fetchData = function () {
            var qv = that2.qb;
            if (that2.fetchBranch) {
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

            var dt = Util.execSQL("select brno,b_name,area,block,jedda,street,qasima from cbranch where code=" + Util.quoted(cc) + " order by brno");
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("BRNO")].getMUIHelper().display_width = 50;

                qv.mLctb.cols[qv.mLctb.getColPos("BRNO")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("B_NAME")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("AREA")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("BLOCK")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("JEDDA")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("STREET")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("QASIMA")].mColClass = "sap.m.Input";

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                that2.fetchBranch = true;
                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "BRNO", idx + 1);
                }
                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();
                qv.beforeDelRow = function (idx, ld, data) {
                    var cod = that2.frm.getFieldValue("qry1.code");
                    var br = data.BRNO;
                    var cnt = Util.getSQLValue("select nvl(max(ord_no),-1) from c_order1 where ord_ref='" + cod + "' and ord_discamt=" + br);
                    if (cnt != -1)
                        FormView.err("Delivery # " + cnt + " is existed with this branch !");
                };
                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                });
            }


        }
        var pg = new sap.m.Page({
            showHeader: false,
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

        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.addContent(this.qb.showToolbar.toolbar);
        pg.addContent(this.qb.getControl());

        tbHeader.addContent(cmdEdit);
        tbHeader.addContent(cmdClose);
        var tit = Util.getLangText("titNewCustBranch");
        if (cc != "")
            tit = Util.getLangText("txtBranches") + " - " + that2.frm.getFieldValue("qry1.name");

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
            that2.qb.updateDataToTable();
            sap.m.MessageToast.show("Closing branch window..");
        });
    }
    ,
    doUpdateBranches: function () {
        var that2 = this;
        if (!that2.fetchBranch || that2.qb == undefined || that2.qb.mLctb.rows.length == 0)
            return "";
        var ld = that2.qb.mLctb;
        var sqls = "";
        var sq2 = "insert into cbranch(BRNO, CODE, ACCNO, B_NAME,AREA,BLOCK,JEDDA,QASIMA,STREET) " +
            " VALUES (':BRNO',':qry1.code',':qr1.ac_no',':B_NAME'," +
            " ':AREA' ,':BLOCK' ,':JEDDA' ,':QASIMA',':STREET' );";
        var checkDuplicate = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (Util.nvl(ld.getFieldValue(i, "B_NAME"), "") == "") {
                that2.showBranches();
                FormView.err("Branch name must enter");
            }
            if (checkDuplicate[ld.getFieldValue(i, "BRNO")] != undefined) {
                that2.showBranches();
                FormView.err("Branch No # " + ld.getFieldValue(i, "BRNO") + " alredy existed for " + ld.getFieldValue(i, "B_NAME"))
            } else
                checkDuplicate[ld.getFieldValue(i, "BRNO")] = ld.getFieldValue(i, "B_NAME");
            var sq = sq2.replaceAll(":BRNO", ld.getFieldValue(i, "BRNO"))
                .replaceAll(":B_NAME", ld.getFieldValue(i, "B_NAME"))
                .replaceAll(":AREA", ld.getFieldValue(i, "AREA"))
                .replaceAll(":BLOCK", ld.getFieldValue(i, "BLOCK"))
                .replaceAll(":JEDDA", ld.getFieldValue(i, "JEDDA"))
                .replaceAll(":QASIMA", ld.getFieldValue(i, "QASIMA"))
                .replaceAll(":STREET", ld.getFieldValue(i, "STREET"));
            sqls += sq;
        }
        var brs = "";
        var cod = that2.frm.getFieldValue("qry1.code");
        var kys = Object.keys(checkDuplicate)
        for (var ky in kys)
            brs += (brs.length > 0 ? "," : "") + "'" + cod + "-" + kys[ky] + "'";
        var sqt = Util.getSQLValue("select nvl(max(ord_ref||'-'||ord_discamt),'') from c_order1 where ord_ref='" + cod + "' and ord_ref||'-'||ord_discamt not in (" + brs + ") ");
        if (Util.nvl(sqt, "") != '') {
            that2.showBranches();
            FormView.err("Branch # " + sqt + " existed in delivereis but not in master !");
        }
        sqls = "delete from cbranch where code=':qry1.code';" + sqls;
        return sqls;
    },
    showCustContract: function () {
        var that2 = this;
        if (that2.frm.objs["qry1"].status != FormView.RecordStatus.VIEW)
            FormView.err("Form must be in VIEW mode !");
        var locval = that2.frm.getFieldValue("qry1.code");
        UtilGen.Search.do_quick_search_simple("select brno code,b_name  title,AREA from cbranch where code=':locationx' order by brno ".replaceAll(":locationx", locval),
            ["CODE", "TITLE", "AREA"], function (data) {
                var bn = data.CODE;
                var sett = sap.ui.getCore().getModel("settings").getData();
                var confrm = "bin.forms.br.forms.con1";
                if (sett["C7_VER_NAME"] == "KHA")
                    confrm = "bin.forms.br.kha.forms.con1";
                UtilGen.execCmd(confrm + " formType=dialog formSize=80%,80% status=new code=" + locval + " branch=" + bn, UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                });
            });
    },
    showCustItems: function () {
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
        if (that2.fetchCustItems == false)
            that2.qc.reset();
        var cc = "";
        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            cc = that2.frm.getFieldValue("qry1.code");
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
                });
                return;
            }

            var dt = Util.execSQL("select c.refer,it.descr, c.packd,c.unitd,c.pack,c.price,c.price_buy from custitems c,items it where it.reference=c.refer and c.code=" + Util.quoted(cc) + " order by c.refer ");
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 80;

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("PRICE_BUY")].mColClass = "sap.m.Input";

                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 130;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 220;
                qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("UNITD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PACK")].getMUIHelper().display_width = 50;

                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].getMUIHelper().display_format = "MONEY_FORMAT";
                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE_BUY")].getMUIHelper().display_format = "MONEY_FORMAT";

                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mTitle = "Price Sell";
                qv.mLctb.cols[qv.mLctb.getColPos("PRICE_BUY")].mTitle = "Price Buy";

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

                    var dtxM = Util.execSQLWithData("select descr,packd,unitd,pack from items where reference='" + newValue + "' ")
                    if (dtxM != undefined && dtxM.length > 0) {
                        oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACKD', dtxM[0].PACKD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/UNITD', dtxM[0].UNITD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACK', dtxM[0].PACK);

                    }
                };
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mSearchSQL = "select reference code,descr title from items order by descr2";
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    UtilGen.Search.do_quick_search(evtx, input,
                        "select reference code,descr title from items order by descr2 ",
                        "select reference code,descr title from items  where reference=:CODE", undefined, function () {
                            input.fireChange();
                        },
                        {
                            pWidth: "400px", pHeight: "400px",
                            "background-color": 'blue',
                            "dialogStyle": "cyanDialog"
                        });


                }

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                that2.fetchCustItems = true;

                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "PRICE", 0);
                    ld.setFieldValue(idx, "PRICE_BUY", 0);

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
        }
        var pg = new sap.m.Page({
            showHeader: false,
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

        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.addContent(this.qc.showToolbar.toolbar);
        pg.addContent(this.qc.getControl());
        tbHeader.addContent(cmdEdit);
        tbHeader.addContent(cmdClose);
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
            sap.m.MessageToast.show("Closing  Itmes window..");
        });
    },
    doUpdateCustItems: function () {
        var that2 = this;
        if (!that2.fetchCustItems || that2.qc == undefined || that2.qc.mLctb.rows.length == 0)
            return "";
        var ld = that2.qc.mLctb;
        var sqls = "";
        var sq2 = "insert into custitems(code,refer,descr,packd,unitd,pack,price,flag,disc_amt,price_buy) " +
            " VALUES (':qry1.code',':REFER','',':PACKD', " +
            " ':UNITD' ,':PACK' ,:PRICE ,1, 0 ,:PRICE_BUY);";
        var checkDuplicate = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (Util.nvl(ld.getFieldValue(i, "REFER"), "") == "") {
                that2.showCustItems();
                FormView.err(" REFER MUST ENTER !");
            }
            var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
            var prb = Util.extractNumber(ld.getFieldValue(i, "PRICE_BUY"));
            if (pr < 0 || prb < 0) {
                that2.showCustItems();
                FormView.err(" PRICE IS INVALID !");
            }
            if (pr == 0 && prb == 0) {
                that2.showCustItems();
                FormView.err(" PRICE sell or buy must have value  !");
            }

            if (checkDuplicate[ld.getFieldValue(i, "REFER")] != undefined) {
                that2.showCustItems();
                FormView.err("Refer  # " + ld.getFieldValue(i, "REFER") + " alredy existed for " + ld.getFieldValue(i, "DESCR"))
            } else
                checkDuplicate[ld.getFieldValue(i, "REFER")] = ld.getFieldValue(i, "DESCR");
            var sq = sq2.replaceAll(":REFER", ld.getFieldValue(i, "REFER"))
                .replaceAll(":PACKD", ld.getFieldValue(i, "PACKD"))
                .replaceAll(":UNITD", ld.getFieldValue(i, "UNITD"))
                .replaceAll(":PACK", ld.getFieldValue(i, "PACK"))
                .replaceAll(":PRICE_BUY", ld.getFieldValue(i, "PRICE_BUY"))
                .replaceAll(":PRICE", ld.getFieldValue(i, "PRICE"));
            sqls += sq;
        }
        sqls = "delete from custitems where code=':qry1.code';" + sqls;
        return sqls;
    },
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

});



