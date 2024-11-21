sap.ui.jsfragment("bin.forms.pur.powzd", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });

        this.bk = new sap.m.Button({
            icon: "sap-icon://nav-back",
            press: function () {
                that.joApp.backFunction();
            }
        });

        this.mainPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            showSubHeader: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.detailPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.infoPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            showNavButton: false,
            // floatingFooter: true,
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.joApp.addDetailPage(this.mainPage);
        this.joApp.addDetailPage(this.detailPage);
        this.joApp.addDetailPage(this.infoPage);
        this.joApp.toDetail(this.mainPage, "show");
        this.createView();
        this.loadData();


        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };

        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog) {
                that.oController.getForm().getParent().setShowHeader(false);
                // that.oController.getForm().getParent().setContentHeight("100%");
            }
            var oMasterNav = that.joApp.getAggregation("_navMaster");
            oMasterNav.setVisible(false);
        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function (pCreateOtherPage) {
        var that = this;
        that.selKf = -1;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var createOtherPage = Util.nvl(pCreateOtherPage, true);
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.mainPage);
        var formCss = {
            width: "700px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;" +
                "background-color:#faebd7"
            ]
        };
        this.tit = new sap.m.Text({ height: "25px", width: "100%", text: Util.getLangText("titPurWzd") }).addStyleClass("titleFontWithoutPad");
        this.txtLocations = new sap.m.ComboBox(
            {
                width: "50%",
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {

                },
                value: "-1"
            });
        Util.fillCombo(this.txtLocations, "select '-1' code,'ALL' from dual union all select code,name from locations  order by 1 ");
        this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));


        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("", "", "#"), this.tit,
            Util.getLabelTxt("locationTxt", "50%"), this.txtLocations,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        that.qc = new QueryView("qv" + that.timeInLong);
        var qr = that.qc;
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(7);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;

        this.mainPage.addContent(cnt);

        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        Util.destroyID("cmdNext1", that.view);
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button(that.view.createId("cmdNext1"), {
                    text: "Next",
                    press: function () {
                        var slices = that.qc.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
                        var slicesof = that.qc.getControl().getBinding("rows").aIndices;

                        slices.length > 1 || slices.length < 1 ? FormView.err("Must Select single  PO !") : "";
                        var rn = slicesof[slices[0]];
                        that.selKf = that.qc.mLctb.getFieldValue(rn, "KEYFLD");
                        that.selOn = that.qc.mLctb.getFieldValue(rn, "ORD_NO");
                        that.joApp.toDetail(that.detailPage, "slide");
                        that.load_detailPage();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]

        }));
        if (createOtherPage) {
            that.createDetailPage();
            that.createInfoPage();
            that.detailPage.removeAllHeaderContent();
        }
        setTimeout(function () {
            var ar = [].concat(formCss["cssText"]);
            for (var ix in ar)
                cnt.$().css("cssText", ar);

        }, 150);
    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qcDet;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var df2 = new DecimalFormat("#,##0.00000");
        if (Util.nvl(that.selKf, -1) == -1) FormView.err("PO is not selected !");
        var dt = Util.execSQLWithData("select *from pord1 where keyfld=" + that.selKf, "No data found ..");
        var setVal = (varr, str) => {
            that.mp[varr].setValue(str);
        };
        var kys = Object.keys(that.mp);
        for (var k in kys)
            that.mp[kys[k]].setValue("");

        for (var k in kys)
            if (Util.nvl(dt[0][kys[k].toUpperCase()], "") != "")
                if (kys[k] != "ord_date")
                    setVal(kys[k], dt[0][kys[k].toUpperCase()]);
                else
                    setVal(kys[k], sdf.format(new Date(dt[0][kys[k].toUpperCase()].replaceAll(".", ":"))));
        var sqAmt = "select nvl(sum(amount),0) from c7_polandcost where pship_keyfld in (select keyfld from c7_purship where po_keyfld=" + that.selKf + ")";
        var ex = Util.getSQLValue(sqAmt);
        var totamt = dt[0].ORD_AMT + ex;
        var kdcost = dt[0].ORD_AMT > 0 ? (totamt / dt[0].ORD_AMT) : 1

        setVal("amount", df.format(dt[0].ORD_AMT));
        setVal("other_expenses", df.format(ex));
        setVal("totalamt", df.format(totamt));
        setVal("kdcost", df2.format(kdcost));
        that.load_detailPageData();
    },
    load_detailPageData: function () {
        var that = this;
        var qv = this.qcDet;
        var cstFormat = "#,##0.00000";
        var sq = "SELECT ORD_POS,ORD_REFER,ITEM_DESCR,ORD_PACKD," +
            " ORD_UNITD,ORD_ALLQTY/ORD_PACK ORD_PKQTY,ORD_PRICE," +
            " ORD_PRICE*(ORD_ALLQTY/ORD_PACK) ORD_AMOUNT,0 RCVD_PKQTY," +
            " 0 RCVD_COST,0 RCVD_AMT,0 RCVD_P,0 VARIA_QTY,0 VARIA_AMT  " +
            " FROM PORD_JOINED " +
            " where keyfld=" + that.selKf +
            " order by ord_pos";
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            Util.setColProp(qv, "ORD_POS", "display_width", 50);
            Util.setColProp(qv, "ORD_POS", "mTitle", "Sn");
            Util.setColProp(qv, "ORD_REFER", "mTitle", "itemCode");
            Util.setColProp(qv, "ORD_REFER", "display_width", 70);
            Util.setColProp(qv, "ITEM_DESCR", "mTitle", "descrTxt");
            Util.setColProp(qv, "ITEM_DESCR", "display_width", 120);
            Util.setColProp(qv, "ORD_PACKD", "mTitle", "itemPackD");
            Util.setColProp(qv, "ORD_PACKD", "display_width", 50);
            Util.setColProp(qv, "ORD_UNITD", "mTitle", "itemUnitD");
            Util.setColProp(qv, "ORD_UNITD", "display_width", 50);
            Util.setColProp(qv, "ORD_PKQTY", "mTitle", "itemPackQty");
            Util.setColProp(qv, "ORD_PKQTY", "display_width", 70);
            Util.setColProp(qv, "ORD_PRICE", "mTitle", "txtPrice");
            Util.setColProp(qv, "ORD_PRICE", "display_width", 60);
            Util.setColProp(qv, "ORD_PRICE", "display_format", cstFormat);
            
            Util.setColProp(qv, "ORD_AMOUNT", "mTitle", "amountTxt");
            Util.setColProp(qv, "ORD_AMOUNT", "display_width", 80);
            Util.setColProp(qv, "ORD_AMOUNT", "display_format", "MONEY_FORMAT");

            Util.setColProp(qv, "RCVD_PKQTY", "mTitle", "");
            Util.setColProp(qv, "RCVD_PKQTY", "display_width", 60);
            Util.setColProp(qv, "RCVD_COST", "mTitle", "");
            Util.setColProp(qv, "RCVD_COST", "display_width", 80);
            Util.setColProp(qv, "RCVD_COST", "display_format", cstFormat);
            Util.setColProp(qv, "RCVD_AMT", "mTitle", "");
            Util.setColProp(qv, "RCVD_AMT", "display_width", 80);
            Util.setColProp(qv, "RCVD_AMT", "display_format", "MONEY_FORMAT");
            Util.setColProp(qv, "RCVD_P", "mTitle", "");
            Util.setColProp(qv, "RCVD_P", "display_width", 50);
            Util.setColProp(qv, "VARIA_QTY", "mTitle", "");
            Util.setColProp(qv, "VARIA_QTY", "display_width", 60);
            Util.setColProp(qv, "VARIA_AMT", "mTitle", "");
            Util.setColProp(qv, "VARIA_AMT", "display_width", 80);

            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
        }

    },
    createInfoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var view = this.view;
        var formCss = {
            width: "750px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "margin-left: 5px;" +
                "margin-right: 5px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };

        UtilGen.clearPage(this.infoPage);
        this.infoPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                    text: "Back",
                    press: function () {
                        that.joApp.toDetail(that.mainPage, "slide");
                        // that.loadData();
                    }
                }),
                new sap.m.Button({
                    text: "Finish",
                    press: function () {
                        that.joApp.toDetail(that.infoPage, "slide");
                        that.generatePur();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]

        }));

        setTimeout(function () {

        }, 100);
    },
    createDetailPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.detailPage);


        // var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        // this.detailPage.addContent(sc);

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titPurWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
        var fe = [];
        this.mp = {};
        var mp = this.mp;
        var addFe = function (ar) {
            mp[ar[1].colname] = ar[1];
            fe = [...fe, ...ar.slice(0)];
        }
        //ord_no+ord_date             net_amt
        //ord_ref+ord_refnm           landing_cost
        //kd_cost                     total

        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_no", "", "txtPoNo", "15%", "", "10%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.LABEL,
                display_style: "keyIdText",
            }));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_date", "@", "txtPoNo", "10%", "", "15%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "amount", "@", "amountTxt", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]

            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_ref", "", "txtSupplier", "15%", "", "12%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "ord_refnm", "@", "", "1%", "", "22%",
            {
                data_type: FormView.DataType.String,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_style: "",
                keyboardFocus: false,
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "other_expenses", "@", "landingCost", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "kdcost", "", "kdCost", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));
        addFe(FormView.getFactoryControls.getGeneralControls(
            "totalamt", "@", "totalTxt", "15%", "", "35%",
            {
                data_type: FormView.DataType.Number,
                class_name: FormView.ClassTypes.TEXTFIELD,
                display_format: sett["FORMAT_MONEY_1"]
            }, { editable: false }
        ));

        var wdt = 800;
        var dlg = that.oController.getForm().getParent();
        if (Util.nvl(dlg, undefined) != undefined && dlg instanceof sap.m.Dialog && Util.nvl(dlg.$().width(), 0) > 0) {
            wdt = dlg.$().width() - 100;
            if (wdt > 800) wdt = 800;
            if (wdt < 200) wdt = 400;
        }

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, { width: wdt + "px" }, "sapUiSizeCompact", "");
        // pg.addHeaderContent(tb);




        this.detailPage.addContent(cnt);

        that.qcDet = new QueryView("qv" + that.timeInLong);
        var qr = that.qcDet;
        qr.getControl().setEditable(true);
        qr.getControl().view = view;
        qr.view = view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        qr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(7);
        var filtercol = [];
        UtilGen.createDefaultToolbar2(qr, filtercol, false);
        qr.insertable = false;
        qr.deletable = false;

        this.detailPage.addContent(qr.getControl());

        Util.navEnter(fe);

        Util.destroyID("cmdNext2", that.view);
        this.detailPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                    text: "Back",
                    press: function () {
                        that.joApp.toDetail(that.mainPage, "slide");
                        // that.loadData();
                    }
                }),
                new sap.m.Button(that.view.createId("cmdNext2"), {
                    text: "Next",
                    press: function () {
                        that.joApp.toDetail(that.infoPage, "slide");
                        that.load_infoPage();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        that.joApp.backFunction();
                    }
                })
            ]
        }));
    },
    setFormEditable: function () {

    },
    createViewHeader: function () {
    },
    load_infoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
    },
    loadData: function () {
        var thatForm = this;
        thatForm.selKf = -1;
        thatForm.joApp.toDetail(thatForm.mainPage, "slide");
        var sq = "SELECT KEYFLD,ORD_NO,ORD_DATE,ORD_REF,ORD_REFNM,ORD_AMT-ORD_DISCAMT NET_AMT,'0%' RECIEVED FROM PORD1 WHERE ORD_CODE=11 AND ORD_FLAG=2 order by ord_no";
        var dt = Util.execSQL(sq);
        var qv = this.qc;
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");

            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].mColHide = true;

            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";

            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].getMUIHelper().display_width = 50;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REF")].getMUIHelper().display_width = 50;
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REFNM")].getMUIHelper().display_width = 120;
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].getMUIHelper().display_width = 70;



            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].getMUIHelper().display_align = "ALIGN_CENTER";
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].getMUIHelper().display_align = "ALIGN_CENTER";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_REF")].getMUIHelper().display_align = "ALIGN_CENTER";

            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].mTitle = "titleTxt";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_NO")].mTitle = "txtPoNo";
            qv.mLctb.cols[qv.mLctb.getColPos("ORD_DATE")].mTitle = "txtPoNo";
            qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mTitle = "txtNetAmt";
            qv.mLctb.cols[qv.mLctb.getColPos("RECIEVED")].mTitle = "rcptDateTxt";

            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
        }

    },

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



