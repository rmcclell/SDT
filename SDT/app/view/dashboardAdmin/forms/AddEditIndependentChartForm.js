//Will handled edit and add operation for chart selection section

Ext.define('SDT.view.dashboardAdmin.forms.AddEditIndependentChartForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addEditIndependentChartForm',
    floating: true,
    closable: true,
    modal: true,
    type: 'Add', //Add or Edit
    height: 600,
    width: 800,
    layout: 'fit',
    scrollable: true,
    initComponent: function () {
        var me = this;
        me.title = me.initType(me.type);
        me.callParent(arguments);
    },
    initType: function (type) {
        return type + ' Chart';
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'tabpanel',
        items: [{
            title: 'Title',
            layout: 'anchor',
            defaults: { anchor: '100%', margin: 5 },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Chart Id',
                name: 'chartid',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
            }, {
                xtype: 'textfield',
                fieldLabel: 'Title',
                hasFocus: true,
                helpText: 'Define a title for your chart to use.',
                name: 'title',
                allowBlank: false
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
                        return '<img class="x-icon {iconCls}" data-qtip="{value}" src="' + Ext.BLANK_IMAGE_URL + '"><span style="padding-left:15px;">{value}</span>';
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: 'Results Panel',
                name: 'resultsPanel',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
            }, {
                xtype: 'combo',
                fieldLabel: 'Data Source',
                helpText: 'Please provide the data source for your dashboard.',
                itemId: 'dataIndex',
                name: 'dataIndex',
                forceSelection: true,
                typeAhead: true,
                queryMode: 'local',
				store: 'SolrIndexesStore',
                displayField: 'name',
				valueField: 'baseUrl',
				allowBlank: false
            },
            {
                xtype: 'textfield',
                itemId: 'query',
                fieldLabel: 'Query',
                name: 'query',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
            }]
        }, {
            title: 'Filters',
            itemId: 'filtersTab',
            layout: 'fit',
            items: [{ xtype: 'filtersContainer'}]
        }, {
            title: 'Series',
            layout: 'vbox',
            defaults: { width: '100%', margin: 5 },
            items: [{
                xtype: 'combo',
                fieldLabel: 'Series Type',
                name: 'dataSource',
                helpText: 'Select your series type: field or query. Query allows you to customize your return chart with defined ranges. Field offer less customization and uses data as is to create chart',
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
                xtype: 'seriesGrid',
                minHeight: 180,
                flex: 1,
                title: 'Chart Series',
                allowBlank: false,
                isValid: function () {
                    return (!this.isHidden() && this.getStore().getCount() <= 0) ? false : true;
                },
                hidden: true
            },   {
                xtype: 'textfield',
                fieldLabel: 'Field Label',
                name: 'fieldLabel',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD
            }, {
                xtype: 'textfield',
                fieldLabel: 'Facet Field',
                itemId: 'facetField',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
                name: 'facetField'
            }, {
                xtype: 'textarea',
                fieldLabel: 'Facet Query',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
                name: 'facetQuery',
                itemId: 'facetQuery'
            }, {
                xtype: 'textarea',
                fieldLabel: 'Series Data',
                hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
                name: 'seriesData'
            }]
        }, {
            title: 'User Criteria',
            layout: 'fit',
            items: [{ xtype: 'userCriteriaContainer'}]
        }]
    }],
    buttons: [{
        text: 'Apply', //Dynamically set in DashboardWizardController.js
        formBind: true,
        itemId: 'applyBtn'
    }, {
        text: 'Close',
        handler: function () {
            this.up('form').down('previewGrid').destroy();
            this.up('form').close();
        }
    }]
});