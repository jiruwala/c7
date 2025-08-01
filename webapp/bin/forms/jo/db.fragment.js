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
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {

        };


        setTimeout(function () {

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
        this.createViewHeader();
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 10, "L": 12, "XL": 18 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        var filtercol = ["ORD_NO", "SO_STATUSS", "ORDACC", "INVOICE_NO", "INVOICE_DATE", "TYPEDESCR", "ORD_REF", "ORD_REFNM", "ADD_AMT", "DISC_AMT", "INV_AMT", "NET_AMT"]
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;
        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        this.loadData();
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
        var cmdCloseSo = new sap.m.Button({
            icon: "sap-icon://decline",
            text: Util.getLangText("closeSO"),
            press: function () {
                that.closeSO();
            }
        });

        var cmdClose = new sap.m.Button({
            icon: "sap-icon://decline",
            text: Util.getLangText("cmdClose"),
            press: function () {
                that.joApp.backFunction();
            }
        });
        var fe = [
            Util.getLabelTxt("txtTitSalesBrowser", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("txtDaysOff", "20%", "", "", "Center"), new sap.m.Text({ width: "0px" }),
            Util.getLabelTxt("txtCustSupp", "20%", "@", "", "Center"), new sap.m.Text({ width: "0px" }),
            Util.getLabelTxt("", "0px", ""), cb,
            Util.getLabelTxt("", "0px", "@"), txtCust,
            Util.getLabelTxt("", "0px", "@"), txtName,
            Util.getLabelTxt("", "0px", "@"), bt1,
            Util.getLabelTxt("", "0px", "@"), bt,
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
            cb.$().find("input").focus(function () {
                cb.$().find("input").attr("readonly", true);
            })
            kind.$().find("input").focus(function () {
                kind.$().find("input").attr("readonly", true);
            })

        });
        var tb = new sap.m.Toolbar({
            content: [
                cmdCloseSo, new sap.m.ToolbarSpacer(), cmdClose
            ]
        });
        this.mainPage.setSubHeader(tb)
        this.mainPage.addContent(cnt);
        setTimeout(() => {
            tb.$().css("cssText", "background-color:darkgrey!important;");
        }, 100);
    }
    ,
    loadData: function () {

        var that = this;
        var qv = this.qr;
        var cb = this.view.byId("cb1" + this.timeInLong);
        var kind = this.view.byId("kind" + this.timeInLong);
        var txtCust = this.view.byId("txtCust" + this.timeInLong);
        var dys = Util.nvl(UtilGen.getControlValue(cb), 15);
        var knd = Util.nvl(UtilGen.getControlValue(kind), 21);
        var cst = txtCust.getValue();

        var sql = "select *from (select o1.ord_no,o1.ord_date," +
            " (case when jo_active_from is not null and ord_flag=3 then 'Closed'  " +
            " when jo_active_from is not null and ord_flag!=3 then 'Active'  " +
            " else 'Pending' end ) status , " +
            " pur.invoice_no,o1.ord_ref,o1.ord_refnm," +
            "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * purqty, 2)) else 0 end)||'%' purp ," +
            "(case when ORDERDQTY>0 then (round((100 / ORDERDQTY) * DELIVEREDQTY, 2)) else 0 end)||'%' dlvp ," +
            "o1.ord_amt,o1.ord_discamt,o1.ord_amt-o1.ord_discamt netamt, o1.keyfld from pord1 o1," +
            " (select max(p.keyfld) kfld,max(p.invoice_no) invoice_no,po_keyfld  from pur1 p where p.invoice_code=21 and po_keyfld is not null group by p.po_keyfld) pur " +
            "  " +
            " where o1.ord_code =601 " +
            " and pur.po_keyfld(+) =o1.keyfld " +
            " order by o1.ord_date desc,o1.ord_no desc ) where (rownum <=^^list_key or ^^list_key=-1) ";
        sql = sql.replaceAll("^^list_key", dys);
        var dt = Util.execSQL(sql);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");

            Util.setColProperties(qv, "ORD_NO", {
                "mTitle": "txtOrdNo",
                "display_width": 75,
                "mSummary": "COUNT",
            });

            Util.setColProperties(qv, "STATUS", {
                "mTitle": "txtStatus",
                "display_width": 100,
            });


            Util.setColProperties(qv, "INVOICE_NO", {
                "mTitle": "referenceNo",
                "display_width": 75,
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


            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var kind = that.view.byId("kind" + that.timeInLong);
                var knd = UtilGen.getControlValue(kind);
                if (Util.nvl(knd, "") == "") return;
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "PO_KEYFLD")].getText());
                var frm = knd == 21 ? "bin.forms.sl.so" : "bin.forms.pur.forms.punpost";
                UtilGen.execCmd(frm + " formTitle=SO formType=page keyfld=" + kfld + " formSize=750px,500px", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    // sap.m.MessageToast.show("closing...");
                    that.loadData();
                });
            };

            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
        }

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



