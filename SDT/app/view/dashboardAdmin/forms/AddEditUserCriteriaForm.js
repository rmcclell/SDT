//Will handled edit and add operation for user critieria section

Ext.define('SDT.view.dashboardAdmin.forms.AddEditUserCriteriaForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditUserCriteriaForm',
    layout: 'anchor',
    trackResetOnLoad: true,
    floating: true,
    closable: true,
    scrollable: true,
    modal: true,
    type: 'Add', //Add or Edit
    height: 150,
    width: 325,
    initComponent: function () {
        var me = this;
        me.title = me.initType(me.type);
        me.callParent(arguments);
    },
    initType: function (type) {
        return type + ' Criteria';
    },
    defaults: { anchor: '100%', margin: 5, validateOnBlur: false },
    items: [{
        xtype: 'combo',
        fieldLabel: 'Field Name',
        name: 'name',
        hasFocus: true,
        typeAhead: true,
        forceSelection: true,
        queryMode: 'local',
        allowBlank: false,
        displayField: 'value',
        valueField: 'key',
        store: 'dashboardAdmin.FieldStore'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Field Label',
        name: 'fieldLabel',
        allowBlank: false
    }, {
        xtype: 'hidden',
        hidden: true,
        fieldLabel: 'Operator',
        name: 'operatorType',
        value: 'equals'
    }],
    buttons: [{
        text: 'Apply',
        itemId: 'applyBtn',
        formBind: true
    }, {
        text: 'Close',
        handler: function () {
            this.up('form').close();
        }
    }]
});