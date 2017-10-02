Ext.define('SDT.model.settingManager.SolrIndexFieldsModel', {
    extend: 'Ext.data.Model',
    idProperty: 'key',
	fields: [
		{ name: 'key', mapping: '@name' },
		{ name: 'value', mapping: '@name' },
		{ name: 'type', mapping: '@type' },
		{ name: 'showInGrid', defaultValue: true, type:'boolean' }
	]
});