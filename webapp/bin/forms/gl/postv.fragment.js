sap.ui.jsfragment("bin.forms.gl.postv", {

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
        var recs = UtilGen.dispTblRecsByDevice({ "S": 8, "M": 12, "L": 15, "XL": 23 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(true);
        qr.getControl().view = that2;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;


        this.mainPage.addContent(this.qr.getControl());

        this.loadData();


    },
    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        this.cust_code = '';
        var fisc = sap.ui.getCore().getModel("fiscalData").getData();
        Util.destroyID("cmdPost" + this.timeInLong, that.view);
        var fromdate = UtilGen.addControl(fe, "From Date", sap.m.DatePicker, "postjvFromdate" + this.timeInLong,
            {
                width: "22%"
            }, "date", undefined, this.view);
        var todate = UtilGen.addControl(fe, "To Date", sap.m.DatePicker, "postjvTodate" + this.timeInLong,
            {
                width: "20%"
            }, "date", undefined, this.view);

        var cb = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "cb1" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "19%",
                selectedKey: "-1",
                selectionChange: function (e) {
                    that.loadData();
                }
            }, "string", undefined, this.view, undefined, "@-1/All,1/General JVs,2/RVs,3/PVs"
        );

        var usr = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "usr" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "19%",
                selectedKey: "-1",
                selectionChange: function (e) {
                    that.loadData();
                }
            }, "string", undefined, this.view, undefined, "select '-1' code,'All' name from dual union all select USERNAME CODE , USERNAME NAME FROM CP_USERS "
        );

        var cbStat = UtilGen.addControl(fe, "Label", sap.m.ComboBox, "cbS" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "19%",
                selectedKey: "1",
                selectionChange: function (e) {
                    that.loadData();
                }
            }, "string", undefined, this.view, undefined, "@1/Open,2/Posted"
        );

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
            Util.getLabelTxt("titlePostVou", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("fromDate", "10%"), fromdate,
            Util.getLabelTxt("toDate", "10%", "@"), todate,
            Util.getLabelTxt("vouType", "17%", "@"), cb,
            Util.getLabelTxt("Status", "81%", ""), cbStat,
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
        // cnt.addContent(new sap.m.VBox({ height: "40px" }));
        this.mainPage.addContent(cnt);
        var fdt = fisc.fiscal_from;
        var dt = new Date();
        var fr = new Date(fdt);
        var to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

        UtilGen.setControlValue(fromdate, fr);
        UtilGen.setControlValue(todate, to);


    }
    ,
    loadData: function () {

        var that = this;
        var qv = this.qr;
        var cb = this.view.byId("cb1" + this.timeInLong);
        var vc = Util.nvl(UtilGen.getControlValue(cb), 15);

        var cbS = this.view.byId("cbS" + this.timeInLong);
        var vcS = Util.nvl(UtilGen.getControlValue(cbS));

        var frmdt = UtilGen.getControlValue(this.view.byId("postjvFromdate" + this.timeInLong));
        var todt = UtilGen.getControlValue(this.view.byId("postjvTodate" + this.timeInLong));

        var cmdLink2 = function (obj, rowno, colno, lctb, frm) {
            var vcd = lctb.getFieldValue(rowno, "VOU_CODE");
            var typ = lctb.getFieldValue(rowno, "VOU_TYPE");
            var kfld = lctb.getFieldValue(rowno, "KEYFLD");
            var jvpos = 1;
            if (vcd == 1) {
                UtilGen.execCmd("gl.jv formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            } else if (vcd == 3 && (typ == 1 || typ == 6)) {
                UtilGen.execCmd("gl.pv formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            } else if (vcd == 3 && (typ == 2 || typ == 7)) {
                UtilGen.execCmd("gl.pvc formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            } else if (vcd == 2 && (typ == 1 || typ == 6)) {
                UtilGen.execCmd("gl.rv formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            } else if (vcd == 3 && (typ == 2 || typ == 7)) {
                UtilGen.execCmd("gl.rvc formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            }
            else {
                UtilGen.execCmd("gl.jv formType=dialog formSize=100%,80% readonly=true status=view keyfld=" + kfld + " jvpos=" + jvpos, that.view, obj, undefined);
            }
        };

        var sq = "select no,vou_date,getaccstr(vou_code,type) typedescr,descr,debamt," +
            "USERNM,CREATDT,POSTED_BY,POSTED_DATE,keyfld,type vou_type,vou_code from acvoucher1 " +
            " where referkeyfld is null and (vou_code=" + vc + " or " + vc + "=-1 )" +
            " and flag= " + vcS + " " +
            " and vou_date>=" + Util.toOraDateString(frmdt) +
            " and vou_date<=" + Util.toOraDateString(todt) +
            " order by vou_date,no ";
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.cols[qv.mLctb.getColPos("NO")].mTitle = Util.getLangText("vouNo");
            qv.mLctb.cols[qv.mLctb.getColPos("VOU_DATE")].mTitle = Util.getLangText("vouDate");
            qv.mLctb.cols[qv.mLctb.getColPos("USERNM")].mTitle = Util.getLangText("createdUser");
            qv.mLctb.cols[qv.mLctb.getColPos("CREATDT")].mTitle = Util.getLangText("createdOn");
            qv.mLctb.cols[qv.mLctb.getColPos("TYPEDESCR")].mTitle = Util.getLangText("stkVouType");

            qv.mLctb.cols[qv.mLctb.getColPos("VOU_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";
            qv.mLctb.cols[qv.mLctb.getColPos("DEBAMT")].getMUIHelper().display_format = "MONEY_FORMAT";

            qv.mLctb.cols[qv.mLctb.getColPos("NO")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("VOU_DATE")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("DESCR")].getMUIHelper().display_width = 150;
            qv.mLctb.cols[qv.mLctb.getColPos("DEBAMT")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("USERNM")].getMUIHelper().display_width = 60;
            qv.mLctb.cols[qv.mLctb.getColPos("CREATDT")].getMUIHelper().display_width = 130;
            qv.mLctb.cols[qv.mLctb.getColPos("TYPEDESCR")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].getMUIHelper().display_width = 0;
            qv.mLctb.cols[qv.mLctb.getColPos("VOU_TYPE")].getMUIHelper().display_width = 0;
            qv.mLctb.cols[qv.mLctb.getColPos("VOU_CODE")].getMUIHelper().display_width = 0;
            qv.mLctb.parse("{" + dt.data + "}", true);

            qv.mLctb.cols[qv.mLctb.getColPos("NO")].commandLinkClick = cmdLink2;
            qv.mLctb.cols[qv.mLctb.getColPos("VOU_DATE")].commandLinkClick = cmdLink2;
            qv.mLctb.cols[qv.mLctb.getColPos("TYPEDESCR")].commandLinkClick = cmdLink2;
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
            if (vcS == 1)
                that.view.byId("cmdPost" + that.timeInLong).setText(Util.getLangText("postVou"));
            else that.view.byId("cmdPost" + that.timeInLong).setText(Util.getLangText("postVou"));

        }

    }
    ,
    getInsKfs: function (kfldStr, kfs) {
        var thatForm = this;
        var chunkSize = 1000;
        if (kfs.length == 0)
            return kfldStr + " in () ";
        var getKfStr = function (kx) {
            var kkstr = "";
            for (var i = 0; i < kx.length; i++)
                kkstr += (kkstr.length > 0 ? "," : "") + kx[i];
            return kkstr;
        };
        var ks = [];
        for (var i = 0; i < kfs.length; i += chunkSize)
            ks.push(kfs.slice(i, i + chunkSize));
        var kstr = "";
        for (var j = 0; j < ks.length; j++)
            kstr += (kstr.length > 0 ? " or " : "") + kfldStr + " in (" + getKfStr(ks[j]) + ")";
        return kstr;
    },
    postData: function () {
        var that = this;
        var slices = this.qr.getControl().getSelectedIndices(); //that.qv.getControl().getBinding("rows").aIndices;
        var slicesof = that.qr.getControl().getBinding("rows").aIndices;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var cb = this.view.byId("cb1" + this.timeInLong);
        var vc = Util.nvl(UtilGen.getControlValue(cb), 15);
        var cbS = this.view.byId("cbS" + this.timeInLong);
        var vcS = Util.nvl(UtilGen.getControlValue(cbS));
        var strPost = (vcS == 1 ? "posted" : "un-posted");

        if (vcS == 1 && Util.nvl(sett["ALLOW_POST_VOUCHER"], "TRUE") != "TRUE")
            FormView.err("Not Allowed to POST !");
        if (vcS == 2 && Util.nvl(sett["ALLOW_UNPOST_VOUCHER"], "FALSE") != "TRUE") {
            if (sett["PROFILENO"] != 0)
                FormView.err("Only Admin user is Allowed to Un-post");
            FormView.err("Not Allowed to UNPOST VOUCHER !");
        }
        that.loadData();

        var updateData = function () {
            var sqls = "";
            var kfs = [];
            var kfx = "";
            for (var i = 0; i < slices.length; i++) {
                var kfld = Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "KEYFLD");
                var flg = Util.getSQLValue("select nvl(max(flag),-1) from acvoucher1 where referkeyfld is null and keyfld=" + kfld);
                if (vcS == flg) {
                    kfs.push(kfld);
                    kfx += (kfx.length > 0 ? "," : "") + Util.getCellColValue(that.qr.getControl(), slicesof[slices[i]], "KEYFLD");
                }
            }
            if (kfx.length == 0)
                FormView.err("No record selected for post !");
            if (vcS == 1)
                sqls = "begin " +
                    " update acvoucher2 set flag=2 where (:txtKeyfld); " +
                    " update acvoucher1 set flag=2,posted_by=':POSTED_BY',posted_date=sysdate where (:txtKeyfld); " +
                    " end; ";
            if (vcS == 2)
                sqls = "begin " +
                    " update acvoucher2 set flag=1 where (:txtKeyfld); " +
                    " update acvoucher1 set flag=1,posted_by=':POSTED_BY',posted_date=null where (:txtKeyfld); " +
                    " end; ";
            sqls = sqls.replaceAll(":txtKeyfld", that.getInsKfs("keyfld", kfs))
                .replaceAll(":POSTED_BY", sett["LOGON_USER"]);
            ;
            var dt = Util.execSQL(sqls);
            if (dt.ret == "SUCCESS")
                setTimeout(() => {
                    sap.m.MessageToast.show(kfs.length + " # Voucher(s) " + strPost + " ! ");
                }, 100);


            that.loadData();
        }

        Util.simpleConfirmDialog("Are you sure wanted to " + strPost + " data ? ", function (oAction) {
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



