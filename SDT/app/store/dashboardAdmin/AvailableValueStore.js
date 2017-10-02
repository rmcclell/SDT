Ext.define('SDT.store.dashboardAdmin.AvailableValueStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.AvailableValueModel',
    proxy: {
        type: 'ajax',
        api: {
            read: 'http://localhost:8983/solr/cats/select'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        },
        actionMethods: {
            read: 'POST'
        },
        jsonData: true
    }
});