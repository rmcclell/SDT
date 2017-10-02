Ext.define('SDT.store.dashboard.DashboardCriteriaFilterStore', {
    extend: 'Ext.data.ArrayStore',
    fields: [
        'fieldName',
        'count'
    ],
    proxy: {
        type: 'memory'
    },
    data: []
});