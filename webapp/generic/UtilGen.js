sap.ui.define("sap/ui/ce/generic/UtilGen", [],
    function () {
        "use strict";
        var UtilGen = {
            chartHtmlText: '  <style type="text/css"> ' +
                '#chart-container { ' +
                'position: absolute; ' +
                'top: 10%; ' +
                'padding-left: 20vw;!important;' +
                //            'left:20%; ' +
                'height: auto; ' +
                'transform: translate(-50%, -50%)' +
                //        'width: calc(100% - 80px); ' +
                'z-index: 1; ' +
                'border-color: rgba(217, 83, 79, 0.9); ' +
                '}' +
                '.orgchart {' +
                'background: rgba(255,255,255,0.75);' +
                '}' +
                '@media screen and (max-width: 400px) { ' +
                ' #chart-container {' +
                'padding-left: 20px;' +
                '}' +
                '</style>' +
                ' <div id="chart-container"></div>'
            ,
            ajaxPre: "",
            createToolbar: function () {
                var that = this;
                var menuBar = new sap.m.Bar({
                    contentLeft: [new sap.m.Button({
                        icon: "sap-icon://home",
                        text: "",
                        press: function () {
                            document.location.href = "/?clearCookies=true";
                        }
                    }),
                    new sap.m.Button({
                        icon: "sap-icon://product",
                        text: "",
                        press: function () {
                            that.showApps();
                        }

                    }),
                    ],
                    contentMiddle: [new sap.m.Label({
                        text: "{selectedP>/name}",
                        textAlign: "Center",
                        design: "Bold"
                    })],

                    contentRight: [new sap.m.Button({
                        icon: "sap-icon://drop-down-list",
                        tooltip: "Select another role !",
                        press: function (e) {
                            oController.select_profile(e);
                        }
                    })
                    ]

                });
                menuBar.addStyleClass("sapContrast sapMIBar");
                return menuBar;
            },
            nvl: function (val1, val2) {
                return ((val1 == null || val1 == undefined || val1.length == 0) ? val2 : val1);
            },
            nvlObjToStr: function (val1, val2) {
                return ((val1 == null || val1 == undefined || val1.length == 0) ? val2 + "" : val1 + "");
            },
            clearPage: function (pg) {
                var xx = [];
                for (var i in pg.getContent())
                    xx.push(pg.getContent()[i]);
                for (var i in xx) {
                    pg.removeContent(xx[i]);
                    // if (xx[i].hasOwnProperty("getItems")) {
                    //     for (var ii in xx[i].getItems())
                    //         xx[i].getItems()[ii].destroy();
                    // }
                    // if (xx[i].hasOwnProperty("getContent")) {
                    //     for (var ii in xx[i].getContent())
                    //         xx[i].getContent()[ii].destroy();
                    // }

                    xx[i].destroy();
                }

                pg.removeAllContent();
            },
            showApps: function () {
                var dlg = new sap.m.Dialog({
                    title: "Select the App",
                    contentWidth: "100%",
                    contentHeight: "60%"
                });
                var flx = new sap.m.FlexBox();
                dlg.addContent();
                dlg.open();
            },
            initProdListModel: function (view) {
                var ResourceModel = sap.ui.model.resource.ResourceModel;
                var sLangu =
                    sap.ui.getCore().getConfiguration().getLanguage();
                var oLangu = new ResourceModel(
                    {
                        bundleUrl: "../i18n/i18n.properties",

                        "bundleLocale": sLangu
                    });
                view.setModel(oLangu, "i18n");
            },
            getProdList2Data: function (i18nMdl) {
                var data = {
                    "prods": [
                        {
                            "code": "01",
                            "name": i18nMdl.getProperty("fin_1")
                        },
                        {
                            "code": "02",
                            "name": i18nMdl.getProperty("fin_2")
                        },
                        {
                            "code": "03",
                            "name": i18nMdl.getProperty("fin_3")
                        },
                        {
                            "code": "04",
                            "name": i18nMdl.getProperty("fin_4")
                        },
                        {
                            "code": "04",
                            "name": i18nMdl.getProperty("fin_6")
                        },
                        {
                            "code": "05",
                            "name": i18nMdl.getProperty("fin_7")
                        },
                        {
                            "code": "06",
                            "name": i18nMdl.getProperty("fin_8")
                        },
                        {
                            "code": "07",
                            "name": i18nMdl.getProperty("fin_9")
                        },
                        {
                            "code": "08",
                            "name": i18nMdl.getProperty("fin_10")
                        }
                    ]
                };
                return data;
            },
            createProdListPage: function (view) {
                var data = this.getProdList2Data(view.getModel('i18n'));
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(data);
                view.setModel(oModel);
                view.txt = new sap.m.Label({ text: "" });

                var oList = new sap.m.List({
                    headerText: "Product Lists",
                    id: "mainList", // sap.ui.core.ID
                    inset: false, // boolean
                    visible: true, // boolean
                    mode: sap.m.ListMode.None, // sap.m.ListMode
                    width: '100%', // sap.ui.core.CSSSize
                    showSeparators: sap.m.ListSeparators.All, // sap.m.ListSeparators
                }).addStyleClass("sapContrast");

                var actionListItem = new sap.m.ActionListItem("action",
                    {
                        text: "{name}",
                        customData: [{ key: "{code}" }],
                        press: function (oControlEvent) {
                            view.splitApp.to("detailPage", "slide");
                            var oPressedItem = view.getModel().getProperty(this.getBindingContext().getPath());
                            var cod = oControlEvent.getSource().getCustomData()[0].getKey();
                            var prod = "products/";
                            if (typeof callFromProd2 == 'undefined')
                                prod = "";
                            if (cod == "01")
                                document.location.href = prod + "gl.html";
                            if (cod == "02")
                                document.location.href = prod + "construction.html";
                            if (cod == "03")
                                document.location.href = prod + "pursale.html";
                            if (cod == "04")
                                document.location.href = prod + "inventory.html";
                            if (cod == "05")
                                document.location.href = prod + "fa.html";
                            if (cod == "06")
                                document.location.href = prod + "pmr.html";
                            if (cod == "07")
                                document.location.href = prod + "pos.html";
                            if (cod == "08")
                                document.location.href = prod + "ia.html";
                            if (cod == "09")
                                document.location.href = prod + "lg.html";


                            // that.splitApp.to("detailPage", "slide");
                            // var oPressedItem = that.getModel().getProperty(view.getBindingContext().getPath());
                            // var cod = oControlEvent.getSource().getCustomData()[0].getKey();
                            //
                            // if (cod == "01")
                            //     that.showGraphGL();
                            // if (cod == "02")
                            //     that.showGraphRM();
                            // if (cod == "03")
                            //     that.showGraphPurSale();
                            //

                        }
                    });

                oList.bindItems("/prods", actionListItem);
                view.splitApp = new sap.m.SplitApp("prod2App", {});
                view.pg = new sap.m.Page({
                    showHeader: false,
                    content: [oList]
                });
                var bar1 = this.createBar(this.nvl(view.pageTitle, "-"), true);
                view.pg2 = new sap.m.Page("detailPage", {
                    customHeader: bar1,
                    showHeader: true,
                    content: []
                });

                view.splitApp.addMasterPage(view.pg);
                view.splitApp.addDetailPage(view.pg2);

                view.mainPage = new sap.m.Page({
                    showHeader: true,
                    customHeader: view.custBar,
                    content: [view.splitApp]
                }).addStyleClass("sapContrast");

            },
            createBar: function (lblId, pBackMaster) {
                var backMaster = this.nvl(pBackMaster, true);
                var b = new sap.m.Button({
                    icon: "sap-icon://full-screen",
                    press: function () {
                        var app = sap.ui.getCore().byId("prod2App");
                        if (app.getMode() == sap.m.SplitAppMode.HideMode)
                            app.setMode(sap.m.SplitAppMode.ShowHideMode);
                        else
                            app.setMode(sap.m.SplitAppMode.HideMode);

                    }
                });
                var flRight = new sap.m.FlexBox({ direction: sap.m.FlexDirection.Row, items: [b] });
                var flLeft = new sap.m.FlexBox({
                    direction: sap.m.FlexDirection.Row, items: [new sap.m.Button({
                        icon: "sap-icon://arrow-left",
                        press: function () {
                            var app = sap.ui.getCore().byId("prod2App");
                            if (!sap.ui.Device.system.phone) {
                                //app.toDetail(app.getDetailPages()[0]);
                                app.backDetail();
                                if (pBackMaster)
                                    app.toMaster(app.getMasterPages()[0]);
                            } else {
                                app.backMaster();
                                app.toMaster(app.getMasterPages()[0]);
                                // if (backMaster)
                                //     app.showMaster();
                            }
                        }
                    })]
                });
                var flMiddle = new sap.m.FlexBox({
                    direction: sap.m.FlexDirection.Row, items: [new sap.m.Label({
                        text: lblId,
                        textAlign: "Center",
                        design: "Bold"
                    })]
                });

                var oBar = new sap.m.Bar({
                    contentLeft: [flLeft],
                    contentMiddle: [flMiddle],

                    contentRight: [flRight]

                }).addStyleClass("sapContrast sapMIBar");
                return oBar;
            },
            select_screen: function (oController) {
                if (oController.oFragment === undefined)
                    oController.oFragment = sap.ui.jsfragment("bin.Screens", oController);
                oController.oFragment.open();

            },
            // get index no by key value in combbox
            getIndexByKey: function (cb, kyval) {
                for (var i = 0; i < cb.getItems().length; i++) {
                    if (cb.getItems()[i].getKey() == kyval)
                        return cb.getItems()[i];
                }
            },
            cookieGet: function (cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            },
            cookieSet: function setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            },
            cookieDelete: function (cname) {
                document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            },
            createControl: function (component, view, id, setting, fldtype, fldFormat, fnChange, sqlStr) {

                var s = this.nvl(setting, {});
                if (Util.nvl(id, "") != "")
                    (view.byId(id) != undefined ? view.byId(id).destroy() : null);
                var c;
                if (Util.nvl(id, "") != "")
                    c = new component(view.createId(id), s).addStyleClass("sapUiSizeCondensed");
                else
                    c = new component(s).addStyleClass("sapUiSizeCondensed");
                if (fldtype != undefined)
                    c.field_type = fldtype;
                if (fnChange != undefined)
                    c.fnChange = fnChange;
                if (c instanceof sap.m.InputBase)
                    c.attachChange(function (oEvent) {
                        var _oInput = oEvent.getSource();
                        var val = _oInput.getValue();
                        if (_oInput.getCustomData().length == 0)
                            _oInput.addCustomData(new sap.ui.core.CustomData({ key: val }))
                        else
                            _oInput.getCustomData()[0].setKey(val);

                    });
                if (c instanceof sap.m.SearchField)
                    c.attachChange(function (oEvent) {
                        var _oInput = oEvent.getSource();
                        var val = _oInput.getValue();
                        if (_oInput.getCustomData().length == 0)
                            _oInput.addCustomData(new sap.ui.core.CustomData({ key: val }))
                        else
                            _oInput.getCustomData()[0].setKey(val);

                    });
                if (fldtype == "number" && (c instanceof sap.m.Input)) {
                    c.setTextAlign(sap.ui.core.TextAlign.End);
                    c.attachLiveChange(function (oEvent) {
                        var _oInput = oEvent.getSource();
                        var val = _oInput.getValue();
                        val = val.replace(/[^\d\.-]/g, '');
                        //_oInput.setValue(val);
                        if (_oInput.getCustomData().length == 0)
                            _oInput.addCustomData(new sap.ui.core.CustomData({ key: val }))
                        else
                            _oInput.getCustomData()[0].setKey(parseFloat(val));
                    });
                    if (Util.nvl(fldFormat, "") != "") {
                        c.field_format = fldFormat;
                        c.attachChange(function (oEvent) {
                            var df = new DecimalFormat(fldFormat);
                            var _oInput = oEvent.getSource();
                            var val = _oInput.getCustomData()[0].getKey();
                            _oInput.setValue(df.format(parseFloat(val)));
                            if (_oInput.fnChange != undefined) {
                                fnChange(oEvent);
                            }
                        });
                    }
                }

                if (c instanceof sap.m.ComboBox && sqlStr != undefined) {
                    if (sqlStr.startsWith("@")) {
                        var dtxx = [];
                        var spt = sqlStr.substring(1).split(",");
                        for (var i1 in spt) {
                            var dttt = { CODE: "", NAME: "" };
                            var sx = spt[i1].split("/");
                            dttt.CODE = "" + sx[0];
                            dttt.NAME = "" + sx[1];
                            dtxx.push(dttt);
                        }
                        c.setModel(new sap.ui.model.json.JSONModel(dtxx));
                    } else {
                        var dat = Util.execSQL(sqlStr);
                        if (dat.ret == "SUCCESS" && dat.data.length > 0) {
                            var dtx = JSON.parse("{" + dat.data + "}").data;
                            c.setModel(new sap.ui.model.json.JSONModel(dtx));
                        }
                    }
                }
                if (c instanceof sap.m.ListBase && sqlStr != undefined) {
                    if (sqlStr.startsWith("@")) {
                        var dtxx = [];
                        var spt = sqlStr.substring(1).split(",");
                        for (var i1 in spt) {
                            var dttt = { CODE: "", NAME: "" };
                            var sx = spt[i1].split("/");
                            dttt.CODE = "" + sx[0];
                            dttt.NAME = "" + sx[1];
                            dtxx.push(dttt);
                        }
                        c.setModel(new sap.ui.model.json.JSONModel(dtxx));
                    } else {
                        var dat = Util.execSQL(sqlStr);
                        if (dat.ret == "SUCCESS" && dat.data.length > 0) {
                            var dtx = JSON.parse("{" + dat.data + "}").data;
                            c.setModel(new sap.ui.model.json.JSONModel(dtx));
                        }
                    }
                }

                if (c.getCustomData().length == 0)
                    c.addCustomData(new sap.ui.core.CustomData({ key: "" }));

                if (c instanceof sap.m.DatePicker) {
                    var sett = sap.ui.getCore().getModel("settings").getData();
                    c.setValueFormat(sett["ENGLISH_DATE_FORMAT"]);
                    c.setDisplayFormat(sett["ENGLISH_DATE_FORMAT"]);
                    if (this.nvl(fldFormat, "") != "") {
                        c.setValueFormat(fldFormat);
                        c.setDisplayFormat(fldFormat);
                    }

                }
                return c;

            },
            getControlValue(comp) {
                var customVal = "";
                if (comp instanceof sap.m.InputBase && comp.getCustomData != undefined && comp.getCustomData().length > 0)
                    customVal = comp.getCustomData()[0].getKey();
                if (comp instanceof sap.m.SearchField && comp.getCustomData != undefined && comp.getCustomData().length > 0)
                    customVal = comp.getCustomData()[0].getKey();

                if (customVal == "NaN")
                    customVal = "";
                if (customVal == "false" && !(comp instanceof sap.m.CheckBox))
                    customVal = "";
                if (comp instanceof sap.m.Text)
                    return this.nvl(customVal, comp.getText());
                if (comp instanceof sap.m.Label)
                    return comp.getText();
                if (comp instanceof sap.m.SearchField)
                    return this.nvl(customVal, comp.getValue());
                if (comp instanceof sap.m.DatePicker)
                    return comp.getDateValue();
                if (comp instanceof sap.m.DateTimePicker)
                    return comp.getDateValue();
                if (comp instanceof sap.m.ComboBoxBase)
                    return this.nvl(comp.getSelectedKey(), comp.getValue());
                if (comp instanceof sap.m.ListBase)
                    return (Util.nvl(comp.getSelectedItem(), undefined) != undefined ?
                        this.nvl(comp.getSelectedItem().getCustomData()[0], "") : "");
                if (comp instanceof sap.m.CheckBox)
                    if (comp.trueValues != undefined)
                        return (comp.getSelected() ? comp.trueValues[0] : comp.trueValues[1]);
                    else
                        return (comp.getSelected() ? "Y" : "N");
                if (comp instanceof sap.m.InputBase)
                    return this.nvl(customVal, comp.getValue());

            }
            ,
            setControlValue: function (comp, pVal, pCustomVal, executeChange) {
                var val = this.nvl(pVal, "") + "";
                var customVal = Util.nvl(pCustomVal, Util.nvl(pVal, ""));
                if ((!comp instanceof sap.m.InputBase) && comp.field_type != undefined && comp.field_type == "number") {
                    val = val.replace(/[^\d\.-]/g, '');
                    if (comp.getCustomData().length == 0)
                        comp.addCustomData(new sap.ui.core.CustomData({ key: val }))
                    else
                        comp.getCustomData()[0].setKey(parseFloat(val));

                    if (comp.setText != undefined)
                        comp.setText(val);

                    if (comp.setValue != undefined)
                        comp.setValue(val);


                    if (executeChange && comp.hasOwnProperty("fireChange"))
                        comp.fireChange();
                    // return;
                } else if (comp instanceof sap.m.ComboBoxBase) {
                    comp.setSelectedItem(this.getIndexByKey(comp, Util.nvl(pCustomVal, val)));
                    if (comp.getCustomData().length == 0)
                        comp.addCustomData(new sap.ui.core.CustomData({ key: customVal }))
                    else
                        comp.getCustomData()[0].setKey(customVal);

                    if (executeChange)
                        comp.fireChange();

                } else if (comp instanceof sap.m.ListBase) {
                    comp.setSelectedItem(this.getIndexByKey(comp, Util.nvl(pCustomVal, val)));
                    if (executeChange)
                        comp.fireChange();

                } else if (comp instanceof sap.m.Text) {
                    comp.setText(val);
                    // if (customVal.length > 0)
                    if (comp.getCustomData().length == 0)
                        comp.addCustomData(new sap.ui.core.CustomData({ key: customVal }))
                    else
                        comp.getCustomData()[0].setKey(customVal);


                } else if (comp instanceof sap.m.DatePicker) {

                    if (this.nvl(pVal, "").length == 0)
                        comp.setDateValue(null);
                    else {
                        var pvx = (typeof pVal == "string" ? pVal.replaceAll(".", ":") : pVal);
                        comp.setDateValue(new Date(pvx));
                    }

                    if (executeChange)
                        comp.fireChange();

                } else if (comp instanceof sap.m.CheckBox) {
                    if (comp.trueValues != undefined)
                        (val == comp.trueValues[0] ? comp.setSelected(true) : comp.setSelected(false));
                    if (executeChange)
                        comp.fireSelect();

                } else if ((!(comp instanceof sap.m.ComboBox)) &&
                    comp instanceof sap.m.InputBase || comp instanceof sap.m.SearchField
                ) {
                    comp.setValue(val);
                    // if (customVal.length > 0)
                    if (comp.getCustomData().length == 0)
                        comp.addCustomData(new sap.ui.core.CustomData({ key: customVal }))
                    else
                        comp.getCustomData()[0].setKey(customVal);
                    if (comp instanceof sap.m.InputBase && executeChange)
                        comp.fireChange();
                }
                else if (comp != undefined && comp.hasOwnProperty("value")) {
                    comp.value = pVal;
                }

                if (comp != undefined && comp.hasOwnProperty("onSetField")) {
                    comp.onSetField(pVal);
                }


            },
            formCreate2: function (title, editable, content, pHbSet, classCont, contSetting, contCssClass, lastAddVB) {
                var cc = Util.nvl(contCssClass, "");
                if (contSetting != undefined && contSetting.hasOwnProperty("width")) {
                    if (typeof contSetting.width == "object") {
                        var newr = "L";
                        if (sap.ui.Device.resize.width <= 639)
                            newr = "S";
                        if (sap.ui.Device.resize.width > 640 && sap.ui.Device.resize.width <= 1007)
                            newr = "M";
                        if (sap.ui.Device.resize.width > 1007)
                            newr = "L";
                        contSetting.width = contSetting.width[newr] + "px";
                        console.log("DEVICE " + newr + " -width=" + sap.ui.Device.resize.width + " records=" + contSetting.width);
                    }
                }
                var sc = new classCont(Util.nvl(contSetting, {})).addStyleClass(cc);
                if (Util.nvl(contSetting, {}).hasOwnProperty("cssText")) {
                    setTimeout(function () {
                        var ar = [].concat(contSetting["cssText"]);
                        for (var ix in ar)
                            sc.$().css("cssText", ar);
                    }, 50);
                }
                if (Util.nvl(contSetting, {}).hasOwnProperty("css")) {
                    setTimeout(function () {
                        var ar = {}.concat(contSetting["css"]);
                        sc.$().css(contSetting["css"]);
                    }, 50);
                }

                var totWd = Util.nvl(Util.nvl(contSetting, {})["width"], "600px").replace("px", "");

                var fnAdd = function (cnt) {
                    if (typeof sc.addItem == "function")
                        sc.addItem(cnt);
                    else if (typeof sc.addContent == "function")
                        sc.addContent(cnt);
                };

                var cnt = [];
                var hz = [];
                var hbSet = Util.nvl(pHbSet, {});
                // if (hbSet.hasOwnProperty("width"))
                //     hbSet["width"] = "100%";
                if (hbSet.hasOwnProperty("height"))
                    hbSet["height"] = "24px";
                var hb = new sap.m.HBox(hbSet);

                for (var i in content) {
                    if (content[i] == undefined) {
                        console.log("form element " + i + " is undefined !");
                        continue;
                    }
                    fnAdd(hb);
                    if (typeof content[i] === "string" && !content[i].startsWith("@") &&
                        !content[i].startsWith("#")) {
                        var cn = {};
                        try {
                            cn = JSON.parse(content[i]);
                        } catch (e) {
                            cn = { text: content[i] };
                        }
                        var setx = cn;
                        if (setx.hasOwnProperty("width") && setx["width"].endsWith("%")) {
                            var wd = (totWd / 100) * Util.extractNumber(setx["width"]);
                            setx["width"] = wd + "px";
                        }
                        if (Util.isCamelCase(setx["text"])) setx["text"] = Util.getLangText(setx["text"]);
                        var lbl = new sap.m.Label(setx);
                        if (setx.hasOwnProperty("styleClass"))
                            lbl.addStyleClass(setx["styleClass"]);
                        hb = new sap.m.HBox(hbSet);
                        fnAdd(hb);
                        hb.addItem(lbl);

                    } else if (typeof content[i] === "string" && content[i].startsWith("@")) {
                        var cn = {};
                        try {
                            cn = JSON.parse(content[i].substr(1));
                        } catch (e) {
                            cn = { text: content[i].substr(1) };
                        }

                        var setx = cn;
                        if (setx.hasOwnProperty("width") && setx["width"].endsWith("%")) {
                            var wd = (totWd / 100) * Util.extractNumber(setx["width"]);
                            setx["width"] = wd + "px";
                        }
                        if (Util.isCamelCase(setx["text"])) setx["text"] = Util.getLangText(setx["text"]);
                        var lbl = new sap.m.Label(setx);
                        if (setx.hasOwnProperty("styleClass"))
                            lbl.addStyleClass(setx["styleClass"]);
                        hb.addItem(lbl);
                        // cnt.push(new sap.m.Text(setx));
                    } else if (typeof content[i] === "string" && content[i].startsWith("#")) {
                        var cn = {};
                        try {
                            cn = JSON.parse(content[i].substr(1));
                        } catch (e) {
                            cn = { text: content[i].substr(1) };
                        }
                        var setx = cn;
                        if (setx.hasOwnProperty("width") && setx["width"].endsWith("%")) {
                            var wd = (totWd / 100) * Util.extractNumber(setx["width"]);
                            setx["width"] = wd + "px";
                        }
                        var lbl = new sap.m.Title(setx);
                        if (setx.hasOwnProperty("styleClass"))
                            lbl.addStyleClass(setx["styleClass"]);
                        if (setx.hasOwnProperty("style"))
                            lbl.$().attr("style", setx["style"]);
                        if (Util.isCamelCase(setx["text"])) setx["text"] = Util.getLangText(setx["text"]);
                        hb = new sap.m.HBox(hbSet);
                        fnAdd(hb);
                        hb.addItem(lbl);
                        // hb.addItem(new sap.m.Title({text: content[i].substr(1)}));
                        // hb = new sap.m.HBox(hbSet);
                        // fnAdd(hb);
                        // hb.addItem(new sap.m.Title({text: content[i].substr(1)}));
                    }
                    else {
                        if (typeof content[i].setWidth == "function" && content[i].getWidth().endsWith("%")) {
                            var wd = (totWd / 100) * Util.extractNumber(content[i].getWidth());
                            content[i].setWidth(wd + "px");
                        }
                        hb.addItem(content[i]);

                    }
                    hb.addStyleClass("formRow");

                }
                if (lastAddVB != undefined)
                    fnAdd(new sap.m.VBox({ height: lastAddVB }));
                return sc;
            }
            ,
            //---------------------------------------------------------------------------------------------------------
            // all value labelspan , emptyspan == small, medium , large, xlarge-----------------
            //---------------------------------------------------------------------------------------------------------
            formCreate: function (title, editable, content, labelSpan, emptySpan, columns, spanForLabel) {
                var ls = labelSpan;
                var es = emptySpan;
                var cs = columns;
                var ed = false;
                var cnt = [];
                var prev_span = Util.nvl(spanForLabel, "");
                if (editable)
                    ed = true;
                if (labelSpan == undefined || labelSpan.length == 0)
                    ls = [12, 3, 3, 2];
                if (emptySpan == undefined || emptySpan.length == 0)
                    es = [0, 2, 2, 2];
                if (columns == undefined || columns.length == 0)
                    cs = [1, 2, 2];
                for (var i in content) {
                    if (content[i] == undefined) {
                        console.log("form element " + i + " is undefined !");
                        continue;
                    }
                    if (typeof content[i] === "string" && !content[i].startsWith("@") &&
                        !content[i].startsWith("#")) {

                        var cn = {};
                        try {
                            cn = JSON.parse(content[i]);
                        } catch (e) {
                            cn = { text: content[i] };
                        }
                        var setx = cn;
                        setx["width"] = "auto";
                        delete cn.width;
                        delete cn.textAlign;
                        if (prev_span != "")
                            setx["layoutData"] = new sap.ui.layout.GridData({ span: prev_span });

                        if (Util.isCamelCase(setx["text"])) setx["text"] = Util.getLangText(setx["text"]);
                        cnt.push(new sap.m.Label(setx));
                    }
                    else if (typeof content[i] === "string" && content[i].startsWith("@")) {
                        var setx = { text: content[i].substr(1), /* textAlign: sap.ui.core.TextAlign.Right*/ };
                        var cn = {};
                        try {
                            cn = JSON.parse(content[i].substr(1));

                        } catch (e) {
                            cn = { text: content[i].substr(1) };
                        }

                        var setx = cn;
                        if (prev_span != "")
                            setx["layoutData"] = new sap.ui.layout.GridData({ span: prev_span });
                        setx["width"] = "auto";
                        delete cn.width;
                        delete cn.textAlign;
                        if (Util.isCamelCase(setx["text"])) setx["text"] = Util.getLangText(setx["text"]);
                        cnt.push(new sap.m.Text(setx));
                    }
                    else if (typeof content[i] === "string" && content[i].startsWith("#")) {
                        var str = content[i].substr(1);
                        if (Util.isCamelCase(str)) str = Util.getLangText(str);
                        cnt.push(new sap.ui.core.Title({ text: str }));
                    } else {
                        if (typeof content[i].setWidth == "function")
                            content[i].setWidth("auto");
                        cnt.push(content[i]);
                    }
                    // if (cnt[cnt.length - 1].getLayoutData() != undefined)
                    //     prev_span = cnt[cnt.length - 1].getLayoutData().getSpan();
                    // else prev_span = "";
                }

                return new sap.ui.layout.form.SimpleForm({

                    editable: ed,
                    layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                    labelSpanXL: ls[3],
                    labelSpanL: ls[2],
                    labelSpanM: ls[1],
                    labelSpanS: ls[0],
                    adjustLabelSpan: false,
                    emptySpanXL: es[3],
                    emptySpanL: es[2],
                    emptySpanM: es[1],
                    emptySpanS: es[0],
                    columnsXL: cs[2],
                    columnsL: cs[1],
                    columnsM: cs[0],
                    singleContainerFullSize: false,
                    content: cnt,
                    toolbar: new sap.m.Toolbar({
                        content: [
                            new sap.m.Title({ text: title, level: "H4", titleStyle: "H4" }),
                        ]
                    })
                });
            },
            addControl(ar, lbl, cntClass, id, sett, dataType, fldFormat, view, fnchange, sqlStr) {
                var setx = sett;
                var idx = id;
                if (Util.nvl(id, "") == "")
                    idx = lbl.replace(/[ ||,||.||\/||@||#]/g, "");
                if (Util.nvl(id, "").endsWith("_")) {
                    idx = id + lbl.replace(/[ ||,||.||\/||@||#]/g, "");
                    if (lbl.startsWith("@") || lbl.startsWith("#"))
                        idx = lbl.substr(1, 1) + idx;
                }
                var cnt = this.createControl(cntClass, view, idx, setx, dataType, fldFormat, fnchange, sqlStr);
                var vb = true;
                if (cnt.getVisible != undefined)
                    vb = cnt.getVisible();
                if (vb && lbl.length != 0)
                    ar.push(lbl);
                if (vb) ar.push(cnt);
                return cnt;
            }
            ,
            formAddItem(frm, label, controls) {
                frm.addContent(new sap.m.Label({ text: label }));
                if (controls instanceof Array)
                    for (var i in controls)
                        frm.addContent(controls[i]);
                else
                    frm.addContent(controls);
            }
            ,
            getSQLInsertString: function (tbl, flds, excFlds, datesWithTime) {

                var hma = "";
                var ohma = "";
                if (datesWithTime) {
                    hma = " h mm a";
                    ohma = " HH MI AM"
                }
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"] + hma);
                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);


                var kys = [];
                var str = "";
                var vl = "";

                // add additional fields and values to vls.
                if (flds != undefined)
                    for (var key in flds) {
                        str += (str.length == 0 ? "" : ",") + key;
                        vl += (vl.length == 0 ? "" : ",") + flds[key];
                    }

                for (var key in tbl) {
                    if (!key.startsWith("_") && (excFlds == undefined || excFlds.indexOf(key) < 0)) {
                        str += (str.length == 0 ? "" : ",") + key;
                        var val = this.getControlValue(tbl[key]);

                        // if (tbl[key].getCustomData().length > 0 &&
                        //     tbl[key].getCustomData()[0].getKey().trim().length > 0
                        // )
                        //     val = this.nvl(tbl[key].getCustomData()[0].getKey().trim(), tbl[key].getValue());


                        // if (tbl[key] instanceof sap.m.SearchField &&
                        //     tbl[key].getCustomData().length > 0)
                        //     val = this.nvl(tbl[key].getCustomData()[0].getKey(), tbl[key].getValue());
                        //
                        val = "'" + (val + "").replace("'", "''") + "'";

                        if (tbl[key] instanceof sap.m.DatePicker && tbl[key].getDateValue() != undefined)
                            val = "to_date('" + sdf.format(tbl[key].getDateValue()) + "','" + sett["ENGLISH_DATE_FORMAT"] + ohma + "')";
                        if (tbl[key] instanceof sap.m.DatePicker && tbl[key].getDateValue() == undefined)
                            val = "null";
                        if (tbl[key].field_type != undefined && tbl[key].field_type == "number")
                            val = tbl[key].getValue();
                        if (tbl[key].field_type != undefined && tbl[key].field_type == "money")
                            val = df.parse(tbl[key].getValue());

                        vl += (vl.length == 0 ? "" : ",") + val;
                    }
                }

                return "(" + str + ') values (' + vl + ")";

            }
            ,
            getSQLUpdateString: function (tbl, tbl_name, flds, where, excFlds, datesWithTime) {

                var hma = "";
                var ohma = "";
                if (datesWithTime) {
                    hma = " h mm a";
                    ohma = " HH MI AM"
                }

                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"] + hma);
                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                var kys = [];
                var str = "";
                var vl = "";

                // add additional fields and values to vls.
                if (flds != undefined)
                    for (var key in flds)
                        str += (str.length == 0 ? "" : ",") + key + "=" + flds[key];

                // put field=value in string
                for (var key in tbl) {
                    if (!key.startsWith("_") && (excFlds == undefined || excFlds.indexOf(key) < 0)) {
                        var val = this.getControlValue(tbl[key]);

                        val = "'" + (val + "").replace("'", "''") + "'";

                        if (tbl[key] instanceof sap.m.DatePicker && tbl[key].getDateValue() != undefined)
                            val = "to_date('" + sdf.format(tbl[key].getDateValue()) + "','" + sett["ENGLISH_DATE_FORMAT"] + ohma + "')";
                        if (tbl[key] instanceof sap.m.DatePicker && tbl[key].getDateValue() == undefined)
                            val = "null";
                        if (tbl[key].field_type != undefined && tbl[key].field_type == "number")
                            val = tbl[key].getValue();
                        if (tbl[key].field_type != undefined && tbl[key].field_type == "money")
                            val = df.parse(tbl[key].getValue());

                        str += (str.length == 0 ? "" : ",") + key + "=" + val;

                    }
                }

                return "update " + tbl_name + " set " + str + (this.nvl(where, "").length == 0 ? "" : " where ") + this.nvl(where, "");

            }
            ,
            loadDataFromJson(subs, dtx, executeChange) {
                for (var key in subs) {
                    var vl = dtx[key.toUpperCase()];
                    if (subs[key] != undefined && vl != undefined)
                        this.setControlValue(subs[key], vl, vl, this.nvl(executeChange, false));

                }
            }
            ,
            resetDataJson(subs) {
                for (var key in subs)
                    this.setControlValue(subs[key], "", false);

            }
            ,
            doFilterLiveTable(event, qv, flcol) {
                var flts = [];
                var val = event.oSource.getValue();
                if (Util.nvl(val, "") == "") return;
                for (var i in qv.mLctb.cols) {
                    var f = sap.ui.model.FilterOperator.Contains;
                    // if (qv.mLctb.cols[i].getMUIHelper().data_type == "NUMBER")
                    //     f = sap.ui.model.FilterOperator.EQ;
                    if (flcol.indexOf(qv.mLctb.cols[i].mColName) > -1)
                        flts.push(new sap.ui.model.Filter({
                            path: qv.mLctb.cols[i].mColName,
                            operator: f,
                            value1: val
                        }));
                }
                var f = new sap.ui.model.Filter({
                    filters: flts,
                    and: false
                });
                var lst = qv.getControl();

                var filter = new sap.ui.model.Filter(f, false);
                var binding = lst.getBinding("rows");
                binding.filter(filter);
                setTimeout(function () {
                    qv.colorRows();
                });
            }
            ,
            parseDefaultValue: function (vl) {
                var fisc = sap.ui.getCore().getModel("fiscalData").getData();

                var retVal = Util.nvl(vl, "");
                if (retVal.startsWith("#DATE_"))
                    retVal = new Date(vl.replace("#DATE_", ""));
                if (typeof retVal == "string" && retVal.startsWith("#NUMBER_"))
                    retVal = parseFloat(vl.replace("#NUMBER_", ""));
                if (typeof retVal == "string" && retVal == "$TODAY") {
                    retVal = Util.nvl(UtilGen.DBView.today_date.getDateValue(), new Date());
                    if (retVal > fisc.fiscal_to)
                        retVal = fisc.fiscal_to;
                }
                if (typeof retVal == "string" && retVal == "$FIRSTDATEOFMONTH") {
                    retVal = new Date();
                    retVal.setDate(1);
                }
                if (typeof retVal == "string" && retVal == "$FIRSTDATEOFYEAR") {
                    retVal = fisc.fiscal_from//new Date();
                    // retVal.setDate(1);
                    // retVal.setMonth(1);

                }


                return retVal;
            }
            ,
            // this function should be executed before load data in localtabledata model.
            applyCols: function (grp, qv, frag) {
                var cls = {
                    "TEXTFIELD": "sap.m.Input",
                    "DATEFIELD": "sap.m.DatePicker",
                    "DATETIMEFIELD": "sap.m.DateTimePicker",
                    "TIMEFIELD": "sap.m.TimePicker",
                    "COMBOBOX": "SelectText",
                    "CHECKBOX": "sap.m.CheckBox",
                    // "SEARCHFIELD": "SearchText",
                    "SEARCHFIELD": "sap.m.Input",
                    "LABLE": "sap.m.Label",
                    "ICON": "sap.ui.core.Icon"
                };
                var aligns = {
                    "ALIGN_LEFT": "left",
                    "ALIGN_RIGHT": "right",
                    "ALIGN_CENTER": "center"
                };

                var visibleCol = [], invisibleCol = []; // visible and invisible column to arrange first visible and then invisible in localtabledata
                var sqlStr = "select *from cp_setcols where profile=0 and setgrpcode='" + grp + "'  order by POSITION"
                var dat = Util.execSQL(sqlStr);
                if (dat.ret == "SUCCESS") {
                    var dtx = JSON.parse("{" + dat.data + "}").data;
                    //invisible all columns first and then only visible which is available.
                    for (var col in qv.mLctb.cols)
                        qv.mLctb.cols[col].mHideCol = true;
                    for (var col in dtx) {
                        var cx = qv.mLctb.getColByName(dtx[col].ITEM_NAME);
                        if (dtx[col].DISPLAY_TYPE != "INVISIBLE") {
                            cx.mHideCol = false;
                            visibleCol.push(cx);
                        }
                        cx.mEnabled = dtx[col].DISPLAY_TYPE == "DISABLED" ? false : true;
                        cx.mColClass = Util.nvl(cls[dtx[col].EDITOR_CLASS], "sap.m.Text");
                        cx.mUIHelper.display_align = Util.nvl(aligns[dtx[col].ALIGN], "center");
                        cx.mUIHelper.display_format = Util.nvl(dtx[col].USE_FORMAT, "");
                        cx.mUIHelper.display_width = Util.nvl(dtx[col].DISPLAY_WIDTH, "30");
                        cx.mUIHelper.display_style = Util.nvl(dtx[col].OTHER_STYLES, "");
                        cx.mTitle = Util.nvl(dtx[col].DESCR, dtx[col].ITEM_NAME);
                        cx.mSearchSQL = Util.nvl(dtx[col].LOV_SQL, "");
                        cx.mLookUpCols = Util.nvl(dtx[col].LOOKUP_COLUMN, "");
                        cx.mRetValues = Util.nvl(dtx[col].RETURN_VALUES, "");
                        cx.eOther = Util.nvl(dtx[col].VALIDATE_EVENT, "");
                        cx.mDefaultValue = Util.nvl(UtilGen.parseDefaultValue(dtx[col].DEFAULT_VALUE), '');
                        var paras = Util.nvl(dtx[col].PARAMS, "");
                        if (paras != "") {
                            var ps = paras.split(",");
                            for (var pi in ps) {
                                var p1 = ps[pi].split("=");
                                if (p1[0] == "parent")
                                    cx.mSearchColParent = p1[1];
                                if (p1[0] == "code")
                                    cx.mSearchColCode = p1[1];
                                if (p1[0] == "title")
                                    cx.mSearchColTitle = p1[1];
                                if (p1[0] == "childcount")
                                    cx.mSearchColChildCount = p1[1];
                            }
                        }

                        if (cx.eValidateColumn != undefined) {

                        }

                        if (cx.eOther != undefined && (cx.eOther.length > 0 || cx.whenValidate != undefined)) {
                            cx.eValidateColumn = function (evtx) {
                                var sett = sap.ui.getCore().getModel("settings").getData();
                                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
                                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                                var qf = new DecimalFormat(sett["FORMAT_QTY_1"]);
                                var row = evtx.getSource().getParent();
                                var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                                var columns = evtx.getSource().getParent().getParent().getColumns();
                                var table = evtx.getSource().getParent().getParent(); // get table control.
                                var oModel = table.getModel();
                                var rowStart = table.getFirstVisibleRow(); //starting Row index
                                var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));
                                var newValue = evtx.getParameter("value");

                                var tm = -1;
                                var clx = -1;
                                for (clx in columns) {
                                    if (columns[clx].getVisible()) tm++;
                                    if (tm == column_no) {
                                        break;
                                    }
                                }
                                if (clx < 0) return;
                                var cx = columns[clx].tableCol;
                                if (Util.nvl(cx.eOther, "") != "") {
                                    var evl = cx.eOther.replace(/:newValue/g, "\"'" + newValue + "'\"");
                                    evl = evl.replace(/:nwValue/g, "\"" + newValue + "\"");

                                    if (!eval(evl))
                                        evtx.getSource().focus();
                                    else table.fireRowsUpdated();
                                }
                                if (cx.whenValidate != undefined)
                                    if (!cx.whenValidate(table, currentRowoIndexContext, cx, table.indexOfRow(row), column_no))
                                        evtx.getSource().focus();

                                    else table.fireRowsUpdated();

                                if (cx.eventCalc != undefined)
                                    if (!cx.eventCalc(qv, cx, table.indexOfRow(row), true))
                                        evtx.getSource().focus();
                            }

                        }
                        if (cx.mSearchSQL.length > 0) {
                            cx.eOnSearch = function (evtx) {

                                var tbl = evtx.getSource().getParent().getParent(); // get table control.
                                var input = evtx.getSource();
                                if ((evtx.getParameters != undefined)
                                    && (evtx.getParameters().clearButtonPressed || evtx.getParameters().refreshButtonPressed)) {
                                    return;
                                }

                                //// get visible column no
                                var clno = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                                var cls = evtx.getSource().getParent().getParent().getColumns();


                                var tm = -1;
                                var clx = -1;
                                for (clx in cls) {
                                    if (cls[clx].getVisible()) tm++;
                                    if (tm == clno) {
                                        break;
                                    }
                                }
                                if (clx < 0) return;
                                var cx = cls[clx].tableCol;
                                //// end getting visible column no

                                var row = evtx.getSource().getParent();
                                var table = evtx.getSource().getParent().getParent(); // get table control.
                                var column_no = evtx.getSource().getParent().indexOfCell(evtx.getSource());
                                var sq = cx.mSearchSQL;
                                var lk = Util.nvl(cx.mLookUpCols, "").split(",");
                                var rt = Util.nvl(cx.mRetValues, "").split(",");

                                if (cx.beforeSearchEvent != undefined) {
                                    var oModel = tbl.getModel();
                                    var rowStart = tbl.getFirstVisibleRow();
                                    var currentRowoIndexContext = tbl.getContextByIndex(rowStart + tbl.indexOfRow(row));
                                    oModel.setProperty(currentRowoIndexContext.sPath + "/" + cx.mColName, evtx.getSource().getValue(), undefined, true);
                                    sq = cx.beforeSearchEvent(sq, currentRowoIndexContext, oModel);
                                }
                                var pms = {
                                    parent: cx.mSearchColParent,
                                    code: cx.mSearchColCode,
                                    title: cx.mSearchColTitle,
                                };
                                Util.show_list(sq, lk, rt, function (data) {
                                    // console.log(data);

                                    if (rt.length == 0)
                                        return;
                                    var oModel = tbl.getModel();
                                    var rowStart = tbl.getFirstVisibleRow(); //starting Row index
                                    var currentRowoIndexContext = tbl.getContextByIndex(rowStart + tbl.indexOfRow(row));
                                    if (cx.onSearchSelection != undefined) {
                                        var oModel = tbl.getModel();
                                        var currentRowoIndexContext = tbl.getContextByIndex(rowStart + tbl.indexOfRow(row));
                                        if (!cx.onSearchSelection(currentRowoIndexContext, oModel, data)) {
                                            // sap.m.MessageToast.show("Invalid selection !");
                                            return false;
                                        }
                                    }
                                    for (var i in rt) {
                                        var rts = rt[i].split("=");
                                        oModel.setProperty(currentRowoIndexContext.sPath + "/" + rts[0], data[rts[1]], undefined, true);
                                        if (cx.mColName == rts[0])
                                            input.fireChange({ value: data[rts[1]] });

                                        if (cx.whenValidate != undefined)
                                            if (!cx.whenValidate(table, currentRowoIndexContext, cx, table.indexOfRow(row), column_no))
                                                evtx.getSource().focus();

                                        if (cx.eventCalc != undefined)
                                            if (!cx.eventCalc(qv, cx, table.indexOfRow(row), true))
                                                evtx.getSource().focus();
                                    }
                                    return true;
                                }, "100%", "100%", undefined, false, undefined, pms
                                );

                            }
                                ;
                        }
                    }
                    for (var col in qv.mLctb.cols)
                        if (qv.mLctb.cols[col].mHideCol)
                            invisibleCol.push(qv.mLctb.cols[col]);
                    qv.mLctb.cols = [];
                    for (var i in visibleCol) {
                        visibleCol[i].mColpos = parseInt(i) + 1;
                        qv.mLctb.cols.push(visibleCol[i]);
                    }
                    var tr = qv.mLctb.cols.length - 1;
                    for (var i in invisibleCol) {
                        invisibleCol[i].mColpos = tr + parseInt(i) + 1;
                        qv.mLctb.cols.push(invisibleCol[i]);
                    }
                }

            }
            ,
            getInsertRowString: function (mLctb, tblName, rowno, excludeCols, colValues, onlyVisibleCol) {
                var ov = Util.nvl(onlyVisibleCol, false);
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

                var sq1 = "insert into " + tblName;
                var sq2 = "";
                var sq3 = "";
                for (var c in mLctb.cols) {
                    // only add to insert which is visible but even if hidden but added in colValues then add it.
                    if (ov && mLctb.cols[c].mHideCol && !Util.nvl(colValues, []).hasOwnProperty(mLctb.cols[c].mColName))
                        continue;
                    var val = Util.nvl(mLctb.getFieldValue(rowno, mLctb.cols[c].mColName), "");
                    // if any value to be override by colValues object
                    if (colValues != undefined && colValues.hasOwnProperty(mLctb.cols[c].mColName))
                        val = colValues[mLctb.cols[c].mColName];

                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1)
                        sq2 += (sq2.length > 0 ? "," : "") + mLctb.cols[c].mColName;
                    if (mLctb.cols[c].getMUIHelper().display_format == "SHORT_DATE_FORMAT") // if date then to_date() in sql
                        val = Util.toOraDateString(val);
                    else if (mLctb.cols[c].getMUIHelper().data_type == "DATE" && mLctb.cols[c].getMUIHelper().display_format != "SHORT_DATE_FORMAT")
                        try {
                            val = (val != "" ? Util.toOraDateTimeString(new Date(val)) : "");
                        } catch (er) {
                        }
                    else {
                        val = "'" + val + "'";
                    }
                    // if number then val variable should have number value to store in database.
                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1
                        && mLctb.cols[c].getMUIHelper().data_type == "NUMBER") {
                        if (colValues != undefined && colValues.hasOwnProperty(mLctb.cols[c].mColName))
                            val = (Util.nvl(Util.nvl(colValues[mLctb.cols[c].mColName], val), "") + "").replace(/[^\d\.],/g, '').replace(/,/g, '');
                        else
                            val = (Util.nvl(Util.nvl(mLctb.getFieldValue(rowno, mLctb.cols[c].mColName), val), "") + "").replace(/[^\d\.],/g, '').replace(/,/g, '');
                        var dfs = Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE");
                        var df;
                        if (Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE") == "QTY_FORMAT")
                            dfs = sett["FORMAT_QTY_1"];
                        if (Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE") == "MONEY_FORMAT")
                            dfs = sett["FORMAT_MONEY_1"];
                        if (dfs != "NONE") {
                            df = new DecimalFormat(dfs);
                            val = parseFloat(df.formatBack(val.replace(/'/g, '')))
                        }
                    }
                    // exclude col
                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1)
                        sq3 += (sq3.length > 0 ? "," : "") + Util.nvl(val, 'null');
                }
                for (var key in colValues)
                    if (mLctb.getColPos(key) < 0) {
                        sq2 += (sq2.length > 0 ? "," : "") + key;
                        sq3 += (sq3.length > 0 ? "," : "") + Util.nvl(colValues[key], 'null');
                    }

                sq3 = mLctb.parseColValues(sq3, rowno, sett);
                return sq1 + "(" + sq2 + ") values (" + sq3 + ")";

            },

            getUpdateRowString: function (mLctb, tblName, rowno, excludeCols, colValues, onlyVisibleCol) {
                var ov = Util.nvl(onlyVisibleCol, false);
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

                var sq1 = "update " + tblName + " set ";
                var sq2 = "";
                var sq3 = "";
                for (var c in mLctb.cols) {
                    // only add to insert which is visible but even if hidden but added in colValues then add it.
                    if (ov && mLctb.cols[c].mHideCol && !Util.nvl(colValues, []).hasOwnProperty(mLctb.cols[c].mColName))
                        continue;
                    var val = Util.nvl(mLctb.getFieldValue(rowno, mLctb.cols[c].mColName), "");
                    // if any value to be override by colValues object
                    if (colValues != undefined && colValues.hasOwnProperty(mLctb.cols[c].mColName))
                        val = colValues[mLctb.cols[c].mColName];

                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1)
                        sq2 += (sq2.length > 0 ? "," : "") + mLctb.cols[c].mColName;
                    if (mLctb.cols[c].getMUIHelper().display_format == "SHORT_DATE_FORMAT") // if date then to_date() in sql
                        val = Util.toOraDateString(val);
                    else if (mLctb.cols[c].getMUIHelper().data_type == "DATE" && mLctb.cols[c].getMUIHelper().display_format != "SHORT_DATE_FORMAT")
                        val = (val != "" ? Util.toOraDateTimeString(new Date(val)) : "");
                    else {
                        val = "'" + val + "'";
                    }
                    // if number then val variable should have number value to store in database.
                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1
                        && mLctb.cols[c].getMUIHelper().data_type == "NUMBER") {
                        if (colValues != undefined && colValues.hasOwnProperty(mLctb.cols[c].mColName))
                            val = (Util.nvl(Util.nvl(colValues[mLctb.cols[c].mColName], val), "") + "").replace(/[^\d\.],/g, '').replace(/,/g, '');
                        else
                            val = (Util.nvl(Util.nvl(mLctb.getFieldValue(rowno, mLctb.cols[c].mColName), val), "") + "").replace(/[^\d\.],/g, '').replace(/,/g, '');
                        var dfs = Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE");
                        var df;
                        if (Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE") == "QTY_FORMAT")
                            dfs = sett["FORMAT_QTY_1"];
                        if (Util.nvl(mLctb.cols[c].getMUIHelper().display_format, "NONE") == "MONEY_FORMAT")
                            dfs = sett["FORMAT_MONEY_1"];
                        if (dfs != "NONE") {
                            df = new DecimalFormat(dfs);
                            val = parseFloat(df.formatBack(val.replace(/'/g, '')))
                        }
                    }
                    // exclude col
                    if (excludeCols != undefined && excludeCols.indexOf(mLctb.cols[c].mColName) <= -1)
                        sq3 += (sq3.length > 0 ? "," : "") + Util.nvl(val, 'null');
                }
                for (var key in colValues)
                    if (mLctb.getColPos(key) < 0) {
                        sq2 += (sq2.length > 0 ? "," : "") + key + "=" + Util.nvl(colValues[key], 'null');
                        // sq3 += (sq3.length > 0 ? "," : "") + Util.nvl(colValues[key], 'null');
                    }


                return sq1 + "(" + sq2 + " where " + w;

            }
            ,
            getInsertRowStringByObj: function (tblName, colValues) {
                var sett = sap.ui.getCore().getModel("settings").getData();
                var sdf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);

                var sq1 = "insert into " + tblName;
                var sq2 = "";
                var sq3 = "";

                for (var key in colValues) {
                    // if (mLctb.getColPos(key) < 0) {
                    sq2 += (sq2.length > 0 ? "," : "") + key;
                    sq3 += (sq3.length > 0 ? "," : "") + Util.nvl(colValues[key], 'null');
                }
                // sq3 = mLctb.parseColValues(sq3, rowno, sett);
                return sq1 + "(" + sq2 + ") values (" + sq3 + ")";

            },

            showErrorNoVal: function (obj, msg) {
                var ob = [];
                var fnd = 0;
                var errobjs = [];
                if (!Array.isArray(obj))
                    ob = [obj];
                else ob = obj;
                for (var i in ob) {
                    var objj = ob[i];
                    if ((this.nvl(this.getControlValue(objj), "") + "").length == 0) {
                        fnd++;
                        errobjs.push(objj);
                    }
                }
                if (fnd > 0) {
                    sap.m.MessageToast.show(fnd + " Field(s)  must have value !");
                    setTimeout(function () {
                        for (var i in errobjs) {
                            errobjs[i].addStyleClass("errBack");
                        }
                        setTimeout(function () {
                            for (var i in errobjs)
                                errobjs[i].removeStyleClass("errBack");

                        }, 10000);
                    }, 100);
                }
                return fnd;
            },
            errorObj: function (obj, tm) {
                setTimeout(function () {
                    obj.addStyleClass("errBack");
                    setTimeout(function () {
                        obj.removeStyleClass("errBack");
                    }, Util.nvl(tm, 10000));
                }, 100);
            }
            ,
            openForm: function (frag, frm, ocAdd, view, app) {
                var oC = {};
                if (view != undefined)
                    oC = {
                        getView:
                            function () {
                                return view;
                            },
                        getForm: function () {
                            return frm;
                        }
                    };
                if (ocAdd != undefined)
                    for (var xx in ocAdd)
                        oC[xx] = ocAdd[xx];

                var sp = sap.ui.jsfragment(frag, oC);
                if (app != undefined)
                    sp.app = app;

                return sp;
            }
            ,

            doSearch: function (event, sql, obj, fnAfter, tit, obj2) {
                if (event != undefined
                    && (event.getParameters().clearButtonPressed
                        || event.getParameters().refreshButtonPressed)) {
                    UtilGen.setControlValue(obj, "", "", true);
                    if (obj2 != undefined)
                        UtilGen.setControlValue(obj, "", "", true);
                    return;
                }

                Util.showSearchList(sql, "TITLE", "CODE", function (valx, val) {
                    if (obj2 == undefined)
                        UtilGen.setControlValue(obj, val, valx, true);
                    else {
                        UtilGen.setControlValue(obj, valx, valx, true);
                        UtilGen.setControlValue(obj2, val, val, true);
                    }
                    if (fnAfter != undefined)
                        fnAfter();
                }, tit);

            }
            ,
            editableContent: function (frm, b) {
                for (var i = 0; i < frm.getContent().length; i++) {
                    if (frm.getContent()[i] instanceof sap.m.InputBase)
                        frm.getContent()[i].setEditable(b);
                    if (frm.getContent()[i] instanceof sap.m.SearchField)
                        frm.getContent()[i].setEnabled(b);

                }
            }
            ,
            setFormDisableForEditing: function (frm) {
                var cnts = frm.getContent();
                for (var i in cnts) {
                    if (cnts[i] instanceof sap.m.InputBase)
                        cnts[i].setEditable(false);
                    if (cnts[i] instanceof sap.m.SearchField)
                        cnts[i].setEnabled(false);
                    if (cnts[i] instanceof sap.m.CheckBox)
                        cnts[i].setEditable(false);
                    if (cnts[i] instanceof sap.m.ComboBox)
                        cnts[i].setEditable(false);

                }

            }
            ,

            execCmd: function (txt, view, obj, pg1, pOnWndClose) {

                if (txt == "")
                    return;
                var txt2 = txt.trim();
                var cm = txt2.split(" ")[0].toUpperCase();
                var pms = (txt2.indexOf(" ") <= -1 ? "" : txt2.substring(txt2.indexOf(" ") + 1).trim());
                // cmdData
                if (view != undefined && view.cmdData != undefined && view.cmdData.length > 0)
                    for (var i in view.cmdData)
                        if (view.cmdData[i].COMMAND.toUpperCase() == cm) {
                            var cmd = view.cmdData[i].EXEC_LINE;
                            cmd = cmd.replaceAll('**', ':');
                            cmd = cmd.replaceAll('*.', "'");
                            cmd = cmd.replaceAll(/\\n/g, '\n');
                            txt2 = cmd + (pms.length > 0 ? " " : "") + pms;

                        }
                if (txt2.toLowerCase().startsWith("main")) {
                    view.app.toDetail(view.pg, "slide");
                    return;
                }
                if (txt2.toLowerCase().startsWith("reload_menus")) {
                    view.loadData();
                    return;
                }
                if (txt2.toLowerCase().startsWith("execbatch")) {
                    view.execBatch(txt2);
                    return;
                }
                if (txt2.toLowerCase().startsWith("show_list")) {
                    view.show_list_cmd(txt2);
                    return;
                }
                if (txt2.toLowerCase().startsWith("alert")) {
                    Util.AlertSettings.cmdAlert(txt2);
                    return;
                }
                if (!txt2.startsWith("#") && !txt2.startsWith("http")) {
                    var tokens = txt2.split(" ");
                    var openNew = false;
                    var formnm = "";
                    var formtit = "";
                    for (var i in tokens) {
                        if (i == 0) {
                            formnm = tokens[i];
                            continue;
                        }
                        if (tokens[i].split("=")[0] == "formTitle")
                            formtit = tokens[i].split("=")[1];

                        if (tokens[i].split("=")[0] == "openNew" && tokens[i].split("=")[1] == "true")
                            openNew = true;
                    }
                    if (openNew)
                        UtilGen.cmdOpenForm(txt2, view, obj, pg1, pOnWndClose);
                    else {
                        if (UtilGen.getIndexByKey(view.lstPgs, formnm) != undefined || UtilGen.getIndexByKey(view.lstPgs, "bin.forms." + formnm) != undefined) {
                            if (formnm == UtilGen.getControlValue(view.lstPgs))
                                return;
                            if (sap.m.MessageBox == undefined)
                                jQuery.sap.require("sap.m.MessageBox");
                            sap.m.MessageBox.confirm("Already form is opened, Open new " + Util.nvl(formtit, formnm) + " again ?  ", {
                                title: "Confirm",                                    // default
                                onClose: function (oAction) {
                                    if (oAction == sap.m.MessageBox.Action.YES) {
                                        UtilGen.cmdOpenForm(txt2, view, obj, pg1, pOnWndClose);
                                    }
                                    if (oAction == sap.m.MessageBox.Action.NO) {
                                        UtilGen.setControlValue(view.lstPgs, formnm);
                                        view.lstPgs.fireSelectionChange();
                                    }
                                },                                       // default
                                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                emphasizedAction: sap.m.MessageBox.Action.NO,
                                styleClass: "",                                      // default
                                initialFocus: sap.m.MessageBox.Action.NO, // default
                                textDirection: sap.ui.core.TextDirection.Inherit     // default
                            });
                        } else
                            UtilGen.cmdOpenForm(txt2, view, obj, pg1, pOnWndClose);
                    }
                    return;
                }
            }
            ,
            cmdOpenForm: function (txt, view, obj, pg1, pOnWndClose) {
                var that = this;
                // var formName = "", formType = "popover", formSize = "100%,100%", formModal = "true";
                var dtx = { formName: "", formType: "popover", formSize: "100%,100%", formModal: "true" };
                var tokens = txt.split(" ");
                for (var i in tokens) {

                    if (i == 0) {
                        dtx["formName"] = tokens[i];
                        continue;
                    }
                    var tkn = tokens[i].split("=");
                    dtx[tkn[0]] = tkn[1];

                }
                // validate the command and setting default values .......
                // opening form
                var con = pg1;
                var dlg = undefined;
                if (pg1 == undefined && dtx.formType == "page")
                    dtx.formType = "dialog";

                if (dtx.formType == "dialog") {
                    var sp = dtx.formSize.split(",");
                    var width = "400px", height = "500px";
                    if (sp.length >= 1) width = sp[0];
                    if (sp.length >= 2) height = sp[1];
                    con = new sap.m.Page({ showHeader: false, content: [] });
                    dlg = new sap.m.Dialog({
                        title: Util.nvl(dtx.TILE_TITLE_1, ""),
                        content: con,
                        contentHeight: height,
                        contentWidth: width,
                    }).addStyleClass("sapUiSizeCompact");
                }
                if (dtx.formType == "popover") {
                    var sp = dtx.formSize.split(",");
                    var width = "400px", height = "500px";
                    if (sp.length >= 1) width = sp[0];
                    if (sp.length >= 2) height = sp[1];
                    con = new sap.m.Page({ showHeader: false, content: [] });
                    dlg = new sap.m.Popover({
                        title: "",
                        showTitle: false,
                        showHeader: false,
                        contentHeight: height,
                        contentWidth: width,
                        modal: (dtx.formModal == "true" ? true : false),
                        content: [con],
                        // footer: [hb],
                        placement: sap.m.PlacementType.Auto
                    }).addStyleClass("sapUiSizeCompact");
                }

                if (dtx.formType == "dialog" || dtx.formType == "page" || dtx.formType == "popover") {
                    var pms = {};
                    for (var i in dtx)
                        if (!(i == "formType" || i == "formName" || i == "formSize" || i == "formModal"))
                            pms[i] = dtx[i];


                    var sp = undefined;
                    try {
                        sp = UtilGen.openForm(dtx.formName, con, pms, view);
                    }
                    catch (err) {
                        console.log(err);
                        // err.message;throw
                    }


                    if (sp == undefined)
                        try {

                            sp = UtilGen.openForm("bin.forms." + dtx.formName, con, pms, view);
                        }
                        catch (err) {
                            sap.m.MessageToast.show("Err ! opening form " + "bin.forms." + dtx.formName);
                            throw err;
                            return;
                        }

                    if (sp == undefined) {
                        sap.m.MessageToast.show(dtx.formName + " fragment not found !");
                        return;
                    }
                    sp.backFunction = function () {
                        if (dlg != undefined) {
                            dlg.close();
                            return;
                        }
                        view.app.toDetail(view.pg, "show");
                        if (sp.onWndClose != undefined)
                            sp.onWndClose();
                        if (pOnWndClose != undefined)
                            pOnWndClose();
                        // that.loadData();
                        if (view.lstPgs.getItems().length == 1)
                            that.show_main_menus();
                    };
                    if (dtx.formType != "page") {
                        UtilGen.clearPage(con);
                        con.addContent(sp);

                    }
                    if (dtx.formType == "page") {
                        if (con instanceof sap.m.Page) {
                            UtilGen.clearPage(con);
                            con.addContent(sp);
                            view.app.toDetail(con, "slide");
                            sp.backFunction = function () {
                                view.destroyPage(con);
                                if (sp.onWndClose != undefined)
                                    sp.onWndClose();
                                if (pOnWndClose != undefined)
                                    pOnWndClose();
                                sap.m.MessageToast.show("Removing this page..");
                                view.app.toDetail(view.pg, "show");
                                // view.loadData();
                                if (view.lstPgs.getItems().length == 1)
                                    view.loadData_main();

                            };

                        }
                        if (typeof (con) == "function") {
                            var pgx = con(dtx);
                            if (pgx != undefined) {
                                UtilGen.clearPage(pgx);
                                pgx.addContent(sp);
                                view.app.toDetail(pgx, "slide");
                                sp.backFunction = function () {
                                    view.destroyPage(pgx);
                                    sap.m.MessageToast.show("Removing this page..");
                                    view.app.toDetail(view.pg, "show");
                                    // view.loadData();
                                    if (view.lstPgs.getItems().length == 1)
                                        view.loadData_main();
                                };
                            }
                            else {
                                sap.m.MessageToast.show(dtx.formName + " Can't open...!");
                                return;
                            }

                        }
                    }
                    else if (dtx.formType == "dialog") {
                        dlg.open();
                        dlg.attachBeforeClose(undefined, function () {

                            if (sp.onWndClose != undefined)
                                sp.onWndClose();
                            if (pOnWndClose != undefined)
                                pOnWndClose();

                        })
                    }
                    else if (dtx.formType == "popover") {
                        dlg.openBy(obj);
                        dlg.attachBeforeClose(undefined, function () {

                            if (sp.onWndClose != undefined)
                                sp.onWndClose();
                            if (pOnWndClose != undefined)
                                pOnWndClose();
                        })

                    }
                }
            }
            ,
            addDelRowCmd: function (qv, fnAfterAdd, fnAfterDel
            ) {
                var vb = new sap.m.HBox({
                    items: [
                        new sap.m.Button({
                            icon: "sap-icon://add", press: function () {
                                qv.addRow();
                                if (fnAfterAdd)
                                    fnAfterAdd();
                            }
                        }),
                        new sap.m.Button({
                            icon: "sap-icon://sys-minus", press: function () {
                                if (that.qv.getControl().getSelectedIndices().length == 0) {
                                    sap.m.MessageToast.show("Select a row to delete. !");
                                    return;
                                }

                                var r = that.qv.getControl().getSelectedIndices()[0] + that.qv.getControl().getFirstVisibleRow();
                                qv.deleteRow(r);
                                if (fnAfterDel)
                                    fnAfterDel(false);
                                // that.do_summary(false);

                            }
                        })
                    ]
                });
                return vb;
            },
            toHTMLTableFromData: function (dtx11, pexcCols, fnHeaderAdd, fnDetailAdd) {
                var h = "";
                var hasSpan = false;
                var tmpv1 = "", tmpv2 = "", hCol = "", classadd = "", styleadd = "";
                var excCols = Util.nvl(pexcCols, []);
                var dtx = dtx11.data;
                var mdtx = dtx11.metadata;
                for (var x in mdtx) {
                    if (excCols.indexOf(mdtx[x].colname) > -1)
                        continue;

                    tmpv1 = mdtx[x].colname;
                    var tmp;
                    if (fnHeaderAdd != undefined)
                        tmp = fnHeaderAdd(tmpv1, tmpv2);

                    if (tmp != undefined) {
                        tmpv1 = Util.nvl(tmp.title, tmpv1);
                        tmpv2 = Util.nvl(tmp.prop, "\"text-align:Center\"");
                    }
                    // tmpv2 = "\"text-align:Center\"";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                }
                hCol = "<tr>" + hCol + "</tr>";
                h = "<thead>" + (hasSpan ? hCol : "") +
                    "<tr>" + h + "</tr></thead>";
                var rs = "";
                var rows = "";
                for (var j in dtx) {
                    rs = "";
                    for (var x in mdtx) {
                        if (excCols.indexOf(mdtx[x].colname) > -1)
                            continue;
                        var tmp;
                        var cv = dtx[j][mdtx[x].colname];

                        if (fnDetailAdd != undefined)
                            tmp = fnDetailAdd(mdtx[x].colname, tmpv2, cv);

                        if (tmp != undefined) {
                            tmpv2 = Util.nvl(tmp.prop, "style=\"text-align:center\"");
                            cv = Util.nvl(tmp.val, cv);
                        }


                        rs += "<td " + tmpv2 + " > " + Util.nvl(Util.htmlEntities(cv), "") + "</td>";
                    }
                    rows += "<tr>" + rs + "</tr>";
                }

                return "<table class='fl-table'>" + h + rows + "</table>";
            },
            showWorking: function (wnd, pstr) {
                if ($('#content').parent().find('.sapMMessageToast').length == 0)
                    sap.m.MessageToast.show(Util.nvl(pstr + "..", "Working.."), {
                        duration: 9999999,
                        width: "15em",
                        my: "center top",
                        at: "top top",
                        of: this.nvl(wnd, window),
                        offset: "0 0",                    // default
                        collision: "fit fit",            // default
                        onClose: null,                   // default
                        autoClose: false,                 // default
                        animationTimingFunction: "ease", // default
                        animationDuration: 1000,         // default
                        closeOnBrowserNavigation: true   // default
                    });
                var oMessageToastDOM = $('#content').parent().find('.sapMMessageToast');
                oMessageToastDOM.css('color', "maroon");
                oMessageToastDOM.css('background-color', "#00a4eb");
            },
            closeWorking: function (wndx) {
                var wnd = Util.nvl(wndx, window);
                var oMessageToastDOM = $('#content').parent().find('.sapMMessageToast');
                for (var i = 0; i < oMessageToastDOM.length; i++) {
                    if (this.nvl(oMessageToastDOM[i].innerText, "").endsWith(".."))
                        oMessageToastDOM[i].remove();
                }
            },
            dispTblRecsByDevice: function (dispRecs) {
                if (typeof dispRecs == "object") {
                    var newr = "L";
                    if (sap.ui.Device.resize.height <= 639)
                        newr = "S";
                    if (sap.ui.Device.resize.height > 640 && sap.ui.Device.resize.height <= 768)
                        newr = "M";
                    if (sap.ui.Device.resize.height > 769 && sap.ui.Device.resize.height <= 888)
                        newr = "L";
                    if (sap.ui.Device.resize.height > 889 && sap.ui.Device.resize.height <= 1080)
                        newr = "XL";
                    if (sap.ui.Device.resize.height > 1080)
                        newr = "XXL";
                    console.log("DEVICE " + newr + " -height=" + sap.ui.Device.resize.height + " records=" + dispRecs[newr]);
                    return dispRecs[newr];
                } else return dispRecs;                

            },
            Search: {
                do_quick_search: function (e, control, pSq, pSqGetTitle, titObj, eventAfterSelect) {
                    if (e.getParameters().clearButtonPressed || e.getParameters().refreshButtonPressed) {
                        UtilGen.setControlValue(control, "", "", false);
                        if (titObj != undefined)
                            UtilGen.setControlValue(titObj, "", "", false);
                        return;
                    }
                    // var control = this;
                    var sq = pSq;
                    Util.showSearchList(sq, "TITLE", "CODE", function (valx, val) {
                        if (titObj == undefined)
                            UtilGen.setControlValue(control, val, valx, false);
                        else {
                            UtilGen.setControlValue(control, valx, valx, false);
                            UtilGen.setControlValue(titObj, val, val, false);
                        }

                        var vldtt = Util.execSQL(pSqGetTitle.replaceAll(":CODE", Util.quoted(valx)));
                        if (vldtt.ret != "SUCCESS") {
                            UtilGen.setControlValue(control, "", "", false);
                            if (titObj != undefined)
                                UtilGen.setControlValue(titObj, "", "", false);
                            return;
                        }
                        var vldt = JSON.parse("{" + vldtt.data + "}").data;
                        var acn = vldt[0].CODE;
                        var nm = vldt[0].TITLE;
                        if (titObj == undefined)
                            UtilGen.setControlValue(control, nm + "-" + acn, acn, true);
                        else {
                            UtilGen.setControlValue(control, acn, acn, true);
                            UtilGen.setControlValue(titObj, nm, nm, false);
                        }
                        if (eventAfterSelect != undefined)
                            eventAfterSelect();
                    });
                },
                getLOVSearchField: function (sql, control, nullValid, titObj) {
                    var vl = control.getValue();

                    if (Util.nvl(nullValid, true) && Util.nvl(vl, "") == "") {
                        if (titObj != undefined)
                            UtilGen.setControlValue(titObj, "", "", false);
                        return;
                    }

                    var nm = Util.getSQLValue(sql.replaceAll(":CODE", vl));
                    if (titObj == undefined)
                        UtilGen.setControlValue(control, vl + "-" + nm, vl, false);
                    else {
                        UtilGen.setControlValue(control, vl, vl, false);
                        UtilGen.setControlValue(titObj, nm, nm, false);
                    }
                }
            },
            Vouchers: {
                // validate for rv,pv,pvc,rvc

                validatePostedVocher: function (qry, sqlRow, rn) {
                    var kf = qry.formview.getFieldValue("keyfld");
                    var dt = Util.execSQL("select flag from acvoucher1 where keyfld=" + kf);
                    if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        if (dtx.length > 0 && dtx[0].FLAG != undefined && dtx[0].FLAG != 1) {
                            qry.formview.setFormReadOnly();
                            FormView.err("This voucher is posted !");
                        }


                    }

                },
                validateTotDrTotCr: function (qry, sqlRow, rn) {
                    var totcr = qry.formview.getFieldValue("totalcredit");
                    var totdr = qry.formview.getFieldValue("totaldebit");
                    if (totcr != undefined && totcr < 0)
                        FormView.err("Total CREDIT cant be less than zero !");
                    if (totcr != undefined && totcr == 0)
                        FormView.err("Total Credit cant be zero !");
                    if (totdr != undefined && totdr < 0)
                        FormView.err("Total DEBIT cant be less than zero !");
                    if (totdr != undefined && totdr == 0)
                        FormView.err("Total DEBIT cant be zero !");
                    if (totdr != undefined && totcr != undefined && totdr != totcr)
                        FormView.err("Total DEBIT and CREDIT is not matched !");

                },
                validateFieldsBeforeSave: function (qry, sqlRow, rn) {


                    var cc = qry.formview.getFieldValue("qry1.costcent");
                    var cd = qry.formview.getFieldValue("qry1.code");
                    var sm = qry.formview.getFieldValue("qry1.slsmn");

                    if (Util.nvl(cc, "") != "") {
                        var dt = Util.getSQLValue("select code from accostcent1 where code=" + Util.quoted(cc));
                        if (Util.nvl(dt, "") == "") {
                            UtilGen.errorObj(qry.formview.objs["qry1.costcent"].obj);
                            FormView.err("Cost center not found !");
                        }
                    }
                    if (Util.nvl(sm, "") != "") {
                        var dt = Util.getSQLValue("select no from salesp where no=" + Util.quoted(sm));
                        if (Util.nvl(dt, "") == "") {
                            UtilGen.errorObj(qry.formview.objs["qry1.slsmn"].obj);
                            FormView.err("Sales man not valid !");
                        }
                    }

                    if (Util.nvl(cd, "") != "") {
                        var dt = Util.getSQLValue("select accno from acaccount where childcount=0 and flag=1 and accno=" + Util.quoted(cd));
                        if (Util.nvl(dt, "") == "") {
                            UtilGen.errorObj(qry.formview.objs["qry1.code"].obj);
                            FormView.err("Bank/cash not valid !");
                        }
                    }


                },
                getNewKF: function (qry, sqlRow, rn) {
                    if (qry.name == "qry1" && qry.status == FormView.RecordStatus.NEW) {
                        var kfld = Util.getSQLValue("select nvl(max(keyfld),0)+1 from acvoucher1");
                        qry.formview.setFieldValue("qry1.keyfld", kfld, kfld, true);
                        qry.formview.setFieldValue("pac", qry.formview.getFieldValue("keyfld"));
                    }
                },
                validateDetails: function (qry, sqlRow, rowno) {
                    if (qry.name == "qry2") {
                        var ld = qry.obj.mLctb;
                        var chld = Util.getSQLValue("select childcount from acaccount where accno=" + Util.quoted(ld.getFieldValue(rowno, "ACCNO")));
                        if (chld == undefined || (typeof chld == "string" && chld == "") || chld > 0)
                            FormView.err(ld.getFieldValue(rowno, "ACCNO") + " not a valid a/c !");

                        if (Util.nvl(ld.getFieldValue(rowno, "COSTCENT"), "") != "") {
                            var chld = Util.getSQLValue("select code from accostcent1 where CODE=" + Util.quoted(ld.getFieldValue(rowno, "COSTCENT")));
                            if (chld == undefined || (typeof chld == "string" && chld == ""))
                                FormView.err(ld.getFieldValue(rowno, "COSTCENT") + " not a valid COST CENTER ! ");
                        }
                    }
                },
                formLoadData: function (frag) {

                    frag.oController.status = Util.nvl(frag.oController.status, 'new');
                    frag.frm.readonly = Util.nvl(frag.oController.readonly, false);

                    if (frag.frm.readonly)
                        frag.oController.status = "view";


                    if (frag.oController.nolist)
                        frag.frm.cmdButtons.cmdList.setVisible(false);

                    if (frag.oController.readonly) {
                        frag.frm.cmdButtons.cmdNew.setVisible(false);
                        frag.frm.cmdButtons.cmdEdit.setVisible(false);
                        frag.frm.cmdButtons.cmdDel.setVisible(false);
                    }

                    if (frag.oController.status != FormView.RecordStatus.NEW) {
                        frag.frm.setFieldValue('pac', Util.nvl(frag.oController.keyfld), "");
                        frag.frm.setQueryStatus(undefined, frag.oController.status);
                    } else {
                        frag.frm.setFieldValue('pac', Util.nvl(frag.qryStr), "");
                        frag.frm.setQueryStatus(undefined, Util.nvl(frag.oController.status, FormView.RecordStatus.NEW));
                    }
                    if (frag.qryStr != "")
                        frag.frm.loadData(undefined, frag.oController.status);

                },
                copyDataFromVou: function (data, qrj, vars) {
                    if (data == null || data == undefined || data.length <= 0)
                        return false;
                    if (qrj.getControl().view.objs["qry1"].status != FormView.RecordStatus.NEW && qrj.getControl().view.objs["qry1"].status != FormView.RecordStatus.EDIT) {
                        sap.m.MessageToast.show("Not in new / edit mode !");
                        return;
                    }
                    for (var d in data) {
                        var dat = Util.execSQL("select V.ACCNO,V.FCDEBIT,V.FCCREDIT,V.DEBIT,V.CREDIT,A.NAME ACNAME,DESCR from ACVOUCHER2 V,ACACCOUNT A where A.ACCNO=V.ACCNO AND  V.keyfld=" + data[d].KEYFLD + " order by pos");
                        if (dat.ret == "SUCCESS" && dat.data.length > 0) {
                            var dtx = JSON.parse("{" + dat.data + "}").data;
                            for (var i in dtx) {
                                if (vars.vou_code == 2 && dtx[i].DEBIT > 0)
                                    continue;
                                if (vars.vou_code == 3 && dtx[i].CREDIT > 0)
                                    continue;
                                var r = qrj.mLctb.rows.length - 1;
                                if (Util.nvl(qrj.mLctb.getFieldValue(qrj.mLctb.rows.length - 1, "ACCNO"), "") != "")
                                    r = qrj.mLctb.addRow();
                                qrj.mLctb.setFieldValue(r, "POS", r + 1);
                                qrj.mLctb.setFieldValue(r, "ACCNO", dtx[i].ACCNO);
                                qrj.mLctb.setFieldValue(r, "FCDEBIT", dtx[i].FCDEBIT);
                                qrj.mLctb.setFieldValue(r, "FCCREDIT", dtx[i].FCCREDIT);
                                qrj.mLctb.setFieldValue(r, "DEBIT", dtx[i].DEBIT);
                                qrj.mLctb.setFieldValue(r, "CREDIT", dtx[i].CREDIT);
                                qrj.mLctb.setFieldValue(r, "DESCR2", dtx[i].ACNAME);
                                qrj.mLctb.setFieldValue(r, "ACNAME", dtx[i].ACNAME);
                                qrj.mLctb.setFieldValue(r, "DESCR", qrj.getControl().view.objs["qry1.descr"].obj.getValue());

                            }
                        }
                    }
                    qrj.updateDataToControl();
                    qrj.eventCalc(qrj, undefined, -1, false);
                },
                before_add_table: function (scrollObjs, qrj, vars) {
                    var that = this;
                    var sett = sap.ui.getCore().getModel("settings").getData();
                    var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                    qrj.showToolbar.showSearch = false;
                    qrj.showToolbar.showFilter = false;
                    qrj.showToolbar.showGroupFilter = false;
                    qrj.showToolbar.showPersonalization = false;
                    qrj.createToolbar("", [],
                        // EVENT ON APPLY PERSONALIZATION
                        function (prsn, qv) {
                        },
                        // EVENT ON REVERT PERSONALIZATION TO ORIGINAL
                        function (qv) {
                        }
                    );
                    var txt = new sap.m.Input({ width: "100px" });
                    var btf = new sap.m.Button({
                        icon: "sap-icon://sys-find",
                        tooltip: "click to find next..",
                        press: function () {
                            var bi = 0;
                            if (qrj.getControl().getSelectedIndices().length > 0) {
                                bi = qrj.getControl().getSelectedIndices()[0] + 1;
                            }
                            var rn = qrj.mLctb.findAny(["CUST_CODE", "DESCR", "DESCR2", "ACCNO", "COSTCENT"], txt.getValue(), bi);
                            if (rn < 0) {
                                qrj.getControl().setSelectedIndex(-1);
                                return;
                            }
                            qrj.getControl().setSelectedIndex(rn);
                            if (rn > 1) {
                                qrj.getControl().setFirstVisibleRow(rn - 1);
                            } else
                                qrj.getControl().setFirstVisibleRow(rn);
                        }
                    });
                    var btDelRow = new sap.m.Button({
                        icon: "sap-icon://sys-minus",
                        tooltip: "select and delete a row ",
                        press: function () {
                            if (qrj.getControl().getSelectedIndices().length == 0) {
                                sap.m.MessageToast.show("Must select a row !");
                                return;
                            }
                            var sl = qrj.getControl().getSelectedIndices();
                            for (var s = sl.length - 1; s >= -1; s--)
                                qrj.deleteRow(sl[s]);
                        }
                    });
                    var btAddRow = new sap.m.Button({
                        icon: "sap-icon://sys-add",
                        tooltip: "select add a row ",
                        press: function () {
                            if (qrj.getControl().getSelectedIndices().length == 0) {
                                sap.m.MessageToast.show("Must select a row !");
                                return;
                            }
                            var sl = qrj.getControl().getSelectedIndices()[0];
                            qrj.insertRow(sl);
                        }
                    });
                    var btNewAc = new sap.m.Button({
                        icon: "sap-icon://account",
                        tooltip: "Create new A/c",
                        press: function () {
                            UtilGen.execCmd("bin.forms.gl.masterAc formSize=650px,400px status=new", UtilGen.DBView, UtilGen.DBView.txtExeCmd, UtilGen.DBView.newPage);
                        }
                    });
                    var btPos = new sap.m.Button({
                        icon: "sap-icon://bullet-text",
                        tooltip: "Re-positioning",
                        press: function () {
                            if (!qrj.editable)
                                return;
                            var n = 1;
                            var lc = qrj.mLctb;
                            for (var i = 0; i < lc.rows.length; i++)
                                lc.setFieldValue(i, "POS", n++);
                            qrj.updateDataToControl();
                        }
                    });
                    var btSOA = new sap.m.Button({
                        icon: "sap-icon://document-text",
                        tooltip: "SOA",
                    });
                    btSOA.attachBrowserEvent("mousedown", function () {
                        var rowno = -1;
                        var colno = -1;
                        if (qrj.getControl().getSelectedIndices().length == 0) {
                            const currentFocusedControlId = sap.ui.getCore().getCurrentFocusedControlId();
                            var _input = sap.ui.getCore().byId(currentFocusedControlId);
                            // if (_input != undefined || (!_input.getParent() instanceof sap.ui.table.Row)) return;
                            rowno = qrj.getControl().indexOfRow(_input.getParent());
                            colno = _input.getParent().indexOfCell(_input);
                            qrj.getControl().setSelectedIndex(rowno);
                        } else
                            rowno = qrj.getControl().getSelectedIndices()[0];
                        var oModel = qrj.getControl().getModel();
                        var currentRowContext = qrj.getControl().getContextByIndex(rowno + qrj.getControl().getFirstVisibleRow());
                        var accno = oModel.getProperty("ACCNO", currentRowContext);
                        var cc = oModel.getProperty("CUST_CODE", currentRowContext);
                        if (Util.nvl(cc, "") != "") {
                            UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=0 para_PARAFORM=false para_EXEC_REP=true pref=" + cc + " fromdate=@01/01/2020", UtilGen.DBView, qrj.getControl(), UtilGen.DBView.newPage);
                        } else if (Util.nvl(accno, "") != "") {
                            UtilGen.execCmd("testRep5 formType=dialog formSize=100%,80% repno=1 para_PARAFORM=false para_EXEC_REP=true fromacc=" + accno + " toacc=" + accno + " fromdate=@01/01/2020", UtilGen.DBView, qrj.getControl(), UtilGen.DBView.newPage);
                        }
                        if (colno != -1) {
                            setTimeout(function () {
                                if (Util.nvl(cc, "") != "") {
                                    var bl = Util.getSQLValue("select sum(debit-credit) from acvoucher2 where cust_code=" + Util.quoted(cc));
                                    sap.m.MessageToast.show("#" + cc + " Balance is : " + df.format(bl));
                                } else if (Util.nvl(accno, "") != "") {
                                    var bl = Util.getSQLValue("select sum(debit-credit) from acvoucher2 where accno=" + Util.quoted(accno));
                                    sap.m.MessageToast.show("#" + accno + " Balance is : " + df.format(bl));
                                }

                            });
                        }
                        qrj.getControl().setSelectedIndex(-1);

                    });
                    var btCpyFromVou = new sap.m.Button({
                        icon: "sap-icon://copy",
                        tooltip: "Copy line items from another voucher..",
                    });
                    btCpyFromVou.attachBrowserEvent("mousedown", function () {
                        var sq = "SELECT V.VOU_CODE,V.TYPE,nvl(AG.NAMEa,ag.name) name,COUNT(*) VOUCHERS_CNT FROM ACVOUCHER1 V,ACGRPJVS AG " +
                            " WHERE V.VOU_CODE=AG.VOU_CODE AND V.TYPE=AG.VOU_TYPE " +
                            " GROUP BY V.VOU_CODE,V.TYPE,nvl(AG.NAMEa,ag.name) " +
                            " ORDER BY V.VOU_CODE,V.TYPE";
                        Util.show_list(sq, ["NAME", "VOUCHERS_CNT"], "", function (data) {
                            if (data == null || data == undefined || data.length <= 0)
                                return false;
                            var vc = data.VOU_CODE;
                            var vt = data.TYPE;
                            setTimeout(() => {
                                var sq2 = "select no,TO_CHAR(vou_date,'DD/MM/RRRR') VOU_DATE ,descr,keyfld ,DEBAMT DEBAMT" +
                                    " from acvoucher1 where vou_code=" + vc +
                                    " and type=" + vt + " order by acvoucher1.vou_date desc,no desc";
                                Util.show_list(sq2, ["NO", "VOU_DATE", "DESCR", "DEBAMT"], "", function (data) {
                                    that.copyDataFromVou(data, qrj, vars);
                                    return true;
                                }, "100%", "100%", undefined, true);


                            }, 100);
                            return true;
                        }, "100%", "50%", undefined, false);

                    });
                    qrj.showToolbar.toolbar.removeAllContent();
                    qrj.showToolbar.toolbar.addStyleClass("toolBarBackgroundColor1");

                    qrj.showToolbar.toolbar.addContent(btAddRow);
                    qrj.showToolbar.toolbar.addContent(btDelRow);
                    qrj.showToolbar.toolbar.addContent(btNewAc);
                    qrj.showToolbar.toolbar.addContent(btPos);
                    qrj.showToolbar.toolbar.addContent(btSOA);
                    qrj.showToolbar.toolbar.addContent(btCpyFromVou);
                    qrj.showToolbar.toolbar.addContent(new sap.m.ToolbarSpacer());
                    qrj.showToolbar.toolbar.addContent(txt);
                    qrj.showToolbar.toolbar.addContent(btf);
                    scrollObjs.push(qrj.showToolbar.toolbar);
                },
                attachLoadQry: function (frm, qry, kindof, refer) {
                    frm.fileUpload = undefined;
                    var desc = Util.getSQLValue("select descr from c7_attach where kind_of='" + kindof + "' and refer='" + refer + "'");
                    qry.formview.setFieldValue("attachment", desc);
                    Util.doXhr("getAttachVou?kindof=" + kindof + "&refer=" + refer, true, function (e) {
                        if (this.status == 200 && this.response.byteLength > 0)
                            frm.fileUpload = new Blob([this.response], { type: "application/pdf" });
                    });

                },
                attachSaveQry: function (that2, kindof, refer) {
                    // if (that2.fileUpload != undefined) {
                    // var kf = that2.frm.getFieldValue("keyfld");
                    var tx = that2.frm.getFieldValue("attachment");
                    Util.doXhrUpdateVouAttach("uploadAttachPdfVou", true, that2.fileUpload, refer, tx, Util.nvl(kindof, 'VOU'));
                    // }

                },
                attachShowUpload: function (that2, pChange) {
                    Util.sleep(1200);
                    var change = Util.nvl(pChange, true);
                    var vb = new sap.m.VBox();
                    // var tx = new sap.m.Input({ placeholder: "Descr" });
                    var pv = new sap.m.PDFViewer({
                        displayType: sap.m.PDFViewerDisplayType.Embedded,
                        showDownloadButton: false,
                        height: "500px",
                        width: "100%",
                    });
                    var onLoad = function (e) {
                        var pdfData = new Uint8Array(e.target.result);
                        var blob = new Blob([pdfData], { type: "application/pdf" });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.target = "_blank";
                        link.style.display = "none";
                        document.body.appendChild(link);
                        link.download = "rpt" + new Date() + ".pdf";
                        // Util.printPdf(link.href);
                        jQuery.sap.addUrlWhitelist("blob");
                        pv.setSource(link.href);

                    };

                    if (that2.fileUpload != undefined) {
                        var file = that2.fileUpload;
                        var reader = new FileReader();
                        reader.onload = onLoad;
                        reader.readAsArrayBuffer(file);
                        that2.fileUpload = file;
                    }

                    var fu = new sap.ui.unified.FileUploader({
                        fileType: ["pdf"],
                        onFileUpload: function (event) {
                            var file = event.getParameter("files")[0];
                            that2.fileUpload = file;
                        },
                        change: function (e) {
                            var files = e.getParameters("files").files;
                            if (files.length < 1) {
                                alert('select a file...');
                                return;
                            }
                            var file = files[0];
                            var reader = new FileReader();
                            reader.onload = onLoad;
                            reader.readAsArrayBuffer(file);
                            that2.fileUpload = file;
                        },
                    });
                    if (change)
                        vb.addItem(fu);
                    // vb.addItem(tx);
                    // vb.addItem(bt);
                    vb.addItem(pv);

                    var dlg = new sap.m.Dialog({
                        content: vb,
                        title: "Select PDF file to attach voucher",
                        contentWidth: "100%",
                        buttons: [
                            new sap.m.Button({
                                text: "Delete",
                                press: function () {
                                    if (!change) { sap.m.MessageToast.show("Cant delete !"); return; }
                                    pv.setSource(undefined);
                                    that2.fileUpload = undefined;
                                }
                            }),
                            new sap.m.Button({
                                text: "Close",
                                press: function () {
                                    dlg.close();
                                }
                            }),
                        ]
                    });
                    dlg.open();
                    setTimeout(function () {
                        sap.m.MessageToast.show("Open again in case you dont see attachment !!!");
                    });
                },
                showRVByInvs: function (that2) {
                    // var that2 = this;
                    var sc = new sap.m.ScrollContainer().addStyleClass("sapUiMediumMargin");
                    sc.addContent(new sap.m.Text({ text: "Enter customer code:" }));
                    var txtPaidAmt = new sap.m.Input({
                        editable: false
                    });
                    var fetchData = function (pIsLifo) {
                        var isLifo = Util.nvl(pIsLifo, false);
                        var pdamt = parseFloat(txtAmount.getValue());
                        if (pdamt <= 0) FormView.err("Cant be 0 amount !");
                        var custCode = txtCustCode.getValue();
                        if (Util.nvl(custCode, "") == "")
                            FormView.err("Customer is not selected !")
                        var dt = Util.execSQL("SELECT INVOICE_NO,CUSNO,NAME,invoice_date,(NET_AMT-(PAID_AMT+RETURN_AMT)) NETPAY,PAID_AMT+RETURN_AMT PD ,INVUNPAID.KEYFLD,NET_AMT ,0 PAID_AMT" +
                            " FROM INVUNPAID,C_YCUST WHERE " +
                            " CUSNO IN (SELECT CODE FROM C_YCUST WHERE PATH LIKE (select path from c_ycust where code='" + txtCustCode.getValue() + "')||'%') " +
                            " AND CUSNO=CODE " +
                            " AND (NET_AMT-(PAID_AMT+RETURN_AMT))>0 AND INVOICE_CODE=21 " +
                            (isLifo ? " ORDER BY INVOICE_DATE desc,INVUNPAID.keyfld desc" : " ORDER BY INVOICE_DATE,INVUNPAID.keyfld "));
                        if (dt.ret == "SUCCESS") {
                            qr.setJsonStrMetaData("{" + dt.data + "}");
                            qr.mLctb.cols[qr.mLctb.getColPos("PAID_AMT")].mColClass = "sap.m.Input";
                            qr.mLctb.cols[qr.mLctb.getColPos("INVOICE_DATE")].getMUIHelper().display_format = "SHORT_DATE_FORMAT";
                            qr.mLctb.cols[qr.mLctb.getColPos("NETPAY")].getMUIHelper().display_format = "MONEY_FORMAT";
                            qr.mLctb.cols[qr.mLctb.getColPos("PD")].getMUIHelper().display_format = "MONEY_FORMAT";
                            qr.mLctb.cols[qr.mLctb.getColPos("NET_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";
                            qr.mLctb.cols[qr.mLctb.getColPos("PAID_AMT")].getMUIHelper().display_format = "MONEY_FORMAT";

                            qr.mLctb.cols[qr.mLctb.getColPos("INVOICE_NO")].getMUIHelper().display_width = 80;
                            qr.mLctb.cols[qr.mLctb.getColPos("CUSNO")].getMUIHelper().display_width = 80;
                            qr.mLctb.cols[qr.mLctb.getColPos("NAME")].getMUIHelper().display_width = 130;
                            qr.mLctb.cols[qr.mLctb.getColPos("INVOICE_DATE")].getMUIHelper().display_width = 90;
                            qr.mLctb.cols[qr.mLctb.getColPos("NETPAY")].getMUIHelper().display_width = 90;
                            qr.mLctb.cols[qr.mLctb.getColPos("PD")].getMUIHelper().display_width = 90;
                            qr.mLctb.cols[qr.mLctb.getColPos("NET_AMT")].getMUIHelper().display_width = 90;
                            qr.mLctb.cols[qr.mLctb.getColPos("PAID_AMT")].getMUIHelper().display_width = 90;

                            qr.mLctb.cols[qr.mLctb.getColPos("KEYFLD")].mHideCol = true;
                            qr.mLctb.cols[qr.mLctb.getColPos("PAID_AMT")].eValidateColumn = function (evtx) {
                                if (qr.eventCalc != undefined)
                                    if (!qr.eventCalc(qr, this, -1, true))
                                        evtx.getSource().focus();

                            };
                            qr.eventCalc = function (qv, cx, rowno, reAmt) {
                                var sett = sap.ui.getCore().getModel("settings").getData();
                                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);

                                if (reAmt)
                                    qv.updateDataToTable();

                                var ld = qv.mLctb;
                                var sumPaidAmt = 0;
                                for (var i = 0; i < ld.rows.length; i++) {
                                    sumPaidAmt += Util.nvl(Util.extractNumber(ld.getFieldValue(i, "PAID_AMT"), df), 0);
                                }
                                txtPaidAmt.setValue(df.format(sumPaidAmt));
                                return true;
                            };
                            qr.mLctb.parse("{" + dt.data + "}", true);

                            var pdamt = parseFloat(txtAmount.getValue());
                            var pa = 0;
                            for (var i = 0; i < qr.mLctb.rows.length; i++) {
                                var pa = qr.mLctb.getFieldValue(i, "NETPAY");
                                if (pdamt - pa < 0)
                                    pa = pdamt;
                                if (pa > 0)
                                    qr.mLctb.setFieldValue(i, "PAID_AMT", pa);
                                pdamt = pdamt - pa;
                            }
                            qr.loadData();

                        }
                    }
                    var txtCustCode = new sap.m.Input({
                        width: "100px",
                        showValueHelp: true,
                        valueHelpRequest: function (e) {
                            if (e.getParameters().clearButtonPressed || e.getParameters().refreshButtonPressed) {
                                UtilGen.setControlValue(this, "", "", true);
                                UtilGen.setControlValue(txtParentName, "", "", true);
                                return;
                            }
                            var control = this;
                            var pacnm = txtCustName;
                            var sq = "select code, name from c_ycust where iscust='Y' order by path";
                            Util.showSearchList(sq, "NAME", "CODE", function (valx, val) {
                                UtilGen.setControlValue(control, valx, valx, true);
                                UtilGen.setControlValue(pacnm, val, val, true);
                            }, "Select a customer ...");
                        },
                        change: function (e) {
                            var control = this;
                            var vl = control.getValue();
                            var pacnm = txtCustName
                            UtilGen.setControlValue(pacnm, "", "", true);
                            var pnm = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(vl));
                            UtilGen.setControlValue(pacnm, pnm, pnm, true);
                            UtilGen.setControlValue(control, vl, vl, false);
                        }
                    });
                    var txtCustName = new sap.m.Input({
                        width: "200px",
                        editable: false
                    });

                    var txtAmount = new sap.m.Input({
                        width: "100px",
                        value: "0"
                    });

                    var btFifo = new sap.m.Button({
                        text: "FIFO Invoices",
                        press: function () {
                            fetchData(false);

                        }
                    });

                    var btLifo = new sap.m.Button({
                        text: "LIFO Invoices",
                        press: function () {
                            fetchData(true);
                        }
                    }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd");

                    var h1 = new sap.m.HBox({
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [txtCustCode, txtCustName, new sap.m.Text({ text: "Amount:" }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd"), txtAmount, btFifo, btLifo]
                    });

                    sc.addContent(h1);

                    var qr = new QueryView("qryRcptInvs" + that2.timeInLong);
                    qr.getControl().setEditable(true);

                    qr.getControl().view = that2;
                    qr.getControl().addStyleClass("sapUiSizeCondensed sapUiSmallMarginTop");
                    qr.getControl().setSelectionMode(sap.ui.table.SelectionMode.Single);
                    qr.getControl().setFixedBottomRowCount(0);
                    qr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
                    qr.getControl().setVisibleRowCount(10);
                    qr.insertable = false;
                    qr.deletable = false;
                    qr.editable = true;
                    sc.addContent(qr.getControl());
                    sc.addContent(new sap.m.VBox({ height: "50px" }));
                    sc.addContent(new sap.m.HBox({
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [new sap.m.Text({ text: "Amount:" }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd"), txtPaidAmt]
                    }
                    ));
                    var dlg = new sap.m.Dialog({
                        contentHeight: "80%",
                        contentWidth: "90%",
                        content: sc,
                        buttons: [
                            new sap.m.Button({
                                text: "OK",
                                press: function () {
                                    var amt = parseFloat(Util.extractNumber(txtAmount.getValue()));
                                    var totpd = parseFloat(Util.extractNumber(txtPaidAmt.getValue()));
                                    if (amt != totpd)
                                        FormView.err("Amount not matched with # " + amt);
                                    var ld = that2.frm.objs["qry2"].obj.mLctb;
                                    var ldinv = qr.mLctb;
                                    var ldi = 0;
                                    var des = that2.frm.getFieldValue("qry1.descr");
                                    ld.removeAllRows();
                                    ld.addRow();
                                    for (var i = 0; i < ldinv.rows.length; i++) {
                                        var pd = ldinv.getFieldValue(i, "PAID_AMT");
                                        if (pd > 0) {
                                            ld.setFieldValue(ldi, "CUST_CODE", ldinv.getFieldValue(i, "CUSNO"));
                                            ld.setFieldValue(ldi, "CREDIT", pd);
                                            ld.setFieldValue(ldi, "FCCREDIT", pd);
                                            ld.setFieldValue(ldi, "INVKEYFLD", ldinv.getFieldValue(i, "KEYFLD"));
                                            var nm = Util.getSQLValue("select name from c_ycust where code=" + Util.quoted(ldinv.getFieldValue(i, "CUSNO")));
                                            var acn = Util.getSQLValue("select ac_no from c_ycust where code=" + Util.quoted(ldinv.getFieldValue(i, "CUSNO")));
                                            var invdes = Util.getSQLValue("SELECT MAX('Inv # '||invoice_no||', Location ='||location_code ) from pur1 where keyfld=" + ldinv.getFieldValue(i, "KEYFLD"));
                                            ld.setFieldValue(ldi, "ACNAME", nm);
                                            ld.setFieldValue(ldi, "DESCR", des);
                                            ld.setFieldValue(ldi, "ACCNO", acn);
                                            ld.setFieldValue(ldi, "INV_DESCR", invdes);

                                            if (ld.rows.length >= ldi)
                                                ld.addRow();
                                            ldi++;
                                        }
                                    }
                                    if (ld.rows.length > 1)
                                        ld.deleteRow(ld.rows.length - 1);

                                    that2.frm.objs["qry2"].obj.updateDataToControl();
                                    that2.frm.objs["qry2"].obj.eventCalc(that2.frm.objs["qry2"].obj, undefined, -1, true);
                                    dlg.close();
                                }
                            }),
                            new sap.m.Button({
                                text: "Cancel",
                                press: function () {
                                    dlg.close();
                                }
                            })
                        ]
                    }).addStyleClass("sapUiSizeCondensed sapUiSizeCompact");
                    dlg.open();
                },
                showQuickBatch: function (ky, that) {
                    // var that = this;
                    var kfld = ky.split("-")[0];
                    var bat_id = ky.split("-")[1];
                    var paras = [];
                    var bnkcash = "2";
                    var strs = "";
                    var dt = Util.execSQL("select *from c7_batches_1 where keyfld=" + kfld + " and bat_id=" + bat_id);
                    if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                        var dtxM = JSON.parse("{" + dt.data + "}").data;
                        for (var di in dtxM)
                            for (var d2 in dtxM[di])
                                strs += dtxM[di][d2] + " ";
                        var dt = Util.execSQL("select *from c7_batches_2 where keyfld=" + kfld + " and bat_id=" + bat_id);
                        if (dt.ret == "SUCCESS" && dt.data.length > 0) {
                            var dtxM = JSON.parse("{" + dt.data + "}").data;
                            for (var di in dtxM)
                                for (var d2 in dtxM[di])
                                    strs += dtxM[di][d2] + " ";
                        }

                    }

                    var dt = Util.execSQL("select *from c7_batches_para where keyfld=" + kfld);
                    var dtxM = JSON.parse("{" + dt.data + "}").data;
                    for (var di in dtxM)
                        if (strs.indexOf(":" + dtxM[di].PARA_NAME) >= 0)
                            paras.push(dtxM[di].PARA_NAME);

                    this.quickPara(kfld, bat_id, paras, that);


                },
                quickPara: function (kf, bat_id, pPara, that) {
                    var str = "";
                    // var that = this;
                    var sett = sap.ui.getCore().getModel("settings").getData();

                    var params = { "keyfld": kf, "bat_id": bat_id };
                    var fp = Util.nvl(Util.getSQLValue("select nvl(max(form_paras),'') para from c7_batches where keyfld=" + kf), "");
                    var sp = fp.split(" ");
                    for (var si in sp)
                        params[sp[si].split("=")[0]] = sp[si].split("=")[1];

                    pPara.forEach(ky => {
                        str += (str.length > 0 ? "," : "") + Util.quoted(ky);
                    });

                    var fnExeBatch = function (txt2, kfld, bat_id) {
                        var prx = txt2.split("&");
                        var paras = {};
                        var mapFlds1 = {};
                        var mapFlds2 = [];
                        prx.forEach(el => {
                            paras[el.split("=")[0]] = el.split("=")[1];
                        });
                        var isContentFormula = function (str) {
                            if (str.indexOf("+") >= 0 ||
                                str.indexOf("=") >= 0 ||
                                str.indexOf("*") >= 0 ||
                                str.indexOf("/") >= 0 ||
                                str.indexOf("-") >= 0)
                                return true;
                            return false;

                        }
                        var parseVal = function (vl) {
                            var vlx = vl;

                            for (var pi in paras)
                                vlx = vlx.replaceAll(":" + pi, paras[pi]);


                            if (typeof vlx == "string")
                                vlx = vlx.replaceAll("%20", " ");
                            if (vlx.startsWith("@") && !vlx.startsWith("@$"))
                                vlx = new Date(vlx.substring(1));
                            if (typeof vlx == "string" && vlx.startsWith("@") && vlx.startsWith("@$"))
                                vlx = Util.parseDefaultValue(vl.substring(1));

                            return vlx;
                        }
                        var dtx = Util.execSQLWithData("select *from c7_batches_1 where keyfld=" + kfld + " and bat_id=" + bat_id, "No data found, c7_batches_1 table !");
                        var fvs = Util.nvl(dtx[0].FIELDVALUES, "").split(" ");
                        for (var fi in fvs)
                            mapFlds1[fvs[fi].split("=")[0]] = fvs[fi].split("=")[1];
                        var dtx = Util.execSQLWithData("select *from c7_batches_2 where keyfld=" + kfld + " and bat_id=" + bat_id, "No data found, c7_batches_2 table!");
                        for (var di in dtx) {
                            var flds = {
                                accno: Util.nvl(dtx[di].FLD_ACCNO, ""),
                                amt: Util.nvl(dtx[di].AMOUNT, ""),
                                descr: Util.nvl(dtx[di].FLD_DESCR, ""),
                                costcent: Util.nvl(dtx[di].FLD_COSTCENT, ""),
                                rp_code: Util.nvl(dtx[di].FLD_RP_CODE, ""),
                                branch_no: Util.nvl(dtx[di].FLD_RP_BRANCH + "", "") + ""
                            }
                            mapFlds2.push(flds);
                        }
                        for (mi in mapFlds1)
                            mapFlds1[mi] = parseVal(mapFlds1[mi]);
                        for (mi in mapFlds2) {
                            var flds = mapFlds2[mi];
                            for (fi in flds)
                                flds[fi] = parseVal(flds[fi]);
                        }
                        UtilGen.setControlValue(that.frm.objs["qry1.descr"].obj, mapFlds1["descr"], mapFlds1["descr"], true);
                        if (that.frm.objs["qry1.rcvfrom"] != undefined)
                            UtilGen.setControlValue(that.frm.objs["qry1.rcvfrom"].obj, mapFlds1["payto"], mapFlds1["payto"], true);
                        if (that.frm.objs["qry1.code"] != undefined)
                            UtilGen.setControlValue(that.frm.objs["qry1.code"].obj, mapFlds1["codeacc"], mapFlds1["codeacc"], true);
                        // var nm = Util.getSQLValue("select name from acaccount where accno='" + mapFlds1["codeacc"] + "'");
                        // UtilGen.setControlValue(that.frm.objs["qry1.codename"].obj, nm, nm, true);
                        var ld = that.frm.objs["qry2"].obj.mLctb;
                        ld.removeAllRows();
                        var p = 0;
                        for (var mi in mapFlds2) {
                            var flds = mapFlds2[mi];
                            var amt = (isContentFormula(flds.amt + "") ? eval(flds.amt) : flds.amt);
                            if (amt != 0) {
                                ld.addRow();
                                if (that.vars.vou_code == 2 && amt > 0)
                                    amt = amt * -1;
                                var acn = flds.accno;
                                var des = Util.nvl(flds.descr, Util.nvl(mapFlds1["descr"], ""));
                                var nm = Util.getSQLValue("select name from acaccount where accno='" + acn + "'");
                                var csname = "";
                                if (flds.rp_code != "") {
                                    nm = Util.getSQLValue("select name from c_ycust where code='" + flds.rp_code + "'");
                                    acn = Util.getSQLValue("select ac_no from c_ycust where code=" + Util.quoted(flds.rp_code));
                                }
                                if (flds.costcent != "")
                                    csname = Util.getSQLValue("select title from accostcent1 where code='" + flds.costcent + "'");

                                ld.setFieldValue(p, "CUST_CODE", flds.rp_code);
                                ld.setFieldValue(p, "COSTCENT", flds.costcent);
                                ld.setFieldValue(p, "CREDIT", (amt < 0 ? Math.abs(amt) : 0));
                                ld.setFieldValue(p, "FCCREDIT", (amt < 0 ? Math.abs(amt) : 0));
                                ld.setFieldValue(p, "DEBIT", (amt > 0 ? amt : 0));
                                ld.setFieldValue(p, "FCDEBIT", (amt > 0 ? amt : 0));
                                ld.setFieldValue(p, "ACNAME", nm);
                                ld.setFieldValue(p, "CSNAME", csname);
                                ld.setFieldValue(p, "DESCR", des);
                                ld.setFieldValue(p, "ACCNO", acn);
                                p++;
                            }
                        }
                        that.frm.objs["qry2"].obj.updateDataToControl();
                        that.frm.objs["qry2"].obj.loadData();
                        // that.frm.objs["qry2"].obj.eventCalc(that.frm.objs["qry2"].obj, undefined, -1, true);

                        return true;

                    }
                    var vb = new sap.m.VBox({});
                    var formWidth = Util.nvl(params["formWidth"], "600px");
                    var dialogWidth = Util.nvl(params["dialogSize"], "90%,90%").split(",")[0];
                    var dialogHeight = Util.nvl(params["dialogSize"], "90%,90%").split(",")[1];
                    var dt = Util.execSQL("select *from C7_BATCHES_PARA where keyfld=" + params["keyfld"] + " and  para_name in (" + str + ") order by pos");
                    if (dt.ret == "SUCCESS") {
                        var dtx = JSON.parse("{" + dt.data + "}").data;
                        var fe = [];
                        var parAr = []; // to get all parameter name in array
                        for (var di in dtx)
                            parAr.push(dtx[di].PARA_NAME);
                        var titleTxt = "";
                        for (var d in dtx) {
                            if (Util.nvl(dtx[d].TITLE_TXT1, "") != titleTxt) {
                                titleTxt = Util.nvl(dtx[d].TITLE_TXT1, "");
                                fe.push(Util.getLabelTxt(titleTxt, Util.nvl(dtx[d].LBL_WIDTH, "25%"), "", "qrGroup"));
                            }
                            fe.push(Util.getLabelTxt(dtx[d].TITLE, Util.nvl(dtx[d].LBL_WIDTH, "25%"), Util.nvl(dtx[d].LINE_DLM, "")));
                            var obj = UtilGen.addControl(fe, "@", (dtx[d].DATA_TYPE == "date" ? sap.m.DatePicker : sap.m.Input), "para_" + dtx[d].PARA_NAME + "__" + that.timeInLong + "",
                                {
                                    customData: [/*0*/{ key: "" }, /*1*/{ key: dtx[d].PARA_NAME },/*2*/ { key: dtx[d].VALIDATION }, /*3*/{ key: dtx[d].LIST_SQL },/*4*/{ key: dtx[d].LIST_RET_FIELD },/*5*/{ key: dtx[d].ONCALC }],
                                    width: Util.nvl(dtx[d].OBJ_WIDTH, "75%"),
                                    showValueHelp: (Util.nvl(dtx[d].LIST_SQL, "") != "") ? true : false,
                                    editable: (Util.nvl(dtx[d].EDITABLE, "Y") == "Y") ? true : false,
                                    valueHelpRequest: function (e) {
                                        var sq = Util.nvl(this.getCustomData()[3].getKey(), "");
                                        var rf = Util.nvl(this.getCustomData()[4].getKey(), "");
                                        var fldCode = that.view.byId("para_" + this.getCustomData()[1].getKey() + "__" + that.timeInLong);
                                        var fldTit = that.view.byId("para_TITLE" + this.getCustomData()[1].getKey() + "TITLE__" + that.timeInLong);
                                        Util.show_list(sq, ["CODE", "TITLE"], "", function (data) {
                                            UtilGen.setControlValue(fldCode, data.CODE, data.CODE, true);
                                            if (fldTit != undefined)
                                                UtilGen.setControlValue(fldTit, data.TITLE, data.TITLE, true);
                                            return true;
                                        }, "100%", "100%", undefined, false);
                                    },
                                    change: function (e) {
                                        var sq = Util.nvl(this.getCustomData()[2].getKey(), "");
                                        sq = sq.replaceAll(":CODE", this.getValue());
                                        var onCalc = this.getCustomData()[5].getKey();
                                        if (onCalc != "") {
                                            for (var pi in parAr) {
                                                var vl = UtilGen.getControlValue(that.view.byId("para_" + parAr[pi] + "__" + that.timeInLong));
                                                if (vl != null && vl instanceof Date)
                                                    vl = Util.toOraDateString(vl);

                                                onCalc = onCalc.replaceAll(":" + parAr[pi], Util.nvl(vl, "null"));
                                            }
                                            try {
                                                eval(onCalc.replaceAll("that.byId", "that.view.byId"));
                                            }
                                            catch (err) { sap.m.MessageToast.show(err); console.log(err); }
                                        }
                                        if (Util.nvl(sq, "") == "") return;
                                        var vl = Util.getSQLValue(sq);
                                        var fldTit = that.view.byId("para_TITLE" + this.getCustomData()[1].getKey() + "TITLE__" + that.timeInLong);
                                        if (vl != undefined && fldTit != undefined)
                                            UtilGen.setControlValue(fldTit, vl, vl, true);
                                    }
                                }, dtx[d].DATA_TYPE, Util.nvl(sett[dtx[d].FORMAT_FLD], dtx[d].FORMAT_FLD), that.view);

                            if (dtx[d].PARA_VALUE != undefined) {
                                var value = dtx[d].PARA_VALUE;
                                if (obj instanceof sap.m.DatePicker && dtx[d].PARA_VALUE.startsWith("@"))
                                    if (params[dtx[d].PARA_NAME] != undefined)
                                        value = UtilGen.parseDefaultValue(params[dtx[d].PARA_NAME].substring(1));//new Date(params[dtx[d].PARA_NAME].substring(1));
                                    else {
                                        value = UtilGen.parseDefaultValue(dtx[d].PARA_VALUE.substring(1));//new Date(dtx[d].PARA_VALUE.substring(1));

                                    }
                                else
                                    if (params[dtx[d].PARA_NAME] != undefined)
                                        value = params[dtx[d].PARA_NAME];
                                    else
                                        value = dtx[d].PARA_VALUE;


                                UtilGen.setControlValue(obj, value, value, true);


                            }
                        }
                        Util.navEnter(fe);
                        var cnt = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                            width: formWidth,
                            cssText: [
                                "padding-left:0px ;" +
                                "padding-top:5px;" +
                                "border-style: groove;" +
                                "margin-left: 0;" +
                                "margin-right: 0;" +
                                "border-radius:20px;" +
                                "margin-top: 10px;"
                            ]
                        }, "sapUiSizeCompact", "");
                        cnt.addContent(new sap.m.VBox({ height: "40px" }));
                        vb.addItem(cnt);
                    }
                    var dlg = new sap.m.Dialog({
                        title: Util.getLangText("parameters"),
                        contentWidth: dialogWidth,
                        contentHeight: dialogHeight,
                        content: [vb],
                        buttons: [
                            new sap.m.Button({
                                text: Util.getLangText("executeTxt"),
                                press: function () {
                                    var str = "";
                                    for (var f in fe) {
                                        var val;
                                        if (typeof fe[f] == "string")
                                            continue;
                                        if (fe[f] instanceof sap.m.InputBase)
                                            val = UtilGen.getControlValue(fe[f]);
                                        if (val instanceof Date)
                                            val = "@" + val.getDate() + "\/" + (val.getMonth() + 1) + "\/" + val.getFullYear();
                                        val = val.startsWith("@") ? val : encodeURIComponent(val);
                                        str += (str.length > 0 ? " " : "") + fe[f].getCustomData()[1].getKey() + "=" + val;
                                    }
                                    str = ("keyfld=" + params["keyfld"] + " " + str).replaceAll(" ", "&");
                                    var dt = fnExeBatch(str, params["keyfld"], params["bat_id"]);
                                    if (dt)
                                        dlg.close();

                                }
                            }),
                            new sap.m.Button({
                                text: Util.getLangText("closeTxt"),
                                press: function () {
                                    dlg.close();
                                }
                            })

                        ]
                    });
                    dlg.open();
                    // setTimeout(function () {
                    //     dlg.$().offset({ top: "100", left: "100" });
                    // });

                },

            },
            setFormTitle: function (frm, tit, mainPage) {
                if (typeof frm.getParent != "undefined" && (frm.getParent() instanceof sap.m.Dialog))
                    frm.getParent().setTitle(tit);
                else {
                    mainPage.setShowHeader(true);
                    mainPage.setTitle(tit);
                }
            },
            showBalanceAccno: function (cd) {
                var sett = sap.ui.getCore().getModel("settings").getData();
                var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
                var bl = Util.getSQLValue('select sum(debit-credit) from acvoucher2 where accno=' + Util.quoted(cd));
                sap.m.MessageToast.show("#" + cd + "# Balance is : " + df.format(bl));
            },
            setColorCellDrCr: function (qv, startCell, endCell, dispRow, css, colName) {
                // var qt = oModel.getProperty(colName, currentRowContext);
                // var css = (val > 0 ? UtilGen.DBView.style_debit_numbers + ";text-align:center;" : UtilGen.DBView.style_credit_numbers + ";text-align:center;");
                for (var i = startCell; i < endCell; i++)
                    if (qv.getControl()._getVisibleColumns()[i - startCell].tableCol.mColName == colName) {
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().css("cssText", css);
                        qv.getControl().getRows()[dispRow].getCells()[i - startCell].$().parent().parent().css("cssText", css);
                    }

            },
            getTableColNo: function (tbl, colName) {
                var endCell = tbl.getColumns().length;
                for (var i = 0; i < endCell; i++)
                    if (tbl._getVisibleColumns()[i].tableCol.mColName == colName)
                        return i;
                return -1;
            },
            getPathAccsBalances: function (accs, dt) {
                var sqlStr = "select path from acaccount where '" + accs + "' like '%\"'||accno||'\"%' order by path"
                var dat = Util.execSQL(sqlStr);
                if (dat.ret == "SUCCESS" && dat.data.length > 0) {
                    var dtx = JSON.parse("{" + dat.data + "}").data;
                    var tot = 0;
                    var dtstr = (dt != undefined ? " and vou_date<=" + Util.toOraDateString(dt) : "");
                    for (var i in dtx)
                        tot += Util.getSQLValue("select nvl(sum(debit-credit),0) from acc_transaction_up where path like '" + dtx[i].PATH + "%' " + dtstr);
                    return tot;
                }
                return 0;
            },
            getBackYears: function (pFromdate, pTodate) {
                var thatForm = this;
                var view = thatForm.view;
                var backYears = [];
                var fisc = sap.ui.getCore().getModel("fiscalData").getData();
                var dtBackYears = Util.execSQLWithData("select * from c7_fiscals where code=(select max(back_fiscal_code) from c7_fiscals where code=" + Util.quoted(fisc["fiscal_code"]) + ")");
                var sqladd = 0;
                while (dtBackYears.length > 0) {
                    //Check date range in between date of period
                    if (pFromdate <= new Date(dtBackYears[0].TO_DATE.replaceAll(".", ":")))
                        backYears.push({
                            fiscal_code: dtBackYears[0].CODE,
                            fiscal_title: dtBackYears[0].TITLE,
                            fiscal_from: dtBackYears[0].FROM_DATE,
                            fiscal_to: dtBackYears[0].TO_DATE,
                            fiscal_schema: dtBackYears[0].SCHEMA_OWNER,
                        });
                    sqladd++
                    dtBackYears = Util.execSQLWithData("select * from c7_fiscals where code=(select max(back_fiscal_code) from c7_fiscals where code=" + Util.quoted(dtBackYears[0].CODE) + ")");
                }
                return backYears;
            },
        };

        return UtilGen;
    });


