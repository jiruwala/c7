sap.ui.jsfragment("bin.forms.sl.unpost", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.keyfld, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.qc_change = {};
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

        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {

        };
        this.showCommands();
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
        this.createDetails();


        this.loadData();
    },
    showCommands: function () {
        var that = this;
        setTimeout(function () {
            Util.destroyID("cmdDel" + that.timeInLong, that.view);
            Util.destroyID("cmdPrint" + that.timeInLong, that.view);
            Util.destroyID("cmdUpd" + that.timeInLong, that.view);
            Util.destroyID("cmdClose" + that.timeInLong, that.view);
            var updDelStat = function (enb) {
                if (that.view.byId("cmdDel" + that.timeInLong) != undefined)
                    that.view.byId("cmdDel" + that.timeInLong).setEnabled(enb);
                if (that.view.byId("cmdUpd" + that.timeInLong) != undefined)
                    that.view.byId("cmdUpd" + that.timeInLong).setEnabled(enb);
                that.add_amt.setEditable(enb);
                that.disc_amt.setEditable(enb);
                that.memo.setEditable(enb);
                that.ctg.setEditable(enb);
                that.txtSalesp.setEditable(enb);
                that.txtPoNo.setEditable(enb);

            }
            var bts = [
                new sap.m.Button(that.view.createId("cmdDel" + that.timeInLong), {
                    text: Util.getLangText("delRec").toUpperCase(),
                    press: function () {
                        that.deleteInv();

                    }
                }).addStyleClass("redTextBtn"),
                new sap.m.Button(that.view.createId("cmdPrint" + that.timeInLong), {
                    width: "150px",
                    text: Util.getLangText("Print"),
                    press: function () {
                        that.printInv();
                    }
                }),
                new sap.m.Button(that.view.createId("cmdUpd" + that.timeInLong), {
                    text: Util.getLangText("updateInv"),
                    press: function () {
                        Util.simpleConfirmDialog("Do you want to update this Sales Invoice ?", function (oAction) {
                            that.updateInv();
                            that.loadData(false);
                        });

                    }
                }),
                new sap.m.Button(that.view.createId("cmdClose" + that.timeInLong), {
                    text: Util.getLangText("cmdClose"),
                    press: function () {
                        if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                            that.oController.getForm().getParent().close();
                    }
                }),

            ];
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog) {
                var dlg = that.oController.getForm().getParent();
                dlg.setShowHeader(false);
                for (var b in bts)
                    dlg.addButton(bts[b]);
            }

            var sodt = UtilGen.SalesOrderFunc.checkSOStatus(that.soKf, false);
            updDelStat(true);
            if (sodt.ORD_FLAG == 3) updDelStat(false);
            if (sodt.ORDACC == UtilGen.SalesOrderFunc.initAction.saleInvs)
                updDelStat(false);


        }, 10);
    },
    createDetails: function () {
        var that = this;
        var thatForm = this;
        this.qc = new QueryView("qvUp" + thatForm.timeInLong);
        var tb = new sap.m.Toolbar();
        // tb.addContent(new sap.m.Button({
        //     text: Util.getLangText("addDlvToInv"),
        //     icon: "sap-icon://add",
        //     press: function () {
        //         that.addDlvToInv();
        //     }
        // }));
        // tb.addContent(new sap.m.Button({
        //     text: Util.getLangText("removeDlvToInv"),
        //     press: function () {
        //         that.removeDlvToInv();

        //     }
        // }));

        that.qc.getControl().setEditable(false);
        this.qc.getControl().view = that.view;
        this.qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        this.qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        this.qc.getControl().setFixedBottomRowCount(0);
        this.qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        this.qc.getControl().setVisibleRowCount(4);
        this.qc.insertable = false;
        this.qc.deletable = false;
        this.mainPage.addContent(tb);
        this.mainPage.addContent(this.qc.getControl());
    },
    createViewHeader: function () {
        var that = this;
        var fe = [];
        var dm = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        var fillTypes = function (e) {
            var vl = UtilGen.getControlValue(e.getSource());
            Util.fillCombo(that.invoice_type, "select no code,descr name from invoicetype where location_code='" + vl + "' order by no ");
            that.invoice_type.setSelectedIndex(0);
        }
        var calcChange = function () {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var gamt = Util.extractNumber(that.gross_amt.getValue());
            var aamt = Util.extractNumber(that.add_amt.getValue());
            var damt = Util.extractNumber(that.disc_amt.getValue());
            var netamt = (gamt + aamt) - damt;
            that.net_amt.setValue(df.format(netamt));
        }
        this.location_code = UtilGen.addControl(dm, "", sap.m.ComboBox, "location" + this.timeInLong,
            {
                editable: false,
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                textAlign: sap.ui.core.TextAlign.Center,
                width: "24%",
                selectionChange: function (e) {
                    fillTypes(e);
                }
            }, "string", undefined, this.view, undefined, "select code,name from locations order by code");

        this.invoice_type = UtilGen.addControl(dm, "", sap.m.ComboBox, "invTYpes" + this.timeInLong,
            {
                editable: false,
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}-{CODE}", key: "{CODE}" }),
                    templateShareable: true
                },
                textAlign: sap.ui.core.TextAlign.Center,
                width: "24%",
                selectionChange: function (e) {

                },
            }, "string", undefined, this.view, undefined, "select '' code,'' name from dual");



        this.invoice_no = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: false });
        this.soNo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "12%", editable: false });
        this.keyfld = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "12%", editable: false });
        this.invoice_date = new sap.m.DatePicker({ editable: false });

        this.cust_code = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false });
        this.cust_name = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.End, width: "99%", editable: false }).addStyleClass("yellow");
        this.branch_no = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false });
        this.branch_name = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.End, width: "99%", editable: false }).addStyleClass("yellow");

        this.gross_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: false });
        this.add_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: true, change: calcChange });
        this.disc_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: true, change: calcChange });
        this.net_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: false }).addStyleClass("yellow");

        this.memo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%", editable: true });
        this.ctg = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%", editable: true });
        this.txtSalesp = new sap.m.ComboBox({
            width: "35%",
            customData: [{ key: "" }],
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{NAME}-{CODE}", key: "{CODE}" }),
                templateShareable: true
            },
            selectionChange: function (ev) {
            },
            selectedKey: ""
        });
        this.txtPoNo = new sap.m.Input({ width: "25%" });

        Util.fillCombo(that.txtSalesp, "select no code ,name from salesp where type='S' order by no");

        var fe = [
            Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("Sales Invoice Info", "100%", "#", "redText", "End"),
            Util.getLabelTxt("", "1%", ""), this.cust_name,
            Util.getLabelTxt("locationTxt", "24%", ""), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtOrdType", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtInvNo", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("slsOrdN", "12%", "@"), Util.getEmptyLabel("0px"),
            Util.getLabelTxt("keyID", "12%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("", "1%", "", "", "Center"), this.location_code,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.invoice_type,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.invoice_no,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.soNo,
            Util.getLabelTxt("", "0px", "@", "", "Center"), this.keyfld,
            // Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("txtGrossAmt", "24%"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtAddAmt", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtDisc", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtNetAmt", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("", "1%", "", "", "Center"), this.gross_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.add_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.disc_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.net_amt,
            // Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("txtAddAmtDescr", "25%", ""), this.memo,
            Util.getLabelTxt("txtDiscAmtDescr", "25%", ""), this.ctg,
            Util.getLabelTxt("txtSalesPerson", "20%", ""), this.txtSalesp,
            Util.getLabelTxt("txtPoNo", "20%", "@"), this.txtPoNo,
        ];
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 380, "M": 580, "L": 650, "XL": 650 },
            cssText: [
                "padding-left:5px ;" +
                "padding-top:3px;" +
                "border-style: groosve;" +
                "margin-left: 1%;" +
                "margin-right: 1%;" +
                "border-radius:20px;" +
                "margin-top: 3px;"
            ]
        }, "sapUiSizeCompact", "");

        // cnt.addContent(new sap.m.VBox({ height: "40px" }));

        this.mainPage.addContent(cnt);

        Util.navEnter(fe);
        this.location_code.setSelectedIndex(0);
    }
    ,
    loadData: function (pReload) {

        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var reload = Util.nvl(pReload, false);


        if (this.qryStr == "") return;

        var dt = Util.execSQL("select *from PUR1 where Keyfld='" + this.qryStr + "'");
        if (dt.ret == "SUCCESS") {
            var dtx = JSON.parse("{" + dt.data + "}").data;
            this.location_code.setValue("");
            this.invoice_no.setValue("");
            this.soNo.setValue("");
            this.invoice_type.setValue("");
            this.keyfld.setValue("");
            this.cust_code.setValue("");
            this.cust_name.setText("");
            this.branch_no.setValue("");

            this.gross_amt.setValue(df.format(0));
            this.add_amt.setValue(df.format(0));
            this.disc_amt.setValue(df.format(0));
            this.net_amt.setValue(df.format(0));
            this.ctg.setValue("");
            this.memo.setValue("")

            if (dtx.length <= 0) FormView.err("Invoice not loaded # " + this.qryStr);
            if (Util.nvl(dtx[0].PO_KEYFLD, undefined) == undefined) FormView.err("SO not found ! invoiced keyfld # " + this.qryStr);

            that.soKf = dtx[0].PO_KEYFLD;
            var gamt = dtx[0].INV_AMT;
            var aamt = ((!reload) ? dtx[0].DEPTNO : Util.extractNumber(that.add_amt.getValue()));
            var damt = ((!reload) ? dtx[0].DISC_AMT : Util.extractNumber(that.disc_amt.getValue()));
            var netamt = (gamt + aamt) - damt;
            var bnm = Util.getSQLValue("select b_name from cbranch where code='" + dtx[0].C_CUS_NO + "' and brno=" + dtx[0].C_BRANCH_NO);
            this.location_code.setSelectedKey(dtx[0].LOCATION_CODE)
            this.txtSalesp.setSelectedKey(dtx[0].SLSMN);
            this.txtPoNo.setValue(dtx[0].REFERENCE_INFORMATION);
            this.soNo.setValue(Util.getSQLValue("select ord_no from pord1 where ord_code=21 and keyfld=" + that.soKf));
            this.invoice_no.setValue(dtx[0].INVOICE_NO);
            this.invoice_type.setValue(dtx[0].TYPE);
            this.keyfld.setValue(dtx[0].KEYFLD);
            this.cust_code.setValue(dtx[0].C_CUS_NO);
            this.branch_no.setValue(dtx[0].C_BRANCH_NO);
            this.branch_name.setText(bnm);
            this.cust_name.setText(dtx[0].INV_REFNM + " / " + dtx[0].C_CUS_NO + " / " + dtx[0].C_BRANCH_NO + " - " + bnm);
            this.gross_amt.setValue(df.format(gamt));
            this.add_amt.setValue(df.format(aamt));
            this.invoice_date.setDateValue(new Date(dtx[0].INVOICE_DATE.replaceAll(".", ":")));
            this.disc_amt.setValue(df.format(damt));
            this.ctg.setValue(((!reload) ? dtx[0].CTG : Util.extractNumber(that.ctg.getValue())));
            this.memo.setValue(((!reload) ? dtx[0].MEMO : Util.extractNumber(that.memo.getValue())));
            this.net_amt.setValue(df.format(netamt));
            that.loadData_details(reload);
            this.qc_change = {};
        }


    },
    loadData_details: function (pReload, changeAmt, changeAmtAsk) {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var reload = Util.nvl(pReload, false);
        if (this.qryStr == "") return;

        var dt = Util.execSQL("select 0 pos,max((select max(ord_no) from c_order1 where c_order1.keyfld=p.ordwas)) ord_no ," +
            " max((select max(ord_date) from c_order1 where c_order1.keyfld=p.ordwas)) ord_date ," +
            " (sum((p.price/p.pack)*p.allqty)/sum(p.allqty)) price,sum((p.price/p.pack)*p.allqty) amount,p.ordwas, " +
            " sum(add_amt_gross*allqty) add_amt, sum(disc_amt_gross*allqty) disc_amt, 0 net_amt " +
            " from PUR2 p " +
            " where  p.invoice_code=21 and " +
            " p.Keyfld='" + this.qryStr + "'" +
            " group by 0,ordwas" +
            " ORDER BY 2");

        if (dt.ret == "SUCCESS") {
            that.qc.setJsonStrMetaData("{" + dt.data + "}");
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("POS")].getMUIHelper().display_width = 40;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ORD_NO")].getMUIHelper().display_width = 70;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_width = 80;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("PRICE")].getMUIHelper().display_width = 70;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("AMOUNT")].getMUIHelper().display_width = 80;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ADD_AMT")].getMUIHelper().display_width = 70;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("DISC_AMT")].getMUIHelper().display_width = 70;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("NET_AMT")].getMUIHelper().display_width = 80;
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ORDWAS")].getMUIHelper().display_width = 0;
            // that.qc.mLctb.cols[that.qc.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("PRICE")].getMUIHelper().display_format = "MONEY_FORMAT";
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("AMOUNT")].getMUIHelper().display_format = "MONEY_FORMAT";
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("NET_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ADD_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            that.qc.mLctb.cols[that.qc.mLctb.getColPos("DISC_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";


            that.qc.mLctb.cols[that.qc.mLctb.getColPos("ORD_NO")].commandLinkClick = function (obj) {
                var tbl = obj.getParent().getParent();
                var mdl = tbl.getModel();
                var rr = tbl.getRows().indexOf(obj.getParent());
                var rowStart = tbl.getFirstVisibleRow();
                var kfld = parseFloat(tbl.getRows()[rr].getCells()[UtilGen.getTableColNo(tbl, "ORDWAS")].getText());

                UtilGen.execCmd("bin.forms.sl.sodlv formTitle=DELIVERY formType=dialog keyfld=" + kfld + " formSize=80%,70%", UtilGen.DBView, UtilGen.DBView, UtilGen.DBView.newPage, function () {
                    that.loadData_details(true, true, true);

                });
            };


            that.qc.mLctb.parse("{" + dt.data + "}", true);
            that.qc.loadData();
            that.recalcGross(true, Util.nvl(changeAmt, false), Util.nvl(changeAmtAsk, false));
        }
    },
    recalcGross: function (rfrsh, addDisc, askBfrAddDisc) {
        var that = this;
        var ld = that.qc.mLctb;
        var tot = add = disc = 0;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        for (var i = 0; i < ld.rows.length; i++) {
            var ada = Util.extractNumber(ld.getFieldValue(i, "ADD_AMT"));
            var dia = Util.extractNumber(ld.getFieldValue(i, "DISC_AMT"));
            var gr = Util.extractNumber(ld.getFieldValue(i, "AMOUNT"));
            tot += gr;
            add += ada;
            disc += dia;
            ld.setFieldValue(i, "NET_AMT", (gr + ada) - dia);
            ld.setFieldValue(i, "POS", i + 1);
        }

        this.gross_amt.setValue(df.format(tot));
        var gamt = tot;

        var changeAmt = function () {
            that.add_amt.setValue(df.format(add));
            that.disc_amt.setValue(df.format(disc));
            that.net_amt.setValue(df.format((tot + add) - disc));
        }

        var calcAmts = function () {
            var aamt = Util.extractNumber(that.add_amt.getValue());
            var damt = Util.extractNumber(that.disc_amt.getValue());
            var netamt = (gamt + aamt) - damt;
            that.net_amt.setValue(df.format(netamt));
            if (Util.nvl(rfrsh, false))
                that.qc.updateDataToControl();

        }
        if ((add > 0 || disc > 0) && addDisc) {
            // if (askBfrAddDisc)
            //     Util.simpleConfirmDialog("Do you want to change ADDITION AND DISCOUNT AMOUNT ? ", function (oAction) {
            //         changeAmt();
            //         calcAmts();
            //     }, function () { calcAmts(); });
            // else {
            //     changeAmt();
            //     calcAmts();
            // }
            calcAmts();
        } else {
            calcAmts();
        }
    },
    removeDlvToInv: function () {
        var that = this;
        var sl = that.qc.getControl().getSelectedIndices();
        if (sl.length <= 0) FormView.err("Must select row(s) !");
        for (var s = sl.length - 1; s >= 0; s--)
            that.qc.mLctb.deleteRow(sl[s]);
        if (that.qc_change.add == undefined) that.qc_change.add = [];

        that.recalcGross(true);
    },
    addDlvToInv: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

        if (that.qc_change.add == undefined)
            that.qc_change.add = [];
        var kfs = "";
        that.qc.updateDataToTable();
        var addRec = function (data) {
            if (data.length == 0)
                return;
            var kfs = "";
            var ld = that.qc.mLctb;
            for (var d in data) {
                var rn = ld.addRow();
                ld.setFieldValue(rn, "ORD_NO", data[d].ORD_NO);
                ld.setFieldValue(rn, "ORD_DATE", data[d].ORD_DATE);
                ld.setFieldValue(rn, "PRICE", data[d].AVG_PRICE + "");
                ld.setFieldValue(rn, "AMOUNT", data[d].AMOUNT + "");
                ld.setFieldValue(rn, "ADD_AMT", data[d].ADD_AMT + "");
                ld.setFieldValue(rn, "DISC_AMT", 0);
                ld.setFieldValue(rn, "NET_AMT", Util.extractNumber(data[d].AMOUNT) + Util.extractNumber(data[d].ADD_AMT));
                ld.setFieldValue(rn, "ORDWAS", data[d].KEYFLD + "");
                that.qc_change.add.push(data[d].KEYFLD);
            }
            that.recalcGross(true, true, true);


        };
        var ld = that.qc.mLctb;
        for (var ki = 0; ki < ld.rows.length; ki++)
            kfs += (kfs.length > 0 ? "," : "") + ld.getFieldValue(ki, "ORDWAS");

        var sqw = (kfs.length > 0 ? " and o.keyfld not in (" + kfs + ")" : "");
        var sq = "SELECT   o.periodcode," +
            "              location_code," +
            "               o.ORD_NO," +
            "               o.ord_date," +
            "               COUNT (o.ord_no) counting," +
            "               sum(tqty) tqty , " +
            "               (GETAVGPRICEDLV(o.keyfld,'N')) AVG_PRICE ," +
            "               0 ADD_AMT," +
            "               GETSUMPRICEDLV(o.keyfld,'N') AMOUNT," +
            "               SUM(SALE_PRICE*TQTY) NET_AMT, " +
            "               o.ord_discamt," +
            "               cbranch.b_name branchname," +
            "               GETAVGPRICEDLV(o.keyfld) PRICE2 ," +
            "               GETSUMPRICEDLV(o.keyfld) AMT2 ," +
            "               o.KEYFLD" +
            "        FROM   c_order1 o , " +
            "               items ," +
            "               cbranch " +
            "        WHERE o.saleinv IS NULL" +
            "                      AND (o.ord_discamt = cbranch.brno " +
            "                    AND o.ord_ref = cbranch.code) " +
            "               AND ( (items.REFERENCE = o.ord_ship))" +
            " and o.ord_code=9 " +
            " and ord_ref=" + Util.quoted(that.cust_code.getValue()) +
            " " + sqw +
            "    GROUP BY   o.periodcode," +
            "               0," +
            "               location_code," +
            "               o.ord_date ," +
            "               o.ord_discamt ," +
            "               cbranch.b_name," +
            "               ord_code," +
            "               o.ORD_NO," +
            "               o.KEYFLD," +
            "               o.ATTN," +
            "               GETAVGPRICEDLV(o.keyfld) , " +
            "               GETSUMPRICEDLV(o.keyfld), " +
            "               GETAVGPRICEDLV(o.keyfld,'N') , " +
            "               GETSUMPRICEDLV(o.keyfld,'N') , " +
            "               o.ORD_DISCAMT order by o.ord_no ";
        var jscmd = [
            { general: {} },
            {
                'KEYFLD':
                    { 'hide': true }
            },
            {
                'PERIODCODE':
                    { 'hide': true }
            },
            {
                'AMOUNT':
                    { 'display_format': 'MONEY_FORMAT' }
            }];
        Util.show_list(sq, ["ITEM_CODE", "ITEM_DESCR", "ORD_DATE", "B_NAME"], "", function (data) {
            // var rn = ld.addRow();
            addRec(data);
            return true;
        }, "100%", "100%", undefined, true, undefined, undefined, undefined, jscmd, undefined, undefined);

    },
    updateInv: function () {
        var that = this;
        var dlg = that.oController.getForm().getParent();
        var that = this;
        // that.loadData(true);
        var kfld = Util.extractNumber(this.keyfld.getValue());
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");

        var gamt = Util.extractNumber(this.gross_amt.getValue());
        var aamt = Util.extractNumber(this.add_amt.getValue());
        var damt = Util.extractNumber(this.disc_amt.getValue());
        var netamt = (gamt + aamt) - damt;

        if (netamt < 0) FormView.err("Can't update with Net Amount <0 ");
        var decl2 = " kfld number:= :keyfld;" +
            " addamt number:=:addamt; " +
            " discamt number :=:discamt;" +
            " invamt number:= 0; " +
            " dag number:=0;" +
            " aag number:=0;" +
            " totdag number:=0;" +
            " totaag number:=0;" +
            " totamt number:=:totalamt;" +
            " memostr varchar2(500):=':memo'; " +
            " ctgstr varchar2(500):=':ctg'; " +
            " pono varchar2(500) :=':txtPoNo';" +
            " slp varchar2(500) :=':txtSalesp';" +
            " cursor p1(kf number) is select *from pur1 where keyfld=kf; " +
            " cursor pu(kfx number) is select *from pur2 where keyfld=kfx order by itempos;" +
            " ";
        decl2 = decl2.replaceAll(":ctg", that.ctg.getValue())
            .replaceAll(":memo", this.memo.getValue())
            .replaceAll(":txtSalesp", this.txtSalesp.getSelectedKey())
            .replaceAll(":txtPoNo", this.txtPoNo.getValue())
            .replaceAll(":discamt", damt)
            .replaceAll(":addamt", aamt)
            .replaceAll(":totalamt", gamt)
            .replaceAll(":keyfld", kfld);
        var sq = " totamt:=0;" +
            "  for xx in pu(kfld) loop  " +
            "   totamt:=totamt+ (((xx.price-xx.disc_amt)/xx.pack)*xx.allqty); " +
            "  end loop; " +
            " update pur1 set ctg=ctgstr , memo= memostr,disc_amt=discamt , reference_information=pono, slsmn=slp , " +
            " deptno=addamt,inv_amt=totamt where keyfld=kfld ; " +
            " " +
            " for xx in pu(kfld) loop " +
            " IF DISCAMT>0 and totamt>0 THEN " +
            " dag:=((discamt / totamt) * (((xx.price)/xx.PACK)*(xx.allqty))) / (xx.allqty/xx.pack);" +
            " end if;" +
            "  IF addamt>0 THEN " +
            " aag:=((addamt / totamt) * (((xx.price)/xx.PACK)*(xx.allqty))) / (xx.allqty/xx.pack); " +
            " END IF;" +
            " update pur2 set add_amt_gross=aag,disc_amt_gross=dag where keyfld=xx.keyfld and itempos=xx.itempos;" +
            " end loop;" +
            " x_post_sale_invoice(kfld);  " +
            " end; ";

        var decl = " " +
            " pcode varchar2(255):=repair.GETSETUPVALUE_2('CURRENT_PERIOD');" +
            " ploc varchar2(255):=:txtLoc;" +
            " pinvno number:=:txtInv;" +
            " pdate date:=:txtDate;" +
            " ptype number:=:txtType;" +
            " pstr number:=:txtStr;" +
            " pref varchar2(255):= :txtRef;" +
            " pBrNo number:=:txtBranch; " +
            " adescr_memo varchar2(500) :=':addescr';" +
            " ddescr_ctg varchar2(500) :=':ddescr';" +
            " " +
            " grossamt number :=0;" +
            " prd_date date;" +
            " exp_date date;" +
            " posx number:=0;" +
            " pr number;" +
            " refnm varchar2(500);" +
            " cursor ds1 is select distinct ordwas from pur2 where keyfld=kfld and invoice_code=21  order by ordwas; " +
            " cursor ds is select o.*,it.packd, it.pack,it.unitd,it.pkaver,it.prd_dt prd_date,it.exp_dt exp_date from C_ORDER1 o,items it where o.ord_code=9 and o.ord_ship=it.reference and o.keyfld in (:txtKflds) and o.saleinv is null order by o.keyfld , o.ORD_POS ;" +
            " ";
        var sqRec = "";//that.getAddRec(decl);
        sqRec = "declare " + (sqRec.length == 0 ? decl2 + " begin " + sq : decl2 + sqRec + sq);

        var dt = Util.execSQL(sqRec);
        if (dt.ret == "SUCCESS") {
            // sap.m.MessageToast.show("Update done ! ");
            FormView.msgSuccess(Util.getLangText("msgSaved"));
            that.printInv();
            dlg.close();

            that.loadData(true);

        }

    },
    deleteInv: function () {
        var that = this;
        that.loadData(true);

        var dlg = that.oController.getForm().getParent();
        var invn = this.invoice_no.getValue();
        var kfld = this.keyfld.getValue();
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");

        var pdamt = Util.getSQLValue("select paid_amt from invunpaid where keyfld=" + kfld);
        if (Util.nvl(pdamt, 0) != 0)
            FormView.err("Found collection on invoice !");
        Util.simpleConfirmDialog("Are you sure , you want to delete Invoice # " + invn + " ? ", function () {
            var jks = "";
            var joks = Util.execSQLWithData("select distinct po_keyfld from pur2 where keyfld=" + kfld);
            for (var ji = 0; ji < joks.length; ji++)
                jks += (jks.length > 0 ? "," : "") + joks[ji].PO_KEYFLD;
            jks = (Util.nvl(jks, "").trim() == "" ? "-.00001" : jks.trim());
            var sq = "declare " +
                " kfld number:=:kfld ;" +
                " tmpkf number; " +
                " pokf number; " +
                " cursor p2 is select *from pur2 where keyfld=kfld order by itempos; " +
                " cursor acdet is select *from acvoucher2 WHERE REFERKEYFLD=KFLD AND REFERCODE=21;" +
                " cursor ISS_acdet is select *from acvoucher2 WHERE REFERKEYFLD=tmpkf AND REFERCODE=25;" +
                " cursor joks is select keyfld po_keyfld from pord1 where keyfld in (" + jks + ") order by 1;" +
                " begin " +
                "  for x in p2 loop " +
                "    update c_order1 set saleinv=null, ord_flag=1 where keyfld=x.ordwas; " +
                "    update order1 set saleinv=null, ord_flag=1 where keyfld=x.ordwas; " +
                "  end loop; " +
                " select max(po_keyfld) into pokf from pur1 where keyfld=kfld; " +
                " select max(keyfld) into tmpkf from invoice1 where invoice_keyfld=kfld; " +
                " DELETE FROM pur1 WHERE KEYFLD=KFLD; " +
                " DELETE FROM pur2 WHERE KEYFLD=KFLD; " +
                " DELETE FROM invoice1 where invoice_keyfld=kfld; " +
                " delete from invoice2 where invoice_keyfld=kfld; " +
                " for iss in acdet " +
                " loop " +
                " C7_DECACCUSES(iss.accno); " +
                " end loop; " +
                " for iss in ISS_acdet " +
                " loop " +
                " C7_DECACCUSES(iss.accno); " +
                " end loop; " +
                " DELETE FROM ACVOUCHER1 WHERE REFERKEYFLD=KFLD AND refercode=21;" +
                " DELETE FROM ACVOUCHER2 WHERE REFERKEYFLD=KFLD AND refercode=21;" +
                " DELETE FROM ACVOUCHER1 WHERE REFERKEYFLD=tmpkf AND refercode=25;" +
                " DELETE FROM ACVOUCHER2 WHERE REFERKEYFLD=tmpkf AND refercode=25;" +
                " delete from invunpaid where keyfld=kfld;" +
                " for jx in joks loop " +
                " c7_so_updatesales(jx.po_keyfld); " +
                " end loop; " +
                " end ;" +
                " " +
                " ";
            sq = sq.replaceAll(":kfld", kfld);
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                sap.m.MessageToast.show("Invoice deleted ! ");
                dlg.close();
            }

        });

    },
    printInv: function (addStr) {
        var that = this;
        that.loadData(false);
        var kfld = this.keyfld.getValue();
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");

        var invn = this.invoice_no.getValue();
        var loc = UtilGen.getControlValue(this.location_code);
        Util.printServerReport("br/" + Util.nvl(addStr, "") + "brsale", "_para_pfromno=" +
            invn + "&_para_ptono=" + invn + "&_para_plocation=" + loc);
    },




});



