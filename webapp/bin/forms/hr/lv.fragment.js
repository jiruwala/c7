sap.ui.jsfragment("bin.forms.hr.lv", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
        this.isDialog = false;
        this.statusDescr = {
            "REQUEST": "Request",
            "APPROVED": "APPROVED",
            "ACTIVEE": "ACTIVE",
            "RETURNED": "RETURNED"
        };
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };
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
        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("titRequestLeave"),
                toolbarBG: "#fff0f5",
                formSetting: {
                    class: "",
                    width: "660px",
                    cssText: [
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
                        dml: "select *from c7hr_req_leave where keyfld=':pac'",
                        where_clause: " keyfld=':keyfld'",
                        update_exclude_fields: ["keyfld",],
                        insert_exclude_fields: [],
                        insert_default_values: {
                            "MODIFIED_TIME": "sysdate",
                            "MODIFIED_USER": Util.quoted(sett["LOGON_USER"]),
                            "FLAG": 1,
                            "STATUS": "'REQUEST'"
                            // "TYPE": 3
                        },
                        update_default_values: {

                        },
                        table_name: "c7hr_req_leave",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    }
                ],
                canvas: [],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getLists(),
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
    },
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getEvents: function () {
            var thatForm = this.thatForm;
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
                afterExeSql: function (oSql) {
                    // thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.code"));
                },
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    if (qry.name == "qry1") {
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        // UtilGen.Search.getLOVSearchField("select name from acaccount where accno = :CODE ", qry.formview.objs["qry1.expense_ac"].obj, undefined, that.frm.objs["qry1.expensename"].obj);
                        // UtilGen.Search.getLOVSearchField("select max(title) from accostcent1 where code = :CODE ", qry.formview.objs["qry1.costcent"].obj, undefined, that.frm.objs["qry1.costcentname"].obj);
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
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    // if (qry.name == "qry1") {
                    //     var par = that.frm.getFieldValue("qry1.parentcostcent");
                    //     var ac = that.frm.getFieldValue("qry1.code");
                    //     if (!that.canAcParent(par))
                    //         FormView.err(that.errStr);
                    //     sqlRow["path"] = Util.quoted(that.generateAcPath(par, ac));
                    // }

                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        var dt = (new Date()).setHours(0, 0, 0, 0);
                        that.frm.setFieldValue("pac", "", "", true);
                        that.frm.setFieldValue("qry1.lv_type", "CL", "CL", true);
                        var kf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from C7HR_REQ_LEAVE");
                        that.frm.setFieldValue("qry1.lv_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.tot_wo", 0, 0, true);
                        that.frm.setFieldValue("qry1._tot_ph", 0, 0, true);
                        that.frm.setFieldValue("qry1._req_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.request_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.start_date", dt, dt, true);
                        that.frm.setFieldValue("qry1.keyfld", kf, kf, true);
                        that.frm.setFieldValue("qry1._status", that.statusDescr["REQUEST"], that.statusDescr["REQUEST"], true);

                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        that.view.byId("numtxt" + thatForm.timeInLong).setText("");
                    }
                },
                beforeDeleteValidate: function (frm) {
                    var qry = that.frm.objs["qry1"];
                    if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        (qry.status == FormView.RecordStatus.VIEW)) {
                        var valx = that.frm.getFieldValue("pac");
                        var no = that.frm.getFieldValue("qry1.keyfld");
                        var vldtt = Util.getSQLValue(
                            "select nvl(max(emp_cd),-1) from c7hr_emp where (" +
                            " sponsor_id=" + no + " ) "
                        );
                        if (Util.nvl(vldtt, -1) >= 0)
                            FormView.err("Err ! , Found in emp # " + vldtt);

                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {

                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    return params;
                }

            };
        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            function getEmpCode(cod, nm) {
                var ordref = cod || "qry1.emp_code";
                var ordrefnm = nm || "qry1._pname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: that,
                    code: ordref,
                    name: ordrefnm,
                    sqlChange: "select name1 name from c7hr_emp where flag=1 and emp_cd = ':CODE'",
                    sqlList: "select emp_cd code,name1 title,name2 from c7hr_emp where  flag=1 order by emp_cd ",
                    sqlListChange: "select emp_cd code,name1 title from c7hr_emp where emp_cd=:CODE and flag=1",
                });
            }

            // keyfld,status,15,10,10,15            attachment,15,35
            // lv_type,15,35                        request_days,15,35
            // start_date,15,35                     end_date,15,35
            // addr_absent,15,35                    tel_absent,15,35
            // contact_emp,_cname,15,10,25          supervisor_emp,_sname,15,10,25        
            // remarks,15,85
            // inc_ph,inc_wo,15,5,15,5,
            //                          _days,65,35
            //                          _requestdays,65,35
            //                          tot_ph,65,35
            //                          tot_WO,65,35
            //                          netleavedays,65,35
            return {
                //1
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                _status: FormView.getFactoryFields.getGeneralField(
                    "_status", "@", "currentStatus", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                    }
                }),
                attachment: FormView.getFactoryFields.getGeneralField(
                    "attachment", "@", "Attachment", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    showValueHelp: true,
                    change: function () {
                    }
                }),
                //2
                emp_code: FormView.getFactoryFields.getGeneralField(
                    "emp_code", "", "txtCode", "15%", "redText boldText", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, getEmpCode()),
                _pname: FormView.getFactoryFields.getGeneralField(
                    "_pname", "@", "", "0px", "", "50%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {}),
                //3
                lv_type: FormView.getFactoryFields.getComboField(
                    "lv_type", "", "lvType",
                    "15%", "", "35%",
                    {
                        list: "@AL/Annual Leave,CL/Casual Leave,SL/Sick Leave",
                        require: true
                    }, {
                    selectionChange: function () {
                    }
                }),
                request_days: FormView.getFactoryFields.getNumberField(
                    "request_days", "@", "lvRequestDays", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: "#,##0"
                    }, {
                    change: function () {
                        var val = Util.extractNumber(this.getValue());
                        that.frm.setFieldValue("qry1._req_days", val, val, true);
                        var startdt = that.frm.getFieldValue("qry1.start_date");
                        that.frm.setFieldValue("qr1.end_date", null, null, true);
                        if (startdt) {
                            var endt = new Date(startdt.getTime() + (val * 86400000));
                            that.frm.setFieldValue("qry1.end_date", endt, endt, true);
                        }

                    }
                })
                ,
                //4
                start_date: FormView.getFactoryFields.getDateField(
                    "start_date", "", "startDate", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {
                    change: function () {
                        var startdt = that.frm.getFieldValue("qry1.start_date");
                        if (startdt) {
                            var val = Util.extractNumber(that.frm.getFieldValue("qry1.request_days"));
                            var endt = new Date(startdt.getTime() + (val * 86400000));
                            that.frm.setFieldValue("qry1.end_date", endt, endt, true);
                        }
                    }
                })
                ,
                end_date: FormView.getFactoryFields.getDateField(
                    "end_date", "@", "toDate", "15%", "", "35%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: false
                    }, {})
                ,
                //5
                addr_absent: FormView.getFactoryFields.getGeneralField(
                    "addr_absent", "", "txtAddr", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {})
                ,
                tel_absent: FormView.getFactoryFields.getGeneralField(
                    "tel_absent", "@", "txtTel", "15%", "", "35%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {})
                ,
                //6
                contact_emp: FormView.getFactoryFields.getGeneralField(
                    "contact_emp", "", "contactEmp", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, getEmpCode("qry1.contact_emp", "qry1._cname"))
                ,
                _cname: FormView.getFactoryFields.getGeneralField(
                    "_cname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {})
                ,
                supervisor_emp: FormView.getFactoryFields.getGeneralField(
                    "supervisor_emp", "@", "superVisor", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, getEmpCode("qry1.supervisor_emp", "qry1._sname"))
                ,
                _sname: FormView.getFactoryFields.getGeneralField(
                    "_sname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    }, {})
                ,
                //7
                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "", "txtRemark", "15%", "", "85%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {
                    }
                })
                ,
                inc_ph: FormView.getFactoryFields.getGeneralField(
                    "inc_ph", "", "incHRPH", "25%", "", "5%",
                    {
                        class_name: FormView.ClassTypes.CHECKBOX,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        trueValues: ["Y", "N"]
                    }, {
                    trueValues: ["Y", "N"],
                    change: function () {
                    }
                })
                ,
                inc_wo: FormView.getFactoryFields.getGeneralField(
                    "inc_wo", "@", "incHRWO", "25%", "", "5%",
                    {
                        class_name: FormView.ClassTypes.CHECKBOX,
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        trueValues: ["Y", "N"]
                    }, {
                    trueValues: ["Y", "N"],
                    change: function () {
                    }
                })
                ,
                //8
                _lbldays: FormView.getFactoryFields.getTextField("_lbldays", "", "Days", "100%", "qrGroup", {}, {})
                ,
                //9
                _req_days: FormView.getFactoryFields.getNumberField(
                    "_req_days", "", "lvRequestDays", "65%", "", "35%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "",
                        display_format: "#,##0"
                    }, {
                    change: function () {

                    }
                })
                ,
                //10
                tot_ph: FormView.getFactoryFields.getNumberField(
                    "_tot_ph", "", "lvTotPH", "65%", "", "35%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "",
                        display_format: "#,##0"
                    }, {
                    change: function () {

                    }
                })
                ,
                //11
                tot_wo: FormView.getFactoryFields.getNumberField(
                    "tot_wo", "", "lvTotWO", "65%", "", "35%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "",
                        display_format: "#,##0"
                    }, {
                    change: function () {

                    }
                })
                ,
                //13
                lv_days: FormView.getFactoryFields.getNumberField(
                    "lv_days", "", "lvNetDaysReq", "65%", "", "35%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "",
                        display_format: "#,##0"
                    }, {
                    change: function () {

                    }
                })

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
                },
                {
                    name: "cmdNew",
                    canvas: "default_canvas",
                    title: "New..",
                    onPress: function (e) {
                        that2.frm.setFieldValue("pac", "", "", true);
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
            ]
        },
        getLists: function () {
            var that2 = this.thatForm;
            return [
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
                            colname: "NAME1",
                        },
                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: `select l.keyfld,l.emp_code,e.name1,l.status,l.request_days,l.start_date,l.remarks 
                        from c7hr_req_leave l,c7hr_emp e where e.emp_cd=l.emp_code order by l.keyfld desc`,
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ]

        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var dtfmt = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var kf = thatForm.frm.getFieldValue("qry1.keyfld");
            var errObj = function (msg, obj) {
                var o = thatForm.frm.objs[obj].obj;
                UtilGen.errorObj(o, 3500);
                if (o instanceof sap.m.InputBase)
                    o.focus();
                FormView.err(msg);

            };
            var validateEmp = function (fldAcc, pFlg) {
                var flg = Util.nvl(flg, "");
                var cod = thatForm.frm.getFieldValue(fldAcc);
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c7hr_emp where " + flg + " emp_cd='" + cod + "'");
                if (sqcnt == 0) errObj("Save Denied : EMPLOYEE  is invalid OR NOT PRESENT !", fldAcc);
            }

            validateEmp("qry1.emp_code", " flag=1 ");
            if (thatForm.frm.getFieldValue("qry1.contact_emp"))
                validateEmp("qry1.contact_emp", " flag>0 ");
            if (thatForm.frm.getFieldValue("qry1.supervisor_emp", " flag>0 "))
                validateEmp("qry1.supervisor_emp");

            var rd = Util.extractNumber(thatForm.frm.getFieldValue("qry1.request_days"));
            if (rd <= 0) errObj("Err! Invalid Days ! ", "qry1.request_days");

            // allowing only start date to be after attend date or join date
            var last_dt = Util.getSQLValue(("select c7hr_get_last_date_trans(':emp_code') " +
                "from dual ").replaceAll(":emp_code", thatForm.frm.getFieldValue("qry1.emp_code")));
            if (!last_dt) FormView.err("Err ! , no last day of attend or Join date found for this employee !")
            last_dt = new Date(last_dt.replaceAll(".", ":"));
            var sd = thatForm.frm.getFieldValue("qry1.start_date");
            if (!sd) FormView.err("Start Date must have value !");
            if (sd.getTime() <= last_dt)
                errObj("start date cant be less than attend or " +
                    " join day for this employee # " + dtfmt.format(last_dt), "qry1.start_date");

            //check if employee have previous request but not returned.
            var cntExistBefore = Util.getSQLValue(`select nvl(count(*),0) from 
                c7hr_req_leave where  status not in ('RETURNED') and keyfld!=:keyfld and emp_code=':emp' `
                .replaceAll(":keyfld", kf)
                .replaceAll(":emp", thatForm.frm.getFieldValue("qry1.emp_code")));
            if (cntExistBefore > 0) FormView.err("Err ! , this employee have alredy request before and may have not returned");
        },
    }

});



