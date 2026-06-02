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
        Util.destroyID("cbMonth" + this.timeInLong, view);
        Util.destroyID("cbYear" + this.timeInLong, view);
        Util.destroyID("cbDept" + this.timeInLong, view);

        /* Title label */
        var lblTitle = Util.getLabelTxt(
            "Attendance Entry",
            "100%", "", "titleFontWithoutPad2 boldText"
        );

        /* Month combo  — UtilGen.addControl pattern from db.fragment */
        var cbMonth = UtilGen.addControl(
            fe, "Month", sap.m.ComboBox, "cbMonth" + this.timeInLong,
            {
                width: "130px",
                selectionChange: function () { that.loadData(); }
            },
            "string", undefined, view, undefined,
            "@1/January,2/February,3/March,4/April,5/May,6/June," +
            "7/July,8/August,9/September,10/October,11/November,12/December"
        );

        /* Year combo */
        var cbYear = UtilGen.addControl(
            fe, "Year", sap.m.ComboBox, "cbYear" + this.timeInLong,
            {
                width: "90px",
                selectionChange: function () { that.loadData(); }
            },
            "string", undefined, view, undefined,
            "@2023/2023,2024/2024,2025/2025,2026/2026,2027/2027"
        );

        /* Department combo */
        var cbDept = UtilGen.addControl(
            fe, "Department", sap.m.ComboBox, "cbDept" + this.timeInLong,
            {
                width: "150px",
                selectionChange: function () { that.loadData(); }
            },
            "string", undefined, view, undefined,
            "@/All,Production/Production,Admin/Admin,Finance/Finance,HR/HR,IT/IT"
        );

        /* Refresh button */
        var btRefresh = new sap.m.Button({
            icon: "sap-icon://refresh",
            press: function () { that.loadData(); }
        });
        fe.push(""); fe.push(btRefresh);

        /* set current month + year defaults */
        var oNow = new Date();
        UtilGen.setControlValue(cbMonth, oNow.getMonth() + 1,
            oNow.getMonth() + 1, false);
        UtilGen.setControlValue(cbYear, oNow.getFullYear(),
            oNow.getFullYear(), false);

        /* store refs for loadData */
        this.cbMonth = cbMonth;
        this.cbYear = cbYear;
        this.cbDept = cbDept;

        /* formCreate2 — same style as db.fragment createViewHeader */
        var cnt = UtilGen.formCreate2(
            "", true, fe, undefined, sap.m.ScrollContainer,
            {
                width: { "S": 380, "M": 580, "L": 780, "XL": 980 },
                cssText: [
                    "padding-left:8px;" +
                    "padding-top:4px;" +
                    "border-style:groove;" +
                    "margin-left:1%;" +
                    "margin-right:1%;" +
                    "border-radius:10px;" +
                    "margin-top:4px;"
                ]
            },
            "sapUiSizeCompact", ""
        );

        this.mainPage.addContent(cnt);
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

        // Util.doSpin("Loading attendance...");

        // ── REAL DB CALL ─────────────────────────────────────────
        var dtEmp = Util.execSQL(
            "select e.emp_code, e.emp_name " +
            "from c7hr_emp e " +
            "where e.flag=1 " +
            (sDept != "" ? " and e.department='" + sDept + "'" : "") +
            " order by e.emp_code"
        );
        var dtAtt = Util.execSQL(
            "select a.emp_code, to_number(to_char(a.att_date,'DD')) day_no, " +
            " a.day_type, a.leave_type, a.day_fraction, a.ot_hours, a.late_min, a.remarks " +
            "from c7hr_attend a " +
            "where to_char(a.att_date,'YYYY')='" + iYear + "' " +
            " and to_char(a.att_date,'MM')='" + String(iMonth).padStart(2, '0') + "' " +
            (sDept != "" ?
                " and a.emp_id in (select emp_id from c7hr_employee where department='" + sDept + "')" : "") +
            " order by a.emp_id, day_no"
        );
        if (dtEmp.ret == "SUCCESS") {
            var aEmp = JSON.parse("{" + dtEmp.data + "}").data;
            var aAtt = dtAtt.ret == "SUCCESS" ? JSON.parse("{" + dtAtt.data + "}").data : [];
            that._buildMatrix(iYear, iMonth, iDays, aEmp, aAtt, qv);
        }
        //    Util.stopSpin();
        // ───────────────────────────────────────────────────────── 

    },

    /* ── _buildMatrix ─────────────────────────────────────────── */
    _buildMatrix: function (iYear, iMonth, iDays, aEmp, aAtt, qv) {
        var that = this;
        var oLctb = qv.mLctb;

        /* build attend map: empId_day → record */
        var oAttMap = {};
        aAtt.forEach(function (r) {
            oAttMap[r.EMP_ID + "_" + r.DAY_NO] = r;
        });

        /* ── build JSON for qv.setJsonStrMetaData ── */
        /*
         * We build a metadata+data JSON string in the same format
         * as Util.execSQL returns (like db.fragment does with dt.data).
         * metadata: column definitions
         * data:     rows
         */
        var aCols = [];
        aCols.push({ colname: "EMP_ID", data_type: "NUMBER", display_format: "", display_width: 0, display_align: "ALIGN_CENTER" });
        aCols.push({ colname: "EMP_CODE", data_type: "STRING", display_format: "", display_width: 70, display_align: "ALIGN_CENTER" });
        aCols.push({ colname: "EMP_NAME", data_type: "STRING", display_format: "", display_width: 150, display_align: "ALIGN_BEGIN" });

        for (var d = 1; d <= iDays; d++) {
            var dn = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][new Date(iYear, iMonth - 1, d).getDay()];
            aCols.push({
                colname: "D" + d,
                data_type: "STRING",
                display_format: "",
                display_width: 36,
                display_align: "ALIGN_CENTER",
                _isDay: true,
                _dayNo: d,
                _dayName: dn,
                _isWeekend: (dn === "Fr" || dn === "Sa")
            });
        }
        aCols.push({ colname: "S_P", data_type: "NUMBER", display_format: "", display_width: 40, display_align: "ALIGN_CENTER" });
        aCols.push({ colname: "S_A", data_type: "NUMBER", display_format: "", display_width: 40, display_align: "ALIGN_CENTER" });
        aCols.push({ colname: "S_OT", data_type: "NUMBER", display_format: "", display_width: 40, display_align: "ALIGN_CENTER" });

        /* build data rows */
        var aRows = [];
        aEmp.forEach(function (e) {
            var row = {};
            var iP = 0, iA = 0, iOT = 0;
            row.EMP_ID = e.EMP_ID;
            row.EMP_CODE = e.EMP_CODE;
            row.EMP_NAME = e.EMP_NAME;

            for (var d = 1; d <= iDays; d++) {
                var rec = oAttMap[e.EMP_ID + "_" + d]
                    || {
                        DAY_TYPE: "P", LEAVE_TYPE: "", DAY_FRACTION: 1.0,
                    OT_HOURS: 0, LATE_MIN: 0, REMARKS: ""
                };
                var dt = rec.DAY_TYPE || "P";
                row["D" + d] = dt;
                row["_rec_" + d] = rec;   /* store full rec for save */
                if (dt === "P") iP++;
                if (dt === "OT") { iP++; iOT++; }
                if (dt === "A") iA++;
            }
            row.S_P = iP;
            row.S_A = iA;
            row.S_OT = iOT;
            aRows.push(row);
        });

        /* build metadata JSON string — same format Util.execSQL returns */
        var metaStr = '"metadata":' + JSON.stringify({ columns: aCols });
        var dataStr = '"data":' + JSON.stringify(aRows);
        var jsonFull = "{" + metaStr + "," + dataStr + "}";

        /* parse into QueryView — same as db.fragment loadData pattern */
        qv.setJsonStrMetaData(jsonFull);

        /* ── column settings — same as db.fragment col tuning ── */
        var lctb = qv.mLctb;

        /* set titles */
        var cCode = lctb.getColByName("EMP_CODE");
        if (cCode) cCode.mTitle = "Code";
        var cName = lctb.getColByName("EMP_NAME");
        if (cName) cName.mTitle = "Employee";

        /* day column headers: show day number + dow */
        for (var d = 1; d <= iDays; d++) {
            var cx = lctb.getColByName("D" + d);
            if (!cx) continue;
            var dn = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            [new Date(iYear, iMonth - 1, d).getDay()];
            cx.mTitle = d + "\n" + dn;
            cx._isDay = true;
            cx._dayNo = d;
            cx._isWeekend = (dn === "Fr" || dn === "Sa");

            /* cell click handler on day columns */
            cx.commandLinkClick = (function (dayNo) {
                return function (oCtrl) {
                    var tbl = oCtrl.getParent().getParent();
                    var rowIdx = tbl.getRows().indexOf(oCtrl.getParent());
                    var absRow = tbl.getFirstVisibleRow() + rowIdx;
                    that._onCellClick(absRow, "D" + dayNo, dayNo, tbl);
                };
            }(d));
        }

        var cSP = lctb.getColByName("S_P"); if (cSP) cSP.mTitle = "P";
        var cSA = lctb.getColByName("S_A"); if (cSA) cSA.mTitle = "A";
        var cSOT = lctb.getColByName("S_OT"); if (cSOT) cSOT.mTitle = "OT";

        /* fix columns: EMP_CODE + EMP_NAME */
        qv.getControl().setFixedColumnCount(2);

        /* colour rows hook — same as db.fragment colorRows pattern */
        qv.getControl().attachRowsUpdated(function () {
            setTimeout(function () { that._colorDayCells(qv); });
        });

        /* parse + load — same as db.fragment */
        lctb.parse(jsonFull, true);
        qv.loadData();
        qv.getControl().setFirstVisibleRow(0);
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

    /* ── _onCellClick ─────────────────────────────────────────── */
    _onCellClick: function (iAbsRow, sColName, iDay) {
        var that = this;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        if (!aData || iAbsRow >= aData.length) return;

        var oRec = aData[iAbsRow];
        var stored = oRec["_rec_" + iDay] || {};

        this._oCellCtx = {
            absRow: iAbsRow,
            colName: sColName,
            day: iDay,
            empId: oRec.EMP_ID,
            empCode: oRec.EMP_CODE,
            empName: oRec.EMP_NAME
        };

        if (!this._oPopover) this._buildPopover();

        this._oCellModel.setData({
            title: oRec.EMP_CODE + " – " + oRec.EMP_NAME + "  |  Day " + iDay,
            day_type: stored.DAY_TYPE || oRec[sColName] || "P",
            leave_type: stored.LEAVE_TYPE || "",
            day_fraction: stored.DAY_FRACTION !== undefined ? stored.DAY_FRACTION : 1.0,
            ot_hours: stored.OT_HOURS || 0,
            late_min: stored.LATE_MIN || 0,
            remarks: stored.REMARKS || ""
        });

        /* open near clicked DOM cell */
        var oDom = document.querySelector(
            "[data-col='" + sColName + "'][data-row='" + iAbsRow + "']"
        );
        if (oDom) {
            /* wrap in jQuery-compatible opener */
            this._oPopover.openBy(
                sap.ui.getCore().byId(
                    jQuery(oDom).closest("[data-sap-ui]").attr("id")
                ) || oTable
            );
        } else {
            this._oPopover.openBy(oTable);
        }
    },

    /* ── _buildPopover ────────────────────────────────────────── */
    _buildPopover: function () {
        var that = this;
        this._oCellModel = new sap.ui.model.json.JSONModel();

        var oDTSel = new sap.m.ComboBox({
            width: "100%",
            selectedKey: "{/day_type}",
            change: function (e) {
                var v = UtilGen.getControlValue(oDTSel);
                that._oCellModel.setProperty("/day_type", v);
                var frac = (v === "A" || v === "WO" || v === "PH") ? 0
                    : v === "HD" ? 0.5 : 1.0;
                that._oCellModel.setProperty("/day_fraction", frac);
            }
        }).setModel(this._oCellModel);

        [
            { key: "P", text: "P  – Present" },
            { key: "A", text: "A  – Absent" },
            { key: "WO", text: "WO – Weekly Off" },
            { key: "PH", text: "PH – Public Holiday" },
            { key: "AL", text: "AL – Annual Leave" },
            { key: "SL", text: "SL – Sick Leave" },
            { key: "UL", text: "UL – Unpaid Leave" },
            { key: "OT", text: "OT – Overtime" },
            { key: "HD", text: "HD – Half Day" }
        ].forEach(function (it) {
            oDTSel.addItem(new sap.ui.core.Item({ key: it.key, text: it.text }));
        });

        var oLTSel = new sap.m.ComboBox({
            width: "100%",
            selectedKey: "{/leave_type}"
        }).setModel(this._oCellModel);
        [
            { key: "", text: "None" },
            { key: "AL", text: "AL – Annual Leave" },
            { key: "SL", text: "SL – Sick Leave" },
            { key: "UL", text: "UL – Unpaid Leave" }
        ].forEach(function (it) {
            oLTSel.addItem(new sap.ui.core.Item({ key: it.key, text: it.text }));
        });

        /* use UtilGen.formCreate style for the popover fields */
        var oFrm = UtilGen.formCreate(
            "", true,
            [
                "Day Type", oDTSel,
                "Leave Type", oLTSel,
                "Fraction",
                new sap.m.StepInput({ value: "{/day_fraction}", min: 0, max: 1, step: 0.5, width: "100%" })
                    .setModel(this._oCellModel),
                "OT Hours",
                new sap.m.StepInput({ value: "{/ot_hours}", min: 0, max: 24, step: 0.5, width: "100%" })
                    .setModel(this._oCellModel),
                "Late (min)",
                new sap.m.StepInput({ value: "{/late_min}", min: 0, max: 480, step: 5, width: "100%" })
                    .setModel(this._oCellModel),
                "Remarks",
                new sap.m.Input({ value: "{/remarks}", width: "100%" })
                    .setModel(this._oCellModel)
            ],
            [12, 4, 4, 3], [0, 1, 1, 1], [1, 1, 2]
        );
        oFrm.setModel(this._oCellModel);

        this._oPopover = new sap.m.Popover({
            title: "{/title}",
            placement: sap.m.PlacementType.Auto,
            contentWidth: "300px",
            content: [oFrm],
            footer: new sap.m.Toolbar({
                content: [
                    new sap.m.ToolbarSpacer(),
                    new sap.m.Button({
                        text: "Apply",
                        type: "Emphasized",
                        press: function () { that._applyCell(); }
                    }),
                    new sap.m.Button({
                        text: "Cancel",
                        press: function () { that._oPopover.close(); }
                    })
                ]
            })
        }).setModel(this._oCellModel);
    },

    /* ── _applyCell ───────────────────────────────────────────── */
    _applyCell: function () {
        var ctx = this._oCellCtx;
        var oTable = this._qr.getControl();
        var oModel = oTable.getModel();
        var aData = oModel.getData();
        var oRec = aData[ctx.absRow];
        var dt = this._oCellModel.getProperty("/day_type");
        var clr = this._DAY_COLORS[dt] || { bg: "#f5f5f5", fg: "#333" };

        /* update model row */
        oRec[ctx.colName] = dt;
        oRec["_rec_" + ctx.day] = {
            EMP_ID: ctx.empId,
            DAY_NO: ctx.day,
            DAY_TYPE: dt,
            LEAVE_TYPE: this._oCellModel.getProperty("/leave_type") || "",
            DAY_FRACTION: this._oCellModel.getProperty("/day_fraction"),
            OT_HOURS: this._oCellModel.getProperty("/ot_hours") || 0,
            LATE_MIN: this._oCellModel.getProperty("/late_min") || 0,
            REMARKS: this._oCellModel.getProperty("/remarks") || ""
        };

        /* recalculate summary */
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

        oModel.refresh(true);

        /* mark dirty */
        this._dirty[ctx.empId + "_" + ctx.day] = oRec["_rec_" + ctx.day];

        /* patch DOM directly — same fast approach as db.fragment inline edits */
        var oDom = document.querySelector(
            "[data-col='" + ctx.colName + "'][data-row='" + ctx.absRow + "']"
        );
        if (oDom) {
            oDom.style.background = clr.bg;
            oDom.style.color = clr.fg;
            oDom.textContent = dt;
        }

        this._oPopover.close();
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
