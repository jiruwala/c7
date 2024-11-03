sap.ui.jsfragment("bin.forms.pur.poship", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.isDialog = false;
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };

        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        this.helperFunc.init(this);
        this.vars = {
            keyfld: -1,
            flag: 1,  // 1=closed,2 opened,
            vou_code: 11,
            type: 1
        };

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
        });
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");
        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        return this.joApp;
    },
    createView: function () {
        //testuing2
        var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var that2 = this;
        var thatForm = this;
        var view = this.view;
        var fullSpan = "XL8 L8 M8 S12";
        var codSpan = "XL3 L3 M3 S12";
        var sumSpan = "XL2 L2 M2 S12";
        var sumSpan2 = "XL2 L6 M6 S12";
        var dmlSq = "select o2.*,((o2.ord_price-o2.ORD_DISCAMT)*(o2.ord_allqty/o2.ord_pack)) amount from pord2 o2 where O2.KEYFLD=':qry1.keyfld' and ord_code=" + thatForm.vars.vou_code + " order by ord_pos ";

        Util.destroyID("cmdA" + this.timeInLong, this.view);
        UtilGen.clearPage(this.mainPage);
        this.frm;
        var js = {
            form: {
                title: Util.getLangText("titPurShipping"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("rcvdTxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redText boldText");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), txtMsg]

                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                },
                print_templates: [
                    {
                        title: "Print",
                        reportFile: "br/salord",
                    }
                ],
                events: thatForm.helperFunc.getEvents(),
                parameters: [
                    {
                        para_name: "pac",
                        data_type: FormView.DataType.String,
                        value: ""
                    },
                    {
                        para_name: "pacPo",
                        data_type: FormView.DataType.String,
                        value: ""
                    }

                ],
                db: [
                    {
                        type: "query",
                        name: "qry1",
                        dml: "select *from c7_purship where keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', "attachment"],
                        insert_exclude_fields: ["attachment"],
                        insert_default_values: {
                            "modified_time": "sysdate",
                            "created_time": "sysdate",
                            "usernm": Util.quoted(sett["LOGON_USER"])

                        },
                        update_default_values: {
                            "modified_time": "sysdate"
                        },
                        table_name: "c7_purship",
                        edit_allowed: true,
                        insert_allowed: true,
                        delete_allowed: false,
                        fields: thatForm.helperFunc.getFields1()
                    },
                ],
                canvas: [],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getList()
            }
        }
            ;
        this.frm = new FormView(this.mainPage);
        this.frm.view = view;
        this.frm.pg = this.mainPage;
        this.frm.frag = this;
        this.frm.parseForm(js);
        this.frm.createView();

        // this.mainPage.addContent(sc);

    },

    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {
    },
    helperFunc: {
        init: function (frm) {
            this.thatForm = frm;
            this.validity.init(frm);
        },
        getEvents: function () {
            var thatForm = this.thatForm;
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            return {
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    qry.formview.setFieldValue("pacPo", qry.formview.getFieldValue("po_keyfld"));
                    thatForm.fetchCustItems = false;
                    if (qry.name == "qry1") {
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        var pokf = qry.formview.getFieldValue("po_keyfld");
                        if (Util.nvl(pokf, "") != "") {
                            var str = "";
                            var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, true);
                            str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                                podt.ORD_FLAG == 2 ? "Opened" :
                                    podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);
                        }

                        // UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.txt_empname"].obj);
                        // var aproved = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        // if (Util.nvl(aproved, 1) == 2) {
                        //     thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("PO is approved !");
                        //     var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=11 and pord1_keyfld=" + qry.formview.getFieldValue("keyfld"));
                        //     var ordrd = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where ord_code=11 and keyfld=" + qry.formview.getFieldValue("keyfld"));
                        //     var rcvdp = 0;
                        //     if (ordrd > 0) rcvdp = Math.round((100 / ordrd) * rcvdp);
                        //     thatForm.view.byId("rcvdTxt" + thatForm.timeInLong).setText("Recieved : " + rcvdp + " % ");
                        // }
                    }
                },
                beforeLoadQry: function (qry, sql) {
                    return sql;
                },
                afterSaveQry: function (qry) {

                },
                afterSaveForm: function (frm, nxtStatus) {
                    // frm.loadData(undefined, FormView.RecordStatus.NEW);
                },
                beforeSaveQry: function (qry, sqlRow, rowno) {
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    if (qry.name == "qry2") {

                    }
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {

                    if (qry.name == "qry1") {
                        thatForm.fetchCustItems = false;
                        thatForm.helperFunc.checkPOselected(qry);
                    }


                },
                afterEditRow(qry, index, ld) {

                },
                beforeDeleteValidate: function (frm) {
                    var kf = frm.getFieldValue("keyfld");
                    var dt = Util.execSQL("select ord_flag from pord1 where keyfld=" + kf);
                    if (dt.ret == "SUCCESS") {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        if (dtx.length > 0 && dtx[0].ORD_FLAG == 2) {
                            // frm.setFormReadOnly();
                            FormView.err("This PO IS APPROVED !!");
                        }
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) {

                },
                afterDelRow: function (qry, ld, data) {


                },
                onCellRender: function (qry, rowno, colno, currentRowContext) {
                },
                beforePrint: function (rptName, params) {
                    var no = that.frm.getFieldValue("qry1.ord_no");
                    return params + "&_para_pfromno=" + no + "&_para_ptono=" + no;
                },
                afterApplyCols: function (qry) {
                    if (qry.name == "qry2") {

                    }

                },
                beforeExeSql: function (frm, sq) {
                    return sq;
                }
            };
        },
        getSummary: function () {
            var thatForm = this.thatForm;
            var sumSpan = "XL2 L2 M2 S12";
            var sumSpan2 = "XL2 L6 M6 S12";
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
            };
        },
        validity: {
            init: function (frm) {
                this.thatForm = frm;
            },

        },
        getFields1: function () {
            var codSpan = "XL3 L3 M3 S12";
            var fullSpan = "XL8 L8 M8 S12";
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            // keyfld                  attachment,
            // trip_no,                arrival_date_port,
            // ship_type,              ship_name,
            // discharge_start_date,   discharge_end_date,
            // sail_date,              ship_load,
            // total_paths,            unload_store,
            // fresh_water,            n_of_roads, n_of_discharge,
            // sign_off,               start_from,end_to,
            // car_co,                 enter_berth,
            // ton_port,               signoff, signin, 
            // from_dlv, to_dlv
            return {
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                po_keyfld: FormView.getFactoryFields.getGeneralField(
                    "po_keyfld", "@", "po_keyfld", "15%", "", "10%",
                    {
                        data_type: FormView.DataType.Number,
                        class_name: FormView.ClassTypes.LABEL,
                        display_style: "keyIdText",
                    })
                ,
                attachment: FormView.getFactoryFields.getAttachMentField(thatForm, "@", "15%", "35%"),
                trip_no: FormView.getFactoryFields.getNumberField(
                    "trip_no", "", "puShiptripno", "15%", "", "35%",
                    { edit_allowed: false })
                ,
                arrival_date_port: FormView.getFactoryFields.getDateField(
                    "arrival_date_port", "@", "puShiparrivaldateport", "15%", "", "35%",
                    { require: true }, {}),
                ship_type: FormView.getFactoryFields.getComboField(
                    "ship_type", "", "puShipType",
                    "15%", "", "35%",
                    {
                        list: "@land/Land,sea/Sea,air/Air",
                        require: true
                    }, {}),
                ship_name: FormView.getFactoryFields.getGeneralField(
                    "ship_name", "@", "puShipName", "15%", "", "35%",
                    { require: true }, {}),
                discharge_start_date: FormView.getFactoryFields.getDateField(
                    "discharge_start_date", "", "puShipdischargestartdate", "15%", "", "35%",
                    { require: true }, {}),
                discharge_end_date: FormView.getFactoryFields.getDateField(
                    "discharge_end_date", "@", "puShipdischargeenddate", "15%", "", "35%",
                    {}, {}),
                sail_date: FormView.getFactoryFields.getDateField(
                    "sail_date", "", "puShipsaildate", "15%", "", "35%",
                    {}, {}),
                ship_load: FormView.getFactoryFields.getGeneralField(
                    "ship_load", "@", "puShipshipload", "15%", "", "35%",
                    {}, {}),
                total_paths: FormView.getFactoryFields.getNumberField(
                    "total_paths", "", "puShiptotalpaths", "15%", "", "35%",
                    {}, {}),
                unload_store: FormView.getFactoryFields.getGeneralField(
                    "unload_store", "@", "puShipunloadstore", "15%", "", "35%",
                    {}, {}),
                fresh_water: FormView.getFactoryFields.getGeneralField(
                    "fresh_water", "", "puShipfreshwater", "15%", "", "35%",
                    {}, {}),
                n_of_roads: FormView.getFactoryFields.getNumberField(
                    "n_of_roads", "@", "puShipnofroads", "15%", "", "10%",
                    {}, {}),
                n_of_discharge: FormView.getFactoryFields.getNumberField(
                    "n_of_discharge", "@", "puShipnofdischarge", "15%", "", "10%",
                    {}, {}),
                sign_off: FormView.getFactoryFields.getGeneralField(
                    "sign_off", "", "puShipsignoff", "15%", "", "35%",
                    {}, {}),
                start_from: FormView.getFactoryFields.getGeneralField(
                    "start_from", "@", "puShipstartfrom", "15%", "", "10%",
                    {}, {}),
                end_to: FormView.getFactoryFields.getGeneralField(
                    "end_to", "@", "puShipendto", "15%", "", "10%",
                    {}, {}),
                car_co: FormView.getFactoryFields.getGeneralField(
                    "car_co", "", "puShipcarco", "15%", "", "35%",
                    {}, {}),
                enter_berth: FormView.getFactoryFields.getGeneralField(
                    "enter_berth", "@", "puShipenterberth", "15%", "", "35%",
                    {}, {}),
                ton_port: FormView.getFactoryFields.getGeneralField(
                    "ton_port", "", "puShiptonport", "15%", "", "35%",
                    {}, {}),
                signoff: FormView.getFactoryFields.getGeneralField(
                    "signoff", "@", "puShipsignoff", "15%", "", "10%",
                    {}, {}),
                signin: FormView.getFactoryFields.getGeneralField(
                    "signin", "@", "puShipsignin", "15%", "", "10%",
                    {}, {}),
                from_dlv: FormView.getFactoryFields.getGeneralField(
                    "from_dlv", "", "puShipfromdlv", "15%", "", "35%",
                    {}, {}),
                to_dlv: FormView.getFactoryFields.getGeneralField(
                    "to_dlv", "@", "puShiptodlv", "15%", "", "35%",
                    {}, {}),
            };
        },
        getList: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1',
                    title: "List of Orders",
                    list_type: "sql",
                    cols: [
                        {
                            colname: "PONO",
                            mTitle: Util.getLangText("titPurOrd")
                        },
                        {
                            colname: "PO_STATUS",
                            mTitle: Util.getLangText("puPoStatus")
                        },
                        {
                            colname: "TRIP_NO",
                            mSummary: "COUNT",
                            mTitle: Util.getLangText("puShiptripno")
                        },
                        {
                            colname: "SHIP_TYPE",
                            mTitle: Util.getLangText("puShipType")

                        },
                        {
                            colname: "SHIP_NAME",
                            mTitle: Util.getLangText("puShipName")

                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                            hide: true
                        },
                        {
                            colname: "ORD_REF",
                            mTitle: Util.getLangText("refCode")
                        },
                        {
                            colname: "ORD_REFNM",
                            mTitle: Util.getLangText("refName")
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select ORD_no pono ,po_status, trip_no, ship_type,ship_name,ord_ref,ord_refnm,keyfld from C7_SHIP_PO order by keyfld desc ",
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ];
        },
        getCommands: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: "cmdSave",
                    canvas: "default_canvas",
                    onPress: function (e) {
                        return true;
                    }
                },
                {
                    name: "cmdDel",
                    canvas: "default_canvas",
                }, {
                    name: "cmdEdit",
                    canvas: "default_canvas",
                    onPress: function (e) {
                        var qry = that2.frm.objs["qry1"];
                        if (qry.status == FormView.RecordStatus.VIEW) {
                            var pokf = qry.formview.getFieldValue("po_keyfld");
                            if (Util.nvl(pokf, "") != "") {
                                var str = "";
                                var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, true);
                                str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                                    podt.ORD_FLAG == 2 ? "Opened" :
                                        podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                                that2.view.byId("txtMsg" + that2.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);
                                if (podt.ORD_FLAG == 1 || podt.ORD_FLAG >= 3) {
                                    UtilGen.showCustomMessageToast("Can't Edit PO , either CLOSED or NOT Approved !", 100, "red", "#fff");
                                    return false;
                                }
                            }

                        }
                        return true;
                    }
                },
                {
                    name: "cmdNew",
                    canvas: "default_canvas",
                    title: Util.getLangText("newRec")
                }, {
                    name: "cmdList",
                    canvas: "default_canvas",
                    list_name: "list1"
                },
                {
                    name: "cmdPrint",
                    canvas: "default_canvas",
                    title: Util.getLangText("printRec")
                },
                {
                    name: "cmdOther",
                    canvas: "default_canvas",
                    title: "Action",

                    obj: new sap.m.Button({
                        icon: "sap-icon://action",
                        press: function () {
                            var mnus = [];
                            var bts = [];
                            var kf = that2.frm.getFieldValue("qry1.keyfld");
                            var flg = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + kf);
                            if (flg == 1 && (
                                (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW
                                ))) {


                            }
                            mnus.push(new sap.m.MenuItem({
                                text: "Landing Cost",
                                press: function () {
                                    that2.helperFunc.showLandingCost();
                                }
                            }))
                            var mnu = new sap.m.Menu({
                                items: mnus
                            });
                            mnu.openBy(this);
                        }
                    })
                },
                {
                    name: "cmdClose",
                    canvas: "default_canvas",
                    title: Util.getLangText("cmdClose"),
                    obj: new sap.m.Button({
                        icon: "sap-icon://decline",
                        press: function () {
                            that2.joApp.backFunction();
                        }
                    })
                },

            ];
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1") {
                var pokf = qry.formview.getFieldValue("po_keyfld");
                if (Util.nvl(pokf, "") != "") {
                    var str = "";
                    var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, true);
                    str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                        podt.ORD_FLAG == 2 ? "Opened" :
                            podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                    thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);
                    if (podt.ORD_FLAG == 1 || podt.ORD_FLAG >= 3)
                        FormView.err("Can't Edit PO , either CLOSED or NOT Approved !");
                }

            }
        },
        checkPOselected: function (qry) {
            var thatForm = this.thatForm;

            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW) {
                FormView.err("You can only select PO when Form is in NEW mode ");
            }
            var selPoKkf = function (pokf) {
                var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, true);
                var str = "";
                str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                    podt.ORD_FLAG == 2 ? "Opened" :
                        podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);

                thatForm.frm.setFieldValue('pacPo', pokf);
                thatForm.frm.setFieldValue('qry1.po_keyfld', pokf);

                var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                var objPOKf = thatForm.frm.objs["qry1.po_keyfld"].obj;

                var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_purship");
                var newKNo = Util.getSQLValue("select nvl(max(trip_no),0)+1 from c7_purship where po_keyfld='" + objPOKf.getValue() + "'");
                var dt = thatForm.view.today_date.getDateValue();

                UtilGen.setControlValue(objKf, newKf, newKf, true);
                UtilGen.setControlValue(thatForm.frm.objs["qry1.trip_no"].obj, newKNo, newKNo, true);
                UtilGen.setControlValue(thatForm.frm.objs["qry1.ship_type"].obj, 'sea', 'sea', true);
                qry.formview.setFieldValue("qry1.arrival_date_port", new Date(dt.toDateString()), new Date(dt.toDateString()), true);
                UtilGen.setControlValue(thatForm.frm.objs["qry1.n_of_roads"].obj, 0, 0, true);
                UtilGen.setControlValue(thatForm.frm.objs["qry1.n_of_discharge"].obj, 0, 0, true);
                UtilGen.setControlValue(thatForm.frm.objs["qry1.total_paths"].obj, 0, 0, true);
            }
            var pokf = thatForm.oController.poKeyFld;
            if (Util.nvl(pokf, '') != '') {
                selPoKkf(pokf);
                return;
            }
            UtilGen.showCustomMessageToast("puMsgSelectPO", 100);
            var sq = "SELECT ORD_NO,TO_CHAR(ORD_DATE,'DD/MM/RRRR') ORD_DATE,ORD_REF,ORD_REFNM,KEYFLD FROM PORD1 WHERE ORD_CODE=11 and ord_flag=2 ORDER BY KEYFLD desc ";
            UtilGen.Search.do_quick_search_simple(sq,
                ["ORD_NO", "ORD_DATE", "ORD_REF", "ORD_REFNM"], function (data) {
                    selPoKkf(data.KEYFLD);
                }, { pWidth: "80%" }, undefined, false, "Select PO for new shipment ");
        },
        showLandingCost: function () {
            var that2 = this.thatForm;
            var thisFunc = this;
            var generateCmds = function () {
                var view = that2.view;
                Util.destroyID(view.createId("btCtg" + that2.timeInLong));
                var btctg = new sap.m.Button(view.createId("btCtg" + that2.timeInLong), {
                    text: "Action",
                    customData: [{ key: "DEFAULT" }],
                    icon: "sap-icon://megamenu",
                    press: function () {
                        var mnus = [];
                        var loadasctg = function () {
                            that2.fetchCustItems = false;
                            fetchData();
                        }
                        mnus.push(new sap.m.MenuItem({
                            text: Util.getLangText("txtPOLCaddCosting") + "..",
                            press: function () {
                                thisFunc.showSpedning(dlg, pg, -1);
                            }

                        }));
                        var mnu = new sap.m.Menu({
                            items: mnus
                        }
                        )
                        mnu.openBy(this);
                    }
                });
                return btctg;
            }

            if (this.qc == undefined) {
                this.qc = new QueryView("qrRawitems" + that2.timeInLong);
                this.qc.getControl().setEditable(true);
                this.qc.getControl().view = that2.view;
                this.qc.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
                this.qc.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
                this.qc.getControl().setFixedBottomRowCount(0);
                this.qc.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);
                UtilGen.createDefaultToolbar1(this.qc, ["REFER", "DESCR"], false, undefined, undefined, false, false);
                this.qc.showToolbar.toolbar.addContent(new sap.m.ToolbarSpacer());
                this.qc.insertable = false;
                this.qc.deletable = false;
            }

            this.qc.showToolbar.toolbar.addContent(generateCmds());

            var cc = that2.frm.getFieldValue("qry1.keyfld");

            var fetchData = function () {
                var qv = thisFunc.qc;
                var dt = Util.execSQL("select code,title,0 amount from C7_POCOSTINFO ");
                if (dt.ret == "SUCCESS") {
                    qv.setJsonStrMetaData("{" + dt.data + "}");
                    qv.mLctb.parse("{" + dt.data + "}", true);
                    qv.loadData();
                    that2.fetchCustItems = true;
                }
            }

            var pg = new sap.m.Page({
                showHeader: true,
                content: [],
                showFooter: true
            }).addStyleClass("sapUiSizeCompact");
            var cmdClose = new sap.m.ToggleButton({
                text: Util.getLangText("cmdDone"),
                icon: "sap-icon://accept",
                pressed: false,
                press: function () {
                    dlg.close();
                }

            });
            Util.destroyID("txtRM" + that2.timeInLong, that2.view);
            var txtSumRM = new sap.m.Text(that2.view.createId("txtRM" + that2.timeInLong), { width: "300px", text: "0" }).addStyleClass("redText boldText");

            var tbHeader = new sap.m.Toolbar();
            pg.setFooter(tbHeader);
            pg.removeAllHeaderContent();
            pg.addHeaderContent(this.qc.showToolbar.toolbar);
            pg.addContent(this.qc.getControl());
            tbHeader.addContent(cmdClose);
            tbHeader.addContent(new sap.m.ToolbarSpacer());
            tbHeader.addContent(txtSumRM);

            var tit = Util.getLangText("titLandCost");
            if (cc != "")
                tit = Util.getLangText("titLandCost") + " - " + that2.frm.getFieldValue("qry1.ship_name") + " / " + that2.frm.getFieldValue("qry1.trip_no");

            var dlg = new sap.m.Dialog({
                title: tit,
                content: pg,
                contentWidth: "80%",
                contentHeight: "400px",

            });
            fetchData();
            dlg.open();
            dlg.attachAfterClose(function () {
                if (thisFunc.qc != undefined)
                    thisFunc.qc.updateDataToTable();
            });
            setTimeout(function () {
                if (thisFunc.qc != undefined)
                    thisFunc.qc.updateDataToControl();
            });

            // that2.qc.eventCalc = eventCalc;
            // eventCalc(that2.qc, undefined, 0, true);
        },
        showSpedning: function (dlg, pg, kf) {
            var thisFunc = this;
            var that2 = this.thatForm;
            UtilGen.clearPage(pg);
            pg.removeAllHeaderContent();
            thisFunc.qc = undefined;
            var tb = new sap.m.Toolbar({
                content: [
                    new sap.m.Button({
                        text: "Save & Back",
                        press: function () {
                            that2.fetchCustItems = false;
                            thisFunc.showLandingCost();
                        }
                    })
                ]
            });            
            pg.addHeaderContent(tb);
        }
    }
    ,
    loadData: function () {
        var frag = this;
        if (Util.nvl(frag.oController.keyfld, "") != "") {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld, ""));
            frag.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
            frag.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        } else if (Util.nvl(frag.oController.purKeyfld, "") != "") {

        }
        else {
            UtilGen.Vouchers.formLoadData(this);
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



