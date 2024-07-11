sap.ui.define("sap/ui/ce/generic/QueryView", ["./LocalTableData", "./DataFilter"],
    function (LocalTableData, DataFilter) {
        'use strict'

        function QueryView(tableId, pShowBar) {
            var that = this;
            this.mJsonString = "";
            this.prsnEventAfterApply = undefined;
            this.prsnEventAfterRevert = undefined;
            this.timeInLong = (new Date()).getTime();
            this.tableId = tableId + this.timeInLong;
            this.mViewSettings = {};
            this.colMerged = false;
            this.onRowRender = undefined;
            this.mOnAfterLoad = null;
            this.lastSelIndex = -1;
            this.lastSelectedCode = "";
            this.onselect = undefined;
            this.onCellRender = undefined; // parameter row, col , currentContext
            this.onAddRow = undefined;
            this.afterDelRow = undefined;
            this.beforeDelRow = undefined;
            this.parent = undefined;
            this.queryType = 'table';
            this.showToolbar = {
                showBar: Util.nvl(pShowBar, false),
                showSearch: true,
                showFilter: true,
                showNewWnd: true,
                showPersonalization: true,
                showExpand: false,
                showCollapse: false,
                filterCols: [],
                toolbar: undefined,
                showGroupFilter: false

            };


            this.editable = false;
            this.insertable = false;
            this.deletable = false;

            //specific for tree..
            this.mode = sap.ui.table.SelectionMode.MultiToggle;
            this.mColParent = "";
            this.mColTitle = "";
            this.mColCode = "";
            this.mColLevel = "";
            this.mColChild = "";
            this.mColPath = "";
            this.data_binded = false;

            this.mColLstGroup = "";
            this.mColLstGroupNm = "";
            this.eventCalc = undefined;
            this.eventKey = undefined;
            this.mapNodes = {};
            this.when_validate_field = undefined;
            (sap.ui.getCore().byId(this.tableId + "table") != undefined ? sap.ui.getCore().byId(this.tableId + "table").destroy() : null);
            this.mTable = new sap.ui.table.Table(this.tableId + "table", {
                visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
                firstVisibleRow: 3,
                columnMove: false,
                // width: "100%",
                // height: "100%",
                selectionMode: sap.ui.table.SelectionMode.MultiToggle,
                // selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                //enableGrouping: true,
                fixedBottomRowCount: 1,
                rowSelectionChange: function (ev) {
                    // purpose    :   if user click on selection of group row then it will select all details rows.
                    if (that.mLctb.cols.length < 0) return;
                    if (!ev.getParameters().userInteraction)
                        return;
                    if (ev.getParameters().rowIndex == -1) return;
                    var oData = that.mTable.getContextByIndex(ev.getParameters().rowIndex);

                    var data = oData.getProperty(oData.getPath());
                    if (that.mLctb.cols[0].mGrouped &&
                        data[that.mLctb.cols[0].mColName].startsWith(String.fromCharCode(4094))) {
                        that.selectGroup(data[that.mLctb.cols[1].mColName], ev.getParameters().rowIndex);
                    }
                    sap.m.MessageToast.show(that.mTable.getSelectedIndices().length + " selected");
                }
            });
            this.mTable.attachRowsUpdated(function (e) {
                setTimeout(function () {
                    that.colorRows();
                });

            });

            this.mTable.qv = this;
            // purpose    :   creating alternative tree control..
            (sap.ui.getCore().byId(this.tableId + "tree") != undefined ? sap.ui.getCore().byId(this.tableId + "tree").destroy() : null);
            this.mTree = new sap.ui.table.TreeTable(this.tableId + "tree", {
                selectionMode: this.mode,
                enableColumnReordering: true,
                expandFirstLevel: true,
                columnMove: false,
                visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
                fixedBottomRowCount: 0,
                // mode: sap.m.ListMode.SingleSelectMaster
            });
            this.mTree.attachRowsUpdated(function (e) {
                setTimeout(function () {
                    that.colorRows();
                });

            });
            this.mTree.qv = this;
            (sap.ui.getCore().byId(this.tableId + "list") != undefined ? sap.ui.getCore().byId(this.tableId + "list").destroy() : null);
            this.mList = new sap.m.List(this.tableId + "list", {});

            var that = this;

            // $("#" + this.mTable.getId() + "-vsb").on( 'scroll', function(){
            //     console.log('Event Fired');
            //     that.colorRows();
            // });

            // $("#" + this.mTable.getId() + "-vsb").scroll(function () {
            //     console.log("scrolling");
            //     that.colorRows();
            // });


            this.mJsonString = "";
            this.mLctb = new LocalTableData();
            //            this.mLctb.parse();
            //            this.mJsonObject = JSON.parse(jsonStr);
        }

        QueryView.DataFilter = DataFilter;

        QueryView.create = function (tableId, jsonStr) {
            var q = new QueryView(tableId);
            q.tableId = tableId;
            q.mJsonString = jsonStr;
            q.mLctb.parse(jsonStr);
            q.mJsonObject = q.mLctb.getData();
            return q;
        };
        QueryView.prototype.createNewWnd = function () {
            var that = this;
            var neQr = new QueryView(this.tableId + "_copy");
            // neQr.mTable = this.mTable;
            // neQr.mTree = this.mTree;
            // neQr.mList = this.mList;
            var lc = neQr.mLctb;
            lc.cols = this.mLctb.cols.slice(0);
            lc.rows = this.mLctb.rows.slice(0);
            lc.masterRows = this.mLctb.rows.slice(0);
            neQr.switchType(this.queryType);
            neQr.mColParent = this.mColParent;
            neQr.mColCode = this.mColCode;
            neQr.mColChild = this.mColChild;
            neQr.mColLevel = this.mColLevel;
            neQr.mColTitle = this.mColTitle;

            var vb = new sap.m.Page({ showHeader: true });
            var dlg = new sap.m.Dialog({
                showHeader: false,
                contentHeight: "100%",
                contentWidth: "100%",
                content: [vb]
            });
            vb.addContent(neQr.getControl());
            // neQr.loadData();
            neQr.getControl().addStyleClass("sapUiSizeCondensed");
            neQr.getControl().setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
            neQr.getControl().setSelectionMode(sap.ui.table.SelectionMode.None);
            neQr.getControl().setFixedBottomRowCount(this.getControl().getFixedBottomRowCount());
            neQr.getControl().setFixedColumnCount(this.getControl().getFixedColumnCount());
            neQr.getControl().setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Auto);

            neQr.showToolbar.showSearch = true;
            neQr.showToolbar.showFilter = true;
            neQr.showToolbar.showNewWnd = false;
            neQr.showToolbar.showPersonalization = false;
            if (neQr.queryType == "tree") {
                neQr.showToolbar.showExpand = true;
                neQr.showToolbar.showCollapse = true;
            }

            neQr.showToolbar.showGroupFilter = false;
            neQr.createToolbar("", this.showToolbar.filterCols,
                function (prsn, qv) {
                },

                function (qv) {
                }
            );
            neQr.showToolbar.toolbar.addContent(new sap.m.Button({
                icon: "sap-icon://decline",
                text: "Close",
                press: function () {
                    dlg.close();
                }
            }))
            vb.insertHeaderContent(neQr.showToolbar.toolbar);

            if (this.onRowRender != undefined)
                neQr.onRowRender = this.onRowRender;

            dlg.open();
            setTimeout(function () {
                // sap.ui.getCore().byId(that.tableId + "txtSearch").fireLiveChange();
                neQr.loadData();
            }, 100);
        };
        QueryView.prototype.createToolbar = function (addClass, filterCols, prsnEventAfterApply, prsnEventAfterRevert) {
            var that = this;
            this.showToolbar.showBar = true;
            this.showToolbar.filterCols = Util.nvl(filterCols, []);
            var that = this;
            var cont = [new sap.m.ToolbarSpacer()];
            if (this.showToolbar.showGroupFilter) {
                this.showToolbar.lstFltGroup = UtilGen.createControl(sap.m.ComboBox, UtilGen.DBView, "", {
                    customData: [{ key: "" }],
                    visible: false,
                    items: {
                        path: "/",
                        template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                        templateShareable: true
                    },
                    selectionChange: function (event) {
                        that.mViewSettings["filterStr"] = "";
                        if (Util.nvl(this.getValue(), "ALL") != "ALL")
                            that.mViewSettings["filterStr"] = that.mLctb.cols[0].mColName + "=" + this.getValue();
                        that.dontFillFilterComb = true;
                        that.loadData();
                    }
                }, "string", undefined, undefined, "@");

                cont.push(this.showToolbar.lstFltGroup);
            } else
                this.showToolbar.lstFltGroup = undefined;
            if (this.showToolbar.showExpand) {
                Util.destroyID(this.tableId + "cmdExpandAll");
                cont.push(new sap.m.Button(this.tableId + "cmdExpandAll", {
                    icon: "sap-icon://positive", press: function () {
                        that.getControl().expandToLevel(255);
                    }
                }));

            }
            if (this.showToolbar.showCollapse) {
                Util.destroyID(this.tableId + "cmdCollapseALl");
                cont.push(new sap.m.Button(this.tableId + "cmdCollapseALl", {
                    icon: "sap-icon://negative", press: function () {
                        that.getControl().collapseAll();
                    }
                }));

            }

            if (this.showToolbar.showSearch) {
                Util.destroyID(this.tableId + "txtSearch");
                cont.push(new sap.m.Input(this.tableId + "txtSearch", {
                    placeholder: "search text here",
                    width: "150px",
                    value: "",
                    liveChange: function (ev) {
                        UtilGen.doFilterLiveTable(ev, that, that.showToolbar.filterCols);
                        var val = ev.getParameter("newValue");
                        if (that.showBottomFixedRow == undefined)
                            that.showBottomFixedRow = that.getControl().getFixedBottomRowCount();
                        if (val == "") {
                            that.getControl().setFixedBottomRowCount(that.showBottomFixedRow);
                            that.loadData();
                        }
                        else
                            that.getControl().setFixedBottomRowCount(0);
                    }
                }));
            }
            if (this.showToolbar.showFilter) {
                Util.destroyID(this.tableId + "cmdFilter");
                cont.push(new sap.m.Button(this.tableId + "cmdFilter", {
                    icon: "sap-icon://filter", press: function () {
                        that.showFilterWindow(that.getControl().view);
                    }
                }));
            }
            if (this.showToolbar.showPersonalization) {
                if (prsnEventAfterApply != undefined)
                    that.prsnEventAfterApply = prsnEventAfterApply;
                if (prsnEventAfterRevert != undefined)
                    that.prsnEventAfterRevert = prsnEventAfterRevert;
                Util.destroyID(this.tableId + "cmdPersonalization");
                cont.push(new sap.m.Button(this.tableId + "cmdPersonalization", {
                    icon: "sap-icon://settings", press: function () {
                        that.showPersonalization(this);
                    }
                }));
            }
            if (this.showToolbar.showNewWnd) {
                Util.destroyID(this.tableId + "cmdNewWnd");
                cont.push(new sap.m.Button(this.tableId + "cmdNewWnd", {
                    icon: "sap-icon://full-screen", press: function () {
                        that.createNewWnd();
                    }
                }));
            }
            this.showToolbar.toolbar = new sap.m.Toolbar({
                content: cont
            }).addStyleClass("sapUiSizeCompact " + addClass);
        };
        QueryView.prototype.constructor = QueryView;

        QueryView.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        QueryView.prototype.setCallBackListSelect = function (fn) {
            this.callBackListSelect = fn;
        };
        QueryView.prototype.switchType = function (type, parent) {
            this.queryType = type;
            if (parent != undefined) this.parent = parent;
            if (this.parent != undefined) {
                if (this.parent instanceof sap.m.FlexBox) {
                    this.parent.removeItem(this.mTree);
                    this.parent.removeItem(this.mTable);
                    this.parent.removeItem(this.mList);
                    this.parent.addItem(this.getControl());
                }
                if (this.parent instanceof sap.ui.layout.Splitter) {
                    this.parent.removeContentArea(this.mTree);
                    this.parent.removeContentArea(this.mTable);
                    this.parent.removeContentArea(this.mList);
                    var c = [];
                    for (var g = 0; g < this.parent.getContentAreas().length; g++)
                        c[g] = this.parent.getContentAreas()[g];
                    this.parent.removeAllContentArea();
                    this.parent.getContentAreas()
                    this.parent.addContentArea(this.getControl());
                    for (var g in c)
                        this.parent.addContentArea(c[g]);
                }
                if (this.parent instanceof sap.m.Page || this.parent instanceof sap.m.ScrollContainer) {
                    this.parent.removeContent(this.mTable);
                    this.parent.removeContent(this.mTree);
                    this.parent.removeContent(this.mList);
                    this.parent.addContent(this.getControl());
                }
            }


        };


        // getting control if queryied as tree or table...
        QueryView.prototype.getControl = function () {
            if (this.queryType == 'table')
                return this.mTable;
            if (this.queryType == 'tree')
                return this.mTree;
            if (this.queryType == 'list')
                return this.mList;

        };
        QueryView.prototype.personalize = function (prs) {
            var that = this;
            if (prs == undefined) return;
            this.updateDataToControl();
            for (var ci in prs) {
                var cn = that.mLctb.getColPos(ci);
                if (cn <= -1) continue;
                var col = that.mLctb.cols[cn];
                var prop = prs[ci];
                col.mUIHelper.display_style = "";
                if (Util.nvl(prop["background-color"], "") != "")
                    col.mUIHelper.display_style = "background-color:" + prop["background-color"] + ";";
                if (Util.nvl(prop["background"], "") != "")
                    col.mUIHelper.display_style = "background-color:" + prop["background"] + ";";
                if (Util.nvl(prop.color, "") != "")
                    col.mUIHelper.display_style += "color:" + prop.color + ";";
                if (Util.nvl(prop["font-size"], "") != "")
                    col.mUIHelper.display_style += "font-size:" + prop["font-size"] + ";";
                if (Util.nvl(prop.width, "") != "")
                    col.mUIHelper.display_width = Util.nvl(prop.width, col.mUIHelper.display_width);
            }
            this.loadData();
        };
        QueryView.prototype.getCurrentPrs = function () {
            var that = this;
            var prs = {};
            var cols = this.mLctb.cols;
            for (var ci in cols) {
                prs[cols[ci].mColName] = {};
                if (cols[ci].mUIHelper.display_style != "") {
                    var dp = cols[ci].mUIHelper.display_style.split(";")
                    for (var s in dp)
                        prs[cols[ci].mColName][dp[s].split(":")[0]] = dp[s].split(":")[1]
                }
                if (cols[ci].mUIHelper.display_width != "") {
                    prs[cols[ci].mColName]["width"] = cols[ci].mUIHelper.display_width;
                }
            }
            return prs;

        };

        QueryView.prototype.showPersonalization = function (rndObj) {
            var cols = this.mLctb.cols;
            var that = this;
            var fe = [];

            for (var ci in cols) {
                if (cols[ci].mGrouped || cols[ci].mHideCol)
                    continue;
                fe.push("#" + cols[ci].mTitle);
                var obj = UtilGen.addControl(fe,
                    "{\"text\":\"Background color\",\"width\":\"50%\",\"textAlign\":\"End\",\"styleClass\":\"\"}", sap.m.Input,
                    "txtfF" + cols[ci].mColName + "--background--" + that.tableId,
                    { width: "50%" }, "string", "", this.getControl().view, undefined, "");
                if (cols[ci].mUIHelper.display_style != "") {
                    var dp = cols[ci].mUIHelper.display_style.split(";")
                    for (var s in dp)
                        if (dp[s].startsWith("background"))
                            obj.setValue(dp[s].split(":")[1])
                }

                obj = UtilGen.addControl(fe,
                    "{\"text\":\"Color\",\"width\":\"50%\",\"textAlign\":\"End\",\"styleClass\":\"\"}", sap.m.Input,
                    "txtfF" + cols[ci].mColName + "--color--" + that.tableId,
                    { width: "50%" }, "string", "", this.getControl().view, undefined, "");
                if (cols[ci].mUIHelper.display_style != "") {
                    var dp = cols[ci].mUIHelper.display_style.split(";")
                    for (var s in dp)
                        if (dp[s].startsWith("color"))
                            obj.setValue(dp[s].split(":")[1])
                }
                obj = UtilGen.addControl(fe,
                    "{\"text\":\"Font-size\",\"width\":\"50%\",\"textAlign\":\"End\",\"styleClass\":\"\"}", sap.m.Input,
                    "txtfF" + cols[ci].mColName + "--font-size--" + that.tableId,
                    { width: "50%" }, "string", "", this.getControl().view, undefined, "");
                if (cols[ci].mUIHelper.display_style != "") {
                    var dp = cols[ci].mUIHelper.display_style.split(";")
                    for (var s in dp)
                        if (dp[s].startsWith("font-size"))
                            obj.setValue(dp[s].split(":")[1])
                }

                obj = UtilGen.addControl(fe,
                    "{\"text\":\"Width\",\"width\":\"50%\",\"textAlign\":\"End\",\"styleClass\":\"\"}", sap.m.Input,
                    "txtfF" + cols[ci].mColName + "--width--" + that.tableId,
                    { width: "50%" }, "string", "", this.getControl().view, undefined, "");
                obj.setValue(cols[ci].mUIHelper.display_width);
            }
            var frm = UtilGen.formCreate2("", true, fe, undefined, sap.m.ScrollContainer, {
                vertical: true,
                height: "100%",
                width: "350px",
                cssText: [
                    "padding-left:10px;" +
                    "padding-top:20px;" +
                    "padding-right:10px;"
                ]

            }, undefined);
            frm.addStyleClass("sapUiSizeCondensed");
            var pg = new sap.m.Page({ showHeader: false, enableScrolling: true, content: frm });
            var pop = new sap.m.Popover({
                content: pg,
                contentHeight: "350px",
                contentWidth: "400px",
                placement: sap.m.PlacementType.Auto
            });
            pop.setEndButton(
                new sap.m.Button({
                    text: "Apply",
                    press: function () {
                        var prs = {};
                        var cnt = frm.getContent();
                        for (var fi in fe)
                            if (typeof fe[fi] == "object" && fe[fi].getId().split("--")[1].startsWith("txtfF")) {
                                var sp = fe[fi].getId().split("--");
                                var cn = sp[1].replace("txtfF", "");
                                if (prs[cn] == undefined) prs[cn] = {};
                                prs[cn][sp[2]] = fe[fi].getValue();
                            }
                        that.personalize(prs);
                        if (that.prsnEventAfterApply != undefined)
                            that.prsnEventAfterApply(prs, that);
                    }
                })
            );
            pop.setBeginButton(
                new sap.m.Button({
                    text: "Revert to Original",
                    press: function () {
                        if (that.prsnEventAfterRevert != undefined)
                            that.prsnEventAfterRevert(that);
                        else if (that.prsnOrigin != undefined)
                            that.personalize(that.prsnOrigin);
                        pop.close();
                    }
                })
            );
            pop.openBy(Util.nvl(rndObj, this.getControl()));
        };
        QueryView.prototype.getLcData = function () {
            return this.mLctb;
        };

        QueryView.prototype.setJsonStrMetaData = function (strJson) {
            this.colMerged = false;
            this.mJsonString = strJson;
            this.mViewSettings = {};

            if (this.mLctb == undefined)
                this.mLctb = new LocalTableData();
            this.mLctb.parseCol(strJson);

            this.setTreeColsType();

            if (this.mColParent != undefined && this.mColParent.length > 0)
                this.switchType("tree");
            else if (this.mColLstGroup != undefined && this.mColLstGroup.length > 0)
                this.switchType("list");
            else this.switchType("table");


        };
        // set json string if queryType is tree and assign all columns.
        //

        QueryView.prototype.setJsonStr = function (strJson) {
            this.colMerged = false;
            this.mJsonString = strJson;
            this.mViewSettings = {};

            if (this.mLctb == undefined)
                this.mLctb = new LocalTableData();

            this.mLctb.parse(strJson);

            this.setTreeColsType();


            if (this.mColParent != undefined && this.mColParent.length > 0)
                this.switchType("tree");
            else if (this.mColLstGroup != undefined && this.mColLstGroup.length > 0)
                this.switchType("list");
            else this.switchType("table");

            //this.mJosnObject = this.mLctb.getData();

        };
        // QueryView.prototype.setListColsType = function () {
        //     this.mColLstGroup = "";
        //     this.mColLstGroupNm = "";
        //     for (var i = 0; i < this.mLctb.cols.length; i++) {
        //         if (this.mLctb.cols[i].mColName.startsWith("_lst_grp_"))
        //             this.mColLstGroup = this.mLctb.cols[i].mColName;
        //         if (this.mLctb.cols[i].mColName.startsWith("_lst_grpnm_"))
        //             this.mColLstGroupNm = this.mLctb.cols[i].mColName;
        //     }
        // };
        QueryView.prototype.setTreeColsType = function () {
            this.mColParent = Util.nvl(this.mColParent, "");
            this.mColTitle = Util.nvl(this.mColTitle, "");
            this.mColCode = Util.nvl(this.mColCode, "");
            this.mColLevel = Util.nvl(this.mColLevel, "");
            this.mColChild = Util.nvl(this.mColChild, "");
            this.mColPath = Util.nvl(this.mColPath, "");

            for (var i = 0; i < this.mLctb.cols.length; i++) {
                if (this.mLctb.cols[i].mQtreeType == "CODE")
                    this.mColCode = this.mLctb.cols[i].mColName;
                if (this.mLctb.cols[i].mQtreeType == "TITLE")
                    this.mColTitle = this.mLctb.cols[i].mColName;
                if (this.mLctb.cols[i].mQtreeType == "LEVEL")
                    this.mColLevel = this.mLctb.cols[i].mColName;
                if (this.mLctb.cols[i].mQtreeType == "PATH")
                    this.mColPath = this.mLctb.cols[i].mColName;
                if (this.mLctb.cols[i].mQtreeType == "PARENT")
                    this.mColParent = this.mLctb.cols[i].mColName;
                if (this.mLctb.cols[i].mQtreeType == "CHILDCOUNT")
                    this.mColChild = this.mLctb.cols[i].mColName;
            }
        };

        QueryView.prototype.attachOnAfterLoad = function (fn) {
            this.mOnAfterLoad = fn;
        };
        QueryView.prototype.loadData_list = function () {
            var that = this;
            this.mList.removeAllItems();

            this.mList.destroyItems();
            if (this.mLctb.cols.length == 0)
                return null;
            var group = false, sortdata = undefined;
            for (var i in this.mLctb.cols)
                if (this.mLctb.cols[i].mColName.startsWith("LIST_GROUP_CODE")) {
                    group = true;
                    sortdata = new sap.ui.model.Sorter("LIST_GROUP_CODE", null, function (oContext) {
                        var mRecord = oContext.getObject();
                        return {
                            key: mRecord.LIST_GROUP_CODE,
                            text: mRecord.LIST_GROUP_NAME
                        };
                    });
                    sortdata.fnCompare = function (a, b) {
                        var vl1 = a;
                        var vl2 = b;
                        if (vl1 < vl2)
                            return -1;
                        if (vl1 > vl2)
                            return 1;
                        return 0;
                    };
                    break;
                }

            var o = this.mLctb.getData(true);

            var ss = "";

            for (var rx in this.mLctb.cols)
                ss += (ss.length > 0 ? "," : "") + "\"" + this.mLctb.cols[rx].mColName + "\" : \"{" + this.mLctb.cols[rx].mColName + "}\" ";

            var oTempl = new sap.m.StandardListItem({
                type: "Navigation",
                press: function (e) {
                    var str = e.getSource().getCustomData()[0].getKey();
                    var str2 = JSON.parse("{" + e.getSource().getCustomData()[1].getKey() + "}");

                    sap.m.MessageToast.show(str2.TITLE);
                    that.callBackListSelect(str2);
                },
                title: "{TITLE}",
                active: true,
                customData: [{ key: "{CODE} " }, { key: ss }]

            });
            // if (this.mList.getModel() != undefined)
            //
            //this.mList.bindAggregation("items", "/", oTempl);
            if (!this.data_binded) {
                var mdl = new sap.ui.model.json.JSONModel();
                mdl.setData(o);
                this.mList.setModel(mdl);
                this.mList.bindItems({
                    path: "/",
                    template: oTempl,
                    sorter: sortdata
                });
                this.data_binded = true;
            } else {

                var mdl = new sap.ui.model.json.JSONModel(o);

                this.mList.setModel(mdl);
                //this.mList.setModel(mdl);
            }

        };
        // updaing data from table or tree to  model (mLctb)
        QueryView.prototype.updateDataToTable = function () {
            if (this.getControl().getModel() == undefined) return false;
            var dt = JSON.stringify(this.getControl().getModel().getData());
            dt = "{\"data\":" + dt + "}";
            this.mLctb.parse(dt, true);

        };
        // updaing local tbale data to  table or tree  control
        QueryView.prototype.updateDataToControl = function () {
            var dt = Util.nvl(this.buildJsonData(), []);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(dt);
            this.getControl().setModel(oModel);
            this.getControl().bindRows("/");
        };

        QueryView.prototype.addRow = function (dontReload) {
            if (!this.editable || !this.insertable)
                return;
            if (this.mLctb.rows.length > 0)
                this.updateDataToTable();

            var idx = this.mLctb.addRow();
            if (this.onAddRow != undefined)
                this.onAddRow(idx, this.mLctb);

            if (Util.nvl(dontReload, false) == false) {
                this.updateDataToControl();
                // var dt = this.buildJsonData();
                // var oModel = new sap.ui.model.json.JSONModel();
                // oModel.setData(dt);
                // this.getControl().setModel(oModel);
                // this.getControl().bindRows("/");
            }
            return idx;
        };

        QueryView.prototype.insertRow = function (idx, dontReload) {
            if (!this.editable || !this.insertable)
                return;
            if (this.mLctb.rows.length > 0)
                this.updateDataToTable();
            var idx = this.mLctb.insertRow(idx);
            if (this.onAddRow != undefined)
                this.onAddRow(idx, this.mLctb);
            if (Util.nvl(dontReload, false) == false) {
                this.updateDataToControl();
                // var dt = this.buildJsonData();
                // var oModel = new sap.ui.model.json.JSONModel();
                // oModel.setData(dt);
                // this.getControl().setModel(oModel);
                // this.getControl().bindRows("/");
            }
            return idx;

        };
        QueryView.prototype.deleteRow = function (idx, dontReload) {
            if (!this.editable)
                return;
            if (!this.deletable)
                return;

            if (this.mLctb.rows.length > 0)
                this.updateDataToTable();
            var dt = {};
            for (var i = 0; i < this.mLctb.cols.length; i++)
                dt[this.mLctb.cols[i].mColName] = this.mLctb.getFieldValue(idx, this.mLctb.cols[i].mColName);


            if (this.beforeDelRow != undefined)
                this.beforeDelRow(idx, this.mLctb, dt);

            var idx = this.mLctb.deleteRow(idx);

            if (this.afterDelRow != undefined)
                this.afterDelRow(this.mLctb, dt);


            if (Util.nvl(dontReload, false) == false) {
                this.updateDataToControl();
                if (this.eventCalc != undefined)
                    this.eventCalc(this, undefined, idx, false);
            }

            return idx;

        };

        QueryView.prototype.loadData = function (noDestroy) {
            //resetingg,
            var that = this;
            var sett = sap.ui.getCore().getModel("settings").getData();

            if (this.queryType == "list") {
                this.loadData_list();
                return;
            }

            var col = [];
            var cells = [];
            this.b4_cf_val1 = [];
            this.b4_cf_val = [];

            this.getControl().setEnableGrouping(false);
            for (var i = 0; i < this.getControl().getColumns().length; i++) {
                this.getControl().getColumns()[i].setGrouped(false);
                this.getControl().getColumns()[i].setSorted(false);
                this.getControl().getColumns()[i].setFiltered(false);
            }

            this.getControl().setEnableGrouping(false);
            this.getControl().destroyColumns();

            var dt = Util.nvl(this.buildJsonData(), []);
            var cc = null;
            // purpose    : settiong columns ,  format, alignment , multilable,
            var colx = 0;
            for (var i = colx; i < this.mLctb.cols.length; i++) {
                cc = this.mLctb.cols[i];
                var a = cc.getMUIHelper().display_align;
                var f = cc.getMUIHelper().display_format;

                if (cc.getMUIHelper().display_format == "MONEY_FORMAT") {
                    a = UtilGen.DBView.sLangu == "AR" ? "begin" : "end";
                    f = sett["FORMAT_MONEY_1"];
                }
                if (cc.getMUIHelper().display_format == "QTY_FORMAT") {
                    // a = "end";
                    f = sett["FORMAT_QTY_1"];
                }
                if (cc.getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                    a = "center";
                    f = sett["SHORT_DATE_FORMAT"];
                }
                if (cc.getMUIHelper().display_format == "SHORT_TIME_FORMAT") {
                    a = "center";
                    f = sett["SHORT_TIME_FORMAT"];
                }
                if (cc.getMUIHelper().display_format == "NONE")
                    f = "";

                if (UtilGen.DBView.sLangu == "AR" && a != "center")
                    a = "right";

                var colClass = eval(UtilGen.nvl(cc.mColClass, "sap.ui.commons.Label"));
                var ssql = Util.nvl(cc.mSearchSQL, "");
                var o;
                // if (colClass != sap.m.ComboBox) {
                if (colClass != SelectText) {
                    if (colClass == sap.m.ComboBox) {
                        var getSelectedKey = function (key) {
                            console.log(key);
                        };
                        var fnchange = function (evtx) {
                            var coln = this.getCustomData()[0].getKey();
                            var row = evtx.getSource().getParent();
                            var table = evtx.getSource().getParent().getParent(); // get table control.
                            var oModel = table.getModel();
                            var rowStart = table.getFirstVisibleRow(); //starting Row index
                            var currentRowoIndexContext = table.getContextByIndex(rowStart + table.indexOfRow(row));
                            oModel.setProperty(currentRowoIndexContext.sPath + "/" + coln, this.getValue());
                        };
                        var cnm = this.mLctb.cols[i].mColName.replace(/\//g, "___");
                        o = UtilGen.createControl(colClass, this.view, "", {
                            selectedKey: "{" + cnm + "}",
                            // value: "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                            items: {
                                path: "/",
                                template: new sap.ui.core.Item({ text: "{NAME}", key: "{CODE}" }),
                                templateShareable: true
                            },
                            customData: [{ key: cnm }],
                            width: "100%",
                            src: "{" + cnm + "}",
                            enabled: this.mLctb.cols[i].mEnabled,
                            // selectionChange:fnchange
                        }, Util.nvl(cc.getMUIHelper().data_type, "").toLowerCase(), f, undefined, cc.mSearchSQL, undefined);
                        o.setTextAlign(Util.getAlignTable(a));
                    } else {
                        o = UtilGen.createControl(colClass, this.view, "", {

                            // technical   : replacing global "___" with colname for cross tab.
                            "text": "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                            "value": "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                            "dateValue": "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                            textAlign: Util.getAlignTable(a),
                            textDirection: UtilGen.DBView.sLangu == "AR" ? sap.ui.core.TextDirection.RTL : sap.ui.core.TextDirection.LTR,
                            width: "100%",
                            src: "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                            enabled: this.mLctb.cols[i].mEnabled,
                            showValueHelp: (ssql != "" ? true : false),
                            maxLines: 1,

                        }, Util.nvl(cc.getMUIHelper().data_type, "").toLowerCase(), f);
                        o.setTextAlign(Util.getAlignTable(a));
                    }
                }
                else
                    o = new colClass({
                        // "value": "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                        "codeValue": "{" + this.mLctb.cols[i].mColName.replace(/\//g, "___") + "}",
                        textAlign: Util.getAlignTable(a),
                        enabled: this.mLctb.cols[i].mEnabled,

                    });

                if (colClass == SelectText) {
                    var dtxx = [];
                    if (cc.mSearchSQL.startsWith("@")) {
                        var spt = cc.mSearchSQL.substring(1).split(",");
                        for (var i1 in spt) {
                            var dttt = { CODE: "", TITLE: "" };
                            var sx = spt[i1].split("/");
                            dttt.CODE = "" + sx[0];
                            dttt.TITLE = "" + sx[1];
                            dtxx.push(dttt);
                        }
                    }
                    o.setLookupModel(new sap.ui.model.json.JSONModel(dtxx));
                }
                if (o instanceof sap.m.InputBase) {
                    o.addEventDelegate({
                        onsapenter: function (event) {
                            var _input = event.srcControl;
                            var rowno = that.getControl().indexOfRow(_input.getParent());
                            var colno = _input.getParent().indexOfCell(_input);
                            var totalRows = that.getControl().getModel().getData().length;
                            var firstVis = that.getControl().getFirstVisibleRow();
                            var dispRows = that.getControl().getRows().length;

                            if (that.getControl().getRows()[rowno].getCells()[colno + 1] != undefined) {
                                colno++;
                                var cell = that._nextFocusableCell(rowno, colno);
                                cell.focus();
                                if (cell.$().find("input").length > 0)
                                    cell.$().find("input")[0].select();
                                else if (firstVis + rowno + 1 < totalRows && rowno < dispRows) {
                                    rowno++;
                                    setTimeout(function () {
                                        if (rowno >= dispRows) {
                                            that.getControl().setFirstVisibleRow(firstVis + 1);
                                            // that.getControl().getRows()[dispRows - 1].getCells()[0].focus();
                                            var cell = that._nextFocusableCell(dispRows - 1, 0);
                                            cell.focus();
                                            cell.$().find("input")[0].select();

                                        } else {
                                            var cell = that._nextFocusableCell(rowno, 0);
                                            cell.focus();
                                            cell.$().find("input")[0].select();

                                        }
                                    });
                                } else if (that.editable && firstVis + rowno + 1 == totalRows && rowno < dispRows) {
                                    var rn = that.addRow();
                                    rowno++;
                                    setTimeout(function () {
                                        if (rowno >= dispRows) {
                                            that.getControl().setFirstVisibleRow(firstVis + 1);
                                            var cell = that._nextFocusableCell(dispRows - 1, 0);
                                            cell.focus();
                                            cell.$().find("input")[0].select();


                                            // that.getControl().getRows()[dispRows - 1].getCells()[0].focus();
                                        } else {
                                            var cell = that._nextFocusableCell(rowno, 0);
                                            cell.focus();
                                            cell.$().find("input")[0].select();

                                        }
                                        // that.getControl().getRows()[rowno].getCells()[0].focus();
                                    });
                                }
                                //that.getControl().getRows()[rowno].getCells()[colno].focus();
                            } else if (firstVis + rowno + 1 < totalRows && rowno < dispRows) {
                                rowno++;
                                setTimeout(function () {
                                    if (rowno >= dispRows) {
                                        that.getControl().setFirstVisibleRow(firstVis + 1);
                                        // that.getControl().getRows()[dispRows - 1].getCells()[0].focus();
                                        var cell = that._nextFocusableCell(dispRows - 1, 0);
                                        cell.focus();
                                        cell.$().find("input")[0].select();

                                    } else {
                                        var cell = that._nextFocusableCell(rowno, 0);
                                        cell.focus();
                                        cell.$().find("input")[0].select();

                                    }
                                    // that.getControl().getRows()[rowno].getCells()[0].focus();
                                });
                            }
                            else if (that.editable && firstVis + rowno + 1 == totalRows && rowno < dispRows) {
                                var rn = that.addRow();
                                rowno++;
                                setTimeout(function () {
                                    if (rowno >= dispRows) {
                                        that.getControl().setFirstVisibleRow(firstVis + 1);
                                        var cell = that._nextFocusableCell(dispRows - 1, 0);
                                        cell.focus();
                                        cell.$().find("input")[0].select();


                                        // that.getControl().getRows()[dispRows - 1].getCells()[0].focus();
                                    } else {
                                        var cell = that._nextFocusableCell(rowno, 0);
                                        cell.focus();
                                        cell.$().find("input")[0].select();

                                    }
                                    // that.getControl().getRows()[rowno].getCells()[0].focus();
                                });

                            }
                            // } else {
                            //     var rn = that.addRow();
                            //     that.getControl().getRows()[rn].getCells()[0].focus();
                            // }

                        }

                    });

                    o.attachBrowserEvent("keyup", function (evt) {
                        if (evt.keyCode == 46 && evt.ctrlKey) {
                            var rowno = that.getControl().indexOfRow(this.getParent());
                            var colno = this.getParent().indexOfCell(this);
                            var totalRows = that.getControl().getModel().getData().length;
                            var firstVis = that.getControl().getFirstVisibleRow();
                            var visRows = that.getControl().getVisibleRowCount();
                            that.deleteRow(firstVis + rowno);
                            var rn = (rowno - 1 < 0) ? 0 : (rowno == visRows - 1 ? rowno : rowno - 1);
                            if (totalRows - 1 <= visRows - 1)
                                rn = totalRows - 2;
                            that.getControl().getRows()[rn].getCells()[colno].focus();
                        }
                    });
                    o.attachBrowserEvent("keydown", function (evt) {
                        if (evt.key == "Escape") {
                            that.getControl().focus();
                        }

                        if (evt.key == "ArrowDown") {
                            var rowno = that.getControl().indexOfRow(this.getParent());
                            var colno = this.getParent().indexOfCell(this);
                            var totalRows = that.getControl().getModel().getData().length;
                            var firstVis = that.getControl().getFirstVisibleRow();
                            var dispRows = that.getControl().getRows().length;

                            if (rowno < that.getControl().getRows().length - 1) {
                                rowno++;
                                setTimeout(function () {
                                    if (rowno > dispRows) {
                                        that.getControl().setFirstVisibleRow(firstVis + 1);
                                        that.getControl().getRows()[dispRows - 1].getCells()[colno].focus();
                                    } else
                                        that.getControl().getRows()[rowno].getCells()[colno].focus();
                                });

                            } else if (firstVis + rowno + 1 <= totalRows && rowno < dispRows) {
                                rowno++;
                                setTimeout(function () {
                                    if (rowno >= dispRows) {
                                        that.getControl().setFirstVisibleRow(firstVis + 1);
                                        that.getControl().getRows()[dispRows - 1].getCells()[colno].focus();
                                    } else
                                        that.getControl().getRows()[rowno].getCells()[colno].focus();
                                });

                            }

                        }
                        if (evt.key == "ArrowUp") {
                            var rowno = that.getControl().indexOfRow(this.getParent());
                            var colno = this.getParent().indexOfCell(this);
                            var firstVis = that.getControl().getFirstVisibleRow();
                            var totalRows = that.getControl().getModel().getData().length;
                            var visRows = that.getControl().getVisibleRowCount();
                            if (that.eventKey != undefined && Util.nvl(that.eventKey(evt.key, rowno, colno, firstVis), false)) { }
                            if (rowno > 0) {
                                rowno--;
                                that.getControl().getRows()[rowno].getCells()[colno].focus();
                            } else if (firstVis > 0) {
                                that.getControl().setFirstVisibleRow(firstVis - 1);
                                that.getControl().getRows()[0].getCells()[colno].focus();
                            }
                            else {
                                var rn = (rowno - 1 < 0) ? 0 : (rowno == visRows - 1 ? rowno : rowno - 1);
                                if (totalRows - 1 <= visRows - 1)
                                    rn = totalRows - 2;
                                that.getControl().getRows()[rn].getCells()[colno].focus();
                            }

                        }

                        if (evt.key == "F5") {
                            evt.preventDefault();
                            var colno = this.getParent().indexOfCell(this);
                            var rowno = that.getControl().indexOfRow(this.getParent()) + that.getControl().getFirstVisibleRow();
                            //if (rowno + 1 < that.getControl().getRows().length)
                            that.insertRow(rowno + 1);
                            that.getControl().getRows()[(rowno - that.getControl().getFirstVisibleRow())].getCells()[colno].focus();
                        }

                    });
                    if (o instanceof sap.m.TimePicker) {
                        o.setSupport2400(true);
                        o.setDisplayFormat("h:mm a");
                        o.setValueFormat("h:mm a");
                    }
                    // if combobox have list of values then add it into sap.m.CombBox model. ( check either LOV in sql or data )
                    if (o instanceof sap.m.ComboBox) {
                        // o.bindAggregation("items",
                        //     {
                        //         path: "/",
                        //         template: new sap.ui.core.ListItem({ text: "{NAME}", key: "{CODE}" }),
                        //         templateShareable: true
                        //     });
                        // var dtx = [];
                        // if (cc.mSearchSQL.startsWith("@")) {
                        //     var spt = cc.mSearchSQL.substring(1).split(",");
                        //     for (var i in spt) {
                        //         var dt = { CODE: "", NAME: "" };
                        //         var s = spt[i].split("/");
                        //         dt.CODE = s[0];
                        //         dt.NAME = s[1];
                        //         dtx.push(dt);
                        //     }
                        // }
                        // else {
                        //     var dt = Util.execSQL(cc.mSearchSQL);
                        //     if (dt.ret == "SUCCESS" && dt.data.length > 0)
                        //         dtx = JSON.parse("{" + dt.data + "}").data;
                        // }
                        // o.setModel(new sap.ui.model.json.JSONModel(dtx));
                    }
                }
                if (cc.commandLinkClick != undefined) {
                    o.addStyleClass("linkLabel");
                    o.attachBrowserEvent("click", function (oEvent) {
                        var rowno = that.getControl().indexOfRow(this.getParent());
                        var firstVis = that.getControl().getFirstVisibleRow();
                        var clno = this.getParent().indexOfCell(this); // colno
                        var cls = this.getParent().getParent().getColumns(); //all columns
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
                        if (cx.commandLinkClick != undefined)
                            cx.commandLinkClick(this, firstVis + rowno, clno, that.mLctb);
                    });
                }
                if (Util.nvl(cc.commandLink, "") != "") {
                    o.addStyleClass("linkLabel");
                    o.attachBrowserEvent("click", function (oEvent) {
                        var rowno = that.getControl().indexOfRow(this.getParent());
                        var firstVis = that.getControl().getFirstVisibleRow();
                        var clno = this.getParent().indexOfCell(this); // colno
                        var cls = this.getParent().getParent().getColumns(); //all columns
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
                        var th = this;
                        var str = cx.commandLink;
                        var lst = str.match(/:[a-zA-Z0-9_.]*/gi);
                        var sst = str;
                        var rn = firstVis + rowno;
                        for (var i = 0; i < Util.nvl(lst, []).length; i++) {
                            var vl = that.mLctb.getFieldValue(rn, lst[i].replaceAll(':', ''));
                            if (vl instanceof Date)
                                vl = Util.toOraDateTimeString(vl);

                            sst = sst.replaceAll(lst[i], vl);
                        }

                        sap.m.MessageToast.show(sst);
                        UtilGen.execCmd(sst, that.getControl().view, this, undefined);
                    });

                }
                if (cc.eValidateColumn != undefined && (o instanceof sap.m.InputBase)) {
                    o.attachChange(null, cc.eValidateColumn);
                }
                if (this.eventCalc != undefined)
                    cc.eventCalc = this.eventCalc;


                if (cc.eValidateColumn != undefined && (o instanceof sap.m.Button)) {
                    o.attachPress(null, cc.eValidateColumn);
                }
                if (cc.eValidateColumn != undefined && (o instanceof sap.m.SearchField)) {
                    o.attachSearch(cc.eValidateColumn);
                }
                if ((ssql != "")) {
                    if (cc.eOnSearch != undefined && o.attachValueHelpRequest != undefined)
                        o.attachValueHelpRequest(null, cc.eOnSearch);
                    if (cc.eValidateColumn != undefined && o.attachChange != undefined)
                        o.attachChange(null, cc.eValidateColumn);
                    o.cc = cc;
                    o.attachBrowserEvent("keydown", function (oEvent) {
                        if (this.getEditable() && oEvent.key == 'F9') {
                            var clno = this.getParent().indexOfCell(this);
                            var cls = this.getParent().getParent().getColumns();
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
                            var th = this;
                            // event object to  be utilized in function cx.oOSearch
                            var e = {
                                getSource: function () {
                                    return th;
                                }
                            };
                            cx.eOnSearch(e);
                        }
                    });

                }

                // object for adding multiLabel or Label
                var l = {
                    template: o,
                    width: (cc.getMUIHelper().display_width) + "px",
                    filterProperty: (this.queryType == 'tree' ? this.mLctb.cols[i].mColName : ''),
                    sortProperty: (this.queryType == 'tree' ? this.mLctb.cols[i].mColName : ''),
                    customData: {
                        key: this.mColCode
                    }
                };
                l["multiLabels"] = [new sap.ui.commons.TextView({
                    text: Util.getLangCaption(cc.mTitle),
                    wrapping: true
                })];
                // if multilabel then add objects for multiLabel
                if (Util.nvl(cc.mTitleParent, "").length > 0) {
                    l["multiLabels"] = [
                        new sap.ui.commons.TextView({
                            text: Util.getLangCaption(cc.mTitleParent),
                            textAlign: "Center",
                            width: "100%",
                            wrapping: true
                        }).addStyleClass("multiLabel1"),
                        new sap.ui.commons.TextView({
                            text: Util.getLangCaption(cc.mTitle),
                            textAlign: "Center",
                            wrapping: true
                        })
                    ];
                    l["headerSpan"] = [cc.mTitleParentSpan, 1];
                }
                var c = new sap.ui.table.Column(/*this.mLctb.cols[i].mColName.replace(" ", ""),*/
                    l
                );

                col.push(c);
                c.setMenu(null);
                this.getControl().addColumn(c);
                c.tableCol = cc;
                if (cc.mHideCol)
                    c.setVisible(false);


            }
            this.col = col;
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(dt);
            this.getControl().setModel(oModel);
            this.getControl().bindRows("/");


            if (this.mLctb.cols.length <= 0) return;

            if (this.mLctb.cols.length > 0 && this.mLctb.cols[0].mGrouped)
                this.getControl().getColumns()[0].setVisible(false);

            if (this.mLctb.cols.length > 0 && this.mLctb.cols[1].mGrouped)
                this.getControl().getColumns()[1].setVisible(false);


            if (this.mOnAfterLoad != undefined)
                this.mOnAfterLoad(this);

            if (this.eventCalc != undefined)
                this.eventCalc(this, undefined, -1, false);
            if (that.dontFillFilterComb == undefined) {
                that.dontFillFilterComb = undefined;
                this.fillFilterGroupList();
            }
            else
                that.dontFillFilterComb = undefined;

            if (that.prsnOrigin == undefined)
                that.prsnOrigin = that.getCurrentPrs();
            // this.scroll = setInterval(function () {
            //     that.colorRows();
            //     $("#" + that.getControl().getId() + "-vsb").off("scroll");
            //     $("#" + that.getControl().getId() + "-vsb").scroll(function () {
            //         that.colorRows();
            //     });
            // }, 1000);
            this.getControl().addEventDelegate({
                onAfterRendering: function () {
                    setTimeout(function () {
                        that.colorRows();
                    });

                    $("#" + that.getControl().getId() + "-vsb").off("scroll");
                    $("#" + that.getControl().getId() + "-vsb").on("scroll", function () {
                        setTimeout(function () {
                            that.colorRows();
                        });
                    });
                }
            });
            setTimeout(function () {
                that.colorRows();
            });
        }
            ;
        QueryView.prototype.fillFilterGroupList = function () {
            var that = this;
            if (this.showToolbar.lstFltGroup == undefined)
                return;
            this.showToolbar.lstFltGroup.setVisible(true);
            var cdt = [];
            var ld = that.mLctb;
            var lastVal = "";
            cdt.push({ CODE: "", NAME: "ALL" });
            for (var l = 0; l < ld.rows.length; l++) {
                var cd = { CODE: "", NAME: "" };
                var cval = ld.getFieldValue(l, ld.cols[0].mColName);
                var nmval = cval;
                if (ld.cols.length > 1 && ld.cols[1].mGrouped)
                    nmval = cval + "-" + Util.nvl(ld.getFieldValue(l, ld.cols[1].mColName), "");
                if (lastVal != cval) {
                    cd.CODE = cval;
                    cd.NAME = nmval;
                    lastVal = cval;
                    cdt.push(cd);
                }
            }
            Util.fillCombo(that.showToolbar.lstFltGroup, cdt);
            that.showToolbar.lstFltGroup.setSelectedItem(that.showToolbar.lstFltGroup.getItems()[0]);
        };
        QueryView.prototype._nextFocusableCell = function (rowno, colno) {
            //that.getControl().getRows()[rowno].getCells()[colno].focus()
            // write here code to find next inputable cell.
            var cell = this.getControl().getRows()[rowno].getCells()[colno];
            var cn = colno;
            while (!(cell instanceof sap.m.InputBase && cell.getEnabled())) {
                if (cell instanceof sap.m.InputBase && cell.getEnabled()) break;
                if (cell == undefined) break;
                cn++;
                cell = this.getControl().getRows()[rowno].getCells()[cn];
            }
            if (cell == undefined)
                cell = this.getControl().getRows()[rowno].getCells()[colno];
            return cell;


        };

        QueryView.prototype._sort = function (pCol, updateMR) {
            this.mLctb.rows.sort(function (a, b) {
                var vl1 = a.cells[pCol].getValue();
                var vl2 = b.cells[pCol].getValue();
                if (vl1 < vl2)
                    return -1;
                if (vl1 > vl2)
                    return 1;
                return 0;
            });
            if (updateMR) {
                this.mLctb.masterRows = [];
                this.mLctb.masterRows = this.mLctb.rows.slice(0);
                if (Util.nvl(this.mLctb.cndFilter, "") != "")
                    this.mLctb.showDataByCondition(this.mLctb.cndFilter);

            }
        };

        QueryView.prototype._getDistinctGroup = function (pCol, o) {
            var grp = "";
            var h = [];
            for (var i = 0; i < o.length; i++)
                if (i == 0 || grp != o[i][pCol]) {
                    h.push(o[i][pCol]);
                    grp = o[i][pCol];
                    if (this.mLctb.getColByName(pCol).getMUIHelper().display_format === "SHORT_DATE_FORMAT") {
                        if (Util.nvl(o[i][t], "").length > 0) {
                            var dt = new Date(o[i][pCol]);
                            grp = sf.format(dt);
                        }
                    }
                    if (this.mLctb.getColByName(pCol).getMUIHelper().display_format === "MONEY_FORMAT")
                        grp = df.format(o[i][pCol]);
                }
            return h;
        };

        QueryView.prototype.buildJsonData = function () {
            // this.mLctb.cols[0].mGrouped = true;
            // this.mLctb.cols[1].mGrouped = true;

            if (this.queryType == 'tree')
                return this.buildJsonDataTree();

            if (this.mLctb.cols.length == 0)
                return null;

            var headerg = {};
            var grpCol = "";
            var grouped = false;
            // merging first and second column


            if (this.colMerged == false &&
                this.mLctb.cols[0].mGrouped &&
                this.mLctb.cols.length > 1
            ) {
                if (this.mLctb.cols[1].mGrouped) {
                    this.mLctb.setColumnMerge(0, 1, true);
                    this.mLctb.sortCol(0, true);
                    this.colMerged = true;
                    //this._sort(0, true);

                    if (this.mLctb.cols.length > 1)
                        grpCol = this.mLctb.cols[1].mColName;
                } else {
                    this.colMerged = true;
                    this._sort(0, true);
                    if (this.mLctb.cols.length > 1)
                        grpCol = this.mLctb.cols[1].mColName;
                }

                //grouped = true;
            }


            if (this.colMerged) {
                grouped = this.colMerged;
                grpCol = this.mLctb.cols[1].mColName;
            }

            this.applySettings();
            var o = this.mLctb.getData(true);


            var footer = {};
            var footerg = {};

            var cnt = 0;
            var grp = "";
            var nogU = {};
            var noU = {};
            var nog = {};
            var nor = {};
            var t;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
            var sf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var sft = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"] + " h mm a");

            for (var i = 0; i < Util.nvl(o, []).length; i++) {
                cnt = 0;
                for (var v in o[i]) {
                    var vv = v.replace("___", "/");
                    if (grouped && cnt === 0) {
                        footer[v] = String.fromCharCode(4095) + "";
                        footerg[v] = String.fromCharCode(4095);
                        cnt++;
                        t = v;
                        if (i == 0) {
                            grp = o[i][v];
                            if (this.mLctb.getColByName(vv).getMUIHelper().display_format === "SHORT_DATE_FORMAT") {
                                if (Util.nvl(o[i][v], "").length > 0) {
                                    var dt = new Date(Util.nvl(o[i][v], "").replaceAll(".", ":"));//o[i][v].replaceAll(".",":") );
                                    grp = sf.format(dt);
                                }
                            }
                            if (this.mLctb.getColByName(vv).getMUIHelper().display_format === "MONEY_FORMAT")
                                grp = df.format(o[i][v]);
                            if (this.mLctb.getColByName(vv).getMUIHelper().display_format === "QTY_FORMAT")
                                o[i][v] = dfq.format(o[i][v]);

                            headerg = {};
                            headerg[t] = String.fromCharCode(4094);
                            headerg[grpCol] = grp;
                            o.splice(i, 0, headerg);
                            ++i;
                        }

                        continue;
                    }

                    if (footerg[v] == undefined)
                        footerg[v] = null;
                    if (footer[v] == undefined)
                        footer[v] = null;

                    if (typeof (o[i][v]) == "number") {
                        if (this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "SUM") {
                            footerg[v] = (Util.nvl(footerg[v], 0) == 0 ? 0 : Util.nvl(footerg[v], 0)) + Util.nvl(o[i][v], 0);
                            footer[v] = (Util.nvl(footer[v], 0) == 0 ? 0 : Util.nvl(footer[v], 0)) + Util.nvl(o[i][v], 0);
                        } else if (this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "LAST") {
                            footerg[v] = o[i][v];
                            footer[v] = o[i][v];
                        } else if (Util.nvl(o[i][v], '') != '' && this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "COUNT") {
                            nog[v] = Util.nvl(nog[v], 0) + 1;
                            nor[v] = Util.nvl(nor[v], 0) + 1;;
                            footerg[v] = Util.getLangText("txtNoOf") + " # " + nog[v];
                            footer[v] = Util.getLangText("txtNoOf") + " # " + nor[v];
                        } else if
                            (Util.nvl(o[i][v], '') != '' && this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "COUNT_UNIQUE") {
                            if (Util.nvl(nogU[o[i][v]], '') == '') {
                                nog[v] = Util.nvl(nog[v], 0) + 1;
                                nogU[o[i][v]] = "1";
                            }
                            if (Util.nvl(noU[o[i][v]], '') == '') {
                                nor[v] = Util.nvl(nor[v], 0) + 1;
                                noU[o[i][v]] = "1";
                            }
                            var lbl = Util.getLangText(this.mLctb.getColByName(vv).count_unique_label, this.mLctb.getColByName(vv).mTitle);
                            footerg[v] = nog[v] + " # " + lbl;
                            footer[v] = nor[v] + " # " + lbl;
                        }
                        else {
                            footerg[v] = null;
                            footer[v] = null;
                        }

                        if (this.mLctb.getColByName(vv) != undefined &&
                            this.mLctb.getColByName(vv).valOnZero != undefined &&
                            o[i][v] == 0)
                            o[i][v] = this.mLctb.getColByName(vv).valOnZero;
                        else if (this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).getMUIHelper().display_format === "MONEY_FORMAT")
                            o[i][v] = df.format(o[i][v]);
                        else if (this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).getMUIHelper().display_format === "QTY_FORMAT")
                            o[i][v] = dfq.format(o[i][v]);

                        // adding trueValues in case check box
                        if (this.mLctb.getColByName(vv) != undefined &&
                            this.mLctb.getColByName(vv).trueValues != undefined &&
                            this.mLctb.getColByName(vv).trueValues.length > 1) {
                            o[i][v] = (o[i][v] == this.mLctb.getColByName(vv).trueValues[0]);
                        }


                    }
                    else {
                        // footer[v] = null;
                        // footerg[v] = null;
                        if (Util.nvl(o[i][v], '') != '' && this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "COUNT") {
                            nog[v] = Util.nvl(nog[v], 0) + 1;
                            nor[v] = Util.nvl(nor[v], 0) + 1;;
                            footerg[v] = Util.getLangText("txtNoOf") + " : " + nog[v];
                            footer[v] = Util.getLangText("txtNoOf") + " : " + nor[v];
                        } else if
                            (Util.nvl(o[i][v], '') != '' && this.mLctb.getColByName(vv) != undefined && this.mLctb.getColByName(vv).mSummary == "COUNT_UNIQUE") {
                            if (Util.nvl(nogU[o[i][v]], '') == '') {
                                nog[v] = Util.nvl(nog[v], 0) + 1;
                                nogU[o[i][v]] = "1";
                            }
                            if (Util.nvl(noU[o[i][v]], '') == '') {
                                nor[v] = Util.nvl(nor[v], 0) + 1;
                                noU[o[i][v]] = "1";
                            }
                            var lbl = Util.getLangText(this.mLctb.getColByName(vv).count_unique_label, this.mLctb.getColByName(vv).mTitle);
                            footerg[v] = nog[v] + " # " + lbl;
                            footer[v] = nor[v] + " # " + lbl;
                        }
                        if (v != "_rowid" &&
                            this.mLctb.getColByName(vv) != undefined &&
                            this.mLctb.getColByName(vv).getMUIHelper().display_format === "SHORT_DATE_FORMAT") {
                            if (Util.nvl(o[i][v], "").length > 0) {
                                var dt = new Date(Util.nvl(o[i][v], "").replaceAll(".", ":"));
                                o[i][v] = sf.format(dt); //dt
                            } else
                                o[i][v] = null;
                        }
                        if (v != "_rowid" &&
                            this.mLctb.getColByName(vv) != undefined &&
                            this.mLctb.getColByName(vv).getMUIHelper().display_format === "SHORT_TIME_FORMAT") {
                            if (Util.nvl(o[i][v], "").length > 0) {
                                var dt = new Date(Util.nvl(o[i][v], "").replaceAll(".", ":"));
                                o[i][v] = dt;//sft.format(dt);
                            } else
                                o[i][v] = null;
                            if (dt.getHours() == 0)
                                o[i][v] = null;
                        }

                    }
                    cnt++;
                }

                if (grouped && i > o.length - 2) {
                    for (var fv in footerg) { // formating...
                        if (fv != "_rowid" && this.mLctb.getColByName(fv.replace(/___/g, "/")).getMUIHelper().display_format === "MONEY_FORMAT")
                            footerg[fv] = df.format(footerg[fv]);
                        if (fv != "_rowid" && this.mLctb.getColByName(fv.replace(/___/g, "/")).getMUIHelper().display_format === "QTY_FORMAT")
                            footerg[fv] = dfq.format(footerg[fv]);
                    }
                    o.splice(i + 1, 0, footerg);
                    grp = o[i][t];
                    t = null;
                    ++i;
                    footerg = {};
                    break;
                }
                // checking for next record is different group...
                if (grouped && t != undefined && i + 1 < o.length) {
                    var nxt = o[i + 1][t];
                    if (t != undefined && this.mLctb.getColByName(t).getMUIHelper().display_format === "SHORT_DATE_FORMAT") {
                        if (Util.nvl(o[i][t], "").length > 0) {
                            var dt = new Date(Util.nvl(o[i + 1][t], "").replaceAll(".", ":"));
                            nxt = sf.format(dt);
                        }
                    }
                    if (t != undefined && this.mLctb.getColByName(t).getMUIHelper().display_format === "MONEY_FORMAT")
                        nxt = df.format(o[i + 1][t]);
                    if (t != undefined && this.mLctb.getColByName(t).getMUIHelper().display_format === "QTY_FORMAT")
                        nxt = dfq.format(o[i + 1][t]);

                    if (grp != nxt) {
                        for (var fv in footerg) {// formating...
                            if (fv != "_rowid" && this.mLctb.getColByName(fv.replace(/___/g, "/")).getMUIHelper().display_format === "MONEY_FORMAT")
                                footerg[fv] = df.format(footerg[fv]);
                            if (fv != "_rowid" && this.mLctb.getColByName(fv.replace(/___/g, "/")).getMUIHelper().display_format === "QTY_FORMAT")
                                footerg[fv] = dfq.format(footerg[fv]);
                        }
                        o.splice(i + 1, 0, footerg);
                        grp = nxt;
                        //t = null;
                        ++i;
                        nog = {};
                        nogU = {};
                        footerg = {};
                        headerg = {};
                        headerg[t] = String.fromCharCode(4094);
                        headerg[grpCol] = nxt;
                        o.splice(i + 1, 0, headerg);
                        ++i;
                    }
                }
            }
            for (var fv in footer)  // formating...
            {
                var fvv = fv.replace("___", "/");
                if (fv != "_rowid" && this.mLctb.getColByName(fvv) != undefined && this.mLctb.getColByName(fvv).getMUIHelper().display_format === "MONEY_FORMAT")
                    footer[fv] = df.format(footer[fv]);
                if (fv != "_rowid" && this.mLctb.getColByName(fvv) != undefined && this.mLctb.getColByName(fvv).getMUIHelper().display_format === "QTY_FORMAT")
                    footer[fv] = dfq.format(footer[fv]);

            }

            if (o != undefined && this.getControl().getFixedBottomRowCount() > 0)
                o.push(footer);
            return o;

        };
        //tree buildjson data

        QueryView.prototype.buildJsonDataTree = function () {

            // return this.buildJSONTreeWithTotal();
            if (this.mLctb.cols.length == 0)
                return null;

            this.applySettings();
            var items = this.mLctb.getData(true);
            if (items == null)
                return;
            this.mapNodes = [];
            var itemsByID = [];
            var columns = [];
            var lastParent = "";
            var lastParentNode = null;
            var rootNode = null;
            var footer = {};

            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
            var sf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            this.minLevel = (this.mColLevel.length > 0 && this.mLctb.rows.length) > 1 ? parseInt(this.mLctb.getFieldValue(0, this.mColLevel)) : 0;

            // looping mctb..
            //resetting footers to null..
            for (var k = 0; k < this.mLctb.cols.length; k++) {
                var cn = this.mLctb.cols[k].mColName;
                footer[cn] = null;
            }

            for (var i = 0; i < this.mLctb.rows.length; i++) {
                var current_parent = "";
                var current_code = this.mLctb.getFieldValue(i, this.mColCode) + "";
                var current_title = this.mLctb.getFieldValue(i, this.mColTitle) + "";
                current_parent = this.mLctb.getFieldValue(i, this.mColParent) + "";
                if (current_parent.length > 0) {
                    if (lastParent == current_parent)
                        rootNode = lastParentNode;
                    else {
                        rootNode = this.findNodebyVal(current_parent);
                        lastParent = current_parent;
                        lastParentNode = rootNode;
                    }
                }
                else
                    rootNode = null;
                var oNode1 = null;
                var v = "";
                //defining node
                for (var k = 0; k < this.mLctb.cols.length; k++) {
                    var vl = this.mLctb.getFieldValue(i, this.mLctb.cols[k].mColName);
                    var lvl = -1;
                    if (this.mColLevel.length > 0)
                        lvl = this.mLctb.getFieldValue(i, this.mColLevel);

                    vl = (Util.nvl(vl, "") + "").replace(/\"/g, "'").replace(/\n/, "\\r").replace(/\r/, "\\r").replace(/\\/g, "\\\\").trim();

                    if (this.mLctb.cols[k].mSummary == "SUM" && lvl == this.minLevel) {
                        var cn = this.mLctb.cols[k].mColName;
                        footer[cn] = (Util.nvl(footer[cn], 0) == 0 ? 0 : Util.nvl(footer[cn], 0)) + parseFloat(Util.nvl(vl, '0'));
                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "MONEY_FORMAT") {
                        vl = (vl.length == 0 ? "" : df.format(parseFloat(vl)));
                    }

                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "QTY_FORMAT") {
                        vl = (vl.length == 0 ? "" : dfq.format(parseFloat(vl)));
                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].valOnZero != undefined && parseFloat(vl) == 0) {
                        vl = this.mLctb.cols[k].valOnZero;
                    }


                    if (this.mLctb.cols[k].getMUIHelper().data_type == "DATE" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                        var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                        vl = dt;// sf.format(dt);
                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type != "DATE" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                        var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                        vl = sf.format(dt);
                    }


                    v += (v.length == 0 ? "" : ",") + '"' +
                        this.mLctb.cols[k].mColName + '":"' +
                        vl + '"';
                    if (k == this.mLctb.cols.length - 1)
                        v += (v.length == 0 ? "" : ",") + "\"_rowid\":" + i;

                }

                //v = v.replace(/\\/g, "\\\\");
                oNode1 = JSON.parse("{" + Util.nvl(v, "") + "}");

                if (rootNode == null || rootNode == undefined) {
                    itemsByID.push(oNode1);
                }
                else {
                    rootNode["childeren_" + i] = oNode1;
                    // rootNode["icon"] = "sap-icon://folder";
                }
                this.mapNodes[current_code] = oNode1;

            }
            //this.mTree.setFixedBottomRowCount(-1);
            if (footer != {}) {
                for (var f in footer) {
                    if (this.mLctb.getColByName(f).getMUIHelper().display_format == "MONEY_FORMAT")
                        footer[f] = df.format(footer[f]);
                    if (this.mLctb.getColByName(f).getMUIHelper().display_format == "QTY_FORMAT")
                        footer[f] = dfq.format(footer[f]);
                }

                itemsByID.push(footer);
                this.mTree.setFixedBottomRowCount(1);
            }
            return itemsByID;

        };
        QueryView.prototype.findNodebyVal = function (id) {

            return this.mapNodes[id];
        };

        QueryView.prototype.buildJSONTreeWithTotal = function () {
            if (this.mLctb.cols.length == 0)
                return null;
            var that = this;
            this.applySettings();
            var items = this.mLctb.getData(true);
            if (items == null)
                return;
            this.mapNodes = [];
            var recalcCHildCount = true;
            var itemsByID = [];
            var columns = [];
            var lastParent = "";
            var lastParentNode = null;
            var rootNode = null;
            var footer = {};
            var calcChildCount = function () {
                if (that.mColChild.length <= 0) return;
                var ld = that.mLctb;
                for (var i = 0; i < ld.rows.length; i++) {
                    var childcont = 0;
                    for (var j = 0; j < ld.rows.length; j++)
                        ld.getFieldValue(j, that.mColParent) ==
                            ld.getFieldValue(i, that.mColCode) ? childcont++ : childcont;
                    ld.setFIeldValue(i, that.mColChild, childcont);
                }
            }
            var footerCodes = {};

            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
            var sf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            this.minLevel = (this.mColLevel.length > 0 && this.mLctb.rows.length) > 1 ? parseInt(this.mLctb.getFieldValue(0, this.mColLevel)) : 0;

            // looping mctb..
            //resetting footers to null..
            for (var k = 0; k < this.mLctb.cols.length; k++) {
                var cn = this.mLctb.cols[k].mColName;
                footer[cn] = null;
            }
            (recalcCHildCount ? calcChildCount() : "");
            for (var i = 0; i < this.mLctb.rows.length; i++) {
                var current_parent = "";
                var current_code = this.mLctb.getFieldValue(i, this.mColCode) + "";
                var current_title = this.mLctb.getFieldValue(i, this.mColTitle) + "";
                current_parent = this.mLctb.getFieldValue(i, this.mColParent) + "";

                if (current_parent.length > 0) {
                    if (lastParent == current_parent)
                        rootNode = lastParentNode;
                    else {
                        rootNode = this.findNodebyVal(current_parent);
                        lastParent = current_parent;
                        lastParentNode = rootNode;
                    }
                }
                else
                    rootNode = null;
                var oNode1 = null;
                var v = "";
                var chlds = (this.mColChild.length > 0 ? this.mLctb.getFieldValue(i, this.mColChild) : 0);
                var footerg = undefined;
                if (chlds > 0) {
                    footerCodes[current_code] = {};
                    footerg = footerCodes[current_code];
                }
                //defining node
                for (var k = 0; k < this.mLctb.cols.length; k++) {
                    var vl = this.mLctb.getFieldValue(i, this.mLctb.cols[k].mColName);
                    var lvl = -1;
                    if (this.mColLevel.length > 0)
                        lvl = this.mLctb.getFieldValue(i, this.mColLevel);

                    vl = (Util.nvl(vl, "") + "").replace(/\"/g, "'").replace(/\n/, "\\r").replace(/\r/, "\\r").replace(/\\/g, "\\\\").trim();

                    if (this.mLctb.cols[k].mSummary == "SUM" && chlds > 0) {
                        var cn = this.mLctb.cols[k].mColName;
                        footerg[cn] = (Util.nvl(footerg[cn], 0) == 0 ? 0 : Util.nvl(footerg[cn], 0)) + parseFloat(Util.nvl(vl, '0'));
                    } else if (chlds > 0)
                        footerg[this.mLctb.cols[k].mColName] = null;



                    if (this.mLctb.cols[k].mSummary == "SUM" && lvl == this.minLevel) {
                        var cn = this.mLctb.cols[k].mColName;
                        footer[cn] = (Util.nvl(footer[cn], 0) == 0 ? 0 : Util.nvl(footer[cn], 0)) + parseFloat(Util.nvl(vl, '0'));

                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "MONEY_FORMAT") {
                        vl = (vl.length == 0 ? "" : df.format(parseFloat(vl)));
                    }

                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "QTY_FORMAT") {
                        vl = (vl.length == 0 ? "" : dfq.format(parseFloat(vl)));
                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type == "NUMBER" &&
                        this.mLctb.cols[k].valOnZero != undefined && parseFloat(vl) == 0) {
                        vl = this.mLctb.cols[k].valOnZero;
                    }


                    if (this.mLctb.cols[k].getMUIHelper().data_type == "DATE" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                        var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                        vl = dt;// sf.format(dt);
                    }
                    if (this.mLctb.cols[k].getMUIHelper().data_type != "DATE" &&
                        this.mLctb.cols[k].getMUIHelper().display_format == "SHORT_DATE_FORMAT") {
                        var dt = new Date(Util.nvl(vl, "").replaceAll(".", ":"));
                        vl = sf.format(dt);
                    }


                    v += (v.length == 0 ? "" : ",") + '"' +
                        this.mLctb.cols[k].mColName + '":"' +
                        vl + '"';
                    if (k == this.mLctb.cols.length - 1)
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
                this.mapNodes[current_code] = oNode1;
            }
            //this.mTree.setFixedBottomRowCount(-1);
            for (var fg in footerCodes) {
                this.mapNodes[fg]["childeren_-999"] = footerCodes[fg]
                if (that.mColName.length > 0)
                    footerCodes[fg][that.mColName] = "Total " + this.findNodebyVal(fg)[that.mColName];

            }

            if (footer != {}) {
                for (var f in footer) {
                    if (this.mLctb.getColByName(f).getMUIHelper().display_format == "MONEY_FORMAT")
                        footer[f] = df.format(footer[f]);
                    if (this.mLctb.getColByName(f).getMUIHelper().display_format == "QTY_FORMAT")
                        footer[f] = dfq.format(footer[f]);
                }

                itemsByID.push(footer);

                this.mTree.setFixedBottomRowCount(1);
            }

            var getHTMLText = function () {
                if (that.mLctb.cols.length <= 0) return;
                var sett = sap.ui.getCore().getModel("settings").getData();
                if (that.getControl().getModel() == undefined) return;
                var oData = that.getControl().getModel().getData();
                var h = "", dt = "", rs = "";           // table header data

                var hCol = "";
                var tmpv1 = "", tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
                var cs = []; // colspans in array for first row
                var nxtSpan = 0;
                var hasSpan = false;
                var hs = 1;
                var cnt = 0;
                var ld = that.mLctb;
                for (var c in ld.cols) {
                    cnt++;
                    // if (cnt - 1 == 0 && grouped) continue;
                    if (cnt - 1 === that.col.length) continue;
                    if (!that.col[c].mHideCol) continue;
                    cs[c] = "";
                    tmpv1 = ld.cols[c].mTitle;
                    tmpv2 = "\"text-align:Center\"";
                    cs[c] = "<th style=\"text-align: center;\" colspan=\"" + hs + "\">" + tmpv1 + "</th>";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                }

                for (var x in cs)
                    hCol += cs[x];

                var spacerAdd = "<tr><td class=\"page-header-space\"><div></div></td></tr>";
                hCol = "<tr>" + hCol + "</tr>";
                h = "<thead>" + spacerAdd + (hasSpan ? hCol : "") +
                    "<tr>" + h + "</tr></thead>";

                for (var i = 0; i < oData.length; i++) {
                    rs = that._getRowData2(i, oData);
                    dt += rs;
                }
                dt = "<tbody>" + dt + "</tbody>";
                h = "<table>" + h + dt + "</table>";
                return h;
            }
            var str = getHTMLText();
            return itemsByID;

        }
        // this is used in HTML for subtotals and totals rendering from tree
        QueryView.prototype._getRowData2 = function (i, oData) {
            var cellValue = "";
            var that = this;
            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var dfq = new DecimalFormat(sett["FORMAT_QTY_1"]);
            var rs = "";
            var cnt = 0;
            var grouped = this.mLctb.cols[0].mGrouped;
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
                var cn = that.mLctb.getColPos(v);

                if (cn > -1 && that.mLctb.cols[cn].mHideCol) continue;
                if (cn > -1 && rowid > -1 && Util.nvl(that.mLctb.cols[cn].mCfOperator, "").length > 0) {
                    if (this.mLctb.evaluteCfValue(this.mLctb.cols[cn], rowid))
                        cf += this.mLctb.cols[cn].mCfTrue;
                    else
                        cf += this.mLctb.cols[cn].mCfFalse;
                }
            }
            // purpose   :  looping to write html <tr>

            for (var v in oData[i]) {
                // task  :  find out that should i print this row or not , by checking this row is collapsed or expanded..

                cnt++;
                tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";

                var cn = that.mLctb.getColPos(v.replace("___", "/"));
                var cc = that.mLctb.cols[cn];
                if (cn > -1 && that.mLctb.cols[cn].mHideCol) continue;
                if (cnt - 1 == 0) {
                    t = v;
                }   // get 1st array key.. to find this row is summary/group
                if (cnt - 1 === 0 && grouped) {
                    continue;
                }
                if (cnt - 1 === this.mLctb.cols.length) break;
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
            // var strch = "";
            // if (child != undefined) {
            //     var chld = [];
            //     chld.push(child);
            //     strch = "<tr>" + that._getRowData(0, chld) + "</tr>";
            // }

            rs = "<tr>" + rs + "</tr>";//+strch ;

            var child = [];
            for (var v in oData[i]) {
                child = []
                if (v.startsWith("childeren_")) {
                    child.push(oData[i][v]);
                    rs += this._getRowData2(0, child);
                }
            }

            return rs;
        };
        QueryView.prototype.colorRows = function () {
            var that = this;
            if (this.mLctb.cols.length <= 0) return;
            var oModel = this.getControl().getModel();
            var rowCount = this.getControl().getVisibleRowCount(); //number of visible rows
            var rowStart = this.getControl().getFirstVisibleRow(); //starting Row index
            var fixRow = this.getControl().getFixedBottomRowCount();
            var totRows = oModel.getData().length;
            var cellAdd = 0;
            var groupedAdd = 0;
            if (this.mLctb.cols[0].mGrouped) {
                cellAdd = 1;
                groupedAdd = 1;
            }
            var cellsCount = this.mLctb.cols.length;

            if (oModel.getData() == undefined)
                return;


            if (this.getControl().getId() == null ||
                document.getElementById(this.getControl().getId()) == null ||
                document.getElementById(this.getControl().getId()).offsetParent == null || rowCount == 0) {
                if (this.scroll != undefined) clearInterval(this.scroll);

                // console.log('stopped interval scroll..');
                return;
            }
            for (var i = 0; i < this.mLctb.cols.length; i++)
                if (this.mLctb.cols[i].mHideCol)
                    ++cellAdd;
            var currentRowContext;
            for (var i = 0; i < rowCount; i++) {
                if (this.getControl().getRows()[i] == undefined || this.getControl().getRows()[i].getCells()[0] == undefined)
                    continue;
                // if (rowCount > this.mLctb.rows.length)
                //     continue;

                if (fixRow > 0 && i == rowCount - 1)
                    currentRowContext = this.getControl().getContextByIndex(totRows);
                else
                    currentRowContext = this.getControl().getContextByIndex(rowStart + i);

                (this.getControl().getRows()[i]).$().removeClass("yellow");
                (this.getControl().getRows()[i]).$().removeClass("qrGroup");
                this.getControl().getRows()[i].getCells()[0].$().parent().parent().removeAttr("colspan");
                var cf = "";
                var cf_tooltip = "";
                // ----conditional formatting
                for (var j = 0; j < cellsCount; j++) {
                    if (this.b4_cf_val1[j - cellAdd] == undefined && this.getControl().getRows()[i].getCells()[j - cellAdd] != undefined) {
                        if (oModel.getData()[rowStart + i] != undefined) {
                            // var rd = oModel.getData()[rowStart + i]._rowid;
                            this.b4_cf_val1[j - cellAdd] = this.getControl().getRows()[i].getCells()[j - cellAdd].$().parent().parent().attr("style");
                            this.b4_cf_val[j - cellAdd] = this.getControl().getRows()[i].getCells()[j - cellAdd].$().attr("style");
                        }
                    }

                    if (oModel.getData()[rowStart + i] != undefined && Util.nvl(this.mLctb.cols[j].mCfOperator, "").trim() != "")
                        if (oModel.getData()[rowStart + i]._rowid != undefined
                            && this.mLctb.evaluteCfValue(this.mLctb.cols[j], Number(oModel.getData()[rowStart + i]._rowid))) {
                            cf = cf + this.mLctb.cols[j].mCfTrue;
                            cf_tooltip = Util.nvl(this.mLctb.cols[j].mCfValue, "");
                        }
                        else
                            cf = cf + this.mLctb.cols[j].mCfFalse;
                }


                for (var j = 0; j < cellsCount - cellAdd; j++)
                    if (this.getControl().getRows()[i].getCells()[j] != undefined) {
                        // var rd = oModel.getData()[rowStart + i]._rowid;
                        // removing any class...
                        this.getControl().getRows()[i].getCells()[j].setVisible(true);
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().show();
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeClass("yellow");
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeClass("qrGroup");
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeClass("qtSecondLevel");
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeClass("qtFirstLevel");
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeAttr("colspan");
                        this.getControl().getRows()[i].getCells()[j].$().attr("style", this.b4_cf_val);
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().attr("style", Util.nvl(this.b4_cf_val1[j], ""));
                        this.getControl().getRows()[i].getCells()[j].$().parent().parent().css("background-color", "");
                        this.getControl().getRows()[i].getCells()[j].$().parent().css("background-color", "");
                        this.getControl().getRows()[i].getCells()[j].$().css("background-color", "");
                        this.getControl().getRows()[i].getCells()[j].$().css("color", "");

                        // column formatting...
                        var col_fmt1 = "";// will hold column format
                        if (i < this.mLctb.rows.length &&
                            Util.nvl(this.mLctb.cols[(j + groupedAdd)].getMUIHelper().display_style, "").trim() != "") {
                            var s = this.mLctb.cols[j + groupedAdd].getMUIHelper().display_style;
                            col_fmt1 = s;
                            this.getControl().getRows()[i].getCells()[(j)].$().parent().parent().attr("style", this.b4_cf_val1[j] + ";" + s);
                            this.getControl().getRows()[i].getCells()[(j)].$().attr("style", this.b4_cf_val[j] + ";" + s);
                            this.getControl().getRows()[i].getCells()[(j)].$().parent().parent().find("input").attr("style", s);

                        }
                        //applying conditional formatting....
                        if (cf != undefined && cf.length > 0) {
                            var rd = oModel.getData()[rowStart + i]._rowid;
                            this.getControl().getRows()[rd].getCells()[j].$().parent().parent().attr("style", this.b4_cf_val1[j] + ";" + col_fmt1 + cf);
                            this.getControl().getRows()[rd].getCells()[j].$().attr("style", this.b4_cf_val[j] + ";" + col_fmt1 + cf);
                            if (cf_tooltip != "")
                                this.getControl().getRows()[rd].getCells()[j].$().parent().parent().attr('title', cf_tooltip);
                        }
                        else if (this.mLctb.cols[j + groupedAdd].getMUIHelper().display_style == undefined ||
                            this.mLctb.cols[j + groupedAdd].getMUIHelper().display_style.length == 0) {
                            this.getControl().getRows()[i].getCells()[j].$().parent().parent().attr("style", this.b4_cf_val1[j]);
                            this.getControl().getRows()[i].getCells()[j].$().attr("style", this.b4_cf_val[j]);
                            this.getControl().getRows()[i].getCells()[j].$().parent().parent().removeAttr('title');
                        }


                    }

                for (var j = 0 + cellAdd; j < cellsCount; j++) {
                    if (this.mLctb.cols[j].mColName.startsWith("RATIO")) {
                        var cellValue = oModel.getProperty(this.mLctb.cols[j].mColName, currentRowContext);
                        this.getControl().getRows()[i].getCells()[j - cellAdd].$().css("background", "url(css/back1.jpg)");
                        this.getControl().getRows()[i].getCells()[j - cellAdd].$().css("background-repeat", "no-repeat");
                        this.getControl().getRows()[i].getCells()[j - cellAdd].$().css("background-size", cellValue + " 100%");
                        //this.getControl().getRows()[i].getCells()[j - cellAdd].$().parent().css("background-size", cellValue+"%");
                    }
                    if (this.onCellRender != undefined)
                        this.onCellRender(i, j - cellAdd, currentRowContext);

                    if (this.getControl().getRows()[i].getCells()[j - cellAdd] instanceof sap.m.InputBase)
                        this.getControl().getRows()[i].getCells()[j - cellAdd].setEditable(this.editable);
                }
                var cellValue = oModel.getProperty(this.mLctb.cols[0].mColName, currentRowContext);


                if (cellValue != undefined && (cellValue + "").startsWith(String.fromCharCode(4095))) {
                    for (var k = 0 + cellAdd; k < cellsCount; k++) {
                        var cv = oModel.getProperty(this.mLctb.cols[(k - cellAdd) + groupedAdd].mColName, currentRowContext);
                        if (!(cv + "").startsWith(String.fromCharCode(4095)) &&
                            cv != undefined && (cv + "").trim().length > 0 &&
                            this.getControl().getRows()[i].getCells()[k - cellAdd] != undefined)
                            this.getControl().getRows()[i].getCells()[k - cellAdd].$().parent().parent().addClass("yellow");

                    }
                }

                if (cellValue != undefined && (cellValue + "").startsWith(String.fromCharCode(4094))) {
                    this.getControl().getRows()[i].getCells()[0].$().addClass("qrGroup");
                    this.getControl().getRows()[i].getCells()[1].$().addClass("qrGroup");
                    this.getControl().getRows()[i].getCells()[0].$().parent().parent().attr("colspan", (this.mLctb.cols.length - cellAdd) + "");
                    //  this.getControl().getRows()[i].getCells()[1].$().parent().parent().attr("colspan", (this.mLctb.cols.length-cellAdd) + ""); 
                    for (var k = 1; k < this.mLctb.cols.length - cellAdd; k++) {
                        // this.getControl().getRows()[i].getCells()[k ].$().parent().parent().attr("width", "0px");
                        this.getControl().getRows()[i].getCells()[k].$().parent().parent().hide();
                    }
                    // this.getControl().getRows()[i].removeCell(this.getControl().getRows()[i].getCells().length - 1);

                    if (Util.nvl(this.mLctb.cols[0].commandLinkClick, undefined) != undefined) {
                        if (!this.getControl().getRows()[i].getCells()[0].hasStyleClass("linkLabel")) {
                            this.getControl().getRows()[i].getCells()[0].addStyleClass("linkLabel");
                        }
                    }
                    if (Util.nvl(this.mLctb.cols[0].commandLinkClick, undefined) != undefined ||
                        Util.nvl(this.mLctb.cols[0].commandLink, "") != "") {
                        if (!this.getControl().getRows()[i].getCells()[0].hasStyleClass("linkLabel")) {
                            this.getControl().getRows()[i].getCells()[0].addStyleClass("linkLabel");
                            this.getControl().getRows()[i].getCells()[0].attachBrowserEvent("click", function (oEvent) {
                                var rowno = that.getControl().indexOfRow(this.getParent());
                                var firstVis = that.getControl().getFirstVisibleRow();
                                var clno = 0; // colno
                                var cls = this.getParent().getParent().getColumns(); //all columns
                                var tm = -1;
                                var clx = 0;

                                var cx = cls[clx].tableCol;
                                var th = this;
                                var str = cx.commandLink;
                                var clk = cx.commandLinkClick;
                                var lst = str.match(/:[a-zA-Z0-9_.]*/gi);
                                var sst = str;
                                var rn = firstVis + rowno;
                                if (clk == undefined)
                                    for (var i = 0; i < Util.nvl(lst, []).length; i++) {
                                        var vl = that.mLctb.getFieldValue(rn, lst[i].replaceAll(':', ''));
                                        if (vl instanceof Date)
                                            vl = Util.toOraDateTimeString(vl);

                                        sst = sst.replaceAll(lst[i], vl);
                                    }
                                else


                                    sap.m.MessageToast.show(sst);
                                UtilGen.execCmd(sst, that.getControl().view, this, undefined);
                            });
                        }

                    }


                }


                if (this.mColLevel != "") {
                    var cellValue2 = oModel.getProperty(this.mColLevel, currentRowContext);
                    if (Util.nvl(cellValue2 + "", "") != "")
                        for (var k = 0 + cellAdd; k < cellsCount; k++) {
                            if (cellValue2 == this.minLevel)
                                this.getControl().getRows()[i].getCells()[k - cellAdd].$().parent().parent().addClass("qtFirstLevel");
                            if (cellValue2 == this.minLevel + 1)
                                this.getControl().getRows()[i].getCells()[k - cellAdd].$().parent().parent().addClass("qtSecondLevel");
                        }
                }
                if (this.onRowRender != undefined) {
                    var rowno = that.getControl().indexOfRow(this.getControl().getRows()[i]);
                    var firstVis = that.getControl().getFirstVisibleRow();
                    this.onRowRender(this, i, (rowno + firstVis), currentRowContext, 0 + cellAdd, cellsCount);
                }
            }

        }
            ;
        QueryView.prototype.reset = function () {
            this.getControl().removeAllRows();
            this.getControl().removeAllColumns();
            this.getControl().destroyRows();
            this.getControl().destroyColumns();
            this.mLctb.resetData();
        };


        QueryView.prototype.printHtml = function (view, iadd) {
            // return if mLctb have no data
            var that = this;

            // if (this.mLctb.cols.length <= 0) return;
            // if (this.queryType == "tree") {
            //     this.printHtmlTree(view, iadd);
            //     return;
            // }
            // var h = "", dt = "", rs = "";           // table header data
            //
            // var sett = sap.ui.getCore().getModel("settings").getData();
            // var oData = this.getControl().getModel().getData();
            // var tmpv1 = "", tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
            // var colData = view.colData;  // columns and other info...
            // var cellValue = "";
            // var rowid = -1;
            // var cf = "";   //  conditional format css..
            // var grouped = this.mLctb.cols[0].mGrouped;
            // var cnt = 0;
            // // purpose  :  header will show parameters, report title, etc..
            // h = ""
            // cnt == 0;
            // var rep = (view.byId("txtSubGroup") != undefined ? view.byId("txtSubGroup").getValue() : "");
            // var company = "<div class='company'>" + sett["COMPANY_NAME"] + "</div> " +
            //     "<div class='reportTitle'>" + view.reportsData.report_info.report_name +
            //     " - " + rep.substr(0, rep.indexOf(" - ")) + "</div>";
            // if (Util.nvl(view.reportsData.report_info.report_other, "") != "")
            //     company += "<div class='reportTitle'>" + view.reportsData.report_info.report_other + "</div>";
            // var dtitle = "";
            // var tmp = "";
            // var cnt = 0;
            // // purpose   :  adding parameters on top of the page
            // var vl = "";
            // var ia = Util.nvl(iadd, "para");
            // for (var i = 0; i < Util.nvl(colData.parameters, "").length; i++) {
            //     if (view.colData.parameters[i].PARA_DATATYPE === "BOOLEAN")
            //         vl = (view.byId("para_" + ia + i).getSelected() ? "TRUE" : "FALSE");
            //     else if (view.colData.parameters[i].PARA_DATATYPE === "GROUP")
            //         vl = Util.nvl(view.byId("para_" + ia + i).getSelectedButton().getCustomData()[0].getKey());
            //     else
            //         vl = Util.nvl(view.byId("para_" + ia + i).getValue(), "");
            //
            //     tmp += "<td class='paraLabel'>" + colData.parameters[i].PARA_DESCRARB + ":</td>" +
            //         "<td class='paraText'>" + Util.nvl(Util.htmlEntities(vl), "-") + "</td>";
            //     if (i > 0 && i % 3 == 0) {
            //         dtitle += "<tr>" + tmp + "</tr>";
            //         tmp = "";
            //     }
            //
            // }
            //
            // // table header and also for colSPan of parent label, supported by only 2 row.
            //
            // var hCol = "";
            // var cs = []; // colspans in array for first row
            // var nxtSpan = 0;
            // var hasSpan = false;
            // var hs = 1;
            // for (var c in this.col) {
            //     cnt++;
            //     if (cnt - 1 == 0 && grouped) continue;
            //     if (cnt - 1 === this.col.length) continue;
            //     if (!this.col[c].getVisible()) continue;
            //     if (nxtSpan > 1) {
            //         cs[c] = "";
            //         if (this.col[c].getMultiLabels().length > 1)
            //             tmpv1 = this.col[c].getMultiLabels()[1].getText();
            //         else
            //             tmpv1 = this.col[c].getMultiLabels()[0].getText();
            //         tmpv2 = "\"text-align:Center\"";
            //         h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
            //         nxtSpan--;
            //         continue;
            //     }
            //     hs = this.col[c].getHeaderSpan()[0];
            //     if (hs > 1) {
            //         cs[c] = "<th style=\"text-align: center;\" colspan=\"" + hs + "\">" + this.col[c].getMultiLabels()[0].getText() + "</th>";
            //         hasSpan = true;
            //         nxtSpan = hs;
            //         tmpv1 = this.col[c].getMultiLabels()[1].getText();
            //         tmpv2 = "\"text-align:Center\"";
            //         h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
            //
            //     }
            //     else {
            //         cs[c] = "<th colspan=\"1\"></th>";
            //         if (this.col[c].getMultiLabels().length > 1)
            //             tmpv1 = this.col[c].getMultiLabels()[1].getText();
            //         else
            //             tmpv1 = this.col[c].getMultiLabels()[0].getText();
            //         tmpv2 = "\"text-align:Center\"";
            //         h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
            //         hs--;
            //     }
            //
            // }
            //
            // for (var x in cs)
            //     hCol += cs[x];
            //
            //
            // hCol = "<tr>" + hCol + "</tr>";
            //
            // h = "<thead>" + (hasSpan ? hCol : "") +
            //     "<tr>" + h + "</tr></thead>";
            //
            // // getting data in table..
            // var t;
            // for (var i = 0; i < oData.length; i++) {
            //     rs = this._getRowData(i, oData);
            //     dt += rs;
            // }
            // dt = "<tbody>" + dt + "</tbody>";
            // h = company + "<table class='paras paras'>" + dtitle + "</table>" +
            //     "<table>" + h + dt + "</table>"
            var h = this.getHTMLTable(view, iadd);
            var newWin = window.open("");
            newWin.document.write(h);
            $("<link>", { rel: "stylesheet", href: "css/print.css" }).appendTo(newWin.document.head);
            setTimeout(function () {
                newWin.print();
            }, 1000);
        };


        QueryView.prototype.getHTMLTable = function (view, iadd, addTitle) {
            var that = this;

            if (this.mLctb.cols.length <= 0) return;
            if (this.queryType == "tree") {
                var ht = this.printHtmlTree(view, iadd, addTitle);
                return ht;
            }
            var h = "", dt = "", rs = "";           // table header data

            var sett = sap.ui.getCore().getModel("settings").getData();
            var oData = this.getControl().getModel().getData();
            var tmpv1 = "", tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
            var colData = view.colData;  // columns and other info...
            var cellValue = "";
            var rowid = -1;
            var cf = "";   //  conditional format css..
            var grouped = this.mLctb.cols[0].mGrouped;
            var cnt = 0;
            // purpose  :  header will show parameters, report title, etc..
            h = ""
            cnt == 0;
            if (addTitle) {
                var rep = (view.byId("txtSubGroup") != undefined ? view.byId("txtSubGroup").getValue() : "");
                var company = "<div class='company'>" + sett["COMPANY_NAME"] + "</div> " +
                    "<div class='reportTitle'>" + view.reportsData.report_info.report_name +
                    " - " + rep.substr(0, rep.indexOf(" - ")) + "</div>";

                if (Util.nvl(view.reportsData.report_info.report_other, "") != "")
                    company += "<div class='reportTitle'>" + view.reportsData.report_info.report_other + "</div>";
            }
            var dtitle = "";
            var tmp = "";
            var cnt = 0;
            // purpose   :  adding parameters on top of the page
            var vl = "";
            var ia = Util.nvl(iadd, "para");
            for (var i = 0; i < Util.nvl(colData.parameters, "").length; i++) {
                if (view.colData.parameters[i].PARA_DATATYPE === "BOOLEAN")
                    vl = (view.byId("para_" + ia + i).getSelected() ? "TRUE" : "FALSE");
                else if (view.colData.parameters[i].PARA_DATATYPE === "GROUP")
                    vl = Util.nvl(view.byId("para_" + ia + i).getSelectedButton().getCustomData()[0].getKey());
                else
                    vl = Util.nvl(view.byId("para_" + ia + i).getValue(), "");

                tmp += "<td class='paraLabel'>" + colData.parameters[i].PARA_DESCRARB + ":</td>" +
                    "<td class='paraText'>" + Util.nvl(Util.htmlEntities(vl), "-") + "</td>";
                if (i > 0 && i % 3 == 0) {
                    dtitle += "<tr>" + tmp + "</tr>";
                    tmp = "";
                }

            }

            // table header and also for colSPan of parent label, supported by only 2 row.

            var hCol = "";
            var cs = []; // colspans in array for first row
            var nxtSpan = 0;
            var hasSpan = false;
            var hs = 1;
            for (var c in this.col) {
                cnt++;
                if (cnt - 1 == 0 && grouped) continue;
                if (cnt - 1 === this.col.length) continue;
                if (!this.col[c].getVisible()) continue;
                if (this.col[c].getWidth() == "0px") continue;
                if (nxtSpan > 1) {
                    cs[c] = "";
                    if (this.col[c].getMultiLabels().length > 1)
                        tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    else
                        tmpv1 = this.col[c].getMultiLabels()[0].getText();
                    tmpv2 = "\"text-align:Center;background-color:lightgrey;\"";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                    nxtSpan--;
                    continue;
                }
                hs = this.col[c].getHeaderSpan()[0];
                if (hs > 1) {
                    cs[c] = "<th style=\"text-align: center;background-color:lightgrey; \" colspan=\"" + hs + "\">" + this.col[c].getMultiLabels()[0].getText() + "</th>";
                    hasSpan = true;
                    nxtSpan = hs;
                    tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    tmpv2 = "\"text-align:Center;background-color:lightgrey;\"";
                    h += "<th style=" + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";

                }
                else {
                    cs[c] = "<th colspan=\"1\"></th>";
                    if (this.col[c].getMultiLabels().length > 1)
                        tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    else
                        tmpv1 = this.col[c].getMultiLabels()[0].getText();
                    tmpv2 = "\"text-align:Center;background-color:lightgrey;\"";
                    h += "<th style=" + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                    hs--;
                }
            }

            for (var x in cs)
                hCol += cs[x];
            hCol = "<tr>" + hCol + "</tr>";
            var spacerAdd = "<tr><td class=\"page-header-space\"><div></div></td></tr>";
            var spacerAddFooter = "<tfoot><tr><td class=\"page-footer-space\"><div></div></td></tr></tfoot>";
            h = "<thead>" + spacerAdd + (hasSpan ? hCol : "") +
                "<tr>" + h + "</tr></thead>";

            // getting data in table..
            var t;
            for (var i = 0; i < oData.length; i++) {
                rs = this._getRowData(i, oData);
                dt += rs;
            }
            dt = "<tbody>" + dt + "</tbody>";
            h =/* company + "<table class='paras paras'>" + dtitle + "</table>" */ "" +
                "<table>" + h + dt + spacerAddFooter + "</table>";
            return h;
        };

        QueryView.prototype.printHtmlTree = function (view, iadd, addTitle) {
            // return if mLctb have no data
            var that = this;
            if (this.mLctb.cols.length <= 0) return;

            var h = "", dt = "", rs = "";           // table header data

            var sett = sap.ui.getCore().getModel("settings").getData();
            var oData = this.getControl().getModel().getData();
            var tmpv1 = "", tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";
            var colData = view.colData;  // columns and other info...
            var cellValue = "";
            var rowid = -1;
            var cf = "";   //  conditional format css..
            var grouped = this.mLctb.cols[0].mGrouped;
            var cnt = 0;
            // purpose  :  header will show parameters, report title, etc..
            h = "";
            cnt == 0;
            var company = "";
            if (addTitle) {
                var rep = (view.byId("txtSubGroup") != undefined ? view.byId("txtSubGroup").getValue() : "");
                company = "<div class='company'>" + sett["COMPANY_NAME"] + "</div> " +
                    "<div class='reportTitle'>" + view.reportsData.report_info.report_name +
                    " - " + rep.substr(0, rep.indexOf(" - ")) + "</div>";

                if (Util.nvl(view.reportsData.report_info.report_other, "") != "")
                    company += "<div class='reportTitle'>" + view.reportsData.report_info.report_other + "</div>";
            }

            // var rep = view.byId("txtSubGroup").getValue();
            // var company = "<div class='company'>" + sett["COMPANY_NAME"] + "</div> " +
            //     "<div class='reportTitle'>" + view.reportsData.report_info.report_name +
            //     " - " + rep.substr(0, rep.indexOf(" - ")) + "</div>";

            var dtitle = "";
            var tmp = "";
            var cnt = 0;
            // purpose   :  adding parameters on top of the page
            var vl = "";
            var ia = Util.nvl(iadd, "para");
            for (var i = 0; i < Util.nvl(colData.parameters, "").length; i++) {
                if (view.colData.parameters[i].PARA_DATATYPE === "BOOLEAN")
                    vl = (view.byId("para_" + ia + i).getSelected() ? "TRUE" : "FALSE");
                else if (view.colData.parameters[i].PARA_DATATYPE === "GROUP")
                    vl = Util.nvl(view.byId("para_" + ia + i).getSelectedButton().getCustomData()[0].getKey());
                else
                    vl = Util.nvl(view.byId("para_" + ia + i).getValue(), "");

                tmp += "<td class='paraLabel'>" + colData.parameters[i].PARA_DESCRARB + ":</td>" +
                    "<td class='paraText'>" + Util.nvl(Util.htmlEntities(vl), "-") + "</td>";
                if (i > 0 && i % 3 == 0) {
                    dtitle += "<tr>" + tmp + "</tr>";
                    tmp = "";
                }

            }

            // table header and also for colSPan of parent label, supported by only 2 row.
            var hCol = "";
            var cs = []; // colspans in array for first row
            var nxtSpan = 0;
            var hasSpan = false;
            var hs = 1;
            for (var c in this.col) {
                cnt++;
                if (cnt - 1 == 0 && grouped) continue;
                if (cnt - 1 === this.col.length) continue;
                if (!this.col[c].getVisible()) continue;
                if (this.col[c].getWidth() == "0px") continue;
                if (nxtSpan > 1) {
                    cs[c] = "";
                    if (this.col[c].getMultiLabels().length > 1)
                        tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    else
                        tmpv1 = this.col[c].getMultiLabels()[0].getText();
                    tmpv2 = "\"text-align:Center\"";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                    nxtSpan--;
                    continue;
                }
                hs = this.col[c].getHeaderSpan()[0];
                if (hs > 1) {
                    cs[c] = "<th style=\"text-align: center;\" colspan=\"" + hs + "\">" + this.col[c].getMultiLabels()[0].getText() + "</th>";
                    hasSpan = true;
                    nxtSpan = hs;
                    tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    tmpv2 = "\"text-align:Center\"";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";

                }
                else {
                    cs[c] = "<th colspan=\"1\"></th>";
                    if (this.col[c].getMultiLabels().length > 1)
                        tmpv1 = this.col[c].getMultiLabels()[1].getText();
                    else
                        tmpv1 = this.col[c].getMultiLabels()[0].getText();
                    tmpv2 = "\"text-align:Center\"";
                    h += "<th " + tmpv2 + ">" + Util.htmlEntities(tmpv1) + "</th>";
                    hs--;
                }

            }

            for (var x in cs)
                hCol += cs[x];


            hCol = "<tr>" + hCol + "</tr>";
            var spacerAdd = "<tr><td class=\"page-header-space\"><div></div></td></tr>";
            var spacerAddFooter = "<tfoot><tr><td class=\"page-footer-space\"><div></div></td></tr></tfoot>";
            h = "<thead>" + spacerAdd + (hasSpan ? hCol : "") +
                "<tr>" + h + "</tr></thead>";

            // getting data in table..
            var t;

            for (var i = 0; i < oData.length; i++) {
                rs = this._getRowData(i, oData);
                dt += rs;

            }
            dt = "<tbody>" + dt + "</tbody>";
            h =/* company + "<table class='paras paras'>" + dtitle + "</table>"*/"" +
                "<table>" + h + dt + spacerAddFooter + "</table>";
            return h;

        };


        QueryView.prototype._getRowData = function (i, oData) {
            var cellValue = "";
            var that = this;
            var rs = "";
            var cnt = 0;
            var grouped = this.mLctb.cols[0].mGrouped;
            var t;
            var tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "", strPrintRender = "";
            //getting style for row...
            var cf = "";  // conditional format css (if condition true and false)
            var rowid = Number(Util.nvl(oData[i]["_rowid"], -1));
            var child;


            // purpose  :  looping all columns to get conditional format css
            for (var v in oData[i]) {

                if (v.startsWith("childeren_"))
                    child = oData[i][v];
                var cn = that.mLctb.getColPos(v);

                if (cn > -1 && that.mLctb.cols[cn].mHideCol) continue;
                if (cn > -1 && that.mLctb.cols[cn].mUIHelper.display_width <= 0) continue;
                if (cn > -1 && rowid > -1 && Util.nvl(that.mLctb.cols[cn].mCfOperator, "").length > 0) {
                    if (this.mLctb.evaluteCfValue(this.mLctb.cols[cn], rowid))
                        cf += this.mLctb.cols[cn].mCfTrue;
                    else
                        cf += this.mLctb.cols[cn].mCfFalse;
                }
            }
            // purpose   :  looping to write html <tr>
            var grptext = false;
            for (var v in oData[i]) {
                // task  :  find out that should i print this row or not , by checking this row is collapsed or expanded..
                cnt++;
                tmpv2 = "", tmpv3 = "", classadd = "", styleadd = "";

                var cn = that.mLctb.getColPos(v.replace("___", "/"));
                var cc = that.mLctb.cols[cn];
                if (cc == undefined || cc == null) continue;
                if (cn > -1 && that.mLctb.cols[cn].mHideCol) continue;
                if (cn > -1 && that.mLctb.cols[cn].mUIHelper.display_width <= 0) continue;
                if (cnt - 1 == 0) {
                    t = v;
                }   // get 1st array key.. to find this row is summary/group
                if (cnt - 1 === 0 && grouped) {
                    continue;
                }
                if (cnt - 1 === this.mLctb.cols.length) break;
                cellValue = Util.nvl(oData[i][v], "");
                var spcAdd = "";
                // if (cc.mColName == that.mColName && that.mColLevel.length > 0)
                //     spcAdd = Util.charCount("\xa0\xa0", parseInt(oData[i][that.mColLevel]));
                if (Util.nvl(cellValue + "", "").trim().length > 0 && Util.nvlObjToStr(oData[i][t], "").startsWith(String.fromCharCode(4095))) {
                    classadd += "yellow "
                }
                if (grouped && cellValue != undefined && oData[i][t].startsWith(String.fromCharCode(4094))) {
                    classadd += "qrGroup ";
                    grptext = true;
                    tmpv2 = this.getControl().getColumns().length + "";
                }

                if (rowid > -1 && cf.length > 0)
                    styleadd += cf;
                if (Util.nvl(cc.getMUIHelper().display_style, "").length > 0) {
                    styleadd += cc.getMUIHelper().display_style;
                }

                var a = Util.getLangDescrAR("text-align:" + cc.getMUIHelper().display_align + " ", "text-align:start ");
                if (cc.getMUIHelper().display_format == "MONEY_FORMAT")
                    a = Util.getLangDescrAR("text-align:end ", "text-align:start ");
                if (cc.getMUIHelper().display_format == "QTY_FORMAT")
                    a = "text-align:center ";
                styleadd += a;

                strPrintRender = that.onPrintRenderAdd != undefined ? Util.nvl(that.onPrintRenderAdd(that.mLctb, i, cc), "") : ""
                styleadd = ((strPrintRender + styleadd).length > 0 ? ' style="' : "") + strPrintRender + styleadd + ((strPrintRender + styleadd).length > 0 ? '"' : "");
                classadd = (classadd.length > 0 ? ' class="' : "") + classadd + (classadd.length > 0 ? '"' : "");
                tmpv2 = (tmpv2.length > 0 ? ' colspan="' : "") + tmpv2 + (tmpv2.length > 0 ? '"' : "");
                rs += "<td" + tmpv2 + classadd + styleadd + " > " + Util.nvl(Util.htmlEntities(spcAdd + cellValue), "") + "</td>";
                grptext = false;
            }
            // var strch = "";
            // if (child != undefined) {
            //     var chld = [];
            //     chld.push(child);
            //     strch = "<tr>" + that._getRowData(0, chld) + "</tr>";
            // }

            rs = "<tr>" + rs + "</tr>";//+strch ;

            var child = [];
            for (var v in oData[i]) {
                child = []
                if (v.startsWith("childeren_")) {
                    child.push(oData[i][v]);
                    rs += this._getRowData(0, child);
                }
            }

            return rs;
        };

        QueryView.prototype.selectGroup = function (grp, startRow) {
            if (this.mLctb.cols.length < 0) return;
            if (!this.mLctb.cols[0].mGrouped) return;

            var that = this;
            var end = startRow;
            var fc = that.mLctb.cols[0].mColName;
            var dt = this.getControl().getModel().getData();

            for (var i = startRow + 1; i < dt.length; i++) {
                if (dt[i][fc] != grp)
                    break;
                end++;
            }

            var slices = that.getControl().getSelectedIndices();
            var sel = (slices.indexOf(startRow) <= -1 ? false : true);

            if (sel)
                that.getControl().addSelectionInterval(startRow, end);
            else
                that.getControl().removeSelectionInterval(startRow, end);
        };

        QueryView.prototype.setViewSettings = function (vs, refresh) {
            this.mViewSettings = vs;
            if (refresh)
                this.loadData();

        }

        QueryView.prototype.applySettings = function () {
            if (this.mViewSettings == undefined)
                return;
            var fls = "";
            if (this.mViewSettings.filterStr != undefined) {
                var df = new DataFilter();
                df.filterString = this.mViewSettings.filterStr;
                df.doFilter(this.mLctb);
            } else {
                this.mLctb.rows = [];
                this.mLctb.rows = this.mLctb.masterRows.slice(0);
                if (Util.nvl(this.mLctb.cndFilter, "") != "")
                    this.mLctb.showDataByCondition(this.mLctb.cndFilter);

            }


        }
            ;
        QueryView.prototype.buildQuickFilter = function () {
            var that = this;
            if (this.mLctb.cols.length <= 0) return false;

            var sett = sap.ui.getCore().getModel("settings").getData();
            var df = new DecimalFormat(sett["FORMAT_MONEY_1"]);
            var sf = new simpleDateFormat(sett["ENGLISH_DATE_FORMAT"]);
            var oData = this.getControl().getModel().getData();
            var rowid = -1;

            var grouped = this.mLctb.cols[0].mGrouped;

            var cnt = 0;
            if (this.queryType == "tree")
                return false;
            if (!grouped)
                return false;
            if (oData.length <= 0)
                return false;
            this.filterCodeCol = this.mLctb.cols[0].mColName;
            this.filterNameCol = (this.mLctb.cols[1].mGrouped ? this.mLctb.cols[1].mColName : this.mLctb.cols[0].mColName)
            var tmpp123 = (sap.ui.getCore().byId("filterBox") != undefined ? sap.ui.getCore().byId("filterBox").destroy() : undefined);
            this.filterBox = new sap.m.FlexBox("filterBox",
                {
                    items: [],
                    direction: sap.m.FlexDirection.Column,
                    alignItems: sap.m.FlexAlignItems.Start
                }
            ).addStyleClass("paddingLeftRightTop");
            this.mLctbFilter = new LocalTableData();
            var o = {};
            var lastGroup = "";
            //putting distinct group values in table data
            var cnt = 0;

            // crateing distinct group list...
            for (var v in oData) {
                ``
                rowid = Number(Util.nvl(oData[v]["_rowid"], -1));

                var grp = oData[v][this.filterCodeCol] + (this.filterNameCol != this.filterCodeCol ? " - " + oData[v][this.filterNameCol] : "")
                if (rowid >= 0 && this.mLctb.getColByName(this.filterCodeCol).getMUIHelper().display_format === "SHORT_DATE_FORMAT") {
                    if (Util.nvl(oData[v][this.filterCodeCol], "").length > 0) {
                        var dt = new Date(oData[v][this.filterCodeCol]);
                        grp = sf.format(dt) + (this.filterNameCol != this.filterCodeCol ? " - " + oData[v][this.filterNameCol] : "")
                    }
                }
                if (rowid >= 0 && this.mLctb.getColByName(this.filterCodeCol).getMUIHelper().display_format === "MONEY_FORMAT")
                    grp = df.format(oData[v][this.filterCodeCol]) + (this.filterNameCol != this.filterCodeCol ? " - " + oData[v][this.filterNameCol] : "");
                if (rowid >= 0 && this.mLctb.getColByName(this.filterCodeCol).getMUIHelper().display_format === "QTY_FORMAT")
                    grp = dfq.format(oData[v][this.filterCodeCol]) + (this.filterNameCol != this.filterCodeCol ? " - " + oData[v][this.filterNameCol] : "");

                if (rowid >= 0 && lastGroup != grp) {
                    o[cnt] = {};
                    o[cnt]["POS"] = grp;
                    o[cnt]["DISPLAY"] = grp;
                    o[cnt]["FILTER_STRING"] = this.filterCodeCol + "=" + oData[v][this.filterCodeCol] +
                        (this.filterNameCol != this.filterCodeCol ? " && "
                            + this.filterNameCol + "=" + oData[v][this.filterNameCol] : "");
                    lastGroup = grp;
                    cnt++;
                }
            }

            var lst = new sap.m.List({});

            var oTempl = new sap.m.StandardListItem({
                type: "Navigation",
                press: function (e) {
                    var str = e.getSource().getCustomData()[0].getKey();
                    that.mViewSettings["filterStr"] = str;
                    that.loadData();
                    sap.m.MessageToast.show("Filtered # " + that.mLctb.rows.length + " rows..");

                },
                title: "{DISPLAY}",
                active: true,
                customData: { key: "{FILTER_STRING}" }
            });

            lst.setModel(new sap.ui.model.json.JSONModel(o));
            lst.bindAggregation("items", "/", oTempl);
            this.filterBox.addItem(new sap.m.Button({
                text: "Clear filter",
                press: function () {
                    that.mViewSettings["filterStr"] = null;
                    that.loadData();

                }
            }));
            this.filterBox.addItem(new sap.m.SearchField({
                placeholder: "filter..",
                liveChange: function (event) {
                    var val = event.getParameter("newValue");
                    var filter = new sap.ui.model.Filter("DISPLAY", sap.ui.model.FilterOperator.Contains, val);
                    var binding = lst.getBinding("items");
                    binding.filter(filter);
                }
            }
            ));
            this.filterBox.addItem(lst);
            return true;
        };

        QueryView.prototype.showFilterWindow = function (view) {
            var qv = this;
            var txts = [];
            if (view.filterData == undefined)
                view.filterData = [];
            var flt = Util.nvl(this.showToolbar.filterCols, []);
            for (var i = 0; i < qv.mLctb.cols.length; i++) {
                if (flt.indexOf(qv.mLctb.cols[i].mColName) <= -1)
                    continue;
                (view.byId("txtflt" + i) != undefined ? view.byId("txtflt" + i).destroy() : null);
                var t = new sap.m.Input(view.createId("txtflt" + i), {
                    width: "60%",
                    placeholder: "Filter for field # " + Util.getLangCaption(qv.mLctb.cols[i].mTitle),
                    value: Util.nvl(view.filterData[qv.mLctb.cols[i].mColName], "")
                });
                txts.push(Util.getLabelTxt(qv.mLctb.cols[i].mTitle, "40%"));
                txts.push(t);
            }


            // var flexMain = new sap.m.FlexBox({
            //     width: "100%",
            //     height: "100%",
            //     direction: sap.m.FlexDirection.Column,
            //     justifyContent: sap.m.FlexJustifyContent.Start,
            //     alignItems: sap.m.FlexAlignItems.Start,
            //     items: txts
            // });
            var flexMain = UtilGen.formCreate2("", true, txts, undefined, sap.m.ScrollContainer, {
                vertical: true,
                width: "350px",
                cssText: [
                    "padding-left:10px;" +
                    "padding-top:20px;" +
                    "padding-right:10px;"
                ]
            }, undefined);
            var vb = new sap.m.VBox({
                height: "300px",
                items: [flexMain]
            });
            var dlg = new sap.m.Dialog({
                title: "Filtering data..",
                content: [vb],
                contentWidth: "400px",
                contentHeight: "300px",
                buttons: [new sap.m.Button({
                    text: "Filter",
                    press: function () {
                        var str = "";
                        var flt = Util.nvl(qv.showToolbar.filterCols, []);
                        for (var i = 0; i < qv.mLctb.cols.length; i++) {
                            if (flt.indexOf(qv.mLctb.cols[i].mColName) <= -1)
                                continue;
                            var s = view.byId("txtflt" + i).getValue();
                            var op = "%%";
                            op = (s.startsWith("=") ? "=" :
                                s.startsWith("!=") ? "!=" :
                                    s.startsWith("<>") ? "<>" :
                                        s.startsWith(">=") ? ">=" :
                                            s.startsWith("<=") ? "<=" :
                                                s.startsWith(">") ? ">" :
                                                    s.startsWith("<") ? "<" : "%%");
                            if (s.startsWith(op)) {
                                s = s.substring(op.length);
                            }
                            view.filterData[qv.mLctb.cols[i].mColName] = null;
                            if (s != undefined && s.length > 0) {
                                if (s.indexOf("&&")) {
                                    var ss = Util.splitString(s, ["&&"]);
                                    for (var x in ss) {
                                        if (x == 0) {
                                            str += (str.length > 0 ? " && " : "") + qv.mLctb.cols[i].mColName + op + ss[0];
                                            view.filterData[qv.mLctb.cols[i].mColName] = (op == "%%" ? "" : op) + s;
                                        } else
                                            str += (str.length > 0 ? " && " : "") + qv.mLctb.cols[i].mColName + ss[x];
                                    }
                                }
                                else {
                                    str += (str.length > 0 ? " && " : "") + qv.mLctb.cols[i].mColName + op + s;
                                    view.filterData[qv.mLctb.cols[i].mColName] = (op == "%%" ? "" : op) + s;
                                }
                            }
                        }
                        qv.mViewSettings["filterStr"] = str;
                        qv.loadData();
                        dlg.close();
                    }
                }),
                new sap.m.Button({
                    text: "Clear filter",
                    press: function () {
                        view.filterData = [];
                        qv.mViewSettings["filterStr"] = null;
                        qv.loadData();
                        dlg.close();
                    }

                })
                ]
            });
            dlg.open();

            dlg.attachAfterClose(function () {
                (view.byId("flxOtherFilter") != undefined ? view.byId("flxOtherFilter").destroy() : null);
                for (var i = 0; i < qv.mLctb.cols.length; i++) {
                    (view.byId("txtflt" + i) != undefined ? view.byId("txtflt" + i).destroy() : null);
                }
            })
        };
        QueryView.prototype.autoResizeColumns = function (fixSize) {
            for (var i = 0; i < this.getControl().getColumns().length; i++) {
                if (fixSize != undefined)
                    this.getControl().getColumns()[i].setWidth(fixSize);
                else {
                    this.getControl().getColumns()[i].setAutoResizable(true);
                    this.getControl().autoResizeColumn(i);
                }
            }
        };

        return QueryView;
    }
)
    ;



