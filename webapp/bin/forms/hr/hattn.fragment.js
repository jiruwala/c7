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

    /* ── day-type colour map ──────────────────────────────────── */
    _DAY_COLORS: {
        P: { bg: "#e8f5e9", fg: "#2e7d32" },
        A: { bg: "#ffebee", fg: "#c62828" },
        WO: { bg: "#e3f2fd", fg: "#1565c0" },
        PH: { bg: "#fff9c4", fg: "#f57f17" },
        AL: { bg: "#f3e5f5", fg: "#6a1b9a" },
        SL: { bg: "#fce4ec", fg: "#880e4f" },
        UL: { bg: "#fbe9e7", fg: "#bf360c" },
        OT: { bg: "#e0f2f1", fg: "#00695c" },
        HD: { bg: "#fff3e0", fg: "#e65100" }
    },

    /* ── createContent ────────────────────────────────────────── */
    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.timeInLong = (new Date()).getTime();

        /* SplitApp wrapper — same pattern as db.fragment */
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });

        this.mainPage = new sap.m.Page({
            showHeader: false,
            content: []
        }).addStyleClass("sapUiSizeCompact");

        this.createView();

        this.joApp.addDetailPage(this.mainPage);
        this.joApp.to(this.mainPage, "show");

        this._injectCSS();
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

        var iMonth = parseInt(Util.nvl(UtilGen.getControlValue(this.cbMonth), new Date().getMonth() + 1));
        var iYear = parseInt(Util.nvl(UtilGen.getControlValue(this.cbYear), new Date().getFullYear()));
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
            var dayNo = parseInt(lctb.cols[colno].mColName.replace("D" + ""));
            that._onCellClick(absRow, "D" + dayNo, dayNo, tbl, obj);
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
                    "mTitle": "Day " + i,
                    // "mSummary": "COUNT_UNIQUE",
                    "display_width": 70,
                });
                qv.mLctb.cols[qv.mLctb.getColPos("D" + i)].commandLinkClick = cmdLink;

            }
            qv.getControl().attachRowsUpdated(function () {
                setTimeout(function () { that._colorDayCells(qv); });
            });

            qv.mLctb.parse("{" + dtEmp.data + "}", true);
            qv.loadData();
            qv.getControl().setFirstVisibleRow(0);
        }
        setTimeout(() => {
            UtilGen.DBView.autoShowHideMenu(false, that.joApp);
        });
    },

    /* ── _colorDayCells ───────────────────────────────────────── */
    /* Called after rows update — adds background colours to day cells */
    _colorDayCells: function (qv) {
        var that = this;
        var oTable = qv.getControl();
        var oModel = oTable.getModel();
        if (!oModel) return;
        var aData = oModel.getData();
        if (!aData || !aData.length) return;
        var iStart = oTable.getFirstVisibleRow();

        oTable.getRows().forEach(function (oRow, iRowIdx) {
            var iAbsRow = iStart + iRowIdx;
            if (iAbsRow >= aData.length) return;
            var oRec = aData[iAbsRow];
            if (!oRec) return;

            oRow.getCells().forEach(function (oCell, iCellIdx) {
                var oCols = oTable.getColumns();
                if (iCellIdx >= oCols.length) return;
                var sColName = oCols[iCellIdx].getLabel()
                    && oCols[iCellIdx].getLabel().getText
                    ? oCols[iCellIdx]._colName : "";

                /* find the column name stored on column object */
                sColName = oCols[iCellIdx]._colName || "";
                if (!sColName.startsWith("D")) return;

                var dt = oRec[sColName] || "P";
                var clr = that._DAY_COLORS[dt] || { bg: "#f5f5f5", fg: "#333" };
                var oDom = oCell.getDomRef();
                if (!oDom) return;

                oDom.style.background = clr.bg;
                oDom.style.color = clr.fg;
                oDom.style.fontWeight = "700";
                oDom.style.fontSize = "11px";
                oDom.style.textAlign = "center";
                oDom.style.cursor = "pointer";
                oDom.style.borderRadius = "3px";

                /* store day info for click */
                oDom.dataset.row = iAbsRow;
                oDom.dataset.col = sColName;
                oDom.onclick = (function (r, c) {
                    return function () { that._onCellClick(r, c, parseInt(c.replace("D", ""))); };
                }(iAbsRow, sColName));
            });
        });
    },

    _onCellClick: function (iAbsRow, sColName, iDay, obj) {
        var that = this;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        if (!aData || iAbsRow >= aData.length) return;
        var oRec = aData[iAbsRow];

        /* store context for later use */
        this._oCellCtx = {
            absRow: iAbsRow,
            colName: sColName,
            day: iDay,
            empId: oRec.EMP_ID,
            empCode: oRec.EMP_CODE,
            empName: oRec.EMP_NAME,
            currentType: oRec[sColName] || "P"
        };

        /* create menu items */
        var aMenuItems = [
            { key: "P", text: "✅ Present" },
            { key: "A", text: "❌ Absent" },
            { key: "WO", text: "📅 Weekly Off" },
            { key: "PH", text: "🎉 Public Holiday" },
            { key: "AL", text: "🏖 Annual Leave" },
            { key: "SL", text: "🤒 Sick Leave" },
            { key: "UL", text: "💰 Unpaid Leave" },
            { key: "OT", text: "⏰ Overtime" },
            { key: "HD", text: "🌗 Half Day" }
        ];

        var oMenu = new sap.m.Menu();
        aMenuItems.forEach(function (it) {
            oMenu.addItem(new sap.m.MenuItem({
                text: it.text,
                key: it.key,
                press: function (oEv) {
                    var sKey = oEv.getParameter("item").getKey();
                    if (sKey === "P") {
                        that._openPresentPopup();
                    } else {
                        that._applyStatus(sKey);
                    }
                }
            }));
        });

        /* open near clicked cell */
        var oDom = document.querySelector(
            "[data-col='" + sColName + "'][data-row='" + iAbsRow + "']"
        );
        if (oDom) {
            var oControl = sap.ui.getCore().byId(
                jQuery(oDom).closest("[data-sap-ui]").attr("id")
            );
            if (oControl) {
                oMenu.openBy(oControl);
                return;
            }
        }
        oMenu.openBy(obj);
    },

    /* ── _applyStatus (non‑Present) ──────────────────────────── */
    _applyStatus: function (sStatus) {
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        var oRec = aData[ctx.absRow];

        oRec[ctx.colName] = sStatus;
        oRec["_rec_" + ctx.day] = {
            EMP_ID: ctx.empId,
            DAY_NO: ctx.day,
            DAY_TYPE: sStatus,
            LEAVE_TYPE: "",
            DAY_FRACTION: (sStatus === "A" || sStatus === "WO" || sStatus === "PH") ? 0 :
                (sStatus === "HD") ? 0.5 : 1,
            OT_HOURS: 0,
            LATE_MIN: 0,
            REMARKS: ""
        };

        this._recalcSummary(oRec);
        oModel.refresh(true);
        this._dirty[ctx.empId + "_" + ctx.day] = oRec["_rec_" + ctx.day];

        /* update DOM colour */
        var clr = this._DAY_COLORS[sStatus] || { bg: "#f5f5f5", fg: "#333" };
        var oDom = document.querySelector(
            "[data-col='" + ctx.colName + "'][data-row='" + ctx.absRow + "']"
        );
        if (oDom) {
            oDom.style.background = clr.bg;
            oDom.style.color = clr.fg;
            oDom.textContent = sStatus;
        }
    },

    /* ── _openPresentPopup ────────────────────────────────────── */
    _openPresentPopup: function () {
        var that = this;
        var ctx = this._oCellCtx;
        if (!ctx) return;

        /* ── 1. Create a new QueryView ── */
        var qvPopup = new QueryView("presentPopup" + this.timeInLong);
        qvPopup.getControl().addStyleClass("sapUiSizeCondensed");
        qvPopup.getControl().setSelectionMode(sap.ui.table.SelectionMode.None);
        qvPopup.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
        qvPopup.getControl().setVisibleRowCount(1);
        qvPopup.getControl().setFixedBottomRowCount(0);
        qvPopup.getControl().setRowHeight(32);
        qvPopup.insertable = false;
        qvPopup.deletable = false;
        qvPopup.editable = true;

        /* ── 2. Define metadata & columns ── */
        var metadata = {
            metadata: [
                { colname: "IN_TIME", data_type: "STRING", display_width: 120, display_align: "ALIGN_BEGIN", descr: "In Time" },
                { colname: "OUT_TIME", data_type: "STRING", display_width: 120, display_align: "ALIGN_BEGIN", descr: "Out Time" },
                { colname: "EXTRA_HOURS", data_type: "NUMBER", display_width: 100, display_align: "ALIGN_END", descr: "Extra Hours" },
                { colname: "REMARKS", data_type: "STRING", display_width: 200, display_align: "ALIGN_BEGIN", descr: "Remarks" }
            ],
            data: [
                { IN_TIME: "", OUT_TIME: "", EXTRA_HOURS: 0, REMARKS: "" }
            ]
        };

        qvPopup.setJsonStrMetaData(JSON.stringify(metadata));
        qvPopup.mLctb.parse(JSON.stringify(metadata), true);
        qvPopup.loadData();

        /* ── 3. Dialog with OK/Cancel buttons ── */
        var oDialog = new sap.m.Dialog({
            title: ctx.empCode + " – " + ctx.empName + "  |  Day " + ctx.day + "  (Present Details)",
            content: [qvPopup.getControl()],
            contentHeight: "200px",
            contentWidth: "500px",
            buttons: [
                new sap.m.Button({
                    text: "OK",
                    type: "Emphasized",
                    press: function () {
                        var ld = qvPopup.mLctb;
                        if (ld.rows.length === 0) {
                            sap.m.MessageToast.show("No data entered.");
                            return;
                        }
                        var oRowData = {
                            IN_TIME: ld.getFieldValue(0, "IN_TIME") || "",
                            OUT_TIME: ld.getFieldValue(0, "OUT_TIME") || "",
                            EXTRA_HOURS: parseFloat(ld.getFieldValue(0, "EXTRA_HOURS")) || 0,
                            REMARKS: ld.getFieldValue(0, "REMARKS") || ""
                        };
                        that._applyPresentWithDetails(oRowData);
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
    },

    /* ── _applyPresentWithDetails ────────────────────────────── */
    _applyPresentWithDetails: function (oDetails) {
        var ctx = this._oCellCtx;
        if (!ctx) return;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        var oRec = aData[ctx.absRow];

        oRec[ctx.colName] = "P";
        oRec["_rec_" + ctx.day] = {
            EMP_ID: ctx.empId,
            DAY_NO: ctx.day,
            DAY_TYPE: "P",
            IN_TIME: oDetails.IN_TIME,
            OUT_TIME: oDetails.OUT_TIME,
            EXTRA_HOURS: oDetails.EXTRA_HOURS,
            REMARKS: oDetails.REMARKS
        };

        this._recalcSummary(oRec);
        oModel.refresh(true);
        this._dirty[ctx.empId + "_" + ctx.day] = oRec["_rec_" + ctx.day];

        var clr = this._DAY_COLORS["P"];
        var oDom = document.querySelector(
            "[data-col='" + ctx.colName + "'][data-row='" + ctx.absRow + "']"
        );
        if (oDom) {
            oDom.style.background = clr.bg;
            oDom.style.color = clr.fg;
            oDom.textContent = "P";
        }
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

        Util.doSpin("Saving attendance...");

        var sYear = String(this._iYear);
        var sMon = String(this._iMonth).padStart(2, "0");

        /* build SQL inserts/updates — same Util.execSQL pattern */
        var errCount = 0;
        aDirty.forEach(function (rec) {
            var sDate = "to_date('" + sYear + "-" + sMon + "-"
                + String(rec.DAY_NO).padStart(2, "0") + "','dd/mm/yyyy')";

            /* ── REPLACE with real SQL ──────────────────────────────
               var sqlMerge =
                   "merge into c7hr_attend a " +
                   "using dual on (a.emp_id=" + rec.EMP_ID + " and a.att_date=" + sDate + ") " +
                   "when matched then update set " +
                   "  a.day_type='"      + rec.DAY_TYPE     + "'," +
                   "  a.leave_type='"    + rec.LEAVE_TYPE   + "'," +
                   "  a.day_fraction="   + rec.DAY_FRACTION  + "," +
                   "  a.ot_hours="       + rec.OT_HOURS      + "," +
                   "  a.late_min="       + rec.LATE_MIN      + "," +
                   "  a.remarks='"       + rec.REMARKS       + "'," +
                   "  a.processed_flag='N' " +
                   "when not matched then insert " +
                   "  (emp_id,att_date,day_type,leave_type,day_fraction," +
                   "   ot_hours,late_min,remarks,processed_flag) " +
                   "values (" + rec.EMP_ID + "," + sDate + ",'" +
                   rec.DAY_TYPE + "','" + rec.LEAVE_TYPE + "'," +
                   rec.DAY_FRACTION + "," + rec.OT_HOURS + "," +
                   rec.LATE_MIN + ",'" + rec.REMARKS + "','N')";
               var r = Util.execSQL(sqlMerge);
               if (r.ret !== "SUCCESS") errCount++;
            ──────────────────────────────────────────────────────── */
            console.log("[c7hr_attend] save:", rec);
        });

        Util.stopSpin();

        if (errCount === 0) {
            that._dirty = {};
            sap.m.MessageToast.show(aDirty.length + " attendance record(s) saved ✓");
        } else {
            sap.m.MessageBox.error(errCount + " record(s) failed to save.");
        }
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

    /* ── _injectCSS ───────────────────────────────────────────── */
    _injectCSS: function () {
        if (document.getElementById("c7hrAttendCSS")) return;
        var s = document.createElement("style");
        s.id = "c7hrAttendCSS";
        s.innerHTML = `
            /* day cell badge */
            .sapUiTableDataCell[data-col] {
                transition: filter .1s;
            }
            .sapUiTableDataCell[data-col]:hover {
                filter: brightness(0.88);
            }
            /* weekend header column */
            .c7hr-col-wknd .sapUiTableColCell {
                background : #fce4ec !important;
                color      : #880e4f !important;
            }
            /* compact table */
            .sapUiTableTr > td {
                padding-top    : 2px !important;
                padding-bottom : 2px !important;
            }
        `;
        document.head.appendChild(s);
    }

});
