Ext.define('SDT.store.dashboard.DashboardSavedUserCriteriaStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    fields: [
        'display',
        'value'
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});