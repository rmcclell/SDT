Ext.define('SDT.store.settingManager.SolrIndexesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.SolrIndexesModel',
	autoLoad: false,
	proxy: {
		type: 'memory',
        reader: {
            type: 'json'
        }
	}
});