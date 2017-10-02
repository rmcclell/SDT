Ext.define('SDT.view.menuManagement.views.AddEditDashboardView', {
    alias: 'widget.addEditDashboardView',
    extend: 'Ext.form.Panel',
    floating: true,
    closable: true,
    frame: true,
    trackResetOnLoad: true,
    bodyPadding: 5,
    node: undefined,
    title: 'Dasboard',
    type: 'Add',
    autoShow: true,
    height: 160,
    width: 400,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = Ext.String.format('{0} {1}', me.type, me.title);
        me.callParent(arguments);
    },
    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        labelWidth: 70,
        anchor: '100%'
    },

    // The fields
    defaultType: 'textfield',
    items: [{
        fieldLabel: 'Dashboard',
        allowBlank: false,
        xtype: 'combo',
        name: 'dashboardId',
        queryMode: 'local',
        typeAhead: true,
        displayField: 'title',
        valueField: 'id',
        store: 'dashboard.DashboardListsStore'
    }, {
        fieldLabel: 'Text',
        name: 'text',
        selectOnFocus: true,
        allowBlank: false
    }, {
        fieldLabel: 'Tooltip',
        name: 'qtip',
        allowBlank: true
    }, {
        fieldLabel: 'Icon Class',
        name: 'iconCls',
        hidden: true,
        value: 'x-icon icon-server_chart'
    }],

    // Reset and Submit buttons
    buttons: [{
        text: 'Apply',
        itemId: 'applyBtn',
        formBind: true //only enabled once the form is valid
    }, {
        text: 'Cancel',
        itemId: 'cancelBtn'
    }]
});