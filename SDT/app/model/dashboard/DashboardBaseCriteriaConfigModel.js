Ext.define('SDT.model.dashboard.DashboardBaseCriteriaConfigModel', {
    extend: 'Ext.data.Model',
    fields: [
        'name',
        'fieldName',
        'from',
        'to',
        'operator',
        'type',
        'condition',
        'value',
        'criteria',
        'fieldLabel'
    ]
});