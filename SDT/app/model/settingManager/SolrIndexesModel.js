Ext.define('SDT.model.settingManager.SolrIndexesModel', {
    extend: 'Ext.data.Model', 
    requires: [
        'SDT.model.settingManager.FieldsModel'
    ],
    fields: [
        'name',
        'baseUrl',
        'adminUrl'
    ],
    associations: [{
        type: 'hasMany',
        model: 'SDT.model.settingManager.FieldsModel',
        name: 'solrFields'
    }]
});