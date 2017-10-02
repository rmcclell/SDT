Ext.define('SDT.view.dashboardAdmin.grids.ChartUserCriteriaGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.chartUserCriteriaGrid',
    store: 'dashboardAdmin.UserCriteriaStore',
    hideHeaders: true,
    reqires: [
        'SDT.store.dashboardAdmin.UserCriteriaStore'
    ],
    height: 300,
    viewConfig: {
        emptyText: '<b align="center">No User Criteria Defined</b>',
        deferEmptyText: true,
        loadMask: true
    },
    title: 'Chart User Criteria',
    singleSelect: true,
    columns: [{
        text: 'Field Label',
        dataIndex: 'fieldLabel',
        flex: 1
    }]
});