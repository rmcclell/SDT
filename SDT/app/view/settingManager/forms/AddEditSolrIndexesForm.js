Ext.define('SDT.view.settingManager.forms.AddEditSolrIndexesForm', {
    extend: 'Ext.form.Panel',
	requires:['SDT.view.settingManager.grids.SolrFieldsGridView'],
    alias: 'widget.addEditSolrIndexesForm',
    layout: 'anchor',
    floating: true,
    closable: true,
    modal: true,
    type: 'Add',
    height: 500,
    width: 600,
    initComponent: function () {
        var me = this;
        me.title = me.type + ' Solr Index';
        me.callParent(arguments);
    },
	scrollable: true,
    trackResetOnLoad: true,
    defaults: { anchor: '100%', margin: '10 5 10 5' },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        name: 'name',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Base Url',
        name: 'baseUrl',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Admin Url',
        name: 'adminUrl',
        allowBlank: false
    }, {
        xtype: 'solrFieldsGrid',
		height: 300
    }],
    buttons: [{
        text: 'Add',
		itemId: 'applyBtn',
        formBind: true, //only enabled once the form is valid
        disabled: true
    }, {
        text: 'Cancel',
        handler: function () {
            this.up('window').close();
        }
    }]
});