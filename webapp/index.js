




sap.ui.localResources("bin");
sap.ui.localResources("i18n");
var UtilGen;
var Util;
var LocalTableData;
var Gauge;
var QueryView;
var GridView;
var SearchText;
var SelectText;
var ReportUtils;
var printJS;
var jsPDF;
var html2pdf;
var rtrerex;
// $('<div class=loadingDiv>Loading libraries</div>').prependTo(document.body);
//     $("#load").text("");

sap.ui.getCore().attachInit(function () {
    // pdfjsLib = window['pdfjs-dist/build/pdf'];
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

    Util = sap.ui.require("sap/ui/ce/generic/Util");
    jQuery.sap.require("sap.m.library");
    jQuery.sap.require("sap.uxap.library");

    // jQuery.sap.require("sap.viz.library");
    // jQuery.sap.require("sap.ui.table.library");
    // jQuery.sap.require("sap.ui.layout.library");
    // jQuery.sap.require("sap.ui.commons.library");
    // jQuery.sap.require("sap.f.ShellBar");

    sap.ui.getCore().loadLibrary("sap.ui.layout");
    sap.ui.getCore().loadLibrary("sap.viz");
    sap.ui.getCore().loadLibrary("sap.ui.table");
    sap.ui.getCore().loadLibrary("sap.ui.commons");
    // sap.ui.getCore().loadLibrary("sap.f.ShellBar");
    jQuery.sap.require("sap.f.ShellBar");
    
    UtilGen = sap.ui.require("sap/ui/ce/generic/UtilGen");
    ReportUtils = sap.ui.require("sap/ui/ce/generic/ReportUtils");
    SearchText = sap.ui.require("sap/ui/ce/generic/SearchText");
    SelectText = sap.ui.require("sap/ui/ce/generic/SelectText");

    LocalTableData = sap.ui.require("sap/ui/ce/generic/LocalTableData");
    Gauge = sap.ui.require("sap/ui/ce/generic/Gauge");
    QueryView = sap.ui.require("sap/ui/ce/generic/QueryView");
    FormView = sap.ui.require("sap/ui/ce/generic/FormView");
    ReportView = sap.ui.require("sap/ui/ce/generic/ReportView");
    GridView = sap.ui.require("sap/ui/ce/generic/GridView");


    var oCompContainer = new sap.ui.core.ComponentContainer({
        height: "100%",
        settings: {
            id: "sap.ui.ce"
        }
    }
    );

    var oComponent = sap.ui.component({
        name: "sap.ui.ce.bin",
        manifestFirst: true,
        async: true
    }).then(function (oComponent) {
        oCompContainer.setComponent(oComponent);
    });
    document.getElementById("imgChn").remove();;
    //            Util.stopSpin();
    new sap.m.Shell({
        app: oCompContainer,
        showLogout: false
    }).placeAt("content");

});
window.onbeforeunload = function (e) {
    return 'Are you sure you want to leave? ';
};
