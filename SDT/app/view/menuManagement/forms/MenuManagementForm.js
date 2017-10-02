Ext.define('SDT.view.menuManagement.forms.MenuManagementForm', {
    extend: 'Ext.form.Panel',
    requires: [
        'SDT.view.menuManagement.tree.MenuTreeConfig'
    ],
    alias: 'widget.menuManagementForm',
    floating: true,
    closable: true,
    autoShow: true,
    modal: true,
    height: 600,
    width: 800,
    layout: 'fit',
    scrollable: true,
    trackResetOnLoad: true,
    items: [{
        xtype: 'menuTreeConfig'
    }],
    buttons: [{
        text: 'Apply',
        itemId: 'applyBtn',
        formBind: true, //only enabled once the form is valid
        disabled: true
    }, {
        text: 'Cancel',
        itemId: 'cancelBtn'
    }]
});