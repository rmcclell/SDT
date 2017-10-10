Ext.define('SDT.view.dashboardAdmin.forms.AddEditSeriesForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditSeriesForm',
    layout: 'anchor',
    requires: [
        'SDT.view.dashboardAdmin.fields.ColorCombo'
    ],
    alias: 'widget.addEditSeriesForm',
    floating: true,
    closable: true,
    bodyPadding: 5,
    modal: true,
    type: 'Add',
    filterType: 'Base',
    frame: true,
    width: 600,
    initComponent: function () {
        var me = this;
        me.title = me.initType(me.type, me.filterType);
        me.callParent(arguments);
    },
    initType: function (type, filterType) {
        return type + ' Chart ' + filterType;
    },
    scrollable: true,
    trackResetOnLoad: true,
    defaults: { anchor: '100%', width: '100%', margin: 5, validateOnBlur: false },
    items: [{
            xtype: 'textfield',
            fieldLabel: 'Group',
            labelWidth: 45,
            hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
            name: 'group'
    }, {
        xtype: 'container',
        defaults: { validateOnBlur: false, labelWidth: 35 },
        layout: 'column',
        items: [{
            xtype: 'textfield',
            columnWidth: 0.75,
            fieldLabel: 'Series Label',
            labelWidth: 90,
            name: 'label'
        }, {
            xtype: 'colorCombo',
            margin: '0 0 0 10',
            columnWidth: 0.25
        }]
    }, {
        xtype: 'filtersGrid',
        title: 'Chart Series Filters',
        addFilterType: 'Series',
        minHeight: 180,
        flex: 1
    }, {
        xtype: 'fieldset',
        title: 'Filter Grouping Options',
        name: 'filterGroupingFieldset',
        height: 90,
        minWidth: 400,
        defaults: { validateOnBlur: false },
        layout: 'hbox',
        hidden: true,
        items: [{
            xtype: 'combo',
            width: 225,
            fieldLabel: 'Show results when',
            labelAlign: 'top',
            name: 'filterGroupingType',
            itemId: 'filterGroupingType',
            margin: '0 10 0 0',
            typeAhead: true,
            queryMode: 'local',
            forceSelection: true,
            value: 'AND',
            store: [['OR', 'ANY of the conditions above are met'], ['AND', 'ALL of the conditions above are met'], ['custom', 'Custom']],
            allowBlank: false
        }, {
            xtype: 'textfield',
            labelAlign: 'top',
            flex: 2,
            margin: '0 10 0 0',
            hidden: true,
            fieldLabel: 'Criteria Grouping',
            name: 'criteriaGrouping'
        },
        {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Apply Criteria Grouping',
            name: 'applyCriteriaGrouping',
            hidden: true
        }]
    }, {
        xtype: 'textarea',
        fieldLabel: 'Criteria',
        labelWidth: 90,
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'criteria',
        itemId: 'criteria'
    }, {
        xtype: 'textarea',
        labelWidth: 90,
        fieldLabel: 'Series Criteria',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'seriesCriteria'
    },
    {
        xtype: 'textarea',
        labelWidth: 90,
        fieldLabel: 'Chart Query',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'chartQuery'
    }],
    buttons: [{
        text: 'Add Series',
        itemId: 'applyBtn',
        formBind: true
    }, {
        text: 'Close',
        handler: function () {
            this.up('form').close();
        }
    }]
});