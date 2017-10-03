Ext.define('SDT.model.settingManager.FieldsModel', {
    extend: 'Ext.data.Model', 
    idProperty: 'key',
    fields: [
		{ name: 'key' },
		{ name: 'value' },
		{ name: 'type' },
		{ name: 'showInGrid', defaultValue: true, type:'boolean' }
    ],
    belongTo: 'SolrIndexesModel'
});