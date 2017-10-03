Ext.define('SDT.store.settingManager.SolrIndexesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.SolrIndexesModel',
	proxy: {
		type: 'memory',
        reader: {
            type: 'json'
        }
	}
});