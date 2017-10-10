//Will handled edit and add operation for filter selection section

Ext.define('SDT.view.dashboardAdmin.forms.AddEditFiltersForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditFiltersForm',
    closable: true,
    floating: true,
    modal: true,
    frame: true,
    type: 'Add',
    filterType: 'Base',
    width: 500,
    layout: 'anchor',
    scrollable: true,
    store: null,
    bodyPadding: 5,
    trackResetOnLoad: true,
    defaults: { anchor: '100%', validateOnBlur: false, labelWidth: 70 },
    initComponent: function () {
        var me = this;
        me.title = me.initType(me.type, me.filterType);
        me.callParent(arguments);
    },
    initType: function (type, filterType) {
        if (filterType === 'Base') {
            filterType = 'Chart';
        }
        return type + ' ' + filterType + ' Filter';
    },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Condition',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'condition'
    }, {
        xtype: 'combo',
        typeAhead: true,
        hasFocus: true,
        forceSelection: true,
        allowBlank: false, //Optional by design to allow filters that dont have values currently only works with fields that have blank strings Ex "" plans to add support for null also additional code will be needed to generate this q=-roleId%3A("") AND roleId:[* TO *]
        queryMode: 'local',
        fieldLabel: 'Field Name',
        name: 'fieldName',
        displayField: 'value',
        valueField: 'key',
        store: 'dashboardAdmin.FieldStore'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Field Label',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'fieldLabel'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Filter Type',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'type'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Criteria',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'criteria'
    }],
    buttons: [{
        text: 'Add',
        itemId: 'applyBtn',
        formBind: true
    }, {
        text: 'Close',
        handler: function () {
            this.up('form').close();
        }
    }]
});