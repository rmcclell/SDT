Ext.define('SDT.store.settingManager.ProfilesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.ProfilesModel',
    autoLoad: false,
    data: [{
        "name": "Profile 1",
        "active": true,
        "createDate": "2013-07-01T04:27:22Z",
        "modifiedDate": "2013-07-15T13:27:36Z"
    }],
	proxy: {
		type: 'localstorage',
		id  : 'profiles'
	}, 
	load: function(options) {
		this.loadData(Ext.state.Manager.get('profiles'));
	}
});