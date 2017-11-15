Ext.define('SDT.controller.dashboardAdmin.DashboardAdminController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.DashboardWizardPanel',
        'dashboardAdmin.DashboardsGrid',
        'dashboardAdmin.forms.DashboardCloneForm'
    ],
    init: function () {
        var me = this;
        me.control({
            'dashboardsGrid': {
                beforerender: me.bindDashboardStoreEvents,
                afterrender: me.loadDashboardGrid
            },
            'dashboardsGrid > toolbar > button#refresh': {
                click: me.loadDashboardGrid
            },
            'dashboardsGrid > toolbar > button#createDashboardBtn': {
                click: me.createDashboard
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

        dashboard = Ext.create('SDT.model.dashboard.DashboardConfigModel', data);

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
        data.charts = Ext.Array.pluck(record.charts().getRange(), 'data');

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

        dashboardWizard = Ext.create('SDT.view.dashboardAdmin.DashboardWizardPanel', { type: 'Edit' });
        
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
    },
    createDashboard: function (btn) {
        var dashboardAdminView = this.getDashboardAdminView(),
            dtStr = Ext.Date.format(new Date(), 'c'),
            dashboardWizardPanel = Ext.create('SDT.view.dashboardAdmin.DashboardWizardPanel', { type: 'Add' }),
            newDashboardDetailsForm = dashboardWizardPanel.down('details').getForm(),
            modifiedDate = newDashboardDetailsForm.findField('modifiedDate'),
            createDate = newDashboardDetailsForm.findField('createDate');

        dashboardAdminView.getLayout().setActiveItem(dashboardWizardPanel);

        dtStr = dtStr.slice(0, dtStr.lastIndexOf('-')) + '.500Z'; //Add milliseconds to timestamp so timestamp uses strict iso 8601 ex date 2012-12-27T00:05:49.826Z

        modifiedDate.setRawValue(dtStr);
        createDate.setRawValue(dtStr);
    }
});