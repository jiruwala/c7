sap.ui.jsfragment("bin.forms.hr.hemp", {
// test 2
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
        this.isDialog = false;
        this.status = {
            "-8": "txtSuspended",
            "-9": "txtTerminated",
            "0": "txtNotActive",
            "1": "txtActPresent",
            "2": "txtActPaidLeave",
            "3": "txtActUnPaidLeave"
        };
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };
        this.joApp = new sap.m.SplitApp({ height: "80%", mode: sap.m.SplitAppMode.HideMode });
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
            enableScrolling: true,
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

        this.mainPage.addEventDelegate({
            onAfterRendering: function () {
                that.mainPage.$().find("input, textarea, select, button").on("focus", function (e) {

                    var oInput = e.target;

                    setTimeout(function () {

                        var oPage = that.sc;

                        var pageDom = oPage.$()[0];   // page content area
                        var pageRect = pageDom.getBoundingClientRect();

                        var inputRect = oInput.getBoundingClientRect();

                        var isVisible =
                            inputRect.top >= pageRect.top &&
                            inputRect.bottom <= pageRect.bottom - 180;

                        if (!isVisible) {
                            oPage.scrollToElement(oInput, 300);
                        }

                    }, 100);

                });
            }
        });

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
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                mainCanvas: sap.m.VBox,
                customDisplay: function (vbHeader) {
                    var ly = thatForm.helperFunc.getHeaderLayout();
                    // thatForm.sc = new sap.m.ScrollContainer({
                    //     vertical: true,
                    //     height: "auto",   // IMPORTANT
                    //     layoutData: new sap.m.FlexItemData({
                    //         growFactor: 1
                    //     }),
                    // });
                    thatForm.tabs = {
                        "default_canvas": new sap.m.VBox({ vertical: true }),
                        "tabVisa": new sap.m.VBox({ vertical: true }),
                        "tabEmp": new sap.m.VBox({ vertical: true }),
                        "tabSal": new sap.m.VBox({ vertical: true }),
                    };



                    vbHeader.addItem(ly);
                    setTimeout(() => {
                        var oPage = that.mainPage;
                        var pageDom = oPage.$("cont")[0];   // page content area
                        var pageRect = pageDom.getBoundingClientRect();
                        var lyout = thatForm.view.byId("layoutInfo" + thatForm.timeInLong);
                        var lyoutRect = (lyout.$()[0]).getBoundingClientRect();
                        var h = Math.round(pageRect.height - lyoutRect.height) - 100;

                        thatForm.sc = new sap.m.TabContainer({
                            // height: h + "px",
                            editable: false,
                            fitContainer: true,
                            showAddNewButton: false,
                            items: [
                                new sap.m.TabContainerItem({
                                    name: Util.getLangText("Master Data"),
                                    content: [thatForm.tabs["default_canvas"]]
                                }),
                                new sap.m.TabContainerItem({
                                    name: Util.getLangText("titVisa"),
                                    content: [thatForm.tabs["tabVisa"]]
                                }),
                                new sap.m.TabContainerItem({
                                    name: Util.getLangText("titEmployment"),
                                    content: [thatForm.tabs["tabEmp"]]
                                }),
                                new sap.m.TabContainerItem({
                                    name: Util.getLangText("titSalary"),
                                    content: [thatForm.tabs["tabSal"]]
                                }),

                            ]
                        }).addStyleClass("noTabClose");

                        thatForm.mainPage.addContent(
                            new sap.m.Panel({
                                height: h + "px",
                                vertical: true,
                                content: thatForm.sc
                            })
                        );
                        // thatForm.sc.setHeight(h + "px");
                        var kys = Object.keys(thatForm.tabs);
                        // for (var k in kys)
                        //     thatForm.tabs[k].setHeight(h + "px");

                    });
                },
                fixedDisplay: function (vbHeader) {
                    // var ly = thatForm.helperFunc.getHeaderLayout();
                    // vbHeader.addItem(ly);
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
                        dml: "select *from c7hr_emp where emp_cd=':pac'",
                        where_clause: " emp_cd=':emp_cd'",
                        update_exclude_fields: ["sponsorname", "deptname", "mgr_empname", "keyfld"],
                        insert_exclude_fields: ["sponsorname", "deptname", "mgr_empname"],
                        insert_default_values: {
                            // "CREATDT": "sysdate",
                            // "USERNM": Util.quoted(sett["LOGON_USER"]),
                            // "TYPE": 3
                            "NAME1": "trim(':qry1.aname1 :qry1.aname2  :qry1.aname3 :qry1.aname4 :qry1.aname5')",
                            "NAME2": "trim(':qry1.lname1 :qry1.lname2  :qry1.lname3 :qry1.lname4 :qry1.lname5')",
                            "KEYFLD": "(select nvl(max(keyfld),0)+1 from c7hr_emp) "
                        },
                        update_default_values: {
                            "NAME1": "trim(':qry1.aname1 :qry1.aname2  :qry1.aname3 :qry1.aname4 :qry1.aname5')",
                            "NAME2": "trim(':qry1.lname1 :qry1.lname2  :qry1.lname3 :qry1.lname4 :qry1.lname5')",
                        },
                        table_name: "c7hr_emp",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    }
                ],
                canvas: [
                    {
                        name: "default_canvas",
                        objType: FormView.ObjTypes.CANVAS,
                        classType: sap.m.VBox,
                        formSetting: {
                            width: { "S": 400, "M": 700, "L": 800, "XL": 900 },
                        },
                        container: function (dp) {
                            return thatForm.tabs["default_canvas"];
                        }
                    },
                    {
                        name: "tabVisa",
                        objType: FormView.ObjTypes.CANVAS,
                        classType: sap.m.VBox,
                        formSetting: {
                            width: { "S": 400, "M": 700, "L": 800, "XL": 900 },
                        },
                        container: function (dp) {
                            return thatForm.tabs["tabVisa"];
                        }
                    },
                    {
                        name: "tabEmp",
                        objType: FormView.ObjTypes.CANVAS,
                        classType: sap.m.VBox,
                        formSetting: {
                            width: { "S": 400, "M": 700, "L": 800, "XL": 900 },
                        },
                        container: function (dp) {
                            return thatForm.tabs["tabEmp"];
                        }
                    },
                    {
                        name: "tabSal",
                        objType: FormView.ObjTypes.CANVAS,
                        classType: sap.m.VBox,
                        formSetting: {
                            width: { "S": 400, "M": 700, "L": 800, "XL": 900 },
                        },
                        container: function (dp) {
                            return thatForm.tabs["tabSal"];
                        }
                    }

                ],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getLists(),
            }
        }
            ;

        // var ly = thatForm.helperFunc.getHeaderLayout();
        // this.mainPage.addContent(ly);
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
        // this.cs.code = UtilGen.addControl(fe, "emp_cd", sap.m.Input, "Cs" + this.timeInLong + "_",
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
                    // thatForm.frm.setFieldValue("pac", thatForm.frm.getFieldValue("qry1.emp_cd"));
                },
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("emp_cd"));
                    if (qry.name == "qry1") {
                        UtilGen.Search.getLOVSearchField("select title name from c7hr_dept where deptno = ':CODE' ", qry.formview.objs["qry1.dept_id"].obj, undefined, that.frm.objs["qry1.deptname"].obj);
                        UtilGen.Search.getLOVSearchField("select comp_name name from c7hr_sponsor where spn_no = ':CODE' ", qry.formview.objs["qry1.sponsor_id"].obj, undefined, that.frm.objs["qry1.sponsorname"].obj);

                        thatForm.helperFunc.qryEmpPic("EMP_PICS", thatForm.frm.getFieldValue("qry1.emp_cd"));
                        thatForm.helperFunc.dispInfos(qry);
                        thatForm.helperFunc.calcTotSalary();
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
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("emp_cd"));
                        // var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7hr_emp");
                        // qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);                        
                        // thatForm.infoObjs["keyfld"].setText(kfld);
                        thatForm.helperFunc.saveEmpPic();
                        var cod = qry.formview.getFieldValue("emp_cd");
                        var mgr = Util.nvl(qry.formview.getFieldValue("mgr_emp_id"), "");
                        if (mgr != "" && mgr == cod) {
                            FormView.err("Err !, Manager ID and Employee cant be same !");
                        }
                    }
                    //     var par = that.frm.getFieldValue("qry1.parentcostcent");
                    //     var ac = that.frm.getFieldValue("qry1.emp_cd");
                    //     if (!that.canAcParent(par))
                    //         FormView.err(that.errStr);
                    //     sqlRow["path"] = Util.quoted(that.generateAcPath(par, ac));
                    // }

                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        that.frm.setFieldValue("pac", "", "", true);
                        thatForm.helperFunc.dispInfos(qry);
                        qry.formview.setFieldValue("qry1.visa_typ", "18", "18", true);
                        qry.formview.setFieldValue("qry1.res_year", "1", "1", true);
                        qry.formview.setFieldValue("qry1.emp_type", "permanent", "permanent", true);
                        qry.formview.setFieldValue("qry1.basic_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry1.hra_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry1.trns_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry1.food_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry1.oth_amt", 0, 0, true);
                        qry.formview.setFieldValue("qry1._totamt", 0, 0, true);
                        qry.formview.setFieldValue("qry1.pay_mode", "bank", "bank", true);
                        qry.formview.setFieldValue("qry1.gender", "male", "male", true);
                        qry.formview.setFieldValue("qry1.visa_typ", "18", "18", true);

                        var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7hr_emp");
                        if (thatForm.infoObjs != undefined && thatForm.infoObjs["keyfld"] != undefined)
                            thatForm.infoObjs["keyfld"].setText(kfld);
                        if (thatForm.sc != undefined)
                            thatForm.sc.setSelectedItem(thatForm.sc.getItems()[0]);
                    }
                },
                afterEditRow(qry, index, ld) {
                    if (qry.name == "qry1")
                        thatForm.helperFunc.dispInfos(qry);
                },
                beforeDeleteValidate: function (frm) {
                    // var qry = that.frm.objs["qry1"];
                    // if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                    //     (qry.status == FormView.RecordStatus.VIEW)) {
                    //     var valx = that.frm.getFieldValue("pac");
                    //     var accno = that.frm.getFieldValue("qry1.emp_cd");
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
                        delAdd += "delete from c7_attach where kind_of='EMP_PICS' and refer=':qry1.emp_cd' ;";
                        // var sqLog = UtilGen.Vouchers.getInsertLogFuncStr(that2, "JV", that2.vars.vou_code, that2.vars.type, "ACVOUCHER1", "DELETED");                    
                    }
                    return delAdd;
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
                    sqlChange: "select title from c7hr_dept where deptno=':CODE' and flag=1",
                    sqlList: "select deptno code,title from c7hr_dept where flag=1 order by deptno ",
                    sqlListChange: "select deptno code,title from C7HR_DEPT where deptno=:CODE and flag=1",
                    fnAfteUpdate: function () {
                        thatForm.helperFunc.dispInfos();
                    }
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
                    sqlChange: "select comp_name title from c7hr_sponsor where spn_no=':CODE' and flag=1",
                    sqlList: "select spn_no code,comp_name title from c7hr_sponsor where flag=1 order by spn_no ",
                    sqlListChange: "select spn_no code,comp_name title from c7hr_sponsor where spn_no=:CODE and flag=1",
                });
            }
            var getSettingsManager = function () {
                var ordref = "qry1.mgr_emp_id";
                var ordrefnm = "qry1.mgr_empname";
                var sqwhere = " ";
                // var qry = thatForm.frm.objs["qry1"];
                // if (qry.status == FormView.RecordStatus.EDIT)
                //     sqwhere = " emp_cd!=:qry1.emp_cd and ";

                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: thatForm,
                    code: Util.nvl(ordref),
                    name: Util.nvl(ordrefnm),
                    getBtns: undefined,
                    sqlChange: "select name1 title from c7hr_emp where " + sqwhere + " emp_cd=':CODE' and flag=1",
                    sqlList: "select emp_cd code,name1 title,name2 from c7hr_emp where  " + sqwhere + " flag=1 order by emp_cd",
                    sqlListChange: "select emp_cd code,name1 title from c7hr_emp where " + sqwhere + " emp_cd=:CODE and flag=1",
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
            // _totamt,25,20
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
                        thatForm.helperFunc.dispInfos();
                    }

                }),
                dept_id: FormView.getFactoryFields.getGeneralField(
                    "dept_id", "@", "txtDept", "15%", "redText boldText", "15%",
                    {
                        require: true,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "redText boldText"
                    }, getSettingsDept()),

                deptname: FormView.getFactoryFields.getGeneralField(
                    "deptname", "@", "", "0px", "", "28%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        keyboardFocus: false,
                    },
                ),
                status: FormView.getFactoryFields.getGeneralField(
                    "status", "@", "", "0px", "redText boldText", "7%",
                    {
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "redText boldText",
                        keyboardFocus: false,

                    }, {
                    change: function () {
                        // thatForm.helperFunc.fetchItem(false);
                    }

                }),
                aname1: FormView.getFactoryFields.getGeneralField(
                    "aname1", "", "txtName", "15%", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    }, {
                    change: function () {
                        thatForm.helperFunc.dispInfos();
                    }
                }
                ),
                aname2: FormView.getFactoryFields.getGeneralField(
                    "aname2", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                aname3: FormView.getFactoryFields.getGeneralField(
                    "aname3", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                aname4: FormView.getFactoryFields.getGeneralField(
                    "aname4", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                aname5: FormView.getFactoryFields.getGeneralField(
                    "aname5", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                lname1: FormView.getFactoryFields.getGeneralField(
                    "lname1", "", "txtName2", "15%", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                lname2: FormView.getFactoryFields.getGeneralField(
                    "lname2", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                lname3: FormView.getFactoryFields.getGeneralField(
                    "lname3", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                lname4: FormView.getFactoryFields.getGeneralField(
                    "lname4", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
                ),
                lname5: FormView.getFactoryFields.getGeneralField(
                    "lname5", "@", "", "0px", "", "17%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: ""
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.dispInfos();
                        }
                    }
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
                // _lblLv1: FormView.getFactoryFields.getTextField("_lblLv1", "", "", "100%", "", {}, {}),
                _titVisa: FormView.getFactoryFields.getGeneralField(
                    "_titVisa", "", "titVisa", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        canvas: "tabVisa"
                    }, {}, "Begin"),
                _lblLv2: FormView.getFactoryFields.getTextField("_lblLv2", "", "", "100%", "", { canvas: "tabVisa" }, {}),
                visa_typ: FormView.getFactoryFields.getComboField(
                    "visa_typ", "", "txtVisaType",
                    "15%", "", "10%",
                    {
                        list: "@18/18,20/20,22/22",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabVisa"
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
                        display_style: "",
                        canvas: "tabVisa"
                    },
                ),
                civil_id: FormView.getFactoryFields.getGeneralField(
                    "civil_id", "@", "txtCivilId", "15%", "", "35%",
                    {
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        canvas: "tabVisa"
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
                        insert_allowed: true,
                        canvas: "tabVisa"
                    }, {}),
                res_exp_dt: FormView.getFactoryFields.getDateField(
                    "res_exp_dt", "@", "txtResExpDt", "10%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabVisa"
                    }, {}),
                res_year: FormView.getFactoryFields.getComboField(
                    "res_year", "@", "txtResYear",
                    "15%", "", "10%",
                    {
                        list: "@1/1,2/2,3/3,4/4,5/5",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabVisa"
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
                        display_style: "",
                        canvas: "tabVisa"
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
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "redText boldText",
                        canvas: "tabVisa"
                    }, getSettingsSponsor()),
                sponsorname: FormView.getFactoryFields.getGeneralField(
                    "sponsorname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        canvas: "tabVisa"
                    },
                ),
                // _lblLv3: FormView.getFactoryFields.getTextField("_lblLv3", "", "", "100%", "", {}, {}),
                _titEmployement: FormView.getFactoryFields.getGeneralField(
                    "_titEmployement", "", "titEmployment", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        canvas: "tabEmp"
                    }, {}, "Begin"),
                _lblLv4: FormView.getFactoryFields.getTextField("_lblLv4", "", "", "100%", "", { canvas: "tabEmp" }, {}),
                dt_join: FormView.getFactoryFields.getDateField(
                    "dt_join", "", "txtJoinDate", "15%", "", "15%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabEmp"
                    }, {}),
                emp_type: FormView.getFactoryFields.getComboField(
                    "emp_type", "@", "txtEmpType",
                    "10%", "", "10%",
                    {
                        list: "@permanent/txtPermanent,contract/txtContract",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabEmp"
                    }, {
                    selectedKey: '1',
                    selectionChange: function () {
                    }
                }),
                mgr_emp_id: FormView.getFactoryFields.getGeneralField(
                    "mgr_emp_id", "@", "txtManager", "15%", "", "10%",
                    {
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "redText boldText",
                        canvas: "tabEmp"
                    }, getSettingsManager()),
                mgr_empname: FormView.getFactoryFields.getGeneralField(
                    "mgr_empname", "@", "", "0px", "", "25%",
                    {
                        require: false,
                        edit_allowed: false,
                        insert_allowed: false,
                        canvas: "tabEmp"
                    },
                ),
                job_tit: FormView.getFactoryFields.getComboField(
                    "job_tit", "", "txtJobTitle",
                    "15%", "", "35%",
                    {
                        list: "select name code,name from relists where idlist='JOBS' order by name",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabEmp"
                    }, {
                    selectionChange: function () {
                        thatForm.helperFunc.dispInfos();
                    }
                }),
                job_desc: FormView.getFactoryFields.getGeneralField(
                    "job_desc", "", "txtJobDescr", "15%", "", "35%",
                    {
                        class_name: FormView.ClassTypes.TEXTAREA,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        canvas: "tabEmp"
                    },
                    {
                        rows: 2
                    }
                ),
                // _lblLv5: FormView.getFactoryFields.getTextField("_lblLv5", "", "", "100%", "", {}, {}),
                _titSalary: FormView.getFactoryFields.getGeneralField(
                    "_titSalary", "", "titSalary", "100%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        canvas: "tabSal"
                    }, {}, "Begin"),
                _lblLv6: FormView.getFactoryFields.getTextField("_lblLv6", "", "", "100%", "", { canvas: "tabSal" }, {}),
                basic_amt: FormView.getFactoryFields.getGeneralField(
                    "basic_amt", "", "txtBasicSalary", "15%", "", "35%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.calcTotSalary();
                        }
                    }
                ),
                pay_mode: FormView.getFactoryFields.getComboField(
                    "pay_mode", "@", "txtPayMode",
                    "15%", "", "35%",
                    {
                        list: "@bank/txtBank,cash/txtCash",
                        require: false,
                        edit_allowed: true,
                        insert_allowed: true,
                        canvas: "tabSal"
                    }, {
                    selectedKey: "bank",
                    selectionChange: function () {
                    }
                }),
                _lblLv7: FormView.getFactoryFields.getTextField("_lblLv7", "", "", "100%", "", { canvas: "tabSal" }, {}),
                _titAllowance: FormView.getFactoryFields.getGeneralField(
                    "_titAllowance", "", "titAllowances", "40%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        canvas: "tabSal"
                    }, {}, "End"),
                _titAmt: FormView.getFactoryFields.getGeneralField(
                    "_titAmt", "@", "amountTxt", "20%", "qrGroup", "0px",
                    {
                        class_name: FormView.ClassTypes.LABEL,
                        canvas: "tabSal"
                    }, {}, "Center"),
                hra_amt: FormView.getFactoryFields.getGeneralField(
                    "hra_amt", "", "txtAllowHouse", "40%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.calcTotSalary();
                        }
                    }
                ),
                trns_amt: FormView.getFactoryFields.getGeneralField(
                    "trns_amt", "", "txtAllowTrans", "40%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.calcTotSalary();
                        }
                    }
                ),
                food_amt: FormView.getFactoryFields.getGeneralField(
                    "food_amt", "", "txtAllowFood", "40%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.calcTotSalary();
                        }
                    }
                ),
                oth_amt: FormView.getFactoryFields.getGeneralField(
                    "oth_amt", "", "txtAllowOther", "40%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: true,
                        insert_allowed: true,
                        display_style: "",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
                    },
                    {
                        change: function () {
                            thatForm.helperFunc.calcTotSalary();
                        }
                    }
                ),
                _totamt: FormView.getFactoryFields.getGeneralField(
                    "_totamt", "", "totalTxt", "40%", "", "20%",
                    {
                        data_type: FormView.DataType.Number,
                        edit_allowed: false,
                        insert_allowed: false,
                        display_style: "totInput",
                        display_format: sett["FORMAT_MONEY_1"],
                        canvas: "tabSal"
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
                    name: "cmdOther",
                    canvas: "default_canvas",
                    title: "Action",

                    obj: new sap.m.Button({
                        icon: "sap-icon://action",
                        press: function () {
                            var mnus = [];
                            if (
                                (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                                    that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW
                                )) {
                                var flg = Util.getSQLValue("select flag from c7hr_emp where emp_cd='" +
                                    that2.frm.getFieldValue("qry1.emp_cd") + "'");
                                if (flg == 0)
                                    mnus.push(new sap.m.MenuItem({
                                        icon: "checklist-item-2",
                                        text: Util.getLangText("Activate"),
                                        press: function () {
                                            var flg = Util.getSQLValue("select flag from c7hr_emp where emp_cd='" +
                                                that2.frm.getFieldValue("qry1.emp_cd") + "'");
                                            if (flg != 0)
                                                FormView.err("Cant Activate , already Activated !");
                                            
                                        }
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
                    name: "cmdPrint",
                    canvas:
                        "default_canvas",
                    title:
                        "",
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
                            colname: 'EMP_CD',
                            return_field: "pac",
                        },
                        {
                            colname: "ANAME1",
                        },
                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select emp_cd,aname1 from c7hr_emp order by emp_cd",
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

            var oMainLayout = new sap.m.HBox(thatForm.view.createId("layoutInfo" + thatForm.timeInLong), {
                width: "100%",
                items: [
                    oInfoBox,
                    oPhotoBox
                ]
            }).addStyleClass("fixedBox");
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
            var txtKeyfld = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "15%", editable: false }).addStyleClass("");
            var txtEmpStatus = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false }).addStyleClass("");
            var txtCode = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "20%", editable: false }).addStyleClass("empInfoValue");
            var txtName1 = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: false }).addStyleClass("empInfoValue");
            var txtEmpJob = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false }).addStyleClass("empInfoValue");
            var txtName2 = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: false }).addStyleClass("empInfoValue");
            var txtEmpDept = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false }).addStyleClass("empInfoValue");

            var fe = [

                Util.getLabelTxt(Util.getLangText("hrEmpInfo"), "15%", "#", "", "Begin"),
                Util.getLabelTxt("Key Id #", "50%", "@"), txtKeyfld,
                Util.getLabelTxt("txtStatus", "15%", "@"), txtEmpStatus,
                Util.getLabelTxt("", "0px", ""),
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
                "txtStatus": txtEmpStatus,
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

            if (thatForm.infoObjs != undefined &&
                thatForm.infoObjs["imageurl"] != undefined) {
                URL.revokeObjectURL(thatForm.infoObjs["imageurl"]);
                thatForm.infoObjs["fileupload"] = undefined;
            }

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
            var refer = thatForm.frm.getFieldValue("qry1.emp_cd");
            var fileUpload = thatForm.infoObjs["fileupload"];
            Util.doXhrUpdateVouAttach("uploadAttachPdfVou",
                true, fileUpload, refer, "", "EMP_PICS");
        },
        calcTotSalary: function () {
            var thatForm = this.thatForm;
            var basic = Util.extractNumber(thatForm.frm.getFieldValue("qry1.basic_amt"));
            var hra = Util.extractNumber(thatForm.frm.getFieldValue("qry1.hra_amt"));
            var trns = Util.extractNumber(thatForm.frm.getFieldValue("qry1.trns_amt"));
            var food = Util.extractNumber(thatForm.frm.getFieldValue("qry1.food_amt"));
            var other = Util.extractNumber(thatForm.frm.getFieldValue("qry1.oth_amt"));
            var tot = basic + hra + trns + food + other;
            thatForm.frm.setFieldValue("qry1._totamt", tot, tot, true);

        },
        showStatus: function () {
            var thatForm = this.thatForm;
            var qry = thatForm.frm.objs["qry1"];
            if (qry.status == FormView.RecordStatus.NEW)
                thatForm.infoObjs["txtStatus"].setText(Util.getLangText("txtNotActive"));
            else {
                var flg = Util.getSQLValue("select flag from c7hr_emp where emp_cd='" +
                    thatForm.frm.getFieldValue("qry1.emp_cd") + "'");
                thatForm.infoObjs["txtStatus"].setText(Util.getLangText(thatForm.status[flg]));
            }
        },
        dispInfos: function (qry) {
            var thatForm = this.thatForm;
            if (thatForm.infoObjs == undefined)
                return;
            var qry = thatForm.frm.objs["qry1"];
            thatForm.infoObjs["fu"].setEnabled(true);
            this.resetInfoObjs();

            if (qry.status == FormView.RecordStatus.VIEW)
                thatForm.infoObjs["fu"].setEnabled(false);


            if (qry._datax != undefined)
                thatForm.infoObjs["keyfld"].setText(qry._datax[0]["KEYFLD"]);

            var dept = thatForm.frm.getFieldValue("dept_id") + " - " + thatForm.frm.getFieldValue("deptname");

            var full_name1 = thatForm.frm.getFieldValue("aname1") + " " +
                thatForm.frm.getFieldValue("aname2") + " " +
                thatForm.frm.getFieldValue("aname3") + " " +
                thatForm.frm.getFieldValue("aname4") + " " +
                thatForm.frm.getFieldValue("aname5");

            var full_name2 = thatForm.frm.getFieldValue("lname1") + " " +
                thatForm.frm.getFieldValue("lname2") + " " +
                thatForm.frm.getFieldValue("lname3") + " " +
                thatForm.frm.getFieldValue("lname4") + " " +
                thatForm.frm.getFieldValue("lname5");

            thatForm.infoObjs["txtCode"].setText(thatForm.frm.getFieldValue("emp_cd"));
            thatForm.infoObjs["txtName1"].setText(full_name1);
            thatForm.infoObjs["txtName2"].setText(full_name2);

            thatForm.infoObjs["txtEmpJob"].setText(thatForm.frm.getFieldValue("job_tit"));
            thatForm.infoObjs["txtEmpDept"].setText(dept);
            thatForm.helperFunc.showStatus();

        }
    },

});



