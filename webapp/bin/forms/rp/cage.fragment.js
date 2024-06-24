sap.ui.jsfragment("bin.forms.rp.cage", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();

        this.timeInLong = (new Date()).getTime();

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
            // var mdl = frm.objs["CAGE1@qry2"].obj.getControl().getModel();
            // var rr = frm.objs["CAGE1@qry2"].obj.getControl().getRows().indexOf(obj.getParent());
            // var cont = frm.objs["CAGE1@qry2"].obj.getControl().getContextByIndex(rr);
            // var rowid = mdl.getProperty("_rowid", cont);
            // var ac = Util.nvl(lctb.getFieldValue(rowid, "ACCNO"), "");
            // var ac = frm.objs["CAGE1@qry2"].obj.getControl().getRows()[rr].getCells()[0].getText();

            // var mnu = new sap.m.Menu();
            // mnu.removeAllItems();

            // mnu.addItem(new sap.m.MenuItem({
            //     text: "SOA A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var accno = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + accno + " toacc=" + accno + " fromdate=@01/01/2020", UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.addItem(new sap.m.MenuItem({
            //     text: "View A/c -" + ac,
            //     customData: { key: ac },
            //     press: function () {
            //         var accno = this.getCustomData()[0].getKey();
            //         UtilGen.execCmd("bin.forms.gl.masterAc formType=dialog formSize=650px,300px status=view accno=" + accno, UtilGen.DBView, obj, UtilGen.DBView.newPage);
            //     }
            // }));
            // mnu.openBy(obj);

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};

        var js = {
            title: "Report Title",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "CAGE1",
                    name: "Receivables Ageing",
                    descr: "Recievables Ageing by period",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var up = thatForm.frm.getFieldValue("parameter.unposted");
                        var tbstr = Util.getLangText("Receivables Ageing");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        // if (cs != "")
                        //     ht += "<div class='reportTitle2'>" +"</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: {
                        width: "600px",
                        cssText: [
                            "padding-left:50px;" +
                            "padding-top:20px;" +
                            "border-style: inset;" +
                            "margin: 10px;" +
                            "border-radius:25px;" +
                            "background-color:#dcdcdc;"
                        ]
                    },
                    rep: {
                        parameters: {
                            todate: {
                                colname: "todate",
                                data_type: FormView.DataType.Date,
                                class_name: FormView.ClassTypes.DATEFIELD,
                                title: '{\"text\":\"To\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
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
                            from_cust: {
                                colname: "from_cust",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"From Cust\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: "0",
                                other_settings: {
                                    width: "35%"
                                },
                                list: undefined,
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true,
                                dispInPara: true,
                            },
                            to_cust: {
                                colname: "to_cust",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '@{\"text\":\"To Cust\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: "zzzzz",
                                other_settings: {
                                    width: "35%"
                                },
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
                                title: '{\"text\":\"accNo\",\"width\":\"15%\","textAlign":"End"}',
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
                                        thatForm.frm.setFieldValue("CAGE1@parameter.pcust", vl, vl, false);
                                        var vlnm = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(vl));
                                        thatForm.frm.setFieldValue("CAGE1@parameter.acname", vlnm, vlnm, false);
                                    },
                                    valueHelpRequest: function (event) {
                                        Util.showSearchList("select code accno,name from c_ycust where childcount>0 and iscust='Y' order by path", "NAME", "ACCNO", function (valx, val) {
                                            thatForm.frm.setFieldValue("CAGE1@parameter.pcust", valx, valx, true);
                                            thatForm.frm.setFieldValue("CAGE1@parameter.acname", val, val, true);
                                        });

                                    },
                                    width: "35%"
                                },
                                list: undefined,
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true,
                                dispInPara: true,
                            },
                            acname: {
                                colname: "acname",
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
                            pstatus: {
                                colname: "pstatus",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.TEXTFIELD,
                                title: '{\"text\":\"clientStatus\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: "",
                                other_settings: {
                                    width: "35%"
                                },
                                list: undefined,
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                            },
                            exclzero: {
                                colname: "exclzero",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '@{\"text\":\"exclZero\",\"width\":\"15%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                default_value: "Y",
                                other_settings: { selected: true, width: "20%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                                trueValues: ["Y", "N"]
                            },

                        },
                        print_templates: [
                            {
                                title: "Jasper Template ",
                                reportFile: "trans_1",
                            }
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                dispRecords: { "S": 10, "M": 16, "L": 20, "XL": 23 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["COL1", "COL2"],
                                canvasType: ReportView.CanvasType.VBOX,
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    var oModel = this.getControl().getModel();
                                    var bal = parseFloat(oModel.getProperty("BAL", currentRowContext));
                                    if (bal >= 0)
                                        qv.getControl().getRows()[dispRow].getCells()[2].$().css("color", "green");
                                    else
                                        qv.getControl().getRows()[dispRow].getCells()[2].$().css("color", "red");


                                },
                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                beforeLoadQry: function (sql) {
                                    // var sq =
                                    //     "BEGIN " +
                                    //     "c6_age_pr.hide_zero := 'FALSE'; " +
                                    //     "c6_age_pr.hide_negative := 'FALSE'; " +
                                    //     "c6_age_pr.todate := :parameter.todate; " +
                                    //     "c6_age_pr.fromcust := ':parameter.from_cust'; " +
                                    //     "c6_age_pr.tocust := ':parameter.to_cust'; " +
                                    //     "c6_age_pr.store_data; " +
                                    //     "END;";
                                    // sq = thatForm.frm.parseString(sq);
                                    // Util.doAjaxJson("sqlmetadata?", {
                                    //     sql: sq,
                                    //     ret: "NONE",
                                    //     data: null
                                    // }, false).done(function (data) {
                                    // });
                                    thatForm.save_cage();
                                    var ez = thatForm.frm.getFieldValue("parameter.exclzero");
                                    var sq = "select *from C6_VAGE where " + (ez == "Y" ? "  bal!=0 and " : " ") +
                                        " usernm=c6_session.get_user_session order by code ";
                                    return sq;
                                },
                                fields: {
                                    code: {
                                        colname: "code",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Code",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    name: {
                                        colname: "name",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Name",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "250",
                                        display_align: "ALIGN_RIGHT",
                                        grouped: false,
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    bal: {
                                        colname: "bal",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Balance",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "120",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        valOnZero: "",
                                        display_style: "background-color:lightgrey;",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    crd_limit: {
                                        colname: "crd_limit",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Crd.Limit",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        valOnZero: "",
                                        display_style: "background-color:#f4f0ec;",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    b30: {
                                        colname: "b30",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "0-30",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        valOnZero: "",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    b60: {
                                        colname: "b60",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "31-60",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        valOnZero: "",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        summary: "SUM",
                                        commandLinkClick: cmdLink
                                    },
                                    b90: {
                                        colname: "b90",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "61-90",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        valOnZero: "",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        summary: "SUM",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    b120: {
                                        colname: "b120",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "91-120",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        valOnZero: "",
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        summary: "SUM",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    b150: {
                                        colname: "b150",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "121-150",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        valOnZero: "",
                                        display_width: "100",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        summary:"SUM",
                                        commandLinkClick: cmdLink
                                    }

                                }
                            }
                        ]
                    }
                }
            ]
        };

        this.frm = new ReportView(this.mainPage);
        this.frm.parasAsLabels = true;
        return this.frm.createViewMain(this, js);

    },
    save_cage: function () {
        var thatForm = this;
        var todt = thatForm.frm.getFieldValue("parameter.todate");
        var fromdt = Util.addDaysFromDate(todt, -151);
        var bk = UtilGen.getBackYears(fromdt, todt);

        // _CURSOR_A2   --- order by path
        var sqx1 = "SELECT   ACVOUCHER2.cust_code," +
            "PATH, SUM (DEBIT) TOTDEB,SUM (CREDIT) TOTCRD" +
            " FROM   :ACVOUCHER2, c_ycust " +
            " WHERE VOU_DATE <= TODATE and  " +
            " (nvl(pstatus,'') is null or c_ycust.mov_type=pstatus) and " +
            "  acvoucher2.cust_code=code " +
            " and c_ycust.path like parent_path " +
            " AND (cust_code>= fromcust and cust_code<=tocust) " +
            " and c_ycust.childcount=0 and c_ycust.iscust='Y' :KEYFLD_CONDITION " +
            " GROUP BY   ACVOUCHER2.cust_code, PATH ";
        // _CURSOR_A3  order by VOU_DATE,PATH
        var sqx2 = "SELECT   ACVOUCHER2.cust_code,  PATH," +
            " SUM (DEBIT) TOTDEB, SUM (CREDIT) TOTCRD," +
            " VOU_DATE       FROM   :ACVOUCHER2, c_ycust " +
            " WHERE  VOU_DATE <= TODATE " +
            " and (nvl(pstatus,'') is null or c_ycust.mov_type=pstatus)  " +
            " and c_ycust.path like parent_path " +
            " AND ACVOUCHER2.cust_code = c_ycust.code and iscust='Y' " +
            " AND (cust_code>= fromcust and cust_code<=tocust) :KEYFLD_CONDITION  " +
            " GROUP BY   ACVOUCHER2.cust_code, PATH, VOU_DATE ";
        // :_CURSOR_PA2  order by path
        var sqx3 = "SELECT code, PATH, SUM (DEBIT) TOTDEB," +
            "SUM (CREDIT) TOTCRD FROM  :ACVOUCHER2, c_ycust WHERE VOU_DATE <= TODATE " +
            " and c_ycust.path like parent_path " +
            " and (nvl(pstatus,'') is null or c_ycust.mov_type=pstatus)  " +
            " and issupp = 'Y' AND ACVOUCHER2.cust_code = code AND(code >= fromcust  and code <= tocust) " +
            " :KEYFLD_CONDITION GROUP BY   code, PATH ";
        // :_CURSOR_PA3  order by VOU_DATE,PATH;
        var sqx4 = "SELECT   code,PATH, SUM (DEBIT) TOTDEB, " +
            " SUM (CREDIT) TOTCRD, VOU_DATE FROM  :ACVOUCHER2, c_ycust" +
            " WHERE VOU_DATE <= TODATE AND ACVOUCHER2.cust_code = c_ycust.code " +
            " and c_ycust.path like parent_path " +
            " and (nvl(pstatus,'') is null or c_ycust.mov_type=pstatus)  " +
            " and issupp='Y' AND (code>= fromcust and code<=tocust) :KEYFLD_CONDITION " +
            " GROUP BY   code, PATH, VOU_DATE ";
        // :_SQL_CODE_FOUND
        var sqxCx = " SELECT DISTINCT CUST_CODE FROM  :ACVOUCHER2 WHERE (CUST_CODE>= fromcust and CUST_CODE<=tocust)  " +
            " and debit+credit!=0 :KEYFLD_CONDITION ";

        var sqs = [sqx1.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and ACVOUCHER2.keyfld>0 " : ""))];
        var sqs1 = [sqx2.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and ACVOUCHER2.keyfld>0 " : ""))];
        var sqs2 = [sqx3.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and ACVOUCHER2.keyfld>0 " : ""))];
        var sqs3 = [sqx4.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and ACVOUCHER2.keyfld>0 " : ""))];
        var sqc1 = [sqxCx.replaceAll(":ACVOUCHER2", "ACVOUCHER2").replaceAll(":KEYFLD_CONDITION", (bk.length > 0 ? " and ACVOUCHER2.keyfld>0 " : ""))];


        for (var bi in bk) {
            sqs.push(sqx1.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and ACVOUCHER2.keyfld>0 ")));
            sqs1.push(sqx2.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and ACVOUCHER2.keyfld>0 ")));
            sqs2.push(sqx3.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and ACVOUCHER2.keyfld>0 ")));
            sqs3.push(sqx4.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and ACVOUCHER2.keyfld>0 ")));
            sqc1.push(sqxCx.
                replaceAll(":ACVOUCHER2", bk[bi].fiscal_schema + ".ACVOUCHER2").
                replaceAll(":KEYFLD_CONDITION", (bi == bk.length - 1 ? "" : " and ACVOUCHER2.keyfld>0 ")));

        }

        var sqls = "";
        var sqls1 = "", sqls2 = "", sqls3 = "";
        var sqcs1 = "";
        for (var si in sqs)
            sqls += (sqls.length > 0 ? " union all " : "") + sqs[si];
        for (var si in sqs1)
            sqls1 += (sqls1.length > 0 ? " union all " : "") + sqs1[si];
        for (var si in sqs2)
            sqls2 += (sqls2.length > 0 ? " union all " : "") + sqs2[si];
        for (var si in sqs3)
            sqls3 += (sqls3.length > 0 ? " union all " : "") + sqs3[si];
        for (var si in sqc1)
            sqcs1 += (sqcs1.length > 0 ? " union all " : "") + sqc1[si];

        sqls += "  order by PATH ";
        sqls1 += "  order by VOU_DATE,PATH ";
        sqls2 += "  order by PATH ";
        sqls3 += "  order by VOU_DATE,PATH ";

        var paras = "rep_type varchar2(100) :='R';";
        paras += " todate date := :parameter.todate;";
        paras += " fromcust varchar2(100) := ':parameter.from_cust';";
        paras += " tocust varchar2(100) := ':parameter.to_cust'; ";
        paras += " parent_cust varchar2(255) := ':parameter.pcust'; ";
        paras += " pstatus varchar2(255) := ':parameter.pstatus'; ";
        paras += " get_unpostbal varchar2(100) := 'FALSE'; ";
        paras += " slp number ; ";
        paras += " hide_zero varchar2(100) := 'FALSE'; ";
        paras += " hide_negative varchar2(100) := 'FALSE'; ";
        var plsql = "declare " + paras;
        var str = Util.getSQLValue("select custom_obj from c7_secs_tiles where tile_id=99995");
        plsql = plsql + str;
        plsql = plsql.replaceAll(":_SQL_CODE_FOUND", sqcs1);
        plsql = plsql.replaceAll(":_CURSOR_A2", sqls);
        plsql = plsql.replaceAll(":_CURSOR_A3", sqls1);
        plsql = plsql.replaceAll(":_CURSOR_PA2", sqls2);
        plsql = plsql.replaceAll(":_CURSOR_PA3", sqls3);


        plsql = thatForm.frm.parseString(plsql);
        console.log(plsql);
        var dt = Util.execSQL(plsql);
        if (dt.ret != "SUCCESS")
            FormView.err("Err. executing sql for multiple years !");


    }
    ,
    loadData: function () {
    }

});
