sap.ui.jsview("bin.forms.br.kha.forms.dbMgr", {

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
        var getMeuTile = function (headerTxt, footerTxt, value, prefix) {
            var frameType = "TwoByHalf", subheaderTxt = "";
            return new sap.m.GenericTile({
                // backgroundImage:"css/chn.png",
                frameType: Util.nvl(frameType, "OneByHalf"),
                header: Util.nvl(headerTxt),
                subheader: Util.nvl(subheaderTxt, ""),
                tileContent: new sap.m.TileContent({
                    icon: "sap-icon://person-placeholder",
                    footer: Util.nvl(footerTxt, "Total : "),
                    size:"L",
                    content: [new sap.m.NumericContent({
                        truncateValueTo:10,
                        scale: Util.nvl(prefix, "KWD"),
                        value: Util.nvl(value, "0.000"),
                        valueColor: "None",
                        indicator: "None"
                    }), new sap.m.ImageContent({ src: "sap-icon://home-share" })
                    ]
                }),
                press: function (ev) {

                }
            }).addStyleClass("sapUiMediumMarginBegin sapUiTinyMarginTop");
        }

        var getHeaderTile = function (headerTxt, value) {
            var frameType = "OneByHalf", subheaderTxt = "", footerTxt = "Total :";
            return new sap.m.GenericTile({
                frameType: Util.nvl(frameType, "OneByHalf"),
                header: Util.nvl(headerTxt),
                subheader: Util.nvl(subheaderTxt, ""),
                tileContent: new sap.m.TileContent({
                    unit: "KWD",
                    footer: Util.nvl(footerTxt, "Total : "),
                    content: [new sap.m.NumericContent({
                        truncateValueTo:10,
                        scale: "KWD",
                        value: Util.nvl(value, "0.000"),
                        valueColor: "None",
                        indicator: "None"
                    })]
                }),
                press: function (ev) {

                }
            }).addStyleClass("sapUiMediumMarginBegin sapUiMediumMarginTop");
        }
        var getMiddleTile = function (headerTxt, value) {
            var frameType = "TwoByOne", subheaderTxt = "", footerTxt = "Total :";
            return new sap.m.GenericTile({
                frameType: Util.nvl(frameType, "TwoThirds"),
                header: Util.nvl(headerTxt),
                subheader: Util.nvl(subheaderTxt, ""),
                tileContent: new sap.m.TileContent({
                    unit: "KWD",
                    footer: Util.nvl(footerTxt, "Total : "),
                    content: [new sap.m.NumericContent({
                        truncateValueTo:10,
                        width:"100%",
                        scale: "KWD",
                        value: Util.nvl(value, "0.000"),
                        valueColor: "None",
                        indicator: "None"
                    })]
                }),
                press: function (ev) {

                }
            }).addStyleClass("sapUiMediumMarginBegin sapUiMediumMarginTop");
        };
        var hb = new sap.m.HBox({
            justifyContent: "Center",
            wrap: sap.m.FlexWrap.Wrap,
            items: [
                getHeaderTile("Shiping", "56,568.250"),
                getHeaderTile("Shohaiba Port", "65,656.250"),
                getHeaderTile("Sales", "65,656.250"),
                getHeaderTile("Wafra Store", "65,656.250"),
                getHeaderTile("Expenses", "65,656.250"),
            ]

        });

        var vb1 = new sap.m.VBox({  
            width:"-1px",
            items: [
                getMeuTile("Follow Up / Due Customer balances:", "", "56,568.250"),
                getMeuTile("HR / No Of Employees", "", "65", " "),
                getMeuTile("Office Expenses , KD", "", "6,545,43.500", " "),
                getMeuTile("Inventory , KD", "", "6,545,43.500", " "),
            ]
        }).addStyleClass("sapUiMediumMarginBegin");

        that.mainPage.addContent(hb);
        that.mainPage.addContent(new sap.m.HBox({items:[vb1,getMiddleTile("Monthly Salest", "65,656.250")]}).addStyleClass("sapUiLargeMarginTop"));
        setTimeout(() => {
            var itm = hb.getItems();
            itm.forEach(element => {
                $("#" + element.getId()).css("background-color", "khaki");
                $("#" + element.getId() + "-title").css("color", "green");
                // $("#__tile0-title").css
            })
            var itm = vb1.getItems();
            itm.forEach(element => {
                $("#" + element.getId()).css("background-color", "khaki");
                $("#" + element.getId() + "-title").css("color", "green");
                // $("#__tile0-title").css
            })

        }, 10);

    },
    helperFunctions: {
        init: function (frm) {
            this.thatForm = frm;
        }
    }

});