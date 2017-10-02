//Will handled clone operation

Ext.define('SDT.view.dashboardAdmin.forms.DashboardCloneForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.dashboardCloneForm',
    title: 'Clone Dashboard',
    closable: true,
    modal: true,
    height: 200,
    width: 300,
    floating: true,
    layout: 'anchor',
    defaults: { anchor: '100%', margin: '10 5 10 5' },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Title',
        name: 'title',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: false
    }, {
        xtype: 'checkbox',
        fieldLabel: 'Active',
        name: 'active',
        inputValue: true
    }],
    buttons: [{
        text: 'Clone',
        formBind: true, //only enabled once the form is valid
        disabled: true
    }, {
        text: 'Cancel',
        handler: function () {
            this.up('form').close();
        }
    }]
});