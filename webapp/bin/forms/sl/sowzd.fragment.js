sap.ui.jsfragment("bin.forms.sl.sowzd", {

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
    createView: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;
        var codSpan = "XL3 L3 M3 S12";
        UtilGen.clearPage(this.mainPage);
        var formCss = {
            width: "700px",
            cssText: [
                "padding-left:10px ;" +
                "padding-right:10px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "border-color: lightgreen;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;" +
                "background-color:#faebd7"
            ]
        };
        this.tit = new sap.m.Text({ height: "25px", width: "100%", text: Util.getLangText("titPurWzd") }).addStyleClass("titleFontWithoutPad");
        this.txtLocations = new sap.m.Input({
            editable: true,
            showValueHelp: true,
            width: "60%",
            valueHelpRequest: function (e) {
                var sq = "select code,name title from locations order by code";
                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select code,name title from c_ycust where code=:CODE", that.txtRefName, function (dt) {
                        console.log(dt);
                    }, undefined, undefined, true);
            }
        });
        var dt = Util.execSQLWithData("select code from locations order by code");
        var loc = "";
        for (var li = 0; li < dt.length; li++)
            loc += " \"" + dt[li].CODE + "\"";
        this.txtLocations.setValue(loc);
        this.txtFromDate = new sap.m.DatePicker({ width: "50%" });
        this.txtToDate = new sap.m.DatePicker({ width: "50%" });

        this.txtRef = new sap.m.Input({
            width: "30%", showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sqDlvCounts = "(select count(*)  from c_order1 where c_ycust.code=c_order1.ord_ref and ord_code=9 and saleinv is null and " +
                    locWhere +
                    " and ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ") ";

                var sqWhere = "(select distinct ord_ref from c_order1 where ord_code=9 and saleinv is null and " +
                    locWhere +
                    " and ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + ") ";
                var sq = "select code,name from c_ycust where code in " + sqWhere +
                    " and " +
                    " childcount=0 order by path ";
                var sq = "select code,name," + sqDlvCounts + " deliveries from c_ycust where code in " + sqWhere +
                    " and " +
                    " childcount=0 order by path ";
                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select code,name title from c_ycust where code=:CODE", that.txtRefName, undefined, undefined, undefined, false);
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
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sq = "select brno code,b_name name from cbranch where brno in " +
                    " (select distinct ORD_DISCAMT from C_ORDER1 where ord_code=9 and SALEINV is null and " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + " and " +
                    locWhere +
                    " and  ORD_REF=" + Util.quoted(that.txtRef.getValue()) +
                    ") and  code=" + Util.quoted(that.txtRef.getValue()) +
                    " order by brno";
                // search multiple select
                UtilGen.Search.do_quick_search(e, this,
                    sq,
                    "select '' from dual ", that.txtBranchName, function (dt) {
                        console.log(dt);
                        // if (dt.length == 1) {
                        //     var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue().replaceAll('"',"")));
                        //     that.txtBranchName.setValue(vl);
                        // }

                    }, undefined, undefined, true);

                // Util.showSearchList(sq, "NAME", "CODE", function (valx, val) {
                //     that.txtBranch.setValue(valx);
                //     that.txtBranchName.setValue(val);
                // });
            },
            change: function (e) {
                // var vl = Util.getSQLValue("select b_name from cbranch where code=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue()));
                // that.txtBranchName.setValue(vl);
            }
        });
        this.txtBranchName = new sap.m.Input({
            width: "49%", editable: false
        });
        // this.recheckPrice = new sap.m.CheckBox({
        //     selected: false,
        // })
        this.txtSO = new sap.m.Input({
            width: "30%", editable: true, showValueHelp: true,
            valueHelpRequest: function (e) {
                var fromdt = UtilGen.getControlValue(that.txtFromDate);
                var todt = UtilGen.getControlValue(that.txtToDate);
                var loc = that.txtLocations.getValue();
                var locWhere = " ('" + loc + "' like '%\"'||LOCATION_CODE ||'\"%' )";
                var sq = "select ord_no,ord_date,ord_ref,ord_refnm,keyfld,ord_amt,location_code from pord1 o1 where  " +
                    " ord_date>=" + Util.toOraDateString(fromdt) +
                    " and ord_date<=" + Util.toOraDateString(todt) + " and " +
                    " ord_flag=2 and ordacc='approve' and DELIVEREDQTY>0 and " +
                    locWhere +
                    " and  (ord_ref=" + Util.quoted(that.txtRef.getValue()) + " or " +
                    Util.quoted(that.txtRef.getValue()) + " is null ) " +
                    " order by keyfld";
                UtilGen.Search.do_quick_search_simple(sq,
                    ["ORD_NO", "ORD_DATE", "ORD_REF", "ORD_REFNM", "ORD_AMT"], function (data) {
                        that.selectedSOKfld = data.KEYFLD;
                        that.txtSO.setValue(data.ORD_NO);
                    }, { pWidth: "80%" }, undefined, false, Util.getLangText("titSalesOrder"), [
                    {
                        ORD_NO: {
                            colname: "ORD_NO",
                            display_width: 80,
                            mTitle: Util.getLangText("slsOrdN"),
                        }
                    },
                    {
                        ORD_DATE: {
                            colname: "ORD_DATE",
                            display_format: "SHORT_DATE_FORMAT",
                            mTitle: Util.getLangText("ordDate"),
                            display_width: 100
                        }
                    },
                    {
                        ORD_REF: {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode"),
                            display_width: 100,
                        }
                    },
                    {
                        ORD_REFNM: {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName"),
                            display_width: 250

                        }
                    },
                    {
                        KEYFLD: {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        }
                    },
                    {
                        ORD_AMT: {
                            colname: "ORD_AMT",
                            display_format: "MONEY_FORMAT",
                            mTitle: Util.getLangText("amountTxt"),
                            display_width: 120,
                            mSummary: "SUM"
                        }
                    }
                ]);
            },
            change: function (e) {
                // var vl = Util.getSQLValue("select keyfld from pord1 where ord_no=" + Util.quoted(that.txtRef.getValue()) + " and brno=" + Util.quoted(that.txtBranch.getValue()));
                // that.txtBranchName.setValue(vl);
            }
        });

        this.txtFromDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtToDate.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        this.txtFromDate.setDateValue(UtilGen.parseDefaultValue("$FIRSTDATEOFMONTH"))
        this.txtToDate.setDateValue(UtilGen.parseDefaultValue("$TODAY"));

        var fe = [
            // Util.getLabelTxt("txtPurWizard", "100%", "#"), new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("", "", "#"), this.tit,
            Util.getLabelTxt("locationTxt", "50%"), this.txtLocations,
            Util.getLabelTxt("fromDate", "50%"), this.txtFromDate,
            Util.getLabelTxt("toDate", "50%"), this.txtToDate,
            Util.getLabelTxt("refName", "20%"), this.txtRef,
            Util.getLabelTxt("", "1%", "@"), this.txtRefName,
            Util.getLabelTxt("txtBranch", "20%"), this.txtBranch,
            Util.getLabelTxt("", "1%", "@"), this.txtBranchName,
            Util.getLabelTxt("--OR--", "40%", "#"), new sap.m.VBox({ height: "20px" }),
            Util.getLabelTxt("SO: ", "20%"), this.txtSO,

        ]
        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        Util.destroyID("cmdNext1", that.view);
        this.mainPage.setFooter(new sap.m.Toolbar({
            content: [
                new sap.m.ToolbarSpacer(),
                new sap.m.Button(that.view.createId("cmdNext1"), {
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

        var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titSalWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));
        this.mainPage.addContent(cnt);

        // this.mainPage.addContent(sc);
        setTimeout(function () {
            var ar = [].concat(formCss["cssText"]);
            for (var ix in ar)
                cnt.$().css("cssText", ar);

        }, 150);

    },
    load_detailPage: function () {
        var that = this;
        var qv = this.qv;

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


        var sc = new sap.m.ScrollContainer({ width: "100%", height: "100%", vertical: true, content: [] });

        this.detailPage.addContent(sc);

        // var refName = that.txtRefName.getValue() + " - " + that.txtRef.getValue();
        // var bName = that.txtBranchName.getValue() + " - " + that.txtBranch.getValue();
        this.detailPage.removeAllHeaderContent();
        // this.detailPage.addHeaderContent(new sap.m.Title({ text: Util.getLangText("titPurWzd") + " / " + refName + " / " + bName }).addStyleClass("redText boldText"));

        sc.addContent(new sap.m.VBox({ height: "20px" }));

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
        this.selectedSOKfld = undefined;
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



