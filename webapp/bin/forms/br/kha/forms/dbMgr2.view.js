sap.ui.jsview("bin.forms.br.kha.forms.dbMgr2", {

    /** Specifies the Controller belonging to this View. 
    * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
    * @memberOf view.View1
    */
    getControllerName: function () {
        return "bin.forms.yd.cu";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
    * Since the Controller is given to this method, its event handlers can be attached right away. 
    * @memberOf view.View1
    */
    createContent: function (oController) {
        var frag = this;
        jQuery.sap.require("sap.viz.library");
        jQuery.sap.require("sap.ui.table.library");
        jQuery.sap.require("sap.ui.layout.library");
        jQuery.sap.require("sap.ui.commons.library");
        jQuery.sap.require("sap.f.ShellBar");
        this.pgDir = "/";
        Util.setLanguageModel(this);
        this.helperFunctions.init(this);
        this.timeInLong = (new Date()).getTime();
        this.addStyleClass("sapUiSizeCompact");
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        UtilGen.DBView = this;
        this.assignLang();

        this.sp = new sap.f.ShellBar({
            title: "Dashboard",
            homeIcon: "./css/chn.png",
            showCopilot: true,
            showSearch: false,
            showNotifications: true,
            showProductSwitcher: false,
            showMenuButton: true,
            notificationsNumber: "0",
            homeIconPressed: function () {

            },
            copilotPressed: function () {
                frag.toMainMenu();
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
            },
        }).addStyleClass("sapFShellBar");
        this.mainPage = new sap.m.Page({
            showHeader: true,
            showFooter: false,
            enableScrolling: false,
            content: [this.joApp],
            customHeader: [this.sp],
        });
        frag.pgMaster = new sap.m.Page(this.createId("pgMaster"), {
            showHeader: false,
            showFooter: false,
            showNavButton: false,
            enableScroll: true,
            height: "100%",
            content: [new sap.m.Title({ text: "Menus" })]
        });
        frag.pgMainMenu = new sap.m.Page(this.createId("pgMainMenu"), {
            showHeader: false,
            showFooter: false,
            showNavButton: false,
            enableScroll: true,
            height: "100%",
            content: [new sap.m.Title({ text: "Menus" })]
        });

        frag.pgBasicData = new sap.m.Page(this.createId("pgBasic"), {
            showHeader: false,
            showSubHeader: true,
            showNavButton: false,
            enableScroll: true,
            height: "100%",
            content: []
        });

        frag.today_date = new sap.m.DatePicker({
            width: "150px",
            change: function (e) {
                var fisc = sap.ui.getCore().getModel("fiscalData").getData();
                if (!frag.isValidValue())
                    frag.setDateValue(new Date(fisc.fiscal_from));
                frag.loadData(false, false);
            }

        });

        frag.joApp.addDetailPage(frag.pgMainMenu);
        frag.joApp.addDetailPage(frag.pgBasicData);
        frag.joApp.addMasterPage(frag.pgMaster);
        frag.joApp.toMaster(frag.pgMaster);
        frag.joApp.toDetail(frag.pgMainMenu);

        // setTimeout(function () {
        //     frag.joApp.showMaster();
        // }, 100);
        this.loginDB = false;
        this.loginCust = false;
        this.loginToDB();
        if (this.loginDB) {
            setTimeout(() => {
                var sett = sap.ui.getCore().getModel("settings").getData();
                frag.loginToCust();
                frag.today_date.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
                frag.today_date.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);

            }, 500);

        }

        this.app2 = new sap.m.App({ pages: [this.mainPage], height: "99%", width: "100%" });
        return this.app2;

    },
    loginToDB: function () {
        var that = this;
        var url = new URL(window.location.href);
        var fn = Util.nvl(url.searchParams.get("filename"), "KH7.ini");
        var pth = "login?user=B&password=B1&file=" + fn + "&language=EN";
        var dt = null;
        this.oController.doAjaxGet(pth, "", false).done(function (data) {
            dt = JSON.parse(data);
            var oModel = new sap.ui.model.json.JSONModel(dt);
            sap.ui.getCore().setModel(oModel, "settings");

            that.current_profile = oModel.getData()["CURRENT_PROFILE_CODE"];

            that.loginDB = true;
            setTimeout(function () {
                sap.m.MessageToast.show("DB server connected...");
            }, 500);
        });
        if (dt.errorMsg != null && dt.errorMsg.length > 0) {
            setTimeout(function () {
                sap.m.MessageToast.show(dt.errorMsg);
            }, 500);
            return;
        }
        pth = "exe?command=get-profile-list";
        this.oController.doAjaxGet(pth, "", false).done(function (data) {
            if (data != undefined) {
                var dt = JSON.parse(data);
                var oModel = new sap.ui.model.json.JSONModel(dt);
                sap.ui.getCore().setModel(oModel, "profiles");
            }
        });

    },
    loginToCust: function () {
        var that = this;
        var view = this;
        that.login = false;
        var url = new URL(window.location.href);
        this.mngId = Util.nvl(url.searchParams.get("managerId"), "ADMIN").toUpperCase();
        this.pwd = url.searchParams.get("password");

        if (Util.nvl(this.mngId, "") == "") {
            setTimeout(function () {
                sap.m.MessageToast.show("No managerId specfied !");
            }, 500);
            return;
        }
        var doCancel = function () {
            that.login = false;
            FormView.err("Access is denied ,  cancelled login or password is invalid !");
        }
        var doOk = function () {
            that.login = false;
            var dt = Util.execSQL("select password from cp_users where is_admin='Y' and upper(username)='" + that.mngId + "'");
            var dtx = JSON.parse("{" + dt.data + "}").data;
            if (dtx.length == 0)
                FormView.err(that.mngId + " not existed !");
            if (Util.nvl(dtx[0].PASSWORD, "") != that.pwd)
                doCancel();
            that.login = true;
            Util.doAjaxGet("exe?command=get-fiscal-data", false).done(function (data) {
                if (data != undefined) {
                    var dt = JSON.parse(data);
                    var oModel = new sap.ui.model.json.JSONModel(dt);
                    sap.ui.getCore().setModel(oModel, "fiscalData");
                };
            });

            FormView.msgSuccess(that.mngId + " , login Successfully...");
            that.createView();
        };

        if (Util.nvl(url.searchParams.get("password"), "") == "") {
            UtilGen.inputDialog("Login..", "Enter Password for : " + that.mngId, "", function (str) {
                if (Util.nvl(str, "") == "")
                    doCancel();
                that.pwd = str;
                doOk();
                return true;
            }, function () {
                doCancel();
                return true;
            }, undefined, undefined, { type: sap.m.InputType.Password });
        } else doOk();


    },
    createView: function () {
        var that = this;
        UtilGen.clearPage(that.pgMainMenu);
        that.qr = new sap.ui.core.HTML({
            preferDOM: true,
            // content: "<iframe src='/dbMainPage.html' style='width:100%;height:'100%'></iframe>"
        }).addStyleClass("sapUiSmallMargin");
        // var tb = new sap.m.Toolbar({
        //     content: [new sap.m.Button({
        //         text: "Monthly",
        //         press: function () {
        //         }
        //     }
        //     ),
        //     new sap.m.Button({
        //         text: "Yearly",
        //         press: function () {
        //         }
        //     }
        //     )]
        // });
        // that.mainPage.setSubHeader(tb);

        $.ajax({
            url: that.pgDir + "dbMainPage.html",
            dataType: "text",
            async: false,
            success: function (cssText) {
                hd = cssText;
                hd = that.translateHtml(hd, "dbMainPage");
                that.qr.setContent(hd);
            }
        });
        var vb = new sap.m.VBox({ width: "-1px", height: "-1px", items: [that.qr] });
        that.pgMainMenu.addContent(vb);
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            // $('#db_cmd_1').html('<strong>Copung </strong>');
        }, 100);

    },
    loadPage: function (pgname) {
        var that = this;
        UtilGen.clearPage(that.pgBasicData);
        that.joApp.toDetail(that.pgBasicData, "slide");
        that.qr2 = new sap.ui.core.HTML({
            preferDOM: true,
            // content: "<iframe src='/dbMainPage.html' style='width:100%;height:'100%'></iframe>"
        }).addStyleClass("sapUiSmallMargin");
        $.ajax({
            url: that.pgDir + pgname,
            dataType: "text",
            async: false,
            success: function (cssText) {
                hd = cssText;
                hd = that.translateHtml(hd, pgname);
                that.qr2.setContent(hd);
            }
        });
        var vb = new sap.m.VBox({ width: "-1px", height: "-1px", items: [that.qr2] });
        that.pgBasicData.addContent(vb);
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            // $('#db_cmd_1').html('<strong>Copung </strong>');            
        }, 100);
    },
    toMainMenu: function () {
        this.joApp.toDetail(this.pgMainMenu, "flip");
    },
    showShipData: function (selShip) {
        var that = this;
        UtilGen.showWorking(that.pgBasicData, Util.getLangText("msgFetching"));
        that.selShip = Util.nvl(selShip, 1);
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            $('#vrShipNo').html('&nbsp;No&nbsp;' + that.selShip);
            $('.tile_disp_sel').each(function () {
                $(this).removeClass("tile_disp_sel");
            });
            if (that.selShip == 1)
                $('#vrShipIt3').addClass("tile_disp_sel");
            if (that.selShip == 2)
                $('#vrShipIt1').addClass("tile_disp_sel");
            if (that.selShip == 3)
                $('#vrShipIt2').addClass("tile_disp_sel");
            if (that.selShip == 4)
                $('#vrShipIt2').addClass("tile_disp_sel");
            setTimeout(() => {
                UtilGen.closeWorking(that.pgBasicData);
            }, 1000);
        }, 100);
    },
    dispDbSalesTb: function (cmdNo) {
        var that = this;
        var cmds = ["dbSalesCmdCredit1", "dbSalesCmdCash1", "dbSalesCmdCredit2", "dbSalesCmdCash2"];
        UtilGen.showWorking(that.pgBasicData, Util.getLangText("msgFetching"));
        $("#tbDbSales1").html("");
        setTimeout(() => {
            cmds.forEach((key, idx) => {
                $("#" + cmds[idx]).removeClass("tile_disp_sel");
            })
            var ld = new LocalTableData();
            try {
                var sq = "SELECT   c_cus_no C_CUS_NO,cus_name NAME,1 LEVELNO,0 CHILDCOUNT, NVL (SUM( ( ( (PRICE + ADD_AMT_GROSS) - (DISC_AMT + DISC_AMT_GROSS))/ PACK)* ( ( (QTYOUT - free_allqty) - QTYIN))),0) NETAMT from joined where invoice_code=21 group by c_cus_no,cus_name,1,0";
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                    ld.parse("{" + dt.data + "}", false);
                    var paras = {
                        mColParent: "PARENTACC",
                        mColCode: "C_CUS_NO",
                        mColName: "NAME",
                        mColLevel: "LEVELNO",
                        mColChild: "CHILDCOUNT"
                    };
                    ld.getColByName("LEVELNO").mHideCol = true;
                    ld.getColByName("CHILDCOUNT").mHideCol = true;


                    ld.getColByName("NETAMT").mUIHelper.display_width = "120";
                    ld.getColByName("NETAMT").mUIHelper.display_format = "QTY_FORMAT";

                    ld.getColByName("NAME").mTitle = Util.getLangText("titleTxt");
                    ld.getColByName("NAME").mUIHelper.display_width = "350";

                    ld.getColByName("C_CUS_NO").mUIHelper.display_width = "100";
                    ld.getColByName("C_CUS_NO").mTitle = Util.getLangText("txtCode");

                    ld.getColByName("NETAMT").mSummary = "SUM";

                    var fntsize = Util.getLangDescrAR("12px", "16px");
                    paras["tableClass"] = "class=\"tbl1 table-responsive\"";
                    paras["styleTableDetails"] = "style='width:100%; font-size: " + fntsize + ";font-family: \'Roboto\', sans-serif;'";
                    paras["styleTableHeader"] = "style='color:#fff; background-color:#8b0000;font-family: \'Roboto\', sans-serif;'";

                    paras["fnOnCellAddClass"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "C_CUS_NO" || col == "NAME") && oData[rowno]["C_CUS_NO"] != null)
                            st = "linkLabel";
                        return st;
                    }

                    paras["fnOnCellClick"] = function (oData, rowno, col) {
                        var st = "";
                        if ((col == "C_CUS_NO" || col == "NAME") && oData[rowno]["C_CUS_NO"] != null)
                            st = "UtilGen.execCmd('testRep5 formType=dialog formSize=100%,100% repno=0 para_PARAFORM=false para_EXEC_REP=true pref=" + oData[rowno]["C_CUS_NO"] + "', UtilGen.DBView, this, UtilGen.DBView.newPage)";
                        return st;
                    }

                    paras["fnOnCellAddStyle"] = function (oData, rowno, col) {
                        if (rowno == -1)
                            return "border:groove;";
                        var st = "padding-left:5px;padding-right:5px;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && oData[rowno]["PARENTACC"] != "")
                            st += "font-weight:bold;height:30px;vertical-align:bottom;";
                        if (oData[rowno]["CHILDCOUNT"] > 0 && col == "NAME")
                            st += "font-weight:bold;";
                        if (oData[rowno]["PARENTACC"] == "")
                            st += "font-weight:bold;height:40px;vertical-align:bottom;";
                        if (oData[rowno]["LEVELNO"] == -1)
                            st = "font-weight:bold;border-bottom:groove;background-color:lightgrey;";

                        return st;
                    }
                    paras["hideTotals"] = true;
                    paras["fnOnAddTotalRow"] = function (footerNode_fg, mapNode_fg) {

                    };
                    paras["showFooter"] = true;
                    paras["fnOnFooter"] = function (footer) {
                        footer["LEVELNO"] = -1;
                    };

                    var str = UtilGen.buildJSONTreeWithTotal(ld, paras);
                    $("#tbDbSales1").html(str);
                    $("#" + cmds[cmdNo]).addClass("tile_disp_sel");
                    setTimeout(() => {
                        UtilGen.closeWorking(that.pgBasicData);
                    }, 1000);

                }
            } catch (e) {
                UtilGen.closeWorking(that.pgBasicData);
                console.log(e);
                FormView.err(e);
            }

        }, 100);

    },
    translateHtml: function (html, pgnm) {
        var that = this;
        var s = Util.nvl(undefined, sap.ui.getCore().getConfiguration().getLanguage());
        if (s.toUpperCase() != "AR") return html;
        var pgname = pgnm.replaceAll(".html", "").replaceAll("/", "_");
        // var regex = /\{\{\s*(\w+)\s*\}\}/g;
        // var matches = [...html.matchAll(regex)];
        // var ht2 = html;
        // matches.forEach((key, idx) => {
        //     ht2 = ht2.replaceAll("{{" + matches[key] + "}}", Util.getLangText("x1dbMainView_" + matches[key]));
        // });
        var ht2 = html;
        var pgTokens = this.langs[pgname];
        if (pgTokens == undefined) return html;
        Object.keys(pgTokens).forEach((key, idx) => {
            ht2 = ht2.replaceAll(key, pgTokens[key]);
        });
        return ht2;
    },
    autoShowHideMenu: function (showHide, parentWnd) {
    },
    assignLang: function () {
        var that = this;

        that.langs = {
            "dbMainPage": {
                "Shipping": "البواخر",
                "Mina Abdulla Expenses": "مصاريف مخزن مينا عبدالله",
                "Wafra Expenses": " مصاريف مخزن الوفرة",
                "<strong>Expenses</strong>": "<strong>المصروفات</strong>",
                "Follow Up": "شاشة المتابعة",
                "HR<br>No Of Employees": "الموارد البشرية",
                "Office Expenses": "مصاريف المكتب",
                "Inventory<br>Balances": "أرصدة <br> المخزون",
                "Recievables": "ارصدة العملاء",
                "Payables": "ارصدة الموردين",
                "Cash / Bank": "النقد/البنك",
                "Administration": "إدارة",
                "Sales By Store": "المبيعات حسب المخزن",
                "<strong>Sales</strong>": "<strong>المبيعات</strong>",
            }
        }
    },
    helperFunctions: {
        init: function (frm) {
            this.thatForm = frm;
        }
    }

});