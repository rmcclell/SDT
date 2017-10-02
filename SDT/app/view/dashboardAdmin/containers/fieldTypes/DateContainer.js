Ext.define('SDT.view.dashboardAdmin.containers.fieldTypes.DateContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'SDT.component.combo.OperatorCombo',
        'SDT.view.dashboardAdmin.fields.DateToFromCombo'
    ],
    alias: 'widget.dateContainer',
    layout: 'anchor',
    itemId: 'fieldBox',
    defaults: {
        labelWidth: 70,
        allowBlank: false,
        anchor: '100%'
    },
    items: [{
        xtype: 'operatorCombo',
        fieldLabel: 'Operator',
        name: 'operator',
        value: '=',
        labelAlign: 'left'
    }, {
        xtype: 'dateToFromCombo',
        fieldLabel: 'From',
        name: 'from'
    }, {
        xtype: 'dateToFromCombo',
        fieldLabel: 'To',
        name: 'to'
    }]
});