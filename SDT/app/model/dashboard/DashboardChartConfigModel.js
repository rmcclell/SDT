Ext.define('SDT.model.dashboard.DashboardChartConfigModel', {
    extend: 'Ext.data.Model',
	requires:[
		'SDT.model.dashboard.DashboardQueryConfigModel',
        'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel',
        'SDT.model.dashboard.DashboardBaseCriteriaConfigModel',
	],
    idProperty: 'chartid',
    identifier: 'uuid',
    fields: [
        'type',
        'title',
        'fieldName',
        'dataIndex',
        'fieldLabel',
        'facetQuery',
        'chartid',
        'seriesData',
        'dataSource',
        'facetField',
        'defaultFields',
        'query',
        'resultsPanel',
        'userCriteriaFields',
        'userCriteriaData',
        'baseCriteria'
    ],
    associations: [
        { type: 'hasOne', model: 'SDT.model.dashboard.DashboardQueryConfigModel', name: 'query' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});