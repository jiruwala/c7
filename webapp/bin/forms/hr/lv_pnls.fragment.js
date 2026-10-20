sap.ui.jsfragment("bin.forms.hr.lv_pnls", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        that.helperFunc.init(this);
        this.isDialog = false;
        this.statusDescr = {
            "REQUEST": "Request",
            "APPROVED": "APPROVED",
            "ACTIVEE": "ACTIVE",
            "RETURNED": "RETURNED"
        };
        try {
            that.isDialog = (that.oController.getForm().getParent() instanceof sap.m.Dialog);
        } catch (e) { };
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });

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
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };

        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F4') { }
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }
        });

        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);
        }, 10);

        return this.joApp;
    },

    createView: function () {
        var that = this;
        var thatForm = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var view = this.view;

        // 1. Clean up all dynamically generated IDs
        Util.destroyID("cmdA" + this.timeInLong, this.view);
        Util.destroyID("balTitle" + this.timeInLong, this.view);
        Util.destroyID("balOpen" + this.timeInLong, this.view);
        Util.destroyID("balAccrued" + this.timeInLong, this.view);
        Util.destroyID("balTaken" + this.timeInLong, this.view);
        Util.destroyID("balOther" + this.timeInLong, this.view);
        Util.destroyID("balAvailable" + this.timeInLong, this.view);
        Util.destroyID("thisRequest" + this.timeInLong, this.view);
        Util.destroyID("projBalance" + this.timeInLong, this.view);
        Util.destroyID("balMsg" + this.timeInLong, this.view);
        Util.destroyID("botReqDays" + this.timeInLong, this.view);
        Util.destroyID("botPubHolidays" + this.timeInLong, this.view);
        Util.destroyID("botWeekOff" + this.timeInLong, this.view);
        Util.destroyID("botNetDays" + this.timeInLong, this.view);
        Util.destroyID("stepsCmds" + this.timeInLong, this.view);
        Util.destroyID("formPage" + this.timeInLong, this.view);

        UtilGen.clearPage(this.mainPage);

        // 2. Create the Main Layout Containers
        this.mainContainer = new sap.m.VBox({
            width: "100%",
            items: []
        }).addStyleClass("sapUiSmallMargin");

        this.topSection = new sap.m.HBox({
            width: "100%",
            justifyContent: "SpaceBetween",
            items: []
        }).addStyleClass("sapUiSmallMarginBottom");

        this.leftPanel = new sap.m.Panel({
            width: "64%",
            headerText: "Leave Request Details",
            expandable: false,
            content: []
        }).addStyleClass("sapUiNoContentPadding");

        this.rightPanel = new sap.m.Panel({
            width: "35%",
            headerText: "Leave Balance",
            expandable: false,
            content: []
        }).addStyleClass("sapUiNoContentPadding");

        this.bottomPanel = new sap.m.Panel({
            width: "100%",
            headerText: "Days Breakdown",
            expandable: false,
            content: []
        }).addStyleClass("sapUiNoContentPadding sapUiSmallMarginTop");

        // 3. Build the Right Panel (Balance UI)
        this._buildRightPanel();

        // 4. Build the Bottom Panel (Days Breakdown UI)
        this._buildBottomPanel();

        // 5. Create a Page inside leftPanel for FormView (required by FormView class)
        this.formPage = new sap.m.Page(this.view.createId("formPage" + this.timeInLong), {
            showHeader: false,
            enableScrolling: true
        }).addStyleClass("sapUiSizeCompact");

        this.leftPanel.addContent(this.formPage);

        // 6. Assemble the layout
        this.topSection.addItem(this.leftPanel);
        this.topSection.addItem(this.rightPanel);
        this.mainContainer.addItem(this.topSection);
        this.mainContainer.addItem(this.bottomPanel);

        this.mainPage.addContent(this.mainContainer);

        // 7. Initialize FormView
        var js = {
            form: {
                title: "",
                toolbarBG: "#fff0f5",
                formSetting: {
                    width: { "S": 600, "M": 800, "L": 800, "XL": 900 },
                    class: "strTvForm"
                },
                customDisplay: function (vbHeader) {
                    var hb = new sap.m.Toolbar(thatForm.view.createId("stepsCmds" + thatForm.timeInLong), { content: [] });
                    vbHeader.addItem(hb);
                },
                print_templates: [],
                events: thatForm.helperFunc.getEvents(),
                parameters: [{ para_name: "pac", data_type: FormView.DataType.String, value: "" }],
                db: [{
                    type: "query",
                    name: "qry1",
                    dml: "select *from c7hr_req_leave where keyfld=':pac'",
                    where_clause: " keyfld=':keyfld'",
                    update_exclude_fields: ["keyfld",],
                    insert_exclude_fields: [],
                    insert_default_values: {
                        "MODIFIED_TIME": "sysdate",
                        "MODIFIED_USER": Util.quoted(sett["LOGON_USER"]),
                        "FLAG": 1,
                        "STATUS": "'REQUEST'"
                    },
                    update_default_values: {},
                    table_name: "c7hr_req_leave",
                    edit_allowed: true,
                    insert_allowed: true,
                    delete_allowed: false,
                    fields: thatForm.helperFunc.getFields1()
                }],
                canvas: [],
                commands: thatForm.helperFunc.getCommands(),
                lists: thatForm.helperFunc.getLists(),
            }
        };

        this.frm = new FormView(this.formPage);
        this.frm.view = view;
        this.frm.pg = this.formPage;
        this.frm.parseForm(js);
        this.frm.createView();
    },

    _buildRightPanel: function () {
        var thatForm = this;

        function createRow(labelText, id, isBold, textColor) {
            var hbox = new sap.m.HBox({ justifyContent: "SpaceBetween", alignItems: "Center" }).addStyleClass("sapUiTinyMarginBottom");
            var lbl = new sap.m.Text({ text: labelText }).addStyleClass("sapUiTinyMarginEnd");
            var val = new sap.m.Text({ id: thatForm.view.createId(id + thatForm.timeInLong), text: "0.00", textAlign: "End" });
            if (isBold) val.addStyleClass("boldText");
            if (textColor) val.addStyleClass(textColor);
            hbox.addItem(lbl);
            hbox.addItem(val);
            return hbox;
        }

        var vbox = new sap.m.VBox({ width: "100%" }).addStyleClass("sapUiSmallMargin");

        this.balTitle = new sap.m.Title({ id: this.view.createId("balTitle" + this.timeInLong), text: "Annual Vacation Balance", level: "H4" }).addStyleClass("blueText sapUiSmallMarginBottom");

        vbox.addItem(this.balTitle);
        vbox.addItem(createRow("Opening Balance", "balOpen", false, ""));
        vbox.addItem(createRow("Accrued This Period", "balAccrued", false, ""));
        vbox.addItem(createRow("Leave Already Taken", "balTaken", false, ""));
        vbox.addItem(createRow("Other Approved Requests", "balOther", false, ""));

        vbox.addItem(new sap.m.ToolbarSpacer().addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"));

        var hboxAvail = new sap.m.HBox({ justifyContent: "SpaceBetween", alignItems: "Center" }).addStyleClass("sapUiTinyMarginBottom");
        hboxAvail.addItem(new sap.m.Text({ text: "Available Balance" }).addStyleClass("boldText"));
        this.availBalText = new sap.m.Text({ id: this.view.createId("balAvailable" + this.timeInLong), text: "0.00", textAlign: "End" }).addStyleClass("boldText blueText");
        hboxAvail.addItem(this.availBalText);
        vbox.addItem(hboxAvail);

        var hboxProj = new sap.m.HBox({ justifyContent: "SpaceBetween", alignItems: "Center" }).addStyleClass("sapUiTinyMarginBottom");
        hboxProj.addItem(new sap.m.Text({ text: "This Request" }));
        this.thisReqText = new sap.m.Text({ id: this.view.createId("thisRequest" + this.timeInLong), text: "0.00", textAlign: "End" }).addStyleClass("redText");
        hboxProj.addItem(this.thisReqText);
        vbox.addItem(hboxProj);

        var hboxProjBal = new sap.m.HBox({ justifyContent: "SpaceBetween", alignItems: "Center" }).addStyleClass("sapUiTinyMarginBottom");
        hboxProjBal.addItem(new sap.m.Text({ text: "Projected Balance" }).addStyleClass("boldText"));
        this.projBalText = new sap.m.Text({ id: this.view.createId("projBalance" + this.timeInLong), text: "0.00", textAlign: "End" }).addStyleClass("boldText");
        hboxProjBal.addItem(this.projBalText);
        vbox.addItem(hboxProjBal);

        this.balMsg = new sap.m.Text({ id: this.view.createId("balMsg" + this.timeInLong), text: "", wrapping: true }).addStyleClass("sapUiSmallMarginTop");
        vbox.addItem(this.balMsg);

        this.rightPanel.addContent(vbox);
    },

    _buildBottomPanel: function () {
        var thatForm = this;
        var hbox = new sap.m.HBox({ width: "100%", justifyContent: "SpaceAround", alignItems: "Center" }).addStyleClass("sapUiSmallMargin");

        function createBottomField(labelText, id) {
            var vbox = new sap.m.VBox({ alignItems: "Center" });
            vbox.addItem(new sap.m.Label({ text: labelText, labelFor: thatForm.view.createId(id + thatForm.timeInLong) }));
            var inp = new sap.m.Input({ id: thatForm.view.createId(id + thatForm.timeInLong), value: "0", editable: false, width: "120px", textAlign: "End" });
            vbox.addItem(inp);
            return vbox;
        }

        hbox.addItem(createBottomField("Request Days", "botReqDays"));
        hbox.addItem(createBottomField("Public Holidays", "botPubHolidays"));
        hbox.addItem(createBottomField("Weekly Off Days", "botWeekOff"));
        hbox.addItem(createBottomField("Net Leave Days", "botNetDays"));

        this.bottomPanel.addContent(hbox);
    },

    setFormEditable: function () { },

    loadData: function () {
        this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
    },

    helperFunc: {
        init: function (thatForm) {
            this.thatForm = thatForm;
        },
        getEvents: function () {
            var thatForm = this.thatForm;
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();

            return {
                afterExeSql: function (oSql) { },
                afterLoadQry: function (qry) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    if (qry.name == "qry1") {
                        if (that.view.byId("txtMsg" + thatForm.timeInLong)) {
                            that.view.byId("txtMsg" + thatForm.timeInLong).setText("");
                        }
                        thatForm.helperFunc.showStepsCommands();

                        var lvType = thatForm.frm.getFieldValue("qry1.lv_type");
                        if (lvType) {
                            thatForm.helperFunc.fetchAndDisplayBalance(lvType);
                        }
                    }
                },
                beforeLoadQry: function (qry, sql) { return sql; },
                afterSaveQry: function (qry) { },
                afterSaveForm: function (frm, nxtStatus) { },
                beforeSaveQry: function (qry, sqlRow, rowNo) {
                    qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    thatForm.helperFunc.beforeSaveValidateQry(qry);
                    return "";
                },
                afterNewRow: function (qry, idx, ld) {
                    if (qry.name == "qry1") {
                        var dt = (new Date()).setHours(0, 0, 0, 0);
                        that.frm.setFieldValue("pac", "", "", true);
                        that.frm.setFieldValue("qry1.lv_type", "AL", "AL", true);
                        var kf = Util.getSQLValue("select nvl(max(keyfld),0)+1 from C7HR_REQ_LEAVE");
                        that.frm.setFieldValue("qry1.lv_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.tot_wo", 0, 0, true);
                        that.frm.setFieldValue("qry1._tot_ph", 0, 0, true);
                        that.frm.setFieldValue("qry1._req_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.request_days", 0, 0, true);
                        that.frm.setFieldValue("qry1.start_date", dt, dt, true);
                        that.frm.setFieldValue("qry1.keyfld", kf, kf, true);
                        that.frm.setFieldValue("qry1._status", that.statusDescr["REQUEST"], that.statusDescr["REQUEST"], true);

                        thatForm.helperFunc.fetchAndDisplayBalance("AL");
                        thatForm.helperFunc.showStepsCommands();
                    }
                },
                beforeDeleteValidate: function (frm) {
                    var qry = that.frm.objs["qry1"];
                    if (qry.name == "qry1" && (qry.status == FormView.RecordStatus.EDIT) ||
                        (qry.status == FormView.RecordStatus.VIEW)) {
                        var valx = that.frm.getFieldValue("pac");
                        var no = that.frm.getFieldValue("qry1.keyfld");
                        var vldtt = Util.getSQLValue(
                            "select nvl(max(emp_cd),-1) from c7hr_emp where (" +
                            " sponsor_id=" + no + " ) "
                        );
                        if (Util.nvl(vldtt, -1) >= 0)
                            FormView.err("Err ! , Found in emp # " + vldtt);
                    }
                },
                beforeDelRow: function (qry, idx, ld, data) { },
                afterDelRow: function (qry, ld, data) { },
                onCellRender: function (qry, rowno, colno, currentRowContext) { },
                beforePrint: function (rptName, params) { return params; }
            };
        },

        getFields1: function () {
            var that = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();

            function getEmpCode(cod, nm) {
                var ordref = cod || "qry1.emp_code";
                var ordrefnm = nm || "qry1._pname";
                return FormView.getFactoryFields.getSettingsGeneral({
                    thatForm: that,
                    code: ordref,
                    name: ordrefnm,
                    sqlChange: "select name1 name from c7hr_emp where flag=1 and emp_cd = ':CODE'",
                    sqlList: "select emp_cd code,name1 title,name2 from c7hr_emp where  flag=1 order by emp_cd ",
                    sqlListChange: "select emp_cd code,name1 title from c7hr_emp where emp_cd=:CODE and flag=1",
                });
            }

            // IMPORTANT: Widths MUST match the original working code exactly to avoid "NaNpx" errors in FormView
            return {
                keyfld: FormView.getFactoryFields.getKeyFld("", "15%", "10%"),
                _status: FormView.getFactoryFields.getGeneralField(
                    "_status", "@", "currentStatus", "15%", "", "15%",
                    { require: false, edit_allowed: false, insert_allowed: false, display_style: "redText boldText" }, {}
                ),
                attachment: FormView.getFactoryFields.getGeneralField(
                    "attachment", "@", "Attachment", "15%", "", "35%",
                    { require: false, edit_allowed: true, insert_allowed: true, display_style: "" }, { showValueHelp: true }
                ),

                emp_code: FormView.getFactoryFields.getGeneralField(
                    "emp_code", "", "txtCode", "15%", "redText boldText", "35%",
                    { require: true, edit_allowed: true, insert_allowed: true, display_style: "redText boldText" }, getEmpCode()
                ),
                _pname: FormView.getFactoryFields.getGeneralField(
                    "_pname", "@", "", "0px", "", "50%",   // <-- RESTORED to 50%
                    { require: false, edit_allowed: false, insert_allowed: false }, {}
                ),

                lv_type: FormView.getFactoryFields.getComboField(
                    "lv_type", "", "lvType", "15%", "", "35%",
                    { list: "@AL/Annual Leave,CL/Casual Leave,SL/Sick Leave", require: true },
                    {
                        selectionChange: function () {
                            var lvType = that.frm.getFieldValue("qry1.lv_type");
                            thatForm.helperFunc.fetchAndDisplayBalance(lvType);
                        }
                    }
                ),
                request_days: FormView.getFactoryFields.getNumberField(
                    "request_days", "@", "lvRequestDays", "15%", "", "35%",
                    { require: true, edit_allowed: true, insert_allowed: true, display_style: "", display_format: "#,##0" },
                    {
                        change: function () {
                            var val = Util.extractNumber(this.getValue());
                            that.frm.setFieldValue("qry1._req_days", val, val, true);
                            var startdt = that.frm.getFieldValue("qry1.start_date");
                            that.frm.setFieldValue("qry1.end_date", null, null, true);
                            if (startdt) {
                                var endt = new Date(startdt.getTime() + (val * 86400000));
                                that.frm.setFieldValue("qry1.end_date", endt, endt, true);
                            }
                            var available = Util.extractNumber(thatForm.availBalText.getText()) || 0;
                            thatForm.helperFunc.calculateProjectedBalance(available);
                        }
                    }
                ),

                start_date: FormView.getFactoryFields.getDateField(
                    "start_date", "", "startDate", "15%", "", "35%",
                    { require: true, edit_allowed: true, insert_allowed: true },
                    {
                        change: function () {
                            var startdt = that.frm.getFieldValue("qry1.start_date");
                            if (startdt) {
                                var val = Util.extractNumber(that.frm.getFieldValue("qry1.request_days"));
                                var endt = new Date(startdt.getTime() + (val * 86400000));
                                that.frm.setFieldValue("qry1.end_date", endt, endt, true);
                            }
                            var available = Util.extractNumber(thatForm.availBalText.getText()) || 0;
                            thatForm.helperFunc.calculateProjectedBalance(available);
                        }
                    }
                ),
                end_date: FormView.getFactoryFields.getDateField(
                    "end_date", "@", "toDate", "15%", "", "35%",
                    { require: true, edit_allowed: false, insert_allowed: false }, {}
                ),

                addr_absent: FormView.getFactoryFields.getGeneralField(
                    "addr_absent", "", "txtAddr", "15%", "", "35%",
                    { require: false, edit_allowed: true, insert_allowed: true }, {}
                ),
                tel_absent: FormView.getFactoryFields.getGeneralField(
                    "tel_absent", "@", "txtTel", "15%", "", "35%",
                    { require: false, edit_allowed: true, insert_allowed: true }, {}
                ),

                contact_emp: FormView.getFactoryFields.getGeneralField(
                    "contact_emp", "", "contactEmp", "15%", "", "10%",
                    { require: false, edit_allowed: true, insert_allowed: true, display_style: "" },
                    getEmpCode("qry1.contact_emp", "qry1._cname")
                ),
                _cname: FormView.getFactoryFields.getGeneralField(
                    "_cname", "@", "", "0px", "", "25%",   // <-- RESTORED to 25%
                    { require: false, edit_allowed: false, insert_allowed: false }, {}
                ),
                supervisor_emp: FormView.getFactoryFields.getGeneralField(
                    "supervisor_emp", "@", "superVisor", "15%", "", "10%",
                    { require: false, edit_allowed: true, insert_allowed: true, display_style: "" },
                    getEmpCode("qry1.supervisor_emp", "qry1._sname")
                ),
                _sname: FormView.getFactoryFields.getGeneralField(
                    "_sname", "@", "", "0px", "", "25%",   // <-- RESTORED to 25%
                    { require: false, edit_allowed: false, insert_allowed: false }, {}
                ),

                remarks: FormView.getFactoryFields.getGeneralField(
                    "remarks", "", "txtRemark", "15%", "", "85%",
                    { require: false, edit_allowed: true, insert_allowed: true, display_style: "" }, {}
                ),

                inc_ph: FormView.getFactoryFields.getGeneralField(
                    "inc_ph", "", "incHRPH", "25%", "", "5%",
                    { class_name: FormView.ClassTypes.CHECKBOX, require: false, edit_allowed: true, insert_allowed: true, display_style: "", trueValues: ["Y", "N"] },
                    { trueValues: ["Y", "N"], change: function () { thatForm.helperFunc.calculateProjectedBalance(Util.extractNumber(thatForm.availBalText.getText()) || 0); } }
                ),
                inc_wo: FormView.getFactoryFields.getGeneralField(
                    "inc_wo", "@", "incHRWO", "25%", "", "5%",
                    { class_name: FormView.ClassTypes.CHECKBOX, require: false, edit_allowed: true, insert_allowed: true, display_style: "", trueValues: ["Y", "N"] },
                    { trueValues: ["Y", "N"], change: function () { thatForm.helperFunc.calculateProjectedBalance(Util.extractNumber(thatForm.availBalText.getText()) || 0); } }
                )
            };
        },

        fetchAndDisplayBalance: function (lvType) {
            var thatForm = this.thatForm;
            var empCode = thatForm.frm.getFieldValue("qry1.emp_code");
            if (!empCode) return;

            var title = "";
            var sql = "";
            var colOpen = "", colAccrued = "", colTaken = "", colOther = "";

            if (lvType === "AL") {
                title = "Annual Vacation Balance";
                colOpen = "AL_OPEN"; colAccrued = "AL_ACCRUED"; colTaken = "AL_TAKEN"; colOther = "AL_OTHER";
            } else if (lvType === "SL") {
                title = "Sick Leave Balance";
                colOpen = "SL_OPEN"; colAccrued = "SL_ACCRUED"; colTaken = "SL_TAKEN"; colOther = "SL_OTHER";
            } else {
                title = "Casual Leave Balance";
                colOpen = "CL_OPEN"; colAccrued = "CL_ACCRUED"; colTaken = "CL_TAKEN"; colOther = "CL_OTHER";
            }

            sql = "select " + colOpen + ", " + colAccrued + ", " + colTaken + ", " + colOther + " from c7hr_emp_leave_bal where emp_cd='" + empCode + "'";
            var data = Util.execSQLWithData(sql);

            var open = 0, accrued = 0, taken = 0, other = 0;
            if (data && data.length > 0) {
                open = Util.extractNumber(data[0][colOpen]) || 0;
                accrued = Util.extractNumber(data[0][colAccrued]) || 0;
                taken = Util.extractNumber(data[0][colTaken]) || 0;
                other = Util.extractNumber(data[0][colOther]) || 0;
            } else {
                open = (lvType === "AL") ? 30 : 5;
            }

            var available = open + accrued - taken - other;

            thatForm.balTitle.setText(title);
            thatForm.view.byId("balOpen" + thatForm.timeInLong).setText(open.toFixed(2));
            thatForm.view.byId("balAccrued" + thatForm.timeInLong).setText(accrued.toFixed(2));
            thatForm.view.byId("balTaken" + thatForm.timeInLong).setText(taken.toFixed(2));
            thatForm.view.byId("balOther" + thatForm.timeInLong).setText(other.toFixed(2));
            thatForm.availBalText.setText(available.toFixed(2));

            thatForm.helperFunc.calculateProjectedBalance(available);
        },

        calculateProjectedBalance: function (availableBalance) {
            var thatForm = this.thatForm;
            var reqDays = Util.extractNumber(thatForm.frm.getFieldValue("qry1.request_days")) || 0;

            thatForm.view.byId("botReqDays" + thatForm.timeInLong).setValue(reqDays);
            thatForm.view.byId("botNetDays" + thatForm.timeInLong).setValue(reqDays);

            var projected = availableBalance - reqDays;

            thatForm.thisReqText.setText(reqDays.toFixed(2));
            thatForm.projBalText.setText(projected.toFixed(2));

            if (projected < 0) {
                thatForm.projBalText.addStyleClass("redText").removeStyleClass("greenText");
                thatForm.balMsg.setText("⚠️ Insufficient balance. You have " + availableBalance.toFixed(2) + " days available, but " + reqDays.toFixed(2) + " days are requested.");
                thatForm.balMsg.addStyleClass("redText").removeStyleClass("greenText");
            } else {
                thatForm.projBalText.addStyleClass("greenText").removeStyleClass("redText");
                thatForm.balMsg.setText("ℹ️ You have enough balance for this request.");
                thatForm.balMsg.addStyleClass("greenText").removeStyleClass("redText");
            }
        },

        getCommands: function () {
            var that2 = this.thatForm;
            return [
                { name: "cmdSave", canvas: "default_canvas", onPress: function (e) { return true; } },
                { name: "cmdDel", canvas: "default_canvas" },
                { name: "cmdEdit", canvas: "default_canvas" },
                { name: "cmdNew", canvas: "default_canvas", title: "New..", onPress: function (e) { that2.frm.setFieldValue("pac", "", "", true); } },
                { name: "cmdList", canvas: "default_canvas", list_name: "list1" },
                {
                    name: "cmdClose", canvas: "default_canvas", title: "Close",
                    obj: new sap.m.Button({ icon: "sap-icon://decline", press: function () { that2.joApp.backFunction(); } })
                }
            ]
        },
        getLists: function () {
            var that2 = this.thatForm;
            return [
                {
                    name: 'list1', title: "List ", list_type: "sql",
                    cols: [
                        { colname: 'KEYFLD', return_field: "pac" },
                        { colname: "NAME1" },
                    ],
                    sql: `select l.keyfld,l.emp_code,e.name1,l.status,l.request_days,l.start_date,l.remarks 
                        from c7hr_req_leave l,c7hr_emp e where e.emp_cd=l.emp_code order by l.keyfld desc`,
                    afterSelect: function (data) {
                        that2.frm.loadData(undefined, "view");
                        return true;
                    }
                }
            ]
        },
        beforeSaveValidateQry: function (qry) {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var dtfmt = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var kf = thatForm.frm.getFieldValue("qry1.keyfld");

            var errObj = function (msg, obj) {
                var o = thatForm.frm.objs[obj].obj;
                UtilGen.errorObj(o, 3500);
                if (o instanceof sap.m.InputBase) o.focus();
                FormView.err(msg);
            };

            var validateEmp = function (fldAcc, pFlg) {
                var flg = Util.nvl(flg, "");
                var cod = thatForm.frm.getFieldValue(fldAcc);
                var sqcnt = Util.getSQLValue("select nvl(count(*),0) from c7hr_emp where " + flg + " emp_cd='" + cod + "'");
                if (sqcnt == 0) errObj("Save Denied : EMPLOYEE  is invalid OR NOT PRESENT !", fldAcc);
            }

            validateEmp("qry1.emp_code", " flag=1 ");
            if (thatForm.frm.getFieldValue("qry1.contact_emp")) validateEmp("qry1.contact_emp", " flag>0 ");
            if (thatForm.frm.getFieldValue("qry1.supervisor_emp", " flag>0 ")) validateEmp("qry1.supervisor_emp");

            var rd = Util.extractNumber(thatForm.frm.getFieldValue("qry1.request_days"));
            if (rd <= 0) errObj("Err! Invalid Days ! ", "qry1.request_days");

            var availableBal = Util.extractNumber(thatForm.availBalText.getText()) || 0;
            if (rd > availableBal) {
                FormView.err("Err! Insufficient leave balance. Available: " + availableBal + ", Requested: " + rd);
                return false;
            }

            var last_dt = Util.getSQLValue(("select c7hr_get_last_date_trans(':emp_code') " +
                "from dual ").replaceAll(":emp_code", thatForm.frm.getFieldValue("qry1.emp_code")));
            if (!last_dt) FormView.err("Err ! , no last day of attend or Join date found for this employee !")
            last_dt = new Date(last_dt.replaceAll(".", ":"));
            var sd = thatForm.frm.getFieldValue("qry1.start_date");
            if (!sd) FormView.err("Start Date must have value !");
            if (sd.getTime() <= last_dt)
                errObj("start date cant be less than attend or join day for this employee # " + dtfmt.format(last_dt), "qry1.start_date");

            var cntExistBefore = Util.getSQLValue(`select nvl(count(*),0) from 
                c7hr_req_leave where  status not in ('RETURNED') and keyfld!=:keyfld and emp_code=':emp' `
                .replaceAll(":keyfld", kf)
                .replaceAll(":emp", thatForm.frm.getFieldValue("qry1.emp_code")));
            if (cntExistBefore > 0) FormView.err("Err ! , this employee have alredy request before and may have not returned");
        },
        getEmpStatus: function (ec, showErrOnNotFlag) {
            var thatForm = this.thatForm;
            var flg = Util.getSQLValue("select flag from c7hr_emp where emp_cd='" + ec + "'");
            if (showErrOnNotFlag && flg != showErrOnNotFlag) FormView.err("Err ! , Employee status is invalid !");
            return flg;
        },
        queryStepsCommands: function () {
            var thatForm = this.thatForm;
            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW) return;

            var rectangleIcon = "sap-icon://" + Util.getLangDescrAR("arrow-right", "arrow-right");
            var acceptIcon = "sap-icon://accept";
            function cmdProps(enabled, icon, ...cmds) {
                for (var c in cmds) {
                    if (enabled) cmds[c].setEnabled(enabled);
                    if (icon) cmds[c].setIcon(icon);
                }
            };
            var kf = thatForm.frm.getFieldValue("qry1.keyfld");
            var cmdStepApprove = thatForm.view.byId("cmdStepApprove" + thatForm.timeInLong);
            var cmdStepActive = thatForm.view.byId("cmdStepActive" + thatForm.timeInLong);
            var cmdStepLeaveEnded = thatForm.view.byId("cmdStepLeaveEnded" + thatForm.timeInLong);

            cmdProps(false, rectangleIcon, cmdStepApprove, cmdStepActive, cmdStepLeaveEnded);

            var dtx = Util.execSQLWithData("select status,flag from c7hr_req_leave where keyfld=" + kf);
            var flg = Util.extractNumber(dtx[0].FLAG);
            var status = dtx[0].STATUS;
            if (flg != 2)
                switch (status) {
                    case "REQUEST":
                        cmdStepApprove.setEnabled(thatForm.helperFunc.canLeaveApprove());
                        break;
                    case "APPROVED":
                        cmdStepApprove.setIcon(acceptIcon);
                        cmdStepApprove.setEnabled(false);
                        cmdProps(true, undefined, cmdStepActive, cmdStepLeaveEnded);
                        break;
                    case "ACTIVE":
                        cmdStepLeaveEnded.setEnabled(true);
                        cmdProps(false, acceptIcon, cmdStepApprove, cmdStepActive);
                        break;
                    case "ENDLEAVE":
                        cmdProps(false, acceptIcon, cmdStepApprove, cmdStepActive, cmdStepLeaveEnded);
                        break;
                    default:
                        break;
                } else cmdProps(false, acceptIcon, cmdStepApprove, cmdStepActive, cmdStepLeaveEnded);
        },
        showStepsCommands: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var dtfmt = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var hb = thatForm.view.byId("stepsCmds" + thatForm.timeInLong);
            if (!hb) return;

            var rectangleIcon = "sap-icon://" + Util.getLangDescrAR("arrow-right", "arrow-right");
            var acceptIcon = "sap-icon://accept";
            hb.destroyContent();
            Util.destroyID("numtxt" + thatForm.timeInLong, thatForm.view);
            Util.destroyID("txtMsg" + thatForm.timeInLong, thatForm.view);
            var txtMsg = new sap.m.Text(thatForm.view.createId("txtMsg" + thatForm.timeInLong)).addStyleClass("redMiniText");

            if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW) {
                hb.addContent(new sap.m.ToolbarSpacer());
                hb.addContent(txtMsg);
                return;
            }

            var kf = thatForm.frm.getFieldValue("qry1.keyfld");
            var empcode = thatForm.frm.getFieldValue("qry1.emp_code");

            var doApprove = function () {
                if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW) return;
                Util.simpleConfirmDialog(Util.getLangText("msgApproveReqLeave"), function (oAction) {
                    thatForm.helperFunc.getEmpStatus(empcode, 1);
                    var sqCnt = Util.getSQLValue(`select max(keyfld) from c7hr_req_leave 
                        where keyfld!='`+ kf + `' and (flag=1 and status in ('REQUEST','APPROVED','ACTIVE'))
                         and emp_code='`+ empcode + `'`);
                    if (sqCnt) FormView.err("Request or Active leave existed ! keyid # " + sqcnt);
                    var sql = (`begin 
                            update c7hr_req_leave set status='APPROVED', APPROVED_BY=':USER' ,
                                APPROVED_TIME=SYSDATE WHERE KEYFLD=:KEYFLD ; 
                        END;`).replaceAll(":USER", sett["LOGON_USER"])
                        .replaceAll(":KEYFLD", kf);
                    var dt = Util.execSQL(sql);
                    if (dt.ret == "SUCCESS") {
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        FormView.msgSuccess(Util.getLangText("msgSaved"));
                    }
                });
            }

            var doActiveLeave = function () {
                if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW) return;
                Util.simpleConfirmDialog(Util.getLangText("msgActiveLeave"), function (oAction) {
                    thatForm.helperFunc.getEmpStatus(empcode, 1);
                    var sqCnt = Util.getSQLValue(`select max(keyfld) from c7hr_req_leave 
                        where keyfld!='`+ kf + `' and (flag=1 and status in ('REQUEST','APPROVED','ACTIVE'))
                         and emp_code='`+ empcode + `'`);
                    if (sqCnt) FormView.err("Request or Active leave existed ! keyid # " + sqcnt);

                    var last_dt = Util.getSQLValue(("select c7hr_get_last_date_trans(':emp_code') " +
                        "from dual ").replaceAll(":emp_code", thatForm.frm.getFieldValue("qry1.emp_code")));
                    if (!last_dt) FormView.err("Err ! , no last day of attend or Join date found for this employee !")
                    last_dt = new Date(last_dt.replaceAll(".", ":"));

                    var sd = thatForm.frm.getFieldValue("qry1.start_date");
                    if (!sd) FormView.err("Start Date must have value !");
                    last_dt.setHours(0, 0, 0, 0);
                    sd.setHours(0, 0, 0, 0)
                    if (sd.getTime() != (last_dt.getTime() + 86400000))
                        FormView.err("Last day is " + dtfmt.format(last_dt) + " and start date is # " + dtfmt.format(sd));
                    var sql = (`begin 
                        update c7hr_req_leave set status='ACTIVE', ACTIVATE_BY=':USER' ,
                            ACTIVATE_TIME=SYSDATE WHERE KEYFLD=:KEYFLD ; 
                        UPDATE C7HR_EMP SET FLAG=2 WHERE EMP_CD=':EMP';                   
                        c7hr_lv_insert(:KEYFLD);
                     END;`).replaceAll(":EMP", empcode)
                        .replaceAll(":USER", sett["LOGON_USER"])
                        .replaceAll(":KEYFLD", kf);
                    var dt = Util.execSQL(sql);
                    if (dt.ret == "SUCCESS") {
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        FormView.msgSuccess(Util.getLangText("msgSaved"));
                    }
                });
            };

            var doLeaveEnd = function () {
                if (thatForm.frm.objs["qry1"].status != FormView.RecordStatus.VIEW) return;
                thatForm.helperFunc.getEmpStatus(empcode, 2);
                var do_save = function () {
                    thatForm.helperFunc.getEmpStatus(empcode, 2);
                    var sq = (`begin 
                               update c7hr_req_leave set status='ENDLEAVE' where keyfld=:keyfld ; 
                              update c7hr_emp set flag=1 where emp_cd=':empcode';
                              end;
                              `)
                        .replaceAll(":keyfld", kf)
                        .replaceAll(":empcode", empcode);
                    var dt = Util.execSQL(sq);
                    if (dt.ret == "SUCCESS") {
                        thatForm.frm.setQueryStatus(undefined, FormView.RecordStatus.VIEW);
                        FormView.msgSuccess(Util.getLangText("msgSaved"));
                        dlg.close();
                    }
                };
                var dtReturn = new sap.m.Datepicker({
                    valueFormat: sett["ENGLISH_DATE_FORMAT"],
                    displayFormat: sett["ENGLISH_DATE_FORMAT"],
                    editable: false,
                    width: "70%"
                });
                var dtRemarks = new sap.m.Input({ width: "70%" });
                var dt = Util.getSQLValue("select to_char(end_date,'mm/dd/rrrr') from c7hr_req_leave where keyfld=" + kf);
                dtReturn.setDateValue(new Date(dt));
                var fe = [
                    Util.getLabelTxt("Enter Return", "100%", "#", "redText", "Begin"),
                    Util.getLabelTxt("Return Date", "30%", ""), dtReturn,
                    Util.getLabelTxt("Remarks", "30%", ""), dtRemarks,
                ];
                var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                    width: "300px",
                    cssText: ["padding-left:5px ;" + "padding-top:3px;" + "border-style: groosve;" + "margin-left: 1%;" + "margin-right: 1%;" + "border-radius:20px;" + "margin-top: 3px;"]
                }, "sapUiSizeCompact", "");

                var dlg = new sap.m.Dialog({
                    title: Util.getLangText("Leave End"),
                    contentWidth: "350px",
                    contentHeight: "250px",
                    content: cnt,
                    buttons: [
                        new sap.m.Button({ text: Util.getLangText("saveTxt"), press: function () { do_save(); } }),
                        new sap.m.Button({ text: Util.getLangText("closeTxt"), press: function () { dlg.close(); } })
                    ]
                });
                dlg.open();
            }

            var stepPress = function (e) {
                var cmd = e.getSource();
                var stp = cmd.getCustomData()[0].getKey();
                switch (stp) {
                    case "cmdStepApprove": doApprove(); break;
                    case "cmdStepActive": doActiveLeave(); break;
                    case "cmdStepLeaveEnded": doLeaveEnd(); break;
                    default: break;
                }
            };

            hb.addContent(new sap.m.Button(thatForm.view.createId("cmdStepApprove" + thatForm.timeInLong), {
                icon: rectangleIcon, text: Util.getLangText("poApprove"), press: stepPress, enabled: false, customData: { key: "cmdStepApprove" },
            }));
            hb.addContent(new sap.m.Button(thatForm.view.createId("cmdStepActive" + thatForm.timeInLong), {
                icon: rectangleIcon, text: Util.getLangText("leaveStepActive"), press: stepPress, enabled: false, customData: { key: "cmdStepActive" },
            }));
            hb.addContent(new sap.m.Button(thatForm.view.createId("cmdStepLeaveEnded" + thatForm.timeInLong), {
                icon: rectangleIcon, text: Util.getLangText("stepLeaveEnded"), press: stepPress, enabled: false, customData: { key: "cmdStepLeaveEnded" },
            }));
            hb.addContent(new sap.m.ToolbarSpacer());
            hb.addContent(txtMsg);
            thatForm.helperFunc.queryStepsCommands();
        },
        canLeaveApprove: function () {
            var thatForm = this.thatForm;
            var sett = sap.ui.getCore().getModel("settings").getData();
            return (Util.nvl(sett["HR_APPROVE_LEAVE"], "FALSE") == "TRUE");
        }
    }
});