Ext.define('SDT.model.dashboardAdmin.DashboardsModel', {
    extend: 'Ext.data.Model',
    identifier: 'uuid',
    idProperty: 'id',
    fields: [
        'id',
        'active',
        'baseCriteria',
        'charts',
        'dataIndex',
        {
            name: 'createDate',
            type: 'date',
            dateFormat: 'c'
        },
        { name: 'defaultDashboard', persist: false },
        'description',
        {
            name: 'modifiedDate',
            type: 'date',
            dateFormat: 'c'
        },
        'modifiedDate',
        'title',
        'userCriteriaData',
        'userCriteriaFields'
    ],
    associations: [
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardChartConfigModel', name: 'charts' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});