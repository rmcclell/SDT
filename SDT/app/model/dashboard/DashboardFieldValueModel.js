Ext.define('SDT.model.dashboard.DashboardFieldValueModel', {
    extend: 'Ext.data.Model',
    idProperty: 'key',
    fields: [
        'key',
        'value',
        'type',
        'showInGrid'
    ]
});