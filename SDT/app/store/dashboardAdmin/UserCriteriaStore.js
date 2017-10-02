Ext.define('SDT.store.dashboardAdmin.UserCriteriaStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.UserCriteriaModel',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});