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
        'resultsPanel',
        'userCriteriaFields',
        'baseCriteria'
    ],
    associations: [
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});