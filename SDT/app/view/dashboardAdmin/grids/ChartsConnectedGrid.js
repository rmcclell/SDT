Ext.define('SDT.view.dashboardAdmin.grids.ChartsConnectedGrid', {
    extend: 'SDT.view.dashboardAdmin.grids.ChartsGrid',
    requires: [
        'SDT.view.dashboardAdmin.grids.columns.ChartsActions'
    ],
    alias: 'widget.chartsConnectedGrid',
    columns: [{
        xtype: 'chartsActions',
        width: 50
    }, {
        text: 'Type',
        dataIndex: 'type',
        width: 110,
        renderer: function (val) {
            var tpl = Ext.create('Ext.Template', '<img class="x-grid-cell-icon {iconCls}" data-qtip="{chartType}" src="{spacer}"><span style="padding-left:15px;">{chartType}</span>', { compiled: true, disableFormats: true });

            if (val === 'pieChart') {
                return tpl.apply({ iconCls: 'icon-chart_pie', chartType: 'Pie Chart', spacer: Ext.BLANK_IMAGE_URL });
            } else if (val === 'columnChart') {
                return tpl.apply({ iconCls: 'icon-chart_column', chartType: 'Column Chart', spacer: Ext.BLANK_IMAGE_URL });
            } else {
                return tpl.apply({ iconCls: 'icon-chart_bar', chartType: 'Bar Chart', spacer: Ext.BLANK_IMAGE_URL });
            }
        }
    }, {
        text: 'Data Source',
        dataIndex: 'dataSource',
        width: 80,
        align: 'center',
        renderer: function (val) {
            if (val === 'FacetQuery') {
                return 'Query';
            } else {
                return 'Field';
            }
        }
    }, {
        text: 'Title',
        dataIndex: 'title',
        flex: 1
    }, {
        text: 'Field Label',
        dataIndex: 'fieldLabel',
        flex: 1
    }, {
        text: 'Field Name',
        dataIndex: 'fieldName',
        flex: 1
    }, {
        text: 'Facet Query',
        dataIndex: 'facetQuery',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        flex: 1
    }, {
        text: 'Facet Field',
        dataIndex: 'facetField',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        flex: 1
    }, {
        text: 'Chart Id',
        dataIndex: 'chartid',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        flex: 1
    }, {
        text: 'Series Data',
        dataIndex: 'seriesData',
        hidden: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        menuDisabled: SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD,
        hideable: (!SDT.util.GLOBALS.DEBUG_DASHBOARD_WIZARD),
        flex: 1,
        renderer: function (val) {
            return Ext.isEmpty(val) ? '' : Ext.encode(val);
        }
    }]
});