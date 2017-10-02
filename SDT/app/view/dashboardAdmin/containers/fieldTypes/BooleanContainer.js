Ext.define('SDT.view.dashboardAdmin.containers.fieldTypes.BooleanContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'SDT.component.combo.OperatorCombo'
    ],
    alias: 'widget.booleanContainer',
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
        hidden: true,
        name: 'operator',
        value: '=',
        labelAlign: 'left'
    }, {
        fieldLabel: 'Value',
        xtype: 'tagfield',
        name: 'value',
        queryMode: 'local',
        typeAhead: true,
        forceSelection: true,
        store: [['true', 'True'], ['false', 'False'], ['Not Set', 'Not Set']] //Combo stores now support two dimessional array first value is the valueField and the second is the displayField
    }]
});