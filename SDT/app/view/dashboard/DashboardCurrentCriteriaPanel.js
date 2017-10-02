Ext.define('SDT.view.dashboard.DashboardCurrentCriteriaPanel', {
    alias: 'widget.dashboardCurrentCriteriaPanel',
    extend: 'Ext.panel.Panel',
    title: 'Base Criteria',
    height: 120,
    split: true,
    bodyPadding: 10,
    scrollable: true,
    collapsible: true,
    collapsed: true,
    layout: 'column',
    config: {
        context: undefined,
        stateId: undefined,
        savedSearchNameFieldId: undefined
    },
    defaults: {
        columnWidth: 1.0,
        labelAlign: 'top'
    },
    defaultType: 'textfield',
    initComponent: function () {
        var me = this;
        me.itemId = 'dashboardSavedSearchPanel';
        me.savedSearchNameFieldId = 'dashboardSavedSearchNameField';
        me.stateId = 'dashboardSavedSearch';
        me.callParent(arguments);
    },
    getSavedSearchListStore: function () {
        var me = this;
        return me.down('#dashboardSavedSearchList').store;
    }
});