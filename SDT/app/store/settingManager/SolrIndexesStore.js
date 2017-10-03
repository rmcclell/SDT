Ext.define('SDT.store.settingManager.SolrIndexesStore', {
	extend: 'Ext.data.Store',
	model: 'SDT.model.settingManager.SolrIndexesModel',
    data: [{
        "id": 1,
        "name": "Cats",
        "baseUrl": "http://localhost:8983/solr/cats/",
        "adminUrl": "http://localhost:8983/solr/cats/admin",
        "solrFields": [
            {
                "key": "id",
                "value": "Id",
                "type": "string",
                "showInGrid": true

            },
            {
                "key": "breed",
                "value": "Breed",
                "type": "string",
                "showInGrid": true
            },
            {
                "key": "country",
                "value": "Country",
                "type": "string",
                "showInGrid": true
            },
            {
                "key": "origin",
                "value": "Origin",
                "type": "string",
                "showInGrid": true
            },
            {
                "key": "bodyType",
                "value": "Body Type",
                "type": "string",
                "showInGrid": true
            },
            {
                "key": "coat",
                "value": "Coat",
                "type": "string",
                "showInGrid": true
            },
            {
                "key": "pattern",
                "value": "Pattern",
                "type": "string",
                "showInGrid": true
            }
        ]
    }],
    proxy: {
        type: 'localstorage',
        id: 'solrIndexes'
    },
    load: function (options) {
        this.loadData(Ext.state.Manager.get('profiles'));
    }
});