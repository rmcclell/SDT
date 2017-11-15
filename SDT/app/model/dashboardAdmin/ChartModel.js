Ext.define('SDT.model.dashboardAdmin.ChartModel', {
    extend: 'Ext.data.Model',
    idProperty: 'chartid',
    identifier: 'uuid',
    fields: [
        'type',
        'title',
        'fieldName',
        'fieldLabel',
        'facetQuery',
        'chartid',
        'seriesData',
        'dataSource',
        'facetField',
        'dataIndex',
        'query',
        'resultsPanel',
        'userCriteriaFields',
        'baseCriteria'
    ],
    associations: [
        { type: 'hasOne', model: 'SDT.model.dashboard.DashboardQueryConfigModel', name: 'query' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});