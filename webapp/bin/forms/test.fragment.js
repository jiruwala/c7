sap.ui.jsfragment("bin.forms.test", {

    createContent: function (oController) {
        var that = this;
        this.oController = oController;
        this.view = oController.getView();
        this.qryStr = Util.nvl(oController.code, "");
        this.timeInLong = (new Date()).getTime();
        this.joApp = new sap.m.SplitApp({ mode: sap.m.SplitAppMode.HideMode });
        // this.vars = {
        //     keyfld: -1,
        //     flag: 1,  // 1=closed,2 opened,
        //     vou_code: 1,
        //     type: 1
        // };

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
        }).addStyleClass("sapUiSizeCompact");
        this.createView();
        this.loadData();
        this.joApp.addDetailPage(this.mainPage);
        // this.joApp.addDetailPage(this.pgDetail);
        this.joApp.to(this.mainPage, "show");

        this.joApp.displayBack = function () {
            that.frm.refreshDisplay();
        };
        this.mainPage.attachBrowserEvent("keydown", function (oEvent) {
            if (that.frm.isFormEditable() && oEvent.key == 'F4') {
            }
            if (that.frm.isFormEditable() && oEvent.key == 'F10') {
                that.frm.cmdButtons.cmdSave.firePress();
            }

        });


        setTimeout(function () {
            if (that.oController.getForm().getParent() instanceof sap.m.Dialog)
                that.oController.getForm().getParent().setShowHeader(false);

        }, 10);

        // UtilGen.setFormTitle(this.oController.getForm(), "Journal Voucher", this.mainPage);
        return this.joApp;
    },
    createView: function () {
        var JSONModel = sap.ui.model.json.JSONModel;
        var Table = sap.ui.table.Table;
        var ComboBox = sap.m.ComboBox;
        var Column = sap.ui.table.Column;
        var ColumnListItem = sap.m.ColumnListItem;
        var Text = sap.m.Text;
        var Item = sap.ui.core.Item;


        // Sample data for the table
        var oTableData =
        {
            data:
                [
                    { ID: "1", Name: "Item 1", Status: "InProgress" },
                    { ID: "2", Name: "Item 2", Status: "Completed" },
                    { ID: "3", Name: "Item 3", Status: "Pending" }
                ],
            list: [{ key: "InProgress", text: "In Progress" },
            { key: "Completed", text: "Completed" },
            { key: "Pending", text: "Pending" }
            ]

        };
        var oTableModel = new JSONModel(oTableData);

        // var oComboBoxModel = new JSONModel(aStatuses);

        var cb = new ComboBox({
            selectedKey: "{Status}",
            value: "{Status}"
        });

        // cb.setModel(oComboBoxModel);
        cb.bindAggregation("items",
            {
                path: "/list",
                template: new sap.ui.core.Item({ text: "{text}", key: "{key}" }),
                templateShareable: true
            });

        Util.destroyID("myTable");

        var oTable = new Table({

            id: "myTable",
            columns: [
                new Column({
                    multiLabels: new Text({ text: "ID" }),
                    template: new Text({ text: "{ID}" })
                }),
                new Column({
                    multiLabels: new Text({ text: "Name" }),
                    template: new Text({ text: "{Name}" })
                }),
                new Column({
                    multiLabels: new Text({ text: "Status" }),
                    template: cb
                })
            ]
        });
        oTable.setModel(oTableModel);
        oTable.bindRows("/data");
        this.mainPage.addContent(oTable);
        setTimeout(function () {
            // console.log(cb.getModel().getData());
            // console.log(oTable.getModel().getData());
            var itm = new sap.ui.core.Item({ text: "In Progress", key: "InProgress" });
            var comb = oTable.getRows()[0].getCells()[2];
            comb.removeAllItems();
            comb.addItem(itm);
            UtilGen.setControlValue(comb, "InProgress", "InProgress", false);
        });
    },
    setFormEditable: function () {

    }
    ,

    createViewHeader: function () {

    }
    ,
    loadData: function () {
        // if (Util.nvl(this.oController.accno, "") != "" &&
        //     Util.nvl(this.oController.status, "view") == FormView.RecordStatus.VIEW) {
        //     this.frm.setFieldValue("pac", this.oController.accno, this.oController.accno, true);
        //     this.frm.loadData(undefined, FormView.RecordStatus.VIEW);
        //     this.oController.accno = "";
        //     return;

        // }
        // this.frm.setQueryStatus(undefined, FormView.RecordStatus.NEW);
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



