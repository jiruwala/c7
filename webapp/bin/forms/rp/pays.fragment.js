sap.ui.jsfragment("bin.forms.rp.pays", {
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
        var repCode = "P001";
        var view = this.view;
        var fullSpan = "XL8 L8 M8 S12";
        var colSpan = "XL2 L2 M2 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var cmdLink = function (obj, rowno, colno, lctb, frm) {
            if (obj == undefined) return;
            var tbl = obj.getParent().getParent();
            var mdl = tbl.getModel();
            var rr = tbl.getRows().indexOf(obj.getParent());
            var rowStart = tbl.getFirstVisibleRow();
            var vername = sett["C7_VER_NAME"];
            var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());


            var dtx = Util.execSQLWithData("select vou_code,type,refercode,refertype from acvoucher1 where keyfld=" + kfld, "No data found ..");

            if (dtx.length > 0) {
                var vcd = dtx[0].VOU_CODE;
                var typ = dtx[0].TYPE;

                if (vcd == 1 && typ == 1) {
                    UtilGen.execCmd("gl.jv readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                } else if (vcd == 3 && (typ == 1 || typ == 6)) {
                    UtilGen.execCmd("gl.pv readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                } else if (vcd == 2 && (typ == 1 || typ == 6)) {
                    UtilGen.execCmd("gl.rv readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                } else if (vcd == 2 && (typ == 2 || typ == 7)) {
                    UtilGen.execCmd("gl.rvc readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                } else if (vcd == 3 && (typ == 2 || typ == 7)) {
                    UtilGen.execCmd("gl.pvc readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                } else if (vcd == 1) {
                    UtilGen.execCmd("gl.jv readonly=true formType=dialog formSize=100%,80% status=view keyfld=" + kfld, thatForm.view, obj, undefined);
                }

            }

        }
        // UtilGen.clearPage(this.mainPage);
        this.o1 = {};
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: "Cash/Cheque Payments",
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "P001",
                    name: "Cash/Cheuqe Payments",
                    descr: "Periodic cash & Cheque Payment report",
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    onSubTitHTML: function () {
                        var tbstr = Util.getLangText("titDlvDetails");
                        var ht = "<div class='reportTitle'>Periodic cash & Cheque Payment report</div > ";
                        return ht;

                    },
                    showCustomPara: function (vbPara, rep) {

                    },
                    mainParaContainerSetting: ReportView.getDefaultParaFormCSS(),
                    rep: {
                        parameters: {
                            fromdate: {
                                colname: "fromdate",
                                data_type: FormView.DataType.Date,
                                class_name: FormView.ClassTypes.DATEFIELD,
                                title: '{\"text\":\"From\",\"width\":\"15%\","textAlign":"End"}',
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
                            accno: {
                                colname: "accno",
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
                                        thatForm.frm.setFieldValue(repCode + "@parameter.accno", vl, vl, false);
                                        var vlnm = Util.getSQLValue("select name from acaccount where actype=0 and accno =" + Util.quoted(vl));
                                        thatForm.frm.setFieldValue(repCode + "@parameter.acname", vlnm, vlnm, false);

                                    },
                                    valueHelpRequest: function (event) {
                                        var sq = "select accno code,name from acaccount where actype=0 and childcount=0 order by path";
                                        Util.show_list(sq, ["CODE", "NAME"], "", function (data) {
                                            thatForm.frm.setFieldValue(repCode + "@parameter.accno", data.CODE, data.CODE, true);
                                            thatForm.frm.setFieldValue(repCode + "@parameter.acname", data.NAME, data.NAME, true);
                                            return true;
                                        }, "300px", "400px", undefined, false, undefined, undefined, undefined, undefined, undefined, undefined);
                                    },
                                    width: "35%"
                                },
                                list: undefined,
                                edit_allowed: true,
                                insert_allowed: true,
                                require: false,
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
                                        }, "300px", "400px", undefined, false, undefined, undefined, undefined, undefined, undefined, undefined);
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
                                dispRecords: -1,
                                execOnShow: false,
                                dml: "select a.*,decode(type,1,'Bank',2,'Cash') rec_type, " +
                                    " (select max(descr2) from acvoucher2 where keyfld=a.keyfld and debit>0 ) acc_name " +
                                    " from ACC_TRANSACTION_up a where " +
                                    "(a.cust_code=':parameter.pcust' or ':parameter.pcust' is null) and " +
                                    "(a.accno=':parameter.accno' or ':parameter.accno' is null) and " +
                                    " a.vou_code in (3) and a.vou_date>=:parameter.fromdate  and " +
                                    " a.vou_date<=:parameter.todate and a.vou_code=3 and credit>0 order by keyfld",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: ["ACCNO", "DESCR2", "VOU_DATE", "DESCR", "CHEQUENO", "RCVFROM", "CREDIT"],
                                canvasType: ReportView.CanvasType.VBOX,
                                onRowRender: function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                                    // var oModel = this.getControl().getModel();
                                    // var bal = parseFloat(oModel.getProperty("BALANCE", currentRowContext));
                                    // if (bal >= 0)
                                    //     qv.getControl().getRows()[dispRow].getCells()[3].$().css("color", "green");
                                    // else
                                    //     qv.getControl().getRows()[dispRow].getCells()[3].$().css("color", "red");


                                },
                                bat7CustomAddQry: function (qryObj, ps) {

                                },
                                fields: {
                                    credit: {
                                        colname: "credit",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Amount",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "150",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "color:maroon;",
                                        display_format: "MONEY_FORMAT",
                                        default_value: "",
                                        summary: "SUM",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    rec_type: {
                                        colname: "rec_type",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Type",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "80",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},


                                    },
                                    vou_date: {
                                        colname: "vou_date",
                                        data_type: FormView.DataType.Date,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Vou Date",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "150",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "SHORT_DATE_FORMAT",
                                        default_value: "",
                                        other_settings: {},
                                        commandLinkClick: cmdLink
                                    },
                                    duedate: {
                                        colname: "duedate",
                                        data_type: FormView.DataType.Date,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Due Date",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "150",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "SHORT_DATE_FORMAT",
                                        default_value: "",
                                        other_settings: {},

                                    },
                                    chequeno: {
                                        colname: "chequeno",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Cheque No",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},


                                    },
                                    no: {
                                        colname: "no",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Vou No",
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
                                    cust_code: {
                                        colname: "cust_code",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Reference",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "150",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},


                                    },
                                    accno: {
                                        colname: "accno",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Acc No",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "150",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},


                                    },
                                    descr2: {
                                        colname: "descr2",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Name",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "375",
                                        display_align: "ALIGN_LEFT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},

                                    },
                                    descr: {
                                        colname: "descr",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Descr",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "375",
                                        display_align: "ALIGN_LEFT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        display_type: "NONE",
                                        other_settings: {},

                                    },
                                    acc_name: {
                                        colname: "acc_name",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "A/C To",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "200",
                                        display_align: "ALIGN_BEGIN",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},

                                    },
                                    rcvfrom: {
                                        colname: "rcvfrom",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Pay To",
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "100",
                                        display_align: "ALIGN_BEGIN",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},


                                    },
                                    keyfld: {
                                        colname: "keyfld",
                                        data_type: FormView.DataType.Number,
                                        class_name: FormView.ClassTypes.LABEL,
                                        title: "Keyfld",
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
    }

})
    ;



