sap.ui.jsfragment("bin.forms.gl.faPost", {

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
            content: []
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        setTimeout(function () {
            // if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
            //     that.oController.getForm().getParent().setShowHeader(false);

            UtilGen.DBView.autoShowHideMenu(false, that.joApp);

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
        that.createViewHeader();
        var recs = UtilGen.dispTblRecsByDevice({ "S": 8, "M": 12, "L": 18, "XL": 23 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(false);
        qr.getControl().view = that2.view;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        qr.getControl().setFixedBottomRowCount(1);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;
        var cols = ["CODE", "ORD_DATE", "PURPRICE", "DEPRATE", "DESCR", "TOTADD", "TOTDED", "TOTDEP", "TOTVALUE", "TOTPOSTED", "TOTUNPOSTED", "CATNO", "CATNAME"]
        UtilGen.createDefaultToolbar2(qr, cols, false);
        this.mainPage.addContent(this.qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        // this.loadData();


    },
    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        this.cust_code = '';
        var fisc = sap.ui.getCore().getModel("fiscalData").getData();
        Util.destroyID("cmdPost" + this.timeInLong, that.view);
        var txtCat = UtilGen.addControl(fe, "JV Descr", sap.m.Input, "catno" + this.timeInLong,
            {
                textAlign: sap.ui.core.TextAlign.Begin, width: "50%", editable: true,
                showValueHelp: true,
                change: function (e) {
                    var comp = this;
                    var code = UtilGen.getControlValue(comp);
                    var sq = "select catname from facat where catno='" + code + "'";
                    if (code == "" || code == "-1") {
                        comp.setValue(code + " - " + "ALL");
                        if (comp.getCustomData().length == 0)
                            comp.addCustomData(new sap.ui.core.CustomData({ key: code }))
                        else
                            comp.getCustomData()[0].setKey(code);
                        that.loadData();
                        return;
                    }
                    var tit = Util.getSQLValue(sq);
                    comp.setValue(code + " - " + tit);
                    if (comp.getCustomData().length == 0)
                        comp.addCustomData(new sap.ui.core.CustomData({ key: code }))
                    else
                        comp.getCustomData()[0].setKey(code);
                    that.loadData();


                    // UtilGen.Search.getLOVSearchField(sq, this, undefined, txtItemPos);
                },
                valueHelpRequest: function (e) {
                    var comp = this;
                    var objk = new sap.m.Input();
                    UtilGen.Search.do_quick_search(e, comp,
                        "select 'ALL' title,'-1' code from dual union all select catname title,catno code from facat order by 2 ",
                        "select *from (select 'ALL' title,'-1' code from dual union all select catname title,catno code from facat ) where code=:CODE ", objk, function (code, tit) {
                            comp.setValue(code + " - " + tit);
                            if (comp.getCustomData().length == 0)
                                comp.addCustomData(new sap.ui.core.CustomData({ key: code }))
                            else
                                comp.getCustomData()[0].setKey(code);

                        }, undefined);
                }

            }, "string", undefined, this.view);
        var jvdate = UtilGen.addControl(fe, "JV Date", sap.m.DatePicker, "jvdate" + this.timeInLong,
            {
                maxDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_to),
                minDate: new Date(sap.ui.getCore().getModel("fiscalData").getData().fiscal_from),
                change: function () {
                    thatForm.loadData();
                },
                width: "20%"
            }, "date", undefined, this.view);
        var jvdescr = UtilGen.addControl(fe, "JV Descr", sap.m.Input, "jvdescr" + this.timeInLong,
            {
                textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: true,
            }, "string", undefined, this.view);
        var bt = new sap.m.Button({
            icon: "sap-icon://details",
            text: Util.getLangText("execute_query"),
            width: "20%",
            press: function () {
                that.loadData();
            }
        });
        var pbt = new sap.m.Button(that.view.createId("cmdPost" + this.timeInLong), {
            icon: "sap-icon://post",
            text: Util.getLangText("postVou"),
            width: "20%",
            press: function () {
                that.postData();
            }
        });
        var pclose = new sap.m.Button({
            icon: "sap-icon://decline",
            text: Util.getLangText("cmdClose"),
            width: "20%",
            press: function () {
                that.joApp.backFunction();
            }
        });

        var fe = [
            Util.getLabelTxt("", "1%", ""), pclose,
            Util.getLabelTxt("", "1%", "@"), pbt,
            Util.getLabelTxt("", "1%", "@"), bt,
            Util.getLabelTxt("Fixed Assets Posting JV", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("Category", "25%", ""), txtCat,
            Util.getLabelTxt("JV Date", "25%"), jvdate,
            Util.getLabelTxt("JV Descr", "20%", "@"), jvdescr,
            // Util.getLabelTxt("vouType", "17%", "@"), cb,

        ];
        Util.navEnter(fe);

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
        // cnt.addContent(new sap.m.VBox({ height: "40px" }));
        this.mainPage.addContent(cnt);
        var fdt = that.view.today_date.getDateValue();

        var fr = new Date(fdt);

        UtilGen.setControlValue(jvdate, fr);


    }
    ,
    loadData: function () {
        var that = this;
        var qv = this.qr;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var jvdate = UtilGen.getControlValue(this.view.byId("jvdate" + this.timeInLong));
        var catno = UtilGen.getControlValue(this.view.byId("catno" + this.timeInLong));

        var sq = ("begin " +
            " c7_faExeQry(':usr',':catno',:todate); " +
            " end;").replaceAll(":usr", sett["LOGON_USER"])
            .replaceAll(":catno", catno)
            .replaceAll(":todate", Util.toOraDateString(jvdate));
        qv.reset();
        if (catno == "") return;
        var dt = Util.execSQL(sq);
        if (!dt.ret == "SUCCESS")
            FormView.err("Err !, executing procedure !");
        var cmdLink2 = function (obj, rowno, colno, lctb, frm) {
            var vcd = lctb.getFieldValue(rowno, "CODE");
            UtilGen.execCmd("gl.faitems formType=dialog formSize=100%,80% readonly=true status=view code=" + vcd, that.view, undefined, undefined);
        };
        sq = "select CODE, DESCR, PURPRICE, PURDATE, round(DEPRATE,2)||'%' deprate," +
            "DEPDAYS, TOTADD, TOTDED, TOTDEP, TOTVALUE, TOTPOSTED, TOTUNPOSTED," +
            " CATNO,CATNAME " +
            " FROM C7_VFEXE " +
            " WHERE USERNM='" + sett["LOGON_USER"] + "'" +
            " order by pos ";

        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            Util.setColProperties(qv, "CODE", {
                "mTitle": "txtCode",
                "mSummary": "COUNT_UNIQUE",
                "display_width": 70
            });
            Util.setColProperties(qv, "DESCR", {
                "mTitle": "descrTxt",
                "display_width": 200
            });
            Util.setColProperties(qv, "PURPRICE", {
                "mTitle": "shortTxtFAPurPrice",
                "display_format": "MONEY_FORMAT",
                "display_style": "background-color:lightgreen;",
                "mSummary": "SUM",
                "display_width": 100
            });
            Util.setColProperties(qv, "DEPRATE", {
                "mTitle": "shortTxtDepRate",
                "display_width": 60
            });
            Util.setColProperties(qv, "PURDATE", {
                "mTitle": "shortTxtPurDate",
                "display_format": "SHORT_DATE_FORMAT",
                "display_width": 80
            });

            Util.setColProperties(qv, "DEPDAYS", {
                "mTitle": "shortDepDays",
                "display_format": "QTY_FORMAT",
                "display_width": 60
            });
            Util.setColProperties(qv, "TOTADD", {
                "mTitle": "shortTxtBfDepAdd",
                "display_format": "MONEY_FORMAT",
                "mSummary": "SUM",
                "display_width": 70
            });
            Util.setColProperties(qv, "TOTDED", {
                "mTitle": "shortTxtBfDepDed",
                "display_format": "MONEY_FORMAT",
                "mSummary": "SUM",
                "display_width": 60
            });
            Util.setColProperties(qv, "TOTDEP", {
                "mTitle": "shortTotDep",
                "display_format": "MONEY_FORMAT",
                "display_style": "background-color:lightblue;",
                "mSummary": "SUM",
                "display_width": 100
            });
            Util.setColProperties(qv, "TOTVALUE", {
                "mTitle": "totalValue",
                "display_format": "MONEY_FORMAT",
                "display_style": "background-color:lightgrey;",
                "mSummary": "SUM",
                "display_width": 100
            });
            Util.setColProperties(qv, "TOTPOSTED", {
                "mTitle": "shortPostedDep",
                "display_format": "MONEY_FORMAT",
                "mSummary": "SUM",
                "display_width": 100
            });
            Util.setColProperties(qv, "TOTUNPOSTED", {
                "mTitle": "shortUnPostedDep",
                "display_format": "MONEY_FORMAT",
                "display_style": "background-color:yellow;",
                "mSummary": "SUM",
                "display_width": 100
            });
            Util.setColProperties(qv, "CATNO", {
                "mTitle": "txtGroup",
                "display_width": 60
            });
            Util.setColProperties(qv, "CATNAME", {
                "mTitle": "txtName",
                "display_width": 150
            });
            qv.mLctb.cols[qv.mLctb.getColPos("CODE")].commandLinkClick = cmdLink2;
            qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].commandLinkClick = cmdLink2;
            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
        }
    }
    ,
    // getInsKfs: function (kfldStr, kfs) {
    //     var thatForm = this;
    //     var chunkSize = 1000;
    //     if (kfs.length == 0)
    //         return kfldStr + " in () ";
    //     var getKfStr = function (kx) {
    //         var kkstr = "";
    //         for (var i = 0; i < kx.length; i++)
    //             kkstr += (kkstr.length > 0 ? "," : "") + kx[i];
    //         return kkstr;
    //     };
    //     var ks = [];
    //     for (var i = 0; i < kfs.length; i += chunkSize)
    //         ks.push(kfs.slice(i, i + chunkSize));
    //     var kstr = "";
    //     for (var j = 0; j < ks.length; j++)
    //         kstr += (kstr.length > 0 ? " or " : "") + kfldStr + " in (" + getKfStr(ks[j]) + ")";
    //     return kstr;
    // },
    postData: function () {
        var that = this;
        var slices = this.qr.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = that.qr.getControl().getBinding("rows").aIndices;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var jvdate = UtilGen.getControlValue(this.view.byId("jvdate" + this.timeInLong));
        var catno = UtilGen.getControlValue(this.view.byId("catno" + this.timeInLong));
        var des = this.view.byId("jvdescr" + this.timeInLong).getValue();
        if (Util.nvl(des, "") == "") FormView.err("Please enter DESCRIPTION !");
        if (slices.length <= 0) FormView.err("No item(s) selected !");
        // that.loadData();

        var updateData = function () {
            var sqls = "";
            var kfs = [];
            var kfx = "";
            var sqs = "";

            var getInsTmpSql = function (cod, pos) {
                return "insert into temporary(idno,usernm,field1,field2) values " +
                    "(91235,'" + sett["LOGON_USER"] + "','" + cod + "'," + pos + ");";
            };
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "CODE");
                var unposted = Util.extractNumber(Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "TOTUNPOSTED"));
                // var flg = Util.getSQLValue("select nvl(max(flag),-1) from acvoucher1 where referkeyfld is null and keyfld=" + kfld);

                if (unposted > 0) {
                    kfs.push(kfld);
                    sqs = sqs + getInsTmpSql(Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "CODE"), kfs.length);
                }
            }
            if (kfs.length == 0)
                FormView.err("No valid ITEM selected for post !");
            sqls = "delete from temporary where idno=91235 and usernm='" + sett["LOGON_USER"] + "';" + sqs;
            sqls = "begin " + sqls + " c7_fapostitems('" + sett["LOGON_USER"] + "','" +
                des + "'," +
                Util.toOraDateString(jvdate) +
                "); end;";
            var dt = Util.execSQL(sqls);
            if (dt.ret == "SUCCESS")
                setTimeout(() => {
                    sap.m.MessageToast.show(kfs.length + " # Items(s) posted in JV ! ");
                    that.loadData();
                }, 100);



        }

        Util.simpleConfirmDialog("Are you sure wanted to Create New Depreciation JV ? ", function (oAction) {
            updateData();
        });

    }
    ,
    save_data: function () {
    }
    ,
    get_emails_sel: function () {

    }

});



