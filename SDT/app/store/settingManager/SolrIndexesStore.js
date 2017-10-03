Ext.define('SDT.store.settingManager.SolrIndexesStore', {
	extend: 'Ext.data.Store',
    model: 'SDT.model.settingManager.SolrIndexesModel',
    proxy: {
        type: 'localstorage',
        id: 'default-solrIndexes'
    },
    load: function (data) {
        this.loadRawData(data);
    }
});