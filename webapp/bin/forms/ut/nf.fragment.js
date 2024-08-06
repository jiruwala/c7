sap.ui.jsfragment("bin.forms.ut.nf", {

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
            showSubHeader: true,
            showHeader: false,
            showNavButton: false,
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
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 13, "L": 16, "XL": 25 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(false);
        qr.getControl().view = that2;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        qr.insertable = false;
        qr.deletable = false;
        this.qr = qr;
        UtilGen.createDefaultToolbar1(qr, ["USERNM", "SETUP_TYPE", "SETUP_TITLE"], false, function (sl) {
            thatForm.deleteNF(sl);
        }, function (sl) {
            thatForm.addNF(sl);
        });
        this.mainPage.addContent(qr.showToolbar.toolbar);
        this.mainPage.addContent(this.qr.getControl());

        this.loadData();

        setTimeout(function () {
            if (that.joApp.getParent().getParent() instanceof sap.m.Dialog) {
                that.joApp.getParent().getParent().setTitle("Notifications");
            }
        }, 10);
    },

    createViewHeader: function () {
        var that = this;
        var fe = [];
        var titSpan = "XL2 L4 M4 S12";
        var codSpan = "XL3 L2 M2 S12";
        var sett = sap.ui.getCore().getModel("settings").getData();
        this.cust_code = '';

        Util.destroyID("txtTit" + this.timeInLong, this.view);
        var tb = new sap.m.Toolbar({
            content: [
                new sap.m.Button({
                    icon: "sap-icon://nav-back",
                    text: "Close",
                    press: function () {
                        that.joApp.backFunction();
                    }

                })
            ]
        });


        var fe = [
            Util.getLabelTxt("titNotificationForm", "100%", "", "titleFontWithoutPad2 boldText"),

        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: ((sap.ui.Device.resize.width - 500) > 900 ? 900 : (sap.ui.Device.resize.width - 500)) + "px",
            cssText: [
            ]
        }, "sapUiSizeCompact", "");
        // cnt.addContent(new sap.m.VBox({ height: "40px" }));        
        that.mainPage.setSubHeader(tb);
        this.mainPage.addContent(cnt);
    }
    ,
    loadData: function () {
        var that = this;
        var qv = this.qr;
        var sq = "select s.keyfld,s.usernm,si.setup_title,to_char(s.LAST_NOTIFIED_TIME,'dd/mm/rrrr hh24.mi.ss') LAST_NOTIFIED_TIME,s.setup_type from C7_NOTIFY_SETUP s," +
            " C7_NOTIFY_SETUP_ITEMS si " +
            " where si.setup_type(+)=s.setup_type " +
            " order by s.keyfld desc ";

        var dt = Util.execSQL(sq);

        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.parse("{" + dt.data + "}", true);
            qv.mLctb.cols[qv.mLctb.getColPos("KEYFLD")].mHideCol = true;
            qv.mLctb.cols[qv.mLctb.getColPos("USERNM")].getMUIHelper().display_width = 80;
            qv.mLctb.cols[qv.mLctb.getColPos("SETUP_TYPE")].getMUIHelper().display_width = 100;
            qv.mLctb.cols[qv.mLctb.getColPos("SETUP_TITLE")].getMUIHelper().display_width = 150;
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
            qv.editable = true;

        }

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

    },
    deleteNF: function (sl) {
        var that = this;
        if (sl.length == 0)
            FormView.err("Not selected row !");
        Util.simpleConfirmDialog("Do you want to DELETE selected Notifications ?", function (oAction) {
            var sett = sap.ui.getCore().getModel("settings").getData();
            var usr = sett["LOGON_USER"];
            var ld = that.qr.mLctb;
            var sqls = "";
            for (var s = 0; s < sl.length; s++) {
                var kf = ld.getFieldValue(sl[s], "KEYFLD");
                sqls += "delete from c7_notify_setup where keyfld='" + kf + "';"
            }
            var dt = Util.execSQL("begin " + sqls + " end;");
            if (dt.ret == "SUCCESS")
                FormView.msgCustom(Util.getLangText("msgDeleted"), "maroon");
            that.loadData();

        });


    },
    addNF: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var vb = new sap.m.VBox({});
        var obs = [];
        var fe = [];
        var lstGroup = UtilGen.addControl(obs, "", sap.m.ComboBox, "lstGrps" + this.timeInLong + "",
            {
                enabled: true,
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{TITLE}", key: "{CODE}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                    showForm();
                },
                selectedKey: ""
            }, "string", undefined, this.view, undefined, "select code,name title from c7_notify_groups order by code");
        var update = function () {
            var sqls = "";
            var usr = sett["LOGON_USER"];
            var sq = "C7_NF_FROM_SETUP_ITEMS(':USERNAME',:KEYFLD,':COND_STR') ;";
            var sqDel = "delete from c7_notify_setup where usernm=':USERNAME' and setup_type=':SETUP_TYPE';";
            for (var i = 0; i < fe.length; i++) {
                var chk; var inp;
                if (fe[i] instanceof sap.m.CheckBox) {
                    chk = fe[i];
                    var kf = chk.getCustomData()[0].getKey();
                    var cs = chk.getCustomData()[1].getKey();
                    var st = chk.getCustomData()[2].getKey();
                    if (cs == "") { inp = fe[i + 2]; cs = inp.getValue(); i = i + 2 };
                    if (chk.getSelected()) {
                        sqls += (sq.replaceAll(":USERNAME", usr).
                            replaceAll(":KEYFLD", kf)
                            .replaceAll(":COND_STR", cs));
                    } else
                        sqls += (sqDel.replaceAll(":USERNAME", usr)
                            .replaceAll(":SETUP_TYPE", st));
                }
            }
            var dt = Util.execSQL("begin " + sqls + " end;");
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess(Util.getLangText("msgSaved"));
                dlg.close();
                that.loadData();
            }

        };
        var showForm = function () {
            vb.removeAllItems();
            fe = [];
            var sett = sap.ui.getCore().getModel("settings").getData();
            var grp = lstGroup.getSelectedKey();
            var sq = "SELECT NFI.GROUP_CODE,NFS.USERNM,NFI.KEYFLD,NFI.SETUP_TYPE,SETUP_TITLE," +
                " NFI.SETUP_TITLEA,NFI.CONDITION_STR,NFI.CONDITION_STR_LIST,NFS.KEYFLD NS_KEYFLD , NFS.CONDITION_STR NS_COND_STR " +
                " FROM C7_NOTIFY_SETUP_ITEMS NFI,C7_NOTIFY_SETUP NFS " +
                " WHERE NFS.SETUP_TYPE(+)=NFI.SETUP_TYPE " +
                " AND NFI.GROUP_CODE=':GROUP_CODE' AND MULTI_SELECT='N'" +
                " ORDER BY NFI.KEYFLD";
            sq = sq.replaceAll(":GROUP_CODE", grp)
                .replaceAll(":USERNAME", sett["LOGON_USER"]);
            var dt = Util.execSQLWithData(sq);
            for (var i = 0; i < dt.length; i++) {
                var inp = undefined;
                var txt = dt[i].SETUP_TITLE;
                var chk = new sap.m.CheckBox({
                    customData: [{ key: dt[i].KEYFLD }, { key: Util.nvl(dt[i].CONDITION_STR, "") }, { key: Util.nvl(dt[i].SETUP_TYPE, "") }],
                    text: txt,
                    width: "60%",
                    selected: false,
                });
                if (dt[i].NS_KEYFLD != null) chk.setSelected(true);
                if (Util.nvl(dt[i].CONDITION_STR, "") == "") {
                    inp = new sap.m.Input({
                        width: "90%",
                        customData: [{ key: dt[i].KEYFLD }],
                        value: dt[i].NS_COND_STR
                    })
                }
                fe.push(Util.getLabelTxt("", "1%", ""));
                fe.push(chk);
                if (inp != undefined) {
                    fe.push(Util.getLabelTxt("", "10%", ""));
                    fe.push(inp);
                }
            }
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, { vertical: true, height: "200px", width: "390px" }, "sapUiSizeCompact", "");
            vb.addItem(cnt);
        }
        var toolbar = new sap.m.Toolbar({
            content: [new sap.m.Text({ text: "Group : " }), lstGroup
            ]
        });
        var btAp = new sap.m.Button({
            text: "Update..",
            press: function () {
                update();
            }
        });

        var dlg = new sap.m.Dialog({
            title: Util.getLangText("Add Notification"),
            contentWidth: "400px",
            contentHeight: "300px",
            content: [toolbar, vb],
            buttons: [
                btAp,
                new sap.m.Button({
                    text: Util.getLangText("closeTxt"),
                    press: function () {
                        dlg.close();
                    }
                })

            ]
        }).addStyleClass("sapUiSizeCompact");
        dlg.open();

    }


});



