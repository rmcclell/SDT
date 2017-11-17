Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
    dismissDelay: 0
});

Ext.setGlyphFontFamily('FontAwesome');
Ext.enableAriaButtons = false;

Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'SDT': 'app',
        'Ext.ux': 'app/ux'
	}
});

Ext.require([
    'SDT.util.GLOBALS',
    'SDT.util.DateUtils',
    'SDT.util.UtilFunctions',
	'SDT.view.Viewport'
]);

Ext.application({
    name: 'SDT',
    autoCreateViewport: false,
    enableQuickTips: true,
    appFolder: 'app',
	init: function(){
		Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', { prefix: '' }));

        Ext.state.Manager.set('defaultDashboardId', '764b6a31-05a9-4ba8-85ce-fd9199f7fd5f');

        var solrIndexes = [{
            "id": 1,
            "name": "Cats",
            "solrFields": [{
                "key": "id",
                "value": "Id",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "breed",
                "value": "Breed",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "country",
                "value": "Country",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "origin",
                "value": "Origin",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "bodyType",
                "value": "Body Type",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "coat",
                "value": "Coat",
                "type": "string",
                "showInGrid": true
            }, {
                "key": "pattern",
                "value": "Pattern",
                "type": "string",
                "showInGrid": true
            }],
            "baseUrl": "http://localhost:8983/solr/cats/",
            "adminUrl": "http://localhost:8983/solr/cats/admin"
        }];
        console.log(solrIndexes);

        Ext.state.Manager.set('solrIndexes', solrIndexes);

        var store = Ext.getStore('SolrIndexesStore');
        store.loadRawData(solrIndexes);

        var dashboards = [{
            "id": "764b6a31-05a9-4ba8-85ce-fd9199f7fd5f",
            "title": "Cats",
            "description": "Cats Description",
            "solrIndexId": 1,
            "dataIndex": "http://localhost:8983/solr/cats/",
            "defaultDashboard": true,
            "userCriteriaData": {
                "id": [],
                "breed": [],
                "country": [],
                "origin": [],
                "bodyType": [],
                "coat": [],
                "pattern": []
            },
            "active": true,
            "createDate": "2013-09-09T13:24:59Z",
            "modifiedDate": "2013-09-09T13:24:59Z",
            "charts": [
                { "title": "Coat", "dataSource": "FacetField", "fieldName": "coat", "fieldLabel": "Coat", "type": "columnChart", "facetQuery": "", "seriesData": "", "facetField": "coat", "chartid": "3d2c8ed2-aa75-4333-a8d3-6fa4a196c343" },
                { "title": "Coat", "dataSource": "FacetField", "fieldName": "coat", "fieldLabel": "Coat", "type": "pieChart", "facetQuery": "", "seriesData": "", "facetField": "coat", "chartid": "3d2c8ed2-aa75-4333-a8d3-6fa4a196c342" },
                { "title": "Coat", "dataSource": "FacetField", "fieldName": "coat", "fieldLabel": "Coat", "type": "barChart", "facetQuery": "", "seriesData": "", "facetField": "coat", "chartid": "3d2c8ed2-aa75-4333-a8d3-6fa4a196c341" }
            ],
            "userCriteriaFields": [
                {
                    "fieldLabel": "Id",
                    "name": "id",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Bread",
                    "name": "breed",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Country",
                    "name": "country",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Origin",
                    "name": "origin",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Body Type",
                    "name": "bodyType",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Coat",
                    "name": "coat",
                    "operatorType": "equals"
                },
                {
                    "fieldLabel": "Pattern",
                    "name": "pattern",
                    "operatorType": "equals"
                }
            ],
            "baseCriteria": [{
                "name": "country",
                "fieldName": "country",
                "from": "",
                "to": "",
                "operator": "=",
                "type": "Text",
                "condition": 1,
                "value": "United States",
                "criteria": "country%3A(%5B%22United%20States%22%20TO%20%22United%20States%22%5D)",
                "fieldLabel": "Country"
            }]
        }
        ];

        Ext.state.Manager.set('dashboards', dashboards);
        store = Ext.getStore('DashboardConfigStore');
        store.loadRawData(Ext.state.Manager.get('dashboards'));
    },
    stores: [
        'settingManager.SolrIndexesStore',
        'dashboard.DashboardConfigStore'
    ],
    controllers: [
        //Controllers get instantiated in the order listed here.
        'dashboard.DashboardController',
        'dashboard.SavedDashboardController',
        
		'ViewportController',
        
        'dashboardAdmin.DashboardAdminController',
        'dashboardAdmin.DashboardWizardController',
        
        'dashboardAdmin.DashboardDetailsController',
        'dashboardAdmin.DashboardUserCriteriaController',
        'dashboardAdmin.DashboardFiltersController',
        'dashboardAdmin.DashboardChartsController',
        'dashboardAdmin.DashboardSeriesController',
        'dashboardAdmin.DashboardSaveController',

        'settingManager.SettingManagerController',
		'settingManager.DisplayController',
		'settingManager.PreferencesController',
		'settingManager.SolrIndexesController'
    ],

    /* Main entry point */

    launch: function () {
        
		Ext.create('SDT.view.Viewport'); 
    }
});