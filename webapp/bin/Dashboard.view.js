sap.ui.jsview('bin.Dashboard', {

    /**
     * Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf bin.Dashboard **/
    getControllerName: function () {
        return 'bin.Dashboard';
    },

    /**
     * Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf bin.Dashboard **/
    createContent: function (oController) {
        jQuery.sap.require("sap.viz.library");
        jQuery.sap.require("sap.ui.table.library");
        jQuery.sap.require("sap.ui.layout.library");
        jQuery.sap.require("sap.ui.commons.library");
        jQuery.sap.require("sap.f.ShellBar");
        this.addStyleClass("sapUiSizeCompact");
        this.timeInLong = (new Date()).getTime();
        Util.setLanguageModel(this);
        this.autoHideMenus = true;
        var that = this;
        UtilGen.DBView = this;
        this.standAlonMode = false;
        that.screen = -1;
        that.screen_name = "";
        that.screen_type = "Dashboard";
        this.mLctb = undefined;

        var url = new URL(window.location.href);
        var code = url.searchParams.get("screen");
        if (code != undefined)
            that.screen_init = code;

        Util.doAjaxGet("settings", "", false).done(function (data) {
            var dt = JSON.parse(data);
            var oModel = new sap.ui.model.json.JSONModel(dt);
            sap.ui.getCore().setModel(oModel, "settings");
        });

        this.sp = new sap.f.ShellBar({
            title: Util.getLangText("gl"),
            homeIcon: "./css/chn.png",
            showCopilot: true,
            showSearch: true,
            showNotifications: true,
            showProductSwitcher: false,
            showMenuButton: true,
            notificationsNumber: "0",
            homeIconPressed: function () {
                var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode);
                md = (that.standAlonMode ? sap.m.SplitAppMode.HideMode : md);
                that.app.setMode(md);
            },
            copilotPressed: function () {
                // var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode);
                // that.app.setMode(md);
                // UtilGen.setControlValue(that.lstPgs, "main");
                // that.lstPgs.fireSelectionChange();
                var cn = that.lstPgs.getItems().indexOf(that.lstPgs.getSelectedItem());
                cn++;
                if (cn > that.lstPgs.getItems().length - 1)
                    cn = 0;
                that.lstPgs.setSelectedItem(that.lstPgs.getItems()[cn]);
                that.lstPgs.fireSelectionChange();

            },
            notificationsPressed: function (event) {
                Util.Notifications.showList(event, event.getParameter("button"));
            },
            menuButtonPressed: function (ev) {
                // var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode)
                // that.app.setMode(md);
                // if (that.app.getMode() == sap.m.SplitAppMode.HideMode)
                //     that.app.toMaster(that.pgMain);
                // else {
                //     that.app.toDetail(that.pg);
                //     that.show_main_menus();
                // }

                // that.app.showMaster();
                if (that.app.isMasterShown()) {
                    that.app.hideMaster();
                }
                else
                    if (!that.standAlonMode)
                        that.app.showMaster();
            },
            menu: new sap.m.Menu({
                items: [
                    new sap.m.MenuItem({
                        text: "Refresh..", icon: "sap-icon://menu2", press: function () {
                            var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode)
                            that.app.setMode(md);
                            if (that.app.getMode() == sap.m.SplitAppMode.HideMode)
                                that.app.toMaster(that.pgMain);
                            else {
                                that.app.toDetail(that.pg);
                                that.show_main_menus();
                            }
                        }
                    }),
                    new sap.m.MenuItem({
                        text: "Log out..", icon: "sap-icon://log", press: function () {
                            that.do_logon(true);
                        }
                    })
                ]
            })
        }).addStyleClass("sapFShellBar");

        this.txtExeCmd = new sap.m.TextArea({ height: "25px", width: "100%" });
        this.txtExeCmd.attachBrowserEvent("dblclick", function (e) {
            that.showPopCmd();
        });
        this.cmdExe = new sap.m.Button(
            {
                text: "Execute",
                icon: "sap-icon://process",
                press: function (e) {
                    UtilGen.execCmd(that.txtExeCmd.getValue(), that, that.txtExeCmd, that.newPage);
                }
            });
        this.txtExeCmd.attachBrowserEvent("keydown", function (oEvent) {
            if (oEvent.key == 'Enter') {
                that.txtExeCmd.selectText();
                that.showPopCmd();

            }
        });

        Util.destroyID("txtWindow", this);
        this.lstPgs = new sap.m.ComboBox(this.createId("txtWindow"), {
            selectionChange: function (e) {
                that.lstPageChange();
            }
        });// Database

        var nxt = new sap.m.Button({
            icon: "sap-icon://journey-arrive",
            press: function (e) {
                var cn = that.lstPgs.getItems().indexOf(that.lstPgs.getSelectedItem());
                cn++;
                if (cn > that.lstPgs.getItems().length - 1)
                    cn = 0;
                that.lstPgs.setSelectedItem(that.lstPgs.getItems()[cn]);
                that.lstPgs.fireSelectionChange();
            }
        });

        var itm = new sap.ui.core.ListItem({
            text: "Main", key: "main"
        });

        this.lstPgs.addItem(itm);
        this.lstPgs.setSelectedItem(itm);

        // detail page where all sections and main menus will display..
        this.pg = new sap.m.Page({
            showHeader: false,
            showSubHeader: true,
            showFooter: false,
            enableScrolling: true,
            content: [],
            floatingFooter: false,
        });

        // detail page where forms will display...
        this.pg1 = [];


        this.newPage = function (dtx) {
            var pg1 = new sap.m.Page({
                showHeader: false,
                showFooter: false,
                content: [],
            });
            that.app.addDetailPage(pg1);
            that.pg1.push(pg1);
            var itm = new sap.ui.core.ListItem({ text: Util.nvl(dtx.formTitle, dtx.formName), key: dtx.formName });
            that.lstPgs.addItem(itm);
            that.lstPgs.setSelectedItem(itm);
            pg1.item = itm;
            return pg1;

        };
        // action side menu page.
        this.pgMain = new sap.m.Page({
            showHeader: false,
            showFooter: true,
            enableScrolling: false,
            content: [],
        });
        var appMaster = new sap.m.App({ height: "90%", pages: [this.pgMain] });
        this.app = new sap.m.SplitApp({
            detailPages: [this.pg],
            masterPages: [appMaster],
            mode: sap.m.SplitAppMode.StretchCompressMode,
        });


        this.pg1.push(this.pg);
        //main page where split app and shellbar will display...
        this.mainPage = new sap.m.Page({
            showHeader: true,
            showFooter: true,
            enableScrolling: false,
            content: [this.app],
            customHeader: [this.sp],
            footer: [
                new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({ text: "Pages :", width: "80px" }), this.lstPgs, nxt, this.txtExeCmd, that.cmdExe
                    ]
                })
            ]

        });
        this.txt = new sap.m.Text().addStyleClass("redMiniText blinking");
        this.today_date = new sap.m.DatePicker({
            width: "150px",
            change: function (e) {
                var fisc = sap.ui.getCore().getModel("fiscalData").getData();
                if (!this.isValidValue())
                    this.setDateValue(new Date(fisc.fiscal_from));
                that.loadData(false, false);
            }

        });
        Util.destroyID("lblLastDay" + this.timeInLong, this);
        Util.destroyID("lblFiscal" + this.timeInLong, this);
        var tb = new sap.m.Toolbar({
            content: [
                new sap.m.Button({
                    icon: "sap-icon://menu",
                    press: function () {
                        var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode);
                        md = (that.standAlonMode ? sap.m.SplitAppMode.HideMode : md);
                        that.app.setMode(md);
                    }
                }),

                new sap.m.Button({
                    text: Util.getLangText("refresh"),
                    tooltip: Util.getLangText("refreshTip"),
                    icon: "sap-icon://refresh", press: function () {
                        that.loadData(false, false);
                    }
                }),
                this.today_date, new sap.m.Label(this.createId("lblLastDay" + this.timeInLong)),
                new sap.m.Label(this.createId("lblFiscal" + this.timeInLong)).addStyleClass("darkBlueText htmlLnk"),
                new sap.m.ToolbarSpacer(), this.txt]
        });
        this.byId("lblFiscal" + this.timeInLong).attachBrowserEvent("click", function () {
            that.listFiscals();
        });
        this.app2 = new sap.m.App({ pages: [this.mainPage], height: "99%", width: "100%" });
        this.pg.setSubHeader(tb);
        Util.Notifications.init(3000, this.sp, this);

        this.loadData();
        this.mainPage.setShowSubHeader(true);
        var tbS = new sap.m.Bar({
        }).addStyleClass("toolBarBackgroundColor2");
        this.mainPage.setSubHeader(tbS);
        setTimeout(function () {
            that.app.showMaster();
            var tb = that.mainPage.getSubHeader();
            // that.show_main_menus();
        }, 10);
        UtilGen.toolBarBackColor = "#addfad";
        return this.app2;

    },
    listFiscals: function () {
        var that = this;
        var cf = sap.ui.getCore().getModel("fiscalData").getData().fiscal_code;
        var sq = "select code,title from c7_fiscals order by code"
        var obs = [];
        var vb = new sap.m.VBox();
        var btAp = new sap.m.Button({
            text: Util.getLangText("applyTxt"),
            enabled: false,
            press: function () {
                var cod = UtilGen.getControlValue(cp);
                that.changeFiscal(cod);
            }
        });
        var cp = UtilGen.addControl(obs, "", sap.m.ComboBox, "cmdFiscals" + this.timeInLong + "",
            {
                enabled: true,
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{TITLE}", key: "{CODE}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                    var cod = UtilGen.getControlValue(this);
                    vb.removeAllItems();
                    var dt = Util.execSQL("select *from c7_fiscals where code='" + cod + "'");
                    if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        var txtTitle = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "74%", editable: false });
                        var txtFromDate = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "74%", editable: false });
                        var txtTodate = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "74%", editable: false });
                        var txtSchemaOwner = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "74%", editable: false });

                        txtTitle.setValue(dtx[0].TITLE);
                        txtFromDate.setValue(dtx[0].FROM_DATE);
                        txtTodate.setValue(dtx[0].TO_DATE);
                        txtSchemaOwner.setValue(dtx[0].SCHEMA_OWNER);

                        var fe = [
                            Util.getLabelTxt("titleTxt", "25%"), txtTitle,
                            Util.getLabelTxt("fromDate", "25%"), txtFromDate,
                            Util.getLabelTxt("toDate", "25%"), txtTodate,
                            Util.getLabelTxt("toMenuCode", "25%"), txtSchemaOwner,
                        ];

                        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                            width: "300px",
                            cssText: [
                                "padding-left:5px ;" +
                                "padding-top:20px;" +
                                "border-style: groove;" +
                                "margin-left: 10%;" +
                                "margin-right: 10%;" +
                                "border-radius:20px;" +
                                "margin-top: 20px;"
                            ]
                        }, "sapUiSizeCompact", "");
                        cnt.addContent(new sap.m.VBox({ height: "40px" }));
                        vb.addItem(cnt);
                        btAp.setEnabled(true);
                        if (dtx[0].CODE == cf)
                            btAp.setEnabled(false);

                    }

                },
                value: ""
            }, "string", undefined, this, undefined, sq);
        var toolbar = new sap.m.Toolbar({
            content: [new sap.m.Text({ text: "Fiscal Year: " }), cp
            ]
        });
        UtilGen.setControlValue(cp, cf, cf, true);
        // cp.setSelectedItem(cp.getItems()[0]);
        cp.fireSelectionChange();

        var dlg = new sap.m.Dialog({
            title: Util.getLangText("changeFiscalYear"),
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
        });
        dlg.open();
    },
    showShortcuts: function () {
        var that = this;
        var tb = that.mainPage.getSubHeader();
        if (tb == null || tb == undefined) return;
        var str = (this.sLangu == "AR" ? " nvl(nvl(short_titlea,menu_titlea),nvl(short_title,menu_title)) menu_title " : " nvl(short_title,menu_title) menu_title ");
        var str2 = (this.sLangu == "AR" ? " nvl(menu_titlea,menu_title) menu_title2 " : " menu_title menu_title2 ");
        var dt = Util.execSQL("select menu_code," + str + ",js_command,SHORTCUT_ICON," + str2 + " from c7_menus where shortcut = 'Y' and group_code = " + Util.quoted(that.current_profile) + " order by menu_path");
        if (dt.ret != "SUCCESS")
            Util.err(dt.ret);
        var dtx = JSON.parse("{" + dt.data + "}").data;
        tb.removeAllContentMiddle();
        tb.removeAllContentRight();
        for (var i = 0; i < dtx.length; i++) {
            var bt = new sap.m.Button({
                text: dtx[i].MENU_TITLE,
                tooltip: dtx[i].MENU_TITLE2,
                icon: Util.nvl(dtx[i].SHORTCUT_ICON, "sap-icon://form"),
                customData: [{ key: dtx[i].CODE }, { key: dtx[i].JS_COMMAND }],
                press: function () {
                    var js = this.getCustomData()[1].getKey();
                    UtilGen.execCmd(js, that, this, that.newPage);
                }
            }).addStyleClass("");
            tb.addContentMiddle(bt);

        }
    },
    showPopCmd: function () {
        var that = this;
        var txt = new sap.m.TextArea({
            width: "100%",
            height: "100%",
            value: that.txtExeCmd.getValue()
        });
        var rbt = new sap.m.Button({
            text: "x", press: function () {
                that.txtExeCmd.setValue(txt.getValue());
                pop.close();
            }
        });
        var fe = [];
        var fe2 = [];
        var cmdList = UtilGen.addControl(fe, "Setup Type", sap.m.ComboBox, "cmdList" + this.timeInLong + "_",
            {
                enabled: true,
                customData: [{ key: "" }],
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{COMMAND}", key: "{KEYFLD}" }),
                    templateShareable: true
                },
                selectionChange: function (ev) {
                    var kf = UtilGen.getControlValue(this);
                    var cmd = Util.getSQLValue("select exec_line from C7_COMMANDS where keyfld=" + kf);
                    cmd = cmd.replaceAll('**', ':');
                    cmd = cmd.replaceAll('*.', "'");
                    cmd = cmd.replaceAll(/\\n/g, '\n');
                    txt.setValue(cmd);
                },
                value: ""
            }, "string", undefined, this, undefined, "select KEYFLD ,COMMAND FROM C7_COMMANDS ORDER BY KEYFLD");
        var pop = new sap.m.Popover({
            contentHeight: "30%",
            contentWidth: "70%",
            content: [txt],
            placement: sap.m.PlacementType.Auto,
            modal: false,
            customHeader: new sap.m.Toolbar({
                content: [
                    new sap.m.Button({
                        text: "F5 -Execute", press: function () {
                            rbt.firePress();
                            that.cmdExe.firePress();
                        }
                    }),
                    cmdList,
                    new sap.m.Button({
                        icon: "sap-icon://save",
                        press: function (e) {
                            var str = "begin delete from c7_commands where command=':command';" +
                                " insert into c7_commands (keyfld,command,exec_line) values " +
                                "((select nvl(max(keyfld),0)+1 from c7_commands),':command',':exec_line');" +
                                "end; ";
                            var tx = txt.getValue();
                            // tx = tx.replaceAll(/\n/g, "\\n");
                            tx = tx.replaceAll(/:/g, "**");
                            tx = tx.replaceAll(/\'/g, "*.");
                            tx = tx.replaceAll(/\n/g, "\\n");

                            str = str.replaceAll(":command", cmdList.getValue());
                            str = str.replaceAll(":exec_line", tx);
                            Util.execSQL(str);
                            sap.m.MessageToast.show("Saved command, #" + cmdList.getValue());
                        }
                    }),
                    new sap.m.ToolbarSpacer(),
                    rbt
                ]
            })
        })
            ;

        pop.openBy(that.txtExeCmd);

        txt.attachBrowserEvent("keydown", function (e) {
            if (e.key == 'F5') {
                rbt.firePress();
                that.cmdExe.firePress();
            }
        });
        setTimeout(function () {
            // var parentId = txt.getParent().getId();
            // var heightParent = $("#" + parentId + "-cont").css("height");
            txt.setHeight("1000px");
            txt.setValue(that.txtExeCmd.getValue());
            txt.focus();
            var l = $("#" + txt.getId() + "-inner")[0].value.length;
            $("#" + txt.getId() + "-inner")[0].setSelectionRange(l, l);
            $("#" + txt.getId() + "-inner").attr("spellcheck", false);

        }, 500);
    },
    recentClick: function (ri) {
        var tbl = this.rdtx[ri].TABLE_NAME;
        var tt = this.rdtx[ri].TRANS_TYPE;
        var vp1 = this.rdtx[ri].VAL_PARA_1;
        var vp2 = this.rdtx[ri].VAL_PARA_2;
        var vp3 = this.rdtx[ri].VAL_PARA_3;
        if (tbl == "ACACCOUNT" && (tt == "UPDATE" || tt == "INSERT"))
            UtilGen.execCmd("bin.forms.gl.masterAc formType=dialog formSize=650px,350px status=view accno=" + vp1, this, this, this.newPage);
        if (tbl == "ACVOUCHER1" && (tt == "UPDATE" || tt == "INSERT") && vp2 == "VOU_CODE=1,TYPE=1")
            UtilGen.execCmd("bin.forms.gl.jv formType=page status=view keyfld=" + vp1, this, this, this.newPage);
    },
    do_logon: function (fnLoad) {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var ln = sap.ui.getCore().getConfiguration().getLanguage();
        Util.destroyID("txtUser", this);
        Util.destroyID("txtPassword", this);
        Util.destroyID("txtFile", this);
        Util.destroyID("chkAuto", this);
        Util.destroyID("cmdLogon", this);

        Util.destroyID("txtFile2", this);
        Util.destroyID("txtUser2", this);
        Util.destroyID("txtPassword2", this);
        Util.destroyID("txtHost", this);

        var op = new sap.m.Input(this.createId("txtUser")); // User name
        var np = new sap.m.Input(this.createId("txtPassword"), { type: sap.m.InputType.Password }); // New Password
        var cp = new sap.m.ComboBox(this.createId("txtFile"), {
            width: "100%",
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{file}", key: "{file}" }),
                templateShareable: true
            },
        });// Database
        var al = new sap.m.CheckBox(this.createId("chkAuto"), {
            width: "100%",
            selected: false,
            text: " Save credentials"
        }).addStyleClass("");

        var fnInitChange = function (ev) {
            var fl = UtilGen.getControlValue(cp2);
            Util.doAjaxGet("exe?command=get-init-data", "file=" + fl, false).done(function (data) {
                var oModel = new sap.ui.model.json.JSONModel();
                var dt = JSON.parse(data);
                op2.setValue(dt.ini_owner);
                np2.setValue(dt.ini_password);
                hs.setValue(dt.ini_dburl);
            });
        };

        var cp2 = new sap.m.ComboBox(this.createId("txtFile2"), {
            width: "100%",
            items: {
                path: "/",
                template: new sap.ui.core.ListItem({ text: "{file}", key: "{file}" }),
                templateShareable: true

            },
            selectionChange: fnInitChange
        });
        cp2.addEventDelegate({
            onfocusout: $.proxy(fnInitChange)

        });
        var op2 = new sap.m.Input(this.createId("txtUser2")); // User name
        var np2 = new sap.m.Input(this.createId("txtPassword2"), { type: sap.m.InputType.Password }); // New Password
        var hs = new sap.m.Input(this.createId("txtHost"), { value: "jdbc:oracle:thin:@HOST:1521:orcl" });


        Util.doAjaxGet("exe?command=get-init-files", "", false).done(function (data) {
            var oModel = new sap.ui.model.json.JSONModel();
            var dt = JSON.parse(data);
            dt.push({ file: ".Schema" });
            dt.push({ file: ".New Init" });
            oModel.setData(dt);

            cp.setModel(oModel);
            cp2.setModel(oModel);
            if (cp.getItems().length > 0)
                cp.setSelectedItem(cp.getItems()[0]);
        });

        var tb = new sap.m.Toolbar({
            content: [
                new sap.m.Button({
                    icon: "sap-icon://nav-back",
                    press: function () {
                        dlg.removeAllContent();
                        dlg.addContent(vb);
                        for (var i in bts)
                            dlg.addButton(bts[i]);
                    }
                }),
                new sap.m.Button({
                    icon: "sap-icon://save",
                    press: function () {

                    }
                })
            ]
        });
        var url = new URL(window.location.href);
        var user = url.searchParams.get("user");
        if (user != undefined)
            op.setValue(user);
        if (url.searchParams.get("password") != undefined)
            np.setValue(url.searchParams.get("password"));
        if (url.searchParams.get("file") != undefined)
            Util.setComboValue(cp, url.searchParams.get("file"));
        // cp.setValue(url.searchParams.get("file"));
        if (Util.nvl(np.getValue(), "") != "" &&
            Util.nvl(op.getValue(), "") != "" &&
            Util.nvl(cp.getValue(), "") != "")
            setTimeout(function () {
                that.byId("cmdLogon").firePress();
                var locUrl = location.href;
                var newURL = locUrl.split("?")[0];
                var newPara = "";
                var ar1 = ["user", "password", "file"];
                var u1 = locUrl.split("?")[1].split("&");
                for (var ui in u1)
                    if (ar1.indexOf(u1[ui].split("=")[0]) < 0)
                        newPara += (newPara.length > 0 ? "&" : "") + u1[ui];
                newURL = newURL + (newPara.length > 0 ? "?" : "") + newPara;
                console.log(newURL);
                window.history.pushState({}, document.title, newURL);
                // setTimeout(function () {
                //     that.exeParams();
                // }, 1000);

            });

        var vb = new sap.m.VBox({
            items: [
                new sap.m.Text({ text: Util.getLangText("loginName") }),
                op,
                new sap.m.Text({ text: Util.getLangText("loginPwd") }),
                np,
                new sap.m.Text({ text: Util.getLangText("loginDatabase") }),
                cp,
                new sap.m.HBox({ width: "100%", items: [al] }),

            ]
        }).addStyleClass("sapUiSmallMargin");

        var bts = [
            new sap.m.Button({
                text: ln == "AR" ? "EN" : "عر",
                icon: "sap-icon://keyboard-and-mouse",
                press: function () {
                    var ln2 = (ln == "AR" ? "EN" : "AR");
                    var locUrl = location.href;
                    var newURL = locUrl.split("?")[0] + "?" + "user=&sap-language=" + ln2;
                    window.history.pushState({}, document.title, newURL);
                    window.onbeforeunload = undefined;
                    location.reload();
                    window.onbeforeunload = function () { return " " }

                }
            }),
            new sap.m.Button({
                text: "New file", press: function () {
                    dlg.removeAllButtons();
                    dlg.removeAllContent();
                    dlg.addContent(vbInit);
                }
            }),
            new sap.m.Button(this.createId("cmdLogon"), {
                text: Util.getLangText("loginCmd"),
                icon: "sap-icon://initiative",
                press: function () {
                    if (that.loginPress()) {
                        sap.m.MessageToast.show(Util.getLangText("loginMsg1"));
                        that.loadData_main();
                        that.show_main_menus();
                        dlg.close();
                        setTimeout(function () {
                            that.exeParams();
                        }, 1000);
                    }

                }
            })];

        var vbInit = new sap.m.VBox({
            items: [
                tb,
                new sap.m.Text({ text: "Database" }),
                cp2,
                new sap.m.Text({ text: "{i18n>login_name}" }),
                op2,
                new sap.m.Text({ text: "{i18n>login_pwd}" }),
                np2,
                new sap.m.Text({ text: "{i18n>login_databaseHost}" }),
                hs,

            ]
        }).addStyleClass("sapUiSmallMargin");

        var dlg = new sap.m.Dialog({
            title: "Logon..",
            buttons: bts,
            content: [vb]
        });
        dlg.open();
        Util.navEnter([op, np, cp, al, this.byId("cmdLogon")]);
        op.focus();
        // op.$().on("keydown", function (event) {
        //     console.log(event);
        //     if (event.keyCode == 13 || event.keyCode == 40) {
        //         np.focus();
        //     }
        // });
        //

    }
    ,
    loadData: function (pexePara, pChangeProfile) {
        var that = this;
        var changeProfile = Util.nvl(pChangeProfile, true);
        var exePara = Util.nvl(pexePara, true);
        var mdl = sap.ui.getCore().getModel("settings");
        that.standAlonMode = false;
        if (mdl == undefined) {
            this.do_logon();
            return;
        }
        var sett = sap.ui.getCore().getModel("settings").getData();

        if (sett["PROFILENO"] == undefined) {
            this.do_logon();
            return;
        }
        var url = new URL(window.location.href);
        var sm = url.searchParams.get("standalone");
        if (sm != undefined && sm == "true")
            that.standAlonMode = true;
        var user = url.searchParams.get("user");
        if (exePara && user != undefined) {
            this.do_logon();
            return;
        }

        if (changeProfile && !(Object.keys(sett).length === 0
            && Object.getPrototypeOf(sett) === Object.prototype)) {
            this.current_profile = sett["CURRENT_PROFILE_CODE"];
            var tit = (Util.getLangDescrAR("title", "nvl(titlea,title) title"));
            this.current_profile_name = Util.getSQLValue("select " + tit + " from C6_MAIN_GROUPS where code=" + Util.quoted(this.current_profile));
            this.style_debit_numbers = Util.nvl(sett["STYLE_DEBIT_NUMBERS"], "color:green");
            this.style_credit_numbers = Util.nvl(sett["STYLE_CREDIT_NUMBERS"], "color:red");

        }
        this.getFiscalData();

        this.show_main_menus();
        this.loadData_main();
        if (exePara)
            setTimeout(function () {
                that.exeParams();
            }, 1000);
    }
    ,
    changeFiscal: function (fcode) {
        var that = this;
        Util.doAjaxGet("exe?command=get-fiscal-change&code=" + fcode, "", false).done(function (data) {
            if (data != undefined) {
                var dt = JSON.parse(data);
                var oModel = new sap.ui.model.json.JSONModel(dt);
                sap.ui.getCore().setModel(oModel, "fiscalData");
                //                that.byId("lblFiscal" + that.timeInLong).setText(dt.fiscal_title);
                var locUrl = location.href;
                var ln = sap.ui.getCore().getConfiguration().getLanguage();
                var newURL = locUrl.split("?")[0] + "?" + "&sap-language=" + ln;
                window.history.pushState({}, document.title, newURL);
                window.onbeforeunload = undefined;
                location.reload();
                window.onbeforeunload = function () { return " " }

                // that.byId("lblFiscal" + that.timeInLong).setText(sap.ui.getCore().getModel("fiscalData").getData().fiscal_title);
            }
        });

    },
    getFiscalData: function () {
        var that = this;
        Util.doAjaxGet("exe?command=get-fiscal-data", "", false).done(function (data) {
            if (data != undefined) {
                var dt = JSON.parse(data);
                var oModel = new sap.ui.model.json.JSONModel(dt);
                sap.ui.getCore().setModel(oModel, "fiscalData");
                that.byId("lblFiscal" + that.timeInLong).setText(dt.fiscal_title);
                // that.byId("lblFiscal" + that.timeInLong).setText(sap.ui.getCore().getModel("fiscalData").getData().fiscal_title);
            }
        });
    },
    exeParams: function () {
        var url = new URL(window.location.href);
        var cmd = url.searchParams.get("cmd");
        if (Util.nvl(cmd, "") == "")
            return;
        var para = url.searchParams.get("para");
        var pr = (Util.nvl(para, "").length > 0 ? " " : "") + Util.nvl(para, "");
        pr = pr.replaceAll("@@", "=");
        UtilGen.execCmd(cmd + pr, UtilGen.DBView, UtilGen.DBView.txtExeCmd, UtilGen.DBView.newPage);
    }
    ,
    loginPress: function () {
        var that = this;
        var u = this.byId("txtUser");
        var p = this.byId("txtPassword");
        var f = this.byId("txtFile");
        var a = this.byId("chkAuto");
        var l = this.sLangu;

        var pth = "login?user=" + u.getValue() + "&password=" + p.getValue() + "&file=" + f.getSelectedKey() + "&language=" + l;

        var dt = null;
        Util.doAjaxGet(pth, "", false).done(function (data) {
            dt = JSON.parse(data);
            if (Util.nvl(dt["C7_VER_NO"], 7) > 7.5)
                FormView.err("Err ! , version above 7.5 is not compatiable !");
            var oModel = new sap.ui.model.json.JSONModel(dt);
            sap.ui.getCore().setModel(oModel, "settings");
            var tit = (Util.getLangDescrAR("title", "nvl(titlea,title) title"));
            that.current_profile = oModel.getData()["CURRENT_PROFILE_CODE"];
            that.current_profile_name = Util.getSQLValue("select " + tit + " from C6_MAIN_GROUPS where code=" + Util.quoted(this.current_profile));
            this.style_debit_numbers = Util.nvl(oModel.getData()["STYLE_DEBIT_NUMBERS"], "color:green");
            this.style_credit_numbers = Util.nvl(oModel.getData()["STYLE_CREDIT_NUMBERS"], "color:red");



        });
        if (dt.errorMsg != null && dt.errorMsg.length > 0) {
            sap.m.MessageToast.show(dt.errorMsg);
            return;
        }
        pth = "exe?command=get-profile-list";
        Util.doAjaxGet(pth, "", false).done(function (data) {
            if (data != undefined) {
                var dt = JSON.parse(data);
                var oModel = new sap.ui.model.json.JSONModel(dt);
                sap.ui.getCore().setModel(oModel, "profiles");

            }
        });
        that.getFiscalData();
        //jQuery.sap.require("sap.viz.library");

        // this.app = sap.ui.getCore().byId("mainApp");
        // var page = sap.ui.jsview("SplitPage", "chainel1.SplitPage");
        // this.app.addPage(page);
        // this.app.to(page);while

        var s1 = window.location.search.substring(1).split("&");
        var s = "";
        for (var i in s1) {
            var ss = s1[i].split("=");
            if (ss[0] != "file" && ss[0] != "user" && ss[0] != "password" && ss[0] != "clearCookies")
                s = s + (s.length > 0 ? "&" : "") + (s1[i]);
        }
        if (a.getSelected()) {
            Util.cookieSet("user", u.getValue(), 7);
            Util.cookieSet("password", p.getValue(), 7);
            Util.cookieSet("file", f.getSelectedKey(), 7);
            Util.cookieSet("autoLogon", a.getSelected(), 7);
        } else
            Util.cookiesClear();
        var sett = sap.ui.getCore().getModel("settings").getData();
        var tit = (Util.getLangDescrAR("title", "nvl(titlea,title) title"));
        this.current_profile = sett["CURRENT_PROFILE_CODE"];
        this.current_profile_name = Util.getSQLValue("select " + tit + " from C6_MAIN_GROUPS where code=" + Util.quoted(this.current_profile));
        this.style_debit_numbers = Util.nvl(sett["STYLE_DEBIT_NUMBERS"], "color:green");
        this.style_credit_numbers = Util.nvl(sett["STYLE_CREDIT_NUMBERS"], "color:red");
        return true;
        // document.location.href = "/bi.html" + (s.length > 0 ? "?" : "") + s;

    }
    ,
    loadData_main: function () {
        var that = this;
        Util.Notifications.checkNewNotifications();
        var sett = sap.ui.getCore().getModel("settings").getData();
        if (Util.nvl(sett["C7_VER_NO"], 7) > 7.5)
            FormView.err("Err ! , version above 7.5 is not compatiable !");

        var fisc = sap.ui.getCore().getModel("fiscalData").getData();
        that.today_date.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
        that.today_date.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
        var lstVouDate = Util.getSQLValue("select to_char(max(vou_date),'dd/mm/rrrr') from acvoucher1 ");
        this.byId("lblLastDay" + this.timeInLong).setText(Util.getLangText("lastVouEntry") + " :" + lstVouDate);

        if (Util.nvl(that.today_date.getDateValue(), undefined) == undefined) {
            var svdt = Util.getSQLValue("select to_char(sysdate,'mm/dd/rrrr') from dual ");
            var svd = new Date(svdt);
            if (svd > new Date(fisc.fiscal_to))
                svdt = new Date(fisc.fiscal_to);
            that.today_date.setDateValue(new Date(svdt));
            that.today_date.setMaxDate(new Date(fisc.fiscal_to));
            that.today_date.setMinDate(new Date(fisc.fiscal_from));
        }
        var cmp = sett["MASTER_USER"] + " >  " + sett["LOGON_USER"] + "@" + sett["COMPANY_NAME"];
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

        var secs = {};

        UtilGen.clearPage(this.pg);
        this.updateMenus();

        if (that.standAlonMode) return;

        this.app.toDetail(this.pg);


        var sq = "select v_secs.*  from v_secs where menu_group='" + that.current_profile + "' and menu_id=1 order by ms_id,ss_id,tile_id";
        var dt = Util.execSQL(sq);

        if (dt.ret == "SUCCESS" && dt.data.length > 0) {
            var dtxM = JSON.parse("{" + dt.data + "}").data;

            Util.destroyID("ObjectPageLayout");
            var oObjectPage = new sap.uxap.ObjectPageLayout("ObjectPageLayout", {
                subSectionLayout: sap.uxap.ObjectPageSubSectionLayout.TitleOnTop,
                // showHeaderContent: false,
                height: "80%"
            });
            // var sc = new sap.m.ScrollContainer({content: [oObjectPage], height: "100%", vertical: true});
            this.pg.addContent(oObjectPage);

            var oHeaderTitle = new sap.uxap.ObjectPageHeader();
            // oHeaderTitle.setObjectTitle(cmp);
            // oObjectPage.setHeaderTitle(new sap.m.Toolbar());
            oObjectPage.setShowAnchorBar(true);
            // setTimeout(function () {
            //     // $(".sapUxAPObjectPageHeaderTitleText").css("cssText", "color:blue!important;font-size:12px!important;");
            //     $(".sapUxAPObjectPageHeaderTitleText").addClass("redMiniText");
            //     $(".sapUxAPObjectPageHeaderTitleText").addClass("blinking");
            //     // $(".sapUxAPObjectPageHeaderTitleText").css("cssText", "");
            // }, 1200);
            this.txt.setText(cmp);
            that.sp.setTitle(cmp);
            for (var i in dtxM) {
                if (!secs.hasOwnProperty(dtxM[i].MS_ID)) {
                    secs[dtxM[i].MS_ID] = {
                        "title": dtxM[i].MS_TITLE_1, ss: {}, msObj: new sap.uxap.ObjectPageSection({
                            title: dtxM[i].MS_TITLE_1, showTitle: false, titleUppercase: false
                        })
                    };
                    oObjectPage.addSection(secs[dtxM[i].MS_ID].msObj);
                }
                if (!secs[dtxM[i].MS_ID].ss.hasOwnProperty(dtxM[i].SS_ID)) {
                    secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID] = {
                        "title": dtxM[i].SS_TITLE_1,
                        tiles: {},
                        ssObj: new sap.uxap.ObjectPageSubSection({
                            title: (dtxM[i].SS_TITLE_1 == "ALL" ? "" : dtxM[i].SS_TITLE_1),
                            titleUppercase: false,
                            showTitle: true,
                        }),
                        hbox: new sap.m.ScrollContainer().addStyleClass("paddingTinyBot")
                        // hbox: new sap.ui.layout.Grid({
                        //     vSpacing: 1,
                        //     hSpacing: 1,
                        //     width: "100%",
                        //     defaultSpan: "XL2 L3 M3 S12"
                        // })
                    }
                        ;
                    secs[dtxM[i].MS_ID].msObj.addSubSection(secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].ssObj);
                }

                if (!secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].tiles.hasOwnProperty(dtxM[dtxM[i].TILE_ID])) {
                    var fv = "";
                    var tileC = new sap.m.TileContent({});
                    if (Util.nvl(dtxM[i].FOOTER_SQL, "").length > 0)
                        fv = Util.getSQLValue(dtxM[i].FOOTER_SQL);

                    secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].tiles[dtxM[i].TILE_ID] = {
                        "title": dtxM[i].TILE_TITLE_1,
                        "FORM_NAME": dtxM[i].EXEC_LINE,
                        "EXEC_TYPE": dtxM[i].EXEC_TYPE,
                        "tileObj": Util.nvl(dtxM[i].CUSTOM_OBJ, "") != "" ? eval(dtxM[i].CUSTOM_OBJ) :
                            new sap.m.GenericTile({
                                frameType: Util.nvl(dtxM[i].TILE_SIZE, "OneByHalf"),
                                header: dtxM[i].TILE_TITLE_1,
                                tileContent: tileC,
                                press: function (ev) {
                                    that.tileExe(this);
                                }
                            }).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop")
                    };

                    if (Util.nvl(dtxM[i].CONTENT_JS, "").length > 0)
                        try {
                            eval(dtxM[i].CONTENT_JS);
                        } catch (ex) {
                            console.log(ex);
                        }
                    ;

                    secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].tiles[dtxM[i].TILE_ID].tileObj["dtx"] = dtxM[i];
                    secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].tiles[dtxM[i].TILE_ID].tileObj.addStyleClass("mytilex");
                    if (secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].hbox.getContent() == 0)
                        secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].ssObj.addBlock(secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].hbox);

                    secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].hbox.addContent(secs[dtxM[i].MS_ID].ss[dtxM[i].SS_ID].tiles[dtxM[i].TILE_ID].tileObj);
                }

            }
        }

        console.log(secs);
        // loading all c7_commands table data
        this.cmdData = undefined;
        var sq = "select KEYFLD, COMMAND, DESCR, PROFILES, FLAG, EXEC_LINE from c7_commands order by keyfld";
        var dt = Util.execSQL(sq);
        if (dt.ret == "SUCCESS" && dt.data.length > 0) {
            this.cmdData = JSON.parse("{" + dt.data + "}").data;
        }

    }
    ,
    tileExe: function (tile) {
        var that = this;
        UtilGen.execCmd(tile.dtx.EXEC_LINE, this, tile, this.newPage);
    }
    ,
    autoShowHideMenu: function (showHide, parentWnd) {
        var that = this;
        if (!this.autoHideMenus)
            return;
        if (sap.ui.Device.system.phone)
            return;
        // if (parentWnd != undefined && !(parentWnd instanceof sap.m.Page))
        //     return;        
        var pwnd = parentWnd;
        var isdlg = false;
        while (Util.nvl(pwnd, undefined) != undefined && !isdlg) {
            if (pwnd instanceof sap.m.Dialog || pwnd instanceof sap.m.Popover)
                isdlg = true;
            pwnd = pwnd.getParent();
        }
        if (isdlg) return;
        if (showHide)
            that.app.setMode(sap.m.SplitAppMode.StretchCompressMode);
        else
            that.app.setMode(sap.m.SplitAppMode.HideMode);
    },
    show_main_menus: function () {
        var that = this;

        UtilGen.clearPage(this.pgMain);
        if (this.standAlonMode) {
            this.app.setMode(sap.m.SplitAppMode.HideMode);
            return;
        }

        var btnMnu = new sap.m.Button({
            icon: "sap-icon://drop-down-list",
            text: this.current_profile_name,
            width: "100%",
            press: function () {
                if (sap.ui.getCore().getModel("profiles") == undefined) {
                    pth = "exe?command=get-profile-list";
                    Util.doAjaxGet(pth, "", false).done(function (data) {
                        if (data != undefined) {
                            var dt = JSON.parse(data);
                            var oModel = new sap.ui.model.json.JSONModel(dt);
                            sap.ui.getCore().setModel(oModel, "profiles");
                        }
                    });
                }
                var ps = sap.ui.getCore().getModel("profiles").getData();
                var mnus = [];
                var pList = ps.list;
                for (var i in pList) {
                    var mnu = new sap.m.MenuItem({
                        text: pList[i].code + "-" + pList[i].name,
                        customData: { key: pList[i].code + "::=" + pList[i].name },
                        press: function (ev) {
                            var cs = this.getCustomData()[0].getKey();
                            that.current_profile = cs.split("::=")[0];
                            that.current_profile_name = cs.split("::=")[1];
                            this.setText(cs.split("::=")[1]);
                            that.show_main_menus();
                            that.loadData_main();
                        }
                    });
                    mnus.push(mnu);
                }
                var mnu = new sap.m.Menu({
                    title: "",
                    items: mnus
                }).addStyleClass("profileMenus");

                mnu.openBy(this);
            }
        }).addStyleClass("profileMenus");
        var tb = new sap.m.Toolbar({
            content: [
                new sap.m.Button({
                    icon: "sap-icon://action-settings",
                    press: function () {
                        // that.do_log_out();   
                        var mnu = new sap.m.Menu();
                        var m1 = new sap.m.MenuItem({
                            text: Util.getLangText("menuLogOff"),
                            icon: "sap-icon://log",
                            press: function () {
                                that.do_log_out();
                            }
                        });
                        var m11 = new sap.m.MenuItem({
                            text: Util.getLangText("menuChangePassword"),
                            icon: "sap-icon://key",
                            press: function () {
                                that.changeMyPassword();
                            }
                        });
                        var m2 = new sap.m.MenuItem({
                            icon: that.autoHideMenus ? "sap-icon://accept" : "",
                            text: Util.getLangText("menuAutoHide"),
                            press: function () {
                                that.autoHideMenus = !that.autoHideMenus;
                            }
                        })
                        var m3 = new sap.m.MenuItem({
                            icon: "sap-icon://expand",
                            text: Util.getLangText("menuExpandAll"),
                            press: function () {
                                that.mv.getControl().expandToLevel(255);
                            }
                        })
                        var m4 = new sap.m.MenuItem({
                            icon: "sap-icon://collapse",
                            text: Util.getLangText("menuCollapseAll"),
                            press: function () {
                                that.mv.getControl().collapseAll();
                            }
                        });
                        mnu.addItem(m1);
                        mnu.addItem(m11);
                        if (!sap.ui.Device.system.phone)
                            mnu.addItem(m2);
                        mnu.addItem(m3);
                        mnu.addItem(m4);
                        mnu.openBy(this);
                    }
                }),
                btnMnu
            ]
        }).addStyleClass("profileMenus");
        // this.pgMain.removeAllHeaderContent();
        // this.pgMain.addHeaderContent(tb);
        this.pgMain.setSubHeader(tb);
        this.pgMain.setShowSubHeader(true);



        // if (this.mv == undefined)
        this.mv = new QueryView("mainMenus");
        var mnuTit = Util.getLangDescrAR("MENU_TITLE", "NVL(MENU_TITLEA,MENU_TITLE) MENU_TITLE ");
        var dt = Util.execSQL("select menu_code," + mnuTit + ",parent_menucode,childcount,JS_COMMAND,JS_PARAMS,SHORTCUT_ICON,TYPE_OF_EXEC,EXPAND_NODE " +
            " from C7_MENUS where group_code='" + that.current_profile + "' order by menu_path")
        // var dt = Util.execSQL("select accno menu_code,name menu_title, parentacc from acaccount order by path ")


        if (dt.ret != "SUCCESS")
            Util.err(dt.ret);

        var mv = this.mv;

        mv.mColCode = "MENU_CODE";
        mv.mColName = "MENU_TITLE";
        mv.mColParent = "PARENT_MENUCODE";
        mv.switchType("tree");

        mv.setJsonStr("{" + dt.data + "}");

        mv.mLctb.getColByName("MENU_CODE").getMUIHelper().display_width = "100";
        mv.mLctb.getColByName("MENU_TITLE").getMUIHelper().display_width = "250";
        mv.mLctb.getColByName("MENU_TITLE").mTitle = Util.getLangText("mainMenus");
        // mv.mLctb.getColByName("MENU_TITLE").mCfOperator = ":CHILDCOUNT>0";
        // mv.mLctb.getColByName("MENU_TITLE").mCfTrue = "color:blue;font-weight: bold;";

        mv.mLctb.getColByName("MENU_CODE").mHideCol = true;
        mv.mLctb.getColByName("PARENT_MENUCODE").mHideCol = true;
        mv.mLctb.getColByName("CHILDCOUNT").mHideCol = true;
        mv.mLctb.getColByName("JS_COMMAND").mHideCol = true;
        mv.mLctb.getColByName("JS_PARAMS").mHideCol = true;
        mv.mLctb.getColByName("SHORTCUT_ICON").mHideCol = true;
        mv.mLctb.getColByName("TYPE_OF_EXEC").mHideCol = true;
        mv.mLctb.getColByName("EXPAND_NODE").mHideCol = true;

        mv.switchType("tree");
        // var sc = new sap.m.ScrollContainer({ content: [mv.getControl()] });
        // sc.setHeight("100%");
        this.pgMain.addContent(mv.getControl());
        // this.pgMain.addContent(new sap.m.VBox({ height: "200px" }));
        // mv.getControl().expandToLevel(10);
        mv.getControl().collapseAll();
        mv.getControl().setFixedBottomRowCount(0);
        // mv.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        // mv.getControl().setVisibleRowCount(100);
        mv.resizableColumn = false;
        mv.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
        mv.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
        mv.getControl().attachColumnResize(undefined, function (e) { e.preventDefault(); });
        mv.getControl().addStyleClass("sapUiSizeCondensed " + Util.getLangDescrAR("menuTable", "menuTableAR"));
        mv.getControl().attachRowSelectionChange(undefined, function () {

            var sl = mv.getControl().getSelectedIndices();
            if (sl.length > 0) {
                if (mv.getControl().isExpanded(sl[0]))
                    mv.getControl().collapse(sl[0]);
                else mv.getControl().expand(sl[0]);

                var odata = mv.getControl().getContextByIndex(sl[0]);
                var data = (odata.getProperty(odata.getPath()));
                UtilGen.execCmd(data.JS_COMMAND, that, this, that.newPage);
                // mv.getControl().setSelectedIndex(-1);
            }

        });
        mv.loadData();

        //chatgpt helped
        var rowsUpdated = function () {
            setTimeout(() => {
                var aRows = that.mv.getControl().getRows();
                for (var i = aRows.length - 1; i >= 0; i--) {
                    var oRow = aRows[i];
                    var oContext = oRow.getBindingContext();
                    if (Util.nvl(oContext, undefined) != undefined) {
                        var sStatus = oContext.getProperty("EXPAND_NODE");
                        if (sStatus == "Y")
                            oRow.expand();
                    }
                }

                // aRows.forEach(function (oRow) {
                //     var oContext = oRow.getBindingContext();
                //     if (Util.nvl(oContext, undefined) != undefined) {
                //         var sStatus = oContext.getProperty("EXPAND_NODE");
                //         if (sStatus == "Y")
                //             oRow.expand();
                //     }
                // });

                mv.getControl().detachRowsUpdated(rowsUpdated);

                // var wdPg = that.pgMain.$().width();
                // mv.getControl().setWidth(wdPg + "px");
                var wd = mv.getControl().$().width();
                mv.getControl().getColumns()[1].setWidth(wd + "px");

            });
        };
        mv.getControl().collapseAll();
        mv.getControl().attachRowsUpdated(rowsUpdated);

        // mv.getControl().collapseAll();
        mv.getControl().setContextMenu(new sap.m.Menu());
        mv.getControl().attachBeforeOpenContextMenu(function (e) {
            var rn = e.getParameter("rowIndex");
            if (rn <= -1) {
                return false;
            }
            var oData = mv.getControl().getContextByIndex(rn);
            var childs = oData.getProperty(oData.getPath())["CHILDCOUNT"];
            var mc = oData.getProperty(oData.getPath())["MENU_CODE"];
            var toe = oData.getProperty(oData.getPath())["TYPE_OF_EXEC"];
            var mnu = e.getParameter("contextMenu");
            mnu.removeAllItems();
            if (toe == "PARENT") {
                mnu.addItem(new sap.m.MenuItem({
                    text: "New Menu..",
                    press: function () {
                        that.showMenuForm("", mc);
                    }
                }));
                mnu.addItem(new sap.m.MenuItem({
                    text: "Edit..",
                    press: function () {
                        that.showMenuForm(mc);
                    }
                }));
                mnu.addItem(new sap.m.MenuItem({
                    text: "Copy menus..",
                    press: function () {
                        that.copyMenus(mc);
                    }
                }));

            } else {
                mnu.addItem(new sap.m.MenuItem({
                    text: "Copy menu..",
                    press: function () {
                        that.copyMenus2(mc);
                    }
                }));

                mnu.addItem(new sap.m.MenuItem({
                    text: "Edit..",
                    press: function () {
                        that.showMenuForm(mc);
                    }
                }));

            }
            mnu.addItem(new sap.m.MenuItem({
                text: "Delete..",
                press: function () {
                    that.deleteMenu(mc);
                }
            }));

        });

        setTimeout(function () {
            that.showShortcuts();

        });
    },
    copyMenus: function (mc) {
        var that = this;
        var newGroup = function (e) {
            var nwcode = Util.getSQLValue("select nvl(max(to_number(code)),9998)+1 from  c6_main_groups");
            txtToG.setValue(nwcode);
        };

        var newMenuCode = function (e) {
            var grpCode = txtToG.getValue();
            if (grpCode == "") FormView.err("Err! must enter first group !");
            var defMenuCode = grpCode + "001";
            var nwcode = Util.getSQLValue("select nvl(max(to_number(menu_code))," + defMenuCode + " )+1 from  c7_menus where group_code='" + grpCode + "' and type_of_exec='PARENT'");
            txtToC.setValue(nwcode);
        };
        var do_copy = function () {
            // validating first null values
            var tcsGrp = txtToG.getValue();
            var tcsC = txtToC.getValue();
            var fcsC = txtFromC.getValue();
            var fGrp = txtFromG.getValue();
            if (fGrp == "" || tcsGrp == "") FormView.err("From group or To group must have value !");
            if (tcsC == "" || fcsC == "") FormView.err("From Menu Code or To Code menu must have value !");
            var toMenuPath = "";
            var genPath = function (parent, cod) {
                var ret = "XXX\\" + cod + "\\";
                if (parent == "")
                    return ret;

                var pth = Util.getSQLValue("select nvl(max(menu_path),'') from c7_menus where menu_code=" + Util.quoted(parent) + " and group_code=" + Util.quoted(that.current_profile));
                if (pth == "")
                    return "";
                return pth + cod + "\\";

            }
            var addGroup = function () {
                var cntGrp = Util.getSQLValue("select nvl(count(*),0) from c6_main_groups where code=" + Util.quoted(tcsGrp));
                if (cntGrp == 0) {
                    if (Util.nvl(txtFromGName.getValue(), "") == "") FormView.err("Title for new group not specified !!");
                    var sq = "insert into c6_main_groups(CODE, TITLE, PROFILES, PIC_NAME, FLAG, MENU_CLASS, MODULE_NAME) " +
                        " values (:CODE, :TITLE, '\"0\"', '', 1, 'MAIN_MENUS', 'USER'); ";
                    sq = sq.replaceAll(":CODE", Util.quoted(tcsGrp));
                    sq = sq.replaceAll(":TITLE", Util.quoted(txtToGName.getValue()));
                    return sq;
                }
                return "";
            }
            var addParentMenu = function () {
                var cntMenu = Util.getSQLValue("select nvl(count(*),0) from c7_menus where group_code='" + tcsGrp + "' and menu_code=" + Util.quoted(tcsC));
                if (cntMenu == 0) {
                    sq = "insert into c7_menus(GROUP_CODE, MENU_CODE, MENU_TITLE, MENU_TITLEA, PARENT_MENUCODE, MENU_PATH, JS_COMMAND,TYPE_OF_EXEC ) " +
                        " values (':GROUP_CODE', ':MENU_CODE', ':MENU_TITLE', ':MENU_TITLEA', ':PARENT_MENUCODE', ':MENU_PATH', ':JS_COMMAND','PARENT' );";
                    sq = sq.replaceAll(":MENU_CODE", txtToC.getValue());
                    sq = sq.replaceAll(":GROUP_CODE", txtToG.getValue());
                    sq = sq.replaceAll(":MENU_TITLEA", "");
                    sq = sq.replaceAll(":MENU_TITLE", txtToCName.getValue());
                    sq = sq.replaceAll(":PARENT_MENUCODE", "");
                    sq = sq.replaceAll(":MENU_PATH", "XXX\\" + txtToC.getValue() + "\\");
                    sq = sq.replaceAll(":JS_COMMAND", "");
                    toMenuPath = "XXX\\" + txtToC.getValue() + "\\";
                    return sq;
                } else
                    toMenuPath = "";
                return "";
            }
            var sqAdd = addGroup() + addParentMenu();

            var sq = "select *from c7_menus where menu_code!=:menu_code and menu_path like (select max(menu_path||'%') from c7_menus where group_code=:group_code and menu_code=:menu_code) ";
            sq = sq.replaceAll(":group_code", Util.quoted(txtFromG.getValue()));
            sq = sq.replaceAll(":menu_code", Util.quoted(txtFromC.getValue()));

            var getmenupath = "(select menu_path||'\\'||':add_code'||'\\' from c7_menus where menu_code=':menu_code' and group_code=':group_code')"
            var sqIns = "";
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                var dtx = JSON.parse("{" + dt.data + "}").data;
                for (var di in dtx) {
                    var code = txtToC.getValue() + dtx[di].MENU_CODE;
                    var grp_code = txtToG.getValue();
                    var tit = dtx[di].MENU_TITLE;
                    var tit2 = dtx[di].MENU_TITLEA;
                    var menupath = txtFromC.getValue() == dtx[di].PARENT_MENUCODE ? getmenupath.replaceAll(":menu_code", txtToC.getValue())
                        .replaceAll(":add_code", code)
                        .replaceAll(":group_code", txtToG.getValue()) :
                        getmenupath.replaceAll(":menu_code", txtToC.getValue() + dtx[di].PARENT_MENUCODE)
                            .replaceAll(":add_code", code)
                            .replaceAll(":group_code", txtToG.getValue());
                    var js = dtx[di].JS_COMMAND;
                    var parent_menucode = txtFromC.getValue() == dtx[di].PARENT_MENUCODE ? txtToC.getValue() : txtToC.getValue() + dtx[di].PARENT_MENUCODE;
                    var sql = "insert into c7_menus(GROUP_CODE, MENU_CODE, MENU_TITLE, MENU_TITLEA, PARENT_MENUCODE, MENU_PATH, JS_COMMAND,TYPE_OF_EXEC ) " +
                        " values (':GROUP_CODE', ':MENU_CODE', ':MENU_TITLE', ':MENU_TITLEA', ':PARENT_MENUCODE', :MENU_PATH, ':JS_COMMAND',':TYPE_OF_EXEC' );";
                    sql = sql.replaceAll(":MENU_CODE", code);
                    sql = sql.replaceAll(":GROUP_CODE", grp_code);
                    sql = sql.replaceAll(":MENU_TITLEA", tit2);
                    sql = sql.replaceAll(":MENU_TITLE", tit);
                    sql = sql.replaceAll(":PARENT_MENUCODE", parent_menucode);
                    sql = sql.replaceAll(":MENU_PATH", menupath);
                    sql = sql.replaceAll(":JS_COMMAND", js);
                    sql = sql.replaceAll(":TYPE_OF_EXEC", dtx[di].TYPE_OF_EXEC);
                    sqIns += sql;
                }
                var dte = Util.execSQL("begin " + sqAdd + sqIns + " end;");
                if (!dtx.ret == "SUCCESS")
                    FormView.err("Not copied !");
                else
                    sap.m.MessageToast.show("Copied done !");
            }
        }
        var txtFromG = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
        var txtFromGName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "44%", editable: false });
        var txtFromC = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "30%", editable: false });
        var txtFromCName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "44%", editable: false });

        var txtToG = new sap.m.Input({
            textAlign: sap.ui.core.TextAlign.Begin,
            width: "30%", editable: true,
            showValueHelp: true,
            change: function (e) {
                UtilGen.Search.getLOVSearchField("select title from c6_main_groups where code=:CODE ", txtToG, undefined, txtToGName);
            },
            valueHelpRequest: function (e) {
                var sett = sap.ui.getCore().getModel("settings").getData();
                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                UtilGen.Search.do_quick_search(e, this,
                    "select code,title from c6_main_groups order by code ",
                    "select code,title from c6_main_groups where code=:CODE order by code", txtToGName);
            }
        });
        var txtToGName = new sap.m.Input({
            textAlign: sap.ui.core.TextAlign.Begin,
            width: "44%", editable: true,
        });
        var txtToC = new sap.m.Input(
            {
                textAlign: sap.ui.core.TextAlign.Begin,
                width: "30%", editable: true,
                showValueHelp: true,
                change: function (e) {
                    UtilGen.Search.getLOVSearchField("select menu_title from c7_menus where TYPE_OF_EXEC='PARENT' and group_code='" + txtToG.getValue() + "' and menu_code=':CODE' ", txtToC, undefined, txtToCName);
                },
                valueHelpRequest: function (e) {
                    // var sett = sap.ui.getCore().getModel("settings").getData();
                    // var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                    UtilGen.Search.do_quick_search(e, this,
                        "select menu_code code,menu_title title from c7_menus where  TYPE_OF_EXEC='PARENT' and group_code=" + txtToG.getValue() + " order by menu_path ",
                        "select menu_code code ,menu_title title from c7_menus where  TYPE_OF_EXEC='PARENT' and group_code=" + txtToG.getValue() + " and menu_code=':CODE' order by menu_path", txtToCName);
                }
            });
        var txtToCName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "44%", editable: true });

        var fe = [
            Util.getLabelTxt("fromMenuGroup", "25%"), txtFromG,
            Util.getLabelTxt("f", "1%", "@"), txtFromGName,
            Util.getLabelTxt("FromMenuCode", "25%"), txtFromC,
            Util.getLabelTxt("", "1%", "@"), txtFromCName,
            new sap.m.VBox({ height: "50px" }),
            Util.getLabelTxt("toMenuGroup", "25%"), txtToG,
            Util.getLabelTxt("", "1%", "@"), txtToGName,
            Util.getLabelTxt("", "25%", ""), new sap.m.Button({ text: "Pick new Group", press: newGroup }),
            Util.getLabelTxt("toMenuCode", "25%"), txtToC,
            Util.getLabelTxt("", "1%", "@"), txtToCName,
            Util.getLabelTxt("", "25%", ""), new sap.m.Button({ text: "Pick new Code", press: newMenuCode }),
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, { width: "450px" }, "sapUiSizeCompact", "");
        cnt.addContent(new sap.m.VBox({ height: "40px" }));
        var dlg = new sap.m.Dialog({
            title: Util.getLangText("copyMenusTitle"),
            contentWidth: "500px",
            content: cnt,
            buttons: [
                new sap.m.Button({
                    text: Util.getLangText("saveTxt"),
                    press: function () {
                        do_copy();

                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("closeTxt"),
                    press: function () {
                        dlg.close();
                    }
                })

            ]
        });
        txtFromG.setValue(that.current_profile);
        txtFromGName.setValue(Util.getSQLValue("select title from c6_main_groups where code='" + that.current_profile + "'"));
        txtFromC.setValue(mc);
        txtFromCName.setValue(Util.getSQLValue("select menu_title from c7_menus where  group_code='" + that.current_profile + "' and menu_code='" + mc + "'"));

        dlg.open();
    },
    deleteMenu: function (mc) {
        var that = this;
        if (mc == "") return;
        if (sap.m.MessageBox == undefined)
            jQuery.sap.require("sap.m.MessageBox");
        var tit = Util.getSQLValue("select menu_title from c7_menus where group_code='" + that.current_profile + "' and menu_code=" + Util.quoted(mc));
        sap.m.MessageBox.confirm("Are you sure to DELETE ?  #" + tit, {
            title: "Confirm",                                    // default
            onClose: function (oAction) {
                if (oAction == sap.m.MessageBox.Action.OK) {
                    var pth = Util.getSQLValue("select menu_path from c7_menus where group_code='" + that.current_profile + "' and menu_code=" + Util.quoted(mc));
                    var dt = Util.execSQL("delete from c7_menus where group_code='" + that.current_profile + "' and menu_path like '" + pth + "%'");
                    sap.m.MessageToast.show("Deleted... ");
                    that.loadData(false, false);
                }
            },                                       // default
            styleClass: "",                                      // default
            initialFocus: null,                                  // default
            textDirection: sap.ui.core.TextDirection.Inherit     // default
        });

    },
    showMenuForm: function (pmc, prnt) {
        var mc = Util.nvl(pmc, "");
        var that = this;
        // creating form.
        var formCss = {
            width: "450px",
            cssText: [
                "padding-left:2px ;" +
                "padding-right:2px ;" +
                "padding-top:5px;" +
                "border-style: groove;" +
                "margin-left: 1px;" +
                "margin-right: 1px;" +
                "border-radius:20px;" +
                "margin-top: 10px;"
            ]
        };
        var lblWidth = "25%";
        var txtCode = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "20%", editable: false });
        var txtName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "49%", editable: false });
        var txtName2 = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "49%", editable: false });
        var txtParentName = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "49%", editable: false });
        var chkTypeMenu = new sap.m.CheckBox({
            width: "85%", height: "50px", editable: false,
            select: function (e) {
                if (this.getSelected())
                    cnt2.setVisible(false);
                else
                    cnt2.setVisible(true);
                hvShortCut.fireSelect();
            }
        });
        var txtJS = new sap.m.TextArea({ textAlign: sap.ui.core.TextAlign.Begin, width: "85%", height: "50px", editable: false });

        var txtParent = new sap.m.Input({
            showValueHelp: true, textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false, valueHelpRequest: function (e) {
                if (e.getParameters().clearButtonPressed || e.getParameters().refreshButtonPressed) {
                    UtilGen.setControlValue(this, "", "", true);
                    UtilGen.setControlValue(txtParentName, "", "", true);
                    return;
                }
                var control = this;
                var pacnm = txtParentName
                var sq = "select menu_code code,menu_title name from c7_menus where type_of_exec='PARENT' and group_code='" + that.current_profile + "' order by menu_path ";
                Util.showSearchList(sq, "NAME", "CODE", function (valx, val) {
                    UtilGen.setControlValue(control, valx, valx, true);
                    UtilGen.setControlValue(pacnm, val, val, true);
                }, "Select Parent Menus");
            },
            change: function (e) {

                var control = this;
                var vl = control.getValue();
                var pacnm = txtParentName
                UtilGen.setControlValue(pacnm, "", "", true);
                var pnm = Util.getSQLValue("select menu_title from c7_menus where type_of_exec='PARENT' and  menu_code = " + Util.quoted(vl) +
                    " and group_code='" + that.current_profile + "'");
                UtilGen.setControlValue(pacnm, pnm, pnm, true);
                UtilGen.setControlValue(control, vl, vl, false);
            }
        });

        var hvShortCut = new sap.m.CheckBox({
            width: "85%", height: "50px", editable: false,
            select: function (e) {
                if (!this.getSelected())
                    cnt3.setVisible(false);
                else
                    cnt3.setVisible(true);
            }
        });
        var txtShortIcon = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false });
        var txtShortTitle1 = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false });
        var txtShortTitle2 = new sap.m.Input({ textAlign: sap.ui.core.TextAlign.Begin, width: "35%", editable: false });

        var fe = [
            Util.getLabelTxt("codeTxt", "15%"), txtCode,
            Util.getLabelTxt("nameTxt", "15%", "@"), txtName,
            Util.getLabelTxt("nameTxt2", "50%", ""), txtName2,
            Util.getLabelTxt("parentMenu", "15%", ""), txtParent,
            Util.getLabelTxt("", "1%", "@"), txtParentName,
            Util.getLabelTxt("isParent", "15%", ""), chkTypeMenu,
        ];
        var fe2 = [
            Util.getLabelTxt("JS Cmd", "15%", ""), txtJS,
            Util.getLabelTxt("Shortcuts", "15%", "", "qrGroup"),
            Util.getLabelTxt("showTxt", "15%", ""), hvShortCut,

        ];

        var fe3 = [
            Util.getLabelTxt("shortIcon", "15%", ""), txtShortIcon,
            Util.getLabelTxt("shortTit1", "15%", ""), txtShortTitle1,
            Util.getLabelTxt("shortTit2", "15%", ""), txtShortTitle2,
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, formCss, "sapUiSizeCompact", "");
        var cnt2 = UtilGen.formCreate2("", true, fe2, undefined, sap.m.ScrollContainer, { "width": formCss.width }, "sapUiSizeCompact", "");
        var cnt3 = UtilGen.formCreate2("", true, fe3, undefined, sap.m.ScrollContainer, { "width": formCss.width }, "sapUiSizeCompact", "");


        cnt.addContent(cnt2);
        cnt2.addContent(cnt3);
        cnt2.addContent(new sap.m.VBox({ height: "40px" }));
        Util.navEnter([...fe, ...fe2, ...fe3]);
        var dlg = new sap.m.Dialog({
            title: Util.getLangText((mc == "" ? "newMenu" : "editMenu")),
            contentWidth: "550px",
            content: cnt,
            buttons: [
                new sap.m.Button({
                    text: Util.getLangText("saveTxt"),
                    press: function () {
                        ;
                        if (saveData() == "SUCCESS") {
                            dlg.close();
                            that.loadData(false, false);
                            sap.m.MessageToast.show("Saved...");
                        }

                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("closeTxt"),
                    press: function () {
                        dlg.close();
                    }
                })

            ]
        });
        // helper sub funcitons..
        var genPath = function (parent, cod) {
            var ret = "XXX\\" + cod + "\\";
            if (parent == "")
                return ret;

            var pth = Util.getSQLValue("select nvl(max(menu_path),'') from c7_menus where menu_code=" + Util.quoted(parent) + " and group_code=" + Util.quoted(that.current_profile));
            if (pth == "")
                return "";
            return pth + cod + "\\";

        }
        var saveData = function () {
            var sq = "UPDATE C7_MENUS " +
                " SET  MENU_TITLE=':MENU_TITLE', MENU_TITLEA=':MENU_TITLEA', " +
                " PARENT_MENUCODE=':PARENT_MENUCODE', MENU_PATH=':MENU_PATH', JS_COMMAND=':JS_COMMAND', " +
                " SHORTCUT=':SHORTCUT' ,SHORTCUT_ICON=':SHORTCUT_ICON',SHORT_TITLE=':SHORT_TITLE',SHORT_TITLEA=':SHORT_TITLEA' " +
                " WHERE MENU_CODE=':MENU_CODE' AND GROUP_CODE=':GROUP_CODE'";
            if (mc == "") {
                sq = "insert into c7_menus(GROUP_CODE, MENU_CODE, MENU_TITLE, MENU_TITLEA, PARENT_MENUCODE, MENU_PATH, JS_COMMAND, TYPE_OF_EXEC,SHORTCUT,SHORTCUT_ICON,SHORT_TITLE,SHORT_TITLEA ) " +
                    " values (':GROUP_CODE', ':MENU_CODE', ':MENU_TITLE', ':MENU_TITLEA', ':PARENT_MENUCODE', ':MENU_PATH', ':JS_COMMAND', ':TYPE_OF_EXEC',':SHORTCUT',':SHORTCUT_ICON',':SHORT_TITLE',':SHORT_TITLEA' )";
            }
            sq = sq.replaceAll(":MENU_CODE", txtCode.getValue());
            sq = sq.replaceAll(":GROUP_CODE", that.current_profile);
            sq = sq.replaceAll(":MENU_TITLEA", txtName2.getValue());
            sq = sq.replaceAll(":MENU_TITLE", txtName.getValue());
            sq = sq.replaceAll(":PARENT_MENUCODE", txtParent.getValue());
            sq = sq.replaceAll(":MENU_PATH", genPath(txtParent.getValue(), txtCode.getValue()));
            sq = sq.replaceAll(":JS_COMMAND", txtJS.getValue());
            sq = sq.replaceAll(":TYPE_OF_EXEC", chkTypeMenu.getSelected() ? "PARENT" : "QUERY");
            sq = sq.replaceAll(":SHORTCUT_ICON", txtShortIcon.getValue());
            sq = sq.replaceAll(":SHORTCUT", hvShortCut.getSelected() ? "Y" : "N");
            sq = sq.replaceAll(":SHORT_TITLEA", txtShortTitle2.getValue());
            sq = sq.replaceAll(":SHORT_TITLE", txtShortTitle1.getValue());
            // sq=sq.replaceAll(":",);
            var dt = Util.execSQL(sq);
            return dt.ret;
        }
        var setEditable = function (tf) {
            var fex = [...fe, ...fe2, ...fe3];
            for (ky in fex) {
                if (fex[ky] instanceof sap.m.InputBase)
                    fex[ky].setEditable(tf);
                if (fex[ky] instanceof sap.m.CheckBox)
                    fex[ky].setEditable(tf);
            }
        }
        var getData = function () {
            var dt = Util.execSQL("select *from c7_menus where menu_code=" + Util.quoted(mc) + " and group_code=" + Util.quoted(that.current_profile));
            if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                var dtx = JSON.parse("{" + dt.data + "}").data;
                txtCode.setValue(dtx[0].MENU_CODE);
                txtName.setValue(dtx[0].MENU_TITLE);
                txtName2.setValue(dtx[0].MENU_TITLEA);
                txtParent.setValue(dtx[0].PARENT_MENUCODE);
                txtParentName.setValue(Util.getSQLValue("select menu_title from c7_menus where menu_code=" + Util.quoted(dtx[0].PARENT_MENUCODE) + " and group_code=" + Util.quoted(that.current_profile)));
                txtJS.setValue(dtx[0].JS_COMMAND);
                chkTypeMenu.setSelected(dtx[0].TYPE_OF_EXEC == "PARENT");
                hvShortCut.setSelected(dtx[0].SHORTCUT == "Y");
                txtShortIcon.setValue(dtx[0].SHORTCUT_ICON);
                txtShortTitle1.setValue(dtx[0].SHORT_TITLE);
                txtShortTitle2.setValue(dtx[0].SHORT_TITLEA);
                hvShortCut.fireSelect();
                chkTypeMenu.fireSelect();
            }
        };
        //---------

        if (mc != "") {
            setEditable(true);
            txtCode.setEditable(false);
            chkTypeMenu.setEditable(false);
            getData();
        } else {
            setEditable(true);
            txtParent.setValue(prnt);
            txtParentName.setValue(Util.getSQLValue("select menu_title from c7_menus where menu_code=" + Util.quoted(prnt) + " and group_code=" + Util.quoted(that.current_profile)));
            var newcode = Util.getSQLValue("select nvl(max(menu_code),0)+1 from c7_menus where group_code=" + Util.quoted(that.current_profile));
            if (newcode == "1" || newcode == 1)
                txtCode.setValue(prnt + "000" + newCode);
            else
                txtCode.setValue(newcode);
        }
        dlg.open();
    }

    ,
    new_tile: function () {
        var that = this;

    }
    ,
    changeMyPassword: function () {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var op = new sap.m.Input({ type: sap.m.InputType.Password }); // Old Password
        var np = new sap.m.Input({ type: sap.m.InputType.Password }); // New Password
        var cp = new sap.m.Input({ type: sap.m.InputType.Password });// Confirm password..
        var vb = new sap.m.VBox({
            items: [
                new sap.m.Text({ text: "Old Password " }),
                op,
                new sap.m.Text({ text: "New Password " }),
                np,
                new sap.m.Text({ text: "Confirm Password " }),
                cp,
            ]
        }).addStyleClass("sapUiMediumMargin");
        var dlg = new sap.m.Dialog({
            title: Util.getLangText("menuChangePassword") + " : " + sett["LOGON_USER"],
            buttons: [
                new sap.m.Button({
                    text: Util.getLangText("cmdClose"),
                    icon: "sap-icon://decline",
                    press: function () {
                        dlg.close();
                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("cmdDone"),
                    icon: "sap-icon://accept",
                    press: function () {
                        var usr = sett["LOGON_USER"];
                        var sop = UtilGen.getControlValue(op);
                        var snp = UtilGen.getControlValue(np);
                        var scp = UtilGen.getControlValue(cp);
                        if (snp != scp) {
                            sap.m.MessageToast.show("new password not matched with confirm password !");
                            return;
                        }
                        var dop = Util.getSQLValue("select password from cp_users where username=" + Util.quoted(usr));
                        if (dop != sop) {
                            sap.m.MessageToast.show("Invalid Password !");
                            return;
                        }

                        var dt = Util.execSQL("update cp_users set password=" + Util.quoted(snp) + " where username=" + Util.quoted(usr));
                        if (dt.ret == "SUCCESS") {
                            sap.m.MessageToast.show("Password changed successfully !");
                            dlg.close();
                        }
                    }
                })
            ],
            content: [vb]
        });
        dlg.open();
    },
    do_log_out: function () {
        var that = this;
        if (sap.m.MessageBox == undefined)
            jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.confirm("Are you sure to LOG OFF ?  ", {
            title: "Confirm",                                    // default
            onClose: function (oAction) {
                var ln = sap.ui.getCore().getConfiguration().getLanguage();
                if (oAction == sap.m.MessageBox.Action.OK) {
                    var locUrl = location.href;
                    var newURL = locUrl.split("?")[0] + "?" + "user=&sap-language=" + ln;
                    window.history.pushState({}, document.title, newURL);
                    window.onbeforeunload = undefined;
                    location.reload();
                    window.onbeforeunload = function () { return " " }
                }
            },                                       // default
            styleClass: "",                                      // default
            initialFocus: null,                                  // default
            textDirection: sap.ui.core.TextDirection.Inherit     // default
        });
    },
    updateMenus: function () {
        var that = this;
        this.sp.getMenu().removeAllItems();
        this.sp.getMenu().addItem(new sap.m.MenuItem({
            text: "Show/Hide Menus..", icon: "sap-icon://menu2", press: function () {
                var md = (that.app.getMode() == sap.m.SplitAppMode.HideMode ? sap.m.SplitAppMode.StretchCompressMode : sap.m.SplitAppMode.HideMode)
                that.app.setMode(md);
                if (that.app.getMode() == sap.m.SplitAppMode.HideMode)
                    that.app.toMaster(that.pgMain);
                else {
                    that.app.toDetail(that.pg);
                    that.show_main_menus();
                }
            }
        }));
        this.sp.getMenu().addItem(
            new sap.m.MenuItem({
                text: "Log out..", icon: "sap-icon://log", press: function () {
                    that.do_logon(true);
                }
            }));
        // add all groups first
        var dt = Util.execSQL("select  *from c7_actions order by action_id");
        if (dt.ret == "SUCCESS" && dt.data.length > 0) {
            var dtx = JSON.parse("{" + dt.data + "}").data;
            var lg = -1;
            var mnu = {};
            for (var i in dtx) {
                var mi = new sap.m.MenuItem({
                    text: dtx[i].MENU_TITLE_1,
                    icon: dtx[i].ICON_NAME,
                    press: function (ev) {
                        that.openAction(this);
                    }
                });
                mi["dtx"] = dtx[i];
                if (Util.nvl(dtx[i].PARENT_MENU, 0) == 0)
                    this.sp.getMenu().addItem(mi);
                else {
                    mnu[dtx[i].PARENT_MENU].addItem(mi);
                }
                mnu[dtx[i].ACTION_ID] = mi;

            }

        }

    }
    ,
    openAction: function (mi) {
        var dtx = mi.dtx;
        UtilGen.execCmd(mi.dtx.FORM_NAME, this, this.sp, this.newPage);
    }
    ,
    lstPageChange: function () {
        var that = this;
        var itm = this.lstPgs.getSelectedItem();
        var ix = -1;
        for (var i in this.lstPgs.getItems()) {
            if (itm == this.lstPgs.getItems()[i]) {
                ix = i;
                break;
            }
        }

        var pg1 = this.pg1[ix];
        if (pg1 != undefined) {
            this.app.toDetail(pg1, "baseSlide");
            if (pg1.getContent().length > 0 && pg1.getContent()[0].displayBack != undefined)
                pg1.getContent()[0].displayBack();
        }
        if (this.lstPgs.getValue() == "Main")
            this.loadData_main();

    },
    destroyPage: function (pg) {
        var that = this;
        var itm = pg.item;
        var ix = -1;
        for (var i in this.lstPgs.getItems()) {
            if (itm == this.lstPgs.getItems()[i]) {
                ix = i;
                break;
            }
        }
        this.pg1.splice(ix, 1);
        this.lstPgs.removeItem(itm);
        this.lstPgs.setSelectedItem(this.lstPgs.getItems()[this.lstPgs.getItems().length - 1]);
        this.pg.destroyContent();
        this.pg.destroyHeaderContent();
        this.pg.destroyCustomHeader();
        setTimeout(function () {
            that.lstPgs.fireSelectionChange();
        });
    },
    execBatch: function (txt2) {
        this.showBatchPara(txt2, function (sq) {
            var dt;
            Util.doAjaxGet("exebatch?" + sq, "", false).done(function (data) {
                dt = JSON.parse(data);
                if (dt.ret != "SUCCESS")
                    FormView.err(dt.message);
                else
                    sap.m.MessageToast.show(dt.message);
            });

            return dt;
        });
    },
    showBatchPara: function (txt2, fnExeBatch) {
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var sq = Util.getFromWord(txt2, 2);
        var params = {};
        var prs = sq.split(" ");
        var vb = new sap.m.VBox({});
        for (p in prs)
            params[prs[p].split("=")[0]] = prs[p].split("=")[1];
        if (params["keyfld"] == undefined)
            FormView.err("keyfld not defined !");
        var titBatch = Util.getSQLValue("select descr from c7_batches where keyfld=" + params["keyfld"]);
        vb.addItem(new sap.m.Text({ text: titBatch })).addStyleClass("sapUiSmallMargin");
        var formWidth = Util.nvl(params["formWidth"], "600px");
        var dialogWidth = Util.nvl(params["dialogSize"], "90%,90%").split(",")[0];
        var dialogHeight = Util.nvl(params["dialogSize"], "90%,90%").split(",")[1];
        var dt = Util.execSQL("select *from C7_BATCHES_PARA where keyfld=" + params["keyfld"] + " order by pos");
        if (dt.ret == "SUCCESS") {
            var dtx = JSON.parse("{" + dt.data + "}").data;
            var fe = [];
            var parAr = []; // to get all parameter name in array
            for (di in dtx)
                parAr.push(dtx[di].PARA_NAME);
            var titleTxt = "";
            for (d in dtx) {
                if (Util.nvl(dtx[d].TITLE_TXT1, "") != titleTxt) {
                    titleTxt = Util.nvl(dtx[d].TITLE_TXT1, "");
                    fe.push(Util.getLabelTxt(titleTxt, Util.nvl(dtx[d].LBL_WIDTH, "25%"), "", "qrGroup"));
                }
                fe.push(Util.getLabelTxt(dtx[d].TITLE, Util.nvl(dtx[d].LBL_WIDTH, "25%"), Util.nvl(dtx[d].LINE_DLM, "")));
                var obj = UtilGen.addControl(fe, "@", (dtx[d].DATA_TYPE == "date" ? sap.m.DatePicker : sap.m.Input), "para_" + dtx[d].PARA_NAME + "__" + that.timeInLong + "",
                    {
                        customData: [/*0*/{ key: "" }, /*1*/{ key: dtx[d].PARA_NAME },/*2*/ { key: dtx[d].VALIDATION }, /*3*/{ key: dtx[d].LIST_SQL },/*4*/{ key: dtx[d].LIST_RET_FIELD },/*5*/{ key: dtx[d].ONCALC }],
                        width: Util.nvl(dtx[d].OBJ_WIDTH, "75%"),
                        showValueHelp: (Util.nvl(dtx[d].LIST_SQL, "") != "") ? true : false,
                        editable: (Util.nvl(dtx[d].EDITABLE, "Y") == "Y") ? true : false,
                        valueHelpRequest: function (e) {
                            var sq = Util.nvl(this.getCustomData()[3].getKey(), "");
                            var rf = Util.nvl(this.getCustomData()[4].getKey(), "");
                            var fldCode = that.byId("para_" + this.getCustomData()[1].getKey() + "__" + that.timeInLong);
                            var fldTit = that.byId("para_TITLE" + this.getCustomData()[1].getKey() + "TITLE__" + that.timeInLong);
                            if (sq != "")
                                for (var pi in parAr)
                                    if (that.byId("para_" + parAr[pi] + "__" + that.timeInLong) != undefined) {
                                        var vl = that.byId("para_" + parAr[pi] + "__" + that.timeInLong).getValue();
                                        if (vl != null && vl instanceof Date)
                                            vl = Util.toOraDateString(vl);
                                        sq = sq.replaceAll(":" + parAr[pi], Util.nvl(vl, ""));
                                    }
                            Util.show_list(sq, ["CODE", "TITLE"], "", function (data) {
                                UtilGen.setControlValue(fldCode, data.CODE, data.CODE, true);
                                if (fldTit != undefined)
                                    UtilGen.setControlValue(fldTit, data.TITLE, data.TITLE, true);
                                return true;
                            }, "100%", "100%", undefined, false);

                        },
                        change: function (e) {
                            var sq = Util.nvl(this.getCustomData()[2].getKey(), "");
                            sq = sq.replaceAll(":CODE", this.getValue());
                            var onCalc = this.getCustomData()[5].getKey();
                            for (var pi in parAr)
                                if (that.byId("para_" + parAr[pi] + "__" + that.timeInLong) != undefined) {
                                    var vl = that.byId("para_" + parAr[pi] + "__" + that.timeInLong).getValue();
                                    if (vl != null && vl instanceof Date)
                                        vl = Util.toOraDateString(vl);
                                    sq = sq.replaceAll(":" + parAr[pi], Util.nvl(vl, ""));
                                    if (onCalc != "")
                                        onCalc = onCalc.replaceAll(":" + parAr[pi], Util.nvl(vl, "null"));
                                }
                            try {
                                if (onCalc != "")
                                    eval(onCalc);
                            }
                            catch (err) { sap.m.MessageToast.show(err); console.log(err); }

                            if (Util.nvl(sq, "") == "") return;
                            var vl = Util.getSQLValue(sq);
                            var fldTit = that.byId("para_TITLE" + this.getCustomData()[1].getKey() + "TITLE__" + that.timeInLong);
                            if (vl != undefined && fldTit != undefined)
                                UtilGen.setControlValue(fldTit, vl, vl, true);
                        }
                    }, dtx[d].DATA_TYPE, Util.nvl(sett[dtx[d].FORMAT_FLD], dtx[d].FORMAT_FLD), that);

                if (dtx[d].PARA_VALUE != undefined) {
                    var value = dtx[d].PARA_VALUE;
                    if (obj instanceof sap.m.DatePicker && dtx[d].PARA_VALUE.startsWith("@"))
                        if (params[dtx[d].PARA_NAME] != undefined)
                            value = UtilGen.parseDefaultValue(params[dtx[d].PARA_NAME].substring(1));//new Date(params[dtx[d].PARA_NAME].substring(1));
                        else {
                            value = UtilGen.parseDefaultValue(dtx[d].PARA_VALUE.substring(1));//new Date(dtx[d].PARA_VALUE.substring(1));

                        }
                    else
                        if (params[dtx[d].PARA_NAME] != undefined)
                            value = params[dtx[d].PARA_NAME];
                        else
                            value = dtx[d].PARA_VALUE;


                    UtilGen.setControlValue(obj, value, value, true);


                }
            }
            Util.navEnter(fe);
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                width: formWidth,
                cssText: [
                    "padding-left:0px ;" +
                    "padding-top:5px;" +
                    "border-style: groove;" +
                    "margin-left: 0;" +
                    "margin-right: 0;" +
                    "border-radius:20px;" +
                    "margin-top: 10px;"
                ]
            }, "sapUiSizeCompact", "");
            cnt.addContent(new sap.m.VBox({ height: "40px" }));
            vb.addItem(cnt);
        }
        var dlg = new sap.m.Dialog({
            title: Util.getLangText("parameters"),
            contentWidth: dialogWidth,
            contentHeight: dialogHeight,
            content: [vb],
            buttons: [
                new sap.m.Button({
                    text: Util.getLangText("executeTxt"),
                    press: function () {
                        var str = "";
                        for (var f in fe) {
                            var val;
                            if (typeof fe[f] == "string")
                                continue;
                            if (fe[f] instanceof sap.m.InputBase)
                                val = UtilGen.getControlValue(fe[f]);
                            if (val instanceof Date)
                                val = "@" + val.getDate() + "\/" + (val.getMonth() + 1) + "\/" + val.getFullYear();
                            val = val.startsWith("@") ? val : encodeURIComponent(val);
                            str += (str.length > 0 ? " " : "") + fe[f].getCustomData()[1].getKey() + "=" + val;
                        }
                        str = ("keyfld=" + params["keyfld"] + " " + str).replaceAll(" ", "&");
                        var dt = fnExeBatch(str);
                        if (dt.ret == "SUCCESS")
                            dlg.close();

                    }
                }),
                new sap.m.Button({
                    text: Util.getLangText("closeTxt"),
                    press: function () {
                        dlg.close();
                    }
                })

            ]
        });
        dlg.open();
    },
    show_list_cmd: function (txt2) {
        var sq = Util.getFromWord(txt2, 2);
        var prnt = "";
        var cols = [];
        var js = undefined;
        if (sq.indexOf(";") > -1) {
            var sqq = sq.split(";")[0];
            js = sq.split(";")[1];
            sq = sqq;
            js = JSON.parse("[" + js + "]");
        }

        if (sq.toLowerCase().startsWith("select")) {
            Util.show_list(sq, undefined, "", function (data) {
                return true;
            }, "100%", "100%", undefined, false, undefined, undefined, undefined, js);
        }
    },
});
