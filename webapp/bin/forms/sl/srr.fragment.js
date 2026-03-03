sap.ui.jsfragment("bin.forms.sl.srr", {
    //TODO_RENDER info command for items and customer , open basic data, stock card, store balance,previous sales information.
    //TODO_RENDER ITEM REFERENCE CAN BE SEARCHED IF ENTERED PARTIALY 

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
            vou_code: 12,
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
        var dmlSq = "select NVL(O2.DESCR,i.descr) DESCR2,o2.*,((o2.ord_price-o2.ord_discamt)*(o2.ord_allqty/o2.ord_pack)) amount,i.descr descrx, " +
            " DELIVEREDQTY/i.pack rv_pkqty," +
            " purqty/i.pack return_pkqty," +
            " TO_CHAR(ORD_PRD_DATE,'DD/MM/RRRR') ORD_PRD_DATE2, " +
            " TO_CHAR(ORD_EXP_DATE,'DD/MM/RRRR') ORD_EXP_DATE2, " +
            " o2.ORD_PKCOST*ord_pack pack_cost," +
            "o2.ORD_PKCOST*o2.ord_allqty cost_amt  " +
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
                title: Util.getLangText("titSalesReturnRequest"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 600, "M": 800, "L": 800, "XL": 900 },
                    class: "srrForm"
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("rcvdTxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var rtxt = new sap.m.Text(thatForm.view.createId("rcvdTxt" + thatForm.timeInLong, { width: "300px", text: "" }));
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));

                    var saveForm = function (fnAfterSave, para1) {
                        if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                            thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                            Util.simpleConfirmDialog(Util.getLangText("msgSaveFormData"), function (oAction) {
                                thatForm.frm.cmdButtons.cmdSave.firePress();
                                if (fnAfterSave != undefined)
                                    fnAfterSave(para1);
                            });

                        } else if (fnAfterSave != undefined) fnAfterSave(para1);
                    }
                    var fnExe = function (para) {
                        thatForm.execSteps(para);
                    };
                    var setCaption = function (cmd, showcap, updcap) {
                        cmd.textShow = Util.getLangText(showcap);
                        cmd.textUpd = Util.getLangText(Util.nvl(updcap, showcap));
                    }
                    thatForm.rectangleIcon = "sap-icon://" + Util.getLangDescrAR("arrow-right", "arrow-right");
                    thatForm.selectIcon = "sap-icon://accept";
                    thatForm.showIcon = "sap-icon://show";
                    thatForm.commands = {};

                    thatForm.commands.cmdApprove = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("poApprove"),
                        press: function () {
                            saveForm(fnExe, "approve");
                        }
                    });

                    thatForm.commands.cmdRV = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("addGr"),
                        press: function () {
                            if (Util.nvl(this.showRecs, false))
                                fnExe("addGr");
                            else
                                saveForm(fnExe, "addGr");
                        }
                    });
                    thatForm.commands.cmdSR = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("soCmdAddSR"),
                        press: function () {
                            if (Util.nvl(this.showRecs, false))
                                fnExe("sr");
                            else
                                saveForm(fnExe, "sr");

                        }

                    });
                    thatForm.commands.cmdClose = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("closeSR"),
                        press: function () {
                            saveForm(fnExe, "closeSR");
                        }

                    });

                    setCaption(thatForm.commands.cmdApprove, 'poApprove');
                    setCaption(thatForm.commands.cmdRV, 'showGR', "addGr");
                    setCaption(thatForm.commands.cmdSR, 'soCmdShowSR', "soCmdAddSR");
                    setCaption(thatForm.commands.cmdClose, 'closeSR');

                    var hb1 = new sap.m.HBox({
                        items: [thatForm.commands.cmdApprove, thatForm.commands.cmdRV,
                        thatForm.commands.cmdSR,
                        ]
                    });
                    var hb = new sap.m.Toolbar({
                        content: [txt, rtxt, hb1, new sap.m.ToolbarSpacer(), txtMsg, thatForm.commands.cmdClose]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    rtxt.addStyleClass("totalVoucherTxt titleFontWithoutPad");

                    vbHeader.addItem(hb);
                },
                print_templates: [
                    {
                        title: "Print",
                        reportFile: "salretreq",
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
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "ord_rfr"],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "ord_rfr"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_AMT": ":qry2.totamt",
                            "ORD_DISCAMT": ":qry2.disc_amt",
                            "USERNM": Util.quoted(sett["LOGON_USER"]),
                            "ORD_REFERENCE": "':qry1.ord_rfr'"
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
                        applyCol: "C7.SRR1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 3, "M": 5, "L": 7, "XL": 10, "XXL": 14 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from pord2 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCRX', 'AMOUNT', 'PACKD', 'PACK', 'RV_PKQTY', "COST_AMT", "PACK_COST", "ORD_PRD_DATE2", "ORD_EXP_DATE2"],
                        insert_exclude_fields: ['DESCRX', 'AMOUNT', 'PACKD', 'PACK', 'RV_PKQTY', "COST_AMT", "PACK_COST", "ORD_PRD_DATE2", "ORD_EXP_DATE2"],
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
                                                "POS": "ORD_POS",
                                                "REFER": "ORD_REFER",
                                                "PACKD": "ORD_PACKD",
                                                "UNITD": "ORD_UNITD",
                                                "PACK": "ORD_PACK",
                                                "PKQTY": "ORD_PKQTY",
                                                "UNQTY": "ORD_UNQTY",
                                                "PRICE": "ORD_PIRCE",
                                                "DISCAMT": "ORD_DISCAMT",
                                                "STRA": "STRA",
                                            }
                                            UtilGen.PurchaseOrderFunc.copyDetails(thatForm, '"ITEMS"', '"PORD1"', rs);
                                        }
                                    }))
                                }
                            });
                            qrj.showToolbar.toolbar.addContent(colsetitems);
                            qrj.showToolbar.toolbar.addContent(colset);
                            var colset = UtilGen.addItemsInfoCmd({
                                applyCol: thatForm.frm.objs["qry2"].applyCol
                            });
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
                                        " prd_dt,exp_dt from items where reference=':rfr'";
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
                                    var amt = 0;
                                    var prd_dt = undefined;
                                    var exp_dt = undefined;

                                    if (sqdt.length > 0) {

                                        sq = sqdt[0].DESCR;
                                        child = sqdt[0].CHILDCOUNTS;
                                        packd = sqdt[0].PACKD;
                                        unitd = sqdt[0].UNITD;
                                        pack = sqdt[0].PACK;
                                        pcost = sqdt[0].UCOST * pack;
                                        prd_dt = new Date((sqdt[0].PRD_DT + "").replaceAll(",", ":"));
                                        exp_dt = new Date((sqdt[0].EXP_DT + "").replaceAll(",", ":"));
                                        cstamt = pcost * ((pqt * pack) + qt);
                                        amt = (price - ds) * ((pqt * pack) + qt);
                                    }
                                    ld.setFieldValue(i1, "DESCRX", sq);
                                    ld.setFieldValue(i1, "STRA", str);
                                    ld.setFieldValue(i1, "ORD_PACKD", packd);
                                    ld.setFieldValue(i1, "ORD_UNITD", unitd);
                                    ld.setFieldValue(i1, "ORD_PACK", pack);
                                    ld.setFieldValue(i1, "AMOUNT", amt);
                                    ld.setFieldValue(i1, "PACK_COST", pcost);
                                    ld.setFieldValue(i1, "COST_AMT", cstamt);
                                    if (Util.nvl(ld.getFieldValue(i1, "ORD_PRD_BATCH"), '') != '') {
                                        ld.setFieldValue(i1, "ORD_PRD_DATE2", prd_dt);
                                        ld.setFieldValue(i1, "ORD_EXP_DATE2", exp_dt);
                                    }
                                }

                            var sumAmt = 0;
                            var sumCost = 0;

                            for (var i = 0; i < ld.rows.length; i++) {
                                sumAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "AMOUNT"), df), 0);
                                sumCost += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "COST_AMT"), df), 0);
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
                            if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                                thatForm.view.byId("numtxt" + thatForm.timeInLong).setText(Util.getLangText("amountTxt") + " : " + df.format(netamt));

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

    execSteps: function (para) {
        var thatForm = this;
        if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW ||
            thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT)
            FormView.err("Form must be in VIEW mode !");
        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
        var aproved = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + kf);
        if (Util.nvl(para == "")) return;
        var fncallback = function () {
            thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
        }
        var addRV = function () {
            var formtype = "dialog";
            if (!Util.nvl(thatForm.commands.cmdRV.showRecs, false))
                UtilGen.execCmd('bin.forms.sl.srrdlv status=new formType=' + formtype + ' soKf=' + kf + ' formTitle=SO_DELIVERY', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);
            else {
                var sq = "select ord_no,to_char(ord_date,'dd/mm/rrrr') ord_date,keyfld from order1 where ord_code=120 and pord1_keyfld=" + kf + " order by ord_no";
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_DATE"], function (data) {
                        var bn = data.KEYFLD;
                        UtilGen.execCmd('bin.forms.sl.srrdlv status=new formType=' + formtype + ' keyfld=' + bn + ' formTitle=SO_DELIVERY', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);
                    }, { pWidth: "400px" }, undefined, undefined, "select a store Receipt ... ", [
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            hide: true
                        }
                    },
                ]);
            }

        }
        var addSR = function () {
            var selPokf = thatForm.frm.getFieldValue("qry1.keyfld");
            if (!thatForm.commands.cmdSR.showRecs && !thatForm.commands.cmdSR.dataUpdated)
                UtilGen.execCmd('bin.forms.sl.srrwzd formType=dialog formSize=905px,500px soKeyFld=' + selPokf + ' formTitle=Sales_Wizard', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);
        }
        switch (para) {
            case "approve":
                that2.helperFunc.approved();
                break;
            case "addDlv":
                addRV();
                break;
            case "sales":
                addSR();
                break;
            case "closeSRR":
                break;

            default:
                break;
        }

    },
    refreshIcons: function () {
        var thatForm = this;
        var checkCommand = function (cmd) {
            if (cmd.showRecs) {
                cmd.setText(cmd.textShow);
                cmd.setIcon(thatForm.showIcon);
            }
            else {
                cmd.setText(cmd.textUpd);
                cmd.setIcon((Util.nvl(cmd.dataUpdated, false) ? thatForm.selectIcon : thatForm.rectangleIcon));
            }
        };
        Object.keys(thatForm.commands).forEach((cmd) => {
            checkCommand(thatForm.commands[cmd]);
        });

    },
    enableCommands: function (pcmds, pEnableValue) {
        var thatForm = this;
        var enableValue = Util.nvl(pEnableValue, true);
        var cmds = Util.nvl(pcmds,
            Object.values(thatForm.commands));
        cmds = (Array.isArray(cmds) ? cmds : [cmds]);
        cmds.forEach((cmd) => {
            cmd.setEnabled(enableValue);
        });
    },
    queryCommands: function () {
        var thatForm = this;
        var showUpdate = function (pcmds, pEnableValue) {
            var enableValue = Util.nvl(pEnableValue, true);
            var cmds = Util.nvl(pcmds,
                Object.values(thatForm.commands));
            cmds = (Array.isArray(cmds) ? cmds : [cmds]);
            cmds.forEach((cmd) => {
                cmd.showRecs = enableValue;
            });
        }
        for (var a in thatForm.commands) thatForm.commands[a].dataUpdated = false;
        var isFormInView = thatForm.frm.objs["qry1"].status == FormView.RecordStatus.VIEW;
        showUpdate(undefined, false); // show add icon
        thatForm.refreshIcons();
        thatForm.enableCommands(undefined, false);
        if (!isFormInView) return;

        var sokf = thatForm.frm.getFieldValue("qry1.keyfld");
        var sodt = UtilGen.SalesRetReqFunc.checkSOStatus(sokf, false);
        var ordacc = sodt.ORDACC;

        if (sodt.ORD_FLAG == 1) {
            showUpdate(undefined, false);
            thatForm.enableCommands(undefined, false);
            thatForm.enableCommands(thatForm.commands.cmdApprove, true);
            thatForm.refreshIcons();
            return;
        } else
            thatForm.commands.cmdApprove.dataUpdated = true;

        if (sodt.ORD_FLAG == 3) {
            thatForm.enableCommands(undefined, false);
            showUpdate(undefined, true);
            thatForm.commands.cmdClose.dataUpdated = true;
            thatForm.refreshIcons();
            return;
        }

        if (ordacc == UtilGen.SalesRetReqFunc.initAction.saleRets ||
            ordacc == UtilGen.SalesRetReqFunc.initAction.issueRV
        ) {
            thatForm.enableCommands(undefined, true);
            thatForm.enableCommands(thatForm.commands.cmdApprove, false);
            thatForm.enableCommands(thatForm.commands.cmdSR, false);
            thatForm.enableCommands(thatForm.commands.cmdClose, false);
            showUpdate(undefined, true);
            thatForm.refreshIcons();
            return;
        }
        if (sodt.ORD_FLAG == 2) {
            thatForm.enableCommands(undefined, true);
            thatForm.enableCommands(thatForm.commands.cmdApprove, false);
            showUpdate(undefined, false);
            thatForm.commands.cmdRV.dataUpdated = (sodt.DLV_QTY >= sodt.ORD_QTY);
            thatForm.commands.cmdSR.dataUpdated = (sodt.SOLD_QTY >= sodt.ORD_QTY);
            thatForm.refreshIcons();
            return;
        }



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
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("SRR is POSTED ,INV # " + invno);
                        }

                        var cb = thatForm.frm.objs["qry1.ord_type"].obj;
                        var lo = thatForm.frm.getFieldValue("qry1.location_code");
                        var typ = thatForm.frm.getFieldValue("qry1.ord_type");
                        var oacc = thatForm.frm.getFieldValue("qry1.ordacc");

                        Util.fillCombo(cb, "select no code,descr name from invoicetype " +
                            " where location_code='" + lo + "' " +
                            " order by no "
                        );

                        if (oacc == UtilGen.SalesRetReqFunc.initAction.saleRets) {
                            var invno = Util.getSQLValue("select invoice_no from pur1 where invoice_code=12 and po_keyfld=" + qry.formview.getFieldValue("keyfld"));
                            qry.formview.setFieldValue("qry1.ord_rfr", invno, invno, true);
                        }

                        if (oacc == UtilGen.SalesRetReqFunc.initAction.issueRV) {
                            var invno = Util.getSQLValue("select invoice_no from order1 where ord_code=120 and po_keyfld=" + qry.formview.getFieldValue("keyfld"));
                            qry.formview.setFieldValue("qry1.ord_rfr", invno, invno, true);
                        }

                        cb.setSelectedKey(typ);
                        qry.formview.setFieldValue("qry2.disc_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry2.disc_p", 0, 0, true);
                        var discamt = Util.getSQLValue("select ord_discamt from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(discamt, 0) > 0) {
                            qry.formview.setFieldValue("qry2.disc_amt", discamt, discamt, true);
                        }
                        thatForm.queryCommands();
                        var sold = Util.getSQLValue("select nvl(sum(allqty),0) from pur2 where invoice_code=12 and po_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=120 and pord1_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var ordrd = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where ord_code=12 and keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var rcvdp = 0, soldp = 0;
                        if (ordrd > 0) { rcvdp = Math.round((100 / ordrd) * rcvd, 2); soldp = Math.round((100 / ordrd) * sold, 2); }

                        thatForm.view.byId("rcvdTxt" + thatForm.timeInLong).setText("Deliver/Sold: " + rcvdp + (soldp == rcvdp ? "" : " / " + soldp) + " %");

                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0) {
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

                        var ld = thatForm.frm.objs["qry2"].obj.mLctb;
                        for (var i = 0; i < ld.rows.length; i++) {
                            if (Util.nvl(ld.getFieldValue(i, "DESCR"), "") == "")
                                ld.setFieldValue(i, "DESCR", ld.getFieldValue(i, "DESCR2"));
                        }
                        thatForm.frm.objs["qry2"].obj.updateDataToControl();
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
                    if (qry.name == "qry1") {
                        var ordac = thatForm.frm.getFieldValue("qry1.ordacc");
                        if (ordac == UtilGen.SalesRetReqFunc.initAction.closeSRR)
                            Util.simpleConfirmDialog(Util.getLangText("msgCloseSR"), function (oAction) {
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
                            " ord_pkcost=:unit_cost " +
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
                        var objAc = thatForm.frm.objs["qry1.ordacc"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pord1");
                        var dt = thatForm.view.today_date.getDateValue();

                        UtilGen.setControlValue(objSt, sett["DEFAULT_STORE"], sett["DEFAULT_STORE"], true);
                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objAc, UtilGen.SalesRetReqFunc.initAction.saleRets, UtilGen.SalesRetReqFunc.initAction.saleRets, true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        qry.formview.setFieldValue("qry2.disc_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry2.disc_p", 0, 0, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();
                        thatForm.queryCommands();

                        setTimeout(() => {
                            objAc.$().find("input").attr("readonly", true);
                        }, 500);


                    }
                },
                afterEditRow(qry, index, ld) {
                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("keyfld");
                        var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                        if (actype == UtilGen.SalesRetReqFunc.initAction.approve ||
                            actype == UtilGen.SalesRetReqFunc.initAction.none
                        ) {
                            var sqDlv = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_code=120 and pord1_keyfld=" + kf);
                            if (sqDlv != 0) {
                                thatForm.frm.objs["qry1.ord_ref"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.ord_refnm"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.ord_branchno"].obj.setEditable(false);
                                thatForm.frm.objs["qry1.branchname"].obj.setEditable(false);
                                thatForm.frm.objs["qry2"].obj.setEditable(false);
                            }
                        } else {

                            var sq = "select accno from invoicetype where location_code=':loc' and no=:ino";
                            sq = sq.replaceAll(":loc", qry.formview.getFieldValue("qry1.location_code"))
                                .replaceAll(":ino", qry.formview.getFieldValue("qry1.ord_type"));
                            var ac = Util.getSQLValue(sq);
                            if (Util.nvl(ac, '') != '')
                                qry.formview.objs["qry1.ord_ref"].obj.setEditable(false);

                        }
                    }

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var sokf = thatForm.frm.getFieldValue("keyfld");
                    var sodt = UtilGen.SalesRetReqFunc.checkSOStatus(sokf, false);
                    if (sodt.ORD_FLAG == 3) {
                        UtilGen.showCustomMessageToast("SO is closed !!", 10, "red", "#fff");
                        throw "SO is closed !!"
                    }
                    if (sodt.ORDACC != UtilGen.SalesRetReqFunc.initAction.saleRets &&
                        sodt.ORDACC != UtilGen.SalesRetReqFunc.initAction.issueRV &&
                        sodt.ORD_FLAG != 1) {
                        UtilGen.showCustomMessageToast("Can't DELTE ! , SO type is " + sodt.ORDACC + " and now not opened !", 100, "red", "#fff");
                        throw "Can't DELTE ! , SO type is " + sodt.ORDACC + " and now not opened !";
                    }

                    var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                    if (actype == UtilGen.SalesRetReqFunc.initAction.approve ||
                        actype == UtilGen.SalesRetReqFunc.initAction.none
                    ) {
                        var sqDlv = Util.getSQLValue("select nvl(count(*),0) from c_order1 where ord_code=120 and pord1_keyfld=" + kf);
                        if (sqDlv != 0)
                            FormView.err("Deletion denied : Deliveries existed !");
                        sqDlv = Util.getSQLValue("select nvl(count(*),0) from pur1 where invoice_code=12 and  po_keyfld=" + kf);
                        if (sqDlv != 0)
                            FormView.err("Deletion denied : Sales existed !");
                    }
                },
                afterFormCreated: function (frm) {
                    if (this.blurAdded != undefined) return;
                    this.blurAdded = true;
                    setTimeout(() => {
                        var obj = frm.objs["qry1.ord_rfr"].obj;
                        var objn = frm.objs["qry1.ord_no"].obj;

                        obj.$().find("input").blur(function (oEvent) {
                            if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW)
                                setTimeout(() => {
                                    thatForm.helperFunc.fetchRef();
                                }, 10);

                        });
                        objn.$().find("input").blur(function (oEvent) {
                            if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW)
                                setTimeout(() => {
                                    thatForm.helperFunc.fetchOn();
                                }, 10);
                        });


                    }, 10);

                },
                beforeDelRow: function (qry, idx, ld, data) {
                    var delbfr = "";
                    if (qry.name == "qry1") {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var actype = thatForm.frm.getFieldValue("qry1.ordacc");
                        var sqI = "c7_srr_invoice(:keyfld,'Y'); ".replaceAll(":keyfld", kf);
                        var sq4 = (actype == UtilGen.SalesRetReqFunc.initAction.issueRV ?
                            sqI : (actype == UtilGen.SalesRetReqFunc.initAction.approve ||
                                actype == UtilGen.SalesRetReqFunc.initAction.none) ? "" :
                                actype == UtilGen.SalesRetReqFunc.initAction.saleRets ? sqI :
                                    actype == UtilGen.SalesRetReqFunc.initAction.closeSRR ? FormView.err("Cant delete once closed !") : "");
                        delbfr += sq4;
                    }
                    return delbfr;

                },
                afterEdit: function (qry) {
                    if (qry.name == "qry1") {

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
                    var kf = that.frm.getFieldValue("qry1.keyfld");
                    var oa = that.frm.getFieldValue("qry1.ordacc");
                    if (oa != UtilGen.SalesRetReqFunc.initAction.saleRets)
                        FormView.err("Must be inital action = Sales Return");
                    var dts = Util.execSQLWithData("select invoice_no,location_code,type from pur1 where po_keyfld=" + kf);
                    if (dts.length <= 0) FormView.err("No Invoice Found !");
                    return params + "&_para_pfromno=" + dts[0].INVOICE_NO +
                        "&_para_ptono=" + dts[0].INVOICE_NO + "&_para_plocation=" + dts[0].LOCATION_CODE + "&_para_vouType=" + dts[0].TYPE;
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
                    var sqI = "c7_srr_invoice(:keyfld); ".replaceAll(":keyfld", kf);
                    var sq4 = (actype == UtilGen.SalesRetReqFunc.initAction.approve ? sqA :
                        actype == UtilGen.SalesRetReqFunc.initAction.saleRets || actype == UtilGen.SalesRetReqFunc.initAction.closeSRR || actype == UtilGen.SalesRetReqFunc.initAction.issueRV
                            ? sqA + sqI : "");
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    var sq5 = "c7_SRR_UPDATE_DISC_GROSS(" + kf + ");";
                    return sq + sq3 + sq4 + sq5;
                },
                beforeEdit: function (qry) {
                    if (qry.name == "qry1" && qry.status == FormView.RecordStatus.EDIT) {
                        var sokf = qry.formview.getFieldValue("keyfld");
                        var sodt = UtilGen.SalesRetReqFunc.checkSOStatus(sokf, false);
                        if (sodt.ORD_FLAG == 3) {
                            UtilGen.showCustomMessageToast("SO is closed !!", 100, "red", "#fff");
                            return false;
                        }
                        if (sodt.ORDACC != UtilGen.SalesRetReqFunc.initAction.saleRets &&
                            sodt.ORDACC != UtilGen.SalesRetReqFunc.initAction.issueRV &&
                            sodt.ORD_FLAG != 1) {
                            UtilGen.showCustomMessageToast("Can't EDIT ! , SO type is " + sodt.ORDACC + " and now not opened !", 100, "red", "#fff");
                            return false;
                        }
                        return true;
                    }
                },
            };
        },
        getSummary: function () {
            var thatForm = this.thatForm;
            var sumSpan = "XL2 L2 M2 S12";
            var sumSpan2 = "XL2 L6 M6 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
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
                ordacc: {
                    colname: "ordacc",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"txtIssueAction\",\"width\":\"15%\","textAlign":"End","styleClass":"redboldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    default_value: sett["DEFAULT_STORE"],
                    other_settings: {
                        editable: true, width: "24%",
                        items: {
                            path: "/",
                            template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                            templateShareable: true
                        },
                        selectionChange: function (e) {
                            var cnt = this;
                            thatForm.helperFunc.setNewPurNo();
                            setTimeout(function () {
                                cnt.$().find("input").attr("readonly", true);
                            }, 250);


                        },
                        change: function (e) {
                            var cnt = this;
                            // thatForm.queryCommands();
                            if (!Util.isCBValValid(cnt))
                                setTimeout(() => {
                                    cnt.setValue("");
                                    cnt.focus();
                                    cnt.$().find("input").attr("readonly", true);
                                }, 150);
                        },
                        selectedKey: UtilGen.SalesRetReqFunc.initAction.saleRets
                    },

                    edit_allowed: false,
                    insert_allowed: true,
                    require: true,
                    list: "@" + UtilGen.SalesRetReqFunc.initAction.none + "/txtNone," +
                        UtilGen.SalesRetReqFunc.initAction.approve + "/poApprove," +
                        UtilGen.SalesRetReqFunc.initAction.issueRV + "/issueRV," +
                        UtilGen.SalesRetReqFunc.initAction.saleRets + "/saleRets," +
                        UtilGen.SalesRetReqFunc.initAction.closeSRR + "/closeSR"
                },
                ord_rfr: {
                    colname: "ord_rfr",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtReferSymbol\",\"width\":\"0px\","textAlign":"End","styleClass":"redText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true,
                        width: "11%",
                        tooltip: Util.getLangText("ttMsgNewPurNoOnSO")
                    },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: false,
                    keyboardFocus: true,
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
                            var objOrd = thatForm.frm.objs["qry1.ord_no"].obj;
                            if (lo != "") {
                                var nwOn = UtilGen.Vouchers.getNewPORDNo(lo, thatForm.vars.vou_code, cb.getSelectedKey());
                                UtilGen.setControlValue(objOrd, nwOn, nwOn);
                                thatForm.helperFunc.setNewPurNo();
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

                                if (vl != "" && ot != "") {
                                    var nwOn = UtilGen.Vouchers.getNewPORDNo(vl, thatForm.vars.vou_code, ot);
                                    UtilGen.setControlValue(objOrd, nwOn, nwOn);
                                    thatForm.helperFunc.setNewPurNo();
                                } else
                                    UtilGen.setControlValue(objOrd, "", "", true);

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
                    title: '@{\"text\":\"txtOrdNo\",\"width\":\"10%\","textAlign":"End","styleClass":"redText boldText"}',
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
                reference: {
                    colname: "reference",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"referenceNo\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                    title: '{\"text\":\"txtRemark\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
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
                attachment: {
                    colname: "attachment",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"txtAttachment\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_BEGIN",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        showValueHelp: true,
                        editable: false,
                        width: "35%",
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

            };
        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of Requests",
                    list_type: "sql",
                    list_para: {
                        selectStr: "@100/Last 100,200/Last 200,1000/Last 1000,-1/All",
                        defaultKey: "1000",
                    },
                    cols: [
                        {
                            colname: "ORD_NO",
                            mTitle: Util.getLangText("txtOrdNo"),
                            display_width: 75,
                            mSummary: "COUNT",
                        },
                        {
                            colname: "SR_STATUS",
                            mTitle: Util.getLangText("txtStatus"),
                            display_width: 80,
                        },

                        {
                            colname: "ORDACC",
                            mTitle: Util.getLangText("txtIssueAction"),
                            display_width: 100,
                        },
                        {
                            colname: "INVOICE_NO",
                            mTitle: Util.getLangText("referenceNo"),
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
                            colname: "PURP",
                            mTitle: Util.getLangText("txtReturned"),
                            display_width: 80,
                        },

                        {
                            colname: "DLVP",
                            mTitle: Util.getLangText("txtReceived"),
                            display_width: 80,
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
                    sql: "select *from (select o1.ord_no, decode(o1.ord_flag,1,'Not-Approved',2,'Open',3,'Closed') SR_STATUS," +
                        " o1.ord_date,o1.ordacc,pur.invoice_no,o1.ord_ref,o1.ord_refnm," +
                        "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * purqty, 2)) else 0 end)||'%' purp ," +
                        "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * DELIVEREDQTY, 2)) else 0 end)||'%' dlvp ," +
                        "o1.ord_amt,o1.ord_discamt,o1.ord_amt-o1.ord_discamt netamt, o1.keyfld from pord1 o1," +
                        " (select max(p.keyfld) kfld,max(p.invoice_no) invoice_no,po_keyfld  from pur1 p where p.invoice_code=12 and po_keyfld is not null group by p.po_keyfld) pur " +
                        "  " +
                        " where o1.ord_code =" + that2.vars.vou_code +
                        " and pur.po_keyfld(+) =o1.keyfld " +
                        " order by o1.ord_date desc,o1.ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1) ",
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
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            var sett = sap.ui.getCore().getModel("settings").getData();

            var errObj = function (msg, obj) {

                var o = thatForm.frm.objs[obj].obj;
                UtilGen.errorObj(o, 3500);
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
            if (netamt < 0)
                errObj("Save Denied : Net amount is  not valid !", "qry2.net_amt");

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
                    qv.getControl().addSelectionInterval(0, 0);
                }
                else if (Util.nvl(rn, -1) >= 0) {
                    qv.getControl().setFirstVisibleRow(rn - 1);
                    qv.getControl().addSelectionInterval(rn, rn);
                }
                FormView.err(ld.getFieldValue(rn, "ORD_REFER") + " -  " + ds);
            }
            for (var i = 0; i < ld.rows.length; i++) {
                var str = Util.extractNumber(ld.getFieldValue(i, "STRA"));
                var rfr = ld.getFieldValue(i, "ORD_REFER");
                var qty = Util.extractNumber(ld.getFieldValue(i, "ORD_PKQTY"));
                var uqty = Util.extractNumber(ld.getFieldValue(i, "ORD_UNQTY"));
                var pk = Util.extractNumber(ld.getFieldValue(i, "ORD_PACK"))
                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                var ds = Util.extractNumber(ld.getFieldValue(i, "ORD_DISCAMT"));
                // if (dup[rfr + "-" + str] != undefined)
                //     errRow(i, "Save Denied : Duplicate item entry # store = " + str);
                // dup[rfr + "-" + str] = rfr;
                if (dup[rfr + "-" + str + "-" + (pr - ds) + "-" + pk] != undefined)
                    errRow(i, "Save Denied : Duplicate item entry # store = " + str);
                dup[rfr + "-" + str + "-" + (pr - ds) + "-" + pk] = rfr;
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

        },
        setNewPurNo: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW) return;
            var oacc = thatForm.frm.getFieldValue("qry1.ordacc");
            var loc = thatForm.frm.objs["qry1.location_code"].obj.getSelectedKey();
            var typ = thatForm.frm.objs["qry1.ord_type"].obj.getSelectedKey();

            thatForm.frm.setFieldValue("qry1.ord_rfr", "", "", true);
            thatForm.frm.objs["qry1.ord_rfr"].obj.setEditable(false);

            if (oacc == UtilGen.SalesRetReqFunc.initAction.saleRets) {
                thatForm.frm.objs["qry1.ord_rfr"].obj.setEditable(true);
                if (typ != "" && loc != '') {
                    var nw = UtilGen.Vouchers.getNewPurNo(loc, thatForm.vars.vou_code, typ);
                    thatForm.frm.setFieldValue("qry1.ord_rfr", nw, nw, true);
                }

            }

            if (oacc == UtilGen.SalesRetReqFunc.initAction.issueRV) {
                thatForm.frm.objs["qry1.ord_rfr"].obj.setEditable(true);
                if (typ != "" && loc != '') {
                    var nw = Util.getSQLValue("select nvl(max(ord_no),0)+1 from order1 " +
                        " where location_code='" + loc + "' and ord_code=120");
                    thatForm.frm.setFieldValue("qry1.ord_rfr", nw, nw, true);
                }

            }
        },
        fetchRef: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW) return;
            var oacc = thatForm.frm.getFieldValue("qry1.ordacc");
            if (oacc != UtilGen.SalesRetReqFunc.initAction.saleRets &&
                oacc == UtilGen.SalesRetReqFunc.initAction.issueRV)
                return;
            var rfrFld = "ord_reference";
            var rfr = thatForm.frm.getFieldValue("qry1.ord_rfr");
            var loc = thatForm.frm.getFieldValue("qry1.location_code");
            var typ = thatForm.frm.getFieldValue("qry1.ord_type");
            var selectMultiple = function (sq) {
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_REFNM"], function (data) {
                        var bn = data.KEYFLD;
                        thatForm.frm.setFieldValue('pac', bn);
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                    }, { pWidth: "80%" }, undefined, undefined, "Many orders found in same reference ", [
                    {
                        LOCATION: {
                            colname: "LOCATION",
                            display_width: 100,
                            mTitle: Util.getLangText("locationTxt"),
                        },
                    },
                    {
                        ORD_DATE: {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                            display_width: 100
                        }
                    },
                    {
                        REFERENCE: {
                            colname: "ORD_NO",
                            display_width: 80,
                            mTitle: Util.getLangText("referenceNo"),
                        }
                    },
                    {
                        TYPEDESCR: {
                            colname: "TYPEDESCR",
                            mTitle: Util.getLangText("txtOrdType"),
                            display_width: 120,
                        }
                    },
                    {
                        ORD_REF: {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                            display_width: 100,
                        }
                    },
                    {
                        ORD_REFNM: {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                            display_width: 250

                        }
                    },
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        }
                    },
                ]);
            }


            var qr = Util.execSQLWithData("select keyfld,ord_refnm from pord1 where ORD_CODE=12 AND " +
                rfrFld + "='" + rfr + "' and " +//  location_code='" + loc + "' and " +
                " ordacc='" + oacc + "'");
            if (Util.nvl(qr, "") == "" || qr.length == 0) {
                if (oacc == UtilGen.SalesRetReqFunc.initAction.saleRets) {
                    qr = Util.execSQLWithData("select po_keyfld keyfld,inv_refnm ord_refnm from pur1 where po_keyfld is not null and invoice_code=12 AND " +
                        "invoice_no='" + rfr + "'"); //and location_code='" + loc + "'");
                    if (Util.nvl(qr, "") == "" || qr.length == 0)
                        return;
                    if (qr.length > 1)
                        selectMultiple("select O.location_code||'-'||L.NAME LOCATION,it.DESCR TYPEDESCR,o.invoice_date ord_date " +
                            " invoice_no reference,o.inv_ref ord_ref,o.inv_refnm ord_refnm, o.po_keyfld keyfld from pur1 o,locations l,invoicetype it" +
                            " where o.invoice_code=12 and it.location_code=o.location_code and l.code=o.location_code and " +
                            " it.no=o.type and o.invoice_no = '" + rfr + "'" +
                            " order by o.location_code,o.ord_no ");


                }
            }

            var rfrx = qr[0].KEYFLD;
            var desx = qr[0].ORD_REFNM;
            if (qr.length == 1)
                Util.simpleConfirmDialog("SO existed for client :" + desx + " fetch data ?", function (oAction) {
                    thatForm.frm.setFieldValue('pac', rfrx);
                    thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                    thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);

                }, undefined, undefined, "OK");
            else
                selectMultiple("select O.location_code||'-'||L.NAME LOCATION,it.DESCR TYPEDESCR,o.ord_date," +
                    " ord_reference reference,o.ord_ref,o.ord_refnm, o.keyfld from pord1 o,locations l,invoicetype it" +
                    " where o.ord_code=12 and it.location_code=o.location_code and l.code=o.location_code and " +
                    " it.no=o.ord_type and o." + rfrFld + " = '" + rfr + "' and " +
                    " ordacc='" + oacc + "' order by o.location_code,o.ord_no ");
        },
        fetchOn: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW) return;
            var rfrFld = "ord_no";
            var rfr = thatForm.frm.getFieldValue("qry1.ord_no");
            var loc = thatForm.frm.getFieldValue("qry1.location_code");
            var typ = thatForm.frm.getFieldValue("qry1.ord_type");


            var selectMultiple = function (sq) {
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_REFNM"], function (data) {
                        var bn = data.KEYFLD;
                        thatForm.frm.setFieldValue('pac', bn);
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                    }, { pWidth: "80%" }, undefined, undefined, "Many orders found in same reference ", [
                    {
                        LOCATION: {
                            colname: "LOCATION",
                            display_width: 100,
                            mTitle: Util.getLangText("locationTxt"),
                        },
                    },
                    {
                        ORD_DATE: {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                            display_width: 100
                        }
                    },
                    {
                        REFERENCE: {
                            colname: "ORD_NO",
                            display_width: 80,
                            mTitle: Util.getLangText("referenceNo"),
                        }
                    },
                    {
                        TYPEDESCR: {
                            colname: "TYPEDESCR",
                            mTitle: Util.getLangText("txtOrdType"),
                            display_width: 120,
                        }
                    },
                    {
                        ORD_REF: {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                            display_width: 100,
                        }
                    },
                    {
                        ORD_REFNM: {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                            display_width: 250

                        }
                    },
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        }
                    },
                ]);
            }
            var qr = Util.execSQLWithData("select keyfld,ord_refnm from pord1 where ORD_CODE=12 AND " +
                rfrFld + "='" + rfr + "'" //  location_code='" + loc + "' and " +
            );
            if (Util.nvl(qr, "") == "" || qr.length == 0)
                return;

            var rfrx = qr[0].KEYFLD;
            var desx = qr[0].ORD_REFNM;
            if (qr.length == 1)
                Util.simpleConfirmDialog("SO existed for client :" + desx + " fetch data ?", function (oAction) {
                    thatForm.frm.setFieldValue('pac', rfrx);
                    thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                    thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                }, undefined, undefined, "OK");
            else
                selectMultiple("select O.location_code||'-'||L.NAME LOCATION,it.DESCR TYPEDESCR,o.ord_date," +
                    " ord_reference reference,o.ord_ref,o.ord_refnm, o.keyfld from pord1 o,locations l,invoicetype it" +
                    " where o.ord_code=12 and it.location_code=o.location_code and l.code=o.location_code and " +
                    " it.no=o.ord_type and o." + rfrFld + " = '" + rfr + "' " +
                    " order by o.location_code,o.ord_no ");


        },
        approved: function () {
            var that2 = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var ordn = that2.frm.getFieldValue("qry1.ord_no");
            var kf = that2.frm.getFieldValue("qry1.keyfld");
            var flg = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + kf);
            if (flg != 1 || (
                (that2.frm.objs["qry1"].status != FormView.RecordStatus.VIEW
                ))) { FormView.err("SO should either not approved or in VIEW MODE") };

            var sq = " begin " +
                " update pord1 set ord_flag=2,approved_by=:apr_by,approved_time=:apr_time where keyfld=" + kf + ";" +
                " update pord2 set ord_flag=2 where keyfld=" + kf +
                ";";
            sq += " end;"
            sq = sq.replaceAll(":apr_by", Util.quoted(sett["LOGON_USER"]))
                .replaceAll(":apr_time", "sysdate");
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess(Util.getLangText("msgSaved"));
                that2.frm.setFieldValue('pac', Util.nvl(kf, ""));
                that2.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                that2.frm.loadData(undefined, FormView.RecordStatus.VIEW);
            }
        },
        getItemPrice: function (refer) {
            var thatForm = this.thatForm;
            var dt = thatForm.frm.getFieldValue("qry1.ord_date");
            var sqcnt = ("select get_item_price2(:refer,':ref_code',:loc,:ord_date) from dual ")
                .replaceAll(":ref_code", thatForm.frm.getFieldValue("qry1.ord_ref"))
                .replaceAll(":loc", thatForm.frm.getFieldValue("qry1.ord_branchno"))
                .replaceAll(":refer", refer)
                .replaceAll(":ord_date", Util.toOraDateString(dt));

            var cnt = Util.getSQLValue(sqcnt);
            return cnt;
        },

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



