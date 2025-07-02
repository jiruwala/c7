sap.ui.jsfragment("bin.forms.in.siv", {

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
            vou_code: 25,
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
        var qih = " C7_GET_STORE_ITEM_ALLQTY(p2.refer,p2.dat,p2.stra,'Y',p2.prd_date,p2.exp_date,'\"'||p2.keyfld||'\"')/p2.pack qih , ";

        var dmlSq = "select p2.*,IT.DESCR DESCRX,p2.PRICE*(p2.allqty/p2.pack) AMOUNT ," +
            qih +
            " TO_CHAR(PRD_DATE,'DD/MM/RRRR') PRD_DATE2, " +
            " TO_CHAR(EXP_DATE,'DD/MM/RRRR') EXP_DATE2 " +
            " from invoice2 p2 ,ITEMS IT where " +
            " IT.REFERENCE=p2.refer AND p2.KEYFLD=':keyfld' and invoice_code=" + that.vars.vou_code + " ORDER BY p2.itempos ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("titStrIssueVoucher"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 600, "M": 800, "L": 800, "XL": 900 },
                    class: "strTvForm"
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
                        update_exclude_fields: ["straname", "strbname", "slsname"],
                        insert_exclude_fields: ["straname", "strbname", "slsname"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "INVOICE_CODE": thatForm.vars.vou_code,
                            "TYPE": 1,
                            "YEAR": "2000",
                            "CREATDT": "SYSDATE",
                            "FLAG": 2,
                        },
                        update_default_values: {
                        },
                        table_name: "INVOICE1",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.SIV01",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 5, "M": 7, "L": 10, "XL": 14, "XXL": 18 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from invoice2 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCRX', 'AMOUNT', "QIH", "PRD_DATE2", "EXP_DATE2"],
                        insert_exclude_fields: ['DESCRX', 'AMOUNT', "QIH", "PRD_DATE2", "EXP_DATE2"],
                        insert_default_values: {
                            "PERIODCODE": sett["CURRENT_PERIOD"],
                            "LOCATION_CODE": ":qry1.location_code",
                            "TYPE": 1,
                            "INVOICE_NO": ":qry1.invoice_no",
                            "INVOICE_CODE": thatForm.vars.vou_code,
                            "DAT": ":qry1.invoice_date",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": ":qry1.stra",
                            "CREATDT": "SYSDATE",
                            "FLAG": 2,
                            "PKCOST": "( :qry2.price / :qry2.pack ) ",
                            "PRD_DATE": "(select prd_dt from items where reference=':qry2.refer')",
                            "EXP_DATE": "(select exp_dt from items where reference=':qry2.refer')",

                        },
                        update_default_values: {
                        },
                        table_name: "INVOICE2",
                        before_add_table: function (scrollObjs, qrj) {
                            UtilGen.createDefaultToolbar1(qrj, ["REFER", "DESCRX"], true);
                            var colsetitems = UtilGen.addItemsInfoCmd({
                                thatForm: thatForm,
                                qrj: qrj,
                                itemField: "ORD_REFER",
                                itemDescrField: "DESCR",
                                storeFeld: "STRA",
                                qryDate: "qry1.ord_date",
                                fnCallBack: function (rowno, data, str) {
                                    if (str == "showQtyAllStore") {
                                        var ld = thatForm.frm.objs["qry2"].obj.mLctb;
                                        var tbl = thatForm.frm.objs["qry2"].obj.getControl();
                                        if ((thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) ||
                                            thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW
                                        ) {
                                            // ld.setFieldValue(rowno, "STRA", data.NO);
                                            thatForm.frm.objs["qry2"].obj.updateDataToControl();
                                        }
                                    }
                                }
                            });
                            var colset = UtilGen.addDetailSetupCmd({
                                applyCol: thatForm.frm.objs["qry2"].applyCol,
                                fnAddMenus: function (mnus) {
                                    mnus.push(new sap.m.MenuItem({
                                        icon: "sap-icon://copy",
                                        text: Util.getLangText("menuCopyItemDetailsFrom"),
                                        press: function () {
                                            // thatForm.helperFunc.copyItems();
                                            var rs = {
                                                "POS": "ITEMPOS",
                                                "REFER": "REFER",
                                                "DESCR": "DESCRX",
                                                "PACKD": "PACKD",
                                                "UNITD": "UNITD",
                                                "PACK": "PACK",
                                                "PKQTY": "PKQTY",
                                                "UNQTY": "QTY",
                                                "PRICE": "PIRCE",
                                            }
                                            UtilGen.PurchaseOrderFunc.copyDetails(thatForm, '"ITEMS"', '"PORD1" "PUR1" "INVOICE1', rs);
                                        }
                                    }))
                                }
                            });
                            qrj.showToolbar.toolbar.addContent(colsetitems);
                            qrj.showToolbar.toolbar.addContent(colset);
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
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select name from store where no = :CODE ", qry.formview.objs["qry1.stra"].obj, undefined, that.frm.objs["qry1.straname"].obj);
                        UtilGen.Search.getLOVSearchField("select name from store where no = :CODE ", qry.formview.objs["qry1.strb"].obj, undefined, that.frm.objs["qry1.strbname"].obj);
                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("REFER").beforeSearchEvent = function (sq, ctx, model) {
                            qry.obj.mLctb.getColByName("REFER").btnsx = [];
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
                        var odt = thatForm.frm.getFieldValue("qry1.invoice_date");
                        var ld = qry.obj.mLctb;
                        var rfr = ld.getFieldValue(rowno, "REFER");
                        var pos = ld.getFieldValue(rowno, "ITEMPOS");
                        var dt = Util.execSQLWithData("select packd,unitd,pack,lsprice,get_item_cost(items.reference," +
                            Util.toOraDateString(odt) + ") ucost from items where reference='" + rfr + "'",
                            "Item # " + rfr + " not a valid !");
                        var sq = ("update invoice2 set packd=':pkd',unitd=':unitd' ,pack=:pack ," +
                            " allqty=(pkqty*:pack)+qty," +
                            " qtyout=(pkqty*:pack)+qty," +
                            " qtyin=0," +
                            " pkcost=:unit_cost , price=:price " +
                            " where keyfld=:kf and itempos=:pos ")
                            .replaceAll(":pkd", dt[0].PACKD)
                            .replaceAll(":unitd", dt[0].UNITD)
                            .replaceAll(":pack", dt[0].PACK)
                            .replaceAll(":unit_cost", dt[0].UCOST)
                            .replaceAll(":price", (dt[0].UCOST * dt[0].PACK))
                            .replaceAll(":kf", kf)
                            .replaceAll(":pos", pos)
                        return sqlRow + ";" + sq;
                    }
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

                        qry.formview.setFieldValue("qry1.invoice_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();

                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                },
                beforeDelRow: function (qry, idx, ld, data) {
                    var delbfr = "";
                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var delbfr = "X_Post_issue_del_only(:keyfld); ".replaceAll(":keyfld", kf);
                    }
                    return delbfr;
                },
                afterDelRow: function (qry, ld, data) {

                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();

                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    var no = that.frm.getFieldValue("qry1.invoice_no");
                    return params + "&_para_pfromno=" + no + "&_para_ptono=" + no;
                },
                afterApplyCols: function (qry) {
                    if (qry.name == "qry2") {

                    }

                },
                beforeExeSql: function (frm, sq) {
                    var kf = frm.getFieldValue("qry1.keyfld");
                    return sq + "X_POST_ISSUE(" + kf + ");";
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
                    title: '@{\"text\":\"Total Cost\",\"width\":\"15%\","textAlign":"End","styleClass":"redText"}',
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
            var getSettingCC = function (str, strnm) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(str, "stra"),
                    name: Util.nvl(strnm, "straname"),
                    sqlChange: "select name from accostcent1 where code = ':CODE'",
                    sqlList: "select code,title from accostcent1 where flag=1 order by path ",
                    sqlListChange: "select code,title from accostcent1 where code=:CODE",
                });
            };
            var getStrSett = function (str, strnm) {
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(str, "stra"),
                    name: Util.nvl(strnm, "straname"),
                    sqlChange: "select name from store where no = ':CODE'",
                    sqlList: "select no code,name title from store where flag=1 order by no ",
                    sqlListChange: "select no code,name title from store where no=:CODE",
                });
            };
            //15,10,10,15           15,10,10,15
            //keyfld,location_code  invoice_no,invoice_date
            //stra,straname         strb,strbname

            return {
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
                        var objno = thatForm.frm.objs["qry1.invoice_no"].obj;
                        var newno = Util.getSQLValue("select nvl(max(invoice_no),0)+1 from pur1 " +
                            "where invoice_code=" + thatForm.vars.vou_code + " and location_code='" + objOn.getSelectedKey() + "'");
                        UtilGen.setControlValue(objno, newno, newno, true);
                    }
                }),
                invoice_date: FormView.getFactoryFields.getDateField(
                    "invoice_date", "@", "vouDate", "15%", "", "10%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, {}),
                invoice_no: FormView.getFactoryFields.getGeneralField(
                    "invoice_no", "@", "vouNo", "10%", "redText boldText", "15%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                        thatForm.helperFunc.fetchInv(false);
                    }
                }),
                stra: FormView.getFactoryFields.getGeneralField(
                    "stra", "", "txtStoreOut", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, getStrSett("qry1.stra", "qry1.straname")),
                straname: FormView.getFactoryFields.getGeneralField(
                    "straname", "@", "", "0px", "", "23%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                costcent: FormView.getFactoryFields.getGeneralField(
                    "costcent", "@", "costCent", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingCC(thatForm, "qry1.costcent", "qry1.costcentnm")),
                costcentnm: FormView.getFactoryFields.getGeneralField(
                    "costcentnm", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    }, {}),
                slsmn: FormView.getFactoryFields.getGeneralField(
                    "slsmn", "", "txtEmp", "15%", "", "12%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, UtilGen.getSettingSalesp(thatForm, "qry1.slsmn", "qry1.slsname", "D")),
                slsname: FormView.getFactoryFields.getGeneralField(
                    "slsname", "@", "", "0px", "", "23%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                memo: FormView.getFactoryFields.getGeneralField(
                    "memo", "@", "txtRemark", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
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
                    cols: [
                        {
                            colname: "INVOICE_NO",
                            mTitle: Util.getLangText("txtInvNo"),
                            display_width: 75,
                            mSummary: "COUNT",

                        },
                        {
                            colname: "INVOICE_DATE",
                            mTitle: Util.getLangText("txtInvDate"),
                            display_width: 75,
                        },
                        {
                            colname: "STRA",
                            mTitle: Util.getLangText("txtStoreOut"),
                            display_width: 75,

                        },
                        {
                            colname: "STRANAME",
                            mTitle: Util.getLangText("txtName"),
                            display_width: 150,

                        },
                        {
                            colname: "STRB",
                            mTitle: Util.getLangText("txtStoreIn"),
                            display_width: 75,
                        },
                        {
                            colname: "STRBNAME",
                            mTitle: Util.getLangText("txtName"),
                            display_width: 150,
                        },
                        {
                            colname: "MEMO",
                            mTitle: Util.getLangText("txtRemark"),
                            display_width: 200,
                        },

                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select * from (" +
                        "select p2.invoice_no,p2.invoice_date,p2.stra,s1.name straname, " +
                        " s2.name strbname ,memo, p2.keyfld " +
                        " from PUR1 p2,store s1,store s2 where invoice_code =" + that2.vars.vou_code +
                        " and s1.no=p2.stra and s2.no=p2.strb " +
                        " and (':qry1.stra'=p2.stra or ':qry1.stra' is null) " +
                        " order by p2.invoice_date desc,p2.invoice_no desc ) " +
                        " where (rownum <=^^list_key or ^^list_key=-1) ",
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
            var errObj = function (msg, obj) {

                var o = thatForm.frm.objs[obj].obj;
                UtilGen.errorObj(o, 3500);
                FormView.err(msg);
            };

            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pur1");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));

                var on = qry.formview.getFieldValue("qry1.invoice_no");
                var loc = qry.formview.getFieldValue("qry1.location_code");
                var findno = 0;
                if (Util.nvl(on, "") != "")
                    findno = Util.getSQLValue("select nvl(max(invoice_no),'') from pur1 where invoice_no=" + on + " and invoice_code=" + thatForm.vars.vou_code + " and location_code='" + loc + "'");
                if (Util.nvl(findno, '') != '') {
                    var no = Util.getSQLValue("select nvl(max(invoice_no),0)+1 from pur1 where ord_code=" + thatForm.vars.vou_code + " and location_code='" + loc + "'");
                    qry.formview.setFieldValue("qry1.ord_no", no, no, true);
                }

            }
            var cod = thatForm.frm.getFieldValue("qry1.stra");
            var cod2 = thatForm.frm.getFieldValue("qry1.strb");
            if (Util.nvl(cod, "") == "") errObj("Store out must have value !", "qry1.stra");
            if (Util.nvl(cod2, "") == "") errObj("Store out must have value !", "qry1.strb");

            if (cod == cod2)
                errObj("Cant be out store equals in store !", "qry1.stra");

            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            var qv = thatForm.frm.objs["qry2"].obj;
            var errRow = function (rown, ds, rfr) {
                var rn = rown;
                if (rfr != undefined)
                    for (var i = 0; i < ld.rows.length; i++)
                        if (ld.getFieldValue(i, "REFER") == rfr)
                            rn = i;
                if (rn - 1 < 0) {
                    qv.getControl().setFirstVisibleRow(0);
                    qv.getControl().addSelectionInterval(0, 0);
                }
                else if (Util.nvl(rn, -1) >= 0) {
                    qv.getControl().setFirstVisibleRow(rn - 1);
                    qv.getControl().addSelectionInterval(rn, rn);
                }
                FormView.err(ld.getFieldValue(rn, "REFER") + " -  " + ds);
            }

            for (var i = 0; i < ld.rows.length; i++) {
                var rfr = ld.getFieldValue(i, "REFER");
                var qty = Util.extractNumber(ld.getFieldValue(i, "QTY"));
                var pqty = Util.extractNumber(ld.getFieldValue(i, "PKQTY"));
                var pk = Util.extractNumber(ld.getFieldValue(i, "PACK"));
                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                if (dup[rfr] != undefined)
                    errRow(i, "Save Denied : Duplicate item entry ", rfr);
                dup[rfr] = rfr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    errRow(i, "Save Denied : Item  is a group item ! ");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                if (cnt == 0)
                    errRow(i, "Save Denied: Item  is invalid entry ! ");
                if (pr < 0)
                    errRow(i, "Save Denied: PRICE invalid value !");
                if (qty + (pqty * pk) <= 0)
                    errRow(i, "Save Denied: QTY invalid value ! ");

            }

        },
        fetchInv: function () {

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



