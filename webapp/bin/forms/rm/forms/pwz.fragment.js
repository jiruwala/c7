sap.ui.jsfragment("bin.forms.rm.forms.pwz", {

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
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.mainPage);
        var formCss = {
            width: "600px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };
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
                value: ""
            });
        Util.fillCombo(this.txtLocations, "select code,name from locations order by code");
        this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));

        this.txtFromDate = new sap.m.DatePicker({ width: "50%" });
        this.txtToDate = new sap.m.DatePicker({ width: "50%" });

        this.txtRef = new sap.m.Input({
            width: "30%", showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                Util.showSearchList("select code,name from c_ycust where code in " +
                    "(select distinct ref_code from c7_rmpord where pur_keyfld is null and location_code='" +
                    UtilGen.getControlValue(that.txtLocations) + "' and " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ") and " +
                    " childcount=0 and issupp='Y' order by path",
                    "NAME", "CODE", function (valx, val) {
                        that.txtRef.setValue(valx);
                        that.txtRefName.setValue(val);
                    });
            },
            change: function (e) {
                var vl = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(that.txtRef.getValue()));
                that.txtRefName.setValue(vl);
            }
        });
        this.txtRefName = new sap.m.Input({
            width: "49%", editable: false
        });

        this.txtBranch = new sap.m.Input({
            width: "30%", showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);

                Util.showSearchList("select brno code,b_name name from cbranch where brno in " +
                    " (select distinct branch_no from c7_rmpord where pur_keyfld is null and " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + " and " +
                    " location_code='" + UtilGen.getControlValue(that.txtLocations) + "' and  ref_code=" + Util.quoted(that.txtRef.getValue()) +
                    ") and  code=" + Util.quoted(that.txtRef.getValue()) +
                    " order by brno", "NAME", "CODE", function (valx, val) {
                        that.txtBranch.setValue(valx);
                        that.txtBranchName.setValue(val);
                    });
            },
            change: function (e) {
                var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue()));
                that.txtBranchName.setValue(vl);
            }
        });
        this.txtBranchName = new sap.m.Input({
            width: "49%", editable: false
        });

        this.txtFromDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDateValue(UtilGen.parseDefaultValue("$FIRSTDATEOFMONTH"))
        this.txtToDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));

        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("locationTxt", "50%"), this.txtLocations,
            Util.getLabelTxt("fromDate", "50%"), this.txtFromDate,
            Util.getLabelTxt("toDate", "50%"), this.txtToDate,
            Util.getLabelTxt("refName", "20%"), this.txtRef,
            Util.getLabelTxt("", "1%", "@"), this.txtRefName,
            Util.getLabelTxt("txtBranch", "20%"), this.txtBranch,
            Util.getLabelTxt("", "1%", "@"), this.txtBranchName,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                    text: "Next",
                    press: function () {
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

        that.createDetailPage();
        that.createInfoPage();
        this.mainPage.removeAllHeaderContent();
        this.mainPage.addHeaderContent(new sap.m.Title({ text: "Purchase wizard" }));
        this.mainPage.addContent(cnt);

        // this.mainPage.addContent(sc);


    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qv;
        var fromdt = UtilGen.getControlValue(this.txtFromDate);
        var todt = UtilGen.getControlValue(this.txtToDate);

        if (Util.nvl(that.txtRef.getValue(), "") == "") {
            that.joApp.to(that.mainPage, "slide");
            FormView.err("Must select supplier !");
        }
        if (fromdt == null || todt == null) { that.joApp.to(that.mainPage, "slide"); return; };

        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: "Purchase wizard / " + that.txtRefName.getValue() }));

        var setPriceData = function () {
            var ld = that.qv.mLctb;

            var itmP = {};
            // var dtx = Util.execSQLWithData("select refer,price from c_contract_items " +
            //     " where cust_code='" + that.txtRef.getValue() + "' and " +
            //     " branch_no=" + that.txtBranch.getValue() + " order by startdate");
            // for (var di in dtx)
            //     itmP[dtx[di].REFER] = dtx[di].PRICE;

            var getPrice = function (rfr, dtx) {
                var dt = new Date(dtx.replaceAll(".", ":"));
                var pr = Util.getSQLValue("select nvl(max(price),0) from c_contract_items " +
                    " where cust_code='" + that.txtRef.getValue() + "' and " +
                    " branch_no=" + that.txtBranch.getValue() + " and " +
                    " refer='" + rfr + "' and " +
                    Util.toOraDateString(dt) + " >=startdate and " +
                    Util.toOraDateString(dt) + " <=enddate "
                );
                if (pr == 0)
                    pr = Util.getSQLValue("select nvl(max(price),0) from CUSTITEMS  " +
                        " where code='" + that.txtRef.getValue() + "' and " +
                        " refer='" + rfr + "' "
                    );
                return pr;
            }
            if (dt.data.length <= 0) return;
            for (var li = 0; li < ld.rows.length; li++) {
                //var pr = itmP[ld.getFieldValue(li, "REFER")];
                var qt = ld.getFieldValue(li, "PACKQTY");
                var pr = getPrice(ld.getFieldValue(li, "REFER"), ld.getFieldValue(li, "ORD_DATE"));
                ld.setFieldValue(li, "PRICE", pr);
                ld.setFieldValue(li, "AMOUNT", pr * qt);
            }
        }

        var sq = "select KEYFLD,ORD_DATE, PACKQTY,0 price,0 amount,DRIVER_NO, " +
            " DRIVER_NAME, DLV_NO, TRUCK_NO, REF_CODE, NAME, REFER, DESCR" +
            " from c7_vrmpord  where ord_date>=" + Util.toOraDateString(fromdt) +
            " and ord_date<=" + Util.toOraDateString(todt) +
            " and ref_code=" + Util.quoted(that.txtRef.getValue()) + " and " +
            " location_code=" + Util.quoted(UtilGen.getControlValue(that.txtLocations)) +
            " order by keyfld";

        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.getColByName("KEYFLD").getMUIHelper().display_width = 0;
            qv.mLctb.getColByName("REF_CODE").mHideCol = true;
            qv.mLctb.getColByName("NAME").mHideCol = true;
            
            qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_format = "SHORT_DATE_FORMAT";
            qv.mLctb.getColByName("ORD_DATE").getMUIHelper().display_width = 120;
            qv.mLctb.getColByName("DRIVER_NO").getMUIHelper().display_width = 60;
            qv.mLctb.getColByName("DRIVER_NAME").getMUIHelper().display_width = 100;
            qv.mLctb.getColByName("DLV_NO").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("TRUCK_NO").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("REF_CODE").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("NAME").getMUIHelper().display_width = 120;
            qv.mLctb.getColByName("REFER").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("DESCR").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("PACKQTY").getMUIHelper().display_width = 80;
            qv.mLctb.getColByName("PRICE").getMUIHelper().display_width = 100;
            qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_width = 100;
            qv.mLctb.getColByName("AMOUNT").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.getColByName("PRICE").getMUIHelper().display_format = "MONEY_FORMAT";
            qv.mLctb.parse("{" + dt.data + "}", true);
            setPriceData();
            qv.loadData();
        }




    },
    createInfoPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var formCss = {
            width: "750px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };
        UtilGen.clearPage(this.infoPage);
        this.txtInfoLocations = new sap.m.ComboBox(
            {
                width: "75%",
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{DESCR}", key: "{NO}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                    var vl =
                        Util.fillCombo(that.txtInfoInvType, "select no ,descr from invoicetype where location_code='" + UtilGen.getControlValue(this) + "' order by no");
                    that.txtInfoInvType.setSelectedItem(that.txtInfoInvType.getItems()[0]);
                    setTimeout(function () {
                        that.txtInfoInvType.fireSelectionChange();
                    });
                },
                value: ""
            });
        Util.fillCombo(this.txtInfoLocations, "select code,name from locations order by code");
        // this.txtLocations.setSelectedItem(Util.findComboItem(this.txtLocations, sett["DEFAULT_LOCATION"]));
        UtilGen.setControlValue(that.txtInfoLocations, sett["DEFAULT_LOCATION"]);

        this.txtInfoInvType = new sap.m.ComboBox({
            width: "25%",
            customData: [{ key: "" }],
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                templateShareable: true
            },
            selectionChange: function (ev) {
                var sq = "select nvl(max(invoice_no),0)+1 from pur1 " +
                    " where location_code=':location' and invoice_code=11 and type=:type "
                        .replaceAll(":location", UtilGen.getControlValue(that.txtInfoLocations))
                        .replaceAll(":type", UtilGen.getControlValue(that.txtInfoInvType));
                var nwPurNo = Util.getSQLValue(sq);
                that.txtInfoInvNo.setValue(nwPurNo);
            },
            value: ""
        });
        this.txtInfoInvNo = new sap.m.Input({ width: "25%" });
        this.txtInfoInvDate = new sap.m.DatePicker({ width: "25%" });
        this.txtInfoRef = new sap.m.Input({ width: "25%", editable: false });
        this.txtInfoDescr = new sap.m.Input({ width: "75%" });
        this.txtInfoAmount = new sap.m.Input({ align: "center", width: "25%", editable: false }).addStyleClass();

        this.txtInfoInvDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtInfoInvDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));



        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("locationTxt", "25%"), this.txtInfoLocations,
            Util.getLabelTxt("txtInvType", "25%"), this.txtInfoInvType,
            Util.getLabelTxt("txtInvNo", "25%", "@"), this.txtInfoInvNo,
            Util.getLabelTxt("dateTxt", "25%"), this.txtInfoInvDate,
            Util.getLabelTxt("refName", "25%", "@"), this.txtInfoRef,
            Util.getLabelTxt("descrTxt", "25%"), this.txtInfoDescr,
            Util.getLabelTxt("", "25%"), new sap.m.VBox({ height: "25px" }),
            Util.getLabelTxt("amountTxt", "50%"), this.txtInfoAmount,
        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");

        this.infoPage.addContent(cnt);
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
            that.txtInfoLocations.fireSelectionChange();
        }, 100);
    },
    createDetailPage: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.detailPage);
        this.qv = new QueryView("qrDet" + this.timeInLong);
        this.qv.getControl().addStyleClass("sapUiSizeCondensed");
        this.qv.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
        this.qv.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        this.qv.getControl().setAlternateRowColors(true);
        this.qv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        that.qv.getControl().setVisibleRowCount(7);
        this.qv.getControl().setFixedBottomRowCount(0);

        var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: this.qv.getControl() });

        this.detailPage.addContent(sc);
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: "Purchase wizard" }));

        this.qv.getControl().attachRowSelectionChange(function () {
            var tot = 0;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var slices = this.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
            var slicesof = that.qv.getControl().getBinding("rows").aIndices;
            var amtx = 0;
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
                var price = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "PRICE"), "");
                var pkqty = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "PACKQTY"), "");
                amtx += (price * pkqty);
            }
            that.txtTotalAmount.setValue(df.format(amtx));
        });

        this.txtTotalAmount = new sap.m.Input({ width: "200px" });
        sc.addContent(new sap.m.VBox({ height: "20px" }));
        sc.addContent(new sap.m.Text({ text: "Total Amount" }));
        sc.addContent(this.txtTotalAmount);

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
                new sap.m.Button({
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

        var slices = this.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        if (slices.length <= 0) {
            that.joApp.toDetail(that.detailPage, "slice");
            FormView.err("No Any delivery selected !");
        }
        this.infoPage.removeAllHeaderContent();
        this.infoPage.addHeaderContent(new sap.m.Title({ text: "Purchase wizard / " + that.txtRefName.getValue() }));
        var loc = UtilGen.getControlValue(that.txtLocations);
        UtilGen.setControlValue(that.txtInfoLocations, "-", "-", true);
        UtilGen.setControlValue(that.txtInfoLocations, loc, loc, true);
        that.txtInfoLocations.fireSelectionChange();
        // that.txtInfoLocations.fireSelectionChange();
        that.txtInfoRef.setValue(that.txtRef.getValue() + "-" + that.txtRefName.getValue());
        that.txtInfoAmount.setValue(that.txtTotalAmount.getValue())
    },
    loadData: function () {
        // if (Util.nvl(this.oController.accno, "") != "" &&
        //     Util.nvl(this.oController.status, "view") == FormView.RecordStatus.VIEW) {
        //     this.frm.setFieldValue("pac", this.oController.accno, this.oController.accno, true);
        //     this.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        //     this.oController.accno = "";
        //     return;

        // }
        // this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
    }
    ,
    generatePur: function () {
        var that = this;
        var invdt = UtilGen.getControlValue(this.txtInfoInvDate);
        var sq = "declare " +
            " pcode varchar2(255):=repair.GETSETUPVALUE_2('CURRENT_PERIOD');" +
            " ploc varchar2(255):=:txtLoc;" +
            " pinvno number:=:txtInv;" +
            " pdate date:=:txtDate;" +
            " ptype number:=:txtType;" +
            " pstr number:=:txtStr;" +
            " pref varchar2(255):= :txtRef;" +
            " pBrNo number:=:txtBranch; " +
            " " +
            " prd_date date;" +
            " exp_date date;" +
            " kfld number;" +
            " posx number:=0;" +
            " pr number;" +
            " refnm varchar2(500);" +
            " totamt number:=0;" +
            " " +
            " cursor ds is select *from c7_rmpord where keyfld in (:txtKflds) order by keyfld;" +
            " " +
            " begin" +
            " select nvl(max(keyfld),0)+1 into kfld from pur1;" +
            " for x in ds loop" +
            "     select nvl(max(price),0) into pr from c_contract_items where cust_code=x.ref_code and refer=x.refer and branch_no=x.branch_no and x.ord_date>=startdate and x.ord_date<=enddate ;" +
            "     select prd_dt,exp_dt into prd_date, exp_date from items where reference=x.refer;    " +
            "  if pr=0 then " +
            "   select max(price) into pr from custitems where code=x.ref_code and refer=x.refer; " +
            "  end if;" +
            " " +
            "     " +
            "     posx:=posx+1;" +
            "     insert into pur2(PERIODCODE, LOCATION_CODE, INVOICE_NO," +
            "                 INVOICE_CODE, TYPE, ITEMPOS, REFER, STRA, PRICE, PKCOST," +
            "                 DISC_AMT, PACK, PACKD, UNITD, DAT, QTY, PKQTY, FREEQTY, FREEPKQTY," +
            "                 ALLQTY, PRD_DATE, EXP_DATE, YEAR, FLAG, ORDWAS, KEYFLD, RATE, CURRENCY," +
            "                 CREATDT, ORDERNO, QTYIN, QTYOUT, DISC_AMT_GROSS, SLSMNXX," +
            "                 RECIEVED_KEYFLD, FREE_ALLQTY,costcent,size_of_descr,recipt_date)" +
            "                 values (" +
            "                 pcode, ploc, pinvno," +
            "                 11, ptype, posx, x.refer, pstr , pr,  pr*1 ," +
            "                 0, x.pack, x.packd, x.unitd, pdate," +
            "                 0, x.packqty, 0, 0," +
            "                 x.packqty*x.pack, prd_date, exp_date, '2003', 2, x.dlv_no ," +
            "                 kfld , 1, 'KWD', SYSDATE, X.KEYFLD, X.PACKQTY *X.PACK, 0, 0, x.DRIVER_NO," +
            "                 null, 0,'',x.payterm,x.ord_date) ;" +
            "     totamt:=totamt+(x.packqty*pr);                " +
            "     update c7_rmpord set sale_price=pr,PUR_KEYFLD=kfld,flag=2 where keyfld=x.keyfld;" +
            " " +
            " end loop;" +
            " select name into refnm from c_ycust where code=pref and childcount=0 and flag=1 ;" +
            " if posx>0 then" +
            "  insert into PUR1(PERIODCODE, LOCATION_CODE, INVOICE_NO," +
            "                 INVOICE_CODE, TYPE, INVOICE_DATE, STRA, SLSMN," +
            "                  MEMO, INV_REF, INV_REFNM, INV_AMT, DISC_AMT, INV_COST," +
            "                  FLAG, CREATDT, LPNO, BKNO, KEYFLD, USERNAME, SUPINVNO, SHIPCO," +
            "                 INS_CO, BANK, LCNO, INS_NO, RATE, CURRENCY, KDCOST, CHG_KDAMT," +
            "                 ORDERNO, C_CUS_NO,YEAR,NO_OF_RECIEVED,costcent,C_BRANCH_NO) VALUES" +
            "                 (pcode, ploc, pinvno," +
            "                  11, ptype, pdate, pstr, null," +
            "                  '', (select ac_no from c_ycust where code=pref ), refnm," +
            "                   totamt, 0, 0," +
            "                  2, sysdate, '', '', kfld,user, '', ''," +
            "                 '', '', '', '', 1,'KWD', 1 , 0," +
            "                 null, pref,'2003',0,null,pBrNo);" +
            " x_post_purchase(kfld);" +
            " " +
            " end if;" +
            " " +
            " end;";

        var kfldStr = "";
        var slices = that.qv.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = that.qv.getControl().getBinding("rows").aIndices;
        for (var i = 0; i < slices.length; i++) {
            var kfld = Util.nvl(Util.getCellColValue(that.qv.getControl(), slicesof[slices[i]], "KEYFLD"), "");
            kfldStr = kfldStr + (kfldStr.length > 0 ? "," : "") + kfld;
        }
        if (kfldStr.length <= 0)
            FormView.err("No rows selected !");
        sq = sq.replaceAll(":txtLoc", Util.quoted(UtilGen.getControlValue(that.txtInfoLocations)))
            .replaceAll(":txtInv", that.txtInfoInvNo.getValue())
            .replaceAll(":txtDate", Util.toOraDateString(invdt))
            .replaceAll(":txtType", UtilGen.getControlValue(that.txtInfoInvType))
            .replaceAll(":txtStr", "1")
            .replaceAll(":txtRef", Util.quoted(that.txtRef.getValue()))
            .replaceAll(":txtKflds", kfldStr)
            .replaceAll(":txtBranch", that.txtBranch.getValue());

        var dt = Util.execSQL(sq);
        if (dt.ret != "SUCCESS") {
            FormView.err("Error , check  server log !");
        } else {
            that.joApp.to(that.detailPage, "slide");
            that.load_detailPage();
            sap.m.MessageToast.show("Purchase generated successfully !");
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



