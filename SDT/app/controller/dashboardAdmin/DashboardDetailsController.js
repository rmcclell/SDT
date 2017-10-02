Ext.define('SDT.controller.dashboardAdmin.DashboardDetailsController', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboardAdmin.cards.Details',
        'dashboardAdmin.containers.DetailsContainer'
    ],
    models: [
        'dashboardAdmin.DashboardsModel'
    ],
    stores: [
        'dashboardAdmin.DashboardsStore',
        'dashboardAdmin.FieldStore'
    ],
    init: function () {
        var me = this;
        me.control({
            'details detailsContainer field[name="dataIndex"], addEditIndependentChartForm field[name="dataIndex"]': {
                change: me.updateResultsPanelObj,
                beforerender: me.setDefaultValue
            },
            'details detailsContainer field[name="title"]': {
                beforerender: me.bindTitleFieldValidator
            }
        });
    },
    refs: [],
    bindTitleFieldValidator: function (field) {
        var store = this.getDashboardAdminDashboardsStoreStore();

        //Create custom validator to check if title is already taken bound at runtime to allow access to dashboard store
        field.validator = function (text) {
            var me = this,
                trimText = Ext.util.Format.trim(text),
                foundRecord = (Ext.isEmpty(me.originalValue) || me.originalValue !== trimText) ? store.findRecord('title', trimText, 0, false, false, true) : null;

            me.setActiveErrors(Ext.Array.unique(me.getActiveErrors()));

            if (me.allowBlank === false && trimText.length === 0) {
                return me.blankText; //Validate textfield with just white space as false
            } else if (foundRecord) {
                return Ext.String.format('"{0}" already exists title must be one that is unique.', trimText); //Validate if title is already in use
            } else {
                return true;
            }
        };
    },

    setDefaultValue: function (combo) {
        combo.getStore().loadData(Ext.state.Manager.get('solrIndexes'));
    },

    updateResultsPanelObj: function (combo, newValue, oldValue) {
        var resultsPanel = combo.up('form').getForm().findField('resultsPanel'), resultsPanelObj;

        resultsPanelObj = { type: '', titlePrefix: 'Results', exportable: true, namespace: 'DashboardRowResultsGrid' };
        resultsPanel.setValue(Ext.encode(resultsPanelObj));
        this.loadFieldStore(newValue);
    },

    loadFieldStore: function (dataIndex) {
        var me = this,
            store = me.getDashboardAdminFieldStoreStore();

        store.getProxy().extraParams = {
            dataIndex: dataIndex
        };

        store.load();
    }

});