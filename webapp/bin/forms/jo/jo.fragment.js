sap.ui.jsfragment("bin.forms.jo.jo", {

    //TODO show dashboard with how many active 
    //TODO CLOSEJO to just close in case.

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
                    //TODO mockup sales wizard to show atleast multiple invoices 

                    thatForm.commands.cmdDlv = new sap.m.Button({
                        icon: thatForm.rectangleIcon,
                        wrap: sap.m.FlexWrap.Wrap,
                        text: Util.getLangText("joCmdAddDlv"),
                        press: function () {
                            saveForm(fnExe, "deliveries");
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
                    setCaption(thatForm.commands.cmdProduction, 'joCmdShowProdSteps', 'joCmdProdSteps');
                    setCaption(thatForm.commands.cmdDlv, 'joCmdShowDlv', 'joCmdAddDlv');
                    setCaption(thatForm.commands.cmdSales, 'joCmdShowSales', 'joCmdAddSales');
                    setCaption(thatForm.commands.cmdClose, 'showCloseJo', 'closeJO');

                    var hb1 = new sap.m.HBox({
                        items: [thatForm.commands.cmdApprove, thatForm.commands.cmdDesign, thatForm.commands.cmdDye, thatForm.commands.cmdStock,
                        new sap.m.Text({ width: "10px" }),
                        thatForm.commands.cmdProduction,
                        new sap.m.Text({ width: "20px" }),
                        thatForm.commands.cmdDlv,
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
                        reportFile: "jo",
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
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "empname", "itemname", "branchname", "jo_status"],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA', "empname", "itemname", "branchname", "jo_status"],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "STRA": sett["DEFAULT_STORE"],
                            "ORD_TYPE": 1,
                            "ORD_AMT": ":qry2.totamt",
                            "USERNM": "'" + sett["LOGON_USER"] + "'",
                            "CREATED_TIME": "sysdate",
                            "MODIFIED_TIME": "sysdate",
                        },
                        update_default_values: {
                            "ORD_AMT": ":qry2.totamt",
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
                        dispRecords: { "S": 3, "M": 4, "L": 6, "XL": 7, "XXL": 12 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from pord2 where keyfld=':keyfld';",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'AMOUNT', "DLV_PKQTY"],
                        insert_exclude_fields: ['AMOUNT', "DLV_PKQTY"],
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
                            "ORD_EXP_DATE": "(select exp_dt from items where reference=':qry1.ord_ship')",
                            "ORD_ALLQTY": ":qry2.ord_pkqty ",
                            "ORDEREDQTY": ":qry2.ord_pkqty ",
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
                            var ordrd = 0;
                            var dlv = Util.nvl(thatForm.dlvqty, 0);
                            var sold = Util.nvl(thatForm.soldqty, 0);

                            for (var i = 0; i < ld.rows.length; i++) {
                                sumAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "AMOUNT"), df), 0);
                                ordrd += Util.extractNumber(ld.getFieldValue(i, "PKQTY"));
                            }

                            thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
                            // var rcvdp = 0;

                            // if (ordrd > 0) rcvdp = Math.round((100 / ordrd) * rcvd, 2);

                            // if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined)
                            //     thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("" + rcvdp + " % ");


                            // thatForm.view.byId("numtxt" + thatForm.timeInLong).setText(Util.getLangText("amountTxt") + " : " + df.format(sumAmt));
                            // var totmat = 0;
                            // var totexp = 0;

                            // if (thatForm.qc == undefined) {
                            //     totmat = Util.getSQLValue("select nvl(sum((price/pack)*allqty),0)  from pord_jo_exp where exp_type=1 and keyfld='" + thatForm.frm.getFieldValue("qry1.keyfld") + "'");
                            //     totexp = Util.getSQLValue("select nvl(sum((price)),0) from pord_jo_exp where exp_type=2 and keyfld='" + thatForm.frm.getFieldValue("qry1.keyfld") + "'");
                            // }
                            // thatForm.frm.setFieldValue('qry2.matcost', df.format(totmat));
                            // thatForm.frm.setFieldValue('qry2.otherexp', df.format(totexp));
                            // thatForm.frm.setFieldValue('qry2.totcost', df.format(totmat + totexp));
                            thatForm.helperFunc.calcExpenses();
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

    },
    createViewHeader: function () {
    },
    executeStep: function (para) {
        var thatForm = this;
        var commands = {
            "approve": thatForm.commands.cmdApprove,
            "design": thatForm.commands.cmdDesign,
            "dye": thatForm.commands.cmdDye,
            "production": thatForm.commands.cmdProduction,
            "deliveries": thatForm.commands.cmdDlv,
            "sales": thatForm.commands.cmdSales,
            "closeJO": thatForm.commands.cmdClose,
        };
        var sett = sap.ui.getCore().getModel("settings").getData();
        if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW ||
            thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT)
            FormView.err("Form must be in VIEW mode !");

        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
        var kf = thatForm.frm.getFieldValue("qry1.keyfld");

        // approve function seperatly from steps
        var do_approve = function () {

            var checkCanApprove = function () {
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnts from PORD_JO_EXP where exp_type=1 and keyfld=" + kf + "");
                if (cnt <= 0) {
                    thatForm.showMaterials();
                    FormView.err("Can't approve , must have any expenses in material estimation !");
                }
                var podt = UtilGen.JOFunc.checkJOStatus(kf, false);
                if (podt.ORD_FLAG != 1)
                    FormView.err("Either approved or closed !");
            };
            var update_rec = function () {
                var sq = "update pord1 set ord_flag=2,APPROVED_BY=':approved_by'," +
                    ":st approved_time=sysdate where keyfld=" + kf;
                var pt = Util.getSQLValue("select payterm from pord1 where keyfld=" + kf);
                if (pt == "outside" || pt == "digial" || pt == "plotter")
                    sq = sq.replaceAll(":st", "jo_dye_user=':approved_by' , ");
                else
                    sq = sq.replaceAll(":st", "");

                sq = sq.replaceAll(":approved_by", sett["LOGON_USER"]);
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    FormView.msgSuccess("Approved done !");
                    thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                }

            }
            checkCanApprove();
            var cc = thatForm.frm.getFieldValue("qry1.ord_ref");
            var bl = Util.getSQLValue("select nvl(sum(debit-credit),0) from acvoucher2 where cust_code='" + cc + "'");
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            Util.simpleConfirmDialog("BALANCE = " + df.format(bl) + ", \n\nAre you sure you want to approve this JO  ? ", function (oAction) {
                update_rec();
            });
        }
        var showCloseJo = function () {
            var podt = UtilGen.JOFunc.checkJOStatus(kf, false);
            var txtStepType = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "50%", editable: false });
            var txtStepTime = new sap.m.DateTimePicker({
                textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: podt.ORD_FLAG == 2,
                change: function (e) {

                }

            });
            var txtEmpNo = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "20%",
                editable: podt.ORD_FLAG == 2,
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
            var txtRemarks = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: podt.ORD_FLAG == 2 });

            txtStepTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            var vb = new sap.m.VBox();

            var dovalidate = function () {
                var podt = UtilGen.JOFunc.checkJOStatus(kf, false);
                if (podt.ORD_FLAG != 2) FormView.err("Either JO is approved or closed !");

                var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=9 and pord1_keyfld=" + kf);
                var sold = Util.getSQLValue("select nvl(sum(allqty),0) from pur2 where invoice_code=21 and po_keyfld=" + kf);
                if (sold < rcvd) FormView.err("can't close JO , Delivered qty have not sold all !");

                if (txtEmpNo.getValue() != "") {
                    var emp = Util.getSQLValue("select max(no) from salesp where no='" + txtEmpNo.getValue() + "'");
                    if (Util.nvl(emp, '') == '') FormView.err("Employee not valid !");
                }
                var dt = thatForm.frm.getFieldValue("qry1.ord_date");
                dt.setHours(0, 0, 0, 0);
                if (Util.nvl(txtStepTime.getDateValue(), null) == null)
                    FormView.err("Cant close without date time !");

                if (Util.nvl(txtStepTime.getDateValue(), null) != null &&
                    dt.getTime() >= txtStepTime.getDateValue().getTime())
                    FormView.err("Err ! Step date is more than JO date !");

                if (Util.nvl(txtEmpNo.getValue(), '') == '')
                    FormView.err("Err ! EWmployee is  mandatory  !");
                var cnts = Util.getSQLValue("select nvl(count(*),0) from salesp where no=" + txtEmpNo.getValue());
                if (cnts == 0)
                    FormView.err("Employee no is not valid !");
                // check for production steps completed.
                var sqd = Util.getSQLValue("select  nvl(count(*),0) from PORD_JO_STEPS " +
                    " where step_end is null and pord_keyfld=" + kf);
                if (sqd > 0) {
                    thatForm.do_step_production();
                    FormView.err("Productoin steps are still pending..");
                }
            }
            var doSave = function () {
                dovalidate();
                var dt = thatForm.frm.getFieldValue("qry1.ord_date");
                var usr = sett["LOGON_USER"];
                var sq = "update pord1 set ord_flag=3, closed_by=':user' ,  " +
                    " closed_date=:regtime , closed_empno=':empno' ," +
                    "closed_remarks=':remarks', " +
                    "JO_DESIGN_USER =nvl(JO_DESIGN_USER,':user'), " +
                    "JO_DYE_USER =nvl(JO_DYE_USER,':user'), " +
                    "JO_STOCK_USER =nvl(JO_STOCK_USER,':user'), " +
                    "JO_PROD_USER =nvl(JO_PROD_USER,':user') " +
                    " where keyfld=" + kf;
                var tme = Util.nvl(txtStepTime.getDateValue(), null) != null ? Util.toOraDateTimeString(txtStepTime.getDateValue()) : "null";
                sq = sq.replaceAll(":user", usr)
                    .replaceAll(":regtime", tme)
                    .replaceAll(":empno", txtEmpNo.getValue())
                    .replaceAll(":remarks", txtRemarks.getValue());

                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    FormView.msgSuccess("This JO is closed now ! !");
                }
            };

            var fe = [
                Util.getLabelTxt("Step Type", "30%", "", "redText"), txtStepType,
                Util.getLabelTxt("Received Time", "30%", ""), txtStepTime,
                Util.getLabelTxt("Emp NO", "30%", ""), txtEmpNo,
                Util.getLabelTxt("", "0px", "@"), txtEmpName,
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
                        enabled: podt.ORD_FLAG == 2,
                        press: function () {
                            dovalidate();
                            Util.simpleConfirmDialog(Util.getLangText("Are you sure to CLOSE this JO , # " + podt.ORD_NO + " ? "), function (oAction) {
                                doSave();
                                dlg.close();
                                thatForm.queryCommands();
                            });

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
            txtStepTime.setDateValue(null);
            txtRemarks.setValue("");
            txtEmpNo.setValue("");
            txtEmpName.setValue("");
            var sqj = ("select ord_flag,ordacc,closed_by JO_STEP_USER, " +
                "closed_empno JO_STEP_EMP,CLOSEd_REMARKS JO_STEP_REMARKS," +
                "to_char(closed_date,'mm/dd/rrrr hh24.mi' ) JO_STEP_TIME, " +
                " (select max(name) from salesp where no=closed_empno) JO_STEP_EMPNAME " +
                "from pord1 where keyfld="
                + thatForm.frm.getFieldValue("keyfld"));
            var dt = Util.execSQLWithData(sqj);
            if (dt.length > 0 && dt[0].USER != "") {
                var tme = Util.nvl(dt[0].JO_STEP_TIME, undefined) == undefined ? null : new Date(dt[0].JO_STEP_TIME.replaceAll(".", ":"));
                txtStepTime.setDateValue(tme);
                txtRemarks.setValue(dt[0].JO_STEP_REMARKS);
                txtEmpNo.setValue(dt[0].JO_STEP_EMP);
                txtEmpName.setValue(dt[0].JO_STEP_EMPNAME);
            }


        }
        var do_basic_steps = function () {
            var txtStepType = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "50%", editable: false });
            var txtStepTimeSend = new sap.m.DateTimePicker({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: commands[para].showRecs ? false : true });
            var txtStepTime = new sap.m.DateTimePicker({
                textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: commands[para].showRecs ? false : true,
                change: function (e) {
                    if (Util.nvl(txtStepTime.getDateValue(), null) != null &&
                        Util.nvl(txtStepTimeSend.getDateValue(), null) == null)
                        txtStepTimeSend.setDateValue(new Date(txtStepTime.getDateValue().getTime()))
                }

            });
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
            var txtAttach = new sap.m.Input(
                {
                    textAlign: sap.ui.core.TextAlign.Begin,
                    width: "50%", editable: commands[para].showRecs ? false : true,
                    showValueHelp: true,
                    valueHelpRequest: function (e) {
                        UtilGen.Vouchers.attachShowUpload(thatForm);
                    }

                });

            var txtRemarks = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: commands[para].showRecs ? false : true });
            var btAttach = new sap.m.Button({
                text: "Show Attachment",
                press: function () {
                    UtilGen.Vouchers.attachShowUpload(thatForm, false);
                }
            })
            var btDye = new sap.m.ToggleButton({
                pressed: true,
                text: "DYE",
                width: "100px",
                press: function () {
                    btDye.setPressed(true);
                    btPlate.setPressed(false);
                    para = "dye";
                    fetchdata();
                }
            });
            var btPlate = new sap.m.ToggleButton({
                pressed: false,
                width: "100px",
                text: "PLATE",
                press: function () {
                    btDye.setPressed(false);
                    btPlate.setPressed(true);
                    para = "plate";
                    fetchdata();
                }
            });
            var hb = new sap.m.HBox({
                items: [new sap.m.Text({ width: "20px" }),
                    btDye, btPlate]
            });
            var autTm = new sap.m.Button(
                {
                    text: "Get Times",
                    enabled: commands[para].showRecs ? false : true,
                    press: function () {
                        if (commands[(para == "plate" ? "dye" : para)].showRecs)
                            return;
                        var nowtim = Date.now();
                        txtStepTime.setDateValue(new Date(nowtim));
                        txtStepTimeSend.setDateValue(new Date(nowtim - (1000 * 120)));
                    }
                }
            )

            var vb = new sap.m.VBox();
            var doSave = function () {
                var podt = UtilGen.JOFunc.checkJOStatus(kf, false);
                if (podt.ORD_FLAG != 2) FormView.err("Either JO is approved or closed !");

                if (txtEmpNo.getValue() != "") {
                    var emp = Util.getSQLValue("select max(no) from salesp where no='" + txtEmpNo.getValue() + "'");
                    if (Util.nvl(emp, '') == '') FormView.err("Employee not valid !");
                }
                var dt = thatForm.frm.getFieldValue("qry1.ord_date");
                dt.setHours(0, 0, 0, 0);
                if (Util.nvl(txtStepTime.getDateValue(), null) != null &&
                    dt.getTime() > txtStepTime.getDateValue().getTime())
                    FormView.err("Err ! Step date is more than JO date !");

                if (Util.nvl(txtStepTime.getDateValue(), null) != null &&
                    Util.nvl(txtStepTimeSend.getDateValue(), null) == null)
                    FormView.err("Err ! Step date start cant be null !");

                if (Util.nvl(txtStepTime.getDateValue(), null) != null &&
                    Util.nvl(txtStepTimeSend.getDateValue(), null) != null &&
                    txtStepTime.getDateValue().getTime() <= txtStepTimeSend.getDateValue().getTime())
                    FormView.err("Err ! Start date is not valid !");

                var usr = Util.nvl(txtStepTime.getDateValue(), null) != null ? sett["LOGON_USER"] : "";
                var dyeuser = (para == "plate" ? "jo_dye_user=':user' ," :
                    (para == "dye" ? "jo_plate_user=':user' , " : ""));
                var sq = "update pord1 set jo_:step_user=':user' , " + dyeuser +
                    "jo_:step_time_send=:regtime_send , jo_:step_time=:regtime , jo_:step_emp=':empno' ," +
                    "jo_:step_remarks=':remarks' where keyfld=" + kf;

                var sendtime = Util.nvl(txtStepTimeSend.getDateValue(), null) != null ? Util.toOraDateTimeString(txtStepTimeSend.getDateValue()) : "null";
                var tme = Util.nvl(txtStepTime.getDateValue(), null) != null ? Util.toOraDateTimeString(txtStepTime.getDateValue()) : "null";
                sq = sq.replaceAll(":step", para)
                    .replaceAll(":user", usr)
                    .replaceAll(":regtime_send", sendtime)
                    .replaceAll(":regtime", tme)
                    .replaceAll(":empno", txtEmpNo.getValue())
                    .replaceAll(":remarks", txtRemarks.getValue());
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    var tx = txtAttach.getValue();
                    Util.doXhrUpdateVouAttach("uploadAttachPdfVou", true, thatForm.fileUpload, thatForm.frm.getFieldValue("qry1.keyfld"), tx, "JO_" + para);
                    FormView.msgSuccess("This step is updated  !");
                    thatForm.startActive();
                }
            }

            txtStepTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTimeSend.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTimeSend.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");

            var fe = [
                ((para == "plate" || para == "dye") ? hb : Util.getLabelTxt("", "0px", "", "")),
                Util.getLabelTxt("", "0px", "", ""),
                autTm,
                Util.getLabelTxt("Step Type", "30%", "", "redText"), txtStepType,
                Util.getLabelTxt("Sent/Start", "30%", ""), txtStepTimeSend,
                Util.getLabelTxt("Received Time", "30%", ""), txtStepTime,
                Util.getLabelTxt("Emp NO", "30%", ""), txtEmpNo,
                Util.getLabelTxt("", "0px", "@"), txtEmpName,
                Util.getLabelTxt("Attachment", "30%", ""), txtAttach,
                Util.getLabelTxt("Remarks", "30%", ""), txtRemarks,
                Util.getLabelTxt("", "30%", ""), btAttach,
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
                contentHeight: "300px",
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
            var fetchdata = function () {
                txtStepType.setValue(para);
                txtStepTime.setDateValue(null);
                txtStepTimeSend.setDateValue(new Date());
                txtRemarks.setValue("");
                txtEmpNo.setValue("");
                txtEmpName.setValue("");
                var sqj = ("select ord_flag,ordacc,JO_:STEP_USER JO_STEP_USER, " +
                    "JO_:STEP_EMP JO_STEP_EMP,JO_:STEP_REMARKS JO_STEP_REMARKS," +
                    "to_char(JO_:STEP_TIME,'mm/dd/rrrr hh24.mi' ) JO_STEP_TIME, " +
                    "to_char(JO_:STEP_TIME_SEND,'mm/dd/rrrr hh24.mi' ) JO_STEP_TIME_SEND, " +
                    " (select max(name) from salesp where no=jo_:STEP_emp) JO_STEP_EMPNAME " +
                    "from pord1 where keyfld="
                    + thatForm.frm.getFieldValue("keyfld"))
                    .replaceAll(":STEP", para);
                var dt = Util.execSQLWithData(sqj);
                if (dt.length > 0 && dt[0].USER != "") {
                    var sendtme = Util.nvl(dt[0].JO_STEP_TIME_SEND, undefined) == undefined ? null : new Date(dt[0].JO_STEP_TIME_SEND.replaceAll(".", ":"));
                    var tme = Util.nvl(dt[0].JO_STEP_TIME, undefined) == undefined ? null : new Date(dt[0].JO_STEP_TIME.replaceAll(".", ":"));
                    txtStepTimeSend.setDateValue(sendtme);
                    txtStepTime.setDateValue(tme);
                    txtRemarks.setValue(dt[0].JO_STEP_REMARKS);
                    txtEmpNo.setValue(dt[0].JO_STEP_EMP);
                    txtEmpName.setValue(dt[0].JO_STEP_EMPNAME);
                }
                UtilGen.Vouchers.attachLoadQry(thatForm, txtAttach, "JO_" + para, thatForm.frm.getFieldValue("qry1.keyfld"));
            }
            fetchdata();
        }
        var fncallback = function () {
            thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
        }

        var addDlv = function () {
            var formtype = "dialog";
            if (!Util.nvl(thatForm.commands.cmdDlv.showRecs, false))
                UtilGen.execCmd('bin.forms.jo.jodlv status=new formType=' + formtype + ' soKf=' + kf + ' formTitle=SO_DELIVERY', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);
            else {
                var sq = "select ord_no,to_char(ord_date,'dd/mm/rrrr') ord_date,keyfld from order1 where ord_code=9 and pord1_keyfld=" + kf + " order by ord_no";
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_DATE"], function (data) {
                        var bn = data.KEYFLD;
                        UtilGen.execCmd('bin.forms.jo.jodlv status=new formType=' + formtype + ' keyfld=' + bn + ' formTitle=JO_DELIVERY', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);
                    }, { pWidth: "400px" }, undefined, undefined, "select delivery ... ", [
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            hide: true
                        }
                    },
                ]);
            }

        }

        var addSales = function () {
            var selPokf = thatForm.frm.getFieldValue("qry1.keyfld");
            if (!thatForm.commands.cmdSales.showRecs && !thatForm.commands.cmdSales.dataUpdated)
                UtilGen.execCmd('bin.forms.jo.jowzd formType=dialog formSize=905px,500px soKeyFld=' + selPokf + ' formTitle=Sales_Wizard', UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, fncallback);

        }
        // do step dye, design, stock but not production and add sales, closejo

        switch (para) {
            case "approve":
                do_approve();
                break;
            case "design":
            case "dye":
                do_basic_steps();
                break;
            case "stock":
                thatForm.do_stock_step();
                break;
            case "deliveries":
                addDlv();
                break;
            case "sales":
                addSales();
                break;
            case "production":
                thatForm.do_step_production();
                break;
            case "closeJO":
                showCloseJo();
                break;
            default:
                break;
        }
    },
    checkStepSecurity: function () {
        var thatForm = this;
        var varias = {
            "approve": thatForm.commands.cmdApprove,
            "design": thatForm.commands.cmdDesign,
            "dye": thatForm.commands.cmdDye,
            "production": thatForm.commands.cmdProduction,
            "stock": thatForm.commands.cmdStock,
            "deliveries": thatForm.commands.cmdDlv,
            "sales": thatForm.commands.cmdSales,
            "closeJO": thatForm.commands.cmdClose
        }
        var objs = Object.keys(varias);
        for (var o in objs) {
            var fls = UtilGen.Security.getParaSec("formsec_jo__step_" + objs[o], false, true);
            if (!fls &&
                !varias[objs[o]].showRecs
            ) varias[objs[o]].setEnabled(false);
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
        showUpdate(undefined, false); // show add icon
        thatForm.refreshIcons();
        thatForm.enableCommands(undefined, false);
        thatForm.frm.setFieldValue("qry1.jo_status", "Not-Active");
        if (!isFormInView) return;
        var sqj = "select ord_flag,ordacc,JO_DESIGN_USER, JO_DYE_USER,JO_STOCK_USER,JO_PROD_USER," +
            "to_char(JO_ACTIVE_FROM,'dd/mm/rrrr hh24.mi' ) active_date,ORDERDQTY,DELIVEREDQTY,PURQTY from pord1 where keyfld="
            + thatForm.frm.getFieldValue("keyfld");
        var dt = Util.execSQLWithData(sqj);
        var approve = 1;

        if (dt.length > 0) {
            approve = Util.nvl(dt[0].ORD_FLAG, 1);
            ordacc = Util.nvl(dt[0].ORDACC, thatForm.frm.getFieldValue("qry1.ordacc"));

            if (Util.nvl(dt[0].ACTIVE_DATE, undefined) != undefined)
                thatForm.frm.setFieldValue("qry1.jo_status", "Active");
            else thatForm.frm.setFieldValue("qry1.jo_status", "Not-Active");
            if (Util.nvl(dt[0].ORD_FLAG, 1) == 3)
                thatForm.frm.setFieldValue("qry1.jo_status", "Closed");
            if (Util.nvl(dt[0].ORD_FLAG, 1) == 1)
                thatForm.frm.setFieldValue("qry1.jo_status", "Pending");

            if (Util.nvl(dt[0].JO_DESIGN_USER, "") != "") thatForm.commands.cmdDesign.dataUpdated = true;
            if (Util.nvl(dt[0].JO_DYE_USER, "") != "") thatForm.commands.cmdDye.dataUpdated = true;
            if (Util.nvl(dt[0].JO_STOCK_USER, "") != "") thatForm.commands.cmdStock.dataUpdated = true;
            if (Util.nvl(dt[0].JO_PROD_USER, "") != "") thatForm.commands.cmdProduction.dataUpdated = true;
            if (Util.nvl(dt[0].ORD_FLAG, 1) == 3) {
                thatForm.commands.cmdClose.dataUpdated = true;
                thatForm.commands.cmdDlv.dataUpdated = true;
                thatForm.commands.cmdSales.dataUpdated = true;
            }


            if (Util.nvl(dt[0].ORDERDQTY, 0) == Util.nvl(dt[0].DELIVEREDQTY, 0))
                thatForm.commands.cmdDlv.dataUpdated = true;

            if (Util.nvl(dt[0].ORDERDQTY, 0) == Util.nvl(dt[0].PURQTY, 0))
                thatForm.commands.cmdSales.dataUpdated = true;
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
                    thatForm.commands.cmdDlv,
                    thatForm.commands.cmdSales,
                ], false);
            } else if (approve == 2 && (Util.nvl(dt[0].ACTIVE_DATE, '') == '')) {
                thatForm.enableCommands([
                    thatForm.commands.cmdDesign,
                    thatForm.commands.cmdDye,
                    thatForm.commands.cmdStock,
                    thatForm.commands.cmdClose
                ], true);
                thatForm.enableCommands([
                    thatForm.commands.cmdProduction,
                    thatForm.commands.cmdDlv,
                    thatForm.commands.cmdSales,
                ], false);
                showUpdate(undefined, false);
            } else if (approve == 1) {
                thatForm.enableCommands(undefined, false);
                thatForm.enableCommands(thatForm.commands.cmdApprove, true);
            } else if (approve == 3) {
                thatForm.enableCommands(undefined, true);
                showUpdate(undefined, true);

                // thatForm.enableCommands(cmdClose, false);
            }
        }
        thatForm.refreshIcons();
        thatForm.checkStepSecurity();
    },
    do_stock_step: function () {
        var thatForm = this;
        var para = "stock";
        var sett = sap.ui.getCore().getModel("settings").getData();
        Util.destroyID("itms" + thatForm.timeInLong);
        var qv = new QueryView("itms" + thatForm.timeInLong);
        qv.getControl().setEditable(false);
        qv.getControl().view = thatForm.view;
        qv.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qv.getControl().setFixedBottomRowCount(0);
        qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qv.getControl().setVisibleRowCount(7);
        qv.getControl().setRowHeight(18);
        UtilGen.createDefaultToolbar1(qv, ["REFER", "DESCR"], true);
        var cc = "";

        if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW)
            FormView.err("Must be VIEW  mode !");
        cc = thatForm.frm.getFieldValue("qry1.keyfld");
        var vb = new sap.m.VBox();
        var txtStepTime;
        var txtEmpNo;
        var txtEmpName;
        var txtRemarks;

        var showFrm = function () {
            var enbled = cmdSave.getEnabled();
            txtStepTime = new sap.m.DateTimePicker({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: enbled });
            txtEmpNo = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "20%",
                editable: enbled,
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
            txtEmpName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
            txtRemarks = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: enbled });

            txtStepTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStepTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");

            var fe = [
                Util.getLabelTxt("Time", "30%", ""), txtStepTime,
                Util.getLabelTxt("Emp NO", "30%", ""), txtEmpNo,
                Util.getLabelTxt("", "0px", "@"), txtEmpName,
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
        };
        var fetchDataFrm = function () {
            //fetching for stock data.
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
            if (dt.length > 0 && Util.nvl(dt[0].JO_STEP_USER, '') != "") {
                txtStepTime.setDateValue(new Date(dt[0].JO_STEP_TIME.replaceAll(".", ":")));
                txtRemarks.setValue(dt[0].JO_STEP_REMARKS);
                txtEmpNo.setValue(dt[0].JO_STEP_EMP);
                txtEmpName.setValue(dt[0].JO_STEP_EMPNAME);
            }

        }
        var fetchData = function () {

            var sqf = thatForm.frm.parseString("select p.item_pos,p.refer,i.descr,p.packd," +
                "p.unitd,p.pack,pkqty,(C7_GET_STORE_ITEM_ALLQTY(p.refer) - (c7_getJoQty(refer,':qry1.keyfld')))/p.pack qih ," +
                " (c7_getJoQty(refer,':qry1.keyfld')/p.pack) APPROVED_ORDER,p.allqty,i.itprice4 " +
                " from pord_jo_exp p,items i where i.reference=p.refer " +
                "and p.keyfld=':qry1.keyfld' and p.exp_type=1 order by p.item_pos");
            var dt = Util.execSQL(sqf);
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 80;


                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_POS")].mColClass = "sap.m.Input";

                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_POS")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 130;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 220;
                qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("UNITD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PACK")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("QIH")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_style = "font-size:14;"
                qv.mLctb.cols[qv.mLctb.getColPos("QIH")].getMUIHelper().display_style = "font-size:14px;"
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_format = "QTY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("QIH")].getMUIHelper().display_format = "QTY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("APPROVED_ORDER")].getMUIHelper().display_format = "QTY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("APPROVED_ORDER")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("ALLQTY")].mHideCol = true;
                qv.mLctb.cols[qv.mLctb.getColPos("ITPRICE4")].getMUIHelper().display_width = 0;

                qv.onRowRender = function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                    var oModel = this.getControl().getModel();
                    var qih = Util.extractNumber(oModel.getProperty("QIH", currentRowContext));
                    var pkqty = Util.extractNumber(oModel.getProperty("PKQTY", currentRowContext));
                    var ip = Util.extractNumber(oModel.getProperty("ITPRICE4", currentRowContext));
                    if (pkqty > qih)
                        for (var i = startCell; i < endCell; i++) {
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", "red");
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", "red");
                        }

                }

                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();
                var ld = qv.mLctb;
                for (var i = 0; i < ld.rows.length; i++) {
                    var ip = ld.getFieldValue(i, "ITPRICE4");
                    if (ip > 0) {
                        ld.setFieldValue(i, "QIH", (ld.getFieldValue(i, "ALLQTY") / ld.getFieldValue(i, "PACK")));
                        ld.setFieldValue(i, "APPROVED_ORDER", 0);
                    }
                }
                qv.updateDataToControl();

                setTimeout(() => {
                    var ld = qv.mLctb;
                    var saq = 0;
                    var sqih = 0;
                    for (var i = 0; i < ld.rows.length; i++) {
                        saq += Util.extractNumber(ld.getFieldValue(i, "ALLQTY"));
                        sqih += Util.extractNumber(ld.getFieldValue(i, "QIH") * ld.getFieldValue(i, "PACK"));
                    }
                    cmdSave.setEnabled(false);
                    var shw = thatForm.commands["cmdStock"].showRecs;
                    if (!shw)
                        cmdSave.setEnabled(true);
                    showFrm();
                    fetchDataFrm();
                });

            }

        }
        var doSave = function () {
            if (txtEmpNo.getValue() != "") {
                var emp = Util.getSQLValue("select max(no) from salesp where no='" + txtEmpNo.getValue() + "'");
                if (Util.nvl(emp, '') == '') FormView.err("Employee not valid !");
            }
            var dt = thatForm.frm.getFieldValue("qry1.ord_date");
            dt.setHours(0, 0, 0, 0);
            var kf = thatForm.frm.getFieldValue("qry1.keyfld");

            if (dt.getTime() > txtStepTime.getDateValue().getTime())
                FormView.err("Err ! Step date is more than JO date !");
            var sq1 = "declare cursor im is select refer,get_item_cost(refer) cst from pord_jo_exp where keyfld=:keyfld and exp_type=1 order by item_pos;  " +
                " begin for x in im loop " +
                "   update pord_jo_exp set price=x.cst*pack " +
                "   where keyfld=:keyfld and exp_type=1 and refer=x.refer;" +
                " end loop;"
            var sq = sq1 + "update pord1 set jo_:step_user=':user' , " +
                "jo_:step_time=:regtime , jo_:step_emp=':empno' ," +
                "jo_:step_remarks=':remarks' where keyfld=:keyfld ; end ;";

            sq = sq.replaceAll(":step", 'stock')
                .replaceAll(":user", sett["LOGON_USER"])
                .replaceAll(":regtime", Util.toOraDateTimeString(txtStepTime.getDateValue()))
                .replaceAll(":empno", txtEmpNo.getValue())
                .replaceAll(":keyfld", kf)
                .replaceAll(":remarks", txtRemarks.getValue());
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess("This step is updated  !");
                thatForm.startActive();
                thatForm.helperFunc.calcExpenses();
            }
        }

        var pg = new sap.m.Page({
            showHeader: false,
            content: [],
            showFooter: true
        }).addStyleClass("sapUiSizeCompact");

        var cmdClose = new sap.m.Button({
            text: Util.getLangText("cmdClose"),
            icon: "sap-icon://decline",
            pressed: false,
            press: function () {
                dlg.close();
            }

        });

        var cmdSave = new sap.m.Button({
            text: Util.getLangText("cmdDone"),
            icon: "sap-icon://accept",
            pressed: false,
            press: function () {
                doSave();
                dlg.close();
                thatForm.queryCommands();
            }
        });


        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.addContent(qv.showToolbar.toolbar);

        pg.addContent(qv.getControl());
        pg.addContent(new sap.m.VBox({ height: "20px" }));
        pg.addContent(vb);
        tbHeader.addContent(cmdSave);
        tbHeader.addContent(cmdClose);
        var tit = Util.getLangText("JO");
        if (cc != "")
            tit = "Job order # " + thatForm.frm.getFieldValue("qry1.ord_no");

        var dlg = new sap.m.Dialog({
            title: tit,
            content: pg,
            contentWidth: "80%",
            contentHeight: "400px",

        });
        fetchData();
        dlg.open();
    },
    do_step_production: function () {
        var thatForm = this;
        var para = "production";
        var isProdClosed = function () {
            // var upd = Util.getSQLValue("select jo_prod_user from pord1 where keyfld=" + thatForm.frm.getFieldValue("qry1.keyfld"));
            // if (Util.nvl(upd, '') != '') return true;
            var upd = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + thatForm.frm.getFieldValue("qry1.keyfld"));
            if (Util.nvl(upd, 0) != 2) return true;

            return false;

        }
        var getStepsNotDone = function () {
            var cnt = Util.extractNumber(Util.getSQLValue("select nvl(count(*),0) from pord_jo_steps where step_end is null and pord_keyfld=" + thatForm.frm.getFieldValue("qry1.keyfld")));
            return cnt;
        };

        var delRec = function (idx) {
            if (isProdClosed()) FormView("Err ! , production steps are closed !");
            if (Util.nvl(idx, -1) < 0 || idx == undefined) return;
            var sp = qv.mLctb.getFieldValue(idx, "STEP_POS");
            var spc = qv.mLctb.getFieldValue(idx, "STEP_CODE") + " - " + qv.mLctb.getFieldValue(idx, "DESCR");
            Util.simpleConfirmDialog(Util.getLangText("Are you sure to DELETE , # " + sp + " , " + spc + " ? "), function (oAction) {
                var dt = Util.execSQL("delete from pord_jo_steps where pord_keyfld=" +
                    thatForm.frm.getFieldValue("keyfld") + " and step_pos= " + sp);
                if (dt.ret == "SUCCESS")
                    FormView.msgCustom(Util.getLangText("msgDeleted"), "maroon");
                fetchData();
            });

        }
        var sett = sap.ui.getCore().getModel("settings").getData();
        Util.destroyID("itms" + thatForm.timeInLong);
        var qv = new QueryView("itms" + thatForm.timeInLong);
        qv.getControl().setEditable(false);
        qv.getControl().view = thatForm.view;
        qv.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qv.getControl().setFixedBottomRowCount(0);
        qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qv.getControl().setVisibleRowCount(7);
        qv.getControl().setRowHeight(18);

        var isClose = isProdClosed();
        UtilGen.createDefaultToolbar1(qv, ["REFER", "DESCR"], true,
            (idx) => {
                //funciton to pOnDel.
                if (Util.nvl(idx, undefined) == undefined) return;
                // var sp = qv.mLctb.getFieldValue(idx, "STEP_POS");
                delRec(idx);
            },
            (idx) => {
                //funciton to pOnAdd
                thatForm.showProdStep(-1, undefined, function () { fetchData(); });
            }, !isClose, !isClose, undefined, true, // showdel and showAdd command,fnAddCmds shownewwindow
            (idx) => {
                //funciton to pOnEdit
                if (Util.nvl(idx, undefined) == undefined) return;
                var sp = qv.mLctb.getFieldValue(idx, "STEP_POS");
                thatForm.showProdStep(sp, undefined, function () { fetchData(); });
            }, !isClose // showEdit        
        );
        var cc = "";

        if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW)
            FormView.err("Must be VIEW  mode !");
        cc = thatForm.frm.getFieldValue("qry1.keyfld");
        var vb = new sap.m.VBox();

        var fetchData = function () {
            var fnEdit = function (obj) {
                // if (isProdClosed()) FormView.err("cant edit !");
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var sp = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "STEP_POS")].getText());
                thatForm.showProdStep(sp, undefined, function () { fetchData(); });
            }
            var sqf = thatForm.frm.parseString("select s.step_pos,s.step_code,si.descr," +
                "s.step_emp,sls.name step_empname,s.estimated_hour, item_descr,qty," +
                "to_char(s.step_start,'dd/mm/rrrr HH24.mi') step_start ," +
                "to_char(s.step_end,'dd/mm/rrrr HH24.mi') step_end," +
                "step_remarks " +

                " from PORD_JO_STEPS s,salesp sls,pord_jo_steps_info si where s.step_code=si.code " +
                " and s.step_emp=sls.no(+) " +
                " and s.pord_keyfld=':qry1.keyfld' order by s.step_pos");

            var dt = Util.execSQL(sqf);
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_POS")].getMUIHelper().display_width = 70;
                // qv.mLctb.cols[qv.mLctb.getColPos("STEP_POS")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_CODE")].getMUIHelper().display_width = 70;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_CODE")].commandLinkClick = fnEdit;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_POS")].commandLinkClick = fnEdit;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 250;
                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_DESCR")].getMUIHelper().display_width = 250;
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].getMUIHelper().display_width = 60;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_EMP")].getMUIHelper().display_width = 60;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_EMPNAME")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_START")].getMUIHelper().display_width = 150;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_END")].getMUIHelper().display_width = 150;
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_REMARKS")].getMUIHelper().display_width = 100;

                qv.mLctb.cols[qv.mLctb.getColPos("STEP_POS")].mTitle = Util.getLangText("Sr");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_CODE")].mTitle = Util.getLangText("txtCode");
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].mTitle = Util.getLangText("descrTxt");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_EMP")].mTitle = Util.getLangText("txtNo");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_START")].mTitle = Util.getLangText("puShipstartfrom");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_END")].mTitle = Util.getLangText("puShipendto");
                qv.mLctb.cols[qv.mLctb.getColPos("STEP_REMARKS")].mTitle = Util.getLangText("txtRemark");
                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_DESCR")].mTitle = Util.getLangText("Item");
                qv.mLctb.cols[qv.mLctb.getColPos("QTY")].mTitle = Util.getLangText("txtQty");




                qv.mLctb.parse("{" + dt.data + "}", true);
                qv.loadData();

                setTimeout(() => {
                    if (isProdClosed() || getStepsNotDone() > 0) cmdSave.setEnabled(false); else cmdSave.setEnabled(true);
                    if (isProdClosed()) cmdUnDone.setEnabled(false); else cmdUnDone.setEnabled(true);

                });

            }

        }
        var doSave = function () {
            if (isProdClosed() || getStepsNotDone() > 0) FormView.err("Either producton closed or some steps not done in production !");
            // Util.simpleConfirmDialog(Util.getLangText("You can not change later producton steps if done ,Are you sure to proceed ?"), function (oAction) {
            var sqj = thatForm.frm.parseString("update pord1 set jo_prod_user='" + sett["LOGON_USER"] + "' , " +
                "jo_prod_time=(select nvl(max(step_end),sysdate) from pord_jo_steps where pord_keyfld=:qry1.keyfld ) " +
                " where keyfld=:qry1.keyfld ");
            var dt = Util.execSQL(sqj);
            if (dt.ret = "SUCCESS")
                FormView.msgSuccess("Production is done !");
            thatForm.queryCommands();
            // });

        }
        var doUnSave = function () {
            if (isProdClosed()) FormView.err("Check producton may closed ! ");
            // Util.simpleConfirmDialog(Util.getLangText("You can not change later producton steps if done ,Are you sure to proceed ?"), function (oAction) {
            var sqj = thatForm.frm.parseString("update pord1 set jo_prod_user='' , " +
                "jo_prod_time=null " +
                "where keyfld=:qry1.keyfld ");
            var dt = Util.execSQL(sqj);
            if (dt.ret = "SUCCESS")
                FormView.msgSuccess("Production is Un-done !");
            thatForm.queryCommands();
            // });

        }
        var pg = new sap.m.Page({
            showHeader: false,
            content: [],
            showFooter: true
        }).addStyleClass("sapUiSizeCompact");

        var cmdClose = new sap.m.Button({
            text: Util.getLangText("cmdClose"),
            icon: "sap-icon://decline",
            pressed: false,
            press: function () {
                dlg.close();
            }

        });

        var cmdSave = new sap.m.Button({
            text: Util.getLangText("cmdDone"),
            icon: "sap-icon://accept",
            enabled: false,
            press: function () {
                doSave();
                dlg.close();
                thatForm.queryCommands();
            }
        });
        var cmdUnDone = new sap.m.Button({
            text: Util.getLangText("Un Done 📌"),
            // icon: "sap-icon://decline",
            enabled: false,
            press: function () {
                doUnSave();
                dlg.close();
                thatForm.queryCommands();
            }
        });

        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.addContent(qv.showToolbar.toolbar);

        pg.addContent(qv.getControl());
        pg.addContent(new sap.m.VBox({ height: "20px" }));
        pg.addContent(vb);
        tbHeader.addContent(cmdSave);
        tbHeader.addContent(cmdUnDone);
        tbHeader.addContent(cmdClose);

        var tit = Util.getLangText("JO");
        if (cc != "")
            tit = "Job order # " + thatForm.frm.getFieldValue("qry1.ord_no");

        var dlg = new sap.m.Dialog({
            title: tit,
            content: pg,
            contentWidth: "80%",
            contentHeight: "450px",

        });
        fetchData();
        dlg.open();
    },
    showProdStep: function (sp, inpDurationOnly, fnCallBack) {
        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();


        var txtStepPos, txtStepCode, txtStepName,
            txtEmpNo, txtEmpName, txtEstHours, txtItemDescr, txtItemPos, txtQty,
            txtStartTime, txtEndTime, txtRemarks, dlg;

        var vb = new sap.m.VBox();

        var isProdClosed = function () {
            // var upd = Util.getSQLValue("select jo_prod_user from pord1 where keyfld=" + thatForm.frm.getFieldValue("qry1.keyfld"));
            // if (Util.nvl(upd, '') != '') return true;
            var upd = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + thatForm.frm.getFieldValue("qry1.keyfld"));
            if (Util.nvl(upd, 0) != 2) return true;
            return false;
        }
        var doCreate = function () {
            isclose = isProdClosed();
            txtStepCode = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "20%",
                editable: !isclose,
                showValueHelp: true,
                change: function (e) {
                    var sq = "select descr name from pord_jo_steps_info where code = :CODE";
                    UtilGen.Search.getLOVSearchField(sq, this, undefined, txtStepName);
                },
                valueHelpRequest: function (e) {
                    UtilGen.Search.do_quick_search(e, this,
                        "select code,descr title from pord_jo_steps_info where is_parent!='Y' order by path ",
                        "select code,descr title from pord_jo_steps_info where code=:CODE", txtStepName, undefined, undefined, undefined);
                }

            });
            txtStepName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
            txtEmpNo = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "20%",
                editable: !isclose,
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
            txtItemDescr = new sap.m.Input({
                textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: !isclose,
                showValueHelp: true,
                change: function (e) {
                    var sq = thatForm.frm.parseString("select ord_pos from pord2 where keyfld=:qry1.keyfld");
                    UtilGen.Search.getLOVSearchField(sq, this, undefined, txtItemPos);
                },
                valueHelpRequest: function (e) {
                    UtilGen.Search.do_quick_search(e, this,
                        thatForm.frm.parseString("select descr code,ord_pkqty,ord_pos from pord2 where keyfld=:qry1.keyfld order by ord_pos "),
                        thatForm.frm.parseString("select descr title from pord2 where keyfld=:qry1.keyfld and descr=:CODE"), txtItemDescr, function (data) {
                            txtItemDescr.fireChange();
                        }, { pWidth: "600px" });
                }

            });
            txtEmpName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
            txtEstHours = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: !isclose });
            txtQty = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: !isclose });
            txtItemPos = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "15%", editable: false });
            txtStartTime = new sap.m.DateTimePicker({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: !isclose });
            txtEndTime = new sap.m.DateTimePicker({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: !isclose });
            txtRemarks = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: !isclose });

            txtStartTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtStartTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");

            txtEndTime.setValueFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            txtEndTime.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"] + " h:mm a");
            var fe = [
                Util.getLabelTxt("txtCode", "30%", "", "redText"), txtStepCode,
                Util.getLabelTxt("", "0px", "@", "redText"), txtStepName,
                Util.getLabelTxt("txtEmp", "30%", ""), txtEmpNo,
                Util.getLabelTxt("", "0px", "@"), txtEmpName,
                Util.getLabelTxt("Estimated Minutes", "30%", ""), txtEstHours,
                Util.getLabelTxt("Item", "30%", ""), txtItemDescr,
                Util.getLabelTxt("Qty", "30%", ""), txtQty,
                Util.getLabelTxt("Pos", "10%", "@"), txtItemPos,
                Util.getLabelTxt("Start", "30%", ""), txtStartTime,
                Util.getLabelTxt("End", "30%", ""), txtEndTime,
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
            showDialog();
        };
        var showDialog = function () {
            dlg = new sap.m.Dialog({
                title: sp <= -1 ? "New step " : " Edit position : " + sp,
                contentWidth: UtilGen.dispWidthByDevice({ "S": 300, "M": 400, "L": 500, "XL": 500 }) + "px",
                contentHeight: "350px",
                content: [vb],
                modal: true,
                buttons: [
                    new sap.m.Button({
                        text: Util.getLangText("cmdDone"),
                        icon: "sap-icon://accept",
                        pressed: false,
                        enabled: !isclose,
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

        }
        var doLoad = function () {
            txtStepCode.setValue("");
            txtStepName.setValue("");
            txtEmpName.setValue("");
            txtEmpNo.setValue("");
            txtEstHours.setValue("0");
            txtQty.setValue("0");
            txtItemDescr.setValue("");
            txtItemPos.setValue("");
            txtStartTime.setDateValue(new Date());
            txtEndTime.setDateValue(null);
            txtRemarks.setValue("");
            if (Util.nvl(sp, -1) != -1) {
                var sqj = ("select S.STEP_CODE, S.STEP_EMP, S.STEP_REMARKS, S.STEP_DONE, S.ESTIMATED_HOUR, S.STEP_USER, " +
                    "ITEM_DESCR,QTY," +
                    "to_char(STEP_START,'mm/dd/rrrr hh24.mi' ) STEP_START, " +
                    "to_char(STEP_END,'mm/dd/rrrr hh24.mi' ) STEP_END, " +
                    " (select max(name) from salesp where no=STEP_emp) STEP_EMPNAME, " +
                    " (select max(DESCR) from PORD_JO_STEPS_INFO where CODE=STEP_CODE) STEP_DESCR, " +
                    " ITEM_POS " +
                    " from PORD_JO_STEPS S where pord_keyfld= "
                    + thatForm.frm.getFieldValue("keyfld"))
                    + " AND STEP_POS='" + sp + "'";
                var dt = Util.execSQLWithData(sqj);
                if (dt.length > 0 && dt[0].USER != "") {
                    txtStepCode.setValue(dt[0].STEP_CODE);
                    txtStepName.setValue(dt[0].STEP_DESCR);
                    txtEmpName.setValue(dt[0].STEP_EMPNAME);
                    txtEmpNo.setValue(dt[0].STEP_EMP);
                    txtEstHours.setValue(dt[0].ESTIMATED_HOUR);
                    txtQty.setValue(dt[0].QTY);
                    txtItemPos.setValue(dt[0].ITEM_POS);
                    txtItemDescr.setValue(dt[0].ITEM_DESCR);
                    txtStartTime.setDateValue(new Date(dt[0].STEP_START.replaceAll(".", ":")));
                    txtEndTime.setDateValue(new Date(dt[0].STEP_END.replaceAll(".", ":")));
                    txtRemarks.setValue(dt[0].STEP_REMARKS);
                }
            }
        }
        var doSave = function () {
            if (isProdClosed()) FormView.err("Cant save on closed productions !");
            if (txtEmpNo.getValue() != "") {
                var emp = Util.getSQLValue("select max(no) from salesp where no='" + txtEmpNo.getValue() + "'");
                if (Util.nvl(emp, '') == '') FormView.err("Employee not valid !");
            }
            var dt = thatForm.frm.getFieldValue("qry1.ord_date");
            dt.setHours(0, 0, 0, 0);
            if (Util.nvl(txtStartTime.getDateValue(), undefined) != undefined && dt.getTime() > txtStartTime.getDateValue().getTime())
                FormView.err("Err ! Step date is more than JO date !");
            if (Util.nvl(txtEndTime.getDateValue(), undefined) != undefined && dt.getTime() > txtEndTime.getDateValue().getTime())
                FormView.err("Err ! Step date is more than JO date !");
            if (Util.nvl(txtEndTime.getDateValue(), undefined) != undefined &&
                Util.nvl(txtStartTime.getDateValue(), undefined) == undefined)
                FormView.err("if mentioned end time then must have value for start time !");
            if (Util.nvl(txtStartTime.getDateValue(), undefined) != undefined &&
                Util.nvl(txtEndTime.getDateValue(), undefined) != undefined &&
                txtEndTime.getDateValue().getTime() < txtStartTime.getDateValue().getTime())
                FormView.err("Start date or End date is Invalid !");
            if (Util.extractNumber(Util.nvl(txtEstHours.getValue(), "0")) < 0)
                FormView.err("Estimated number is not valid !");
            if (Util.extractNumber(txtQty.getValue()) < 0) FormView.err("Invalid qty !");
            if (txtItemDescr.getValue() != "") {
                var qt = Util.extractNumber(txtQty.getValue());
                var totqty = Util.extractNumber(Util.getSQLValue(thatForm.frm.parseString("select nvl(sum(ORD_PKQTY),0) from pord2 " +
                    "where keyfld=:qry1.keyfld and descr='" + txtItemDescr.getValue() + "'")));
                if (qt > totqty)
                    FormView.err(txtItemDescr.getValue() + " , qty limit is " + totqty);
            }

            var sql = "";
            var colvals = {
                "step_pos": Util.quoted(sp),
                "pord_keyfld": thatForm.frm.getFieldValue("keyfld"),
                "step_code": Util.quoted(txtStepCode.getValue()),
                "step_emp": Util.quoted(txtEmpNo.getValue()),
                "qty": Util.extractNumber(txtQty.getValue()),
                "item_pos": Util.extractNumber(txtItemPos.getValue()),
                "item_descr": Util.quoted(txtItemDescr.getValue()),
                "estimated_hour": Util.quoted(txtEstHours.getValue()),
                "step_start": Util.nvl(txtStartTime.getDateValue(), undefined) ? Util.toOraDateTimeString(txtStartTime.getDateValue()) : "null",
                "step_end": Util.nvl(txtEndTime.getDateValue(), undefined) ? Util.toOraDateTimeString(txtEndTime.getDateValue()) : "null",
                "step_remarks": Util.quoted(txtRemarks.getValue()),
                "step_user": Util.quoted(sett["LOGON_USER"]),
                "step_done": "'N'"
            };
            if (sp > -1)
                sql = UtilGen.getUpdateRowStringByObj("PORD_JO_STEPS",
                    colvals, " pord_keyfld=:qry1.keyfld and step_pos=" + sp);
            else
                sql = UtilGen.getInsertRowStringByObj("PORD_JO_STEPS",
                    {
                        ...colvals,
                        ...{
                            "step_pos": "(select nvl(max(step_pos),0)+1 " +
                                "from pord_jo_steps where pord_keyfld=:qry1.keyfld )"
                        }
                    });
            sql = thatForm.frm.parseString(sql);
            var dt = Util.execSQL(sql);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess("Status updated !");
                dlg.close();
                if (fnCallBack != undefined) fnCallBack();
            }

        }
        doCreate();
        doLoad();



    },
    showMaterials: function (pOtherMat) {
        var that2 = this;
        var otherMat = Util.nvl(pOtherMat, false);
        var qc = (otherMat ? this.qcE : this.qc);
        var qcType = (otherMat ? 2 : 1);
        if (qc == undefined) {
            qc = new QueryView("qrCustitems" + that2.timeInLong);
            if (qcType == 1) that2.qc = qc; else that2.qcE = qc;
            qc.getControl().setEditable(true);
            qc.getControl().view = that2.view;
            qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
            qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
            qc.getControl().setFixedBottomRowCount(0);
            qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
            UtilGen.createDefaultToolbar1(qc, ["REFER", "DESCR"], true);
            qc.insertable = true;
            qc.deletable = true;
        }
        if (qcType == 1 && that2.fetchCustItems == false)
            qc.reset();
        if (qcType == 2 && that2.fetchCustExp == false)
            qc.reset();

        var cc = "";
        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
            that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
            cc = that2.frm.getFieldValue("qry1.ord_no");
        }
        var seteditale = function () {
            if (!(that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW)) {
                sap.m.MessageToast.show("Must Form EDIT or NEW mode to edit and add items ! ");
                cmdEdit.setPressed(false);
                qc.editable = false
                setTimeout(function () {
                    qc.colorRows();
                });
                return;
            }

            if (cmdEdit.getPressed())
                qc.editable = true;
            else
                qc.editable = false
            fetchData();
            setTimeout(function () {
                qc.colorRows();
            });
        }
        var eventCalc = function (qv, cx, rowno, reAmt) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

            if (reAmt)
                qv.updateDataToTable();

            var ld = qv.mLctb;
            var sumAmt = 0;

            for (var i = 0; i < ld.rows.length; i++) {
                var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                var pk = Util.extractNumber(ld.getFieldValue(i, "PACK"));
                var allqty = (Util.extractNumber(ld.getFieldValue(i, "PKQTY")) * pk) + Util.extractNumber(ld.getFieldValue(i, "QTY"));
                var amt = (pr / pk) * allqty;
                if (reAmt)
                    ld.setFieldValue(i, "AMOUNT", amt)
                sumAmt += amt;
            }

            // thatForm.frm.setFieldValue('totamt', df.format(sumAmt));
            that2.view.byId("txtSumAmt" + that2.timeInLong).setText(Util.getLangText("amountTxt") + " : " + df.format(sumAmt));
            if (reAmt)
                qv.updateDataToControl();

        };
        var fetchData = function () {
            var qv = (qcType == 1 ? that2.qc : that2.qcE);
            if ((qcType == 1 && that2.fetchCustItems) || (qcType == 2 && that2.fetchCustExp)) {
                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();
                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                    qv.eventCalc = eventCalc;
                    eventCalc(qv, undefined, 0, true);
                });
                return;
            }
            var sqx = (qcType == 1 ? "select p.item_pos,p.refer,i.descr,p.packd,p.unitd,p.pack,pkqty,price,0 amount" +
                " from pord_jo_exp p,items i where i.reference=p.refer " +
                "and p.keyfld=':qry1.keyfld' and exp_type=1 order by p.item_pos" :
                "select p.item_pos,p.refer,i.name descr,p.packd,p.unitd,p.pack,pkqty,price,0 amount" +
                " from pord_jo_exp p,c_ycust i where i.code=p.refer " +
                "and p.keyfld=':qry1.keyfld' and exp_type=2 order by p.item_pos"
            );

            var sqf = that2.frm.parseString(sqx);
            var dt = Util.execSQL(sqf);
            if (dt.ret == "SUCCESS") {
                qv.setJsonStrMetaData("{" + dt.data + "}");
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 80;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_POS")].mColClass = "sap.m.Input";
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].mColClass = "sap.m.Input";

                if (qcType == 2) {
                    qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].mHideCol = true;
                    qv.mLctb.cols[qv.mLctb.getColPos("UNITD")].mHideCol = true;
                    qv.mLctb.cols[qv.mLctb.getColPos("PACK")].mHideCol = true;
                    qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].mHideCol = true;
                    qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].mHideCol = true;
                    qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mColClass = "sap.m.Input";
                }

                qv.mLctb.cols[qv.mLctb.getColPos("ITEM_POS")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].getMUIHelper().display_width = 130;
                qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 220;
                qv.mLctb.cols[qv.mLctb.getColPos("PACKD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("UNITD")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PACK")].getMUIHelper().display_width = 50;
                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].getMUIHelper().display_width = 100;
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_width = 100;

                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_format = "MONEY_FORMAT";
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].getMUIHelper().display_format = "QTY_FORMAT";

                // qv.mLctb.cols[qv.mLctb.getColPos("PRICE_BUY")].getMUIHelper().display_format = "MONEY_FORMAT";

                qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].mTitle = (qcType == 1 ? "Price" : "Amount");

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
                    oModel.setProperty(currentRowoIndexContext.sPath + '/PRICE', 0);

                    var sq = "select descr,packd,unitd,pack,nvl(GET_ITEM_COST(reference),0)*pack PKCOST from items where reference='" + newValue + "' ";
                    if (qcType == 2)
                        sq = "select name descr,'PCS' packd,'PCS' unitd,1 pack,0 PKCOST from c_ycust where childcount=0 and code='" + newValue + "' ";

                    var dtxM = Util.execSQLWithData(sq);

                    if (dtxM != undefined && dtxM.length > 0) {
                        oModel.setProperty(currentRowoIndexContext.sPath + '/DESCR', dtxM[0].DESCR);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACKD', dtxM[0].PACKD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/UNITD', dtxM[0].UNITD);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PACK', dtxM[0].PACK);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/PRICE', dtxM[0].PKCOST);
                        oModel.setProperty(currentRowoIndexContext.sPath + '/AMOUNT', 0);
                        if (qcType == 2) {
                            oModel.setProperty(currentRowoIndexContext.sPath + '/PKQTY', 1);
                        }
                    }
                    eventCalc(qv, undefined, 0, false);
                };
                var validateAmt = function (evtx) {
                    var row = evtx.getSource().getParent();
                    var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                    var columns = evtx.getSource().getParent().getParent().getColumns();
                    var table = evtx.getSource().getParent().getParent(); // get table control.
                    var oModel = table.getModel();
                    var rowStart = table.getFirstVisibleRow(); //starting Row index
                    var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));

                    var price = oModel.getProperty(currentRowoIndexContext.sPath + "/PRICE");
                    var pkqty = oModel.getProperty(currentRowoIndexContext.sPath + "/PKQTY");
                    var amt = price * pkqty;
                    oModel.setProperty(currentRowoIndexContext.sPath + '/AMOUNT', amt);
                    eventCalc(qv, undefined, 0, false);

                };
                qv.mLctb.cols[qv.mLctb.getColPos("PKQTY")].eValidateColumn = validateAmt;
                if (qcType == 2)
                    qv.mLctb.cols[qv.mLctb.getColPos("PRICE")].eValidateColumn = validateAmt;

                var sqSearch = (qcType == 1 ?
                    "select reference code,descr title from items order by descr2" :
                    "select code,name title from c_ycust where childcount=0 and parentcustomer='8' order by path");
                var sqChange = (qcType == 1 ? "select reference code,descr title from items  where reference=:CODE" :
                    "select code,name descr from c_ycust  where childcount=0 and code=:CODE");
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].mSearchSQL = sqSearch;
                qv.mLctb.cols[qv.mLctb.getColPos("REFER")].eOnSearch = function (evtx) {
                    var input = evtx.getSource();
                    UtilGen.Search.do_quick_search(evtx, input,
                        sqSearch,
                        sqChange, undefined, function () {
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
                if (qcType == 1)
                    that2.fetchCustItems = true;
                else
                    that2.fetchCustExp = true;

                qv.onAddRow = function (idx, ld) {
                    ld.setFieldValue(idx, "PRICE", 0);
                    ld.setFieldValue(idx, "ITEM_POS", idx + 1);
                    ld.setFieldValue(idx, "PACKD", 'PCS');
                    ld.setFieldValue(idx, "UNITD", 'PCS');
                    ld.setFieldValue(idx, "PACK1", 1);
                    ld.setFieldValue(idx, "AMOUNT", 0);
                    if (qcType == 2) ld.setFieldValue(idx, "PKQTY", 1);
                }

                if (qv.editable && qv.mLctb.rows.length == 0)
                    qv.addRow();

                setTimeout(function () {
                    qv.updateDataToControl();
                    if (qv.editable) {
                        qv.getControl().getRows()[0].getCells()[0].focus();
                    }
                    eventCalc(qv, undefined, 0, true);
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
                that2.helperFunc.calcExpenses();
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
        Util.destroyID("txtSumAmt" + that2.timeInLong, that2.view);
        var txtSumRM = new sap.m.Text(that2.view.createId("txtSumAmt" + that2.timeInLong), { width: "300px", text: "0" }).addStyleClass("redText boldText");

        var tbHeader = new sap.m.Toolbar();
        pg.setFooter(tbHeader);
        pg.addContent(qc.showToolbar.toolbar);
        pg.addContent(qc.getControl());
        tbHeader.addContent(cmdEdit);
        tbHeader.addContent(cmdClose);
        tbHeader.addContent(new sap.m.ToolbarSpacer());
        tbHeader.addContent(txtSumRM);

        var tit = Util.getLangText("titCustItems");
        if (cc != "")
            tit = "Job order # " + that2.frm.getFieldValue("qry1.ord_no");


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
            qc.updateDataToTable();
            sap.m.MessageToast.show("Closing  Itmes window..");
        });
    },
    updateMaterials: function (pOtherMat) {
        var that2 = this;
        var otherMat = Util.nvl(pOtherMat, false);
        var qcType = (otherMat ? 2 : 1);
        var qc = (otherMat ? this.qcE : this.qc);
        if (qcType == 1 && !(that2.fetchCustItems || that2.qc == undefined || that2.qc.mLctb.rows.length == 0))
            return "";
        if (qcType == 2 && !(that2.fetchCustExp || that2.qcE == undefined || that2.qcE.mLctb.rows.length == 0))
            return "";
        var ld = qc.mLctb;
        var sqls = "";
        var sq2 = "insert into pord_jo_exp(keyfld,item_pos,refer,packd,unitd,pack,pkqty,price,exp_type,allqty) " +
            " VALUES (':qry1.keyfld',':ITEM_POS',':REFER',':PACKD', " +
            " ':UNITD' ,':PACK' ,:PKQTY, :PRICE, :EXP_TYPE, (:PKQTY * :PACK) );";
        var checkDuplicate = {};
        for (var i = 0; i < ld.rows.length; i++) {
            if (Util.nvl(ld.getFieldValue(i, "REFER"), "") == "") {
                that2.showMaterials(otherMat);
                FormView.err("Item is Invalid!");
            }
            var sqC1 = (qcType == 1 ? "select reference from items where reference='" + ld.getFieldValue(i, "REFER") +
                "' and childcounts=0  " : "select code from c_ycust where code='" + ld.getFieldValue(i, "REFER") +
            "' and childcount=0  ");
            var it = Util.getSQLValue(sqC1);
            if (Util.nvl(it, '') == '') FormView.err("Item/Expense Code is invalid ! #" + ld.getFieldValue(i, "REFER"));

            var pr = Util.extractNumber(ld.getFieldValue(i, "PKQTY"));
            if (pr <= 0) {
                that2.showMaterials(otherMat);
                FormView.err(" Qty IS INVALID !");
            }
            if (checkDuplicate[ld.getFieldValue(i, "REFER")] != undefined) {
                that2.showMaterials(otherMat);
                FormView.err("Refer  # " + ld.getFieldValue(i, "REFER") + " alredy existed for " + ld.getFieldValue(i, "DESCR"))
            } else
                checkDuplicate[ld.getFieldValue(i, "REFER")] = ld.getFieldValue(i, "DESCR");
            var sq = sq2.replaceAll(":REFER", ld.getFieldValue(i, "REFER"))
                .replaceAll(":ITEM_POS", ld.getFieldValue(i, "ITEM_POS"))
                .replaceAll(":PACKD", ld.getFieldValue(i, "PACKD"))
                .replaceAll(":UNITD", ld.getFieldValue(i, "UNITD"))
                .replaceAll(":PACK", ld.getFieldValue(i, "PACK"))
                .replaceAll(":PKQTY", ld.getFieldValue(i, "PKQTY"))
                .replaceAll(":EXP_TYPE", qcType)
                .replaceAll(":PRICE", ld.getFieldValue(i, "PRICE"));
            sqls += sq;
        }
        sqls = "delete from PORD_JO_EXP where KEYFLD=':qry1.keyfld' and exp_type=" + qcType + ";" + sqls;
        return sqls;
    },
    showExpesnes: function () {
        this.showMaterials(true);
    },
    startActive: function () {
        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"] + " h:m:a");
        var sqj = "select ord_flag,ordacc," +
            "JO_DESIGN_USER,to_char(JO_DESIGN_TIME,'mm/dd//rrrr hh24.mi' ) JO_DESIGN_TIME," +
            "JO_DYE_USER,to_char(nvl(JO_DYE_TIME,MODIFIED_TIME),'mm/dd//rrrr hh24.mi' ) JO_DYE_TIME," +
            " to_char(nvl(JO_PLATE_TIME,MODIFIED_TIME),'mm/dd//rrrr hh24.mi' ) JO_PLATE_TIME , " +
            "JO_STOCK_USER,to_char(JO_STOCK_TIME,'mm/dd//rrrr hh24.mi' ) JO_STOCK_TIME " +
            " from pord1 where keyfld="
            + thatForm.frm.getFieldValue("keyfld");
        var dt = Util.execSQLWithData(sqj);
        if (dt.length <= 0) return;
        if (Util.nvl(dt[0].JO_DESIGN_USER, "") == '' ||
            Util.nvl(dt[0].JO_DYE_USER, "") == '' ||
            Util.nvl(dt[0].JO_STOCK_USER, "") == '')
            return;

        var dest = new Date(dt[0].JO_DESIGN_TIME.replaceAll(".", ":"));
        var dyt = new Date(dt[0].JO_DYE_TIME.replaceAll(".", ":"));
        var plt = new Date(dt[0].JO_PLATE_TIME.replaceAll(".", ":"));
        var dstt = new Date(dt[0].JO_STOCK_TIME.replaceAll(".", ":"));
        var tp = new Date(Math.max(dest.getTime(), dyt.getTime(), dstt.getTime()));
        Util.simpleConfirmDialog(Util.getLangText("Are you sure to activate this JO from ->  " + df.format(tp) + " ?"), function (oAction) {
            var dt = Util.execSQL("update pord1 set jo_active_from=" + Util.toOraDateTimeString(tp) + " where keyfld=" + thatForm.frm.getFieldValue("keyfld"));
            if (dt.ret == "SUCCESS")
                FormView.msgSuccess("JO is active now !");
            thatForm.queryCommands();
        });

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
                    thatForm.fileUpload = undefined;
                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                    thatForm.fetchCustItems = false;
                    thatForm.fetchCustExp = false;
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    if (qry.name == "qry1") {
                        thatForm.helperFunc.calcExpenses();
                        thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.empname"].obj);
                        UtilGen.Search.getLOVSearchField("select descr from items where reference = :CODE ", qry.formview.objs["qry1.ord_ship"].obj, undefined, that.frm.objs["qry1.itemname"].obj);
                        var saleinv = Util.getSQLValue("select saleinv from order1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(saleinv, '') != '') {
                            var invno = Util.getSQLValue("select max(invoice_no) from  pur1 where keyfld=" + saleinv);
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("JO is POSTED ,INV # " + invno);
                        }
                        thatForm.queryCommands();

                        var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=9 and pord1_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var sold = Util.getSQLValue("select nvl(sum(allqty),0) from pur2 where invoice_code=21 and po_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var ordrd = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        var matcost = Util.getSQLValue("select nvl(sum(act_mat_cost),0) from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        thatForm.frm.setFieldValue("qry2.actmatcost", matcost, matcost, true);
                        var rcvdp = 0; var soldp = 0;
                        thatForm.dlvqty = rcvd;
                        thatForm.soldqty = sold;
                        if (ordrd > 0) rcvdp = Math.round((100 / ordrd) * rcvd, 2);
                        if (ordrd > 0) soldp = Math.round((100 / ordrd) * sold, 2);

                        // thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("" + rcvdp + " % ");                        
                        thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("D/S: " + rcvdp + (soldp == rcvdp ? "" : " / " + soldp) + " %");
                    }
                    if (qry.name == "qry2" && qry.obj.mLctb.cols.length > 0)
                        qry.obj.mLctb.getColByName("DESCR").beforeSearchEvent = function (sq, ctx, model) {
                            qry.obj.mLctb.getColByName("DESCR").btnsx = [];
                            qry.obj.mLctb.getColByName("DESCR").listPara = {
                                selectStr: "@300/Last 300,1000/Last 1000,2500/Last 2500,-1/All",
                                defaultKey: "1000"
                            };
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
                    thatForm.fileUpload = undefined;
                    if (qry.name == "qry1") {
                        thatForm.dlvqty = 0;
                        thatForm.fetchCustItems = false;
                        thatForm.fetchCustExp = false;
                        var objOn = thatForm.frm.objs["qry1.location_code"].obj;
                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from pord1");
                        var dt = thatForm.view.today_date.getDateValue();

                        var objTot = thatForm.frm.objs["qry2.totamt"].obj;
                        var objcst = thatForm.frm.objs["qry2.totcost"].obj;
                        var objmat = thatForm.frm.objs["qry2.matcost"].obj;
                        var objothexp = thatForm.frm.objs["qry2.otherexp"].obj;

                        UtilGen.setControlValue(objOn, sett["DEFAULT_LOCATION"], sett["DEFAULT_LOCATION"], true);
                        UtilGen.setControlValue(objKf, newKf, newKf, true);

                        UtilGen.setControlValue(objTot, 0, 0, true);
                        UtilGen.setControlValue(objcst, 0, 0, true);
                        UtilGen.setControlValue(objmat, 0, 0, true);
                        UtilGen.setControlValue(objothexp, 0, 0, true);
                        thatForm.frm.setFieldValue("qry2.actmatcost", 0, 0, true);
                        qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                        objOn.fireSelectionChange();
                        setTimeout(() => {
                            if (thatForm.qc != undefined) {
                                thatForm.qc.reset();
                                thatForm.qc = undefined;
                            }
                            if (thatForm.qcE != undefined) {
                                thatForm.qcE.reset();
                                thatForm.qcE = undefined;
                            }
                            thatForm.queryCommands();
                        });
                    }
                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var keyfld = thatForm.frm.getFieldValue("qry1.keyfld");
                    var podt = UtilGen.JOFunc.checkJOStatus(keyfld, false);
                    if (podt.ORD_FLAG != 1) FormView.err("Either JO is approved or closed !");
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {
                    if (qry.name == "qry1") {
                        var keyfld = thatForm.frm.getFieldValue("qry1.keyfld");
                        var podt = UtilGen.JOFunc.checkJOStatus(keyfld, false);
                        if (podt.ORD_FLAG != 1) FormView.err("Either JO is approved or closed !");
                        return "delete from PORD_JO_EXP where keyfld=" + keyfld + "; ";
                    }
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
                addSqlAfterInsert: function (qry, rn) {
                    if (qry.name == "qry1") {
                        var sq2 = "";
                        var sq3 = "";
                        if (thatForm.fetchCustItems && thatForm.qc != undefined && thatForm.qc.mLctb.rows.length > 0)
                            sq2 = thatForm.frm.parseString(Util.nvl(thatForm.updateMaterials(false), sq2));
                        if (thatForm.fetchCustExp && thatForm.qcE != undefined && thatForm.qcE.mLctb.rows.length > 0)
                            sq3 = thatForm.frm.parseString(Util.nvl(thatForm.updateMaterials(true), sq3));

                        return sq2 + sq3;
                    }
                    return "";
                },
                addSqlAfterUpdate: function (qry, rn) {
                    if (qry.name == "qry1") {
                        var sq2 = "";
                        var sq3 = "";
                        if (thatForm.fetchCustItems && thatForm.qc != undefined && thatForm.qc.mLctb.rows.length > 0)
                            sq2 = thatForm.frm.parseString(Util.nvl(thatForm.updateMaterials(false), sq2));

                        if (thatForm.fetchCustExp && thatForm.qcE != undefined && thatForm.qcE.mLctb.rows.length > 0)
                            sq3 = thatForm.frm.parseString(Util.nvl(thatForm.updateMaterials(true), sq3));

                        return sq2 + sq3;
                    }

                    return "";
                },
                beforeExeSql: function (frm, sq) {
                    var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    var sq2 = "update pord1 set ORDERDQTY=(select nvl(sum(ord_allqty),0) from pord2 where keyfld=" + kf + ") where keyfld=" + kf + "; "
                    var ld = thatForm.frm.objs["qry2"].obj.mLctb;

                    var sql1 = UtilGen.getInsertRowStringByObj("positems", {
                        "keyfld": "(select nvl(max(keyfld),0)+1 from positems) ",
                        "refer": "':qry1.ord_ship'",
                        "descr": "':qry2.descr'",
                        "item_color": "':qry2.item_color'",
                        "item_size": "':qry2.item_size'",
                        "add_work": "':qry2.add_work'",
                        "recto_verso": "':qry2.recto_verso'",
                        "srno": "':qry2.srno'",
                        "machine": "':qry2.machine'",
                        "material": "':qry2.material'",
                        "price": ":qry2.ord_price",
                    });
                    sql1 = "delete from positems where refer=':qry1.ord_ship' and descr=':qry2.descr';" + sql1 + ";";
                    sql1 = thatForm.frm.parseString(sql1);
                    var sqls = "";
                    for (var i = 0; i < ld.rows.length; i++)
                        sqls += thatForm.frm.parseString(sql1, i);

                    return sq + sq2 + sqls;
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
                    title: '@{\"text\":\"Total\",\"width\":\"15%\","textAlign":"End","styleClass":"redText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                lblEstm: {
                    colname: "lblEstm",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: '{\"text\":\"Estimation:\",\"width\":\"50%\","textAlign":"Center","styleClass":"boldText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "color:maroon;",
                    display_format: "",
                    other_settings: { width: "0px" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                lblActm: {
                    colname: "lblActm",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    title: '@{\"text\":\"Actual:\",\"width\":\"50%\","textAlign":"Center","styleClass":"boldText"}',
                    title2: "Total ",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "color:maroon;",
                    display_format: "",
                    other_settings: { width: "0px" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                matcost: {
                    colname: "matcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Material cost\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                actmatcost: {
                    colname: "actmatcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Material cost\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                otherexp: {
                    colname: "otherexp",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Other Expenses\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                actotherexp: {
                    colname: "actotherexp",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Other Expenses\",\"width\":\"20%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                totcost: {
                    colname: "totcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Total cost\",\"width\":\"20%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                acttotcost: {
                    colname: "acttotcost",
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"Total cost\",\"width\":\"20%\","textAlign":"End","styleClass":"redText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: sumSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "background-color:yellow;",
                    display_format: sett["FORMAT_MONEY_1"],
                    other_settings: { width: "30%", editable: false },
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
                    pPoints: { pWidth: "600px" },
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
                        edit_allowed: false,
                        insert_allowed: false
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
                }),
                jo_status: FormView.getFactoryFields.getGeneralField(
                    "jo_status", "@", "txtStatus", "15%", "redText", "10%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                    }
                }),
                jo_active_from: FormView.getFactoryFields.getDateField(
                    "jo_active_from", "@", "txtStatus", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "boldText"
                    }, {
                    change: function () {
                    }
                }),
                location_code: FormView.getFactoryFields.getComboField(
                    "location_code", "", "locationTxt",
                    "15%", "", "15%",
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
                    "ord_no", "@", "txtNo", "10%", "redText boldText", "10%",
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
                        list: "@digital/Digital,outside/Outside,offset/Offset,plotter/Plotter",
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
                            colname: "STATUS",
                            mTitle: Util.getLangText("txtStatus"),
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
                            mTitle: Util.getLangText("txtSold"),
                            display_width: 80,
                        },

                        {
                            colname: "DLVP",
                            mTitle: Util.getLangText("txtDeliver"),
                            display_width: 80,
                        },

                        {
                            colname: "ORD_AMT",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("amountTxt"),
                            display_width: 120,
                            mSummary: "SUM"

                        },
                        {
                            colname: "ORD_DISCAMT",
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
                    sql: "select *from (select o1.ord_no,o1.ord_date," +
                        "(case when jo_active_from is not null and ord_flag=3 then 'Closed'  " +
                        " when jo_active_from is not null and ord_flag!=3 then 'Active'  " +
                        " else 'Pending' end ) status , " +
                        " pur.invoice_no,o1.ord_ref,o1.ord_refnm," +
                        "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * purqty, 2)) else 0 end)||'%' purp ," +
                        "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * DELIVEREDQTY, 2)) else 0 end)||'%' dlvp ," +
                        " o1.ord_amt,o1.ord_discamt,o1.ord_amt-o1.ord_discamt netamt, o1.keyfld from pord1 o1," +
                        " (select max(p.keyfld) kfld,max(p.invoice_no) invoice_no,po_keyfld  from pur1 p where p.invoice_code=21 and po_keyfld is not null group by p.po_keyfld) pur " +
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
                                (
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW ||
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW
                                )) {
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://letter",
                                    text: Util.getLangText("Add/Edit Materials"),
                                    press: function () {
                                        that2.showMaterials();
                                    }
                                }));
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://letter",
                                    text: Util.getLangText("Add/Edit Expenses"),
                                    press: function () {
                                        that2.showExpesnes();
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
                var ex = Util.getSQLValue("select nvl(max(ord_no),-1) from pord1 where ord_code='" + thatForm.vars.vou_code + "' and ord_no='" + thatForm.frm.getFieldValue("qry1.ord_no") + "'");
                if (Util.extractNumber(ex + "") != -1)
                    FormView.err("JO no existed !");
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
                var descr = ld.getFieldValue(i, "DESCR");
                var rfr = thatForm.frm.getFieldValue("qry1.ord_ship");
                var qty = ld.getFieldValue(i, "ORD_PKQTY");
                var pr = ld.getFieldValue(i, "ORD_PRICE");
                if (dup[rfr] != undefined)
                    FormView.err("Save Denied : Duplicate item entry # " + rfr);
                dup[descr] = descr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    FormView.err("Save Denied : Item " + rfr + " is a group item !");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                if (cnt == 0)
                    FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0)
                    FormView.err("Save Denied: PRICE invalid value !");
                if (qty <= 0)
                    FormView.err("Save Denied: QTY invalid value !");
            }

        },
        calcExpenses: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var keyfld = thatForm.frm.getFieldValue("keyfld");
            var podt = UtilGen.JOFunc.checkJOStatus(keyfld, false);

            var totMatExp = 0;
            var totOtherExp = 0;
            var calcFromTbl = function (qv) {
                qv.updateDataToTable();
                var ld = qv.mLctb;
                var sumAmt = 0;
                for (var i = 0; i < ld.rows.length; i++) {
                    var pr = Util.extractNumber(ld.getFieldValue(i, "PRICE"));
                    var pk = Util.extractNumber(ld.getFieldValue(i, "PACK"));
                    var allqty = (Util.extractNumber(ld.getFieldValue(i, "PKQTY")) * pk) + Util.extractNumber(ld.getFieldValue(i, "QTY"));
                    var amt = (pr / pk) * allqty;
                    sumAmt += amt;
                }
                return sumAmt;
            }
            var calcFromDb = function (expType) {
                var nm = Util.getSQLValue("select sum((price/pack)*allqty) from pord_jo_exp where keyfld=" + keyfld + " and exp_type=" + expType);
                nm = (typeof nm == "string") ? Util.extractNumber(nm) : nm
                return nm;
            };
            // refreshing table
            if (thatForm.qc != undefined)
                thatForm.qc.updateDataToTable();
            if (thatForm.qcE != undefined)
                thatForm.qcE.updateDataToTable();

            if (thatForm.qc != undefined && thatForm.qc.mLctb.rows.length > 0)
                totMatExp = calcFromTbl(thatForm.qc);
            else if (thatForm.qc == undefined || thatForm.qc.mLctb.rows.length == 0)
                totMatExp = calcFromDb(1);

            if (thatForm.qcE != undefined && thatForm.qcE.mLctb.rows.length > 0)
                totOtherExp = calcFromTbl(thatForm.qcE);
            else if (thatForm.qcE == undefined || thatForm.qcE.mLctb.rows.length == 0)
                totOtherExp = calcFromDb(2);

            thatForm.frm.setFieldValue('qry2.matcost', df.format(totMatExp));
            thatForm.frm.setFieldValue('qry2.otherexp', df.format(totOtherExp));
            thatForm.frm.setFieldValue('qry2.totcost', df.format(totMatExp + totOtherExp));
        },
        fetchItem: function () {
            var rfrFld = "ord_no";
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                return;
            setTimeout(function () {
                var rfr = thatForm.frm.getFieldValue("qry1." + rfrFld);
                var loc = thatForm.frm.getFieldValue("qry1.location_code");
                var qr = Util.execSQLWithData("select keyfld,ord_refnm from pord1 where location_code='" + loc + "' and ORD_CODE=601 AND " + rfrFld + "='" + rfr + "'");
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

            });
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



