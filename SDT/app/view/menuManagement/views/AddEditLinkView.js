Ext.define('SDT.view.menuManagement.views.AddEditLinkView', {
    alias: 'widget.addEditLinkView',
    extend: 'Ext.form.Panel',
    title: 'Link',
    floating: true,
    frame: true,
    closable: true,
    type: 'Add',
    node: undefined,
    autoShow: true,
    height: 160,
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
        allowBlank: false
    }, {
        fieldLabel: 'Tooltip',
        name: 'qtip',
        allowBlank: true
    }, {
        fieldLabel: 'URL',
        name: 'href',
        vtype: 'url',
        allowBlank: false
    }, {
        fieldLabel: 'Icon Class',
        name: 'iconCls',
        hidden: true,
        value: 'x-icon icon-application_link'
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