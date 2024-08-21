sap.ui.jsfragment("bin.forms.rp.soaRef", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.timeInLong = (new Date()).getTime();

        this.helperFunc.init(this);
        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });
        this.jp = this.createView();
        this.loadData();
        this.jp.onWndClose = function () {
            sap.m.MessageToast.show("Closing the report !");
            that.frm.helperFunctions.destoryRV();
        };
        return this.jp;
    },
    createView: function () {
        var that = this;
        var view = this.view;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var fullSpan = "XL8 L8 M8 S12";
        var colSpan = "XL2 L2 M2 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var cmdLink = function (obj, rowno, colno, lctb, frm) {

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("titCSOA"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SOAREF1",
                    name: "vouchers",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    showXLSMenu: true,
                    showHTMLMenu: false,
                    showQueryPage: false,
                    showCustomPara: function (vbPara, rep) {
                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(undefined, "400px"),
                    rep: {
                        parameters: thatForm.helperFunc.getParas("SOAREF1"),
                        print_templates: [
                            {
                                title: "Print..",
                                reportFile: "soaRef1",
                                beforeExec: function (idx, rptName) {
                                    var repCode = "SOAREF1";
                                    var paras = {};
                                    var rptNo = idx;
                                    paras["pcust"] = thatForm.frm.objs[repCode + "@parameter.pcust"].obj.mainObj;
                                    paras["pbranch"] = thatForm.frm.objs[repCode + "@parameter.pbranch"].obj.mainObj;
                                    paras["fromdate"] = thatForm.frm.objs[repCode + "@parameter.fromdate"].obj.mainObj;
                                    paras["todate"] = thatForm.frm.objs[repCode + "@parameter.todate"].obj.mainObj;
                                    paras["inclUnpost"] = thatForm.frm.objs[repCode + "@parameter.inclUnpost"].obj.mainObj;
                                    paras["inclUnpostDlv"] = thatForm.frm.objs[repCode + "@parameter.inclUnpostDlv"].obj.mainObj;
                                    // paras["ptodate"] = thatForm.frm.objs[repCode + "@parameter.todate"].obj.mainObj;
                                    for (var fld in paras) {
                                        var vl = UtilGen.getControlValue(paras[fld]);
                                        var parent = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + thatForm.frm.timeInLong);
                                        var para = thatForm.view.byId("rep" + rptNo + "_parameter" + fld + "Para" + thatForm.frm.timeInLong);
                                        UtilGen.setControlValue(parent, vl, vl, true);
                                        UtilGen.setControlValue(para, vl, vl, true);

                                        // if (Util.nvl(vl, "") == "" && thatForm.helperFunctions.misc.getObjectByObj(parent).require) {
                                        //     UtilGen.errorObj(paras[fld]);
                                        //     ReportView.err(thatForm.helperFunctions.misc.getObjectByObj(parent).colname + " field rquired a value !");
                                        // }
                                    }
                                    var rpt = rptName;
                                    thatForm.helperFunc.save_soa();
                                    return { reportFile: rpt, paras: "" };
                                }
                            },
                            {
                                title: "Query",
                                icon: "sap-icon://details",
                                reportFile: "soaRef1",

                                beforeExec: function (idx, rptName) {
                                    var repCode = "SOAREF1";
                                    var paras = {};
                                    var rptNo = idx;
                                    var sdf = new simpleDateFormat("MM/dd/yyyy");
                                    var pcust = thatForm.frm.objs[repCode + "@parameter.pcust"].obj.mainObj;
                                    var pbranch = thatForm.frm.objs[repCode + "@parameter.pbranch"].obj.mainObj;
                                    var fromdt = thatForm.frm.objs[repCode + "@parameter.fromdate"].obj.mainObj;
                                    var todt = thatForm.frm.objs[repCode + "@parameter.todate"].obj.mainObj;
                                    var unpost = thatForm.frm.objs[repCode + "@parameter.inclUnpost"].obj.mainObj;
                                    // paras["ptodate"] = thatForm.frm.objs[repCode + "@parameter.todate"].obj.mainObj;

                                    UtilGen.execCmd("testRep5 formType=dialog repno=0 para_PARAFORM=false para_EXEC_REP=true " +
                                        "pref=" + pcust.getValue() +
                                        " fromdate=@" + sdf.format(fromdt.getDateValue()) +
                                        " todate=@" + sdf.format(todt.getDateValue()) +
                                        " inclUnpost=" + UtilGen.getControlValue(unpost)
                                        , UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage);
                                    return "";
                                }
                            }
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qryM",
                                showType: FormView.QueryShowType.FORM,
                                dispRecords: -1,
                                execOnShow: false,
                                showToolbar: true,
                                canvas: "qryMCanvas",
                                canvasType: ReportView.CanvasType.FORMCREATE2,
                                isMaster: false,
                                masterToolbarInMain: false,
                                dml: "select '' accno from dual",
                                // beforeLoadQry: function (sql, qryObj) {
                                //     return "";
                                // },
                                bat7CustomAddQry: function (qryObj, ps) {
                                },
                                bat7CustomGetData: function (qryObj) {

                                },
                                onCustomValueFields: function (qrtObj) {
                                    //thatForm.frm.setFieldValue("01@qry3.accno", "xxx11");
                                    //thatForm.frm.setFieldValue("01@qry3.descr", "custom descr");
                                },
                                fields: {
                                    accno: {
                                        colname: "accno",
                                        data_type: FormView.DataType.String,
                                        class_name: ReportView.ClassTypes.TEXTFIELD,
                                        title: '{\"text\":\"Reference\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                        title2: "",
                                        display_width: colSpan,
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        onPrintField: function () {
                                            return this.obj.$().outerHTML();
                                        },
                                        other_settings: {
                                            width: "35%",
                                            editable: false
                                        },
                                    },
                                }
                            }
                        ]

                    }
                },
            ]
        };

        this.frm = new ReportView(this.mainPage);
        this.frm.parasAsLabels = true;
        return this.frm.createViewMain(this, js);

    },
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getParas: function (repCode) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var that2 = this.thatForm;
            var thatForm = this.thatForm;
            var view = this.thatForm.view;
            var colSpan = "XL2 L2 M2 S12";
            var fullSpan = "XL8 L8 M8 S12";
            var sumSpan = "XL2 L2 M2 S12";

            var para = {
                fromdate: {
                    colname: "fromdate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"From Date\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "$FIRSTDATEOFYEAR",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                todate: {
                    colname: "todate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '@{\"text\":\"To Date\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    canvas: "para_canvas",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "$TODAY",
                    other_settings: { width: "35%" },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                pcust: {
                    colname: "pcust",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtCust\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        showValueHelp: true,
                        change: function (e) {
                            var vl = e.oSource.getValue();
                            thatForm.frm.setFieldValue(repCode + "@parameter.pcust", vl, vl, false);
                            var vlnm = Util.getSQLValue("select name from c_ycust where code =" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.pcustname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (event) {
                            var sq = "select code,name from c_ycust where iscust='Y' and childcount=0 order by path";
                            Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcust", data.CODE, data.CODE, true);
                                thatForm.frm.setFieldValue(repCode + "@parameter.pcustname", data.NAME, data.NAME, true);
                                return true;
                            }, "100%", "100%", undefined, false, undefined, undefined, undefined, undefined, undefined, undefined);
                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pcustname: {
                    colname: "pcustname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "49%", editable: false },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                },
                pbranch: {
                    colname: "pbranch",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '{\"text\":\"txtBranch\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: {
                        showValueHelp: true,
                        change: function (e) {
                            var cust = thatForm.frm.getFieldValue(repCode + "@parameter.pcust");
                            var vl = e.oSource.getValue();
                            thatForm.frm.setFieldValue(repCode + "@parameter.pbranch", vl, vl, false);
                            var vlnm = Util.getSQLValue("select b_name from cbranch where code =" + Util.quoted(cust) + " and brno=" + Util.quoted(vl));
                            thatForm.frm.setFieldValue(repCode + "@parameter.pbranchname", vlnm, vlnm, false);

                        },
                        valueHelpRequest: function (e) {
                            var locval = thatForm.frm.getFieldValue(repCode + "@parameter.pcust");
                            UtilGen.Search.do_quick_search(e, this,
                                "select brno code,b_name  title,AREA,BLOCK,JEDDA,QASIMA from cbranch where code=':locationx' order by brno ".replaceAll(":locationx", locval),
                                "select brno code,b_name title from cbranch where code=':locationx' and brno=:CODE".replaceAll(":locationx", locval), thatForm.frm.objs[repCode + "@parameter.pbranchname"].obj, undefined, { pWidth: "80%" }, undefined);
                        },
                        width: "35%"
                    },
                    list: undefined,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                },
                pbranchname: {
                    colname: "pbranchname",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    title: '@{\"text\":\"\",\"width\":\"1%\","textAlign":"End"}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_RIGHT",
                    display_style: "",
                    display_format: "",
                    default_value: "",
                    other_settings: { width: "49%", editable: false },
                    list: undefined,
                    edit_allowed: false,
                    insert_allowed: false,
                    require: false,
                    dispInPara: true,
                },
                inclUnpost: {
                    colname: "inclUnpost",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '{\"text\":\"paraInclUnpost\",\"width\":\"40%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "Y",
                    other_settings: { selected: true, width: "10%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
                inclUnpostDlv: {
                    colname: "inclUnpostDlv",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.CHECKBOX,
                    title: '@{\"text\":\"paraInclUnpostDlv\",\"width\":\"40%\","textAlign":"End","styleClass":""}',
                    title2: "",
                    display_width: colSpan,
                    display_align: "ALIGN_LEFT",
                    display_style: "",
                    display_format: "",
                    default_value: "N",
                    other_settings: { selected: false, width: "10%", trueValues: ["Y", "N"] },
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                    trueValues: ["Y", "N"]
                },
            };
            return para;
        },
        addQryPL3: function (qryObj, ps, repCode) {

        },
        getQryPL3: function (qryObj) {
        },
        save_soa: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var bk = UtilGen.getBackYears(thatForm.frm.getFieldValue("parameter.fromdate"), thatForm.frm.getFieldValue("parameter.todate"));
            var incUnpost = thatForm.frm.getFieldValue("parameter.inclUnpost");
            var incUnpostDlv = thatForm.frm.getFieldValue("parameter.inclUnpostDlv");
            var vflg = (incUnpost == "Y" ? "" : " and v.flag=2 ");
            // if (bk.length > 0) {
            var plsql = "declare ";
            //cursor su is ----in getaccbal function to replace
            var sqxAB = "SELECT nvl(sum(deb-crd),0) bal FROM :V_STATMENT_1 v " +
                " WHERE (v.PATH LIKE ACNo||'%' or acno is null)  AND VOU_DATE<DT AND " +
                " (cost_PATH  LIKE CC||'%' or cc is null) " +
                " and (cust_path like cd||'%' or cd is null) " +
                "and (v.branch_no=pbrno or pbrno is null ) " +
                " :KEYFLD_CONDITION ";
            //cursor acx1 is  --- GETPATHDEBIT 
            var sqxAx1 = "select SUM(DEBIT) DRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
                " A.ACCNO=V.ACCNO AND V.VOU_DATE>=FROMDATE AND " +
                " V.VOU_DATE<=TODATE :KEYFLD_CONDITION";
            //cursor acx2 is  --- GETPATHCREDIT
            var sqxAx2 = "select SUM(DEBIT) CRBAL FROM :ACVOUCHER2 V,ACACCOUNT  A WHERE PATH LIKE ACC||'%' AND " +
                " A.ACCNO=V.ACCNO AND  " +
                " V.VOU_DATE<=TODATE :KEYFLD_CONDITION ";
            var sqx = "SELECT sum(CREDIT) crD,sum(DEBIT) deb,NO,vou_code,DESCR2,DESCR,V.COSTCENT,V.type,vou_date,POS,V.KEYFLD,A.PATH,A.ACCNO ,SUM(FCDEBIT) FCDEBIT,FCRATE,SUM(FCCREDIT) FCCREDIT,FCCODE,cust_code,v.BRANCH_NO FROM :ACVOUCHER2 V, ACACCOUNT A " +
                " WHERE PATH LIKE ACN AND VOU_DATE>=FROMDT AND VOU_DATE<=TODT " +
                " AND V.ACCNO=A.ACCNO AND (V.COSTCENT=CC or cc is null) " + vflg +
                " and (branch_no=pbrno or pbrno is null ) " +
                " AND (CUST_CODE=PCUST OR PCUST IS NULL)  :KEYFLD_CONDITION " +
                " group by no,vou_code,V.type,descr2,VOU_DATE,DESCR,POS,V.KEYFLD,V.COSTCENT,A.PATH,A.ACCNO,FCRATE,FCCODE,cust_code,v.BRANCH_NO ";
            // var sqx = " SELECT sum(CREDIT) crD,sum(DEBIT) deb,NO,vou_code,DESCR2,DESCR,V.COSTCENT,V.type,vou_date,POS,V.KEYFLD,A.PATH,A.ACCNO ,SUM(FCDEBIT) FCDEBIT,FCRATE,SUM(FCCREDIT) FCCREDIT,FCCODE,cust_code FROM :ACVOUCHER2 V, ACACCOUNT A " +
            //     " WHERE PATH LIKE ACN AND VOU_DATE>=FROMDT AND VOU_DATE<=TODT" +
            //     " AND V.ACCNO=A.ACCNO :KEYFLD_CONDITION " +
            //     " group by no,vou_code,V.type,descr2,VOU_DATE,DESCR,POS,V.KEYFLD,V.COSTCENT,A.PATH,A.ACCNO,FCRATE,FCCODE,cust_code "
            var sqs = [sqx.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
            var sqs1 = [sqxAB.replaceAll(":V_STATMENT_1", "V_STATMENT_1").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
            var sqs2 = [sqxAx1.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];
            var sqs3 = [sqxAx2.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and v.keyfld>0 " : ""))];

            for (var bi in bk) {
                sqs.push(sqx.
                    replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                    replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
                sqs1.push(sqxAB.
                    replaceAll(":V_STATMENT_1", bk[bi].fiscal_schema + ".V_STATMENT_1").
                    replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
                sqs2.push(sqxAx1.
                    replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                    replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));
                sqs3.push(sqxAx2.
                    replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                    replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and v.keyfld>0 ")));

            }
            var sqls = "";
            var sqls1 = "", sqls2 = "", sqls3 = "";
            for (var si in sqs)
                sqls += (sqls.length > 0 ? " union all " : "") + sqs[si];
            for (var si in sqs1)
                sqls1 += (sqls1.length > 0 ? " union all " : "") + sqs1[si];
            for (var si in sqs2)
                sqls2 += (sqls2.length > 0 ? " union all " : "") + sqs2[si];
            for (var si in sqs3)
                sqls3 += (sqls3.length > 0 ? " union all " : "") + sqs3[si];



            var paras = "fromdt date := :parameter.fromdate;";
            paras += "todt date := :parameter.todate;";
            paras += "pincup_dlv varchar2(255) := ':parameter.inclUnpostDlv'; ";
            paras += "pincup varchar2(255) := ':parameter.inclUnpost'; ";
            paras += "toacc varchar2(100) := ''; ";
            paras += "cstcent varchar2(100) := ''; ";
            paras += "pcust varchar2(100) := ':parameter.pcust';";
            paras += "pbrno varchar2(100) := ':parameter.pbranch';";
            paras += "PAGEING varchar2(100) := 'Y';";
            paras += "TYPEX varchar2(100) := 'ALL';";
            paras += "DEL_OLD_DATA boolean := true;";
            paras += "ses_id varchar2(200) :='" + sett["SESSION_ID"] + "';";
            paras += "logon_user varchar2(200) :='" + sett["LOGON_USER"] + "';";

            sqls = "declare " + paras + " CURSOR XX(ACN VARCHAR2,CC VARCHAR2) IS " + sqls + " ORDER BY vou_date; ";
            var str = Util.getSQLValue("select custom_obj from c7_secs_tiles where tile_id=99992.1");
            sqls = sqls + str;
            sqls = sqls.replaceAll(":_CURSOR_SU_ACCBAL", sqls1);
            sqls = sqls.replaceAll(":_CURSOR_ACX1", sqls2);
            sqls = sqls.replaceAll(":_CURSOR_ACX2", sqls3);

            sqls = thatForm.frm.parseString(sqls);
            // console.log(sqls);
            var dt = Util.execSQL(sqls);
            if (dt.ret != "SUCCESS")
                FormView.err("Err. executing sql for multiple years !");
            // }
            // else {
            //     var sq =
            //         "BEGIN C6_STATMENT(:parameter.fromdate,:parameter.todate,':parameter.paccno',':parameter.pcc',':parameter.pref','ALL',TRUE,':parameter.pageing'); COMMIT; END;";
            //     sq = thatForm.frm.parseString(sq);
            //     Util.doAjaxJson("sqlmetadata?", {
            //         sql: sq,
            //         ret: "NONE",
            //         data: null
            //     }, false).done(function (data) {
            //     });
            // }

        },
    },
    loadData: function () {
    }

})
    ;



