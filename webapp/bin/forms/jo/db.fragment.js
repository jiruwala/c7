sap.ui.jsfragment("bin.forms.jo.db", {
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
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
            showSubHeader: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.createView();

        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {

        };


        setTimeout(function () {
            // that.loadData();
            that.showSecureStep();

            UtilGen.DBView.autoShowHideMenu(false, that.joApp);

        }, 100);

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
        this.createViewHeader();
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 10, "L": 12, "XL": 18 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
        qr.getControl().setFixedBottomRowCount(1);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        var filtercol = ["ORD_NO", "ACTION_STATUS", "STATUS1", "INVOICE_NO", "ORD_DATE", "TYPEDESCR", "ORD_REF", "ORD_REFNM", "ADD_AMT", "DISC_AMT", "ORD_AMT", "NET_AMT", "DISC_AMT"]
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;
        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());


    },

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        this.cust_code = '';
        Util.destroyID("txtTit" + this.timeInLong, this.view);
        Util.destroyID("txtName" + this.timeInLong);
        Util.destroyID("txtCust" + this.timeInLong);
        var tit = new sap.m.Title(this.view.createId("txtTit" + this.timeInLong), { text: "Sales" });
        var kind = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "kind" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "35%",
                value: "21",
                selectionChange: function (e) {
                    that.loadData();
                    var cnt = this;
                    setTimeout(function () {
                        cnt.$().find("input").attr("readonly", true);
                    }, 250);


                }
            }, "string", undefined, this.view, undefined, "@11/Purchase,21/Sales"
        );
        var cb = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "cb1" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "20%",
                value: "15",
                selectionChange: function (e) {
                    that.loadData();
                    var cnt = this;
                    setTimeout(function () {
                        cnt.$().find("input").attr("readonly", true);
                    }, 250);

                }
            }, "string", undefined, this.view, undefined, "@15/15 Last,30/30 Last,-1/All"
        );
        var txtCust = new sap.m.Input(this.view.createId("txtCust" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "20%", editable: false,

        });

        var txtName = new sap.m.Input(this.view.createId("txtName" + this.timeInLong), {
            textAlign: sap.ui.core.TextAlign.Begin, width: "40%", editable: false,

        });


        var bt1 = new sap.m.Button({
            icon: "sap-icon://value-help",
            width: "10%",
            press: function (e) {
                var btns = [];

                UtilGen.Search.do_quick_search(e, txtCust,
                    "select code,name title from c_ycust  order by path ",
                    "select code,name title from c_ycust where code=:CODE", txtName, function () {
                        that.loadData();
                    }, undefined, btns)
            }
        })
        var bt = new sap.m.Button({
            icon: "sap-icon://refresh",
            width: "10%",
            press: function () {
                txtName.setValue('');
                UtilGen.setControlValue(cb, '15', '15', false);
                txtCust.setValue('');
                that.loadData();
            }
        });
        var stat = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "stat" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "25%",
                value: "0",
                selectedKey: "0",
                selectionChange: function (e) {
                    var cbv = Util.extractNumber(that.view.byId("cb1" + that.timeInLong).getValue());
                    if (cbv != -1)
                        that.loadData();
                    var cnt = this;
                    setTimeout(function () {
                        cnt.$().find("input").attr("readonly", true);
                    }, 250);
                }
            }, "string", undefined, this.view, undefined, "@0/All,1/Not Approved,2/Approved,3/Closed"
        );
        var clickStep = function () {
            var cb = that.view.byId("cb1" + that.timeInLong);
            var stat = that.view.byId("stat" + that.timeInLong)
            UtilGen.setControlValue(cb, -1, -1, true);
            UtilGen.setControlValue(stat, 2, 2, true);
            that.loadData();
        }
        Util.destroyID("cmdApprove" + this.timeInLong, this.view);
        Util.destroyID("cmdRefresh" + this.timeInLong, this.view);
        Util.destroyID("cmdNewJo" + this.timeInLong, this.view);
        Util.destroyID("cmdClose" + this.timeInLong, this.view);
        Util.destroyID("cmdStepDes" + this.timeInLong, this.view);
        Util.destroyID("cmdStepDye" + this.timeInLong, this.view);
        Util.destroyID("cmdStepStk" + this.timeInLong, this.view);
        Util.destroyID("cmdStepProd" + this.timeInLong, this.view);


        var fromdate = UtilGen.addControl(fe, "From Date", sap.m.DatePicker, "fromdate" + this.timeInLong,
            {
                width: "20%",
                change: function () {
                    var cbv = Util.extractNumber(that.view.byId("cb1" + that.timeInLong).getValue());
                    if (cbv != -1)
                        that.loadData();
                }
            }, "date", undefined, this.view);
        var todate = UtilGen.addControl(fe, "To Date", sap.m.DatePicker, "todate" + this.timeInLong,
            {
                width: "20%",
                change: function () {
                    var cbv = Util.extractNumber(that.view.byId("cb1" + that.timeInLong).getValue());
                    if (cbv != -1)
                        that.loadData();
                }
            }, "date", undefined, this.view);


        var cmdNewJO = new sap.m.Button(this.view.createId("cmdNewJo" + this.timeInLong), {
            icon: "sap-icon://document",
            text: Util.getLangText("New JO"),
            press: function () {
                var frm = "bin.forms.jo.jo";
                UtilGen.execCmd(frm + " formTitle=JO formType=page formSize=80%,80% status=new", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    that.loadData();
                });
            }
        });
        var cmdStepDes = new sap.m.ToggleButton(this.view.createId("cmdStepDes" + this.timeInLong), {
            icon: "sap-icon://step",
            pressed: false,
            text: Util.getLangText("Design"),
            press: function () {
                clickStep();
            }
        });
        var cmdStepDye = new sap.m.ToggleButton(this.view.createId("cmdStepDye" + this.timeInLong), {
            icon: "sap-icon://step",
            pressed: false,
            text: Util.getLangText("Plate/Dye"),
            press: function () {
                clickStep();
            }
        });
        var cmdStepStk = new sap.m.ToggleButton(this.view.createId("cmdStepStk" + this.timeInLong), {
            icon: "sap-icon://step",
            pressed: false,
            text: Util.getLangText("Inventory"),
            press: function () {
                clickStep();
            }
        });
        var cmdStepProd = new sap.m.ToggleButton(this.view.createId("cmdStepProd" + this.timeInLong), {
            icon: "sap-icon://step",
            pressed: false,
            text: Util.getLangText("Production"),
            press: function () {
                clickStep();
            }
        });

        var cmdApprove = new sap.m.Button(this.view.createId("cmdApprove" + this.timeInLong), {
            icon: "sap-icon://accept",
            text: Util.getLangText("poApprove"),
            enabled: false,
            press: function () {
                that.doApprove();
            }
        });
        var cmdClose = new sap.m.Button(this.view.createId("cmdClose" + this.timeInLong), {
            icon: "sap-icon://decline",
            text: Util.getLangText("cmdClose"),
            press: function () {
                that.joApp.backFunction();
            }
        });
        var cmdRefresh = new sap.m.Button(this.view.createId("cmdRefresh" + this.timeInLong), {
            icon: "sap-icon://refresh",
            text: Util.getLangText("execute_query"),
            press: function () {
                that.loadData();
            }
        });

        var fe = [
            Util.getLabelTxt("txtTitJOLists", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("txtDaysOff", "20%", "", "", "Center"), new sap.m.Text({ width: "0px" }),
            Util.getLabelTxt("txtCustSupp", "20%", "@", "", "Center"), new sap.m.Text({ width: "0px" }),
            Util.getLabelTxt("", "0px", ""), cb,
            Util.getLabelTxt("", "0px", "@"), txtCust,
            Util.getLabelTxt("", "0px", "@"), txtName,
            Util.getLabelTxt("", "0px", "@"), bt1,
            Util.getLabelTxt("", "0px", "@"), bt,
            Util.getLabelTxt("txtStatus", "10%", ""), stat,
            Util.getLabelTxt("fromDate", "15%", "@"), fromdate,
            Util.getLabelTxt("toDate", "10%", "@"), todate,


        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 380, "M": 580, "L": 680, "XL": 780, "XXL": 800 },
            cssText: [
                "padding-left:2px ;" +
                "padding-top:2px;" +
                "border-style: groosve;" +
                "margin-left: 1%;" +
                "margin-right: 1%;" +
                "border-radius:20px;" +
                "margin-top: 2px;"
            ]
        }, "sapUiSizeCompact", "");
        UtilGen.setControlValue(cb, 15, 15, false);
        UtilGen.setControlValue(kind, 21, 21, false);
        setTimeout(function () {
            kind.$().find("input").attr("readonly", true);
            cb.$().find("input").attr("readonly", true);
            stat.$().find("input").attr("readonly", true);
            var fnro = function (obj) {
                obj.$().find("input").attr("readonly", true);
            };
            cb.$().find("input").focus(function () { fnro(cb) });
            stat.$().find("input").focus(function () { fnro(cb) });
            kind.$().find("input").focus(function () { fnro(cb) });

            var fdt = that.view.joListFromDate;
            var tdt = that.view.joListToDate;
            var st = that.view.joListStat;
            fromdate.setDateValue(Util.nvl(fdt, new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from)));
            todate.setDateValue(Util.nvl(tdt, new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_to)));
            stat.setSelectedKey(Util.nvl(st, '0'));
        });
        var tb = new sap.m.Toolbar({
            content: [
                cmdNewJO, cmdRefresh, new sap.m.ToolbarSpacer(), cmdStepDes, cmdStepDye, cmdStepStk, cmdStepProd,
                (that.oController.showClose == 'Y' ? cmdClose : new sap.m.Text())
            ]
        }).addStyleClass("toolBarBackgroundColor1");
        this.mainPage.setSubHeader(tb);
        this.mainPage.addContent(cnt);



    }
    ,
    doApprove: function () {
        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var qv = this.qr;
        var slices = qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = qv.getControl().getBinding("rows").aIndices;
        if (slices.length <= 0) FormView.err("No any JO is selected !");
        var sl = qv.getControl().getSelectedIndices();
        var odata = qv.getControl().getContextByIndex(sl[0]);
        if (odata == undefined) return;
        var data = (odata.getProperty(odata.getPath()));
        var kf = data["KEYFLD"];

        var checkCanApprove = function () {
            var cnt = Util.getSQLValue("select nvl(count(*),0) cnts from PORD_JO_EXP where exp_type=1 and keyfld=" + kf + "");
            if (cnt <= 0) {
                thatForm.showMaterials();
                FormView.err("Can't approve , must have any expenses in material estimation !");
            }
            var podt = UtilGen.JOFunc.checkJOStatus(kf, false);
            if (podt.ORD_FLAG != 1) FormView.err("Either JO is approved or closed !");
        };
        var update_rec = function () {
            var sq = "update pord1 set ord_flag=2,APPROVED_BY=':approved_by'," +
                "approved_time=sysdate where keyfld=" + kf;
            sq = sq.replaceAll(":approved_by", sett["LOGON_USER"]);
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                thatForm.loadData();
            }

        }
        checkCanApprove();
        Util.simpleConfirmDialog("After approved you may not edit delete this JO , continue ? ", function (oAction) {
            update_rec();
        });
    },
    loadData: function () {
        var that = this;
        var qv = this.qr;
        var cb = this.view.byId("cb1" + this.timeInLong);
        // var kind = this.view.byId("kind" + this.timeInLong).getSelectedKey();
        var stat = this.view.byId("stat" + this.timeInLong).getSelectedKey();
        var fromdt = UtilGen.getControlValue(this.view.byId("fromdate" + this.timeInLong));
        var todt = UtilGen.getControlValue(this.view.byId("todate" + this.timeInLong));
        var txtCust = this.view.byId("txtCust" + this.timeInLong);
        var stepDes = this.view.byId("cmdStepDes" + this.timeInLong).getPressed();
        var stepDye = this.view.byId("cmdStepDye" + this.timeInLong).getPressed();
        var stepStk = this.view.byId("cmdStepStk" + this.timeInLong).getPressed();
        var stepProd = this.view.byId("cmdStepProd" + this.timeInLong).getPressed();
        var dys = Util.nvl(UtilGen.getControlValue(cb), 15);
        // var knd = Util.nvl(UtilGen.getControlValue(kind), 21);
        var cst = txtCust.getValue();
        var stps = [];
        var sw = "";

        stepDes ? stps.push(" JO_DESIGN_USER is  null ") : "";
        stepDye ? stps.push(" JO_DYE_USER is null ") : "";
        stepStk ? stps.push(" JO_STOCK_USER is null ") : "";
        stepProd ? stps.push(" JO_PROD_USER is null and jo_active_from is not null ") : "";

        for (var si in stps)
            sw += (sw.length > 0 ? " and " : "") + stps[si];


        var sql = "select *from (select o1.ord_no,o1.ord_date," +
            "decode(o1.ord_flag,1,'Not-Approved',2,'Approved',3,'Closed') status1, " +
            " (case when jo_active_from is not null and ord_flag=3 then 'Not-Active'  " +
            " when jo_active_from is not null and ord_flag!=3 then 'Active'  " +
            " else 'Pending' end ) action_status ,usernm,approved_by, " +
            " to_char(o1.JO_ACTIVE_FROM,'dd/mm HH24.MI') jo_active_from ," +
            " to_char(o1.ord_shpdt,'dd/mm/rr') duedate ," +
            // " UNISTR('\\2714') steps_done , " +
            " pur.invoice_no,o1.ord_ref,o1.ord_refnm," +
            "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * purqty, 2)) else 0 end)||'%' purp ," +
            "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * DELIVEREDQTY, 2)) else 0 end)||'%' dlvp ," +
            "o1.ord_amt,o1.ord_discamt,o1.ord_amt-o1.ord_discamt netamt, o1.keyfld,ORD_FLAG, " +
            " jo_design_user,jo_dye_user,jo_stock_user,jo_prod_user from pord1 o1," +
            " (select max(p.keyfld) kfld,max(p.invoice_no) invoice_no,po_keyfld  from pur1 p where p.invoice_code=21 and po_keyfld is not null group by p.po_keyfld) pur " +
            "  " +
            " where o1.ord_code =601 and " +
            " o1.ord_date>=" + Util.toOraDateString(fromdt) +
            " and o1.ord_date<=" + Util.toOraDateString(todt) +
            " and (o1.ord_flag= '" + stat + "' or '" + stat + "'=0 ) " +
            " and  (o1.ord_ref= '" + cst + "' or '" + cst + "' is null ) " +
            " and pur.po_keyfld(+) =o1.keyfld " +
            (sw.length > 0 ? " and " + sw : "") +
            " order by o1.ord_date desc,o1.ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1) ";
        sql = sql.replaceAll("^^list_key", dys);
        var dt = Util.execSQL(sql);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");

            Util.setColProperties(qv, "KEYFLD", {
                "display_width": 0,
            });
            Util.setColProperties(qv, "ORD_FLAG", {
                "display_width": 0,
            });

            Util.setColProperties(qv, "ORD_NO", {
                "mTitle": "txtOrdNo",
                "display_align": "center",
                "display_width": 100,
                "mSummary": "COUNT",
            });
            Util.setColProperties(qv, "USERNM", {
                "mTitle": "User",
                "display_align": "center",
                "display_width": 50,
            });
            Util.setColProperties(qv, "APPROVED_BY", {
                "mTitle": "Approved",
                "display_align": "center",
                "display_width": 60,
            });

            Util.setColProperties(qv, "JO_ACTIVE_FROM", {
                "mTitle": "txtJoActiveFrom",
                "display_width": 120
            });


            Util.setColProperties(qv, "STATUS1", {
                "mTitle": "txtStatus",
                "display_width": 120,
            });


            Util.setColProperties(qv, "ACTION_STATUS", {
                "mTitle": "joActionStatus",
                "display_width": 100,
            });

            Util.setColProperties(qv, "INVOICE_NO", {
                "mTitle": "referenceNo",
                "display_width": 100,
                "mSummary": "COUNT",
            });

            Util.setColProperties(qv, "ORD_DATE", {
                "mTitle": "ordDate",
                "display_format": "SHORT_DATE_FORMAT",
                "display_width": 100,
            });

            Util.setColProperties(qv, "ORD_REF", {
                "mTitle": "refCode",
                "display_width": 100,
            });

            Util.setColProperties(qv, "ORD_REFNM", {
                "mTitle": "refName",
                "display_width": 250,
            });

            Util.setColProperties(qv, "PURP", {
                "mTitle": "txtSold",
                "display_width": 80,
            });

            Util.setColProperties(qv, "DLVP", {
                "mTitle": "txtDeliver",
                "display_width": 80,
            });

            Util.setColProperties(qv, "ORD_AMT", {
                "display_format": "MONEY_FORMAT",
                "mTitle": "amountTxt",
                "display_width": 120,
            });
            Util.setColProperties(qv, "ORD_DISCAMT", {
                "display_format": "MONEY_FORMAT",
                "mTitle": "txtDisc",
                "display_width": 100,
            });
            Util.setColProperties(qv, "NETAMT", {
                "display_format": "MONEY_FORMAT",
                "mTitle": "txtNetAmt",
                "display_width": 100,
                "mSummary": "SUM"
            });
            Util.setColProperties(qv, "JO_DESIGN_USER", {
                "mTitle": "Design",
                "display_width": 60,
            });
            Util.setColProperties(qv, "JO_DYE_USER", {
                "mTitle": "PLATE",
                "display_width": 60,
            });
            Util.setColProperties(qv, "JO_STOCK_USER", {
                "mTitle": "Stock",
                "display_width": 60,
            });
            Util.setColProperties(qv, "DUEDATE", {
                "mTitle": "Due Date",
                "display_width": 75,
            });

            Util.setColProperties(qv, "JO_PROD_USER", {
                "mTitle": "Productio",
                "display_width": 70,
            });


            qv.onRowRender = function (qv, dispRow, rowno, currentRowContext, startCell, endCell) {
                var oModel = this.getControl().getModel();
                var flg = Util.extractNumber(oModel.getProperty("ORD_FLAG", currentRowContext));
                var dt = Util.extractNumber(oModel.getProperty("JO_ACTIVE_FROM", currentRowContext));
                var st1 = oModel.getProperty("ACTION_STATUS", currentRowContext);
                var doRender = function (clr, bkclr) {
                    for (var i = startCell; i < endCell; i++) {
                        if (clr != "") {
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("color", clr);
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("color", clr);
                        }
                        if (bkclr != "") {
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("background-color", bkclr);
                            qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("background-color", bkclr);
                        }

                    }

                }
                if (flg == 2 && Util.nvl(st1, "") != "Pending")
                    doRender("darkblue", "lightgreen");
                if (flg == 2 && Util.nvl(st1, "") == "Pending")
                    doRender("darkblue", "#d0f0c0");

                if (flg == 3)
                    doRender("", "lightgrey");
                if (flg == 1)
                    doRender("darkblue", "#ffffe0");


            }
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                // if (Util.nvl(knd, "") == "") return;
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "KEYFLD")].getText());
                var frm = "bin.forms.jo.jo";
                UtilGen.execCmd(frm + " formTitle=JO formType=dialog formSize=80%,80% keyfld=" + kfld + "", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    // sap.m.MessageToast.show("closing...");
                    that.loadData();
                });
            };
            qv.getControl().attachRowSelectionChange(function (ev) {
                if (qv.mLctb.cols.length < 0) return;
                if (!ev.getParameters().userInteraction)
                    return;

                var sl = qv.getControl().getSelectedIndices();
                var odata = qv.getControl().getContextByIndex(sl[0]);
                if (odata == undefined) return;
                var data = (odata.getProperty(odata.getPath()));
                var cmdApprove = that.view.byId("cmdApprove" + that.timeInLong);
                cmdApprove.setEnabled(false);
                if (data["ORD_FLAG"] == 1) cmdApprove.setEnabled(true);

            });
            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
            that.view.joListFromDate = fromdt;
            that.view.joListToDate = todt;
            that.view.joListStat = stat;
            that.updateStepsDone();
        }

    },
    showSecureStep: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var secCmds = Util.nvl(sett["SHOW_JO_STEPS_ONLY"], "");
        var setCmd = function (cmd, sett) {
            cmd.setPressed(sett);
            cmd.setEnabled(sett);
        }
        var setCounts = function (cmd, str, lbl) {
            var dt = Util.getSQLValue("select nvl(count(*),0) from pord1 where ord_code=601 and  ord_flag=2 and " + str);
            cmd.setText(lbl + " (" + dt + ")");
        }
        if (secCmds != "") {
            var stepDes = this.view.byId("cmdStepDes" + this.timeInLong);
            var stepDye = this.view.byId("cmdStepDye" + this.timeInLong);
            var stepStk = this.view.byId("cmdStepStk" + this.timeInLong);
            var stepProd = this.view.byId("cmdStepProd" + this.timeInLong);
            setCmd(stepDes, false);
            setCmd(stepDye, false);
            setCmd(stepStk, false);
            setCmd(stepProd, false);
            if (secCmds.indexOf("\"DYE\"") >= 0) setCmd(stepDye, true);
            if (secCmds.indexOf("\"STOCK\"") >= 0) setCmd(stepStk, true);
            if (secCmds.indexOf("\"PROD\"") >= 0) setCmd(stepProd, true);
            if (secCmds.indexOf("\"DES\"") >= 0) setCmd(stepDes, true);
            that.loadData();
        } else that.loadData();
        setTimeout(() => {
            var stepDes = this.view.byId("cmdStepDes" + this.timeInLong);
            var stepDye = this.view.byId("cmdStepDye" + this.timeInLong);
            var stepStk = this.view.byId("cmdStepStk" + this.timeInLong);
            var stepProd = this.view.byId("cmdStepProd" + this.timeInLong);
            setCounts(stepDes, " JO_DESIGN_USER is null ", "Design ");
            setCounts(stepDye, " JO_DYE_USER is null ", "Plates/Dye ");
            setCounts(stepStk, " JO_STOCK_USER is null ", "Stocks ");
            setCounts(stepProd, " JO_PROD_USER is null and jo_active_from is not null ", "Production ");
        }, 1000);
    },
    updateStepsDone: function () {

    },
    closeSO: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var qv = that.qr;
        var sos = {};
        var slices = qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = qv.getControl().getBinding("rows").aIndices;
        if (slices.length <= 0) FormView.err("No any SO is selected !");
        var getCloseSql = function (pkfld, prem) {
            var rmrk = Util.nvl(prem, "");
            var cnt = Util.getSQLValue("select nvl(count(*),0) from order1 where ord_code=9 and saleinv is null and pord1_keyfld=" + pkfld);
            cnt = Util.extractNumber(cnt);
            if (cnt > 0) FormView.err(cnt + "  delivery(s) not invoiced, check  SO # " + sos[pkfld]);
            var str = (" C7_SO_CLOSE(:pkfld,:rmrk,:user,sysdate); ").replaceAll(":pkfld", pkfld)
                .replaceAll(":rmrk", Util.quoted(rmrk))
                .replaceAll(":user", Util.quoted(sett["LOGON_USER"]));
            return str;
        }
        var exec = function () {
            var sqls = "";
            var cnts = 0;
            var qv = that.qr;
            var slices = qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
            var slicesof = qv.getControl().getBinding("rows").aIndices;
            if (slices.length <= 0) FormView.err("No any SO is selected !");
            sos = {};
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.nvl(Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "PO_KEYFLD"), undefined)
                var podt = UtilGen.JOFunc.checkJOStatus(kfld, false);
                if (podt.ORD_FLAG != 2) {
                    var kfld = Util.nvl(Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "PO_KEYFLD"), undefined)
                }

                kfld = (kfld != undefined) ? Util.extractNumber(kfld) : undefined;
                var sono = Util.nvl(Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "ORD_NO"), undefined)
                sono = (sono != undefined) ? Util.extractNumber(sono) : undefined;
                sos[kfld] = sono;
            }
            var sosa = Object.keys(sos);
            for (var i = 0; i < sosa.length; i++)
                sqls += getCloseSql(sosa[i]);

            if (sosa.length > 0) {
                var dt = Util.execSQL("begin" + sqls + " end;");
                if (dt.ret == "SUCCESS") {
                    FormView.msgSuccess(sosa.length + " SO(s) have closed successfully...");
                    that.loadData();
                }
            }
        }
        Util.simpleConfirmDialog("Closing SO can not edit or do any changes, continue ?", function (oAction) {
            exec();
        }, undefined, undefined, "OK");

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

});



