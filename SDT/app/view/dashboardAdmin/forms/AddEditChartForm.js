﻿//Will handled edit and add operation for chart selection section

Ext.define('SDT.view.dashboardAdmin.forms.AddEditChartForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditChartForm',
    modal: true,
    frame: true,
    floating: true,
    closable: true,
    type: 'Add', //Add or Edit
    width: 800,
    layout: 'anchor',
    scrollable: true,
    bodyPadding: 5,
    initComponent: function () {
        var me = this;
        me.title = me.initType(me.type);
        me.callParent(arguments);
    },
    initType: function (type) {
        return type + ' Chart';
    },
    trackResetOnLoad: true,
    defaults: { anchor: '100%', validateOnBlur: false },
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Title',
        hasFocus: true,
        helpText: 'Define a title for your chart to use.',
        name: 'title',
        allowBlank: false
    }, {
        xtype: 'combo',
        fieldLabel: 'Data Source',
        name: 'dataSource',
        helpText: 'Select your data source field or query. Query allows you to customize your return chart with defined ranges. Field offer less customization and uses data as is to create chart',
        typeAhead: true,
        queryMode: 'local',
        forceSelection: true,
        allowBlank: false,
        store: [['FacetField', 'Field'], ['FacetQuery', 'Query']] //Combo stores now support two dimessional array first value is the valueField and the second is the displayField
    }, {
        xtype: 'combo',
        fieldLabel: 'Field Name',
        name: 'fieldName',
        hidden: true,
        helpText: 'Select a field name for your chart to collect its data from.',
        typeAhead: true,
        queryMode: 'local',
        forceSelection: true,
        allowBlank: true,
        displayField: 'value',
        valueField: 'key',
        store: 'dashboardAdmin.FieldStore'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Field Label',
        name: 'fieldLabel',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'combo',
        fieldLabel: 'Chart Type',
        name: 'type',
        helpText: 'Select your chart type pie or bar type.',
        typeAhead: true,
        queryMode: 'local',
        displayField: 'value',
        valueField: 'key',
        forceSelection: true,
        allowBlank: false,
        //TODO: Define store in store directory! Inline Creates are expensive!
        store: Ext.create('Ext.data.Store', {
            fields: ['value', 'key', 'iconCls'], //Date will eventually contain js date for date comparision
            data: [
                { value: 'Bar Chart', key: 'barChart', iconCls: 'icon-chart_bar' },
                { value: 'Column Chart', key: 'columnChart', iconCls: 'icon-chart_column' },
                { value: 'Pie Chart', key: 'pieChart', iconCls: 'icon-chart_pie' }
            ]
        }),
        listConfig: {
            // Custom rendering template for each item
            getInnerTpl: function () {
                return '<img class="x-grid-cell-icon {iconCls}" data-qtip="{value}" src="' + Ext.BLANK_IMAGE_URL + '"><span style="padding-left:15px;">{value}</span>';
            }
        }
    }, {
        xtype: 'textarea',
        fieldLabel: 'Facet Query',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facetQuery'
    }, {
        xtype: 'textarea',
        fieldLabel: 'Series Data',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'seriesData'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Facet Field',
        itemId: 'facetField',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        name: 'facetField'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Chart Id',
        name: 'chartid',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
    }, {
        xtype: 'seriesGrid',
        minHeight: 180,
        flex: 1,
        allowBlank: false,
        isValid: function () {
            return (!this.isHidden() && this.getStore().getCount() <= 0) ? false : true;
        },
        hidden: true
    }],
    buttons: [{
        text: 'Apply',
        itemId: 'applyBtn',
        formBind: true, //only enabled once the form is valid
        disabled: true
    }, {
        text: 'Close',
        handler: function () {
            this.up('form').close();
        }
    }]
});