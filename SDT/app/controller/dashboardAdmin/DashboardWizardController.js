Ext.define('SDT.controller.dashboardAdmin.DashboardWizardController', {
    extend: 'Ext.app.Controller',
    uses: [
        'SDT.util.DateUtils'
    ],
    stores: [
        'dashboardAdmin.FieldStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'userCriteriaActions, filtersActions, chartsActions, seriesActions': {
                deleteItem: me.deleteItem
            },
            'addEditChartForm field[name="title"], addEditCriteriaSelectionForm field[name="name"], addEditChartForm addEditFiltersForm field[name="fieldName"], details field[name="title"]': {
                afterrender: me.setFieldFocus
            },
            'filtersGrid, previewGrid, chartsGrid, criteriaSelectionGrid, seriesGrid': {
                destroy: me.resetGridStore
            },
            'wizard': {
                beforeclose: me.returnToDashboardsGrid,
                finish: me.finishWizard
            },
            'addEditSeriesForm button#applyBtn, addEditChartForm button#applyBtn, addEditFiltersForm button#applyBtn, addEditUserCriteriaForm button#applyBtn': {
                beforerender: me.setApplyButtonText
            }
        });
    },
    refs: [{
        ref: 'dashboardsGrid',
        selector: 'dashboardsGrid'
    }, {
        ref: 'previewGrid',
        selector: 'previewGrid'
    }],

    setApplyButtonText: function (button) {
        var type = button.up('form').type;
        if (type === 'Add') {
            button.text = 'Add';
        } else if (type === 'Edit') {
            button.text = 'Save';
        } else {
            button.text = 'Apply';
        }
    },


    setFieldFocus: function (field) {
        //field.focus(true, 500);
    },

    deleteItem: function (column, record, eventName, actionItem, grid, rowIndex) {
        grid.getStore().removeAt(rowIndex);
    },

    resetGridStore: function (grid) {
        var store = grid.getStore();
        store.clearListeners('datachanged');
        store.removeAll();
        store.loadData([]);
    },

    finishWizard: function (panel, data) {
        var me = this,
            dataObj = (data.detailsCard.type === 'Connected') ? { query: {} } : {},
            store = Ext.getStore('DashboardConfigStore'),
            dashboard,
            callbackFn;

        Ext.Object.each(data, function (card, cardValue) {
            Ext.Object.each(cardValue, function (field, fieldValue) {
                fieldValue = (Ext.isFunction(fieldValue.charAt) && (fieldValue.charAt(0) === '{' || fieldValue.charAt(0) === '[')) ? Ext.decode(fieldValue) : fieldValue; //Only decode json data
                dataObj[field] = fieldValue;
            });
        });

        dataObj.title = Ext.String.trim(dataObj.title);
        dataObj.description = Ext.String.trim(dataObj.description);

        dataObj.active = dataObj.active === null || dataObj.active === undefined ? false : dataObj.active; //Unchecked checked checked boxes posting null instead of false

        if (panel.type === 'Add') {
            dashboard = Ext.create('SDT.model.dashboard.DashboardConfigModel', dataObj);
            //dashboard.phantom = (panel.type === 'Edit') ? false : true;
            store.add(dashboard);
        }

        //store.sync();

        Ext.state.Manager.set('dashboards', Ext.Array.pluck(store.getRange(), 'data'));

        panel.close();
    },

    initStores: function () {
        //Inititializes stores for wizard if preloading store is required

        var me = this,
            dashboardAdminFieldStore = me.getDashboardAdminFieldStoreStore();

        //Clear listeners that are dynamically created (only needed on memory proxy based stores, cause that is the only type that has dynamic events that I am managing)

        dashboardAdminFieldStore.clearListeners('load');

        //Remove previous data from stores loading on edits and showing on add operations

        dashboardAdminFieldStore.removeAll();
    },

    returnToDashboardsGrid: function (panel) {
        var me = this,
            previewGrid = me.getPreviewGrid(),
            dashboardAdminView = panel.up('dashboardAdminView'),
            dashboardsGrid = me.getDashboardsGrid();

        dashboardAdminView.getLayout().setActiveItem(dashboardsGrid);

        //Remove previous preview grid if it was rendered cause it is dynamically added and doesnt dispose correctly
        if (previewGrid) {
            previewGrid.destroy();
        }

        //Init stores to clear previous values

        me.initStores();
    }
});