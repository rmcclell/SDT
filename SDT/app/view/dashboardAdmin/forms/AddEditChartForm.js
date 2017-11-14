//Will handled edit and add operation for chart selection section

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
        name: 'title',
        allowBlank: false
    }, {
        xtype: 'combo',
        fieldLabel: 'Data Source',
        name: 'dataSource',
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
                { value: 'Bar Chart', key: 'barChart', iconCls: 'fa-bar-chart' },
                { value: 'Column Chart', key: 'columnChart', iconCls: 'fa-column-chart' },
                { value: 'Pie Chart', key: 'pieChart', iconCls: 'fa-pie-chart' }
            ]
        }),
        listConfig: {
            // Custom rendering template for each item
            getInnerTpl: function () {
                return '<i class="fa {iconCls}" data-qtip="{value}"></i><span style="padding-left:15px;">{value}</span>';
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