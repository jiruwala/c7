sap.ui.jsfragment("bin.forms.br.forms.con1", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
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
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
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
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var sumSpan2 = "XL2 L6 M6 S12";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: "Contracts",
                toolbarBG: "#fff0f5",
                formSetting: {
                    width: { "S": 400, "M": 500, "L": 600 },
                    cssText: [
                        "padding-left:10px;" +
                        "padding-top:20px;" +
                        "border-width: thin;" +
                        "border-style: solid;" +
                        "border-color: lightgreen;" +
                        "margin: 10px;" +
                        "border-radius:25px;" +
                        "background-color:#fff0f5;"
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
                        var df = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                        if (qry.name == "qry1") {

                            that2.qrDates = [];
                            var dt = Util.execSQLWithData("select distinct to_char(startdate,'mm/dd/rrrr') dts,startdate from c_custitems where keyfld='" + that2.frm.getFieldValue("qry1.keyfld") + "' order by 2 desc");
                            for (var d in dt)
                                that2.qrDates.push(dt[d].DTS);
                            if (that2.qrDates.length > 0) {
                                that2.qrDate = that2.qrDates[0];
                                var dtstr = df.format(new Date(that2.qrDate));
                                that2.frm.setFieldValue("qry1.default_date", dtstr, dtstr, true);
                            }
                            that2.helperFunc.showDates();
                            var strInvs = "select b_name title from cbranch where code=':cust_code' and brno = ':CODE' ".replaceAll(":cust_code", UtilGen.getControlValue(qry.formview.objs["qry1.cust_code"].obj));
                            UtilGen.Search.getLOVSearchField(strInvs, qry.formview.objs["qry1.branch_no"].obj, undefined, that.frm.objs["qry1.branchname"].obj);
                            UtilGen.Search.getLOVSearchField("select name title from c_ycust where code=':CODE'", qry.formview.objs["qry1.cust_code"].obj, undefined, that.frm.objs["qry1.ref_title"].obj);

                        }
                    },
                    beforeLoadQry: function (qry, sql) {
                        return sql;
                    },
                    afterSaveQry: function (qry) {

                    },
                    afterSaveForm: function (frm, nxtStatus) {
                    },
                    beforeSaveQry: function (qry, sqlRow, rowNo) {
                        thatForm.helperFunc.beforeSaveValidateQry(qry);

                        return "";
                    },
                    afterNewRow: function (qry, idx, ld) {
                        var df = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                        if (qry.name == "qry1") {
                            that2.qrDate = thatForm.view.today_date.getDateValue();
                            that2.qrDates = [];
                            var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                            var objNo = thatForm.frm.objs["qry1.no"].obj;
                            var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c_contract");
                            var newNo = Util.getSQLValue("select nvl(max(no),0)+1 from c_contract");
                            var dt = thatForm.view.today_date.getDateValue();

                            UtilGen.setControlValue(objKf, newKf, newKf, true);
                            UtilGen.setControlValue(objNo, newNo, newNo, true);
                            var dtx = new Date('01/01/2001');
                            qry.formview.setFieldValue("qry1.contract_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                            qry.formview.setFieldValue("qry1.default_date", df.format(dtx), df.format(dtx), true);
                            that2.qryDate = dtx;
                            that2.qrDates[0] = dtx
                            that2.helperFunc.showDates();
                        }
                    },
                    beforeDeleteValidate: function (frm) {
                        FormView.err("Deleteion not implemented , denied:");
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

                    },
                    onCellRender: function (qry, rowno, colno, currentRowContext) {
                    },
                    beforeExeSql: function (frm, sq) {
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var sql = sq + " update_contract_end(" + kf + "); ";
                        return sql;

                    },
                    beforePrint: function (rptName, params) {
                        return params;
                    },

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
                        dml: "select *from c_contract where no=':pac'",
                        where_clause: " no=':keyfld'",
                        update_exclude_fields: ["default_date", "keyfld", "address", "branchname"],
                        insert_exclude_fields: ["default_date", "address", "branchname"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNAME": Util.quoted(sett["LOGON_USER"]),
                            "PROJECT_NAME": "':qry1.branchname'",
                            "CONTRACT_TYPE": 1,
                            "PROJECT_ADDRESS": "'.'",
                            "REF_NAME": "'.'",
                            "PROJECT_NO": ":qry1.branch_no",
                        },
                        update_default_values: {},
                        table_name: "c_contract",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1(),
                        after_add_form: function () {

                        }
                    },
                    {
                        type: "query",
                        name: "qry2",
                        showType: FormView.QueryShowType.QUERYVIEW,
                        applyCol: "C7.BRCUSTITEMS",
                        addRowOnEmpty: true,
                        dml: "select C.KEYFLD, C.STARTDATE, C.REFER, C.PRICE,C.PRICE_BUY, C.PACKD, C.UNITD, c.asm_ctg,C.PACK, C.ENDDATE, C.FLAG, C.UPDATE_TIME, C.DISC_AMT, C.PRE_PRICE, C.PRE_DISC_AMT,i.descr from c_custitems c,items i where i.reference=c.refer and c.startdate=to_date(nvl(':qry1.default_date','01/01/2000'),repair.getsetupvalue_2('DATE_FORMAT')) and c.keyfld=':keyfld' order by c.refer ",
                        // dml: "select *from c_custitems where startdate=" + Util.nvl(Util.toOraDateString(that2.qrDate), 'null') + " and keyfld=':keyfld' order by refer ",
                        dispRecords: { "S": 5, "M": 7, "L": 8, "XL": 14, "XXL": 25 },
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: true,
                        delete_before_update: "delete from c_custitems where keyfld=':keyfld' and startdate=to_date(':qry1.default_date','" + sett["ENGLISH_DATE_FORMAT_ORA"] + "');",
                        where_clause: " keyfld=':qry1.keyfld' ",
                        update_exclude_fields: ['KEYFLD', 'DESCR', "BRANCHNAME"],
                        insert_exclude_fields: ['DESCR'],
                        insert_default_values: {
                            "KEYFLD": ":qry1.keyfld",
                            "STARTDATE": "to_date(':qry1.default_date','" + sett["ENGLISH_DATE_FORMAT_ORA"] + "')",
                            "ENDDATE": "to_date(':qry1.default_date','" + sett["ENGLISH_DATE_FORMAT_ORA"] + "')",
                        },
                        update_default_values: {
                        },
                        table_name: "c_custitems",
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
                        },
                        summary: {
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
                            }
                        }

                    }
                ],
                canvas: [
                    {
                        name: "default_canvas",
                        objType: FormView.ObjTypes.CANVAS,
                        after_add_canvas: function (cont) {
                            Util.destroyID(thatForm.view.createId("cmdAddDate_" + thatForm.timeInLong), thatForm.view);
                            Util.destroyID(thatForm.view.createId("cmdDelDate_" + thatForm.timeInLong), thatForm.view);
                            cont.addContent(new sap.m.Button(thatForm.view.createId("cmdAddDate_" + thatForm.timeInLong),
                                {
                                    text: "Add date",
                                    press: function () {
                                        thatForm.helperFunc.addDate();
                                    }
                                }));
                            // cont.addContent(new sap.m.Button(thatForm.view.createId("cmdDelDate_" + thatForm.timeInLong),
                            //     {
                            //         text: "Delete date",
                            //         press: function () {
                            //             thatForm.helperFunc.deleteDate();
                            //         }
                            //     }));
                            thatForm.cont = cont;
                        }
                    }
                ],
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
                                colname: "REF_NAME",
                            },
                            {
                                colname: "CUST_CODE",
                            },
                            {
                                colname: "PROJECT_NAME",
                            },

                        ],  // [{colname:'code',width:'100',return_field:'pac' }]
                        sql: "select c.no,c.cust_code,y.name ref_name,c.branch_no,c.project_name,c.keyfld from c_contract c,c_ycust y " +
                            "where c.cust_code=y.code order by keyfld desc",
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
        if (Util.nvl(this.oController.code, "") != "") {
            this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
            var kf = Util.execSQLWithData("select keyfld from c_contract where cust_code='" +
                this.oController.code + "' and branch_no='" + Util.nvl(this.oController.branch, "") + "'");
            if (kf != undefined && kf.length > 0) {
                // this.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                this.frm.setFieldValue("pac", kf[0].KEYFLD, kf[0].KEYFLD, true);
                this.frm.loadData(undefined, FormView.RecordStatus.VIEW);

            } else {
                UtilGen.setControlValue(this.frm.objs["qry1.cust_code"].obj, this.oController.code, this.oController.code, true);
                if (Util.nvl(this.oController.branch, "") != "")
                    UtilGen.setControlValue(this.frm.objs["qry1.branch_no"].obj, Util.nvl(this.oController.branch, ""), Util.nvl(this.oController.branch, ""), true);
            }
            return;
        }

        this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
    },
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
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
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "20%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: true
                },
                no: {
                    colname: "no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtNo\",\"width\":\"15%\","textAlign":"End","styleClass":"redText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "20%" },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                contract_date: {
                    colname: "contract_date",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"txtDate\",\"width\":\"41%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        width: "24%",
                        minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                        change: function () {
                        }
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                },
                cust_code: {
                    colname: "cust_code",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtCustSupp\",\"width\":\"15%\","textAlign":"End","styleClass":"darkBlueText boldText"}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "20%",
                        showValueHelp: true,
                        change: function (e) {

                            var objBr = thatForm.frm.objs["qry1.branch_no"].obj;
                            var objBrNm = thatForm.frm.objs["qry1.branchname"].obj;
                            UtilGen.setControlValue(objBr, "", "", true);
                            UtilGen.setControlValue(objBrNm, "", "", true);

                            var sq = "select name from c_ycust where flag=1 and childcount=0 and code = ':CODE'";
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.cust_code"].obj, undefined, thatForm.frm.objs["qry1.ref_title"].obj);


                        },
                        valueHelpRequest: function (e) {

                            var btns = [new sap.m.Button({
                                text: Util.getLangText('newCustomer'), press: function () {
                                    UtilGen.execCmd("gl.rp formType=dialog formSize=850px,450px", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                                    });
                                }
                            })];

                            var sq = "SELECT C_YCUST.CODE,C_YCUST.NAME,BRNO,B_NAME FROM C_YCUST ,CBRANCH WHERE C_YCUST.CODE=CBRANCH.CODE  " +
                                " and c_ycust.code||'-'||cbranch.brno not in (select cx.cust_code||'-'||cx.branch_no from c_contract cx ) "
                            " ORDER BY C_YCUST.CODE,CBRANCH.BRNO ";
                            Util.show_list(sq, ["CODE", "NAME", "BRNO", "B_NAME"], "", function (data) {
                                thatForm.frm.objs["qry1.cust_code"].obj.setValue(data.CODE);
                                thatForm.frm.objs["qry1.cust_code"].obj.fireChange();
                                thatForm.frm.objs["qry1.branch_no"].obj.setValue(data.BRNO);
                                thatForm.frm.objs["qry1.branch_no"].obj.fireChange();
                                return true;
                            }, "100%", "100%", undefined, false, undefined, undefined, undefined, undefined, undefined, btns);
                        }

                    },
                    edit_allowed: false,
                    insert_allowed: true,
                    require: true
                },
                ref_title: {
                    colname: "ref_title",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "24%" },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false
                },
                branch_no: {// branch no
                    colname: "branch_no",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_START",
                    display_style: "",
                    display_format: "",
                    other_settings: {
                        editable: true, width: "20%",
                        showValueHelp: true,
                        change: function (e) {
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.cust_code"].obj)
                            var sq = "select b_name name from cbranch where code=':CUSTCODE' and brno = ':CODE'".replaceAll(":CUSTCODE", locval);
                            UtilGen.Search.getLOVSearchField(sq, thatForm.frm.objs["qry1.branch_no"].obj, undefined, thatForm.frm.objs["qry1.branchname"].obj);

                        },
                        valueHelpRequest: function (e) {
                            var btns = [new sap.m.Button({
                                text: 'New Branch ', press: function () {
                                    thatForm.helperFunc.showBranch(this);
                                }
                            })];
                            var locval = UtilGen.getControlValue(thatForm.frm.objs["qry1.cust_code"].obj)
                            UtilGen.Search.do_quick_search(e, this,
                                "select brno code,b_name  title,AREA,BLOCK,JEDDA,QASIMA from cbranch where code=':locationx' order by brno ".replaceAll(":locationx", locval),
                                "select brno code,b_name title from cbranch where code=':locationx' and brno=:CODE".replaceAll(":locationx", locval), thatForm.frm.objs["qry1.branchname"].obj, undefined, { pWidth: "80%" }, btns);
                        }

                    },
                    edit_allowed: false,
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
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "64%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                address: {
                    colname: "address",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtAddr\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: true, width: "85%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
                default_date: {
                    colname: "default_date",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"Last Begin Date\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "default_canvas",
                    display_width: codSpan,
                    display_align: "ALIGN_CENTER",
                    display_style: "",
                    display_format: "",
                    other_settings: { editable: false, width: "35%" },
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false
                },
            };
        },
        showDates: function (firePress) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var thatForm = this.thatForm;
            if (thatForm.hb == undefined) {
                thatForm.hb = new sap.m.HBox();
                if (thatForm.cont != undefined)
                    thatForm.cont.addContent(thatForm.hb);
            }
            thatForm.hb.removeAllItems();
            var qds = Util.nvl(thatForm.qrDates, []);
            var selectDefault = function (fp) {
                var qds = Util.nvl(thatForm.qrDates, []);
                for (var i in qds) {
                    thatForm.view.byId("dt_" + thatForm.timeInLong + "_" + i).setPressed(false);
                    if (qds[i] == thatForm.qrDate) {
                        thatForm.view.byId("dt_" + thatForm.timeInLong + "_" + i).setPressed(true);
                        // if (fp) thatForm.view.byId("dt_" + thatForm.timeInLong + "_" + i).firePress();
                    }

                }
            }
            for (var i in qds) {
                Util.destroyID("dt_" + thatForm.timeInLong + "_" + i, thatForm.view);
                var bt = new sap.m.ToggleButton(thatForm.view.createId("dt_" + thatForm.timeInLong + "_" + i), {
                    text: sdf.format(new Date(qds[i])),
                    customData: [{ key: qds[i] }],
                    pressed: false,
                    press: function () {
                        thatForm.qrDate = this.getCustomData()[0].getKey();
                        var dtstr = sdf.format(new Date(thatForm.qrDate));
                        thatForm.frm.setFieldValue("qry1.default_date", dtstr, dtstr, true);
                        thatForm.frm.loadQueryView(thatForm.frm.objs["qry2"], false);
                        selectDefault(Util.nvl(firePress, false));
                    }
                });

                thatForm.hb.addItem(bt);
            }
            selectDefault(Util.nvl(firePress, false));


        },
        addDate: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

            if (!(thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
                FormView.err("Form must be either EDIT or NEW status !");
            var dt = new sap.m.DatePicker(
                {
                    valueFormat: sett["ENGLISH_DATE_FORMAT"],
                    displayFormat: sett["ENGLISH_DATE_FORMAT"],
                    change: function (ev) {
                        var dtx = this.getDateValue();
                        //check if this date in  qrDates
                        var qds = Util.nvl(thatForm.qrDates, []);
                        for (var q in qds)
                            if (qds[q] == dtx)
                                FormView.err("Date already existed !");
                        if (dtx == null || dtx == undefined) return;
                        thatForm.qrDates = [...[dtx], ...thatForm.qrDates];
                        thatForm.qrDate = dtx;
                        var dtstr = sdf.format(dtx);
                        thatForm.frm.setFieldValue("qry1.default_date", dtstr, dtstr, true);
                        thatForm.helperFunc.showDates(true);
                        thatForm.frm.loadQueryView(thatForm.frm.objs["qry2"], false);
                        // dt.close();
                    }
                }
            );

            var minDate = new Date(thatForm.qrDates[0]);
            // dt.setMinDate(Util.addDaysFromDate(minDate, 1));
            dt.openBy(thatForm.view.byId("cmdAddDate_" + thatForm.timeInLong));
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c_contract");
                qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                var no = Util.getSQLValue("select nvl(max(no),0)+1 from c_contract");
                qry.formview.setFieldValue("qry1.no", no, no, true);
            }
            //customer validity
            var cod = thatForm.frm.getFieldValue("qry1.cust_code");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where code='" + cod + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Customer is invalid !");
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) FormView.err("Save Denied : Parent customer not allowed !");

            //branch
            var brno = thatForm.frm.getFieldValue("qry1.branch_no");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from cbranch where code='" + cod + "' and brno=" + brno);
            if (sqcnt == 0) FormView.err("Save Denied : Branch no is invalid !");

            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                var rfr = ld.getFieldValue(i, "REFER");
                var pr = ld.getFieldValue(i, "PRICE");
                var prb = ld.getFieldValue(i, "PRICE_BUY");
                if (dup[rfr] != undefined)
                    FormView.err("Save Denied : Duplicate item entry # " + rfr);
                dup[rfr] = rfr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    FormView.err("Save Denied : Item " + rfr + " is a group item !");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where reference='" + rfr + "'");
                if (cnt == 0)
                    FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0 || prb < 0)
                    FormView.err("Save Denied: PRICE invalid value !");
                if (pr == 0 && prb == 0)
                    FormView.err("Save Denied: PRICE or PRICE buy must have vaue !");

            }
        },
        deleteDate: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var qdt = thatForm.qrDate;
            if (!(thatForm.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW))
                FormView.err("Form must be either EDIT or NEW status !");
            Util.simpleConfirmDialog("Do you want to delete this date " + qdt, function (oAction) {
                if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                    thatForm.cmdButtons.cmdNew.firePress();
                }
            });

        }
    }

});



