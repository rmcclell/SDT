Ext.define('SDT.store.settingManager.SolrIndexesStore', {
    extend: 'Ext.data.Store',
    storeId: 'SolrIndexesStore',
    model: 'SDT.model.settingManager.SolrIndexesModel',
    proxy: {
        type: 'localstorage',
        id: 'default-solrIndexes'
    }
});