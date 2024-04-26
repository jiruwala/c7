sap.ui.jsfragment("bin.forms.rp.sl.slsum", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = "";
        // this.joApp = new sap.m.SplitApp({mode: sap.m.SplitAppMode.HideMode,});
        // this.joApp2 = new sap.m.App();
        this.helperFunc.init(this);
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
        var fe = [];

        var sc = new sap.m.ScrollContainer();

        var js = {
            title: Util.getLangText("titleSlsum"),
            title2: "",
            show_para_pop: false,
            reports: [
                {
                    code: "SLSUM01",
                    name: Util.getLangText("titleSlsum"),
                    descr: Util.getLangText("titleSlsum"),
                    paraColSpan: undefined,
                    hideAllPara: false,
                    paraLabels: undefined,
                    showSQLWhereClause: true,
                    showFilterCols: true,
                    showDispCols: true,
                    showCustomPara: function (vbPara, rep) {

                    },
                    onSubTitHTML: function () {

                        var tbstr = Util.getLangText("titleSlsum");
                        var ht = "<div class='reportTitle'>" + tbstr + "</div > ";
                        return ht;
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
                        parameters: thatForm.helperFunc.getParas("SLSUM01"),
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
                                showType: FormView.QueryShowType.FORM,
                                disp_class: "reportTable2",
                                dispRecords: { "S": 10, "M": 16, "L": 20 },
                                execOnShow: false,
                                dml: "",
                                parent: "",
                                levelCol: "",
                                code: "",
                                title: "",
                                isMaster: false,
                                showToolbar: true,
                                masterToolbarInMain: false,
                                filterCols: [],
                                canvasType: ReportView.CanvasType.SCROLLCONTAINER,
                                eventAfterQV: function (qryObj) {
                                },
                                afterApplyCols: function (qryObj) {
                                },
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
                                    accno: {
                                        colname: "accno",
                                        data_type: FormView.DataType.String,
                                        class_name: FormView.ClassTypes.SCROLLCONTAINER,
                                        title: '',
                                        title2: "",
                                        parentTitle: "",
                                        parentSpan: 1,
                                        display_width: "",
                                        display_align: "ALIGN_RIGHT",
                                        display_style: "",
                                        display_format: "",
                                        default_value: "",
                                        other_settings: {},
                                        onPrintField: function () {
                                            return thatForm.qr.getHTMLTable(thatForm.view);
                                        },
                                        afterAddOBject: function () {
                                            var showmonth = thatForm.frm.getFieldValue("parameter.showMonth");
                                            thatForm.qr = new QueryView("lstRepTbl" + that.timeInLong);
                                            var qr = thatForm.qr;
                                            qr.getControl().view = thatForm.view;
                                            qr.getControl().addStyleClass("sapUiSizeCondensed reportTable2 ");
                                            qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
                                            qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.None);
                                            qr.getControl().setAlternateRowColors(false);
                                            qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
                                            qr.getControl().setVisibleRowCount(10);
                                            qr.getControl().setRowHeight(20);

                                            this.obj.addContent(qr.getControl());

                                        },
                                        bat7OnSetFieldAddQry: function (qryObj, ps) {
                                            return thatForm.helperFunc.addQry1(qryObj, ps, "SLSUM01");

                                        },
                                        bat7OnSetFieldGetData: function (qryObj) {
                                            thatForm.helperFunc.getQry1(qryObj);

                                        }
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
    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
            this.sqlCols = {
                "customers": [
                    {
                        disp: "c_cus_no",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true
                    },
                    {
                        disp: "inv_refnm",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    }

                ],
                "locations": [
                    {
                        disp: "location_name",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    },

                ],
                "date": [
                    {
                        disp: "invdate",
                        exp: "invoice_date",
                        mGrouped: true,
                        _grpBy: true

                    },

                ],
                "items": [
                    {
                        disp: "refer",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    },
                    {
                        disp: "descr",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true
                    },

                ]

            };

            this.addCols = {
                "items": [
                    {
                        disp: "packing",
                        exp: "packd||'x'||pack ",
                        _grpBy: true
                    },
                    {
                        disp: "qty",
                        exp: "sum(allqty/pack)",
                    },
                ]
            };

        },
        getParas: function (repCode) {
            var colSpan = "XL2 L2 M2 S12";
            var strLst = "@customers/Customers,date/Date,locations/Locations,items/Items";
            return {
                fromdate: {
                    colname: "fromdate",
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                    title: '{\"text\":\"fromDate\",\"width\":\"15%\","textAlign":"End"}',
                    title2: "",
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
                    title: '{\"text\":\"toDate\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "customers",
                    },
                    list: strLst,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                },
                subgrpby: {
                    colname: "subgrpby",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"Sub Group\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "customers",
                    },
                    list: strLst,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: true,
                    dispInPara: true,
                }
            };
        },
        addQry1: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var sql = "select :grpCols ,nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* ((QTYOUT-QTYIN))),0) AMT  from joined where " +
                " invoice_date>=:parameter.fromdate and " +
                " invoice_date<=:parameter.todate " +
                " and invoice_code=21 group by :grpByCols";
            var eq = thatForm.frm.getFieldValue("SLSUM01@parameter.grpby");
            var seq = thatForm.frm.getFieldValue("SLSUM01@parameter.subgrpby");
            if (eq == "" || eq == seq)
                FormView.err("Cant group and sub group be same !");
            var cols = this.sqlCols[eq];
            var cols2 = this.sqlCols[seq];
            var acols = this.addCols[eq];
            var acols2 = this.addCols[seq];

            var strCol = "";
            var grpCol = "";
            for (var s in cols) {
                strCol += (strCol.length > 0 ? "," : "") + (cols[s].exp != "" ? cols[s].exp + " \"" + cols[s].disp.toUpperCase() + "\"" : cols[s].disp);
                if (Util.nvl(cols[s]._grpBy, false))
                    grpCol += (grpCol.length > 0 ? "," : "") + Util.nvl(cols[s].exp, cols[s].disp);
            }
            for (var s in cols2) {
                strCol += (strCol.length > 0 ? "," : "") + (cols2[s].exp != "" ? cols2[s].exp + " \"" + cols2[s].disp.toUpperCase() + "\"" : cols2[s].disp);
                if (Util.nvl(cols2[s]._grpBy, false))
                    grpCol += (grpCol.length > 0 ? "," : "") + Util.nvl(cols2[s].exp, cols2[s].disp);
            }
            for (var s in acols) {
                strCol += (strCol.length > 0 ? "," : "") + (acols[s].exp != "" ? acols[s].exp + " \"" + acols[s].disp.toUpperCase() + "\"" : acols[s].disp);
                if (Util.nvl(acols[s]._grpBy, false))
                    grpCol += (grpCol.length > 0 ? "," : "") + Util.nvl(acols[s].exp, acols[s].disp);
            }

            for (var s in acols2) {
                strCol += (strCol.length > 0 ? "," : "") + (acols2[s].exp != "" ? acols2[s].exp + " \"" + acols2[s].disp.toUpperCase() + "\"" : acols2[s].disp);
                if (Util.nvl(acols2[s]._grpBy, false))
                    grpCol += (grpCol.length > 0 ? "," : "") + Util.nvl(acols2[s].exp, acols2[s].disp);
            }


            sql = sql.replaceAll(":grpCols", strCol)
                .replaceAll(":grpByCols", grpCol);

            sql = thatForm.frm.parseString(sql);
            Util.doAjaxJson("bat7addQry?" + ps, {
                sql: sql,
                ret: "",
                data: "",
                repCode: qryObj.rep.code,
                repNo: qryObj.repNo,
                command: "",
                scheduledAt: "",
                p1: "",
                p2: "",
                qrNo: 1001,
            }, false).done(function (data) {
                if (!data.ret == "SUCCESS") {
                    ret = false;
                }
            });
            return true;
        },
        getQry1: function (qryObj) {
            var thatForm = this.thatForm;
            var that = this;
            var sett = sap.ui.getCore().getModel("settings").getData();
            Util.doAjaxJson("bat7getData", {
                sql: "",
                ret: "",
                data: "",
                repCode: qryObj.rep.code,
                repNo: qryObj.repNo,
                command: "",
                scheduledAt: "",
                p1: "",
                p2: "",
                qrNo: 1001,
            }, false).done(function (dt) {
                if (dt.ret == "SUCCESS" && thatForm.qr != undefined) {
                    var ld = thatForm.qr.mLctb;
                    var qr = thatForm.qr;
                    qr.setJsonStrMetaData("{" + dt.data + "}");
                    ld.cols[ld.getColPos("AMT")].mSummary = "SUM";
                    ld.cols[ld.getColPos("AMT")].mUIHelper.display_format = "MONEY_FORMAT";
                    var eq = thatForm.frm.getFieldValue("SLSUM01@parameter.grpby");
                    var cols = that.sqlCols[eq];
                    for (var g in cols)
                        ld.cols[ld.getColPos(cols[g].disp)].mGrouped = Util.nvl(cols[g].mGrouped, false);

                    qr.mLctb.parse("{" + dt.data + "}", true);
                    qr.loadData();
                }
            });
        }
    },
    loadData: function () {

    }

});