Ext.define('SDT.model.dashboard.DashboardFieldValuesModel', {
    extend: 'Ext.data.Model',
    requires: [
        'SDT.model.dashboard.DashboardFieldValueModel'
    ],
	idProperty: 'dataIndex',
    fields: [
        'dataIndex',
        'defaultFields'
    ],
    associations: [
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardFieldValueModel', name: 'defaultFields', foreignKey: 'dataIndex' }
    ]
});