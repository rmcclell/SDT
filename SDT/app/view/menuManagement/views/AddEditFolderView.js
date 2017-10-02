Ext.define('SDT.view.menuManagement.views.AddEditFolderView', {
    alias: 'widget.addEditFolderView',
    extend: 'Ext.form.Panel',
    title: 'Folder',
    autoShow: true,
    frame: true,
    floating: true,
    closable: true,
    node: undefined,
    type: 'Add',
    height: 140,
    width: 400,
    bodyPadding: 5,
    
    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        labelWidth: 70,
        anchor: '100%'
    },

    // The fields
    defaultType: 'textfield',
    items: [{
        fieldLabel: 'Text',
        name: 'text',
        allowBlank: true
    }, {
        fieldLabel: 'Tooltip',
        name: 'qtip',
        allowBlank: true
    }, {
        fieldLabel: 'Icon Class',
        name: 'iconCls',
        hidden: true,
        value: 'x-icon icon-tabs'
    }],

    // Reset and Submit buttons
    buttons: [{
        text: 'Apply',
        itemId: 'applyBtn',
        formBind: true //only enabled once the form is valid
    }, {
        text: 'Cancel',
        itemId: 'cancelBtn'
    }],
    initComponent: function () {
        var me = this;
        me.title = Ext.String.format('{0} {1}', me.type, me.title);
        me.callParent(arguments);
    }
});