sap.ui.jsfragment("bin.forms.hr.hemp", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
        this.isDialog = false;
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
        this.joApp.onWndClose = function () {
            if (that.infoObjs["imageurl"] != undefined)
                URL.revokeObjectURL(that.infoObjs["imageurl"]);
            sap.m.MessageToast.show("clearing image url...");
        };
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
                title: Util.getLangText("hrEmpMaster"),
                toolbarBG: "#fff0f5",
                // formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                formSetting: FormView.getDefaultHeadCSS("jvForm", undefined, 500),
                customDisplay: function (vbHeader) {
                    var ly = thatForm.helperFunc.getHeaderLayout();
                    vbHeader.addItem(ly);
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
                        dml: "select *from c7hr_emps where code=':pac'",
                        where_clause: " code=':code'",
                        update_exclude_fields: ["sponsorname", "deptname", "mgr_empname"],
                        insert_exclude_fields: ["sponsorname", "deptname", "mgr_empname"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                        },
                        update_default_values: {},
                        table_name: "c7hr_emps",
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
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("code"));
                    if (qry.name == "qry1") {
                        thatForm.helperFunc.qryEmpPic("EMP_PICS", thatForm.frm.getFieldValue("qry1.code"));
                        thatForm.helperFunc.dispInfos();
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
                    if (qry.name == "qry1") {
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("code"));
                        thatForm.helperFunc.saveEmpPic();
                    }
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
                        that.frm.setFieldValue("pac", "", "", true);
                        thatForm.helperFunc.dispInfos();
                        // that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        // that.view.byId("numtxt" + thatForm.timeInLong).setText("");
                    }
                },
                afterEditRow(qry, index, ld) {
                    thatForm.helperFunc.dispInfos();
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
                    var delAdd = "";
                    if (qry.name == "qry1") {
                        delAdd += "delete from c7_attach where kind_of='EMP_PICS' and refer=':qry1.code' ;";
                        // var sqLog = UtilGen.Vouchers.getInsertLogFuncStr(that2, "JV", that2.vars.vou_code, that2.vars.type, "ACVOUCHER1", "DELETED");
                    }

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
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();

            var getSettingsDept = function () {
                var ordref = "qry1.dept_id";
                var ordrefnm = "qry1.deptname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    getBtns: undefined,
                    sqlChange: "select deptno,",
                    sqlList: "",
                    sqlListChange: "",
                });
            }
            var getSettingsSponsor = function () {
                var ordref = "qry1.sponsor_id";
                var ordrefnm = "qry1.sponsorname";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    getBtns: undefined,
                    sqlChange: "select deptno,",
                    sqlList: "",
                    sqlListChange: "",
                });
            }

            // keyfld,15,15 ,
            // emp_cd 15,20 ,            dept_id,deptname,status,15,30,5
            // aname1,aname2,aname3,aname4,aname5, 15,17
            // lname1,lname2,lname3,aname4,aname5  15, 17
            // gender,dob,15,10,10,15   nation,15,35
            // mar_stat,religion,,15,10,10,15   mob_no,15,35
            // email_per,15,35             addr_cur,15,35                    
            // 
            // Visa
            // visa_typ, visa_no,15,10,10,15     civil_id 15,35
            // res_iss_dt,res_exp_dt,15,10,10,15,  res_year,res_no,15,10,10,15
            // sponsor_id,sponsor_name,15,10,25            
            // 
            // Employement
            // dt_join,emp_type, 15,15,10,10,  mgr_emp_id,mgr_name, 15,10,25
            // job_tit,15,35                job_desc,15,35
            // salary:
            // basic_amt,15,35,         pay_mode,15,35
            // lbl_allowances,lbl_amount, 25,20
            // hra_amt,25,20
            // trns_amt,25,20
            // food_amt,25,20
            // oth_amt,25,20
            // _totamt,15,20
            //
            return {
                // sn: { ...FormView.getFactoryFields.getKeyFld("", "15%", "10%"), ...{ colname: "sn", } },
                emp_cd: FormView.getFactoryFields.getGeneralField(
                    "emp_cd", "", "txtCode", "15%", "redText boldText", "20%",
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
                dept_id: FormView.getFactoryFields.getGeneralField(
                    "dept_id", "@", "txtDept", "15%", "redText boldText", "15%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, getSettingsDept()),

                deptname: FormView.getFactoryFields.getGeneralField(
                    "deptname", "@", "", "0px", "", "30%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    },
                ),
                status: FormView.getFactoryFields.getGeneralField(
                    "status", "@", "", "0px", "redText boldText", "5%",
                    {
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "redText boldText"
                    }, {
                    change: function () {
                        // thatForm.helperFunc.fetchItem(false);
                    }

                }),
                aname1: FormView.getFactoryFields.getGeneralField(
                    "aname1", "", "", "15%", "txtName", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                aname2: FormView.getFactoryFields.getGeneralField(
                    "aname2", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                aname3: FormView.getFactoryFields.getGeneralField(
                    "aname3", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                aname4: FormView.getFactoryFields.getGeneralField(
                    "aname4", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                aname5: FormView.getFactoryFields.getGeneralField(
                    "aname5", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                lname1: FormView.getFactoryFields.getGeneralField(
                    "lname1", "", "", "15%", "txtName2", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                lname2: FormView.getFactoryFields.getGeneralField(
                    "lname2", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                lname3: FormView.getFactoryFields.getGeneralField(
                    "lname3", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                lname4: FormView.getFactoryFields.getGeneralField(
                    "lname4", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                lname5: FormView.getFactoryFields.getGeneralField(
                    "lname5", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                gender: FormView.getFactoryFields.getComboField(
                    "gender", "", "txtGender",
                    "15%", "", "10%",
                    {
                        list: "@male/txtMale,female/txtFemale",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectionChange: function () {
                    }
                }),
                dob: FormView.getFactoryFields.getDateField(
                    "dob", "@", "txtDob", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                nation: FormView.getFactoryFields.getComboField(
                    "nation", "@", "txtNation",
                    "15%", "", "35%",
                    {
                        list: "select name code,name from relists where idlist='NATION' order by name",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectionChange: function () {
                    }
                }),
                email_per: FormView.getFactoryFields.getGeneralField(
                    "email_per", "", "txtEmail", "15%", "", "35%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                addr_cur: FormView.getFactoryFields.getGeneralField(
                    "addr_cur", "@", "txtAddressCurr", "15%", "", "35%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                _lblLv1: FormView.getFactoryFields.getTextField("_lblLv1", "", "", "100%", "", {}, {}),
                _titVisa: FormView.getFactoryFields.getGeneralField(
                    "_titVisa", "", "titVisa", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "Begin"),
                _lblLv2: FormView.getFactoryFields.getTextField("_lblLv2", "", "", "100%", "", {}, {}),
                visa_typ: FormView.getFactoryFields.getComboField(
                    "visa_typ", "", "txtVisaType",
                    "15%", "", "10%",
                    {
                        list: "@18/18,20/20,22/22",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectedKey: '18',
                    selectionChange: function () {
                    }
                }),
                visa_no: FormView.getFactoryFields.getGeneralField(
                    "visa_no", "@", "txtVisaNo", "10%", "", "15%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                ),
                civil_id: FormView.getFactoryFields.getGeneralField(
                    "civil_id", "@", "txtCivilId", "15%", "", "35%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            var c = this;
                            if (c.getValue().length > 0 &&
                                c.getValue().length != 12
                            )
                                setTimeout(() => { c.focus(); FormView.err("Below 12 digits") }, 100);
                        }
                    }
                ),
                res_iss_dt: FormView.getFactoryFields.getDateField(
                    "res_iss_dt", "", "txtResIssDt", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                res_exp_dt: FormView.getFactoryFields.getDateField(
                    "res_exp_dt", "@", "txtResExpDt", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                res_year: FormView.getFactoryFields.getComboField(
                    "res_year", "@", "txtResYear",
                    "15%", "", "10%",
                    {
                        list: "@1/1,2/2,3/3,4/4,5/5",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectedKey: '1',
                    selectionChange: function () {
                    }
                }),
                res_no: FormView.getFactoryFields.getGeneralField(
                    "res_no", "@", "txtResNo", "10%", "", "15%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            var c = this;
                            if (c.getValue().length > 0 &&
                                c.getValue().length != 9
                            )
                                setTimeout(() => { c.focus(); FormView.err("Below 9 digits") }, 100);
                        }
                    }
                ),
                sponsor_id: FormView.getFactoryFields.getGeneralField(
                    "sponsor_id", "", "txtSponsor", "15%", "", "10%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, getSettingsSponsor()),
                sponsorname: FormView.getFactoryFields.getGeneralField(
                    "sponsorname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    },
                ),
                _lblLv3: FormView.getFactoryFields.getTextField("_lblLv3", "", "", "100%", "", {}, {}),
                _titEmployement: FormView.getFactoryFields.getGeneralField(
                    "_titEmployement", "", "titEmployment", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "Begin"),
                _lblLv4: FormView.getFactoryFields.getTextField("_lblLv4", "", "", "100%", "", {}, {}),
                dt_join: FormView.getFactoryFields.getDateField(
                    "dt_join", "", "txtJoinDate", "15%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true
                    }, {}),
                emp_type: FormView.getFactoryFields.getComboField(
                    "emp_type", "@", "txtEmpType",
                    "10%", "", "10%",
                    {
                        list: "@permanent/txtPermanent,contract/txtContract",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectedKey: '1',
                    selectionChange: function () {
                    }
                }),
                mgr_emp_id: FormView.getFactoryFields.getGeneralField(
                    "mgr_emp_id", "@", "txtManager", "15%", "", "10%",
                    {
                        require: true,
                        edit_allowed: false,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, getSettingsSponsor()),
                mgr_empname: FormView.getFactoryFields.getGeneralField(
                    "mgr_empname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                    },
                ),
                nation: FormView.getFactoryFields.getComboField(
                    "nation", "@", "txtJobTitle",
                    "15%", "", "35%",
                    {
                        list: "select name code,name from relists where idlist='JOBS' order by name",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectionChange: function () {
                    }
                }),
                job_desc: FormView.getFactoryFields.getGeneralField(
                    "job_desc", "", "txtJobDescr", "15%", "", "35%",
                    {
                        class_name: FormView.ClassTypes.TEXTAREA,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        rows: 2
                    }
                ),
                _lblLv5: FormView.getFactoryFields.getTextField("_lblLv5", "", "", "100%", "", {}, {}),
                _titSalary: FormView.getFactoryFields.getGeneralField(
                    "_titSalary", "", "titSalary", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "Begin"),
                _lblLv6: FormView.getFactoryFields.getTextField("_lblLv6", "", "", "100%", "", {}, {}),
                basic_amt: FormView.getFactoryFields.getGeneralField(
                    "basic_amt", "", "txtBasicSalary", "15%", "", "35%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),
                pay_mode: FormView.getFactoryFields.getComboField(
                    "pay_mode", "@", "txtPayMode",
                    "15%", "", "35%",
                    {
                        list: "@bank/txtBank,cash/txtCash",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                    }, {
                    selectedKey: "bank",
                    selectionChange: function () {
                    }
                }),
                _titAllowance: FormView.getFactoryFields.getGeneralField(
                    "_titAllowance", "", "titAllowances", "25%", "", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "End"),
                _titAmt: FormView.getFactoryFields.getGeneralField(
                    "_titAmt", "@", "amountTxt", "20%", "", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                    }, {}, "End"),
                hra_amt: FormView.getFactoryFields.getGeneralField(
                    "hra_amt", "", "txtAllowHouse", "25%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),
                trns_amt: FormView.getFactoryFields.getGeneralField(
                    "trns_amt", "", "txtAllowTrans", "25%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),
                food_amt: FormView.getFactoryFields.getGeneralField(
                    "food_amt", "", "txtAllowFood", "25%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),
                oth_amt: FormView.getFactoryFields.getGeneralField(
                    "oth_amt", "", "txtAllowOther", "25%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),
                _totamt: FormView.getFactoryFields.getGeneralField(
                    "_totamt", "", "totalTxt", "25%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "totInput",
                        display_format: sett["FORMAT_MONEY_1"],
                    },
                ),

            };
        },
        getCommands: function () {
            var that2 = this.thatForm;
            return [
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
                    name: "cmdPrint",
                    canvas:
                        "default_canvas",
                    title:
                        "SOA",
                    onPress:

                        function (e) {
                            var ac = that2.frm.getFieldValue("pac");
                            UtilGen.execCmd("testRep5 formType=dialog repno=0 para_PARAFORM=false para_EXEC_REP=true costcent=" + ac + " fromdate=@01/01/2020", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage);
                            return true;
                        }
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
                            colname: 'CODE',
                            return_field: "pac",
                        },
                        {
                            colname: "TITLE",
                        },
                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select *from c7hr_emps order by code",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ]

        },
        getHeaderLayout: function () {
            var thatForm = this.thatForm;
            Util.destroyID("empImage" + thatForm.timeInLong, thatForm.view);
            // Util.destroyID("" + thatForm.timeInLong, thatForm.view);
            var uploadPhoto = function () {
                var qry = thatForm.frm.objs["qry1"];
                if (qry.status == FormView.RecordStatus.VIEW)
                    FormView.err("Form is not EDIT or NEW mode !");

                // fu.openFileDialog();
                var oInput = fu.getFocusDomRef();
                if (oInput) {
                    oInput.click();
                }
            };
            var fu = new sap.ui.unified.FileUploader(thatForm.view.createId("uploader" + thatForm.timeInLong), {
                visible: true,
                fileType: ["jpg", "jpeg"],
                mimeType: ["image/jpeg"],
                change: function (oEvent) {
                    onPhotoSelected(oEvent);
                },
                beforeDialogOpen: function (para) {
                    var qry = thatForm.frm.objs["qry1"];
                    if (qry.status == FormView.RecordStatus.VIEW) {
                        FormView.err("Form must be in EDIT/NEW mode !");
                        return false;
                    }
                    return true;
                }
            });

            var oPhoto = new sap.m.Image(thatForm.view.createId("empImage" + thatForm.timeInLong), {
                src: "images/no_profile.jpg",
                width: "150px",
                height: "150px",
                densityAware: false,
                decorative: true,
                press: function () {
                    uploadPhoto();
                }
            }).addStyleClass("");
            var oPhotoBox = new sap.m.VBox({
                width: "20%",
                alignItems: "Center",
                items: [oPhoto, fu]
            }).addStyleClass("sapUiTinyMargin");

            var oInfoBox = new sap.m.VBox({
                width: "80%",
                items: []
            }).addStyleClass("empInfoBox sapUiTinyMargin");

            var oMainLayout = new sap.m.HBox({
                width: "100%",
                items: [
                    oInfoBox,
                    oPhotoBox
                ]
            });
            var onPhotoSelected = function (oEvent) {
                var oFile = oEvent.getParameter("files")[0];
                if (!oFile) {
                    return;
                }

                // Validate JPG
                if (!oFile.type.match("image/jpeg")) {
                    MessageToast.show("Please select a JPG image");
                    return;
                }
                if (oFile.size > 1024 * 1024) {
                    sap.m.MessageToast.show("Max file size is 1MB");
                    return;
                }

                var fileUpload = oFile;
                if (thatForm.infoObjs["imageurl"] != undefined)
                    URL.revokeObjectURL(thatForm.infoObjs["imageurl"]);
                thatForm.infoObjs["imageurl"] = URL.createObjectURL(fileUpload);
                thatForm.infoObjs["image"].setSrc(thatForm.infoObjs["imageurl"]);
                thatForm.infoObjs["fileupload"] = fileUpload;

            };

            // 1- code,15,35        name1,15,35
            // 2- job,15,35         name2,15,35
            // 3- dept,15,35        job,15,35
            // 4, join_date         bod,15,35
            var fe = [];
            var txtKeyfld = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "60px", editable: false }).addStyleClass("keyIdText");
            var txtCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "20%", editable: false }).addStyleClass("empInfoValue");
            var txtName1 = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: false }).addStyleClass("empInfoValue");
            var txtEmpJob = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false }).addStyleClass("empInfoValue");
            var txtName2 = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: false }).addStyleClass("empInfoValue");
            var txtEmpDept = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false }).addStyleClass("empInfoValue");
            var fe = [

                Util.getLabelTxt("hrEmpInfo", "15%", "#", "", "Begin"), new sap.m.Text({ text: " keyId # ", width: "50px" }), txtKeyfld,
                Util.getLabelTxt("txtCode", "15%"), txtCode,
                Util.getLabelTxt("txtName", "15%", "@"), txtName1,
                Util.getLabelTxt("txtName2", "50%", ""), txtName2,
                Util.getLabelTxt("txtEmpJob", "15%"), txtEmpJob,
                Util.getLabelTxt("txtEmpDept", "15%", "@"), txtEmpDept,
            ];
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.VBox, {
            }, "sapUiSizeCompact", "");
            // cnt.addContent(new sap.m.VBox({ height: "40px" }));
            oInfoBox.addItem(cnt);

            if (thatForm.infoObjs != undefined && thatForm.infoObjs["imageurl"] != undefined)
                URL.revokeObjectURL(thatForm.infoObjs["imageurl"]);

            thatForm.infoObjs = {
                "keyfld": txtKeyfld,
                "txtCode": txtCode,
                "txtName1": txtName1,
                "txtName2": txtName2,
                "txtEmpJob": txtEmpJob,
                "txtEmpDept": txtEmpDept,
                "image": oPhoto,
                "fu": fu
            };

            return oMainLayout;
        },
        resetInfoObjs: function () {
            var thatForm = this.thatForm;
            if (thatForm.infoObjs == undefined) return;
            var kys = Object.keys(thatForm.infoObjs);
            for (var i in kys)
                if (thatForm.infoObjs[kys[i]] instanceof sap.m.Text)
                    thatForm.infoObjs[kys[i]].setText("");

            if (thatForm.infoObjs != undefined && thatForm.infoObjs["imageurl"] != undefined)
                URL.revokeObjectURL(thatForm.infoObjs["imageurl"]);
            thatForm.infoObjs["image"].setSrc("images/no_profile.jpg");
        },
        qryEmpPic: function (kindof, refer) {
            var thatForm = this.thatForm;
            var qry = thatForm.frm.objs["qry1"];
            // var desc = Util.getSQLValue("select descr from c7_attach where kind_of='" + kindof + "' and refer='" + refer + "'");
            // qry.formview.setFieldValue("attachment", desc);
            Util.doXhr("getAttachVou?kindof=" + kindof + "&refer=" + refer, true, function (e) {
                if (this.status == 200 && this.response.byteLength > 0) {
                    var fileUpload = new Blob([this.response], { type: "image/jpeg" });
                    if (thatForm.infoObjs["imageurl"] != undefined)
                        URL.revokeObjectURL(thatForm.infoObjs["imageurl"]);
                    thatForm.infoObjs["imageurl"] = URL.createObjectURL(fileUpload);
                    thatForm.infoObjs["image"].setSrc(thatForm.infoObjs["imageurl"]);
                    thatForm.infoObjs["fileupload"] = fileUpload;
                }
            });

        },
        saveEmpPic: function () {
            var thatForm = this.thatForm;
            var qry = thatForm.frm.objs["qry1"];
            if (thatForm.infoObjs["fileupload"] == undefined)
                return;
            if (qry.status == FormView.RecordStatus.VIEW)
                return;
            var refer = thatForm.frm.getFieldValue("qry1.code");
            var fileUpload = thatForm.infoObjs["fileupload"];
            Util.doXhrUpdateVouAttach("uploadAttachPdfVou",
                true, fileUpload, refer, "", "EMP_PICS");
        },
        dispInfos: function () {
            var thatForm = this.thatForm;
            if (thatForm.infoObjs == undefined)
                return;
            var qry = thatForm.frm.objs["qry1"];
            thatForm.infoObjs["fu"].setEnabled(true);
            this.resetInfoObjs();
            if (qry.status == FormView.RecordStatus.VIEW) {
                thatForm.infoObjs["fu"].setEnabled(false);
            }
            thatForm.infoObjs["txtCode"].setText(thatForm.frm.getFieldValue("code"));
            thatForm.infoObjs["txtName1"].setText(thatForm.frm.getFieldValue("name"));
        }
    },

});



