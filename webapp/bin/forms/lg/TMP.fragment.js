buildJSONTreeWithTotal = function (lctb, that) {
    if (lctb.cols.length == 0)
        return null;
    // var that = this;
    this.applySettings();
    var items = lctb.getData(true);
    if (items == null)
        return;
    var mapNodes = [];
    var recalcCHildCount = true;
    var itemsByID = [];
    var columns = [];
    var lastParent = "";
    var lastParentNode = null;
    var rootNode = null;
    var footer = {};
    var findNodebyVal = function (id) {

        return this.mapNodes[id];
    };

    var calcChildCount = function () {
        if (that.mColChild.length <= 0) return;
        var ld = lctb;
        for (var i = 0; i < ld.rows.length; i++) {
            var childcont = 0;
            for (var j = 0; j < ld.rows.length; j++)
                ld.getFieldValue(j, that.mColParent) ==
                    ld.getFieldValue(i, that.mColCode) ? childcont++ : childcont;
            ld.setFIeldValue(i, that.mColChild, childcont);
        }
    }

    var getHTMLText = function () {
        if (lctb.cols.length <= 0) return;
        var sett = sap.ui.getCore().getModel("settings").getData();
        // if (that.getControl().getModel() == undefined) return;
        // var oData = that.getControl().getModel().getData();
        var oData = lctb.getData(false);
        var h = "", dt = "", rs = "";           // table header data

        var hCol = "";
        var tmpv1 = "", tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
        var cs = []; // colspans in array for first row
        var nxtSpan = 0;
        var hasSpan = false;
        var hs = 1;
        var cnt = 0;
        var ld = lctb;
        for (var c in ld.cols) {
            cnt++;
            // if (cnt - 1 == 0 && grouped) continue;
            if (!ld.cols[c].mHideCol) continue;
            cs[c] = "";
            tmpv1 = ld.cols[c].mTitle;
            tmpv2 = "\"text-align:Center\"";
            cs[c] = "<th style=\"text-align: center;\" colspan=\"" + hs + "\">" + tmpv1 + "</th>";
            h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
        }

        for (var x in cs)
            hCol += cs[x];


        hCol = "<tr>" + hCol + "</tr>";
        h = "<thead>" + (hasSpan ? hCol : "") +
            "<tr>" + h + "</tr></thead>";

        for (var i = 0; i < oData.length; i++) {
            rs = _getRowData2(i, oData);
            dt += rs;
        }
        dt = "<tbody>" + dt + "</tbody>";
        h = "<table>" + h + dt + "</table>";
        return h;
    }
    var _getRowData2 = function (i, oData) {
        var cellValue = "";
        // var that = this;
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
        var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
        var rs = "";
        var cnt = 0;
        var grouped = lctb.cols[0].mGrouped;
        var t;
        var tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
        //getting style for row...
        var cf = "";  // conditional format css (if condition true and false)
        var rowid = Number(Util.nvl(oData[i]["_rowid"], -1));
        var child;


        // purpose  :  looping all columns to get conditional format css
        for (var v in oData[i]) {

            if (v.startsWith("childeren_"))
                child = oData[i][v];
            var cn = lctb.getColPos(v);

            if (cn > -1 && lctb.cols[cn].mHideCol) continue;
            if (cn > -1 && rowid > -1 && Util.nvl(lctb.cols[cn].mCfOperator, "").length > 0) {
                if (lctb.evaluteCfValue(lctb.cols[cn], rowid))
                    cf += lctb.cols[cn].mCfTrue;
                else
                    cf += lctb.cols[cn].mCfFalse;
            }
        }
        // purpose   :  looping to write html <tr>

        for (var v in oData[i]) {
            // task  :  find out that should i print this row or not , by checking this row is collapsed or expanded..

            cnt++;
            tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";

            var cn = lctb.getColPos(v.replace("___", "/"));
            var cc = lctb.cols[cn];
            if (cn > -1 && lctb.cols[cn].mHideCol) continue;
            if (cnt - 1 == 0) {
                t = v;
            }   // get 1st array key.. to find this row is summary/group
            if (cnt - 1 === 0 && grouped) {
                continue;
            }
            if (cnt - 1 === lctb.cols.length) break;
            cellValue = Util.nvl(oData[i][v], "");
            var spcAdd = "";
            if (cc.mColName == that.mColName && that.mColLevel.length > 0 && Util.nvl(oData[i][that.mColLevel], "") != "")
                spcAdd = Util.charCount("\xa0\xa0", parseInt(oData[i][that.mColLevel]));

            if (rowid > -1 && cf.length > 0)
                styleadd += cf;
            if ((that.mColChild.length > 0 && parseInt(oData[i][that.mColChild]) > 0) &&
                (cc.getMUIHelper().display_format == "MONEY_FORMAT" ||
                    cc.getMUIHelper().display_format == "QTY_FORMAT"))
                styleadd += "color:silver;";

            var a = "text-align:" + cc.getMUIHelper().display_align + " ";

            if (cc.getMUIHelper().display_format == "QTY_FORMAT" ||
                cc.getMUIHelper().display_format == "MONEY_FORMAT") {
                a = "text-align:end ";
                if (cellValue == null || cellValue == "0" || cellValue == 0)
                    cellValue = "";
                else
                    cellValue = dfq.format(Util.extractNumber(cellValue));
                if (that.mColCode.length > 0 && Util.nvl(oData[i][that.mColCode], "") == "")
                    styleadd = "color:maroon;font-weight:bold;border-top:groove;";
            }
            if (that.mColCode.length > 0 && Util.nvl(oData[i][that.mColCode], "") == "" && cc.mColName == that.mColName) {
                a = "text-align:end ";
                styleadd = "color:maroon;font-weight:bold;";
            }
            styleadd += a;

            styleadd = (styleadd.length > 0 ? ' style="' : "") + styleadd + (styleadd.length > 0 ? '"' : "");
            classadd = (classadd.length > 0 ? ' class="' : "") + classadd + (classadd.length > 0 ? '"' : "");
            tmpv2 = (tmpv2.length > 0 ? ' colspan="' : "") + tmpv2 + (tmpv2.length > 0 ? '"' : "");
            rs += "<td" + tmpv2 + classadd + styleadd + " > " + Util.nvl(Util.htmlEntities(spcAdd + cellValue), "") + "</td>";
        }

        rs = "<tr>" + rs + "</tr>";//+strch ;

        var child = [];
        for (var v in oData[i]) {
            child = []
            if (v.startsWith("childeren_")) {
                child.push(oData[i][v]);
                rs += _getRowData2(0, child);
            }
        }

        return rs;
    }
    var footerCodes = {};

    var sett = sap.ui.getCore().getModel("settings").getData();
    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
    var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
    var sf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
    this.minLevel = (this.mColLevel.length > 0 && lctb.rows.length) > 1 ? parseInt(lctb.getFieldValue(0, this.mColLevel)) : 0;

    // looping mctb..
    //resetting footers to null..
    for (var k = 0; k < lctb.cols.length; k++) {
        var cn = lctb.cols[k].mColName;
        footer[cn] = null;
    }
    (recalcCHildCount ? calcChildCount() : "");
    for (var i = 0; i < lctb.rows.length; i++) {
        var current_parent = "";
        var current_code = lctb.getFieldValue(i, this.mColCode) + "";
        var current_title = lctb.getFieldValue(i, this.mColTitle) + "";
        current_parent = lctb.getFieldValue(i, this.mColParent) + "";

        if (current_parent.length > 0) {
            if (lastParent == current_parent)
                rootNode = lastParentNode;
            else {
                rootNode = findNodebyVal(current_parent);
                lastParent = current_parent;
                lastParentNode = rootNode;
            }
        }
        else
            rootNode = null;
        var oNode1 = null;
        var v = "";
        var chlds = (this.mColChild.length > 0 ? lctb.getFieldValue(i, this.mColChild) : 0);
        var footerg = undefined;
        if (chlds > 0) {
            footerCodes[current_code] = {};
            footerg = footerCodes[current_code];
        }
        //defining node
        for (var k = 0; k < lctb.cols.length; k++) {
            var vl = lctb.getFieldValue(i, lctb.cols[k].mColName);
            var lvl = -1;
            if (this.mColLevel.length > 0)
                lvl = lctb.getFieldValue(i, this.mColLevel);

            vl = (Util.nvl(vl, "") + "").replace(/\"/g, "'").replace(/\n/, "\\r").replace(/\r/, "\\r").replace(/\\/g, "\\\\").trim();

            if (lctb.cols[k].mSummary == "SUM" && chlds > 0) {
                var cn = lctb.cols[k].mColName;
                footerg[cn] = (Util.nvl(footerg[cn], 0) == 0 ? 0 : Util.nvl(footerg[cn], 0)) + parseFloat(Util.nvl(vl, '0'));
            } else if (chlds > 0)
                footerg[lctb.cols[k].mColName] = null;



            if (lctb.cols[k].mSummary == "SUM" && lvl == this.minLevel) {
                var cn = lctb.cols[k].mColName;
                footer[cn] = (Util.nvl(footer[cn], 0) == 0 ? 0 : Util.nvl(footer[cn], 0)) + parseFloat(Util.nvl(vl, '0'));

            }
            if (lctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                lctb.cols[k].getMUIHelper().display_format == "MONEY_FORMAT") {
                vl = (vl.length == 0 ? "" : df.format(parseFloat(vl)));
            }

            if (lctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                lctb.cols[k].getMUIHelper().display_format == "QTY_FORMAT") {
                vl = (vl.length == 0 ? "" : dfq.format(parseFloat(vl)));
            }
            if (lctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                lctb.cols[k].valOnZero != undefined && parseFloat(vl) == 0) {
                vl = lctb.cols[k].valOnZero;
            }


            if (lctb.cols[k].getMUIHelper().data_type == "DATE" &&
                lctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                vl = dt;// sf.format(dt);
            }
            if (lctb.cols[k].getMUIHelper().data_type != "DATE" &&
                lctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                vl = sf.format(dt);
            }


            v += (v.length == 0 ? "" : ",") + '"' +
                lctb.cols[k].mColName + '":"' +
                vl + '"';
            if (k == lctb.cols.length - 1)
                v += (v.length == 0 ? "" : ",") + "\"_rowid\":" + i;

        }

        //v = v.replace(/\\/g, "\\\\");
        oNode1 = JSON.parse("{" + Util.nvl(v, "") + "}");


        if (rootNode == null || rootNode == undefined) {
            itemsByID.push(oNode1);
        }
        else {
            rootNode["childeren_" + i] = oNode1;
        }
        mapNodes[current_code] = oNode1;
    }
    //this.mTree.setFixedBottomRowCount(-1);
    for (var fg in footerCodes) {
        mapNodes[fg]["childeren_-999"] = footerCodes[fg]
        if (that.mColName.length > 0)
            footerCodes[fg][that.mColName] = "Total " + findNodebyVal(fg)[that.mColName];

    }

    if (footer != {}) {
        for (var f in footer) {
            if (lctb.getColByName(f).getMUIHelper().display_format == "MONEY_FORMAT")
                footer[f] = df.format(footer[f]);
            if (lctb.getColByName(f).getMUIHelper().display_format == "QTY_FORMAT")
                footer[f] = dfq.format(footer[f]);
        }

        itemsByID.push(footer);

        this.mTree.setFixedBottomRowCount(1);
    }

    var str = getHTMLText();
    return str;
    // return itemsByID;



}