sap.ui.jsfragment("bin.forms.br.forms.unpost", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.keyfld, "");
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
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);

        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {

        };


        setTimeout(function () {
            var bts = [
                new sap.m.Button({
                    text: Util.getLangText("cmdClose"),
                    press: function () {
                        if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                            that.oController.getForm().getParent().close();
                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("printRec"),
                    press: function () {
                        that.printInv();
                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("updateInv"),
                    press: function () {
                        Util.simpleConfirmDialog("Do you want to update this Sales Invoice ?", function (oAction) {
                            that.updateInv();
                        });

                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("delRec"),
                    press: function () {
                        that.deleteInv();
                    }
                })
            ]
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog) {
                var dlg = that.oController.getForm().getParent();
                dlg.setShowHeader(false);
                for (var b in bts)
                    dlg.addButton(bts[b]);
            }

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
        this.loadData();
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
        // location_code, invoice type, invoice_no, cust_code, cust_name, 
        // invoice_discount, additon, net amount,
        this.location_code = UtilGen.addControl(dm, "", sap.m.ComboBox, "location" + this.timeInLong,
            {
                editable: false,
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "25%",
                selectionChange: function (e) {
                    fillTypes(e);
                }
            }, "string", undefined, this.view, undefined, "select code,name from locations order by code");

        this.invoice_type = UtilGen.addControl(dm, "", sap.m.ComboBox, "invTYpes" + this.timeInLong,
            {
                editable: false,
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "25%",
                selectionChange: function (e) {

                },
            }, "string", undefined, this.view, undefined, "select '' code,'' name from dual");



        this.invoice_no = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false });
        this.keyfld = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false });

        this.cust_code = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "25%", editable: false });
        this.cust_name = new sap.m.Text({ textAlign: sap.ui.core.TextAlign.End, width: "99%", editable: false }).addStyleClass("yellow");

        this.gross_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: false });
        this.add_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: true, change: calcChange });
        this.disc_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: true, change: calcChange });
        this.net_amt = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Center, width: "24%", editable: false }).addStyleClass("yellow");

        this.memo = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%", editable: true });
        this.ctg = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "75%", editable: true });

        var fe = [
            Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("Sales Invoice Info", "100%", "#", "redText", "End"),
            Util.getLabelTxt("", "1%", ""), this.cust_name,
            Util.getLabelTxt("locationTxt", "45%"), this.location_code,
            Util.getLabelTxt("txtOrdType", "45%"), this.invoice_type,
            Util.getLabelTxt("txtInvNo", "45%"), this.invoice_no,
            Util.getLabelTxt("keyID", "45%"), this.keyfld,
            Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("txtGrossAmt", "24%"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtAddAmt", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtDisc", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("txtNetAmt", "24%", "@"), Util.getEmptyLabel("1%"),
            Util.getLabelTxt("", "1%", "", "", "Center"), this.gross_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.add_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.disc_amt,
            Util.getLabelTxt("", "1%", "@", "", "Center"), this.net_amt,
            Util.getLabelTxt("", "100%", "#"),
            Util.getLabelTxt("txtAddAmtDescr", "25%", ""), this.ctg,
            Util.getLabelTxt("txtDiscAmtDescr", "25%", ""), this.memo
        ];
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 380, "M": 580, "L": 580 },
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

        cnt.addContent(new sap.m.VBox({ height: "40px" }));

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
            this.invoice_type.setValue("");
            this.keyfld.setValue("");
            this.cust_code.setValue("");
            this.cust_name.setText("");

            this.gross_amt.setValue(df.format(0));
            this.add_amt.setValue(df.format(0));
            this.disc_amt.setValue(df.format(0));
            this.net_amt.setValue(df.format(0));
            this.ctg.setValue("");
            this.memo.setValue("")

            if (dtx.length <= 0) FormView.err("Invoice not loaded # " + this.qryStr);

            var gamt = dtx[0].INV_AMT;
            var aamt = ((!reload) ? dtx[0].DEPTNO : Util.extractNumber(that.add_amt.getValue()));
            var damt = ((!reload) ? dtx[0].DISC_AMT : Util.extractNumber(that.disc_amt.getValue()));
            var netamt = (gamt + aamt) - damt;
            this.location_code.setValue(dtx[0].LOCATION_CODE)
            this.invoice_no.setValue(dtx[0].INVOICE_NO);
            this.invoice_type.setValue(dtx[0].TYPE);
            this.keyfld.setValue(dtx[0].KEYFLD);
            this.cust_code.setValue(dtx[0].C_CUS_NO);
            this.cust_name.setText(dtx[0].INV_REFNM + " (" + dtx[0].C_CUS_NO + ")");

            this.gross_amt.setValue(df.format(gamt));

            this.add_amt.setValue(df.format(aamt));
            this.disc_amt.setValue(df.format(damt));
            this.ctg.setValue(((!reload) ? dtx[0].CTG : Util.extractNumber(that.ctg.getValue())));
            this.memo.setValue(((!reload) ? dtx[0].MEMO : Util.extractNumber(that.memo.getValue())));
            this.net_amt.setValue(df.format(netamt));
        }


    },
    updateInv: function () {
        var that = this;
        var dlg = that.oController.getForm().getParent();
        var that = this;
        that.loadData(true);
        var kfld = Util.extractNumber(this.keyfld.getValue());
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");

        var gamt = Util.extractNumber(this.gross_amt.getValue());
        var aamt = Util.extractNumber(this.add_amt.getValue());
        var damt = Util.extractNumber(this.disc_amt.getValue());
        var netamt = (gamt + aamt) - damt;


        if (netamt < 0) FormView.err("Can't update with Net Amount <0 ");

        var sq = " declare  " +
            " damt number:= :damt;" +
            " kfld number:= :keyfld;" +
            " aamt number:= :aamt; " +
            " invamt number:= 0; " +
            " cursor p1(kf number) is select *from pur1 where keyfld=kf; " +
            " " +
            " begin " +
            " update pur1 set ctg=':ctg' , memo= ':memo' ,disc_amt=damt , " +
            " deptno=aamt   where keyfld=kfld ; " +
            " " +
            " for x in p1(kfld) loop " +
            "  update pur2 " +
            "   set disc_amt_gross=((x.disc_amt/x.inv_amt) * (((PRICE-DISC_AMT)/PACK)*ALLQTY)) / (allqty/pack), " +
            "   add_amt_gross=(NVL(x.DEPTNO,0) / x.inv_amt) * (((PRICE-DISC_AMT)/PACK)*ALLQTY) / (allqty/pack) " +
            "   where keyfld=kfld ; " +
            "  " +
            "  update invunpaid set inv_amt=x.inv_amt,net_amt=(x.inv_amt+aamt)-damt where keyfld=x.keyfld ; " +
            "  end loop; " +
            " x_post_sale_invoice(kfld);  " +
            " end; ";
        sq = sq.replaceAll(":ctg", that.ctg.getValue())
            .replaceAll(":memo", this.memo.getValue())
            .replaceAll(":damt", damt)
            .replaceAll(":aamt", aamt)
            .replaceAll(":keyfld", kfld);
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            sap.m.MessageToast.show("Update done ! ");
            dlg.close();
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
            var sq = "declare " +
                " kfld number:=:kfld ;" +
                " tmpkf number; " +
                " cursor p2 is select *from pur2 where keyfld=kfld order by itempos; " +
                " cursor acdet is select *from acvoucher2 WHERE REFERKEYFLD=KFLD AND REFERCODE=21;" +
                " cursor ISS_acdet is select *from acvoucher2 WHERE REFERKEYFLD=tmpkf AND REFERCODE=25;" +
                " begin " +
                "  for x in p2 loop " +
                "    update c_order1 set saleinv=null, ord_flag=1 where keyfld=x.ordwas; " +
                "    update order1 set saleinv=null, ord_flag=1 where keyfld=x.ordwas; " +
                "  end loop; " +
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
    printInv: function () {
        var that = this;
        that.loadData(true);
        var kfld = this.keyfld.getValue();
        if (Util.nvl(kfld, "") == "") FormView.err("No Invoice selected !");

        var invn = this.invoice_no.getValue();
        var loc = UtilGen.getControlValue(this.location_code);
        Util.printServerReport("br/brsale", "_para_pfromno=" +
            invn + "&_para_ptono=" + invn + "&_para_plocation=" + loc);
    }



});



