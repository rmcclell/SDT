Ext.define('SDT.store.settingManager.ProfilesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.ProfilesModel',
	autoLoad: false,
	proxy: {
		type: 'localstorage',
		id  : 'profiles'
	}, 
	load: function(options) {
		this.loadData(Ext.state.Manager.get('profiles'));
	}
});