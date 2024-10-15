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
                title: Util.getLangText("titPurOrd"),
                toolbarBG: "lightgreen",
                titleStyle: "titleFontWithoutPad2 violetText",
                formSetting: FormView.getDefaultHeadCSSAuto("jvForm", thatForm.isDialog),
                customDisplay: function (vbHeader) {
                    Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("rcvdTxt" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
                    Util.destroyID("cmdQE" + thatForm.timeInLong, thatForm.view);
                    var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText blinking");
                    var txt = new sap.m.Text(thatForm.view.createId("numtxt" + thatForm.timeInLong, { text: "" }));
                    var rtxt = new sap.m.Text(thatForm.view.createId("rcvdTxt" + thatForm.timeInLong, { text: "" }));
                    var hb = new sap.m.Toolbar({
                        content: [txt, rtxt, new sap.m.ToolbarSpacer(), txtMsg]
                    });
                    txt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
                    rtxt.addStyleClass("totalVoucherTxt titleFontWithoutPad");
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
                    }
                ],
                db: [
                    {
                        type: "query",
                        name: "qry1",
                        dml: "select *from pord1 where ord_code=" + thatForm.vars.vou_code + " and keyfld=:pac",
                        where_clause: " keyfld=':keyfld' ",
                        update_exclude_fields: ['keyfld', 'branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_exclude_fields: ['branchname', 'txt_empname', 'typename', 'txt_balance', 'cmdSOA'],
                        insert_default_values: {
                            "PERIODCODE": Util.quoted(sett["CURRENT_PERIOD"]),
                            "ORD_CODE": thatForm.vars.vou_code,
                            "modified_time": "sysdate",
                            "created_time": "sysdate",
                            "usernm": Util.quoted(sett["LOGON_USER"])

                        },
                        update_default_values: {
                            "modified_time": "sysdate"
                        },
                        table_name: "pord1",
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
                    if (qry.name == "qry1") {
                        that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        that.view.byId("rcvdTxt" + thatForm.timeInLong).setText("");
                        UtilGen.Search.getLOVSearchField("select name from salesp where no = :CODE ", qry.formview.objs["qry1.ord_empno"].obj, undefined, that.frm.objs["qry1.txt_empname"].obj);
                        var aproved = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + qry.formview.getFieldValue("keyfld"));
                        if (Util.nvl(aproved, 1) == 2) {
                            thatForm.view.byId("txtMsg" + thatForm.timeInLong).setText("PO is approved !");
                            var rcvd = Util.getSQLValue("select nvl(sum(tqty),0) from c_order1 where ord_code=11 and pord1_keyfld=" + qry.formview.getFieldValue("keyfld"));
                            var ordrd = Util.getSQLValue("select nvl(sum(ord_allqty),0) from pord2 where ord_code=11 and keyfld=" + qry.formview.getFieldValue("keyfld"));
                            var rcvdp = 0;
                            if (ordrd > 0) rcvdp = Math.round((100 / ordrd) * rcvdp);
                            thatForm.view.byId("rcvdTxt" + thatForm.timeInLong).setText("Recieved : " + rcvdp + " % ");
                        }


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
                        var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                        var ld = qry.obj.mLctb;
                        var rfr = ld.getFieldValue(rowno, "ORD_REFER");
                        var pos = ld.getFieldValue(rowno, "ORD_POS");
                        var dt = Util.execSQLWithData("select packd,unitd,pack from items where reference='" + rfr + "'", "Item # " + rfr + " not a valid !");
                        var sq = "update pord2 set ord_packd=':pkd',ord_unitd=':unitd' ,ord_pack=:pack , ord_allqty=(ord_pkqty*:pack)+ord_unqty,ORDEREDQTY=(ord_pkqty*:pack)+ord_unqty where keyfld=:kf and ord_pos=:pos "
                            .replaceAll(":pkd", dt[0].PACKD)
                            .replaceAll(":unitd", dt[0].UNITD)
                            .replaceAll(":pack", dt[0].PACK)
                            .replaceAll(":kf", kf)
                            .replaceAll(":pos", pos)
                        return sqlRow + ";" + sq;
                    }
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {

                        var objKf = thatForm.frm.objs["qry1.keyfld"].obj;
                        var newKf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from c7_purship");
                        var newKNo = Util.getSQLValue("select nvl(max(trip_no),0)+1 from c7_purship");
                        var dt = thatForm.view.today_date.getDateValue();
                        UtilGen.setControlValue(objKf, newKf, newKf, true);
                        UtilGen.setControlValue(thatForm.frm.objs["qry1.trip_no"].obj, newKNo, newKNo, true);
                        // qry.formview.setFieldValue("qry1.ord_date", new Date(dt.toDateString()), new Date(dt.toDateString()), true);

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

                    if (qry.name == "qry2" && qry.insert_allowed && ld != undefined && ld.rows.length == 0)
                        qry.obj.addRow();

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
                    var ordn = thatForm.frm.getFieldValue("qry1.ord_no");
                    var kf = thatForm.frm.getFieldValue("qry1.keyfld");
                    var sq2 = UtilGen.getInsertLogStr({
                        grpname: "PO_APPROVE",
                        tablename: "PORD1",
                        rec_stat: "INSERTED",
                        descr: "PO # " + ordn,
                        pvar1: ordn,
                        pvar2: "PO",
                        pvar3: kf,
                        notify_type: "PO_APPROVE"
                    }, "PO");
                    var sq3 = "update pord1 set ORDERDQTY=(select sum(ord_allqty) from pord2 where pord2.keyfld=':keyfld') where pord1.keyfld=':keyfld'; ";
                    sq3 = sq3.replaceAll(":keyfld", kf);
                    // var kf = frm.getFieldValue("qry1.keyfld");
                    // return sq + "update_dlv_add_amt(" + kf + ");";
                    return sq + sq2 + sq3;
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
                keyfld: FormView.getFactoryFields.getKeyFld(),
                attachment: FormView.getFactoryFields.getAttachMentField(thatForm, "@", "15%", "35%"),
                trip_no: FormView.getFactoryFields.getNumberInput(
                    "trip_no", "", "puShiptripno", "15%", "", "35%",
                    { edit_allowed: false })
                ,
                arrival_date_port: FormView.getFactoryFields.getDateInput(
                    "arrival_date_port", "@", "puShiparrivaldateport", "15%", "", "35%",
                    {}, {}),
                ship_type: FormView.getFactoryFields.getComboInput(
                    "ship_type", "", "puShipType",
                    "15%", "", "35%",
                    { list: "@land/Land,sea/Sea,air/Air" }, {}),
                ship_name: FormView.getFactoryFields.getGeneralField(
                    "ship_name", "@", "puShipName", "15%", "", "35%",
                    {}, {}),
                discharge_start_date: FormView.getFactoryFields.getDateInput(
                    "discharge_start_date", "", "puShipdischargestartdate", "15%", "", "35%",
                    {}, {}),
                discharge_end_date: FormView.getFactoryFields.getDateInput(
                    "discharge_end_date", "@", "puShipdischargeenddate", "15%", "", "35%",
                    {}, {}),
                sail_date: FormView.getFactoryFields.getDateInput(
                    "sail_date", "", "puShipsaildate", "15%", "", "35%",
                    {}, {}),
                ship_load: FormView.getFactoryFields.getGeneralField(
                    "ship_load", "@", "puShipshipload", "15%", "", "35%",
                    {}, {}),
                total_paths: FormView.getFactoryFields.getGeneralField(
                    "total_paths", "", "puShiptotalpaths", "15%", "", "35%",
                    {}, {}),
                unload_store: FormView.getFactoryFields.getGeneralField(
                    "unload_store", "@", "puShipunloadstore", "15%", "", "35%",
                    {}, {}),
                fresh_water: FormView.getFactoryFields.getGeneralField(
                    "fresh_water", "", "puShipfreshwater", "15%", "", "35%",
                    {}, {}),
                n_of_roads: FormView.getFactoryFields.getGeneralField(
                    "n_of_roads", "@", "puShipnofroads", "15%", "", "10%",
                    {}, {}),
                n_of_discharge: FormView.getFactoryFields.getGeneralField(
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
                            colname: "ORD_NO",
                        },
                        {
                            colname: "ORD_REF",
                        },
                        {
                            colname: "ORD_REFNM"
                        },
                        {
                            colname: 'KEYFLD',
                            return_field: "pac",
                        },


                    ],  // [{colname:'code',width:'100',return_field:'pac' }]
                    sql: "select ord_no,ord_date,ord_ref,ord_refnm,keyfld from pord1 o1 where ord_code =" + that2.vars.vou_code +
                        " order by o1.ord_date desc,ord_no desc",
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
                        if (that2.frm.objs["qry1"].status == FormView.RecordStatus.VIEW) {
                            var saleinv = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + that2.frm.getFieldValue("keyfld"));
                            if (Util.nvl(saleinv, 1) == 2) {
                                that2.view.byId("txtMsg" + that2.timeInLong).setText("Delivery is Approved !");
                                return false;
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
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://letter",
                                    text: Util.getLangText("Approve"),
                                    press: function () {
                                        that2.helperFunc.approved();
                                    }
                                }));

                            }
                            if (bts.length > 0) {
                                mnus.push(new sap.m.MenuItem({
                                    icon: "sap-icon://indent",
                                    text: Util.getLangText("quickEntries"),
                                    items: bts
                                }));
                            }


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
        approved: function () {
            var that2 = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var ordn = that2.frm.getFieldValue("qry1.ord_no");
            var kf = that2.frm.getFieldValue("qry1.keyfld");
            var flg = Util.getSQLValue("select ord_flag from pord1 where keyfld=" + kf);
            if (flg != 1 || (
                (that2.frm.objs["qry1"].status != FormView.RecordStatus.VIEW
                ))) { FormView.err("PO should either not approved or in VIEW MODE") };

            var sq = " begin " +
                " update pord1 set ord_flag=2,approved_by=:apr_by,approved_time=:apr_time where keyfld=" + kf + ";" +
                " update pord2 set ord_flag=2 where keyfld=" + kf +
                ";";
            sq += " end;"
            sq = sq.replaceAll(":apr_by", Util.quoted(sett["LOGON_USER"]))
                .replaceAll(":apr_time", "sysdate");
            var dt = Util.execSQL(sq);
            if (dt.ret == "SUCCESS") {
                FormView.msgSuccess(Util.getLangText("msgSaved"));
                that2.frm.setFieldValue('pac', Util.nvl(kf, ""));
                that2.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                that2.frm.loadData(undefined, FormView.RecordStatus.VIEW);
            }
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var flg = "";
            if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {

            }

            var cod = thatForm.frm.getFieldValue("qry1.ord_ref");
            var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where " + flg + " code='" + cod + "'");
            if (sqcnt == 0) FormView.err("Save Denied : Customer is invalid !");
            sqcnt = Util.getSQLValue("select nvl(count(*),0) from c_ycust where parentcustomer='" + cod + "'");
            if (sqcnt > 0) FormView.err("Save Denied : Parent customer not allowed !");


            // items
            var dup = {};
            var ld = thatForm.frm.objs["qry2"].obj.mLctb;
            thatForm.frm.objs["qry2"].obj.updateDataToTable();
            for (var i = 0; i < ld.rows.length; i++) {
                var rfr = ld.getFieldValue(i, "ORD_REFER");
                var pqty = ld.getFieldValue(i, "ORD_PKQTY");
                var pk = ld.getFieldValue(i, "ORD_PACK");
                var qty = ld.getFieldValue(i, "ORD_UNQTY");
                var pr = ld.getFieldValue(i, "SALE_PRICE");
                if (dup[rfr] != undefined)
                    FormView.err("Save Denied : Duplicate item entry # " + rfr);
                dup[rfr] = rfr;
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where parentitem='" + rfr + "'");
                if (cnt > 0)
                    FormView.err("Save Denied : Item " + rfr + " is a group item !");
                var cnt = Util.getSQLValue("select nvl(count(*),0) cnt from items where " + flg + " reference='" + rfr + "'");
                if (cnt == 0)
                    FormView.err("Save Denied: Item " + rfr + " is invalid entry !");
                if (pr < 0)
                    FormView.err("Save Denied: PRICE invalid value !");
                if (((qty) + (pqty * pk)) <= 0)
                    FormView.err("Save Denied: QTY invalid value !");
            }

        }
    }
    ,

    loadData: function () {
        var frag = this;
        if (Util.nvl(frag.oController.keyfld, "") != "") {
            frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld, ""));
            frag.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
            frag.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        } else {
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



