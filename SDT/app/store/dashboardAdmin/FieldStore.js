Ext.define('SDT.store.dashboardAdmin.FieldStore', {
    extend: 'Ext.data.Store',
	autoLoad: false,
    fields: [
        'key',
        'value',
        'type',
        'showInGrid'
    ],
    sorters: [{
        property: 'value',
        direction: 'ASC'
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        },
        simpleSortMode: true
    }
});