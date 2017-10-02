Ext.define('SDT.model.dashboardAdmin.FiltersModel', {
    extend: 'Ext.data.Model',
    idProperty: 'condition',
    identifier: 'sequential',
    fields: [
        'condition',
        'criteria',
        'fieldName',
        'fieldLabel',
        'type',
        'from',
        'to',
        'operator',
        'value'
    ]
});