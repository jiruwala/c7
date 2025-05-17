sap.ui.jsfragment("bin.forms.jo.jo", {


    //TODO  TEST after approval , enable update design, dye and stock , close jo
    // if dye, design,stock completed enable production,add sales , close jo


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
            vou_code: 601,
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
        var dmlSq = "select o2.*," +
            "((o2.ord_price-o2.ord_discamt)*(o2.ord_allqty/o2.ord_pack)) amount, " +
            " DELIVEREDQTY/i.pack dlv_pkqty," +
            " TO_CHAR(ORD_PRD_DATE,'DD/MM/RRRR') ORD_PRD_DATE2, " +
            " TO_CHAR(ORD_EXP_DATE,'DD/MM/RRRR') ORD_EXP_DATE2 " +
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
                title: Util.getLangText("Job Order"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: {
                    width: { "S": 600, "M": 800, "L": 800, "XL": 900 },
                    class: "soForm"
                },
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
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
                        thatForm.executeStep(para);
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

                    thatForm.commands.cmdStock = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdShowStock"),
                        press: function () {
                            saveForm(fnExe, "stock");
                        }

                    });

                    thatForm.commands.cmdDesign = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdUpdDesign"),
                        press: function () {
                            saveForm(fnExe, "design");
                        }

                    });
                    thatForm.commands.cmdDye = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdUpdDye"),
                        press: function () {
                            saveForm(fnExe, "dye");
                        }

                    });
                    thatForm.commands.cmdProduction = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdProdSteps"),
                        press: function () {
                            saveForm(fnExe, "production");
                        }

                    });

                    thatForm.commands.cmdSales = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdAddSales"),
                        press: function () {
                            saveForm(fnExe, "sales");
                        }

                    });

                    thatForm.commands.cmdClose = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("closeJO"),
                        press: function () {
                            saveForm(fnExe, "closeJO");
                        }

                    });
                    //attach captions for show and update to button for display in queryCommand funciton
                    setCaption(thatForm.commands.cmdApprove, 'poApprove');
                    setCaption(thatForm.commands.cmdStock, 'joCmdShowStock', 'joCmdUpdStock');
                    setCaption(thatForm.commands.cmdDesign, 'joCmdShowDesign', 'joCmdUpdDesign');
                    setCaption(thatForm.commands.cmdDye, 'joCmdShowDye', 'joCmdUpdDye');
                    setCaption(thatForm.commands.cmdProduction, 'joCmdProdSteps');
                    setCaption(thatForm.commands.cmdSales, 'joCmdShowSales', 'joCmdAddSales');
                    setCaption(thatForm.commands.cmdClose, 'closeJO');

                    var hb1 = new sap.m.HBox({
                        items: [thatForm.commands.cmdApprove, thatForm.commands.cmdDesign, thatForm.commands.cmdDye, thatForm.commands.cmdStock,
                        new sap.m.Text({ width: "20px" }),
                        thatForm.commands.cmdProduction,
                        new sap.m.Text({ width: "30px" }),
                        thatForm.commands.cmdSales,
                        thatForm.commands.cmdClose
                        ]
                    });
                    var hb = new sap.m.Toolbar({
                        content: [txt, hb1, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                    // vbHeader.addItem(hb1);
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
                        dml: "select *from PORD1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "empname", "itemname", "branchname"],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "empname", "itemname", "branchname"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "STRA": sett["DEFAULT_STORE"],
                            "ORD_TYPE": 1,

                        },
                        update_default_values: {
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
                        applyCol: "C7.JO1",
                        addRowOnEmpty: true,
                        dml: dmlSq,
                        dispRecords: { "S": 5, "M": 7, "L": 10, "XL": 14, "XXL": 18 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from pord2 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'AMOUNT'],
                        insert_exclude_fields: ['AMOUNT'],
                        insert_default_values: {
                            "PERIODCODE": sett["CURRENT_PERIOD"],
                            "LOCATION_CODE": ":qry1.location_code",
                            "ORD_NO": ":qry1.ord_no",
                            "ORD_CODE": thatForm.vars.vou_code,
                            "ORD_DATE": ":qry1.ord_date",
                            "KEYFLD": ":qry1.keyfld",
                            "STRA": sett["DEFAULT_STORE"],
                            "ORD_TYPE": 1,
                            "ORD_REFER": ":qry1.ord_ship",
                            "ORD_PRD_DATE": "(select prd_dt from items where reference=':qry1.ord_ship')",
                            "ORD_EXP_DATE": "(select exp_dt from items where reference=':qry1.ord_ship')"

                        },
                        update_default_values: {
                        },
                        table_name: "pord2",
                        before_add_table: function (scrollObjs, qrj) {
                            UtilGen.createDefaultToolbar1(qrj, ["DESCR"], true);
                            scrollObjs.push(qrj.showToolbar.toolbar);
                            qrj.eventKey = function (key, rowno, colno, firstVis) {
                                var totalRows = qrj.getControl().getModel().getData().length;
                                var visRows = qrj.getControl().getVisibleRowCount();
                                var cl = UtilGen.getTableColNo(qrj.getControl(), "DESCR");
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
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_ship"), '') == '')
                                FormView.err(Util.getLangText("MUST ENTER JOB NATURE !"));
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_ref"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterOrdRef"));
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_branchno"), '') == '')
                                FormView.err(Util.getLangText("msgBRMustEnterBranch"));
                            thatForm.helperFunc.validity.updateFieldsEditing();
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
    //CONTINUE implement all steps
    executeStep: function (para) {
        var thatForm = this;
        var commands = {
            "approve": thatForm.commands.cmdApprove,
            "design": thatForm.commands.cmdDesign,
            "dye": thatForm.commands.cmdDye,
            "production": thatForm.commands.cmdProduction,
            "sales": thatForm.commands.cmdSales,
            "closeJO": thatForm.commands.cmdProduction,
        };
        var sett = sap.ui.getCore().getModel("settings").getData();
        if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW ||
            thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT)
            FormView.err("Form must be in VIEW mode !");

        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
        var kf = thatForm.frm.getFieldValue("qry1.keyfld");

        // approve function seperatly from steps
        var do_approve = function () {
            var sq = "update pord1 set ord_flag=2,APPROVED_BY=':approved_by'," +
                "approved_time=sysdate where keyfld=" + kf;
            sq = sq.replaceAll(":approved_by", sett["LOGON_USER"]);
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess("Approved done !");
                thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
            }
        }
        var do_basic_steps = function () {

            var txtStepType = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "50%", editable: false });
            var txtStepTime = new sap.m.DateTimePicker({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: commands[para].showRecs ? false : true });
            var txtEmpNo = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "20%",
                editable: commands[para].showRecs ? false : true,
                showValueHelp: true,
                change: function (e) {
                    var sq = "select name from salesp where no = :CODE";
                    UtilGen.Search.getLOVSearchField(sq, this, undefined, txtEmpName);
                },
                valueHelpRequest: function (e) {
                    UtilGen.Search.do_quick_search(e, this,
                        "select no code,name title from salesp  order by no ",
                        "select no code,name title from salesp where NO=:CODE", txtEmpName, undefined, undefined, undefined);
                }

            });
            var txtEmpName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
            var txtAttach = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: commands[para].showRecs ? false : true });
            var txtRemarks = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: commands[para].showRecs ? false : true });
            var vb = new sap.m.VBox();
            var doSave = function () {
                if (txtEmpNo.getValue() != "") {
                    var emp = Util.getSQLValue("select max(no) from salesp where no='" + txtEmpNo.getValue() + "'");
                    if (Util.nvl(emp, '') == '') FormView.err("Employee not valid !");
                }
                var dt = thatForm.frm.getFieldValue("qry1.ord_date");

                if (dt.getTime() > txtStepTime.getDateValue().getTime())
                    FormView.err("Err ! Step date is more than JO date !");

                var sq = "update pord1 set jo_:step_user=':user' , " +
                    "jo_:step_time=:regtime , jo_:step_emp=':empno' ," +
                    "jo_:step_remarks=':remarks' where keyfld=" + kf;

                sq = sq.replaceAll(":step", para)
                    .replaceAll(":user", sett["LOGON_USER"])
                    .replaceAll(":regtime", Util.toOraDateTimeString(txtStepTime.getDateValue()))
                    .replaceAll(":empno", txtEmpNo.getValue())
                    .replaceAll(":remarks", txtRemarks.getValue());
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS")
                    FormView.msgSuccess("This step is updated  !");
            }

            txtStepTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");

            var fe = [
                Util.getLabelTxt("Step Type", "30%", "", "redText"), txtStepType,
                Util.getLabelTxt("Time", "30%", ""), txtStepTime,
                Util.getLabelTxt("Emp NO", "30%", ""), txtEmpNo,
                Util.getLabelTxt("", "0px", "@"), txtEmpName,
                Util.getLabelTxt("Attachment", "30%", ""), txtAttach,
                Util.getLabelTxt("Remarks", "30%", ""), txtRemarks,
            ];
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                width: { "S": 280, "M": 380, "L": 480, "XL": 480 },
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
            cnt.addContent(new sap.m.VBox({ height: "20px" }));
            vb.addItem(cnt);
            Util.navEnter(fe);
            var dlg = new sap.m.Dialog({
                title: "Steps : " + para,
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 500, "XL": 500 }) + "px",
                contentHeight: "250px",
                content: [vb],
                modal: true,
                buttons: [
                    new sap.m.Button({
                        text: Util.getLangText("cmdDone"),
                        icon: "sap-icon://accept",
                        pressed: false,
                        enabled: commands[para].showRecs ? false : true,
                        press: function () {
                            doSave();
                            dlg.close();
                            thatForm.queryCommands();
                        }

                    }),
                    new sap.m.Button({
                        text: Util.getLangText("cmdClose"),
                        icon: "sap-icon://decline",
                        press: function () {
                            dlg.close();
                            thatForm.queryCommands();
                        }
                    })

                ]
            }).addStyleClass("sapUiSizeCompact");;
            dlg.open();
            //load data            
            txtStepType.setValue(para);
            txtStepTime.setDateValue(new Date());
            txtRemarks.setValue("");
            txtEmpNo.setValue("");
            txtEmpName.setValue("");
            var sqj = ("select ord_flag,ordacc,JO_:STEP_USER JO_STEP_USER, " +
                "JO_:STEP_EMP JO_STEP_EMP,JO_:STEP_REMARKS JO_STEP_REMARKS," +
                "to_char(JO_:STEP_TIME,'mm/dd/rrrr hh24.mi' ) JO_STEP_TIME, " +
                " (select max(name) from salesp where no=jo_:STEP_emp) JO_STEP_EMPNAME " +
                "from pord1 where keyfld="
                + thatForm.frm.getFieldValue("keyfld"))
                .replaceAll(":STEP", para);
            var dt = Util.execSQLWithData(sqj);
            if (dt.length > 0 && dt[0].USER != "") {
                txtStepTime.setDateValue(new Date(dt[0].JO_STEP_TIME.replaceAll(".", ":")));
                txtRemarks.setValue(dt[0].JO_STEP_REMARKS);
                txtEmpNo.setValue(dt[0].JO_STEP_EMP);
                txtEmpName.setValue(dt[0].JO_STEP_EMPNAME);
            }

        }
        // do step dye, design, stock but not production and add sales, closejo

        switch (para) {
            case "approve":
                Util.simpleConfirmDialog("After approved you may not edit delete this JO , continue ? ", function (oAction) {
                    do_approve();
                });
                break;
            case "design":
            case "dye":
                do_basic_steps();
                break;
            case "stock":
                thatForm.do_stock_step();
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
        var isFormInView = thatForm.frm.objs["qry1"].status == FormView.RecordStatus.VIEW
        var ordacc = thatForm.frm.getFieldValue("qry1.ordacc");
        showUpdate(undefined, false);
        thatForm.refreshIcons();
        thatForm.enableCommands(undefined, false);
        if (!isFormInView) return;
        var sqj = "select ord_flag,ordacc,JO_DESIGN_USER, JO_DYE_USER,JO_STOCK_USER,to_char(JO_ACTIVE_FROM,'dd/mm/rrrr hh24.mi' ) active_date from pord1 where keyfld="
            + thatForm.frm.getFieldValue("keyfld");
        var dt = Util.execSQLWithData(sqj);
        var approve = 1;

        if (dt.length > 0) {
            approve = Util.nvl(dt[0].ORD_FLAG, 1);
            ordacc = Util.nvl(dt[0].ORDACC, thatForm.frm.getFieldValue("qry1.ordacc"));
            if (Util.nvl(dt[0].JO_DESIGN_USER, "") != "") thatForm.commands.cmdDesign.dataUpdated = true;
            if (Util.nvl(dt[0].JO_DYE_USER, "") != "") thatForm.commands.cmdDye.dataUpdated = true;

            showUpdate(undefined, false);
            thatForm.enableCommands(undefined, false);
            if (Util.nvl(dt[0].ACTIVE_DATE, '') != '') {
                thatForm.enableCommands(undefined, true);
                showUpdate([
                    thatForm.commands.cmdDesign,
                    thatForm.commands.cmdDye,
                    thatForm.commands.cmdStock
                ], true);
                thatForm.enableCommands([
                    thatForm.commands.cmdApprove,
                ], false);
                showUpdate([
                    thatForm.commands.cmdProduction,
                    thatForm.commands.cmdSales,
                ], false);
            } else if (approve == 2 && (Util.nvl(dt[0].ACTIVE_DATE, '') == '')) {
                thatForm.enableCommands([
                    thatForm.commands.cmdDesign,
                    thatForm.commands.cmdDye,
                    thatForm.commands.cmdStock
                ], true);
                thatForm.enableCommands([
                    thatForm.commands.cmdProduction,
                    thatForm.commands.cmdSales,
                ], false);
                showUpdate(undefined, false);
            } else if (approve == 1) {
                thatForm.enableCommands(undefined, false);
                thatForm.enableCommands(thatForm.commands.cmdApprove, true);
            } else if (approve == 3) {
                thatForm.enableCommands(undefined, true);
                showUpdate(undefined, true);
                thatForm.enableCommands(cmdClose, false);
            }
        }
        thatForm.refreshIcons();

    },
    do_stock_step: function () {
                        
    },
    helperFunc: {
        validity: {
            init: function (thatForm) {
                this.thatForm = thatForm;
            },
            updateFieldsEditing: function () {
                var thatForm = this.thatForm;
                var qv = thatForm.frm.objs["qry2"].obj;
                var ld = qv.mLctb;
                var itmCount = 0;
                if (!(thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                    thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
                    return;
                var setControls = function (ed) {
                    thatForm.frm.objs["qry1.ord_ship"].obj.setEditable(ed);
                }

                setControls(true);
                qv.updateDataToTable();
                for (var i = 0; i < ld.rows.length; i++)
                    if (Util.nvl(ld.getFieldValue(i, "DESCR"), "").trim() != "")
                        itmCount++;

                if (itmCount > 0) {
                    setControls(false);
                }
            }
        },
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
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.empname"].obj);
                        var saleinv = Util.getSQLValue("select saleinv from order1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("JO is POSTED ,INV # " + invno);
                        }
                        thatForm.queryCommands();
                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("DESCR").beforeSearchEvent = function (sq, ctx, model) {
                            qry.obj.mLctb.getColByName("DESCR").btnsx = [];
                            if (Util.nvl(thatForm.frm.getFieldValue("qry1.ord_ship"), '') == '')
                                FormView.err("Must select job nature field !");
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
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pord1");
                        var dt = thatForm.view.today_date.getDateValue();


                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();
                        setTimeout(() => {
                            thatForm.queryCommands();
                        });

                    }
                },
                afterEditRow(qry, index, ld) {

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
        getFields1: function () {
            var getJobNature = function () {
                var ordref = "qry1.ord_ship";
                var ordrefnm = "qry1.itemname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    sqlChange: "select descr name from items where  childcounts=0 and reference = ':CODE'",
                    sqlList: "select reference code,descr title from items where childcounts=0 and flag=1 order by descr2",
                    sqlListChange: "select reference code,descr title from items where  childcounts=0 and reference = :CODE",
                    fnAfteUpdate: function () {
                    }
                });
            }
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
                });
            };
            var codSpan = "XL3 L3 M3 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            //15%,10%,10%,15%       15,13,12,12
            //keyid,ordacc          location_code
            //ord_no                ord_date
            //payterm               ord_shpdt
            //ord_ship,itmname      ord_empno
            //ord_ref,ord_refnm     remarks            
            return {
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                ordacc: FormView.getFactoryFields.getComboField(
                    "ordacc", "@", "txtIssueAction",
                    "10%", "", "15%",
                    {
                        list: "@" + UtilGen.PurchaseOrderFunc.initAction.none + "/txtNone," +
                            UtilGen.PurchaseOrderFunc.initAction.approve + "/poApprove",
                        require: true,
                    }, {
                    selectionChange: function (e) {
                        var oc = this.getSelectedKey();
                        var cnt = this;
                        thatForm.queryCommands();
                        if (!Util.isCBValValid(cnt))
                            setTimeout(() => { cnt.focus(); }, 150);

                        // thatForm.helperFunc.setNewPurNo();
                        setTimeout(function () {
                            cnt.$().find("input").attr("readonly", true);
                        }, 250);
                    },
                    change: function (e) {
                        var cnt = this;
                        thatForm.queryCommands();
                        if (!Util.isCBValValid(cnt))
                            setTimeout(() => {
                                cnt.setValue("");
                                cnt.focus();
                                cnt.$().find("input").attr("readonly", true);
                            }, 150);
                    },
                    selectedKey: UtilGen.PurchaseOrderFunc.initAction.none
                }
                ),
                location_code: FormView.getFactoryFields.getComboField(
                    "location_code", "@", "locationTxt",
                    "15%", "", "35%",
                    {
                        list: "select code,name  from locations order by code",
                        require: true,
                        insert_allowed: true,
                        edit_allowed: false
                    }, {
                    selectionChange: function () {
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objno = thatForm.frm.objs["qry1.ord_no"].obj;
                        var newno = Util.getSQLValue("select nvl(max(ord_no),0)+1 from pord1 where ord_code=" + thatForm.vars.vou_code + " and location_code='" + objOn.getSelectedKey() + "'");
                        UtilGen.setControlValue(objno, newno, newno, true);
                    }
                }),
                ord_no: FormView.getFactoryFields.getNumberField(
                    "ord_no", "", "txtNo", "15%", "redText boldText", "35%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                    }
                }),
                ord_date: FormView.getFactoryFields.getDateField(
                    "ord_date", "@", "ordDate", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                payterm: FormView.getFactoryFields.getComboField(
                    "payterm", "", "joSection",
                    "15%", "", "35%",
                    {
                        list: "@digital/Digital,outside/Outside,offset/Offset",
                        require: true
                    }, {

                }),
                ord_shpdt: FormView.getFactoryFields.getDateField(
                    "ord_shpdt", "@", "dueDate", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true
                    }, {}),
                ord_ship: FormView.getFactoryFields.getGeneralField(
                    "ord_ship", "", "joNature", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                    }, getJobNature()),
                itemname: FormView.getFactoryFields.getGeneralField(
                    "itemname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
                ord_empno: FormView.getFactoryFields.getGeneralField(
                    "ord_empno", "@", "txtEmp", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, getSettingSalesp("qry1.ord_empno", "qry1.empname", "S")),
                empname: FormView.getFactoryFields.getGeneralField(
                    "empname", "@", "", "1%", "", "22%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,

                    }, {}),
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
                            var locval = thatForm.frm.objs["qry1.ord_ref"].obj.getValue();
                            thatForm.frm.setFieldValue("qry1.ord_branchno", "", "", true);
                            thatForm.frm.setFieldValue("qry1.ord_empno", "", "", true);
                            if (locval != "") {
                                var s = Util.getSQLValue("select salesp from c_ycust where code='" + locval + "'");
                                thatForm.frm.setFieldValue("qry1.ord_empno", s, s, true);

                                var br = Util.getSQLValue("select min(brno) from cbranch where code='" + locval + "'");
                                thatForm.frm.setFieldValue("qry1.ord_branchno", br, br, true);
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
                ord_branchno: FormView.getFactoryFields.getGeneralField(
                    "ord_branchno", "@", "txtBranch", "15%", "violetText", "12%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,

                    }, FormView.getFactoryFields.getSettingsBr({
                        thatForm: thatForm,
                        ord_discamt: "qry1.ord_branchno",
                        branchname: "qry1.branchname",
                        fnBeforeChange: function () {
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
                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "", "txtRemark", "15%", "", "85%",
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
                    cols: [
                        {
                            colname: "ORD_NO",
                        },
                        {
                            colname: "ORD_REF",
                        },
                        {
                            colname: "ORD_REFNM"
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select ord_no,ord_date,ord_ref,ord_refnm,keyfld from pord1 o1 where ord_code =" + that2.vars.vou_code +
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
                            var podt = UtilGen.JOFunc.checkJOStatus(that2.frm.getFieldValue("keyfld"), false);
                            if (podt == undefined) FormView.err("may not found ,Can't edit !");
                            if (podt.ORD_FLAG == 2)
                                FormView.err("Err !, already opened and approved !");
                            if (podt.ORD_FLAG == 3)
                                FormView.err("Err !, JO is closed !");

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
            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
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



