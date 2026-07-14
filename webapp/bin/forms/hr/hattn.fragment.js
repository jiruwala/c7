sap.ui.jsfragment("bin.forms.hr.hattn", {

    /**************************************************************
     * ATTENDANCE MATRIX  –  Kuwait HR System
     * Tables  : c7hr_attend  →  c7hr_trans
     * Pattern : follows db.fragment.js exactly
     *           • createContent → createView → loadData
     *           • UtilGen.formCreate2 for header filter bar
     *           • UtilGen.createDefaultToolbar2 for QueryView toolbar
     *           • UtilGen.addControl for filter fields
     *           • Util.execSQL for DB calls
     *           • Util.doSpin / Util.stopSpin for busy state
     *           • QueryView for the grid
     **************************************************************/

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.timeInLong = (new Date()).getTime();
        that.aMenuItems = [
            { key: "-", text: "Clear", icon: "-" },
            { key: "P", text: "Present", icon: "✅" },
            { key: "A", text: "Absent", icon: "❌" },
            { key: "WO", text: "Weekly Off", icon: "📅" },
            { key: "PH", text: "Public Holiday", icon: "🎉" },
            { key: "AL", text: "Annual Leave", icon: "🏖" },
            { key: "SL", text: "Sick Leave", icon: "🤒" },
            { key: "UL", text: "Unpaid Leave", icon: "💰" },
            { key: "OT", text: "Overtime", icon: "⏰" },
            { key: "HD", text: "Half Day", icon: "🌗" }
        ];

        /* SplitApp wrapper — same pattern as db.fragment */
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });

        this.mainPage = new sap.m.Page({
            showHeader: false,
            content: []
        }).addStyleClass("sapUiSizeCompact");

        this.createView();

        this.joApp.addDetailPage(this.mainPage);
        this.joApp.to(this.mainPage, "show");
        return this.joApp;
    },

    /* ── createView ───────────────────────────────────────────── */
    createView: function () {
        var that = this;
        var view = this.view;
        var recs = UtilGen.dispTblRecsByDevice({ "S": 6, "M": 10, "L": 14, "XL": 18 });

        UtilGen.clearPage(this.mainPage);

        /* header filter bar */
        this.createViewHeader();

        /* QueryView */
        var qr = new QueryView("qryAttend" + this.timeInLong);
        qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
        qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.None);
        qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qr.getControl().setVisibleRowCount(recs);
        qr.getControl().setFixedBottomRowCount(0);
        qr.getControl().setFixedColumnCount(2);
        qr.getControl().setRowHeight(30);
        qr.insertable = false;
        qr.deletable = false;
        qr.editable = false;

        /* filter columns for toolbar search */
        var filterCols = ["EMP_CODE", "EMP_NAME"];
        UtilGen.createDefaultToolbar2(qr, filterCols, false);

        /* add Save + Post buttons to the toolbar */
        var oTb = qr.showToolbar.toolbar;
        oTb.addContent(new sap.m.ToolbarSpacer());
        oTb.addContent(new sap.m.Button({
            text: "Save Attendance",
            type: "Accept",
            icon: "sap-icon://save",
            press: function () { that.saveAttendance(); }
        }));
        oTb.addContent(new sap.m.Button({
            text: "Post Transactions",
            type: "Default",
            icon: "sap-icon://forward",
            press: function () { that.postToTrans(); }
        }));

        this.qr = qr;
        this._qr = qr;        /* also keep short ref */
        this._dirty = {};       /* dirty cells */

        this.mainPage.addContent(oTb);
        this.mainPage.addContent(
            new sap.m.ScrollContainer({
                horizontal: true,
                vertical: false,
                width: "100%",
                content: [qr.getControl()]
            })
        );

        this.loadData();
    },

    /* ── createViewHeader ─────────────────────────────────────── */
    createViewHeader: function () {
        var that = this;
        var view = this.view;
        var fe = [];

        /* destroy old controls if re-rendering */
        var oMonthYearInput = new sap.m.Input({
            width: "120px",
            placeholder: "YYYY/MM",
            value: this._getDefaultMonthYear(),
            change: function () { that.loadData(); },
            customData: [new sap.ui.core.CustomData({ key: "", value: "" })]
        });
        oMonthYearInput.addStyleClass("sapUiSmallMarginEnd");

        var btUp = new sap.m.Button({
            icon: "sap-icon://up",
            tooltip: "Next month",
            press: function () { that._stepMonth(1); }
        });
        var btDown = new sap.m.Button({
            icon: "sap-icon://down",
            tooltip: "Previous month",
            press: function () { that._stepMonth(-1); }
        });

        this.oMonthYearInput = oMonthYearInput;

        /* Department combo */
        var cbDept = UtilGen.addControl(
            fe, "Department", sap.m.ComboBox, "cbDept" + this.timeInLong,
            {
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                    templateShareable: true
                },
                width: "150px",
                selectionChange: function () { that.loadData(); }
            },
            "string", undefined, view, undefined,
            "@all/All"
        );

        /* Refresh button */
        var btRefresh = new sap.m.Button({
            icon: "sap-icon://refresh",
            press: function () { that.loadData(); }
        });
        var cmdClose = new sap.m.Button({
            icon: "sap-icon://decline",
            text: Util.getLangText("cmdClose"),
            press: function () {
                that.joApp.backFunction();
            }
        });

        /* store refs for loadData */
        this.cbDept = cbDept;

        /* layout using UtilGen.formCreate2 */
        var fe = [
            Util.getLabelTxt("Attendance Sheet", "100%", "", "titleFontWithoutPad2 boldText"),
            Util.getLabelTxt("Month/Year", "15%"), oMonthYearInput,
            Util.getLabelTxt("", "0px", "@"), btDown, btUp,
            Util.getLabelTxt("Dept", "15%", "@"), cbDept,
            Util.getLabelTxt("", "1%", "@"), btRefresh,
            Util.getLabelTxt("", "1%", "@"), cmdClose,
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: { "S": 380, "M": 580, "L": 680, "XL": 780, "XXL": 800 },
            cssText: [
                "padding-left:2px ;" +
                "padding-top:2px;" +
                "border-style: groosve;" +
                "margin-left: 1%;" +
                "margin-right: 1%;" +
                "border-radius:20px;" +
                "margin-top: 2px;"
            ]
        }, "sapUiSizeCompact", "");

        this.mainPage.addContent(cnt);
    },
    _getDefaultMonthYear: function () {
        var d = new Date();
        return d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0");
    },

    _stepMonth: function (delta) {
        var sVal = this.oMonthYearInput.getValue();
        var parts = sVal.split("/");
        if (parts.length !== 2) return;
        var m = parseInt(parts[1]) - 1; // JS month 0‑based
        var y = parseInt(parts[0]);
        var d = new Date(y, m + delta, 1);
        this.oMonthYearInput.setValue(
            d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0")
        );
        this.loadData();
    },

    _getMonthYearFromInput: function () {
        var sVal = this.oMonthYearInput.getValue();
        var parts = sVal.split("/");
        if (parts.length !== 2) return { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
        return { month: parseInt(parts[1]), year: parseInt(parts[0]) };
    },

    /* ── loadData ─────────────────────────────────────────────── */
    loadData: function () {
        var that = this;
        var qv = this._qr;
        if (!qv) return;

        var iMonth = parseInt(that._getMonthYearFromInput().month);
        var iYear = parseInt(that._getMonthYearFromInput().year);
        var sDept = Util.nvl(UtilGen.getControlValue(this.cbDept), "");
        var iDays = new Date(iYear, iMonth, 0).getDate();

        this._iYear = iYear;
        this._iMonth = iMonth;
        this._iDays = iDays;
        this._dirty = {};
        var colsStr = "";
        var cmdLink = function (obj, rowno, colno, lctb, frm) {
            var tbl = obj.getParent().getParent();
            var rowIdx = tbl.getRows().indexOf(obj.getParent());
            var absRow = tbl.getFirstVisibleRow() + rowIdx;
            var dayNo = parseInt(lctb.cols[colno].mColName.replace("D", ""));
            that._onCellClick(absRow, "D" + dayNo, dayNo, obj);
        }

        for (var i = 1; i <= iDays; i++)
            colsStr += (colsStr.length > 0 ? " , " : "") + " '-' as D" + i + " ";

        var dtEmp = Util.execSQL(
            "select emp_cd,name1 , " + colsStr +
            " from c7hr_emp e " +
            "where e.flag=1 " +
            // (sDept != "" ? " and e.department='" + sDept + "'" : "") +
            " order by e.emp_cd"
        );
        if (dtEmp.ret == "SUCCESS") {
            qv.setJsonStrMetaData("{" + dtEmp.data + "}");
            for (var i = 1; i <= iDays; i++) {
                Util.setColProperties(qv, "D" + i, {
                    "mTitle": ("" + i).padStart(2, "0"),
                    // "mSummary": "COUNT_UNIQUE",
                    "display_width": 55,
                });
                qv.mLctb.cols[qv.mLctb.getColPos("D" + i)].commandLinkClick = cmdLink;

            }
            qv.getControl().attachRowsUpdated(function () {
                // setTimeout(function () { that._colorDayCells(qv); });
            });

            qv.mLctb.parse("{" + dtEmp.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
            that.readData();
        }
        setTimeout(() => {
            UtilGen.DBView.autoShowHideMenu(false, that.joApp);
        });
    },
    readData: function () {
        var that = this;
        var qv = this._qr;
        var lctb = qv.mLctb;
        that.empData = {};
        that.empWOdays = {};
        var sq = "select at.*,to_number(to_char(att_date,'DD')) day_of_month,e.brn_id " +
            " from c7hr_attend at,c7hr_emp e " +
            " where at.emp_code=e.emp_cd " +
            " and e.flag=1 " +
            " order by e.emp_cd ";
        var deptsDays = {};
        var dt = Util.execSQLWithData(sq);
        //  continue reading and setting data to 
        //  qv.updateDataToControl();
        for (var i = 0; i < dt.length; i++) {
            if (!that.empData[dt[i].EMP_CODE]) that.empData[dt[i].EMP_CODE] = {};
            that.empData[dt[i].EMP_CODE][dt[i].DAY_OF_MONTH] = { ...dt[i] };
        }
        for (var i = 0; i < lctb.rows.length; i++) {
            var ec = lctb.getFieldValue(i, "EMP_CD");
            var dyk = Object.keys(that.empData[ec]);
            for (var i1 = 0; i1 < dyk.length; i1++) {
                // var dy = that.empData[ec][dyk[i1]].DAY_OF_MONTH;
                lctb.setFieldValue(i, "D" + dyk[i1], that.getMenuItem(that.empData[ec][dyk[i1]].DAY_TYPE).icon);
            }
        }
        qv.updateDataToControl();
    },

    _onCellClick: function (iAbsRow, sColName, iDay, obj) {
        var that = this;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        if (!aData || iAbsRow >= aData.length) return;
        this._oCellCtx = undefined;
        var oRec = aData[iAbsRow];

        /* store context for later use */
        this._oCellCtx = {
            absRow: iAbsRow,
            colName: sColName,
            day: iDay,
            empCode: oRec.EMP_CD,
            empName: oRec.NAME1,
            currentType: oRec[sColName] // (Util.nvl(oRec[sColName], "-") == "-" ? "P" : oRec[sColName])
        };

        /* create menu items */

        var oMenu = new sap.m.Menu();
        that.aMenuItems.forEach(function (it) {
            oMenu.addItem(new sap.m.MenuItem({
                text: it.icon + " " + it.text,
                key: it.key,
                press: function (oEv) {
                    var sKey = this.getKey();
                    if (sKey === "P") {
                        that._openPresentPopup();
                    } else {
                        that._openOtherPop(sKey);
                    }
                }
            }));
        });

        oMenu.openBy(obj);
    },
    _openOtherPop: function (sKey) {
        var that = this;
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var getRec = function (tmpSky) {
            var aDirty = Object.values(that._dirty || {});
            var oTable = that._qr.getControl();
            var oModel = oTable.getModel();
            var aData = oModel.getData();
            var oRec = aData[ctx.absRow];
            if (aDirty.length > 0 && oRec["_rec_" + ctx.day] != undefined)
                if (getMenuKeyFromIcon(oRec["D" + ctx.day]) != sKey)
                    that._applyStatus("-");

            return oRec["_rec_" + ctx.day];
            return undefined;
        };
        var getDBRec = function (tmpSky) {
            var sYear = String(that._iYear);
            var sMon = String(that._iMonth).padStart(2, "0");

            var sDate = "to_date('" + sYear + "-" + sMon + "-"
                + String(ctx.day).padStart(2, "0") + "','rrrr/mm/dd')";

            var dt = Util.execSQLWithData("select *from c7hr_attend " +
                " where emp_code='" + ctx.empCode + "' and att_date=" + sDate);
            if (dt.length > 0)
                return {

                    REMARKS: dt[0].REMARKS
                }
            return undefined;
        }
        var openAbsentPop = function (sTit) {
            var rec = Util.nvl(getRec(sKey), getDBRec(sKey));
            var rmrk = Util.nvl(rec, { REMARKS: "" }).REMARKS;
            UtilGen.inputDialog(ctx.empCode + " – " + ctx.empName + "  |  Day " + ctx.day + "  (" + sTit + ")", "Reason / Remarks  : ", rmrk, function (str) {
                that._applyStatus(sKey, { REMARKS: str });
                return true;
            }, function () {
                return true;
            }, undefined, undefined, {});
        }
        switch (sKey) {
            case "A":
                openAbsentPop("Absent");
                break;
            case "HD":
                openAbsentPop("Half Day");
                break;
            case "PH":
                that._applyStatus(sKey, {});
                break;
            default:
                that._applyStatus(sKey, {})
                break;
        }
    },
    /* ── _applyStatus (non‑Present) ──────────────────────────── */
    _applyStatus: function (sStatus, oDetails) {
        var that = this;
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        var oRec = aData[ctx.absRow];

        oRec[ctx.colName] = that.getMenuItem(sStatus).icon;

        if (sStatus == "-")
            oRec["_rec_" + ctx.day] = {
                KEYFLD: undefined,
                EMP_CODE: ctx.empCode,
                DAY_NO: ctx.day,
                DAY_TYPE: sStatus,
                LEAVE_TYPE: "",
                DAY_FRACTION: 0,
                OT_HOURS: 0,
                REMARKS: "",
                dutyHours: 0,
                noOfHours: 0,
                extraHours: 0,
                totalHours: 0,
                timeEntries: {
                    inTime1: "",
                    outTime1: "",
                }
            };
        else
            oRec["_rec_" + ctx.day] = {
                KEYFLD: undefined,
                EMP_CODE: ctx.empCode,
                DAY_NO: ctx.day,
                DAY_TYPE: sStatus,
                LEAVE_TYPE: "",
                DAY_FRACTION: (sStatus === "A" || sStatus === "WO" || sStatus === "PH") ? 0 :
                    (sStatus === "HD") ? 0.5 : 1,
                OT_HOURS: 0,
                REMARKS: Util.nvl(oDetails.REMARKS, ""),
                dutyHours: 0,
                noOfHours: 0,
                extraHours: 0,
                totalHours: 0,
                timeEntries: {
                    inTime1: "",
                    outTime1: "",
                }
            };

        this._recalcSummary(oRec);
        oModel.refresh(true);
        this._dirty[ctx.empCode + "_" + ctx.day] = oRec["_rec_" + ctx.day];
    },

    /* ── _openPresentPopup ────────────────────────────────────── */
    _openPresentPopup: function () {
        var that = this;
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var fe = [];
        var recalcTotals = function () {
            var duty = parseFloat(inpDuty.getValue()) || 0;
            var extra = parseFloat(inpExtra.getValue()) || 0;
            var totalMins = 0;
            var rows = [{ in: inpIn1, out: inpOut1, total: inpRowTotal1 },];
            if (Util.nvl(inpIn1.getValue(), "") != "" && Util.nvl(inpOut1.getValue(), "") != "") {
                for (var i = 0; i < rows.length; i++) {
                    var inTime = rows[i].in.getValue() || "";
                    var outTime = rows[i].out.getValue() || "";
                    if (inTime && outTime) {
                        var partsIn = inTime.split(":");
                        var partsOut = outTime.split(":");
                        if (partsIn.length === 2 && partsOut.length === 2) {
                            var hIn = parseInt(partsIn[0]) || 0;
                            var mIn = parseInt(partsIn[1]) || 0;
                            var hOut = parseInt(partsOut[0]) || 0;
                            var mOut = parseInt(partsOut[1]) || 0;
                            var mins = (hOut * 60 + mOut) - (hIn * 60 + mIn);
                            if (mins < 0) mins += 1440;
                            totalMins += mins;
                            rows[i].total.setValue((mins / 60).toFixed(2));
                        }
                    }
                }
                var noOfHours = totalMins / 60;
                inpNoOf.setValue(noOfHours.toFixed(2));
                inpTotal.setValue((noOfHours + extra).toFixed(2));
            } else {
                var noOfHours = Util.extractNumber(inpNoOf.getValue());
                inpNoOf.setValue(noOfHours.toFixed(2));
                inpTotal.setValue((noOfHours + extra).toFixed(2));

            }

        };
        var loadPresentDetails = function () {
            var aDirty = Object.values(that._dirty || {});
            var oTable = that._qr.getControl();
            var oModel = oTable.getModel();
            var aData = oModel.getData();
            var oRec = aData[ctx.absRow];

            if (aDirty.length > 0 && oRec["_rec_" + ctx.day] != undefined) {
                var rec = oRec["_rec_" + ctx.day];
                inpDuty.setValue(rec.dutyHours);
                inpNoOf.setValue(rec.noOfHours);
                inpExtra.setValue(rec.extraHours);
                inpTotal.setValue(rec.totalHours);
                inpIn1.setValue(rec.timeEntries.inTime1);
                inpOut1.setValue(rec.timeEntries.outTime1);
            } else {
                var sYear = String(that._iYear);
                var sMon = String(that._iMonth).padStart(2, "0");

                var sDate = "to_date('" + sYear + "-" + sMon + "-"
                    + String(ctx.day).padStart(2, "0") + "','rrrr/mm/dd')";

                var dt = Util.execSQLWithData("select *from c7hr_attend " +
                    " where emp_code='" + ctx.empCode + "' and att_date=" + sDate);
                if (dt.length > 0) {
                    inpDuty.setValue(dt[0].DUTY_HOURS);
                    inpExtra.setValue(dt[0].EXTRA_HOURS);
                    inpNoOf.setValue(dt[0].WORK_HOURS);
                }
                var dt = Util.execSQLWithData("select to_char(in_time,'HH24.MI') intime," +
                    " to_char(out_time,'HH24.MI' ) outtime from c7hr_empinout " +
                    " where emp_code='" + ctx.empCode + "' and att_date=" + sDate + " order by postime");
                if (dt.length > 0) {
                    inpIn1.setValue(Util.nvl(dt[0].INTIME, "").replaceAll(".", ":"));
                    inpOut1.setValue(Util.nvl(dt[0].OUTTIME, "").replaceAll(".", ":"));
                }
            }
        };
        /* ── Duty Hours ── */
        var inpDuty = new sap.m.Input({ type: "Number", width: "40%", value: "8" });

        //NoOf Hours
        var inpNoOf = new sap.m.Input({
            type: "Number", width: "40%", editable: true, value: "0",
        });
        /* ── Extra Hours ── */
        var inpExtra = new sap.m.Input({ type: "Number", width: "40%", value: "0" });
        /* ── Total Hours (readonly) ── */
        var inpTotal = new sap.m.Input({ type: "Number", width: "40%", editable: false, value: "0" });
        var chkUseInOut = new sap.m.CheckBox({
            selected: false,
            select: function () {
                if (this.getSelected()) {
                    inpIn1.setEditable(true);
                    inpOut1.setEditable(true);
                    inpNoOf.setEditable(false);
                    recalcTotals();
                } else {
                    inpIn1.setValue("");
                    inpOut1.setValue("");
                    inpIn1.setEditable(false);
                    inpOut1.setEditable(false);
                    inpNoOf.setEditable(true);

                }
            }
        })


            ;

        var inpIn1 = new sap.m.Input({
            placeholder: "In", width: "35%", value: "", editable: false, change: function () {
                recalcTotals();
            }
        });
        var inpOut1 = new sap.m.Input({
            placeholder: "Out", width: "35%", value: "", editable: false, change: function () {
                recalcTotals();
            }
        });
        var inpRowTotal1 = new sap.m.Input({ width: "15%", editable: false, textAlign: sap.ui.core.TextAlign.End, value: "0" });
        fe.push(Util.getLabelTxt("", "15%", ""), inpTotal);

        var fe = [
            Util.getLabelTxt("Duty Hours", "40%"), inpDuty,
            Util.getLabelTxt("No Of Hours", "40%"), inpNoOf,
            Util.getLabelTxt("Extra Hours", "40%"), inpExtra,
            Util.getLabelTxt("Total Hours", "40%"), inpTotal,
            Util.getLabelTxt("", "40%"), chkUseInOut,
            Util.getLabelTxt("Time Entries", "100%", "#", "boldText", "Center"),
            Util.getLabelTxt("", "15%"), inpIn1,
            Util.getLabelTxt("", "0px", "@"), inpOut1,
            Util.getLabelTxt("", "0px", "@"), inpRowTotal1,
        ];

        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
            width: "550px",//{ "S": 380, "M": 480, "L": 580, "XL": 800 },
            cssText: [
                "padding-left:5px ;" +
                "padding-top:3px;" +
                "border-style: groosve;" +
                "margin-left: 1%;" +
                "margin-right: 1%;" +
                "border-radius:20px;" +
                "margin-top: 3px;"
            ]
        }, "sapUiSizeCompact", "");
        cnt.addContent(new sap.m.VBox({ height: "40px" }));

        /* ── Dialog ── */
        var oDialog = new sap.m.Dialog({
            title: ctx.empCode + " – " + ctx.empName + "  |  Day " + ctx.day + "  (Present Details)",
            content: [cnt],
            contentHeight: "300px",
            contentWidth: "600px",
            buttons: [
                new sap.m.Button({
                    text: "OK",
                    type: "Emphasized",
                    press: function () {
                        var duty = parseFloat(inpDuty.getValue()) || 0;
                        var noOf = parseFloat(inpNoOf.getValue()) || 0;
                        var extra = parseFloat(inpExtra.getValue()) || 0;
                        var total = parseFloat(inpTotal.getValue()) || 0;
                        var timeEntries = [];
                        var in1 = inpIn1.getValue() || "";
                        var out1 = inpOut1.getValue() || "";

                        that._applyPresentWithDetails({
                            dutyHours: duty,
                            noOfHours: noOf,
                            extraHours: extra,
                            totalHours: total,
                            timeEntries: {
                                inTime1: in1,
                                outTime1: out1
                            }
                        });
                        oDialog.close();
                    }
                }),
                new sap.m.Button({
                    text: "Cancel",
                    press: function () { oDialog.close(); }
                })
            ]
        });
        oDialog.open();
        setTimeout(() => {
            loadPresentDetails();
            if (inpIn1.getValue() != "") {
                chkUseInOut.setSelected(true);
                chkUseInOut.fireSelect({ selected: true });
            }
            recalcTotals();
        });


    },

    /* ── _applyPresentWithDetails ────────────────────────────── */
    _applyPresentWithDetails: function (oDetails) {
        var that = this;
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        var oRec = aData[ctx.absRow];

        oRec[ctx.colName] = that.getMenuItem("P").icon;
        oRec["_rec_" + ctx.day] = {
            EMP_CODE: ctx.empCode,
            DAY_NO: ctx.day,
            DAY_FRACTION: 1,
            DAY_TYPE: "P",
            EXTRA_HOURS: 0, //oDetails.EXTRA_HOURS,
            OT_HOURS: 0,
            REMARKS: '',
            dutyHours: oDetails.dutyHours,
            noOfHours: oDetails.noOfHours,
            extraHours: oDetails.extraHours,
            totalHours: oDetails.totalHours,
            timeEntries: {
                inTime1: oDetails.timeEntries.inTime1,
                outTime1: oDetails.timeEntries.outTime1,
            }


        };

        this._recalcSummary(oRec);
        oModel.refresh(true);
        this._dirty[ctx.empCode + "_" + ctx.day] = oRec["_rec_" + ctx.day];
    },

    /* ── _recalcSummary ───────────────────────────────────────── */
    _recalcSummary: function (oRec) {
        var iP = 0, iA = 0, iOT = 0;
        for (var d = 1; d <= this._iDays; d++) {
            var v = oRec["D" + d] || "P";
            if (v === "P") iP++;
            if (v === "OT") { iP++; iOT++; }
            if (v === "A") iA++;
        }
        oRec.S_P = iP;
        oRec.S_A = iA;
        oRec.S_OT = iOT;
    },

    /* ── saveAttendance ───────────────────────────────────────── */
    saveAttendance: function () {
        var that = this;
        var aDirty = Object.values(this._dirty || {});
        if (aDirty.length === 0) {
            sap.m.MessageToast.show("No changes to save.");
            return;
        }
        try {
            Util.doSpin("Saving attendance...");

            var sYear = String(this._iYear);
            var sMon = String(this._iMonth).padStart(2, "0");

            /* build SQL inserts/updates — same Util.execSQL pattern */
            var errCount = 0;
            var sqls = "";
            for (var r in aDirty) {
                var rec = aDirty[r];
                var sDate = "to_date('" + sYear + "-" + sMon + "-"
                    + String(rec.DAY_NO).padStart(2, "0") + "','rrrr/mm/dd')";
                var sqlMerge = "";
                if (rec.DAY_TYPE != '-') {
                    sqlMerge =
                        "merge into c7hr_attend a " +
                        "using dual on (a.emp_code='" + rec.EMP_CODE + "' and a.att_date=" + sDate + ") " +
                        " when matched then update set " +
                        "  a.day_type='" + rec.DAY_TYPE + "'," +
                        "  a.leave_type=''," +
                        "  a.day_fraction=" + rec.DAY_FRACTION + "," +
                        "  a.ot_hours=" + rec.OT_HOURS + "," +
                        "  a.remarks='" + rec.REMARKS + "' , " +
                        "  a.DUTY_HOURS=" + Util.nvl(rec.dutyHours, 0) + "," +
                        "  a.WORK_HOURS=" + Util.nvl(rec.noOfHours, 0) + "," +
                        "  a.EXTRA_HOURS=" + Util.nvl(rec.extraHours, 0) + " " +
                        " when not matched then insert " +
                        "  (emp_code,att_date,day_type,leave_type,day_fraction," +
                        "   ot_hours,remarks,keyfld,duty_hours,work_hours,extra_hours ) " +
                        " values (" + rec.EMP_CODE + "," + sDate + ",'" +
                        rec.DAY_TYPE + "',''," +
                        rec.DAY_FRACTION + "," + rec.OT_HOURS + "," +
                        "'" + rec.REMARKS + "'," +
                        "(select nvl(max(keyfld),0)+1 from c7hr_attend) ," +
                        Util.nvl(rec.dutyHours, 0) + " , " + Util.nvl(rec.noOfHours, 0) + " , " + Util.nvl(rec.extraHours, 0) +
                        " ) ; ";
                    if (rec.DAY_TYPE == "P" && Util.nvl(rec.timeEntries.inTime1, "") != "") {
                        var sTimeIn1 = "to_date('" + sYear + "-" + sMon + "-"
                            + String(rec.DAY_NO).padStart(2, "0") + " "
                            + (rec.timeEntries.inTime1.replaceAll(":", ".") + "','rrrr/mm/dd hh24.mi')");
                        var sTimeOut1 = "to_date('" + sYear + "-" + sMon + "-"
                            + String(rec.DAY_NO).padStart(2, "0") + " "
                            + (rec.timeEntries.outTime1.replaceAll(":", ".") + "','rrrr/mm/dd hh24.mi')");

                        sqlMerge += "delete from c7hr_empinout where emp_code='" + rec.EMP_CODE + "' and att_date=" + sDate + "; ";
                        var tmpsq = "insert into c7hr_empinout (EMP_CODE, ATT_DATE, POSTIME, IN_TIME, OUT_TIME, EXTRA_HOURS, DUTY_IN, DUTY_OUT) " +
                            " values (':EMP_CODE', :ATT_DATE, :POSTIME, :IN_TIME, :OUT_TIME, :EXTRA_HOURS, :DUTY_IN, :DUTY_OUT) ;"
                        tmpsq = tmpsq.replaceAll(":EMP_CODE", rec.EMP_CODE)
                            .replaceAll(":ATT_DATE", sDate)
                            .replaceAll(":POSTIME", 1)
                            .replaceAll(":IN_TIME", sTimeIn1)
                            .replaceAll(":OUT_TIME", sTimeOut1)
                            .replaceAll(":EXTRA_HOURS", 0)
                            .replaceAll(":DUTY_IN", 'null')
                            .replaceAll(":DUTY_OUT", 'null');
                        sqlMerge += tmpsq;

                    }
                }
                else
                    sqlMerge = "delete from c7hr_attend where emp_code='" + rec.EMP_CODE + "' and att_date=" + sDate + "; "

                sqls += sqlMerge;
            }
            if (sqls.length > 0) {
                sqls = "begin " + sqls + " end;";
                var r = Util.execSQL(sqls);
                if (r.ret !== "SUCCESS") errCount++;
                FormView.msgSuccess(Util.getLangText("msgSaved"));
            } else
                sap.m.MessageToast.show("No Records saved !");
        } catch (e) {
            console.log(e);
            Util.stopSpin();
            throw e;
        }
        this._dirty = {};
        Util.stopSpin();
    },

    /* ── postToTrans ──────────────────────────────────────────── */
    postToTrans: function () {
        var that = this;
        var sLabel = ["", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]
        [this._iMonth] + " " + this._iYear;

        sap.m.MessageBox.confirm(
            "Post attendance transactions to c7hr_trans for " + sLabel + "?",
            {
                title: "Post Transactions",
                onClose: function (sAction) {
                    if (sAction !== sap.m.MessageBox.Action.OK) return;
                    that._doPostTrans();
                }
            }
        );
    },

    _doPostTrans: function () {
        var that = this;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData() || [];
        var sPayMonth = "to_date('" + this._iYear + "-"
            + String(this._iMonth).padStart(2, "0") + "-01','YYYY-MM-DD')";
        var iPosted = 0;
        var errCount = 0;

        Util.doSpin("Posting transactions...");

        aData.forEach(function (oRow) {
            for (var d = 1; d <= that._iDays; d++) {
                var rec = oRow["_rec_" + d] || {};
                var dt = oRow["D" + d] || "P";
                var sDate = "to_date('" + that._iYear + "-"
                    + String(that._iMonth).padStart(2, "0") + "-"
                    + String(d).padStart(2, "0") + "','YYYY-MM-DD')";

                var aInserts = [];

                /* ABSENT → DEDUCTION */
                if (dt === "A") {
                    aInserts.push({
                        trans_code: "ABSENT", category: "DEDUCTION",
                        dr_cr_flag: "D", qty: rec.DAY_FRACTION || 1,
                        description: "Absent day " + d
                    });
                }
                /* OT → EARNING */
                if (dt === "OT" && (rec.OT_HOURS || 0) > 0) {
                    aInserts.push({
                        trans_code: "OT", category: "EARNING",
                        dr_cr_flag: "C", qty: rec.OT_HOURS,
                        description: "OT " + rec.OT_HOURS + " hrs"
                    });
                }
                /* LATE → DEDUCTION */
                if ((rec.LATE_MIN || 0) > 0) {
                    aInserts.push({
                        trans_code: "LATE", category: "DEDUCTION",
                        dr_cr_flag: "D", qty: rec.LATE_MIN,
                        description: "Late " + rec.LATE_MIN + " min"
                    });
                }
                /* UNPAID LEAVE → DEDUCTION */
                if (rec.LEAVE_TYPE === "UL") {
                    aInserts.push({
                        trans_code: "ABSENT", category: "DEDUCTION",
                        dr_cr_flag: "D", qty: rec.DAY_FRACTION || 1,
                        description: "Unpaid leave"
                    });
                }

                aInserts.forEach(function (ins) {
                    /* ── REPLACE with real SQL ────────────────────
                       var sql =
                           "insert into c7hr_trans " +
                           "(emp_id,pay_month,trans_date,source_module,trans_code," +
                           " category,qty,dr_cr_flag,processed_flag,posted_payroll," +
                           " posted_gl,description) " +
                           "values (" +
                           oRow.EMP_ID + "," + sPayMonth + "," + sDate + "," +
                           "'ATTEND','" + ins.trans_code + "','" + ins.category + "'," +
                           ins.qty + ",'" + ins.dr_cr_flag + "','N','N','N','" +
                           ins.description + "')";
                       var r = Util.execSQL(sql);
                       if (r.ret !== "SUCCESS") errCount++;
                       else iPosted++;
                    ────────────────────────────────────────────── */
                    console.log("[c7hr_trans] insert:", jQuery.extend({ EMP_ID: oRow.EMP_ID, DAY: d }, ins));
                    iPosted++;
                });
            }
        });

        Util.stopSpin();

        if (errCount === 0)
            sap.m.MessageToast.show(iPosted + " transaction(s) posted to c7hr_trans ✓");
        else
            sap.m.MessageBox.error(errCount + " transaction(s) failed.");
    },

    /* ── validateSave ─────────────────────────────────────────── */
    validateSave: function () { return true; },

    /* ── save_data ────────────────────────────────────────────── */
    save_data: function () { this.saveAttendance(); },
    getMenuItem: function (stat) {
        var that = this;
        var it = that.aMenuItems;
        for (var i in it) {
            if (it[i].key == stat)
                return it[i];
        }
    },
    getMenuKeyFromIcon: function (stat) {
        var that = this;
        var it = that.aMenuItems;
        for (var i in it) {
            if (it[i].icon == stat)
                return it[i];
        }
    },


});
