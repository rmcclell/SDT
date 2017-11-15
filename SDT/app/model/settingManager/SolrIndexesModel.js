Ext.define('SDT.model.settingManager.SolrIndexesModel', {
    extend: 'Ext.data.Model', 
    requires: [
        'SDT.model.settingManager.FieldsModel'
    ],
    idProperty: 'id',
    fields: [
        'id',
        'name',
        'baseUrl',
        'adminUrl',
        'solrFields'
    ]/*,
    associations: [{
        type: 'hasMany',
        model: 'SDT.model.settingManager.FieldsModel',
        name: 'solrFields'
    }]
    */
});