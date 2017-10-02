Ext.define('SDT.view.dashboardAdmin.containers.fieldTypes.NumericContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.numericContainer',
    layout: 'anchor',
    itemId: 'fieldBox',
    defaults: {
        labelWidth: 70,
        allowBlank: true,
        anchor: '100%'
    },
    items: [{
        xtype: 'operatorCombo',
        fieldLabel: 'Operator',
        name: 'operator',
        forceSelection: true,
        value: '=',
        allowBlank: false,
        labelAlign: 'left'
    }, {
        xtype: 'numberfield',
        name: 'from',
        fieldLabel: 'From'
    }, {
        xtype: 'numberfield',
        name: 'to',
        fieldLabel: 'To'
    }]
});