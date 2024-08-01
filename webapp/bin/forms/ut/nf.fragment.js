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
            showHeader: false,
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
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 10, "L": 12, "XL": 18 });
        var qr = new QueryView("qryInvs" + that2.timeInLong);
        qr.getControl().setEditable(false);
        qr.getControl().view = that2;
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
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
        var sett = sap.ui.getCore().getModel("settings").getData();
        this.cust_code = '';

        Util.destroyID("txtTit" + this.timeInLong, this.view);



        var fe = [
            Util.getLabelTxt("titNotificationForm", "100%", "", "titleFontWithoutPad2 boldText"),

        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: ((sap.ui.Device.resize.width - 500) > 900 ? 900 : (sap.ui.Device.resize.width - 500)) + "px",
            cssText: [
            ]
        }, "sapUiSizeCompact", "");
        // cnt.addContent(new sap.m.VBox({ height: "40px" }));
        this.mainPage.addContent(cnt);
    }
    ,
    loadData: function () {
        var that = this;
        var qv = this.qr;
        var sq = "select s.usernm,s.setup_type,si.setup_title,to_char(s.LAST_NOTIFIED_TIME,'dd/mm/rrrr hh24.mi.ss') LAST_NOTIFIED_TIME from C7_NOTIFY_SETUP s," +
            " C7_NOTIFY_SETUP_ITEMS si " +
            " where si.setup_type(+)=s.setup_type " +
            " order by s.keyfld desc ";

        var dt = Util.execSQL(sq);

        if (dt.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dt.data + "}");
            qv.mLctb.parse("{" + dt.data + "}", true);


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

    }

});



