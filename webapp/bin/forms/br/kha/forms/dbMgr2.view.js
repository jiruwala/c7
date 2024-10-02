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
        Util.setLanguageModel(this);
        this.helperFunctions.init(this);
        this.timeInLong = (new Date()).getTime();
        this.addStyleClass("sapUiSizeCompact");
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        UtilGen.DBView = this;
        frag.mainPage = new sap.m.Page({
            showHeader: false,
            showSubHeader: true,
            showNavButton: false,
            enableScroll: true,
            height: "100%",
            content: []
        }).addStyleClass("tileLayout");

        frag.pgMaster = new sap.m.Page(this.createId("pgMaster"), {
            showHeader: false,
            showFooter: true,
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



        frag.joApp.addDetailPage(frag.pgBasicData);
        frag.joApp.addDetailPage(frag.mainPage);
        frag.joApp.addMasterPage(frag.pgMaster);
        frag.joApp.toDetail(frag.mainPage);
        frag.joApp.toMaster(frag.pgMaster);
        // setTimeout(function () {
        //     frag.joApp.showMaster();
        // }, 100);
        this.loginDB = false;
        this.loginCust = false;
        this.loginToDB();
        if (this.loginDB) {
            setTimeout(() => {
                frag.loginToCust();
            }, 500);

        }
        return this.joApp;

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
        UtilGen.clearPage(that.mainPage);
        that.qr = new sap.ui.core.HTML({
            preferDOM: true,
            // content: "<iframe src='/dbMainPage.html' style='width:100%;height:'100%'></iframe>"
        }).addStyleClass("sapUiSmallMargin");
        var tb = new sap.m.Toolbar({
            content: [new sap.m.Button({
                text: "Monthly",
                press: function () {
                }
            }
            ),
            new sap.m.Button({
                text: "Yearly",
                press: function () {
                }
            }
            )]
        });
        that.mainPage.setSubHeader(tb);

        $.ajax({
            url: "/dbMainPage.html",
            dataType: "text",
            async: false,
            success: function (cssText) {
                hd = cssText;
                that.qr.setContent(hd);
            }
        });
        var vb = new sap.m.VBox({ width: "-1px", height: "-1px", items: [that.qr] });
        that.mainPage.addContent(vb);
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            // $('#db_cmd_1').html('<strong>Copung </strong>');
        }, 100);

    },
    showShiping: function () {
        var that = this;
        UtilGen.clearPage(that.pgBasicData);
        that.joApp.toDetail(that.pgBasicData, "slide");
        // var tb = new sap.m.Toolbar({
        //     content: [new sap.m.Button({
        //         icon: "sap-icon://nav-back",
        //         press: function () {
        //             that.toMainMenu();
        //         }
        //     }
        //     )]
        // });
        // that.pgBasicData.setSubHeader(tb);
        that.qr2 = new sap.ui.core.HTML({
            preferDOM: true,
            // content: "<iframe src='/dbMainPage.html' style='width:100%;height:'100%'></iframe>"
        }).addStyleClass("sapUiSmallMargin");
        $.ajax({
            url: "/dbShipingPage.html",
            dataType: "text",
            async: false,
            success: function (cssText) {
                hd = cssText;
                that.qr2.setContent(hd);
            }
        });
        var vb = new sap.m.VBox({ width: "-1px", height: "-1px", items: [that.qr2] });
        that.pgBasicData.addContent(vb);
        that.showShip1();
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            // $('#db_cmd_1').html('<strong>Copung </strong>');            
        }, 100);
    },
    toMainMenu: function () {
        this.joApp.toDetail(this.mainPage, "flip");
    },
    showShip1: function () {
        this.selShip = 1;
        this.showShipData();
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
    showStrExpenses: function () {
        var that = this;
        UtilGen.clearPage(that.pgBasicData);
        that.joApp.toDetail(that.pgBasicData, "slide");
        that.qr2 = new sap.ui.core.HTML({
            preferDOM: true,
            // content: "<iframe src='/dbMainPage.html' style='width:100%;height:'100%'></iframe>"
        }).addStyleClass("sapUiSmallMargin");
        $.ajax({
            url: "/dbStrExp.html",
            async: false,
            success: function (cssText) {
                hd = cssText;
                that.qr2.setContent(hd);
            }
        });
        var vb = new sap.m.VBox({ width: "-1px", height: "-1px", items: [that.qr2] });
        that.pgBasicData.addContent(vb);
        that.showShip1();
        setTimeout(() => {
            // that.qr.$().contents().find('#db1').html('<strong> blah </strong>');
            // $('#db_cmd_1').html('<strong>Copung </strong>');            
        }, 100);
    },
    helperFunctions: {
        init: function (frm) {
            this.thatForm = frm;
        }
    }

});