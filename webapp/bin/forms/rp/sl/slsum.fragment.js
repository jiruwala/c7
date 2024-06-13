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
                    printOrient: "",
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
                            // {
                            //     title: "Jasper Template ",
                            //     reportFile: "trans_1",
                            // }
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
                                            var r = UtilGen.dispTblRecsByDevice({ "S": 10, "M": 17, "L": 22, "XL": 30 });
                                            qr.getControl().setVisibleRowCount(r);
                                            qr.getControl().setRowHeight(20);
                                            qr.filterCols = ["DESCR", "INV_REFNM", "REFER", "LOCATION_NAME", "SLSMN_NAME", "MONTH"];
                                            qr.createToolbar(qr.disp_class, qr.filterCols,
                                                // EVENT ON APPLY PERSONALIZATION
                                                function (prsn, qv) {
                                                },
                                                // EVENT ON REVERT PERSONALIZATION TO ORIGINAL
                                                function (qv) {
                                                }
                                            );
                                            this.obj.addContent(qr.showToolbar.toolbar);
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
                        _grpBy: true,
                        _ordBy: "ASC"
                    },
                    {
                        disp: "inv_refnm",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true,
                    }

                ],
                "types": [
                    {
                        disp: "type",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true,
                        _ordBy: "ASC"
                    },
                    {
                        disp: "typedescr",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    }

                ],
                "parentitems": [
                    {
                        disp: "parentitem",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true,
                        _ordBy: "ASC"
                    },
                    {
                        disp: "parentitemdescr",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    }

                ],
                "month": [
                    {
                        disp: "month",
                        exp: "to_char(invoice_date,'rrrr/mm')",
                        mGrouped: true,
                        _grpBy: true,
                        _ordBy: "ASC"
                    },

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
                        _grpBy: true,
                        _ordBy: "ASC"

                    },

                ],
                "salesman": [
                    {
                        disp: "slsmn",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true,
                        _ordBy: "ASC"
                    },
                    {
                        disp: "slsmn_name",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true

                    }

                ],
                "items": [
                    {
                        disp: "refer",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true,
                        _ordBy: "ASC"

                    },
                    {
                        disp: "descr",
                        exp: "",
                        mGrouped: true,
                        _grpBy: true
                    },

                ],
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
                        exp: "sum((qtyout-qtyin)/pack)",
                    },
                    {
                        disp: "avg_price",
                        exp: "getavgprice(nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* (((QTYOUT-free_allqty)-QTYIN))),0) , SUM((QTYOUT-free_allqty)-QTYIN ),max(itpack)) ",
                    },
                ],
                "all": [
                    {
                        disp: "amt",
                        exp: "nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* (((QTYOUT-free_allqty)-QTYIN))),0) ",
                    },
                    {
                        disp: "cost",
                        exp: "nvl(SUM(pkcost* (QTYOUT-QTYIN) ),0) ",
                    },
                    {
                        disp: "profitamt",
                        exp: "nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* (((QTYOUT-free_allqty)-QTYIN))),0) - nvl(SUM(pkcost* (QTYOUT-QTYIN) ),0) ",
                    },
                    {
                        disp: "profitmargin",
                        exp: "round(getavgprice( nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* (((QTYOUT-free_allqty)-QTYIN))),0) - nvl(SUM(pkcost* (QTYOUT-QTYIN) ),0)   ,   nvl(SUM((((PRICE)-(DISC_AMT+DISC_AMT_GROSS) )/PACK)* (((QTYOUT-free_allqty)-QTYIN))),0)  ,  max(1) )*100,1) ||'%' ",
                    },



                ]
            };
            this.otherProps = {
                "customers": {
                    "c_cus_no": {
                        "mTitle": "txtCust",
                        "mUIHelper": {
                            "display_format": 60
                        }
                    },
                    "inv_refnm": {
                        "mTitle": "txtCust",
                        "mUIHelper": {
                            "display_format": 120
                        }
                    }
                },
                "items": {
                    "avg_price": {
                        "mTitle": "Avg Price",
                        "mUIHelper": {
                            "display_format": "MONEY_FORMAT",
                            "display_width": 70
                        }
                    },
                    "refer": {
                        "mTitle": "Refer",
                        "mUIHelper": {
                            "display_width": 100
                        }
                    },
                    "descr": {
                        "mTitle": "Descr",
                        "mUIHelper": {
                            "display_width": 120
                        }
                    },
                    "packing": {
                        "mTitle": "Packing",
                        "mUIHelper": {
                            "display_width": 60
                        }
                    },
                    "qty": {
                        "mTitle": "Pk Qty",
                        "mUIHelper": {
                            "display_width": 60
                        }
                    },
                },
                "date": {
                    "invdate": {
                        "mTitle": "Date",
                        "mUIHelper": {
                            "display_format": "SHORT_DATE_FORMAT"
                        }
                    }
                },
                "all": {
                    "cost": {
                        "mTitle": "Cost Amt",
                        "mSummary": "SUM",
                        "mUIHelper": {
                            "display_format": "MONEY_FORMAT",
                            "display_width": 90
                        }
                    },
                    "amt": {
                        "mTitle": "Amount",
                        "mSummary": "SUM",
                        "mUIHelper": {
                            "display_format": "MONEY_FORMAT",
                            "display_width": 90
                        }
                    },
                    "profitamt": {
                        "mTitle": "Profit Amt",
                        "mSummary": "SUM",
                        "mUIHelper": {
                            "display_format": "MONEY_FORMAT",
                            "display_width": 90
                        }
                    },
                    "profitmargin": {
                        "mTitle": "Profit Amt",
                        "mSummary": "SUM",
                        "mUIHelper": {
                            "display_format": "MONEY_FORMAT",
                            "display_width": 90
                        }
                    }
                },
            }
        },
        getParas: function (repCode) {
            var colSpan = "XL2 L2 M2 S12";
            var strLst = "@customers/Customers,month/Monthly,date/Date,locations/Locations,items/Items,salesman/Sales Person,parentitems/Group Items,types/Inv Type";
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
                ploc: {
                    colname: "ploc",
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.COMBOBOX,
                    title: '{\"text\":\"Location\",\"width\":\"15%\","textAlign":"End"}',
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
                        selectedKey: "ALL",
                    },
                    list: "select 'ALL' code,'ALL' name from dual union all select code,name from locations order by code",
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
                        selectedKey: "",
                    },
                    list: strLst,
                    edit_allowed: true,
                    insert_allowed: true,
                    require: false,
                    dispInPara: true,
                }
            };
        },
        addQry1: function (qryObj, ps) {
            var thatForm = this.thatForm;
            var sql = "select :grpCols from joined where " +
                " invoice_date>=:parameter.fromdate and " +
                " invoice_date<=:parameter.todate and " +
                " (location_code=':parameter.ploc' or ':parameter.ploc'='ALL') " +
                " and invoice_code in (21,12) group by :grpByCols ";
            var eq = thatForm.frm.getFieldValue("SLSUM01@parameter.grpby");
            var seq = thatForm.frm.getFieldValue("SLSUM01@parameter.subgrpby");
            if (eq == "" || eq == seq)
                FormView.err("Cant group and sub group be same !");
            var strCol = "";
            var grpCol = "";
            var ordCol = "";
            var fnaddCols = function (cols) {
                for (var s in cols) {
                    strCol += (strCol.length > 0 ? "," : "") + (cols[s].exp != "" ? cols[s].exp + " \"" + cols[s].disp.toUpperCase() + "\"" : cols[s].disp);
                    if (Util.nvl(cols[s]._grpBy, false))
                        grpCol += (grpCol.length > 0 ? "," : "") + Util.nvl(cols[s].exp, cols[s].disp);
                    if (Util.nvl(cols[s]._ordBy, "") != "")
                        ordCol += (ordCol.length > 0 ? "," : "") + Util.nvl(cols[s].exp, cols[s].disp) + " " + cols[s]._ordBy;
                }
            };
            fnaddCols(this.sqlCols[eq]);
            fnaddCols(this.sqlCols[seq]);
            fnaddCols(this.addCols[eq]);
            fnaddCols(this.addCols[seq]);
            fnaddCols(this.addCols["all"]);

            sql = sql.replaceAll(":grpCols", strCol)
                .replaceAll(":grpByCols", grpCol) + (ordCol.length > 0 ? " order by " + ordCol : "");


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
                    var seq = thatForm.frm.getFieldValue("SLSUM01@parameter.subgrpby");
                    var cols = that.sqlCols[eq];


                    if (seq != "")
                        for (var g in cols)
                            ld.cols[ld.getColPos(cols[g].disp)].mGrouped = Util.nvl(cols[g].mGrouped, false);

                    var fnSetCols = function (ocols) {
                        for (var g in ocols) {
                            var gfld = ocols[g];
                            var gUi = Util.nvl(gfld.mUIHelper, []);
                            for (var gk in gfld)
                                if (typeof (gfld[gk]) != 'object')
                                    ld.cols[ld.getColPos(g.toUpperCase())][gk] = gfld[gk];
                            for (var gu in gUi)
                                ld.cols[ld.getColPos(g.toUpperCase())]["mUIHelper"][gu] = gUi[gu];
                        }
                    }
                    fnSetCols(Util.nvl(that.otherProps[eq], []));
                    fnSetCols(Util.nvl(that.otherProps[seq], []));
                    fnSetCols(Util.nvl(that.otherProps["all"], []));

                    qr.mLctb.parse("{" + dt.data + "}", true);
                    qr.loadData();
                    if (qr.mLctb.rows.length > 0)
                        qr.getControl().setFirstVisibleRow(0);
                }
            });
        }
    },
    loadData: function () {

    }

});