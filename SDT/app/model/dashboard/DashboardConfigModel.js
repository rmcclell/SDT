Ext.define('SDT.model.dashboard.DashboardConfigModel', {
    extend: 'Ext.data.Model',
    requires: [
		'SDT.model.dashboard.DashboardChartConfigModel',
        'SDT.model.dashboard.DashboardFieldValuesModel',
        'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel',
        'SDT.model.dashboard.DashboardBaseCriteriaConfigModel'
	],
    uses: ['SDT.util.DateUtils'],
    identifier: 'uuid',
    idProperty: 'id',
    proxy: {
        type: 'localstorage',
        id: 'dashboards'
    },
    fields: [
        'id',
        'title',
        'description',
        'solrIndexId',
        'dataIndex',
        {
            name: 'createDate',
            type: 'date',
            dateFormat: 'c',
            convert: function (v, record) {
                return SDT.util.DateUtils.convertGridDate(v, record);
            }
        },
        {
            name: 'modifiedDate',
            type: 'date',
            dateFormat: 'c',
            convert: function (v, record) {
                return SDT.util.DateUtils.convertGridDate(v, record);
            } 
        },
        'active',
        'charts',
        'criteria',
        'userCriteriaFields',
        'baseCriteria'
	],
    associations: [
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardChartConfigModel', name: 'charts' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardUserCriteriaFieldConfigModel', name: 'userCriteriaFields' },
        { type: 'hasMany', model: 'SDT.model.dashboard.DashboardBaseCriteriaConfigModel', name: 'baseCriteria' }
    ]
});