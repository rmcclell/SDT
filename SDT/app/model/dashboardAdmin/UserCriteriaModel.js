Ext.define('SDT.model.dashboardAdmin.UserCriteriaModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    identifier: 'uuid',
    fields: [
        { name: 'id', persist: false },
        'name',
        'fieldLabel',
        'operatorType'
    ]
});