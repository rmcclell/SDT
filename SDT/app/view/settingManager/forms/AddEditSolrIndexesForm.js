Ext.define('SDT.view.settingManager.forms.AddEditSolrIndexesForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'SDT.view.settingManager.grids.SolrFieldsGridView'
    ],
    alias: 'widget.addEditSolrIndexesForm',
    layout: {
        type: 'vbox'
    },
    floating: true,
    frame: true,
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
    defaults: { width: '100%', margin: 10 },
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
        flex: 1
	}],
    buttons: [{
        text: 'Add',
		itemId: 'applyBtn',
        formBind: true, //only enabled once the form is valid
        disabled: true
    }, {
        text: 'Cancel',
        handler: function () {
            this.up('form').close();
        }
    }]
});