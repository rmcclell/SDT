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
		
		
		Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', { prefix: localStorage.getItem('activeProfile') +'-' } ));

        Ext.state.Manager.set('defaultDashboardId', 'cats');
		
		Ext.Ajax.request({
			url: '/data/mock/settingManager/Profiles.json',
			success: function(response){
				var data = Ext.decode(response.responseText);
				Ext.state.Manager.set('profiles', data);
			}
        });

        Ext.Ajax.request({
            url: '/data/mock/settingManager/SolrIndexes.json',
            success: function (response) {
                var store = Ext.StoreManager.lookup('settingManager.SolrIndexesStore');
                var data = Ext.decode(response.responseText);
                Ext.state.Manager.set('solrIndexes', data);
                store.loadRawData(data);
            }
        });

        

		Ext.Ajax.request({
            url: '/data/mock/dashboard/' + Ext.state.Manager.get('defaultDashboardId') + '/DashboardConnectedConfig.json',
			success: function(response){
				var data = Ext.decode(response.responseText);
				Ext.state.Manager.set('dashboards', data);
			}
		});
	},
    controllers: [
        //Controllers get instantiated in the order listed here.
        'dashboard.DashboardController',
        'dashboard.SavedDashboardController',
        
		//'globalSearch.GlobalSearchController',
                
		'ViewportController',
        
        'dashboardAdmin.DashboardAdminController',
        'dashboardAdmin.DashboardWizardController',
        'dashboardAdmin.DashboardConnectedWizardController',
        'dashboardAdmin.DashboardIndependentWizardController',

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