Ext.define('SDT.component.combo.OperatorCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.operatorCombo',
    shrinkWrap: 0,
    width: 50,
    typeAhead: true,
    typeAheadDelay: 0, //Because store is loaded with static data inline, it can respond instantly
    listConfig: {
        minWidth: 50,
        maxWidth: 50,
        width: 50
    },
    store: [['=', '='], ['<>', '<>']], //Combo stores now support two dimessional array first value is the valueField and the second is the displayField
    value: '=',
    fieldLabel: 'Op',
    labelAlign: 'top',
    queryMode: 'local',
    //Override default template to correctly size blank combo item
    tpl: [
        '<tpl for=".">',
            '<li style="height:22px;" class="x-boundlist-item" role="option">',
                '{field1}',
            '</li>',
        '</tpl>'
    ],
    forceSelection: true
});