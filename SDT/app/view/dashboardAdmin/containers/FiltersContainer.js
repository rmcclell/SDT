Ext.define('SDT.view.dashboardAdmin.containers.FiltersContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.filtersContainer',
    layout: 'vbox',
    defaults: {
        width: '100%',
        margin: '5',
        validateOnBlur: false,
        validateOnChange: false
    },
    items: [{
        xtype: 'filtersGrid',
        margin: '20 5 20 5',
        collapsible: true,
        flex: 1,
        title: 'Filters',
        minHeight: 100
    }, {
        xtype: 'fieldset',
        title: 'Filter Grouping Options',
        name: 'filterGroupingFieldset',
        minWidth: 400,
        height: 90,
        defaults: {
            validateOnBlur: false
        },
        layout: 'hbox',
        hidden: true,
        items: [{
            xtype: 'combo',
            width: 225,
            fieldLabel: 'Show results when',
            labelAlign: 'top',
            name: 'filterGroupingType',
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
            fieldLabel: 'Criteria Grouping',
            name: 'criteriaGrouping',
            hidden: true
        }, {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Apply Criteria Grouping',
            name: 'applyCriteriaGrouping',
            hidden: true
        }]
    }, {
        xtype: 'previewGrid',
        collapsible: true,
        flex: 1,
        minHeight: 100
    }, {
        xtype: 'textarea',
        fieldLabel: 'Criteria',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'criteria'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Base Criteria',
        value: '[]',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'baseCriteria'
    }, {
        xtype: 'textfield',
        height: 90,
        fieldLabel: 'Sorting',
        name: 'sorting',
        hidden: true //Hidden for now until in use
    }, {
        xtype: 'textfield',
        height: 90,
        fieldLabel: 'Filters',
        name: 'filters',
        hidden: true //Hidden for now until in use
    }]
});