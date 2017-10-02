Ext.define('SDT.view.settingManager.forms.AddEditProfilesForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditProfilesForm',
    modal: true,
    floating: true,
    closable: true,
    type: 'Add',
    height: 150,
    width: 300,
    initComponent: function () {
        var me = this;
        me.title = me.type + ' Profile';
        me.callParent(arguments);
    },
    layout: 'anchor',
	scrollable: true,
    trackResetOnLoad: true,
    defaults: { anchor: '100%', margin: '10 5 10 5' },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        name: 'name',
        allowBlank: false
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Active',
        name: 'active'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Create Date',
        name: 'createDate',
		hidden: true,
		value: Ext.Date.format(new Date(), 'c'),
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Modifed Date',
        name: 'modifiedDate',
		hidden: true,
        value: Ext.Date.format(new Date(), 'c'),
		allowBlank: false
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