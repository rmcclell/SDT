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
	'SDT.override.ActionColumn',
	'SDT.view.Viewport'
]);

Ext.application({
    name: 'SDT',
    autoCreateViewport: false,
    enableQuickTips: true,
    appFolder: 'app',
	init: function(){
		localStorage.setItem( 'activeProfile', 'default' );
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', { prefix: localStorage.getItem('activeProfile') + '-' }));

        Ext.state.Manager.set('defaultDashboardId', 'cats');


        var profiles = [{
            "name": "Profile 1",
            "active": true,
            "createDate": "2013-07-15T13:27:36Z",
            "modifiedDate": "2013-07-15T13:27:36Z"
        }]

        Ext.state.Manager.set('profiles', profiles);

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
            "id": "cats",
            "title": "Cats",
            "description": "Cats Description",
            "solrIndexId": 1,
            "dataIndex": "http://localhost:8983/solr/cats/",
            "type": "Connected",
            "defaultDashboard": true,
            "userCriteriaData": {
                "id": [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                    [11, 11],
                    [12, 12],
                    [13, 13],
                    [14, 14],
                    [15, 15],
                    [16, 16],
                    [17, 17],
                    [18, 18],
                    [19, 19],
                    [20, 20],
                    [21, 21],
                    [22, 22],
                    [23, 23],
                    [24, 24],
                    [25, 25],
                    [26, 26],
                    [27, 27],
                    [28, 28],
                    [29, 29],
                    [30, 30],
                    [31, 31],
                    [32, 32],
                    [33, 33],
                    [34, 34],
                    [35, 35],
                    [36, 36],
                    [37, 37],
                    [38, 38],
                    [39, 39],
                    [40, 40],
                    [41, 41],
                    [42, 42],
                    [43, 43],
                    [44, 44],
                    [45, 45],
                    [46, 46],
                    [47, 47],
                    [48, 48],
                    [49, 49],
                    [50, 50],
                    [51, 51],
                    [52, 52],
                    [53, 53],
                    [54, 54],
                    [55, 55],
                    [56, 56],
                    [57, 57],
                    [58, 58],
                    [59, 59],
                    [60, 60],
                    [61, 61],
                    [62, 62],
                    [63, 63],
                    [64, 64],
                    [65, 65],
                    [66, 66],
                    [67, 67],
                    [68, 68],
                    [69, 69],
                    [70, 70],
                    [71, 71],
                    [72, 72],
                    [73, 73],
                    [74, 74],
                    [75, 75],
                    [76, 76],
                    [77, 77],
                    [78, 78],
                    [79, 79],
                    [80, 80],
                    [81, 81],
                    [82, 82],
                    [83, 83],
                    [84, 84],
                    [85, 85],
                    [86, 86],
                    [87, 87],
                    [88, 88],
                    [89, 89],
                    [90, 90],
                    [91, 91],
                    [92, 92],
                    [93, 93],
                    [94, 94],
                    [95, 95],
                    [96, 96],
                    [97, 97],
                    [null, 0]
                ],
                "breed": [
                    ["Abyssinian", 1],
                    ["Aegean", 1],
                    ["American Bobtail", 1],
                    ["American Curl", 1],
                    ["American Shorthair", 1],
                    ["American Wirehair", 1],
                    ["Arabian Mau", 1],
                    ["Asian", 1],
                    ["Asian Semi-longhair", 1],
                    ["Australian Mist", 1],
                    ["Balinese", 1],
                    ["Bambino", 1],
                    ["Bengal", 1],
                    ["Birman", 1],
                    ["Bombay", 1],
                    ["Brazilian Shorthair", 1],
                    ["British Longhair", 1],
                    ["British Semi-longhair", 1],
                    ["British Shorthair", 1],
                    ["Burmese", 1],
                    ["Burmilla", 1],
                    ["California Spangled", 1],
                    ["Chantilly-Tiffany", 1],
                    ["Chartreux", 1],
                    ["Chausie", 1],
                    ["Cheetoh", 1],
                    ["Colorpoint Shorthair", 1],
                    ["Cornish Rex", 1],
                    ["Cymric,\nor Manx Longhair", 1],
                    ["Cyprus", 1],
                    ["Devon Rex", 1],
                    ["Donskoy,\nor Don Sphynx", 1],
                    ["Dragon Li", 1],
                    ["Dwarf cat,\nor Dwelf", 1],
                    ["Egyptian Mau", 1],
                    ["European Shorthair", 1],
                    ["Exotic Shorthair", 1],
                    ["FoldEx Cat (Official Breed - CCA/AFC) [1]", 1],
                    ["German Rex", 1],
                    ["Havana Brown", 1],
                    ["Highlander", 1],
                    ["Himalayan,\nor Colorpoint Persian", 1],
                    ["Japanese Bobtail", 1],
                    ["Javanese", 1],
                    ["Khao Manee", 1],
                    ["Korat", 1],
                    ["Korean Bobtail", 1],
                    ["Korn Ja", 1],
                    ["Kurilian Bobtail", 1],
                    ["Kurilian Bobtail,\nor Kuril Islands Bobtail", 1],
                    ["LaPerm", 1],
                    ["Lykoi", 1],
                    ["Maine Coon", 1],
                    ["Manx", 1],
                    ["Mekong Bobtail", 1],
                    ["Minskin", 1],
                    ["Munchkin", 1],
                    ["Napoleon", 1],
                    ["Nebelung", 1],
                    ["Norwegian Forest Cat", 1],
                    ["Ocicat", 1],
                    ["Ojos Azules", 1],
                    ["Oregon Rex", 1],
                    ["Oriental Bicolor", 1],
                    ["Oriental Longhair", 1],
                    ["Oriental Shorthair", 1],
                    ["PerFold Cat (Experimental Breed - WCF)", 1],
                    ["Persian (Modern Persian Cat)", 1],
                    ["Persian (Traditional Persian Cat)", 1],
                    ["Peterbald", 1],
                    ["Pixie-bob", 1],
                    ["Raas", 1],
                    ["Ragamuffin", 1],
                    ["Ragdoll", 1],
                    ["Russian Blue", 1],
                    ["Russian White, Black and Tabby", 1],
                    ["Sam Sawet", 1],
                    ["Savannah", 1],
                    ["Scottish Fold", 1],
                    ["Selkirk Rex", 1],
                    ["Serengeti", 1],
                    ["Serrade petit", 1],
                    ["Siamese", 1],
                    ["Siberian", 1],
                    ["Singapura", 1],
                    ["Snowshoe", 1],
                    ["Sokoke", 1],
                    ["Somali", 1],
                    ["Sphynx", 1],
                    ["Suphalak", 1],
                    ["Thai", 1],
                    ["Tonkinese", 1],
                    ["Toybob", 1],
                    ["Toyger", 1],
                    ["Turkish Angora", 1],
                    ["Turkish Van", 1],
                    ["Ukrainian Levkoy", 1],
                    [null, 0]
                ],
                "country": [
                    ["United States", 28],
                    ["Thailand", 7],
                    ["Russia", 6],
                    ["United Kingdom", 6],
                    ["Canada", 3],
                    ["France", 3],
                    ["Australia", 2],
                    ["United Kingdom (England)", 2],
                    ["United Kingdom (Isle of Man)", 2],
                    ["United Kingdom (Scotland)", 2],
                    ["developed in the\nUnited States\n(founding stock\nfrom Asia)", 2],
                    ["Arabian Peninsula", 1],
                    ["Brazil", 1],
                    ["Burma", 1],
                    ["Burma and Thailand", 1],
                    ["China", 1],
                    ["Cyprus", 1],
                    ["East Germany", 1],
                    ["Eastern Russia,\nJapan", 1],
                    ["Ethiopia", 1],
                    ["Europe", 1],
                    ["Greater Iran", 1],
                    ["Greece", 1],
                    ["Indonesia", 1],
                    ["Italy", 1],
                    ["Japan", 1],
                    ["Kenya", 1],
                    ["Nepal", 1],
                    ["Norway", 1],
                    ["Singapore", 1],
                    ["Somalia", 1],
                    ["South Korea", 1],
                    ["Sweden", 1],
                    ["Turkey", 1],
                    ["Ukraine", 1],
                    ["Western Russia", 1],
                    ["developed in the\nUnited Kingdom\n(founding stock\nfrom Asia)", 1],
                    ["developed in the\nUnited Kingdom\n(founding stock\nfrom Turkey)", 1],
                    ["developed in the\nUnited States\n(founding stock\nfrom Thailand)", 1],
                    [null, 6]
                ],
                "origin": [
                    ["Natural", 34],
                    ["Crossbreed", 23],
                    ["Mutation", 11],
                    ["Natural/Mutation", 5],
                    ["Hybrid", 3],
                    ["Hybrid Crossbreed", 2],
                    ["Natural/Standard", 2],
                    ["Crossbred", 1],
                    ["Experimental breed", 1],
                    ["Mutation/Cross", 1],
                    [null, 14]
                ],
                "bodyType": [
                    ["Cobby", 13],
                    ["Oriental", 7],
                    ["Moderate", 6],
                    ["Semi-Cobby", 3],
                    ["Stocky", 2],
                    ["Large", 1],
                    ["Lean and muscular", 1],
                    [null, 64]
                ],
                "coat": [
                    ["Short", 44],
                    ["Long", 12],
                    ["Short/Long", 8],
                    ["Semi-long", 7],
                    ["Rex", 6],
                    ["Hairless", 4],
                    ["All", 1],
                    ["Bicolor", 1],
                    ["Hairless/Furry down", 1],
                    ["Long/Short", 1],
                    ["Long/short", 1],
                    ["Medium", 1],
                    ["Partly Hairless", 1],
                    ["Rex (Short/Long)", 1],
                    ["Semi Long", 1],
                    ["Short/Hairless", 1],
                    [null, 6]
                ],
                "pattern": [
                    ["All", 22],
                    ["Solid", 12],
                    ["Colorpoint", 7],
                    ["Spotted", 7],
                    ["All but colorpoint", 6],
                    ["Ticked", 5],
                    ["All but colorpoint and ticked", 2],
                    ["Bi- or tri-colored", 1],
                    ["Classic tabby with ticking", 1],
                    ["Colorpoint/Mink/Solid", 1],
                    ["Colorpoint/Mitted/Bicolor", 1],
                    ["Colorprint", 1],
                    ["Colourpoint", 1],
                    ["Evenly solid", 1],
                    ["Hairless", 1],
                    ["Mackerel", 1],
                    ["Spotted and Classic tabby", 1],
                    ["Spotted/Marbled", 1],
                    ["Striped tabby", 1],
                    ["Van", 1],
                    ["Varied", 1],
                    [null, 22]
                ]
            },
            "active": true,
            "createDate": "2013-09-09T13:24:59Z",
            "modifiedDate": "2013-09-09T13:24:59Z",
            "query": {
                "criteria": "",
                "criteriaGrouping": "1",
                "filterGroupingType": "AND",
                "facet": "",
                "filters": "",
                "sorting": ""
            },
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
            "baseCriteria": []
        }
        ];

        Ext.state.Manager.set('dashboards', dashboards);
        //store = Ext.getStore('DashboardConfigStore');
        //store.loadRawData(dashboards);
    },
    stores: [
        'settingManager.SolrIndexesStore',
        'dashboard.DashboardConfigStore'
    ],
    controllers: [
        //Controllers get instantiated in the order listed here.
        'dashboard.DashboardController',
        'dashboard.SavedDashboardController',
        
		//'globalSearch.GlobalSearchController',
                
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
		'settingManager.ProfilesController',
		'settingManager.SolrIndexesController',
        
        'menuManagement.MenuManagementController'
    ],

    /* Main entry point */

    launch: function () {
        
		Ext.create('SDT.view.Viewport'); 
    }
});