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
        'rangeData', //For existing dashboards to be phased out
        {name: 'seriesData', convert: function (val, record) {
            return (Ext.isEmpty(val)) ? record.data.rangeData : val; //Temp till legacy dashboards migrated
        } },
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
        { type: 'hasOne', model: 'SDT.model.dashboard.DashboardResultsPanelConfigModel', name: 'resultsPanel' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});