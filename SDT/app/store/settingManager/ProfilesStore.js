Ext.define('SDT.store.settingManager.ProfilesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.ProfilesModel',
    autoLoad: true,
	proxy: {
		type: 'localstorage',
		id  : 'default-profiles'
	}
});