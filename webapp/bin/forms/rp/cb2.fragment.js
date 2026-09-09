sap.ui.jsfragment("bin.forms.rp.cb2", {
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
            var mdl = frm.objs["DS001@qry2"].obj.getControl().getModel();
            var rr = frm.objs["DS001@qry2"].obj.getControl().getRows().indexOf(obj.getParent());
            var cont = frm.objs["DS001@qry2"].obj.getControl().getContextByIndex(rr);
            var rowid = mdl.getProperty("_rowid", cont);
            // var ac = Util.nvl(lctb.getFieldValue(rowid, "ACCNO"), "");
            var ac = frm.objs["DS001@qry2"].obj.getControl().getRows()[rr].getCells()[0].getText();

            var mnu = new sap.m.Menu();
            mnu.removeAllItems();

            mnu.addItem(new sap.m.MenuItem({
                text: "SOA A/c -" + ac,
                customData: { key: ac },
                press: function () {
                    var accno = this.getCustomData()[0].getKey();
                    // var pac = thatForm.frm.getFieldValue("DS001@parameter.accno");
                    // var pac = (pac != "") ? " paccno=" + pac : "";
                    UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=0 inclUnpostDlv=Y inclUnpost=Y para_PARAFORM=false para_EXEC_REP=true pref=" + accno, UtilGen.DBView, obj, UtilGen.DBView.newPage);
                }
            }));
            mnu.addItem(new sap.m.MenuItem({
                text: "View A/c -" + ac,
                customData: { key: ac },
                press: function () {
                    var accno = this.getCustomData()[0].getKey();
                    UtilGen.execCmd("bin.forms.gl.rp formType=dialog readonly=true formSize=80%,80% status=view code=" + accno, UtilGen.DBView, obj, UtilGen.DBView.newPage);
                }
            }));
            mnu.openBy(obj);

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("titDebitorStat"),
            title2: Util.getLangText("titDebitorStat"),
            show_para_pop: false,
            reports: [
                {
                    code: "DS001",
                    name: "titDebitorStat",
                    descr: "",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var up = thatForm.frm.getFieldValue("parameter.unposted");
                        var tbstr = Util.getLangText("titDebitorStat");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        // if (cs != "")
                        //     ht += "<div class='reportTitle2'>" +"</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
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
                            cust_code: {
                                colname: "cust_code",
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
                                        thatForm.frm.setFieldValue("DS001@parameter.cust_code", vl, vl, false);
                                        var vlnm = Util.getSQLValue("select name from c_ycust where code =" + Util.quoted(vl));
                                        thatForm.frm.setFieldValue("DS001@parameter.custname", vlnm, vlnm, false);

                                    },
                                    valueHelpRequest: function (event) {
                                        var repCode = "DS001";
                                        var sq = "select code,name,namea from c_ycust where childcount>0  order by path";
                                        Util.show_list(sq, ["ACCNO", "NAME", "NAMEA"], "", function (data) {
                                            thatForm.frm.setFieldValue(repCode + "@parameter.cust_code", data.CODE, data.CODE, true);
                                            thatForm.frm.setFieldValue(repCode + "@parameter.custname", data.NAME, data.NAME, true);
                                            return true;
                                        }, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

                                    },
                                    width: "35%"
                                },
                                list: undefined,
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true,
                                dispInPara: true,
                            },
                            custname: {
                                colname: "custname",
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
                            grpby: {
                                colname: "grpby",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '{\"text\":\"grpByTxt\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: "",
                                other_settings: {
                                    width: "35%",
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                    selectedKey: "none",
                                },
                                list: "@none/None,salesp/txtSalesPerson",
                                edit_allowed: true,
                                insert_allowed: true,
                                require: true,
                                dispInPara: true,
                            },
                            pstatus: {
                                colname: "pstatus",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.COMBOBOX,
                                title: '{\"text\":\"clientStatus\",\"width\":\"15%\","textAlign":"End"}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_RIGHT",
                                display_style: "",
                                display_format: "",
                                default_value: "",
                                other_settings: {
                                    width: "35%",
                                    items: {
                                        path: "/",
                                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                                        templateShareable: true
                                    },
                                    selectedKey: "ACTIVE",
                                },
                                list: "@ALL/txtAll,ACTIVE/txtCustActive,STOPPED/txtCustStopped,LEGAL/txtCustUnderLegal",
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                            },
                            abovecredit: {
                                colname: "abovecredit",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '{\"text\":\"showAboveCreditLimit\",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                default_value: "N",
                                other_settings: { selected: false, width: "5%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                                trueValues: ["Y", "N"]
                            },
                            abovezero: {
                                colname: "abovezero",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '{\"text\":\"Balance # 0 \",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                default_value: "Y",
                                other_settings: { selected: true, width: "5%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                                trueValues: ["Y", "N"]
                            },
                            lastPayDeb: {
                                colname: "lastPayDeb",
                                data_type: FormView.DataType.String,
                                class_name: FormView.ClassTypes.CHECKBOX,
                                title: '{\"text\":\"Last Pay=DEBIT? \",\"width\":\"90%\","textAlign":"End","styleClass":""}',
                                title2: "",
                                display_width: colSpan,
                                display_align: "ALIGN_LEFT",
                                display_style: "",
                                display_format: "",
                                default_value: "N",
                                other_settings: { selected: false, width: "5%", trueValues: ["Y", "N"] },
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
                                dispInPara: true,
                                trueValues: ["Y", "N"]
                            },
                        },
                        print_templates: [
                        ],
                        canvas: [],
                        db: [
                            {
                                type: "query",
                                name: "qry2",
                                showType: FormView.QueryShowType.QUERYVIEW,
                                disp_class: "reportTable2",
                                // dispRecordsDeductHeightP: { "S": 70, "M": 60, "L": 55, "XL": 45 },
                                dispRecords: -1,// { "S": 10, "M": 16, "L": 20, "XL": 22 },
                                execOnShow: false,
                                dml: "select '1' from dual ",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["CODE", "NAME", "SLSNAME", "SALESP", "TEL", "DRBAL", "CRBAL"],
                                canvasType: ReportView.CanvasType.VBOX,
                                beforeLoadQry: function (sql) {
                                    var iq = thatForm.frm.getFieldValue("parameter.pref");
                                    var lpd = thatForm.frm.getFieldValue("parameter.lastPayDeb");
                                    var replc = "iscust='Y'";
                                    if (iq != "") replc = '1=1';

                                    var sqQr = `SELECT c_ycust.code,
                                                c_ycust.name,
                                                c_ycust.salesp,
                                                sl.name AS slsname,
                                                c_ycust.crd_limit2,
                                                c_ycust.tel,
                                                NVL(SUM(v.debit - v.credit), 0) AS balance,   -- total up to the cutoff date
                                                0 AS drbal,
                                                0 AS crbal,
                                                0 AS overcredit,
                                                last_pay.no AS last_pay_no,                   -- your 3 columns
                                                last_pay.vou_date AS last_pay_date,
                                                last_pay.credit AS last_pay_amt
                                            FROM c_ycust
                                            LEFT JOIN salesp sl ON sl.no = c_ycust.salesp
                                            LEFT JOIN acvoucher2 v 
                                                    ON v.cust_code = c_ycust.code
                                                    AND v.vou_date <= :parameter.todate
                                            LEFT JOIN (SELECT no, vou_date, credit, cust_code
                                                        FROM (SELECT no, vou_date, credit, cust_code,
                                                                        ROW_NUMBER() 
                                                                        OVER (PARTITION BY cust_code 
                                                                                ORDER BY vou_date DESC, keyfld DESC) AS rn
                                                                FROM acvoucher2
                                                                WHERE credit > 0  
                                                                    AND vou_date <= :parameter.todate )
                                                        WHERE rn = 1) last_pay 
                                                    ON last_pay.cust_code = c_ycust.code
                                            WHERE (':parameter.pstatus'='ALL' or c_ycust.mov_type = ':parameter.pstatus')   -- your original condition simplified
                                            AND c_ycust.path LIKE (SELECT NVL(MAX(c.path), '') || '%'
                                                                        FROM c_ycust c
                                                                    WHERE c.code = ':parameter.cust_code')
                                            GROUP BY c_ycust.code,
                                                    c_ycust.name,
                                                    c_ycust.salesp,
                                                    sl.name,
                                                    c_ycust.crd_limit2,
                                                    c_ycust.tel,
                                                    last_pay.no,          -- include the three new columns in GROUP BY
                                                    last_pay.vou_date,
                                                    last_pay.credit
                                            ORDER BY c_ycust.code`;
                                    // sqQr = lpd == "N" ? sqQr.replaceAll(':cred_cond ', "credit > 0") : sqQr.replaceAll(':cred_cond ', " debit > 0");
                                    return sqQr;
                                    // sqQr=sqQr.replaceAll(':TODATE',Util.toOraDateString(:))

                                    // var adMxQRy = `(SELECT   v2.no AS mxx_no, v2.cust_code AS mxx_cust,v2.vou_date mxx_date,v2.credit as mx_payamt
                                    //                 FROM   acvoucher2 v2, 
                                    //                 (  SELECT   cust_code, MAX (keyfld) AS maxkf FROM   acvoucher2 WHERE   credit > 0
                                    //                         GROUP BY   cust_code) a
                                    //                 WHERE   v2.keyfld = a.maxkf AND v2.cust_code = a.cust_code) mxx `;

                                    // return ("SELECT   c_ycust.code,c_ycust.name,C_YCUST.SALESP,sl.name slsname ,c_ycust.salesp," +
                                    //     " C_YCUST.CRD_LIMIT2,C_YCUST.TEL," +
                                    //     " SUM (debit - credit) balance, 0 drbal,0 crbal, " +
                                    //     " () " +
                                    //     " 0 overcredit  FROM  acvoucher2 v, c_ycust,salesp sl " +
                                    //     adMxQRy +
                                    //     " WHERE sl.no(+)=c_ycust.salesp and  v.cust_code = c_ycust.code and :iscust " +
                                    //     " and (nvl(':parameter.pstatus','ALL')='ALL' or c_ycust.mov_type=':parameter.pstatus')  " +
                                    //     " and (c_ycust.path like (select nvl(max(c.path),'')||'%' from c_ycust c where c.code=':parameter.cust_code') ) " +
                                    //     " and vou_date<=:parameter.todate  GROUP BY   code, c_ycust.name,C_YCUST.SALESP,sl.name ,0," +
                                    //     " C_YCUST.CRD_LIMIT2,C_YCUST.TEL order by c_ycust.code")
                                    //     .replaceAll(":iscust", replc);

                                    /*
                                    return "SELECT   c_ycust.code,c_ycust.name,C_YCUST.SALESP,sl.name slsname ,c_ycust.salesp," +
                                        " C_YCUST.AREA,C_YCUST.CRD_LIMIT2,C_YCUST.TEL," +
                                        " C_YCUST.ADDR,C_YCUST.EMAIL,SUM (debit - credit) balance, 0 allbalance,0 overcredit," +
                                        " (select nvl(sum((sale_price+nvl(op_no,0))*ord_pkqty),0) from c_order1 " +
                                        " where ord_code=9 and ord_ref=c_ycust.code and saleinv is null and ord_date<=:parameter.todate) unpost_bal " +
                                        " FROM  acvoucher2 v, c_ycust,salesp sl WHERE sl.no(+)=c_ycust.salesp and  v.cust_code = c_ycust.code and iscust='Y' " +
                                        " and (nvl(':parameter.pstatus','ALL')='ALL' or c_ycust.mov_type=':parameter.pstatus')  " +
                                        " and (c_ycust.path like (select nvl(max(c.path),'')||'%' from c_ycust c where c.code=':parameter.cust_code') ) " +
                                        " and vou_date<=:parameter.todate  GROUP BY   code, c_ycust.name,C_YCUST.SALESP,sl.name ,0," +
                                        " C_YCUST.AREA,C_YCUST.CRD_LIMIT2,C_YCUST.TEL, C_YCUST.ADDR,C_YCUST.EMAIL order by c_ycust.code";
                                        */
                                },
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    var oModel = this.getControl().getModel();
                                    var cl = Util.extractNumber(oModel.getProperty("CRD_LIMIT2", currentRowContext));
                                    var ab = Util.extractNumber(oModel.getProperty("DRBAL", currentRowContext));
                                    var ab = ab - Util.extractNumber(oModel.getProperty("CRBAL", currentRowContext));
                                    if (cl != 0 && ab > cl)
                                        for (var i = startCell; i < endCell; i++) {
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", "red");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", "red");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("background-color", "lightgrey");
                                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("background-color", "lightgrey");

                                        }



                                },
                                eventAfterQV: function (qryObj) {
                                    // var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                    // if (iq != "none")
                                    qryObj.obj.showToolbar.showGroupFilter = true;//!(iq == "1");

                                },
                                afterApplyCols: function (qryObj) {
                                    if (qryObj.name == "qry2") {
                                        var iq = thatForm.frm.getFieldValue("parameter.grpby");
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("SALESP")].mGrouped = iq == "salesp";
                                        qryObj.obj.mLctb.cols[qryObj.obj.mLctb.getColPos("SLSNAME")].mGrouped = iq == "salesp";

                                    }
                                },
                                onPrintRenderAdd: function (ld, idx, col) {
                                    if (idx >= ld.rows.length) return "";
                                    var cl = Util.nvl(ld.getFieldValue(idx, "CRD_LIMIT2"), 0);
                                    var ab = Util.nvl(ld.getFieldValue(idx, "ALLBALANCE"), 0);
                                    if (cl != 0 && ab > cl)
                                        return "background-color:lightgrey;color:red;";
                                    return;

                                },
                                eventCalc: function (qv, cx, rowno, reAmt) {
                                    var sett = sap.ui.getCore().getModel("settings").getData();
                                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                                    if (rowno >= 0) return;
                                    var ld = qv.mLctb;
                                    for (var i = 0; i < ld.rows.length; i++) {
                                        var bl = ld.getFieldValue(i, "BALANCE");
                                        if (bl > 0)
                                            ld.setFieldValue(i, "DRBAL", bl);
                                        else
                                            ld.setFieldValue(i, "CRBAL", Math.abs(bl));
                                        var cl = ld.getFieldValue(i, "CRD_LIMIT2");
                                        if (cl != 0 && (bl + up) > cl)
                                            ld.setFieldValue(i, "OVERCREDIT", (bl + up) - cl);

                                    }
                                    var ac = thatForm.frm.getFieldValue("parameter.abovecredit");
                                    if (ac == 'Y')
                                        for (var i = ld.rows.length - 1; i >= 0; i--) {
                                            var bl = ld.getFieldValue(i, "BALANCE");
                                            var cl = ld.getFieldValue(i, "CRD_LIMIT2");
                                            if (cl == 0 || bl < cl)
                                                ld.deleteRow(i);
                                        }
                                    var ez = thatForm.frm.getFieldValue("parameter.abovezero");
                                    if (ez == 'Y')
                                        for (var i = ld.rows.length - 1; i >= 0; i--) {
                                            var bl = ld.getFieldValue(i, "BALANCE");
                                            if (bl == 0)
                                                ld.deleteRow(i);
                                        }
                                },
                                bat7CustomAddQry: function (qryObj, ps) {

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
                                        display_width: "80",
                                        display_align: "ALIGN_CENTER",
                                        grouped: false,
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        summary: "COUNT",
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
                                        display_width: "175",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    drbal: {
                                        colname: "drbal",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "DR Bal",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        summary: "SUM",
                                        other_settings: {},
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    crbal: {
                                        colname: "crbal",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "CR Bal",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        summary: "SUM",
                                        valOnZero: '',
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    last_pay_amt: {
                                        colname: "last_pay_amt",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "lastPayAmt",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        summary: "SUM",
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    last_pay_no: {
                                        colname: "last_pay_no",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "txtNo",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "75",
                                        display_align: "ALIGN_CENTER",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    last_pay_date: {
                                        colname: "last_pay_date",
                                        data_type: FormView.DataType.Date,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "dateTxt",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "75",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "SHORT_DATE_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    crd_limit2: {
                                        colname: "crd_limit2",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Credit Limit",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    overcredit: {
                                        colname: "overcredit",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "txtOverCrditDue",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "0",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        valOnZero: '',
                                        commandLinkClick: cmdLink
                                    },
                                    slsname: {
                                        colname: "slsname",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "txtSalesPerson",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    salesp: {
                                        colname: "salesp",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "txtNo",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "0",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    tel: {
                                        colname: "tel",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "txtTel",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "75",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
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

    }
    ,
    loadData: function () {
        //alert(sap.ui.Device.resize.height);
        // var that = this;
        // var sq = "select accno,name,debit,credit from acc_balance_1 order by path";
        // Util.doAjaxJson("sqlmetadata", {sql: sq}, false).done(function (data) {
        //     if (data.ret == "SUCCESS") {
        //         that.qv.setJsonStrMetaData("{" + data.data + "}");
        //         var c = that.qv.mLctb.getColPos("DEBIT");
        //         that.qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
        //         that.qv.mLctb.cols[c].mSummary = "SUM";
        //         c = that.qv.mLctb.getColPos("CREDIT");
        //         that.qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
        //         that.qv.mLctb.cols[c].mSummary = "SUM";
        //
        //         that.qv.mLctb.parse("{" + data.data + "}", true);
        //         that.qv.loadData();
        //         // that.qv.getControl().setVisibleRowCount(that.qv.mLctb.rows.length + 3);
        //     }
        // });

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

})
    ;



