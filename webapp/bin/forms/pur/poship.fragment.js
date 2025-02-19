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
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" })).addStyleClass("linkLabel");
                    txt.attachBrowserEvent("click", function () {
                        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                            that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                            Util.simpleConfirmDialog(Util.getLangText("msgSaveFormData"), function (oAction) {
                                that2.frm.cmdButtons.cmdSave.firePress();
                                that2.helperFunc.showLandingCost();
                            });
                        } else
                            that2.helperFunc.showLandingCost();

                    });
                    var hb = new sap.m.Toolbar({
                        content: [txt, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    vbHeader.addItem(hb);
                    that.vbHeader = vbHeader;
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
            var df = new DecimalFormat(sett['FORMAT_MONEY_1']);
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
                            var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, false);
                            str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                                podt.ORD_FLAG == 2 ? "Opened" :
                                    podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);
                            thatForm.oController.poKeyFld = pokf;
                        }
                        that.helperFunc.showTripCmds();
                        if (thatForm.view.byId("numtxt" + thatForm.timeInLong) != undefined) {
                            thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("");
                            var cst = Util.getSQLValue("select nvl(sum(amount),0) from c7_polandcost where pship_keyfld =" + qry.formview.getFieldValue("keyfld"));
                            thatForm.view.byId("numtxt" + thatForm.timeInLong).setText("Land Cost : " + df.format(cst));
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
                        if (dtx.length > 0 && dtx[0].ORD_FLAG == 3) {
                            // frm.setFormReadOnly();
                            FormView.err("This Shimpment's PO is closed !!");
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
                //1
                trip_no: FormView.getFactoryFields.getNumberField(
                    "trip_no", "", "puShiptripno", "15%", "", "35%",
                    { edit_allowed: false })
                ,
                ton_port: FormView.getFactoryFields.getGeneralField(
                    "ton_port", "@", "puShiptonport", "15%", "", "35%",
                    {}, {}),
                //2
                ship_name: FormView.getFactoryFields.getGeneralField(
                    "ship_name", "", "puShipName", "15%", "", "35%",
                    { require: true }, {}),
                ship_load: FormView.getFactoryFields.getGeneralField(
                    "ship_load", "@", "puShipshipload", "15%", "", "35%",
                    {}, {}),
                //3                                
                car_co: FormView.getFactoryFields.getGeneralField(
                    "car_co", "", "puShipcarco", "15%", "", "35%",
                    {}, {}),
                total_paths: FormView.getFactoryFields.getNumberField(
                    "total_paths", "@", "puShiptotalpaths", "15%", "", "35%",
                    {}, {}),
                //4
                ship_type: FormView.getFactoryFields.getComboField(
                    "ship_type", "", "puShipType",
                    "15%", "", "35%",
                    {
                        list: "@land/Land,sea/Sea,air/Air",
                        require: true
                    }, {}),
                unload_store: FormView.getFactoryFields.getGeneralField(
                    "unload_store", "@", "puShipunloadstore", "15%", "", "35%",
                    {}, {}),
                //5
                arrival_date_port: FormView.getFactoryFields.getDateField(
                    "arrival_date_port", "", "puShiparrivaldateport", "15%", "", "35%",
                    { require: true }, {}),
                fresh_water: FormView.getFactoryFields.getGeneralField(
                    "fresh_water", "@", "puShipfreshwater", "15%", "", "35%",
                    {}, {}),
                //6
                enter_berth: FormView.getFactoryFields.getGeneralField(
                    "enter_berth", "", "puShipenterberth", "15%", "", "35%",
                    {}, {}),
                n_of_roads: FormView.getFactoryFields.getNumberField(
                    "n_of_roads", "@", "puShipnofroads", "15%", "", "35%",
                    {}, {}),
                //7
                discharge_start_date: FormView.getFactoryFields.getDateField(
                    "discharge_start_date", "", "puShipdischargestartdate", "15%", "", "35%",
                    { require: true }, {}),
                n_of_discharge: FormView.getFactoryFields.getNumberField(
                    "n_of_discharge", "@", "puShipnofdischarge", "15%", "", "35%",
                    {}, {}),
                //9
                discharge_end_date: FormView.getFactoryFields.getDateField(
                    "discharge_end_date", "", "puShipdischargeenddate", "15%", "", "35%",
                    {}, {}),
                sign_off: FormView.getFactoryFields.getGeneralField(
                    "sign_off", "@", "puShipsignoff", "15%", "", "35%",
                    {}, {}),
                //10
                sail_date: FormView.getFactoryFields.getDateField(
                    "sail_date", "", "puShipsaildate", "15%", "", "35%",
                    {}, {}),

                start_from: FormView.getFactoryFields.getGeneralField(
                    "start_from", "@", "puShipstartfrom", "15%", "", "35%",
                    {}, {}),
                //11
                end_to: FormView.getFactoryFields.getGeneralField(
                    "end_to", "", "puShipendto", "65%", "", "35%",
                    {}, {}),

                //13
                signin: FormView.getFactoryFields.getGeneralField(
                    "signin", "", "puShipsignin", "65%", "", "35%",
                    {}, {}),
                //14
                signoff: FormView.getFactoryFields.getGeneralField(
                    "signoff", "", "puShipsignoff2", "65%", "", "35%",
                    {}, {}),
                //12
                from_dlv: FormView.getFactoryFields.getGeneralField(
                    "from_dlv", "", "puShipfromdlv", "65%", "", "35%",
                    {}, {}),
                //15
                to_dlv: FormView.getFactoryFields.getGeneralField(
                    "to_dlv", "", "puShiptodlv", "65%", "", "35%",
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
                            mTitle: Util.getLangText("titPurOrd"),
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
                                    if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT ||
                                        that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                                        Util.simpleConfirmDialog(Util.getLangText("msgSaveFormData"), function (oAction) {
                                            that2.frm.cmdButtons.cmdSave.firePress();
                                            that2.helperFunc.showLandingCost();
                                        });
                                    } else
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
            var pokf = qry.formview.getFieldValue("po_keyfld");
            var skf = qry.formview.getFieldValue("keyfld");

            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                skf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_purship");
                qry.formview.setFieldValue("qry1.keyfld", skf, skf, true);
                qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
            }

            if (Util.nvl(pokf, "") != "") {
                var str = "";
                var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, true);
                str = podt.ORD_FLAG == 1 ? "Not-Approved" :
                    podt.ORD_FLAG == 2 ? "Opened" :
                        podt.ORD_FLAG >= 3 ? "Closed" : "Closed !";
                thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("PO #" + podt.ORD_NO + " , " + str);
                if (podt.ORD_FLAG == 1 || podt.ORD_FLAG >= 3)
                    FormView.err("Can't Edit PO , either CLOSED or NOT Approved !");
            } else
                FormView.err("No PO is assigned !");


        },
        checkPOselected: function (qry) {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.NEW) {
                FormView.err("You can only select PO when Form is in NEW mode ");
            }
            getShipDataIfExist = function (pokf) {
                if (Util.nvl(thatForm.firstRecViewed, false)) return;
                var skf = Util.getSQLValue("select nvl(max(keyfld),-1) from c7_purship where po_keyfld=" + pokf);
                if (skf != -1) {
                    thatForm.frm.setFieldValue('pac', skf);
                    thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                    thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                    thatForm.firstRecViewed = true;
                }
            };
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
                thatForm.helperFunc.showTripCmds();
            }
            var pokf = thatForm.oController.poKeyFld;

            if (Util.nvl(pokf, '') != '' && UtilGen.PurchaseOrderFunc.checkPOStatus(pokf, false).ORD_FLAG == 2) {
                selPoKkf(pokf);
                getShipDataIfExist(pokf);
                return;
            }
            UtilGen.showCustomMessageToast("puMsgSelectPO", 100);
            var sq = "SELECT ORD_NO,ORD_DATE,ORD_REF,ORD_REFNM,ord_amt,KEYFLD FROM PORD1 WHERE ORD_CODE=11 and ord_flag=2 ORDER BY KEYFLD desc ";
            UtilGen.Search.do_quick_search_simple(sq,
                ["ORD_NO", "ORD_DATE", "ORD_REF", "ORD_REFNM", "ORD_AMT"], function (data) {
                    thatForm.oController.poKeyFld = data.KEYFLD;
                    selPoKkf(data.KEYFLD);
                }, { pWidth: "80%" }, undefined, false, Util.getLangText("puPoSelPOShip"), [
                {
                    ORD_NO: {
                        colname: "ORD_NO",
                        display_width: 80,
                        mTitle: Util.getLangText("titPurOrd"),
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
        showLandingCost: function (pDlg, pPg) {
            var dlg = Util.nvl(pDlg, undefined);
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
                UtilGen.createDefaultToolbar1(this.qc, ["REFER", "DESCR"], true, undefined, undefined, false, false);
                this.qc.showToolbar.toolbar.addContent(new sap.m.ToolbarSpacer());
                this.qc.insertable = false;
                this.qc.deletable = false;
            }

            this.qc.showToolbar.toolbar.addContent(generateCmds());

            var cc = that2.frm.getFieldValue("qry1.keyfld");
            var calcSum = function () {
                var sett = sap.ui.getCore().getModel("settings").getData();
                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                var sumAmt = 0;
                var qv = thisFunc.qc;
                var ld = qv.mLctb;
                for (var i = 0; i < ld.rows.length; i++)
                    sumAmt += Util.extractNumber(ld.getFieldValue(i, "AMOUNT"));
                that2.view.byId("txtRM" + that2.timeInLong).setText("Amount : " + df.format(sumAmt));
            };
            var fetchData = function () {

                var qv = thisFunc.qc;
                var kf = that2.frm.getFieldValue("qry1.keyfld");
                var sq = "select I.code,I.title,SUM(C.AMOUNT) AMOUNT " +
                    " from C7_POCOSTINFO I,C7_POLANDCOST C " +
                    " WHERE I.CODE=C.LANDCOST_CODE " +
                    " and PSHIP_KEYFLD=" + kf +
                    " GROUP BY I.CODE,I.TITLE ORDER BY I.CODE";

                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS") {
                    qv.setJsonStrMetaData("{" + dt.data + "}");
                    qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].getMUIHelper().display_format = "MONEY_FORMAT";
                    qv.mLctb.cols[qv.mLctb.getColPos("CODE")].getMUIHelper().display_width = 80;
                    // qv.mLctb.cols[qv.mLctb.getColPos("AMOUNT")].mSummary = "SUM";
                    qv.mLctb.parse("{" + dt.data + "}", true);
                    qv.loadData();
                    that2.fetchCustItems = true;
                    setTimeout(() => {
                        calcSum();
                    });

                }
            }
            var pg = Util.nvl(pPg, new sap.m.Page({
                showHeader: true,
                content: [],
                showFooter: true
            }).addStyleClass("sapUiSizeCompact"));
            var cmdClose = new sap.m.Button({
                text: Util.getLangText("cmdDone"),
                icon: "sap-icon://accept",
                press: function () {
                    dlg.close();
                }
            });
            Util.destroyID("cmdEditSpend" + that2.timeInLong, that2.view);
            var cmdEdit = new sap.m.ToggleButton(that2.view.createId("cmdEditSpend" + that2.timeInLong), {
                text: Util.getLangText("editRec"),
                icon: "sap-icon://edit",
                pressed: (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT
                    || that2.frm.objs["qry1"].status == FormView.RecordStatus.NEW),
                press: function () {
                    if (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
                        that2.frm.cmdButtons.cmdEdit.setPressed(true);
                        that2.frm.cmdButtons.cmdEdit.firePress();
                        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                            that2.frm.cmdButtons.cmdEdit.setPressed(true);
                            this.setPressed(true);
                        }
                        else {
                            that2.frm.cmdButtons.cmdEdit.setPressed(false);
                            this.setPressed(false);
                        }
                        setTimeout(function () {
                            if (that2.frm.objs["qry1"].status == FormView.RecordStatus.EDIT) {
                                thisFunc.showSpedning(dlg, pg, -1);
                            }
                        })
                    }

                    // seteditale();
                }

            });
            var pokeyfld = that2.frm.getFieldValue("qry1.po_keyfld");
            if (UtilGen.PurchaseOrderFunc.checkPOStatus(pokeyfld, false).ORD_FLAG != 2)
                cmdEdit.setEnabled(false);
            Util.destroyID("txtRM" + that2.timeInLong, that2.view);
            var txtSumRM = new sap.m.Text(that2.view.createId("txtRM" + that2.timeInLong), { width: "300px", text: "0" }).addStyleClass("redText boldText");

            var tbHeader = new sap.m.Toolbar();

            UtilGen.clearPage(pg);
            pg.removeAllHeaderContent();
            pg.setFooter(tbHeader);
            pg.removeAllHeaderContent();
            pg.addHeaderContent(this.qc.showToolbar.toolbar);
            pg.addContent(this.qc.getControl());
            tbHeader.addContent(cmdClose);
            tbHeader.addContent(cmdEdit);
            tbHeader.addContent(new sap.m.ToolbarSpacer());
            tbHeader.addContent(txtSumRM);

            var tit = Util.getLangText("titLandCost");
            if (cc != "")
                tit = Util.getLangText("titLandCost") + " - " + that2.frm.getFieldValue("qry1.ship_name") + " / " + that2.frm.getFieldValue("qry1.trip_no");
            if (dlg == undefined) {
                var dlg = new sap.m.Dialog({
                    title: tit,
                    content: pg,
                    contentWidth: "80%",
                    contentHeight: "400px",

                });
                dlg.open();

                dlg.attachAfterClose(function () {
                    if (thisFunc.qc != undefined)
                        thisFunc.qc.updateDataToTable();
                });
            }
            fetchData();

            setTimeout(function () {
                if (thisFunc.qc != undefined)
                    thisFunc.qc.updateDataToControl();
            }, 150);

            // that2.qc.eventCalc = eventCalc;
            // eventCalc(that2.qc, undefined, 0, true);
        },
        showSpedning: function (dlg, pg, kf) {
            var thisFunc = this;
            var that2 = this.thatForm;
            var view = that2.view;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var cc = that2.frm.getFieldValue("qry1.keyfld");
            var pokeyfld = that2.frm.getFieldValue("qry1.po_keyfld");
            var pok = undefined;
            var fe = [];
            var mp = {};
            // var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokeyfld, false);
            var kfldQry = Util.nvl(kf, -1);
            if (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW && kfldQry == -1) {
                var kf = Util.getSQLValue("select nvl(max(keyfld),-1) from c7_polandcost where pship_keyfld=" + cc);
                if (kf == -1) FormView.err("PO is not opened !");
                kfldQry = kf;
            }

            var getListCmd = function () {
                Util.destroyID(view.createId("btSpendList" + that2.timeInLong));
                var btctg = new sap.m.Button(view.createId("btSpendList" + that2.timeInLong), {
                    text: "New Spedning..",
                    customData: [{ key: -1 }],
                    icon: "sap-icon://megamenu",
                    press: function () {
                        var pokeyfld = that2.frm.getFieldValue("qry1.po_keyfld");
                        var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokeyfld, false);
                        var mnus = [];
                        var loadasctg = function () {
                        }
                        var sq = "select 'NO#'||trans_no||' ,'||I.title||' , '||" +
                            " TO_CHAR(c.TRANS_DATE,'DD/MM/RRRR')||', # '||trim(to_char(c.amount,'999G999G999G990D00')) descr" +
                            ",keyfld from C7_POCOSTINFO I,C7_POLANDCOST C " +
                            " WHERE I.CODE=C.LANDCOST_CODE " +
                            " and pship_keyfld=" + cc +
                            " ORDER BY c.keyfld";
                        var dtx = Util.execSQLWithData(sq);
                        for (var d in dtx) {
                            mnus.push(new sap.m.MenuItem({
                                text: dtx[d].DESCR,
                                customData: [{ key: dtx[d].KEYFLD }, { key: dtx[d].DESCR }],
                                press: function () {
                                    var ed = that2.view.byId("btSpendList" + that2.timeInLong);
                                    var des = this.getCustomData()[1].getKey();
                                    ed.setText(des);
                                    kfldQry = this.getCustomData()[0].getKey();
                                    loadData();
                                }

                            }));
                        }
                        if (podt.ORD_FLAG == 2)
                            mnus.push(new sap.m.MenuItem({
                                text: "Add Spending..",
                                customData: [{ key: -1 }, { key: "Add Spending.." }],
                                press: function () {
                                    var ed = that2.view.byId("btSpendList" + that2.timeInLong);
                                    var des = this.getCustomData()[1].getKey();
                                    ed.setText(des);
                                    kfldQry = this.getCustomData()[0].getKey();
                                    loadData();
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

            var setEnableMps = function (ed) {
                // if (mp == undefined) return;
                var kys = Object.keys(mp);
                for (var k in kys) {
                    if (mp[kys[k]].setEditable != undefined)
                        mp[kys[k]].setEditable(ed);
                }
                if (ed) {
                    mp["expense_ac"].setEditable(false);
                    mp["expensename"].setEditable(false);
                    mp["costcent"].setEditable(false);
                    mp["costcentname"].setEditable(false);
                }

                if (ed && kfldQry != -1) mp["trans_no"].setEditable(false);
            }
            var validateShipPo = function () {
                pok = Util.getSQLValue("select po_keyfld from c7_purship where keyfld=" + cc);
                if (Util.nvl(pok, '') == '')
                    FormView.err("Shipment have not found !");
                var flg = Util.getSQLValue("select nvl(max(ord_flag),-1) from pord1 where ord_code=11 and keyfld=" + pok);
                view.byId("cmdSpendSaveBack" + that2.timeInLong).setEnabled(true);
                setEnableMps(true);
                if (flg != 2) {
                    if (view.byId("cmdSpendSaveBack" + that2.timeInLong) != undefined)
                        view.byId("cmdSpendSaveBack" + that2.timeInLong).setEnabled(false);
                    setEnableMps(false);
                    sap.m.MessageToast.show("PO is not approved or may be closed  !");
                }
            }
            // validateShipPo();
            UtilGen.clearPage(pg);
            pg.removeAllHeaderContent();
            thisFunc.qc = undefined;
            var btList = getListCmd();
            Util.destroyID("cmdSpendSaveBack" + that2.timeInLong, view);
            Util.destroyID("cmdSpendDel" + that2.timeInLong, view);
            var txtTit = new sap.m.Title({ text: "Total Amount : " }).addStyleClass("boldText redText");
            var tb = new sap.m.Toolbar({
                content: [
                    btList,
                    new sap.m.ToolbarSpacer(),
                    txtTit,
                    new sap.m.Button({
                        text: "Cancel & Back",
                        icon: "sap-icon://decline",
                        press: function () {
                            that2.fetchCustItems = false;
                            // insertOrUpd();
                            thisFunc.showLandingCost(dlg, pg);
                        }
                    }),
                    new sap.m.Button(view.createId("cmdSpendSaveBack" + that2.timeInLong), {
                        text: "Save & Back",
                        icon: "sap-icon://save",
                        press: function () {
                            that2.fetchCustItems = false;
                            insertOrUpd();
                            thisFunc.showLandingCost(dlg, pg);
                        }
                    }),
                    new sap.m.Button(view.createId("cmdSpendDel" + that2.timeInLong), {
                        text: "Delete",
                        icon: "sap-icon://delete",
                        press: function () {
                            that2.fetchCustItems = false;
                            delRec();
                            thisFunc.showLandingCost(dlg, pg);
                        }
                    })
                ]
            });

            var addFe = function (ar) {
                mp[ar[1].colname] = ar[1];
                fe = [...fe, ...ar.slice(0)];
            }
            var getVal = (str) => {
                if (mp[str].getDateValue != undefined)
                    return mp[str].getDateValue();
                return mp[str].getValue();
            }
            var checkEmptyVal = function (ostrs) {
                for (var o in ostrs)
                    if (Util.nvl(getVal(ostrs[o]), "") == "") {
                        setTimeout(() => { mp[ostrs[o]].focus(); }, 150);
                        FormView.err("Must have value ! ");
                    }
            }
            var loadData = function () {
                validateShipPo();
                var dt = that2.view.today_date.getDateValue();
                var df = new DecimalFormat(sett['FORMAT_MONEY_1']);
                if (kfldQry == -1) {
                    if (that2.frm.objs["qry1"].status != FormView.RecordStatus.EDIT)
                        setEnableMps(false);
                    else {
                        setEnableMps(true);
                        mp["trans_no"].setEditable(true);
                    }
                    mp["keyfld"].setValue(Util.getSQLValue("select nvl(max(keyfld),0)+1 from C7_POLANDCOST"));
                    mp["attachment"].setValue("");
                    mp["trans_no"].setValue(Util.getSQLValue("select nvl(max(trans_no),0)+1 from C7_POLANDCOST where pship_keyfld=" + cc));
                    mp["trans_date"].setDateValue(new Date(dt.toDateString()));
                    mp["landcost_code"].setValue("");
                    mp["landcostname"].setValue("");
                    mp["descra"].setValue("");
                    mp["descr"].setValue("");
                    mp["reference"].setValue("");
                    mp["vendor_ref"].setValue("");
                    mp["vendorname"].setValue("");
                    mp["amount"].setValue("0.000");
                    that2.view.byId("btSpendList" + that2.timeInLong).setText("New Spending..");
                } else {
                    if (that2.frm.objs["qry1"].status != FormView.RecordStatus.EDIT)
                        setEnableMps(false);
                    else {
                        setEnableMps(true);
                        mp["trans_no"].setEditable(false);
                    }
                    var dtx = Util.execSQLWithData("select *from C7_POLANDCOST where keyfld=" + kfldQry);
                    mp["keyfld"].setValue(dtx[0].KEYFLD);
                    mp["attachment"].setValue("");
                    mp["trans_no"].setValue(dtx[0].TRANS_NO);
                    mp["trans_date"].setDateValue(new Date(dtx[0].TRANS_DATE.replaceAll(".", ":")));
                    mp["landcost_code"].setValue(dtx[0].LANDCOST_CODE);
                    mp["landcostname"].setValue(Util.getSQLValue("select title from c7_pocostinfo where code='" + dtx[0].LANDCOST_CODE + "'"));
                    mp["descra"].setValue(dtx[0].DESCRA);
                    mp["descr"].setValue(dtx[0].DESCR);
                    mp["reference"].setValue(dtx[0].REFERENCE);
                    mp["vendor_ref"].setValue(dtx[0].VENDOR_REF);
                    mp["vendorname"].setValue(Util.getSQLValue("select name from c_ycust where code='" + dtx[0].VENDOR_REF + "'"));
                    mp["amount"].setValue(df.format(Util.extractNumber(dtx[0].AMOUNT)));
                    mp["expense_ac"].setValue(dtx[0].EXPENSE_AC);
                    mp["expensename"].setValue(Util.getSQLValue("select name from acaccount where accno='" + dtx[0].EXPENSE_AC + "'"));
                    mp["costcent"].setValue(dtx[0].COSTCENT);
                    mp["costcentname"].setValue(Util.getSQLValue("select title from accostcent1 where code='" + dtx[0].COSTCENT + "'"));
                    var des = 'NO# ' + dtx[0].TRANS_NO + ' ,' + mp["landcostname"].getValue() + ' , Amount # ' + Util.extractNumber(dtx[0].AMOUNT);
                    that2.view.byId("btSpendList" + that2.timeInLong).setText(des);
                }
                setTimeout(() => {
                    mp["trans_no"].focus();
                }, 100);
            }
            var validateBeforeSave = function () {
                checkEmptyVal(["trans_no", "trans_date", "landcost_code", "vendor_ref", "reference", "expense_ac", "expensename", "descr"]);
            }
            var delRec = function () {
                var sq = "";
                validateShipPo();
                Util.simpleConfirmDialog(Util.getLangText("Are you sure to delete ?"), function (oAction) {
                    if (kfldQsry != -1) {
                        Util.execSQL("delete from C7_POLANDCOST where keyfld=" + kfldQry);
                        FormView.msgCustom(Util.getLangText("msgDeleted"), "maroon");
                    }

                });
            }
            var insertOrUpd = function () {
                var sq = "";
                validateShipPo();
                validateBeforeSave();
                getDataLandcost();
                if (Util.extractNumber(getVal("amount")) <= 0) FormView.err("Amount can not have less then 0");
                var colval = {
                    "keyfld": "(select nvl(max(keyfld),0)+1 from C7_POLANDCOST)",
                    "pship_keyfld": cc,
                    "trans_no": Util.extractNumber(getVal("trans_no")), //"(select nvl(max(trans_no),0)+1 from C7_POLANDCOST where pship_keyfld=" + cc + ")",
                    "trans_date": Util.toOraDateString(getVal("trans_date")),
                    "landcost_code": Util.quoted(getVal("landcost_code")),
                    "descra": Util.quoted(getVal("descra")),
                    "descr": Util.quoted(getVal("descr")),
                    "reference": Util.quoted(getVal("reference")),
                    "vendor_ref": Util.quoted(getVal("vendor_ref")),
                    "amount": Util.extractNumber(getVal("amount")),
                    "expense_ac": Util.quoted(getVal("expense_ac")),
                    "costcent": Util.quoted(getVal("costcent")),
                    "CREATED_TIME": "SYSDATE",
                    "USERNM": Util.quoted(sett["LOGON_USER"]),
                    "MODIFIED_TIME": "SYSDATE",
                }
                if (kfldQry != -1) {
                    colval["keyfld"] = getVal("keyfld");
                    colval["trans_no"] = getVal("trans_no");
                    sq = UtilGen.getUpdateRowStringByObj("C7_POLANDCOST", colval, " keyfld=" + getVal("keyfld"));
                } else {
                    sq = UtilGen.getInsertRowStringByObj("C7_POLANDCOST", colval);
                }
                sq = "begin " + sq + "; C7_PO_SHIPCOST_JV(" + getVal("keyfld") + ") ; end; ";
                var dt = Util.execSQL(sq);
                if (dt.ret == "SUCCESS")
                    FormView.msgSuccess(Util.getLangText("msgSaved"));
                else FormView.err("err ! Not saved !");

            }
            var getDataLandcost = function (focusOnerr) {
                var pokeyfld = that2.frm.getFieldValue("qry1.po_keyfld");
                var sq = "select p.gr_ac,a.name acname from pord1 p,acaccount a,C7_POCOSTINFO i " +
                    "where gr_ac=a.accno and p.keyfld=" + pokeyfld +
                    " and i.code='" + getVal("landcost_code") + "'";

                // var dtxM = Util.execSQLWithData("select expense_ac,(select max(name) from acaccount where accno=C7_POCOSTINFO.expense_ac) exp_nm," +
                //     "(select max(title) from accostcent1 where code=C7_POCOSTINFO.costcent) cstname," +
                //     " costcent from C7_POCOSTINFO where code='" + getVal("landcost_code") + "'", "Data not found !");
                var dtxM = Util.execSQLWithData(sq);
                if (dtxM.length <= 0) {
                    if (Util.nvl(focusOnerr, false))
                        setTimeout(() => { mp["landcost_code"].setValue(""); mp["landcost_code"].focus(); }, 150);
                    FormView.err("no landcost code found !");
                }
                if (Util.nvl(dtxM[0].ACNAME, "") == "") {
                    if (Util.nvl(focusOnerr, false))
                        setTimeout(() => { mp["landcost_code"].focus(); }, 150);
                    FormView.err("no GR a/c  found !");
                }

                mp["expense_ac"].setValue(dtxM[0].GR_AC);
                mp["costcent"].setValue('');
                mp["costcentname"].setValue('');
                mp["expensename"].setValue(Util.nvl(dtxM[0].ACNAME, ""));
            }

            //Amount
            //keyfld                    attachment
            //trans_no                  trans_date
            //landcost_codd/name        reference
            //vendor_ref/name           amount
            //descr                     descra
            //----------------------------------


            //keyfld

            addFe(FormView.getFactoryControls.getGeneralControls(
                "keyfld", "", "keyId", "15%", "", "35%",
                {
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.LABEL,
                    display_style: "keyIdText",
                }));
            //attachment
            addFe(FormView.getFactoryControls.getGeneralControls(
                "attachment", "@", "Attachment", "15%", "", "35%",
                {
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
                {
                    showValueHelp: true,
                    valueHelpRequest: function (e) {
                        // if (frag.frm.objs["qry1"].status != FormView.RecordStatus.EDIT &&
                        //     frag.frm.objs["qry1"].status != FormView.RecordStatus.NEW)
                        //     return;
                        // UtilGen.Vouchers.attachShowUpload(frag);
                        sap.m.MessageToast.show("attached clicked....");
                    }
                }
            ));
            //trans_no
            addFe(FormView.getFactoryControls.getGeneralControls(
                "trans_no", "", "transNo", "15%", "", "35%",
                {
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
            ));
            //trans_date
            addFe(FormView.getFactoryControls.getGeneralControls(
                "trans_date", "@", "transDate", "15%", "", "35%",
                {
                    data_type: FormView.DataType.Date,
                    class_name: FormView.ClassTypes.DATEFIELD,
                },
            ));
            //landcost_code
            addFe(FormView.getFactoryControls.getGeneralControls(
                "landcost_code", "", "txtLandCostCode", "15%", "", "12%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
                {
                    showValueHelp: true,
                    change: function (e) {
                        var sq = "select title from C7_POCOSTINFO where code = :CODE";
                        UtilGen.Search.getLOVSearchField(sq, mp["landcost_code"], undefined, mp["landcostname"]);
                        getDataLandcost(true);

                    },
                    valueHelpRequest: function (e) {
                        UtilGen.Search.do_quick_search(e, this,
                            "select code, title from C7_POCOSTINFO  order by 1 ",
                            "select code, title from C7_POCOSTINFO where code=:CODE", mp["landcostname"], undefined, undefined, undefined);
                    }
                }
            ));
            //name
            addFe(FormView.getFactoryControls.getGeneralControls(
                "landcostname", "@", "", "1%", "", "22%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    keyboardFocus: false
                },
                { editable: false }
            ));
            //refefence
            addFe(FormView.getFactoryControls.getGeneralControls(
                "reference", "@", "referenceNo", "15%", "", "35%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
            ));
            //vendor_ref
            addFe(FormView.getFactoryControls.getGeneralControls(
                "vendor_ref", "", "txtSupplier", "15%", "", "12%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
                {
                    showValueHelp: true,
                    change: function (e) {
                        var sq = "select name from c_ycust where code = :CODE";
                        UtilGen.Search.getLOVSearchField(sq, mp["vendor_ref"], undefined, mp["vendorname"]);
                    },
                    valueHelpRequest: function (e) {
                        UtilGen.Search.do_quick_search(e, this,
                            "select code, name title from c_ycust where childcount=0 and flag=1 and issupp='Y' order by path ",
                            "select code, name title from c_ycust where childcount=0 and code=:CODE", mp["vendorname"], undefined, undefined, undefined);
                    }


                }
            ));
            //vendorname
            addFe(FormView.getFactoryControls.getGeneralControls(
                "vendorname", "@", "", "1%", "", "22%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    keyboardFocus: false
                },
                {
                    editable: false
                }
            ));
            //amount
            addFe(FormView.getFactoryControls.getGeneralControls(
                "amount", "@", "amountTxt", "15%", "", "35%",
                {
                    data_type: FormView.DataType.Number,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                    display_format: sett["FORMAT_MONEY_1"]

                },
            ));
            //descr
            addFe(FormView.getFactoryControls.getGeneralControls(
                "descr", "", "txtDescren", "15%", "", "35%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
            ));
            //descra
            addFe(FormView.getFactoryControls.getGeneralControls(
                "descra", "@", "txtDescrar", "15%", "", "35%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                },
            ));
            fe.push(Util.getLabelTxt("Acc Info", "100%", "#", "boldText sapUiSmallMarginTop sapUiSmallMarginBottom", "Center"));

            //expense_ac
            addFe(FormView.getFactoryControls.getGeneralControls(
                "expense_ac", "", "txtGrAc", "15%", "", "12%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                }, { editable: false }
            ));
            //expensename
            addFe(FormView.getFactoryControls.getGeneralControls(
                "expensename", "@", "", "1%", "", "22%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                }, { editable: false }
            ));
            //costcent
            addFe(FormView.getFactoryControls.getGeneralControls(
                "costcent", "@", "costCent", "15%", "", "12%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                }, { editable: false }
            ));
            //costcentname
            addFe(FormView.getFactoryControls.getGeneralControls(
                "costcentname", "@", "", "1%", "", "22%",
                {
                    data_type: FormView.DataType.String,
                    class_name: FormView.ClassTypes.TEXTFIELD,
                }, { editable: false }
            ));



            Util.navEnter(fe);
            loadData();

            var wdt = dlg.$().width() - 100;
            if (wdt > 800) wdt = 800;
            if (wdt < 200) wdt = 400;
            var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, { width: wdt + "px" }, "sapUiSizeCompact", "");
            pg.addHeaderContent(tb);
            pg.addContent(cnt);
        },
        showTripCmds: function () {
            var thatForm = this.thatForm;
            var view = thatForm.view;
            var vbHeader = thatForm.vbHeader;
            Util.destroyID("tripcmds" + thatForm.timeInLong, view);
            Util.destroyID("tripcmds_new" + thatForm.timeInLong, view);
            var pokeyfld = thatForm.frm.getFieldValue("qry1.po_keyfld");
            if (Util.nvl(pokeyfld, "") == "") return;
            var dtx = Util.execSQLWithData("select trip_no,keyfld from c7_purship where po_keyfld=" + pokeyfld + " order by trip_no");
            var bts = [];
            var podt = UtilGen.PurchaseOrderFunc.checkPOStatus(pokeyfld, false);

            for (var d = 0; d < dtx.length; d++)
                bts.push(new sap.m.ToggleButton({
                    text: "Trip # " + dtx[d].TRIP_NO,
                    customData: [{ key: dtx[d].KEYFLD }],
                    pressed: false,
                    press: function () {
                        var skf = this.getCustomData()[0].getKey();
                        thatForm.frm.setFieldValue('pac', skf);
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        thatForm.frm.loadData(undefined, FormView.RecordStatus.VIEW);
                        setTimeout(() => {
                            checkPressed();
                        });

                    }
                }));
            if (podt.ORD_FLAG == 2)
                bts.push(new sap.m.ToggleButton(view.createId("tripcmds_new" + thatForm.timeInLong), {
                    text: "New trip..",
                    customData: [{ key: -1 }],
                    pressed: false,
                    press: function () {
                        var pokeyfld = thatForm.frm.getFieldValue("qry1.po_keyfld");
                        if (Util.nvl(pokeyfld, -1) == -1)
                            FormView.err("Err !, No PO is assigned !");
                        thatForm.oController.poKeyFld = pokeyfld;
                        thatForm.frm.cmdButtons.cmdNew.firePress();
                        setTimeout(() => {
                            checkPressed();
                        });

                    }
                }));
            var hb = new sap.m.Toolbar(view.createId("tripcmds" + thatForm.timeInLong),
                {
                    content: bts
                });

            var checkPressed = function () {
                var bts = thatForm.view.byId("tripcmds" + thatForm.timeInLong).getContent();
                var newTrip = thatForm.view.byId("tripcmds_new" + thatForm.timeInLong);
                if (thatForm.frm.objs["qry1"].status == FormView.RecordStatus.NEW) {
                    for (var i in bts)
                        bts[i].setPressed(false);
                    newTrip.setPressed(true);
                    return;
                }
                var pokeyfld = thatForm.frm.getFieldValue("qry1.keyfld");
                for (var i in bts) {
                    var skf = bts[i].getCustomData()[0].getKey();
                    if (skf == pokeyfld)
                        bts[i].setPressed(true);
                    else
                        bts[i].setPressed(false);
                }
            }
            setTimeout(() => {
                checkPressed();
            });
            vbHeader.addItem(hb)
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



