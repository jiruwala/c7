sap.ui.jsfragment("bin.forms.sl.so", {

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
            vou_code: 21,
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
        var dmlSq = "select o2.*,((o2.ord_price-o2.ord_discamt)*(o2.ord_allqty/o2.ord_pack)) amount,i.descr descrx, " +
            " DELIVEREDQTY/i.pack dlv_pkqty," +
            " TO_CHAR(ORD_PRD_DATE,'DD/MM/RRRR') ORD_PRD_DATE2, " +
            " TO_CHAR(ORD_EXP_DATE,'DD/MM/RRRR') ORD_EXP_DATE2, " +
            " C7_GET_STORE_ITEM_ALLQTY(ord_refer,o2.ord_date,o2.stra)/o2.ord_pack qih, " +
            " C7_GET_STORE_ITEM_ALLQTY_RSRV(ord_refer,'\"'||o2.keyfld||'\"')/o2.ord_pack reserved, " +
            " o2.ORD_PKCOST*ord_pack pack_cost," +
            "o2.ORD_PKCOST*o2.ord_allqty cost_amt,  " +
            "i.lsprice ," +
            " i.lsprice*(o2.ord_allqty/o2.ord_pack) lsamt " +
            " from pord2 o2,items i " +
            "where O2.KEYFLD=':qry1.keyfld' and ord_code=" +
            thatForm.vars.vou_code +
            " and i.reference=o2.ord_refer " +
            " order by o2.ord_pos ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("titSalesOrder"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 600, "M": 800, "L": 800, "XL": 900 },
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
                    Util.destroyID("rcvdTxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var rtxt = new sap.m.Text(thatForm.view.createId("rcvdTxt" + thatForm.timeInLong, { width: "300px", text: "" }));
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var cmdQuickEntry = new sap.m.Button(thatForm.view.createId("cmdQE" + thatForm.timeInLong), {
                        text: "Quick Entry",
                        press: function () {
                            thatForm.helperFunc.enterQuckEntry();
                        }
                    });
                    var hb = new sap.m.Toolbar({
                        content: [txt, rtxt, new sap.m.ToolbarSpacer(), cmdQuickEntry, txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    rtxt.addStyleClass("totalVoucherTxt titleFontWithoutPad");

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
                        dml: "select *from pord1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_AMT": ":qry2.totamt",
                            "ORD_DISCAMT": ":qry2.disc_amt",
                            "USERNM": Util.quoted(sett["LOGON_USER"]),
                        },
                        update_default_values: {
                            "ORD_AMT": ":qry2.totamt",
                            "ORD_DISCAMT": ":qry2.disc_amt",
                        },
                        table_name: "PORD1",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.SO1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 3, "M": 5, "L": 7, "XL": 10, "XXL": 14 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from pord2 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCRX', 'AMOUNT', 'PACKD', 'PACK', 'DLV_PKQTY', 'QIH', "COST_AMT", "LSAMT", "LSPRICE", "PACK_COST", "RESERVED", "ORD_PRD_DATE2", "ORD_EXP_DATE2"],
                        insert_exclude_fields: ['DESCRX', 'AMOUNT', 'PACKD', 'PACK', 'DLV_PKQTY', 'QIH', "COST_AMT", "LSAMT", "LSPRICE", "PACK_COST", "RESERVED", "ORD_PRD_DATE2", "ORD_EXP_DATE2"],
                        insert_default_values: {
                            "PERIODCODE": sett["CURRENT_PERIOD"],
                            "LOCATION_CODE": ":qry1.location_code",
                            "ORD_NO": ":qry1.ord_no",
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_DATE": ":qry1.ord_date",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": ":qry1.stra",
                            "ORD_PRD_DATE": "(select prd_dt from items where reference=':qry2.ord_refer')",
                            "ORD_EXP_DATE": "(select exp_dt from items where reference=':qry2.ord_refer')"
                        },
                        update_default_values: {
                        },
                        table_name: "PORD2",
                        before_add_table: function (scrollObjs, qrj) {
                            UtilGen.createDefaultToolbar1(qrj, ["ORD_REFER", "DESCR"], true);
                            var colset = UtilGen.addColSetup(thatForm.frm.objs["qry2"].applyCol);
                            qrj.showToolbar.toolbar.addContent(colset);
                            scrollObjs.push(qrj.showToolbar.toolbar);
                            qrj.eventKey = function (key, rowno, colno, firstVis) {
                                var totalRows = qrj.getControl().getModel().getData().length;
                                var visRows = qrj.getControl().getVisibleRowCount();
                                var cl = UtilGen.getTableColNo(qrj.getControl(), "ORD_REFER");
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
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_branchno"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterBranch"));

                            // thatForm.helperFunc.validity.updateFieldsEditing();
                            return true;
                        },
                        eventCalc: function (qv, cx, rowno, reAmt, refreshBalances) {
                            var sett = sap.ui.getCore().getModel("settings").getData();
                            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                            if (reAmt)
                                qv.updateDataToTable();

                            var ld = qv.mLctb;

                            if (Util.nvl(refreshBalances, false))
                                for (var i1 = 0; i1 < ld.rows.length; i1++) {
                                    var rfr = ld.getFieldValue(i1, "ORD_REFER");
                                    var odt = Util.toOraDateString(thatForm.frm.getFieldValue('qry1.ord_date'));
                                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                                    var str = thatForm.frm.getFieldValue("qry1.stra");
                                    var sq = "select descr,childcounts,packd,unitd,pack,get_item_cost(reference,:ordate) ucost," +
                                        " C7_GET_STORE_ITEM_ALLQTY(reference,:ordate,:store)/items.pack qih, " +
                                        " C7_GET_STORE_ITEM_ALLQTY_RSRV(reference,':keyfld')/items.pack reserved, " +
                                        " lsprice,prd_dt,exp_dt from items where reference=':rfr'";
                                    sq = sq.replaceAll(":ordate", odt)
                                        .replaceAll(":keyfld", '"' + kf + '"')
                                        .replaceAll(":rfr", rfr)
                                        .replaceAll(":store", str);
                                    var sqdt = Util.execSQLWithData(sq);
                                    var pqt = Util.extractNumber(ld.getFieldValue(i1, "ORD_PKQTY"));
                                    var qt = Util.extractNumber(ld.getFieldValue(i1, "ORD_UNQTY"));
                                    var pack = Util.extractNumber(ld.getFieldValue(i1, "ORD_PACK"));
                                    var price = Util.extractNumber(ld.getFieldValue(i1, "ORD_PRICE"));
                                    var ds = Util.extractNumber(ld.getFieldValue(i1, "ORD_DISCAMT"));
                                    var sq = '';
                                    var child = 0;
                                    var packd = '';
                                    var unitd = '';
                                    var pcost = 0;
                                    var lsprice = 0;
                                    var cstamt = 0;
                                    var lsamt = 0;
                                    var amt = 0;
                                    var qih = 0;
                                    var reserved = 0;
                                    var prd_dt = undefined;
                                    var exp_dt = undefined;

                                    if (sqdt.length > 0) {

                                        sq = sqdt[0].DESCR;
                                        child = sqdt[0].CHILDCOUNTS;
                                        packd = sqdt[0].PACKD;
                                        unitd = sqdt[0].UNITD;
                                        pack = sqdt[0].PACK;
                                        pcost = sqdt[0].UCOST * pack;
                                        lsprice = sqdt[0].LSPRICE;
                                        qih = sqdt[0].QIH;
                                        reserved = sqdt[0].RESERVED;
                                        prd_dt = new Date((sqdt[0].PRD_DT + "").replaceAll(",", ":"));
                                        exp_dt = new Date((sqdt[0].EXP_DT + "").replaceAll(",", ":"));
                                        cstamt = pcost * ((pqt * pack) + qt);
                                        lsamt = lsprice * ((pqt * pack) + qt);
                                        amt = (price - ds) * ((pqt * pack) + qt);
                                    }
                                    ld.setFieldValue(i1, "DESCRX", sq);
                                    ld.setFieldValue(i1, "STRA", str);
                                    ld.setFieldValue(i1, "ORD_PACKD", packd);
                                    ld.setFieldValue(i1, "ORD_UNITD", unitd);
                                    ld.setFieldValue(i1, "ORD_PACK", pack);
                                    ld.setFieldValue(i1, "AMOUNT", amt);
                                    ld.setFieldValue(i1, "PACK_COST", pcost);
                                    ld.setFieldValue(i1, "LSPRICE", lsprice);
                                    ld.setFieldValue(i1, "LSAMT", lsamt);
                                    ld.setFieldValue(i1, "COST_AMT", cstamt);
                                    ld.setFieldValue(i1, "QIH", qih);
                                    ld.setFieldValue(i1, "RESERVED", reserved);
                                    if (Util.nvl(ld.getFieldValue(i1, "ORD_PRD_BATCH"), '') != '') {
                                        ld.setFieldValue(i1, "ORD_PRD_DATE", prd_dt);
                                        ld.setFieldValue(i1, "ORD_EXP_DATE", exp_dt);
                                    }
                                }

                            var sumAmt = 0;
                            var sumCost = 0;
                            var sumLs = 0;

                            for (var i = 0; i < ld.rows.length; i++) {
                                sumAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "AMOUNT"), df), 0);
                                sumCost += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "COST_AMT"), df), 0);
                                sumLs += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "LSAMT"), df), 0);
                            }
                            var discp = 0
                            var disc = Util.nvl(thatForm.frm.getFieldValue("disc_amt"), 0);
                            if (sumAmt > 0 && disc > 0)
                                discp = (100 / sumAmt) * disc;
                            thatForm.frm.setFieldValue('disc_p', discp.toFixed(5));
                            var netamt = sumAmt - disc;
                            thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
                            thatForm.frm.setFieldValue('net_amt', df.format(netamt));
                            thatForm.frm.setFieldValue('totcst', df.format(sumCost));
                            thatForm.frm.setFieldValue('totls', df.format(sumLs));
                            if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                                thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("Amount : " + df.format(netamt));

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
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.txt_empname"].obj);
                        var saleinv = Util.getSQLValue("select saleinv from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("SO is POSTED ,INV # " + invno);
                        }

                        var cb = thatForm.frm.objs["qry1.ord_type"].obj;
                        var lo = thatForm.frm.getFieldValue("qry1.location_code");
                        var typ = thatForm.frm.getFieldValue("qry1.ord_type");

                        Util.fillCombo(cb, "select no code,descr name from invoicetype " +
                            " where location_code='" + lo + "' " +
                            " order by no "
                        );

                        cb.setSelectedKey(typ);
                        qry.formview.setFieldValue("qry2.disc_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry2.disc_p", 0, 0, true);
                        var discamt = Util.getSQLValue("select ord_discamt from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(discamt, 0) > 0) {
                            qry.formview.setFieldValue("qry2.disc_amt", discamt, discamt, true);
                        }

                        var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=9 and pord1_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var ordrd = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where ord_code=21 and keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var rcvdp = 0;
                        if (ordrd > 0) rcvdp = Math.round((100 / ordrd) * rcvd, 2);
                        thatForm.view.byId("rcvdTxt" + thatForm.timeInLong).setText("Delivered : " + rcvdp + " % ");

                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("ORD_REFER").beforeSearchEvent = function (sq, ctx, model) {
                            qry.obj.mLctb.getColByName("ORD_REFER").btnsx = [new sap.m.Button({
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
                    if (qry.name == "qry1") {
                        var ordac = thatForm.frm.getFieldValue("qry1.ordacc");
                        if (ordac == UtilGen.SalesOrderFunc.initAction.closeSO)
                            Util.simpleConfirmDialog(Util.getLangText("msgCloseSO"), function (oAction) {
                                if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                                    thatForm.cmdButtons.cmdNew.firePress();
                                }
                            });

                    }
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    if (qry.name == "qry2") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var odt = thatForm.frm.getFieldValue("qry1.ord_date");
                        var ld = qry.obj.mLctb;
                        var rfr = ld.getFieldValue(rowno, "ORD_REFER");
                        var pos = ld.getFieldValue(rowno, "ORD_POS");
                        var lsprice = ld.getFieldValue(rowno, "LSPRICE");
                        var dt = Util.execSQLWithData("select packd,unitd,pack,lsprice,get_item_cost(items.reference," +
                            Util.toOraDateString(odt) + ") ucost from items where reference='" + rfr + "'",
                            "Item # " + rfr + " not a valid !");
                        var sq = ("update pord2 set ord_packd=':pkd',ord_unitd=':unitd' ,ord_pack=:pack ," +
                            " ord_allqty=(ord_pkqty*:pack)+ord_unqty,ORDEREDQTY=(ord_pkqty*:pack)+ord_unqty ," +
                            " ord_lsprice=:lsprice , ord_pkcost=:unit_cost " +
                            " where keyfld=:kf and ord_pos=:pos ")
                            .replaceAll(":pkd", dt[0].PACKD)
                            .replaceAll(":unitd", dt[0].UNITD)
                            .replaceAll(":pack", dt[0].PACK)
                            .replaceAll(":unit_cost", dt[0].UCOST)
                            .replaceAll(":lsprice", lsprice)
                            .replaceAll(":kf", kf)
                            .replaceAll(":pos", pos)
                        return sqlRow + ";" + sq;
                    }
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        that.view.byId("rcvdTxt" + thatForm.timeInLong).setText("");
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objSt = thatForm.frm.objs["qry1.stra"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pord1");
                        var dt = thatForm.view.today_date.getDateValue();

                        UtilGen.setControlValue(objSt, sett["DEFAULT_STORE"], sett["DEFAULT_STORE"], true);
                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        qry.formview.setFieldValue("qry2.disc_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry2.disc_p", 0, 0, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();

                    }
                },
                afterEditRow(qry, index, ld) {
                    if (qry.name == "qry1") {
                        var sq = "select accno from invoicetype where location_code=':loc' and no=:ino";
                        sq = sq.replaceAll(":loc", qry.formview.getFieldValue("qry1.location_code"))
                            .replaceAll(":ino", qry.formview.getFieldValue("qry1.ord_type"));
                        var ac = Util.getSQLValue(sq);
                        if (Util.nvl(ac, '') != '')
                            qry.formview.objs["qry1.ord_ref"].obj.setEditable(false);
                    }

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var dt = Util.execSQL("select saleinv from pord1 where keyfld=" + kf);
                    if (dt.ret == "SUCCESS") {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        if (dtx.length > 0 && dtx[0].SALEINV != undefined) {
                            // frm.setFormReadOnly();
                            FormView.err("This Delivery is posted to invoice !");
                        }
                    }
                    var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                    if (actype == UtilGen.SalesOrderFunc.initAction.approve ||
                        actype == UtilGen.SalesOrderFunc.initAction.none
                    ) {
                        var sqDlv = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_code=9 and pord1_keyfld=" + kf);
                        if (sqDlv != 0)
                            FormView.err("Deletion denied : Deliveries existed !");
                        sqDlv = Util.getSQLValue("select nvl(count(*),0) from pur1 where invoice_code=21 and  po_keyfld=" + kf);
                        if (sqDlv != 0)
                            FormView.err("Deletion denied : Sales existed !");
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {
                    var delbfr = "";
                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                        var sqI = "c7_so_invoice(:keyfld,'Y'); ".replaceAll(":keyfld", kf);
                        var sq4 = (actype == UtilGen.SalesOrderFunc.initAction.issueDeliver ?
                            sqI : (actype == UtilGen.SalesOrderFunc.initAction.approve ||
                                actype == UtilGen.SalesOrderFunc.initAction.none) ? "" :
                                actype == UtilGen.SalesOrderFunc.initAction.saleInvs ? sqI :
                                    actype == UtilGen.SalesOrderFunc.initAction.closeSO ? FormView.err("Cant delete once closed !") : "");
                        delbfr += sq4;
                    }
                    return delbfr;

                },
                afterEdit: function (qry) {
                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("keyfld");
                        var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                        if (actype == UtilGen.SalesOrderFunc.initAction.approve ||
                            actype == UtilGen.SalesOrderFunc.initAction.none
                        ) {
                            var sqDlv = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_code=9 and pord1_keyfld=" + kf);
                            if (sqDlv != 0) {
                                thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.ord_refnm"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.ord_branchno"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.branchname"].obj.setEditable(false);
                                thatForm.frm.objs["qry2"].obj.setEditable(false);
                            }
                        }
                    }
                },

                afterDelRow: function (qry, ld, data) {
                    var delAdd = "";
                    if (qry.name == "qry1")
                        delAdd += "delete from c7_attach where  kind_of='SO' and refer=:qry1.keyfld ;";

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
                    var ordn = thatForm.frm.getFieldValue("qry1.ord_no");
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var sq3 = "update pord1 set ORDERDQTY=(select sum(ord_allqty) from pord2 where pord2.keyfld=':keyfld') " +
                        " where pord1.keyfld=':keyfld'; ";
                    sq3 = sq3.replaceAll(":keyfld", kf);
                    var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                    var sqA = "update pord1 set ord_flag=2 where keyfld=:keyfld; update pord2 set ord_flag=2 where  keyfld=:keyfld;"
                        .replaceAll(":keyfld", kf);
                    // var sqD = "c7_so_delivery(:keyfld); ".replaceAll(":keyfld", kf);
                    var sqI = "c7_so_invoice(:keyfld); ".replaceAll(":keyfld", kf);
                    var sq4 = (actype == UtilGen.SalesOrderFunc.initAction.approve ? sqA :
                        actype == UtilGen.SalesOrderFunc.initAction.saleInvs || actype == UtilGen.SalesOrderFunc.initAction.closeSO || actype == UtilGen.SalesOrderFunc.initAction.issueDeliver
                            ? sqA + sqI : "");
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    var sq5 = "c7_SO_UPDATE_DISC_GROSS(" + kf + ");";
                    return sq + sq3 + sq4 + sq5;
                }
            };
        },
        getSummary: function () {
            var thatForm = this.thatForm;
            var sumSpan = "XL2 L2 M2 S12";
            var sumSpan2 = "XL2 L6 M6 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
                totls: {
                    colname: "totls",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtTotLS\",\"width\":\"20%\","textAlign":"End","styleClass":"boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                totamt: {
                    colname: "totamt",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtGrossAmt\",\"width\":\"55%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                totcst: {
                    colname: "totcst",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtTotCost\",\"width\":\"20%\","textAlign":"End","styleClass":"boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                disc_amt: {
                    colname: "disc_amt",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtDisc\",\"width\":\"55%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: {
                        width: "15%",
                        editable: true,
                        change: function (e) {
                            var qrobj = thatForm.frm.objs["qry2"].obj;
                            if (qrobj.eventCalc != undefined)
                                qrobj.eventCalc(qrobj, undefined, -1, false);
                        }
                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                disc_p: {
                    colname: "disc_p",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\" %\",\"width\":\"3%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_BEGIN",
                    display_style: "background-color:yellow;",
                    display_format: "",
                    other_settings: {
                        width: "12%",
                        editable: true,
                        change: function (e) {
                            var sett = sap.ui.getCore().getModel("settings").getData();
                            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                            var qrobj = thatForm.frm.objs["qry2"].obj;
                            var discp = Util.extractNumber(this.getValue());//thatForm.frm.getFieldValue("disc_p");

                            var totamt = Util.extractNumber(thatForm.frm.getFieldValue("totamt"));
                            var discamt = 0;
                            thatForm.frm.setFieldValue("disc_amt", df.format(discamt), df.format(discamt));
                            if (discp > 0 && totamt) {
                                var discamt = (totamt / 100) * discp;
                                thatForm.frm.setFieldValue("disc_amt", df.format(discamt), df.format(discamt));
                            }
                            if (qrobj.eventCalc != undefined)
                                qrobj.eventCalc(qrobj, undefined, -1, false);
                        }
                    },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
                },
                net_amt: {
                    colname: "net_amt",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtNetAmt\",\"width\":\"105%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
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
                vbx: {
                    colname: "vbx",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: '{\"text\":\"\",\"width\":\"0px\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "1%", editable: false, height: "20px" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
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
            //15%,10%,10%,15%       15,13,12,12
            //keyid, attachment     location_code,stra
            //15,10,10,15           15,10,10,15
            //ord_type,ord_no       ord_date,ord_shpdt,
            //15,12,23              15,12,23
            //ord_ref,ord_refnm     ord_branchno, branchname
            //15,12,23              15,25
            //ord_empno,empname     ordacc 
            //15,35                 15,35
            //reference             remarks
            return {
                reserved_stock: {
                    colname: "reserved_stock",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"txtRsrvStock\",\"width\":\"95%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "5%", enabled: false, trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    trueValues: ["Y", "N"]
                },
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
                    other_settings: { editable: false, width: "10%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                attachment: {
                    colname: "attachment",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Attach\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
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
                location_code: {
                    colname: "location_code",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"locationTxt\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "12%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{CODE}-{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            vl = UtilGen.getControlValue(this);
                            var objOrd = thatForm.frm.objs["qry1.ord_no"].obj;
                            UtilGen.setControlValue(objOrd, "", "", true);

                            var cb = thatForm.frm.objs["qry1.ord_type"].obj;
                            var lo = UtilGen.getControlValue(this);
                            Util.fillCombo(cb, "select no code,descr name from invoicetype " +
                                " where location_code='" + lo + "' " +
                                " order by no "
                            );
                            if (cb.getItems().length > 0) {
                                cb.setSelectedItem(cb.getItems()[0]);
                                setTimeout(() => {
                                    cb.fireSelectionChange();
                                })
                            }
                        },
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "select code,name  from locations order by code"
                },
                stra: {
                    colname: "stra",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"storeNo\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "13%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{CODE}-{NAME}", key: "{CODE}" }),
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
                ord_type: {
                    colname: "ord_type",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"txtOrdType\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "15%",

                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{CODE}-{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            var vl = thatForm.frm.objs["qry1.location_code"].obj.getSelectedKey();
                            var ot = UtilGen.getControlValue(this);
                            var objOrd = thatForm.frm.objs["qry1.ord_no"].obj;

                            UtilGen.setControlValue(objOrd, "", "", true);

                            var sq = "select descr name ,accno from invoicetype " +
                                " where location_code=':LOCATION' and no = ':CODE'".replaceAll(":LOCATION", vl).replaceAll(":CODE", thatForm.frm.objs["qry1.ord_type"].obj.getSelectedKey());
                            var dtx = Util.execSQLWithData(sq, "No data found ..");
                            thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(true);
                            if (dtx != undefined) {
                                // UtilGen.setControlValue(thatForm.frm.objs["qry1.typename"].obj, dtx[0].NAME);
                                UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_ref"].obj, Util.nvl(dtx[0].ACCNO, ''));
                                var nm = Util.getSQLValue("select name from c_ycust where code='" + Util.nvl(dtx[0].ACCNO, '') + "'");
                                UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_refnm"].obj, nm);

                                if (Util.nvl(dtx[0].ACCNO, '') != "") {
                                    var on = Util.getSQLValue("select nvl(min(brno),1) from cbranch where code='" + dtx[0].ACCNO + "'");
                                    UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_branchno"].obj, on, on, true);
                                    thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(false);
                                }
                                else
                                    UtilGen.setControlValue(thatForm.frm.objs["qry1.ord_branchno"].obj, "", "", true);


                                if (vl != "") {
                                    var nwOn = Util.getSQLValue("select nvl(max(ord_no),0)+1 from pord1 " +
                                        " where ord_code=" + thatForm.vars.vou_code +
                                        " and ord_type='" + ot + "' " +
                                        " and location_code=" + Util.quoted(vl));
                                    UtilGen.setControlValue(objOrd, nwOn, nwOn);
                                }

                            }
                        }
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "select null code,null name  from dual"
                },
                ord_no: {
                    colname: "ord_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtNo\",\"width\":\"10%\","textAlign":"End","styleClass":"redText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "10%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                ord_date: {
                    colname: "ord_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"ordDate\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "13%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                            thatForm.frm.setFieldValue("qry1.ord_shpdt", thatForm.frm.getFieldValue("qry1.ord_date"), thatForm.frm.getFieldValue("qry1.ord_date"), true);
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },
                ord_shpdt: {
                    colname: "ord_shpdt",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"dlvDate\",\"width\":\"10%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "12%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
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
                            var cod = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
                            var sq = "select name from c_ycust where  code = ':CODE'";
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_ref"].obj, undefined, thatForm.frm.objs["qry1.ord_refnm"].obj);
                            var br = Util.getSQLValue("select min(brno) from cbranch where code='" + cod + "'");
                            thatForm.frm.setFieldValue("qry1.ord_branchno", br, br, true);

                        },
                        valueHelpRequest: function (e) {
                            var btns = [new sap.m.Button({
                                text: Util.getLangText('newSupplier'), press: function () {
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
                    title: '@{\"text\":\"\",\"width\":\"0px\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "23%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    keyboardFocus: true,
                },
                ord_branchno: {// branch no
                    colname: "ord_branchno",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_START",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "12%",
                        showValueHelp: true,
                        change: function (e) {
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.ord_ref"].obj)
                            var sq = "select b_name name from cbranch where code=':CUSTCODE' and brno = ':CODE'".replaceAll(":CUSTCODE", locval);
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_branchno"].obj, undefined, thatForm.frm.objs["qry1.branchname"].obj);

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
                    title: '@{\"text\":\"\",\"width\":\"0%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "23%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    keyboardFocus: false,
                },
                ord_empno: {
                    colname: "ord_empno",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtEmp\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true,
                        width: "12%",
                        showValueHelp: true,
                        change: function (e) {
                            var sq = "select name from salesp where no = :CODE";
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.ord_empno"].obj, undefined, thatForm.frm.objs["qry1.txt_empname"].obj);

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
                    require: false
                },
                txt_empname: {
                    colname: "txt_empname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"0px\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "23%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    keyboardFocus: false,
                },
                ordacc: {
                    colname: "ordacc",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '@{\"text\":\"txtIssueType\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "35%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            // var vl = thatForm.frm.objs["qry1.location_code"].obj.getSelectedKey();
                            // var ot = thatForm.frm.objs["qry1.ord_type"].obj.getSelectedKey();
                            // var objOrd = thatForm.frm.objs["qry1.ord_no"].obj;
                            // UtilGen.setControlValue(objOrd, "", "", true);
                            // if (vl != "") {
                            //     var nwOn = Util.getSQLValue("select nvl(max(ord_no),0)+1 from pord1 " +
                            //         " where ord_code=" + thatForm.vars.vou_code +
                            //         " and ord_type='" + ot + "' " +
                            //         " and location_code=" + Util.quoted(vl));
                            //     UtilGen.setControlValue(objOrd, nwOn, nwOn);
                            // }
                            thatForm.frm.objs["qry1.reserved_stock"].obj.setSelected(false);
                            thatForm.frm.objs["qry1.reserved_stock"].obj.setEnabled(false);
                            var oc = this.getSelectedKey();
                            if (oc == UtilGen.SalesOrderFunc.initAction.none || oc == UtilGen.SalesOrderFunc.initAction.approve)
                                thatForm.frm.objs["qry1.reserved_stock"].obj.setEnabled(true);

                        },
                        selectedKey: "saleInvs"
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "@" + UtilGen.SalesOrderFunc.initAction.none + "/txtNone," +
                        UtilGen.SalesOrderFunc.initAction.approve + "/poApprove," +
                        UtilGen.SalesOrderFunc.initAction.issueDeliver + "/issueDeliver," +
                        UtilGen.SalesOrderFunc.initAction.saleInvs + "/saleInvs," +
                        UtilGen.SalesOrderFunc.initAction.closeSO + "/ closeSO"
                },
                reference: {
                    colname: "reference",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"referenceNo\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "35%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                remarks: {
                    colname: "remarks",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTAREA,
                    title: '@{\"text\":\"txtRemark\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: { width: "35%", rows: 2, tooltip: "Press shift+enter for another row !" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true
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
                    cols: [
                        {
                            colname: "ORD_NO",
                            mTitle: Util.getLangText("txtNo"),
                            display_width: 75,
                            mSummary: "COUNT",
                        },
                        {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                            display_width: 100
                        },

                        {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                            display_width: 100,
                        },
                        {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                            display_width: 250

                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        },
                        {
                            colname: "ord_amt",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("amountTxt"),
                            display_width: 120,
                            mSummary: "SUM"

                        },
                        {
                            colname: "ord_discamt",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("txtDisc"),
                            display_width: 100,
                            mSummary: "SUM"

                        },
                        {
                            colname: "netamt",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("txtNetAmt"),
                            display_width: 100,
                            mSummary: "SUM"

                        }


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select ord_no,ord_date,ord_ref,ord_refnm,ord_amt,ord_discamt,ord_amt-ord_discamt netamt, keyfld from pord1 o1 where ord_code =" + that2.vars.vou_code +
                        " order by o1.ord_date desc,ord_no desc",
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
                            var saleinv = Util.getSQLValue("select saleinv from pord1 where keyfld=" + that2.frm.getFieldValue("keyfld"));
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
        //TODO_TEST IF BELOW LOWEST SELLING PRICE
        //TODO IF ABOVE CREDIT LIMIT        

        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            var sett = sap.ui.getCore().getModel("settings").getData();
            var belowcost = Util.nvl(sett["ALLOW_SALES_BELOW_COST"], "TRUE");
            var belowlsamt = Util.nvl(sett["ALLOW_SALES_BELOW_LOWEST"], "TRUE");
            var belowlstock = Util.nvl(sett["ALLOW_STOCK_BELOW_ZERO"], "TRUE");
            var abovecredlimit = Util.nvl(sett["ALLOW_SALES_ABOVE_CREDIT"], "TRUE");
            var rsrv = thatForm.frm.getFieldValue("qry1.reserved_stock");
            var errObj = function (msg, obj) {

                var o = thatForm.frm.getFieldValue(obj).obj;
                UtilGen.errorObj(obj, 1500);
                FormView.err(msg);
            };
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                flg = " flag=1 and ";
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pord1");
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
            var qrobj = thatForm.frm.objs["qry2"].obj;
            if (qrobj.eventCalc != undefined)
                qrobj.eventCalc(qrobj, undefined, -1, true, true);

            var netamt = Util.extractNumber(thatForm.frm.getFieldValue("net_amt"));
            var costamt = Util.extractNumber(thatForm.frm.getFieldValue("totcst"));
            var lsamt = Util.extractNumber(thatForm.frm.getFieldValue("totls"));
            if (netamt < 0)
                errObj("Save Denied : Net amount is  not valid !", "qry2.net_amt");
            if (belowcost != 'TRUE' && costamt > 0 && netamt < costamt)
                errObj("Save Denied : Net amount is  bewlow cost !", "qry2.totcst");
            if (belowlsamt != 'TRUE' && lsamt > 0 && netamt < lsamt)
                errObj("Save Denied : Net amount is  bewlow Lowest Selling !", "qry2.totls");

            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
            if (sqcnt == 0) errObj("Save Denied : Customer is invalid !", "qry1.ord_ref");
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) errObj("Save Denied : Parent customer not allowed !", "qry1.ord_ref");


            var brno = thatForm.frm.getFieldValue("qry1.ord_branchno");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from cbranch where  code='" + cod + "' and brno=" + brno);
            if (sqcnt == 0) errObj("Save Denied : Branch is invalid !", "qry1.ord_discamt");

            var loc = thatForm.frm.getFieldValue("qry1.location_code");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from locations where  code='" + loc + "'");
            if (sqcnt == 0) errObj("Save Denied : Location is invalid !", "qry1.location_code");

            var loc = thatForm.frm.getFieldValue("qry1.stra");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from store where " + flg + " no='" + loc + "'");
            if (sqcnt == 0) errObj("Save Denied : Store is invalid !", "qry1.location_code");

            var cod = thatForm.frm.getFieldValue("qry1.ordacc");
            if (!Util.isCBValValid(thatForm.frm.objs["qry1.ordacc"].obj))
                errObj("Save Denied : issue action  is invalid !", "qry1.ordacc");

            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            var qv = thatForm.frm.objs["qry2"].obj;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            var errRow = function (rown, ds, rfr) {
                var rn = rown;
                if (rfr != undefined)
                    for (var i = 0; i < ld.rows.length; i++)
                        if (ld.getFieldValue(i, "ORD_REFER") == rfr)
                            rn = i;
                if (rn - 1 < 0) {
                    qv.getControl().setFirstVisibleRow(0);
                    qv.addSelectionInterval(0, 0);
                }
                else if (Util.nvl(rn, -1) >= 0) {
                    qv.getControl().setFirstVisibleRow(rn - 1);
                    qv.getControl().addSelectionInterval(rn, rn);
                }
                FormView.err(ld.getFieldValue(rn, "ORD_REFER") + " -  " + ds);
            }

            var checkStockReserve = function (rn, dta) {
                var kf = thatForm.frm.getFieldValue('qry1.keyfld');
                var odt = Util.toOraDateString(thatForm.frm.getFieldValue('qry1.ord_date'));
                var pdt = Util.toOraDateString(ld.getFieldValue(rn, "ORD_PRD_DATE"));
                var edt = Util.toOraDateString(ld.getFieldValue(rn, "ORD_EXP_DATE"));
                var pkd = ld.getFieldValue(rn, "ORD_PACKD");
                var allqty = (dta.qty * dta.pk) + dta.uqty;
                var sq = "select c7_can_user_issue_item(':user',:str,':rfr',:allqty,:pdt,:prdt,:expdt,':exckf') from dual ";
                sq = sq.replaceAll(":user", sett["LOGON_USER"])
                    .replaceAll(":rfr", dta.rfr)
                    .replaceAll(":str", dta.str)
                    .replaceAll(":allqty", allqty)
                    .replaceAll(":pdt", odt)
                    .replaceAll(":prdt", pdt)
                    .replaceAll(":expdt", edt)
                    .replaceAll(":exckf", '"' + kf + '"');


                var can_issue = Util.getSQLValue(sq);
                if (can_issue < allqty)
                    errRow(i, "Save Denied : Can issue only " + (allqty / pk) + " " + pkd);
            }
            //CONTINUE check reserve stock availblae in approve and none and belowitemzero option if not approve and none
            for (var i = 0; i < ld.rows.length; i++) {
                var str = Util.extractNumber(ld.getFieldValue(i, "STRA"));
                var rfr = ld.getFieldValue(i, "ORD_REFER");
                var qty = Util.extractNumber(ld.getFieldValue(i, "ORD_PKQTY"));
                var uqty = Util.extractNumber(ld.getFieldValue(i, "ORD_UNQTY"));
                var pk = Util.extractNumber(ld.getFieldValue(i, "ORD_PACK"))
                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                checkStockReserve(i, {
                    str: str, rfr: rfr, qty: qty, uqty: uqty, pk: pk
                });
                if (dup[rfr + "-" + str] != undefined)
                    errRow(i, "Save Denied : Duplicate item entry # store = " + str);
                dup[rfr + "-" + str] = rfr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    errRow(i, "Save Denied : Item is a group item ! ");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                if (cnt == 0)
                    errRow(i, "Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0)
                    errRow(i, "Save Denied: PRICE invalid value !");
                if ((qty * pk) + uqty <= 0)
                    errRow(i, "Save Denied: QTY invalid value !");

            }

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



