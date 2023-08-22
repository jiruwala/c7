//FOR LOCALTABLE PARSING DATA
var dt = Util.execSQL("select..");
if (dt.ret == "SUCCESS" && dt.data.length > 0) {
    var ld = new LocalTableData();
    ld.parseCol("{" + dt.data + "}");
    ld.getColByName("PATH").mHideCol = true;
    ld.getColByName("PARENTACC").mHideCol = true;
    ld.parse("{" + dt.data + "}", true);
}

// general codes


var dtx = Util.execSQLWithData("select...", "No data found ..");

var dt = Util.execSQL("select..");
if (dt.ret == "SUCCESS" && dt.data.length > 0) {
    var dtxM = JSON.parse("{" + dt.data + "}").data;
    txt.setValue(dtxM[0].SS_TITLE_1);
}

//dlg dialog creation

var dlg = new sap.m.Dialog({
    title: Util.getLangText("parameters"),
    contentWidth: "400px",
    contentHeight: "300px",
    content: [vb],
    buttons: [
        new sap.m.Button({
            text: Util.getLangText("closeTxt"),
            press: function () {
                dlg.close();
            }
        })

    ]
});
dlg.open();

//creating queryview for editing


var qr = new QueryView("qryRcptInvs" + that2.timeInLong);
this.qv.getControl().setEditable(true);
qr.getControl().view = that2;
qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
qr.getControl().setFixedBottomRowCount(0);
qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
qr.getControl().setVisibleRowCount(10);
qr.insertable = false;
qr.deletable = false;


//for fetching data and parse it to table

var dt = Util.execSQL("select..");
if (dt.ret == "SUCCESS") {
    qr.setJsonStrMetaData("{" + dt.data + "}");
    var c = qv.mLctb.getColPos("DEBIT");
    qv.mLctb.cols[c].getMUIHelper().display_format = "MONEY_FORMAT";
    qv.mLctb.cols[qv.mLctb.getColPos("NET_AMT")].mHideCol = true;
    qv.mLctb.parse("{" + dt.data + "}", true);
    qv.loadData();
}



// for valuehelp 
var a = {
    change: function (e) {
        UtilGen.Search.getLOVSearchField("select name from acaccount where isbankcash='Y' and accno = ':CODE'", that.frm.objs["qry1.code"].obj, undefined, that.frm.objs["qry1.codename"].obj);
    },
    valueHelpRequest: function (e) {
        var sett = sap.ui.getCore().getModel("settings").getData();
        var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

        UtilGen.Search.do_quick_search(e, this,
            "select Accno code,Name title from acaccount where childcount=0 and isbankcash='Y' order by path ",
            "select accno code,name title from acaccount where accno=:CODE", that.frm.objs["qry1.codename"].obj);
    }
}