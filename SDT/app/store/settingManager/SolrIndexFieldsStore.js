Ext.define('SDT.store.settingManager.SolrIndexFieldsStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.SolrIndexFieldsModel',
	proxy: {
		type: 'ajax',
		url: '/data/mock/sampleSolr.xml',
		reader: {
			type: 'xml',
			record: 'field',
			rootProperty: 'fields'
		}
	}
});