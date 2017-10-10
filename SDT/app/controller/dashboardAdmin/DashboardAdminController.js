Ext.define('SDT.controller.dashboardAdmin.DashboardAdminController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.DashboardsGrid',
        'dashboardAdmin.forms.DashboardCloneForm'
    ],
    models: [
        'dashboardAdmin.DashboardsModel',
        'menuManagement.MenuTreeNodeModel'
    ],
    stores: [
        'dashboardAdmin.DashboardsStore',
        'menuManagement.MenuTreeStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'dashboardsGrid': {
                beforerender: me.bindDashboardStoreEvents,
                afterrender: me.loadDashboardGrid
            },
            'dashboardsGrid > toolbar > button[text="Refresh"]': {
                click: me.loadDashboardGrid
            },
            'dashboardActions': {
                deleteItem: me.deleteDashboard,
                cloneDashboard: me.cloneDashboard,
                editDashboard: me.editDashboard
            },
            'dashboardsGrid > toolbar > textfield[name="search"]': {
                change: me.searchDashboard
            }
        });
    },
    refs: [{
        ref: 'viewportPanel',
        selector: 'viewport > panel'
    }, {
        ref: 'dashboardAdminView',
        selector: 'dashboardAdminView'
    }, {
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }],

    loadDashboardGrid: function () {
        var grid = this.getDashboardsGrid(),
            searchField = grid.down('#searchDashboardListsField');
        if (searchField) {
            searchField.setValue('');
        }

        //grid.getStore().loadData(Ext.state.Manager.get('dashboards'));
    },

    bindDashboardStoreEvents: function (grid) {
        var store = grid.getStore();

        store.on('add', function (gridStore, records) {
            //me.reloadDashboardMenu(records[0], 'create');
        });

        store.on('remove', function (gridStore, record) {
            //me.reloadDashboardMenu(record, 'destory');
        });

        store.on('update', function (gridStore, record) {
            //me.reloadDashboardMenu(record, 'update');
        });
    },

    reloadDashboardMenu: function (record, action) {
        var me = this,
            menuStore = me.getMenuManagementMenuTreeStoreStore(),
            startingNode = menuStore.getNodeById('a8de99a0-1b59-4df5-992d-13048917c93b'), //Select Dashboard tree item by id, done to allow future menu changes
            node,
            id,
            nodeData = { dashboardId: record.data.id, text: record.data.title, leaf: true, iconCls: 'x-icon icon-server_chart' },
            createdNode,
            foundRecord;

        //Update the store that populates of dashboard active list menu items by firing the datachanged event

        if (record.data.active && (action === 'create' || action === 'update')) {
            if (action === 'create') {
                Ext.Msg.show({
                    title: 'Add your newely created dashboard to menu now',
                    msg: 'Would you like to add your dashboard to root menu and launch the "Dashboard Menu Management" tool to further customized? Note you must add to menu before it will be visible to users, you may do this later.',
                    buttons: Ext.Msg.YESNO,
                    fn: function (btn) {
                        if (btn === 'yes') {
                            id = Ext.data.IdGenerator.get('uuid').generate();
                            nodeData.id = id;
                            node = Ext.create('SDT.model.menuManagement.MenuTreeNodeModel', nodeData);
                            node.phantom = true;
                            node.internalId = id;
                            createdNode = startingNode.createNode(node);
                            startingNode.appendChild(createdNode, false, true); //Third argument needed for commit changes
                            Ext.create('SDT.view.menuManagement.forms.MenuManagementForm'); //Bring up menu dialog to allow user to further customize
                        }
                    },
                    icon: Ext.Msg.QUESTION
                });
            } else if (action === 'update') {
                foundRecord = startingNode.findChild('dashboardId', record.data.id, true);
                if (foundRecord) {
                    Ext.Msg.show({
                        title: 'Dashboard menu is out sync with current dashboard congfig',
                        msg: 'You may have made changes to the current dashboard that may not be in sync with what is displayed on the menu they may require you to update the information manually with them the "Dashboard Menu Management" tool. Would you like to do this now?',
                        buttons: Ext.Msg.YESNO,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                Ext.create('SDT.view.menuManagement.forms.MenuManagementForm'); //Bring up menu dialog to allow user to fix issues
                            }
                        },
                        icon: Ext.Msg.QUESTION
                    });
                }
            }
        } else {
            foundRecord = startingNode.findChild('dashboardId', record.data.id, true);
            if (foundRecord) {
                foundRecord.destroy({ action: 'destroy', params: { id: foundRecord.data.id } });
            }
        }
    },

    deleteDashboard: function (column, record, eventName, actionItem, grid, rowIndex) {
        var msg,
            tpl = Ext.create('Ext.XTemplate',
                '<p>Are you sure you want to delete this dashboard?</p>',
                '<tpl for="data">',
                '<p>',
                '<b>Title:</b> {title}<br>',
                '<b>Type:</b> {dataIndex}<br>',
                '<b>Create Date:</b> {createDate}<br>',
                '</p>',
                '</tpl>'
            );

        msg = tpl.apply(record);

        Ext.Msg.show({
            title: 'Confirm Delete',
            msg: msg,
            buttons: Ext.Msg.YESNO,
            fn: function (btn) {
                if (btn === 'yes') {
                    var store = grid.getStore();
                    store.remove(record);
                }
            },
            icon: Ext.Msg.QUESTION
        });
    },
    executeCloneDashboard: function (btn) {
        var me = this,
            form = btn.up('form').getForm(),
            formValues = form.getValues(),
            window = btn.up('window'),
            dashboard = form.getRecord(),
            store = me.getDashboardAdminDashboardsStoreStore(),
            callbackFn,
            proxy = store.getProxy();

        callbackFn = function (record, operation) {
            if (operation.success) {
                record.data.query = Ext.decode(record.data.query.slice(0, record.data.query.length));
                store.add(record);
                me.reloadDashboardMenu(record, 'create');
            }
            window.close();
        };

        //Override values with user specified title, description, and active
        dashboard.set('title', formValues.title);
        dashboard.set('description', formValues.description);

        formValues.active = formValues.active === null || formValues.active === undefined ? false : formValues.active;

        dashboard.set('active', formValues.active);

        dashboard.phantom = true;
        dashboard.setProxy(proxy);
        dashboard.save({ callback: callbackFn });

    },

    cloneDashboard: function (column, record, eventName, actionItem, grid) {
        var data = record.getData(),
            dt = new Date(),
            cloneDialog,
            dtStr = Ext.Date.format(dt, 'c'),
            dashboard;

        dtStr = dtStr.slice(0, dtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z

        data.modifiedDate = dtStr;
        data.createDate = dtStr;

        dashboard = Ext.create('SDT.model.dashboardAdmin.DashboardsModel', data);

        cloneDialog = Ext.create('SDT.view.dashboardAdmin.forms.DashboardCloneForm');
        cloneDialog.getForm().loadRecord(dashboard); //Pre populate dashboard data
        cloneDialog.show();

    },

    editDashboard: function (column, record, eventName, actionItem, grid) {
        var data = record.getData(),
            dashboardWizard,
            dashboardAdminView = this.getDashboardAdminView(),
            dataObj = {},
            createDtStr = Ext.Date.format(new Date(), 'c'),
            dtStr = Ext.Date.format(new Date(), 'c');

        dtStr = dtStr.slice(0, dtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z
        createDtStr = createDtStr.slice(0, createDtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z

        data.createDate = createDtStr; //Preserve create time
        data.modifiedDate = dtStr; //Update modified date

        data.userCriteriaFields = Ext.Array.pluck(record.userCriteriaFields().getRange(), 'data');

        console.log(data);

        Ext.Object.each(data, function (item, itemValue) {
            if (item === 'query') {
                Ext.Object.each(itemValue, function (queryItem, queryValue) {
                    dataObj[queryItem] = queryValue;
                });
            } else if (!Ext.isString(itemValue)) {
                dataObj[item] = Ext.encode(itemValue);
            } else {
                dataObj[item] = itemValue;
            }

        });

        dashboardWizard = Ext.create('SDT.view.dashboardAdmin.Dashboard' + record.get('type') + 'WizardPanel', { type: 'Edit' });

        //dashboardWizard = Ext.create('SDT.view.dashboardAdmin.DashboardWizardPanel', { type: 'Edit' });

        dashboardWizard.setTitle(Ext.String.format('{0} for "{1}"', dashboardWizard.initialConfig.headConfig.title, data.title));

        dashboardAdminView.add(dashboardWizard);
        dashboardAdminView.getLayout().setActiveItem(dashboardWizard);

        //Load data into individual forms on each card

        console.log(dataObj)

        Ext.Array.each(dashboardWizard.cards, function (card) {
            card.getForm().setValues(dataObj);
        });
    },

    searchDashboard: function (field, newValue, oldValue) {
        var me = this,
            store = me.getDashboardAdminDashboardsStoreStore(),
            callbackFn = function () {
                var re = new RegExp(field.getValue(), 'gim'),
                    matches = store.queryBy(function (record, id) {
                        if (record.get('description').match(re) ||
                            record.get('title').match(re)) {
                            return record;  // a record with this data exists
                        } else {
                            return null;
                        }
                    });

                store.removeAll();
                store.loadRecords(matches.getRange());
            };

        if (newValue === '') {
            store.load();
        } else if (typeof oldValue !== "undefined" && newValue.length < oldValue.length) {
            store.load({ callback: callbackFn });
        } else if (newValue && newValue.length >= 1) {
            callbackFn();
        }
    }
});